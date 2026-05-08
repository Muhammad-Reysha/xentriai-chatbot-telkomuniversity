import fs from 'fs';
import path from 'path';

const replacements: Record<string, string> = {
  '\\[#07122C\\]': 'bg-deep',
  '\\[#0B1938\\]': 'surface-dark',
  '\\[#e0e3e5\\]': 'text-bright',
  '\\[#bcc9c8\\]': 'text-dim',
  '\\[#2AA086\\]': 'primary-teal',
  '\\[#68E6A8\\]': 'primary-teal-light'
};

function walk(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(key, 'g');
    content = content.replace(regex, value);
  }
  fs.writeFileSync(file, content);
});
console.log('Replaced colors');
