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
      if (isFolder(fullPath)) {
        getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });
    return arrayOfFiles;
  } catch (error) {
    console.log(error.message);
  }
}

const readContentFile = (pathFile) => {
  const fullLinkOnlyRegex = /\[([^\[]+)\](\(.*\))/gm;
  const filesDotMd = pathFile.filter(isDotMd);
  const links = [];
  const readFilePromise = (file) => {
    return new Promise((resolve, reject) => {
      readFile(file, 'utf8', (error, data) => {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        const matchFullLink = [...data.matchAll(fullLinkOnlyRegex)];
        matchFullLink.forEach((data)=> {
          const url = data[2].toString().match(/\(([^)]+)\)/);
          const objFile = {
            file,
            label: data[1].substring(0, 51),
            url: url[1]
          }
          links.push(objFile);
        })
        resolve();
      });
    });
  };
  const promises = filesDotMd.map((file) => readFilePromise(file));
  return Promise.all(promises)
    .then(() => links)
    .catch((error) => {
      console.log(error.message);
    });
}

export const mdLinks = (folderPath) => {
  return new Promise((resolve, reject) => {
    const directoryTree = getAllFiles(folderPath, []);
    const pathFile = directoryTree.filter((doc) => typeof doc === 'string');
    readContentFile(pathFile)
      .then((links) => {
        resolve(links);
      })
      .catch((error) => {
        console.log(error.message);
        reject(error);
      });
  });
}
