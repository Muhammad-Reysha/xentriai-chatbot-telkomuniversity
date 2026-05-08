import fs from 'fs';
import path from 'path';

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/#101415/g, '#07122C');
    content = content.replace(/#272a2c/g, '#0B1938');
    content = content.replace(/#1d2022/g, '#0B1938');
    content = content.replace(/#6fd7d6/g, '#2AA086');
    content = content.replace(/#003737/g, '#FFFFFF');
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Done replacing colors.');
