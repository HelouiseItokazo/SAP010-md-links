import {
  lstatSync,
  readdirSync,
  readFile as readFileCallback,
} from 'node:fs';

import * as path from 'path';

// import axios from 'axios';

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
      isFolder(fullPath) ? getAllFiles(fullPath, arrayOfFiles) : arrayOfFiles.push(fullPath);
    });
    return arrayOfFiles.filter((doc) => typeof doc === 'string');
  } catch (error) {
    console.log(error.message);
  }
}

/*
const requestHttp = (httpLink, objFile) => {
  return new Promise((resolve, reject) => {
    axios.get(httpLink)
      .then((resp) => {
        const statusCode = resp.status;
        let msg = '';
        statusCode > 399 ? msg = 'Fail!' : msg = 'Ok!'
        objFile.statusCode = statusCode;
        objFile.msg = msg;
        resolve(objFile);
      })
      .catch((error) => {
        console.log(error.message);
        reject(error);
      });
  });
}
*/

const extractLinks = (data, file) => {
  console.log(file)
  const fullLinkOnlyRegex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  return [...data.matchAll(fullLinkOnlyRegex)]
  .map((match) => {
      const label = match[1].substring(0, 51);
      const url = match[2];
      return {
        file,
        label,
        url
      }
    })
}

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    readFileCallback(file, 'utf8', (error, data) => {
      if (error) {
        console.log(error.message);
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

const readFileAndExtractLinks = (pathFiles) => {
  const promises = pathFiles.filter(isDotMd).map((file) => {
    return readFile(file)
      .then((data) => extractLinks(data, file))
      .catch((error) => {
        console.log(error.message);
        throw error;
      });
  });
  return Promise.all(promises)
    .then((results) => results.flat())
    .catch((error) => {
      console.log(error.message);
      throw error;
    });
};

export const mdLinks = (folderPath, options) => {
  const files = isFolder(folderPath) ? getAllFiles(folderPath, []) : [folderPath];
  return readFileAndExtractLinks(files);
};
