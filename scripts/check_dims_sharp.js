import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkDims() {
    try {
        const metadata = await sharp(path.join(__dirname, '../public/fondo_landing.webp')).metadata();
        console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
    } catch (error) {
        console.error(error);
    }
}

checkDims();
