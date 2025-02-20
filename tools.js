const fs = require('fs').promises;

const inputFile = 'data/spomeniks2.json';
const outputFile = 'spomeniks2.json';

async function transformJson() {
    const data = await fs.readFile(inputFile, 'utf8');
    const jsonArray = JSON.parse(data);
    
    const transformedArray = jsonArray.map(obj => {
        if (obj.website.includes('google'))
        delete obj.website
        return obj
    });
    
    await fs.writeFile(outputFile, JSON.stringify(transformedArray, null, 2), 'utf8');
    console.log('Transformisani podaci su sačuvani u', outputFile);
}

transformJson();
