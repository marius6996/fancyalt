//utils/cleanup.js

//deletes all files in the uploads/ directory to prevent buildup
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

function cleanUploadsFolder() {
    if (!fs.existsSync(UPLOADS_DIR)) return;

    const files = fs.readdirSync(UPLOADS_DIR);
    for (const file of files) {
        const filePath = path.join(UPLOADS_DIR, file);
        try {
            fs.unlinkSync(filePath);
            console.log(`Deleted leftover file: ${file}`);
        } catch (err) {
            console.warn(`Failed to delete ${file}:`, err.message);
        }
    }
}

module.exports = cleanUploadsFolder;

