import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT_DIR, 'public', 'ROYALPETTS LIVE CONECT');
const DEST_DIR = path.join(ROOT_DIR, 'public', 'gallery_optimized');
const DATA_FILE = path.join(ROOT_DIR, 'src', 'data', 'gallery_pets.json');

const COLORS = ["#ff7db2", "#32f4bb", "#fe9e5b", "#00b9ec", "#ffea20"];
const SUBTITLES = ["Royal Star", "Puppy Love", "Best Friend", "Cute & Wild", "Rockstar"];

// Ensure dest dir exists
if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

let pets = [];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await processDirectory(fullPath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {

                // Breed name is the parent folder name
                const breed = path.basename(dir);
                const filename = path.basename(file, ext);
                const destFilename = `${filename}.webp`;
                const destPath = path.join(DEST_DIR, destFilename);

                try {
                    console.log(`Processing: ${file}`);

                    await sharp(fullPath)
                        .resize({ width: 800, withoutEnlargement: true })
                        .webp({ quality: 80 })
                        .toFile(destPath);

                    pets.push({
                        title: breed, // Use Folder Name as Title
                        subtitle: getRandomItem(SUBTITLES),
                        color: getRandomItem(COLORS),
                        image: `/gallery_optimized/${destFilename}`
                    });

                } catch (err) {
                    console.error(`Error processing ${file}:`, err);
                }
            }
        }
    }
}

async function main() {
    console.log("Starting Image Optimization...");
    await processDirectory(SOURCE_DIR);

    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(pets, null, 2));
    console.log(`Done! Processed ${pets.length} images.`);
    console.log(`Data saved to ${DATA_FILE}`);
}

main();
