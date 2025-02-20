const fs = require('fs').promises;

const inputFile = 'spomeniks.json';
const outputFile = 'spomeniks2.json';

async function transformJson() {
    const data = await fs.readFile(inputFile, 'utf8');
    const jsonArray = JSON.parse(data);
    
    const transformedArray = jsonArray.map(obj => ({
        ...obj,
        modal: obj.modal ? obj.modal.replace(/ style="[^"]*"/g, '') : obj.modal
    }));
    
    await fs.writeFile(outputFile, JSON.stringify(transformedArray, null, 2), 'utf8');
    console.log('Transformisani podaci su sačuvani u', outputFile);
}

transformJson();
