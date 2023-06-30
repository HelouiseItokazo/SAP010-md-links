#! /usr/bin/env node
import './mod.js';

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

export const mdLinks = (folderPath) => {
  try {
    const directoryTree = getAllFiles(folderPath, []);
    const files = directoryTree.filter((doc) => typeof doc === 'string');
    const fullLinkOnlyRegex = /\[([^\[]+)\](\(.*\))/gm;
    return new Promise((resolve, reject) => {
      files.forEach((file) => {
        if (isDotMd(file)) {
          readFile(file, 'utf8', (error, data) => {
            if (error) {
              reject(console.log(error.message));
            } else {
              const matchFullLink = [...data.matchAll(fullLinkOnlyRegex)];
              const links = []
              matchFullLink.forEach((dataFile) => {
                const text = dataFile[1];
                const url = dataFile[2].replace(/[\(\)']+/g, '');
                const objFile = {
                  file,
                  text,
                  url,
                }
                links.push(objFile);
              })
              resolve(links);
            }
          });
        }
      })
    });
  } catch (error) {
    console.log(error.message);
  }
}

/*
for (const data in links) {
  let printFile = links[data].file.substring(0, 51);
  // printFile = printFile.substring(0, 51);
  let printText = links[data].text.substring(0, 51);
  // printText = printText.substring(0, 51);
  let printUrl = links[data].url.substring(0, 51);
  // printUrl = printUrl.substring(0, 51);
  const printData = `${printFile}  ${printText}  ${printUrl}`;
  console.log(printData);
}
*/
