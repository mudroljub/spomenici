const fs = require('fs').promises;

const inputFile = 'spomeniks.json';
const outputFile = 'spomeniks2.json';

async function transformJson() {
    const data = await fs.readFile(inputFile, 'utf8');
    const jsonArray = JSON.parse(data);
    
    const transformedArray = jsonArray.map(obj => ({
        ...obj,
        koordinate: obj.koordinate && obj.koordinate.length > 0 ? 
            { lat: obj.koordinate[0][0], lng: obj.koordinate[0][1] } : null
    }));
    
    await fs.writeFile(outputFile, JSON.stringify(transformedArray, null, 2), 'utf8');
    console.log('Transformisani podaci su sačuvani u', outputFile);
}

transformJson();
