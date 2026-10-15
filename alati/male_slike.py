# pravi male slike za traku na dnu (slike/male/<id>.webp, visine 116 px, dvostruko od prikazane) za slike koje ih nemaju
# ili su posle male menjane, i brise male bez velike; metapodaci (EXIF, ICC, XMP) se izbacuju, jer cesto zauzimaju vise od same slike
# pokretanje iz korena repozitorijuma: python -I alati/male_slike.py
import os, subprocess, tempfile

VELIKE, MALE = 'slike/spomenici', 'slike/male'
os.makedirs(MALE, exist_ok=True)

posao = [f for f in os.listdir(VELIKE)
         if not os.path.exists(f'{MALE}/{f}') or os.path.getmtime(f'{VELIKE}/{f}') > os.path.getmtime(f'{MALE}/{f}')]
if posao:
    # spisak ide kroz fajl, jer hiljade putanja ne staje u komandnu liniju
    with tempfile.NamedTemporaryFile('w', suffix='.txt', delete=False, encoding='utf8') as spisak:
        spisak.write('\n'.join(f'{VELIKE}/{f}' for f in posao))
    subprocess.run(['magick', 'mogrify', '-path', MALE, '-strip', '-resize', 'x116', '-quality', '70', f'@{spisak.name}'], check=True)
    os.remove(spisak.name)

visak = set(os.listdir(MALE)) - set(os.listdir(VELIKE))
for f in visak:
    os.remove(f'{MALE}/{f}')
print('napravljeno', len(posao), 'obrisano', len(visak))
