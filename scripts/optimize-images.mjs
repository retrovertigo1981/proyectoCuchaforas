import sharp from 'sharp';
import { optimize } from 'svgo';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const IMG_DIR = './src/assets/img';
const PUBLIC_DIR = './public';

async function optimizeImages() {
  const files = readdirSync(IMG_DIR);
  
  for (const file of files) {
    const filePath = join(IMG_DIR, file);
    const stat = statSync(filePath);
    if (!stat.isFile()) continue;
    
    const ext = extname(file).toLowerCase();
    const originalSize = stat.size;
    
    if (ext === '.svg') {
      const svgContent = readFileSync(filePath, 'utf8');
      const result = optimize(svgContent, {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      });
      writeFileSync(filePath, result.data);
      const newSize = Buffer.byteLength(result.data);
      console.log(`SVG: ${file} ${(originalSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB (${((1 - newSize/originalSize) * 100).toFixed(1)}% reduction)`);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(filePath)
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(filePath + '.tmp');
      const { writeFileSync: wf, unlinkSync } = await import('fs');
      const { renameSync } = await import('fs');
      const tmpPath = filePath + '.tmp';
      renameSync(tmpPath, filePath);
      const newSize = statSync(filePath).size;
      console.log(`JPG: ${file} ${(originalSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB (${((1 - newSize/originalSize) * 100).toFixed(1)}% reduction)`);
    } else if (ext === '.png') {
      await sharp(filePath)
        .png({ quality: 80, compressionLevel: 9 })
        .toFile(filePath + '.tmp');
      const { renameSync } = await import('fs');
      const tmpPath = filePath + '.tmp';
      renameSync(tmpPath, filePath);
      const newSize = statSync(filePath).size;
      console.log(`PNG: ${file} ${(originalSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB (${((1 - newSize/originalSize) * 100).toFixed(1)}% reduction)`);
    }
  }
  
  const faviconPath = join(PUBLIC_DIR, 'favicon.png');
  const faviconStat = statSync(faviconPath);
  const faviconOriginalSize = faviconStat.size;
  await sharp(faviconPath)
    .resize(32, 32)
    .png({ compressionLevel: 9 })
    .toFile(faviconPath + '.tmp');
  const { renameSync } = await import('fs');
  renameSync(faviconPath + '.tmp', faviconPath);
  const faviconNewSize = statSync(faviconPath).size;
  console.log(`FAVICON: favicon.png ${(faviconOriginalSize/1024).toFixed(1)}KB -> ${(faviconNewSize/1024).toFixed(1)}KB (${((1 - faviconNewSize/faviconOriginalSize) * 100).toFixed(1)}% reduction)`);
}

optimizeImages().catch(console.error);
