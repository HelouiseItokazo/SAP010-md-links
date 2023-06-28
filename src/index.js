import {
  lstatSync,
  readdirSync,
  readFile,
} from 'node:fs';

import * as path from 'path';

import * as directoryTree from 'directory-tree';

const isFolder = (fileName) => {
  return lstatSync(fileName).isDirectory();
}

const isDotMd = (fileName) => {
  return path.extname(fileName) === '.md';
}

const mdLinks = (folderPath) => {
  try {
    const files = readdirSync(folderPath);
    const sizeTree = files.length;
    console.log(directoryTree);
    console.log(`CHILDREN: ${files}`);
    console.log(`SIZE TREE: ${sizeTree}`);
    //console.log(`TREE: ${dirTree}`);

    children.forEach((fileName) => {
      const fullPath = path.join(folderPath, fileName);
      // Se for outra pasta, leia
      // Dentro dessa pasta existe outra pasta? Se SIM, leia (repita até não haver mais subdiretórios)
      // Dentro dessa pasta existe um arquivo .md? Se SIM, leia
      // Se for um arquivo com extensão .md leia-o
      /*
      if (isFolder(fullPath)) {
        const files = readdirSync(fullPath);
        console.log(`CHILDREN: ${files}`);
        children.forEach((a) => {
          const fullPath2 = path.join(fullPath, a);
          readFile(fullPath2, 'utf8', (err, data) => {
            if (err) throw err;
              console.log(`FILE NAME: ${fileName}`);
              console.log(`CONTENT: ${data}`);
              console.log(`FULL PATH: ${fullPath}`);
          });
        });
        //return mdLinks();
      }
      */
      if (isDotMd(fullPath)) {
        readFile(fullPath, 'utf8', (err, data) => {
          if (err) throw err;
          console.log(`FILE NAME: ${fileName}`);
          console.log(`CONTENT: ${data}`);
          console.log(`FULL PATH: ${fullPath}`);
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

mdLinks('target_dir');


