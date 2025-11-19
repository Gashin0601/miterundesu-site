const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// First compile TypeScript to temporary directory
const { execSync } = require('child_process');

console.log('Compiling TypeScript...');
execSync('tsc --project tsconfig.frontend.json', { stdio: 'inherit' });

// Bundle all JS files from public/js into a single bundle
console.log('Bundling with esbuild...');

// Get all .js files in public/js
const jsDir = path.join(__dirname, 'public', 'js');
const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js') && !file.endsWith('.bundle.js'));

// Bundle each file
for (const file of jsFiles) {
  const inputPath = path.join(jsDir, file);
  const outputPath = path.join(jsDir, file.replace('.js', '.bundle.js'));

  esbuild.buildSync({
    entryPoints: [inputPath],
    bundle: false,  // Don't bundle dependencies, just convert format
    format: 'esm',  // Output as ES modules
    platform: 'browser',
    target: 'es2020',
    outfile: outputPath,
    sourcemap: true,
  });

  // Replace original file with bundled version
  fs.unlinkSync(inputPath);
  fs.renameSync(outputPath, inputPath);
  console.log(`Processed: ${file}`);
}

console.log('Frontend build complete!');
