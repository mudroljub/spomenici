const fs = require('fs').promises;

const inputFile = 'data/spomeniks.json';
const outputFile = 'spomeniks2.json';

async function transformJson() {
    const data = await fs.readFile(inputFile, 'utf8');
    const jsonArray = JSON.parse(data);
    
    const transformedArray = jsonArray.map(obj => {
        const infoMatch = obj.modal ? obj.modal.match(/<a href="(.*?)"/) : null;
        const slikaMatch = obj.modal ? obj.modal.match(/<img src="(.*?)"/) : null;
        const nameMatch = obj.modal ? obj.modal.match(/<b>Name<\/b>: (.*?)<\/p>/) : null;

        delete obj.modal
        
        return {
            ...obj,
            info: infoMatch ? infoMatch[1] : null,
            slika: slikaMatch ? slikaMatch[1] : null,
            name: nameMatch ? nameMatch[1] : null
        };
    });
    
    await fs.writeFile(outputFile, JSON.stringify(transformedArray, null, 2), 'utf8');
    console.log('Transformisani podaci su sačuvani u', outputFile);
}

transformJson();
