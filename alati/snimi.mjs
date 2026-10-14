// node snimi.mjs <izlaz.png> [js koji se izvrsi pre snimka] [cekanje ms]
import {spawn} from 'node:child_process'
import {writeFileSync, mkdtempSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

const [izlaz, skript = '', cekanje = '3000'] = process.argv.slice(2)
const port = 9300 + Math.floor(Math.random() * 500)
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${port}`, '--disable-gpu', '--hide-scrollbars',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cdp-'))}`, 'about:blank',
], {stdio: 'ignore'})
const sleep = ms => new Promise(r => setTimeout(r, ms))

let tabs
for (let i = 0; i < 50; i++) {
  try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break } catch { await sleep(200) }
}
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl)
await new Promise(r => ws.onopen = r)
let id = 0
const pending = {}
ws.onmessage = e => { const m = JSON.parse(e.data); if (pending[m.id]) { pending[m.id](m); delete pending[m.id] } }
const send = (method, params = {}) => new Promise(r => { pending[++id] = r; ws.send(JSON.stringify({id, method, params})) })

await send('Emulation.setDeviceMetricsOverride', {width: Number(process.env.W || 390), height: Number(process.env.H || 844), deviceScaleFactor: process.env.W ? 1 : 2, mobile: !process.env.W})
await send('Emulation.setTouchEmulationEnabled', {enabled: true})
await send('Emulation.setUserAgentOverride', {userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36'})
await send('Browser.grantPermissions', {permissions: ['geolocation'], origin: 'http://localhost:8765'})
await send('Emulation.setGeolocationOverride', {latitude: 44.80, longitude: 20.46, accuracy: 30})
await send('Page.enable')
await send('Runtime.enable')
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data)
  if (m.method === 'Runtime.exceptionThrown') console.log('EXC', JSON.stringify(m.params.exceptionDetails).slice(0, 400))
  if (m.method === 'Runtime.consoleAPICalled') console.log('CONSOLE', m.params.args.map(a => a.value).join(' '))
})
await send('Page.navigate', {url: 'http://localhost:8765/' + (process.env.HASH || '')})
await sleep(4000)
if (skript) {
  const r = await send('Runtime.evaluate', {expression: skript, awaitPromise: true, returnByValue: true})
  console.log('EVAL', JSON.stringify(r.result?.result?.value ?? r.result))
}
await sleep(Number(cekanje))
const {result} = await send('Page.captureScreenshot', {format: 'png'})
writeFileSync(izlaz, Buffer.from(result.data, 'base64'))
chrome.kill()
process.exit(0)
