import {
  lstatSync,
  readdirSync,
  readFile,
} from 'node:fs';

import * as path from 'path';

const isFolder = (dirPath) => {
  return lstatSync(dirPath).isDirectory();
}

const isDotMd = (fileName) => {
  return path.extname(fileName) === '.md';
}

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (isFolder(fullPath)) {
      console.log('cai no if')
      arrayOfFiles.push(getAllFiles(fullPath, arrayOfFiles));
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

const mdLinks = (folderPath) => {
  try {
    const directoryTree = getAllFiles(folderPath, []);
    console.log(directoryTree);
    const files = directoryTree.filter((doc) => typeof doc === 'string');
    console.log(files);
    files.forEach((file) => {
      console.log(file);
      console.log(typeof file);
      if (isDotMd(file)) {
        readFile(file, 'utf8', (error, data) => {
          if (error) throw error;
          console.log(`FILE NAME: ${file}`);
          console.log(`CONTENT: ${data}`);
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

mdLinks('target_dir');
