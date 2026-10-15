import { mkdir, copyFile, readFile } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'prompt.js', '.nojekyll']) {
  await copyFile(`src/${file}`, `dist/${file}`);
}
const html = await readFile('dist/index.html', 'utf8');
if (!html.includes('name="robots" content="noindex, nofollow, noarchive"')) throw new Error('Missing noindex rule');
for (const file of ['index.html', 'styles.css', 'app.js', 'prompt.js']) {
  const content = await readFile(`dist/${file}`, 'utf8');
  if (/AIza[0-9A-Za-z_-]{20,}/.test(content)) throw new Error(`API key in ${file}`);
}
console.log('Built public static site in dist/ without an API key.');
