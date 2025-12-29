import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getBottomColor() {
    try {
        const image = sharp(path.join(__dirname, '../public/fondo_landing.webp'));
        const metadata = await image.metadata();

        // Extract 1x1 pixel from bottom center
        const stats = await image
            .extract({ left: Math.floor(metadata.width / 2), top: metadata.height - 1, width: 1, height: 1 })
            .raw()
            .toBuffer();

        console.log(`Bottom Color: rgb(${stats[0]}, ${stats[1]}, ${stats[2]})`);
        console.log(`Hex: #${((1 << 24) + (stats[0] << 16) + (stats[1] << 8) + stats[2]).toString(16).slice(1)}`);
    } catch (error) {
        console.error(error);
    }
}

getBottomColor();
