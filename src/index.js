import {
  readdirSync,
  readFileSync
} from 'node:fs';

import * as path from 'path';

const children = readdirSync('target_dir');
console.log(`children: ${children}`);
children.forEach((child) => {
  if(path.extname(child) === '.md'){
    const fullPath = path.join('target_dir', child);
    const contentFile = readFileSync(fullPath, 'utf8');
    console.log(`child: ${fullPath}`);
    console.log(`child: ${child}`);
    console.log(`content: ${contentFile}`);
  }
});

