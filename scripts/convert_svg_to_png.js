import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple SVG to PNG converter using sharp
async function convertSvgToPng() {
    try {
        const svgPath = path.join(__dirname, '../public/fondo_home3.svg');
        const pngPath = path.join(__dirname, '../public/fondo_home3.png');

        await sharp(svgPath)
            .png()
            .toFile(pngPath);

        console.log('✅ Convertido exitosamente: fondo_home3.png');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

convertSvgToPng();
