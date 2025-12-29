
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../public/mobile_bg.svg');
const outputPath = path.join(__dirname, '../public/mobile_bg.webp');

console.log(`Converting ${inputPath} to ${outputPath}...`);

sharp(inputPath)
    .resize(1080) // Standard mobile width
    .webp({ quality: 90 }) // High quality
    .toFile(outputPath)
    .then(info => {
        console.log('Conversion successful:', info);
    })
    .catch(err => {
        console.error('Error converting file:', err);
    });
