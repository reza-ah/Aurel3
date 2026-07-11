const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
    try {
        const publicDir = path.join(__dirname, 'public');

        // خواندن فایل‌های PNG
        const png16 = fs.readFileSync(path.join(publicDir, 'favicon-16x16.png'));
        const png32 = fs.readFileSync(path.join(publicDir, 'favicon-32x32.png'));

        // ساخت فایل ICO واقعی
        const buffer = await pngToIco.default([png16, png32]);

        // ذخیره فایل ICO
        fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buffer);

        console.log('✅ Real favicon.ico generated successfully!');
        console.log('📁 File size:', buffer.length, 'bytes');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

generateFavicon();