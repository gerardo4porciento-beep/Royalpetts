import sizeOf from 'image-size';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const dimensions = sizeOf(path.join(__dirname, '../public/fondo_landing.webp'));
    console.log(`Dimensions: ${dimensions.width}x${dimensions.height}`);
    console.log(`Aspect Ratio: ${(dimensions.width / dimensions.height).toFixed(2)}`);
} catch (err) {
    console.error(err);
}
