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
  try {
    const files = readdirSync(dirPath);
    files.forEach((fileName) => {
      const fullPath = path.join(dirPath, fileName);
      isFolder(fullPath) ? arrayOfFiles.push(getAllFiles(fullPath, arrayOfFiles)) : arrayOfFiles.push(fullPath);
    });
    return arrayOfFiles;
  } catch (error) {
    console.log(error.message);
  }
}

const mdLinks = (folderPath) => {
  try {
    const directoryTree = getAllFiles(folderPath, []);
    const files = directoryTree.filter((doc) => typeof doc === 'string');
    const fullLinkOnlyRegex = /\[([^\[]+)\](\(.*\))/gm;
    console.log(directoryTree);
    console.log(files);
    files.forEach((file) => {
      console.log(file);
      console.log(typeof file);
      if (isDotMd(file)) {
        readFile(file, 'utf8', (error, data) => {
          if (error) throw error;
          const matchFullLink = data.match(fullLinkOnlyRegex);
          console.log(matchFullLink);
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
