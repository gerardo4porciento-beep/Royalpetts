import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeBackground() {
    try {
        const inputPath = path.join(__dirname, '../public/fondo todo el landing.png');
        const outputPath = path.join(__dirname, '../public/fondo_landing.webp');

        await sharp(inputPath)
            .webp({ quality: 85, effort: 6 })
            .toFile(outputPath);

        console.log('✅ Imagen optimizada: fondo_landing.webp');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

optimizeBackground();
