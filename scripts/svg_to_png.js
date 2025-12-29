
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../public/mobile_bg.svg');
const outputPath = path.join(__dirname, '../public/mobile_bg.png');

console.log(`Reading from: ${inputPath}`);
console.log(`Writing to: ${outputPath}`);

if (!fs.existsSync(inputPath)) {
    console.error('Input file does not exist!');
    process.exit(1);
}

sharp(inputPath)
    .resize(1080) // Standard mobile width, height auto
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(outputPath)
    .then(info => {
        console.log('Conversion successful:', info);
    })
    .catch(err => {
        console.error('Error converting file:', err);
        process.exit(1);
    });
