import {
  lstatSync,
  readdirSync,
  readFile,
} from 'node:fs';

// import axios from 'axios';

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
      // console.log(fileName)
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
        console.log(objFile)
        resolve(objFile);
      })
      .catch((error) => {
        console.log('hhhhhhhhhhhhhhhhhhhh')
        console.log(error.message);
        reject(error);
      });
  });
}
*/
/*
const requestHttp = (httpLink, objFile) => {
  const array = [httpLink];
  const requestHttpPromise = (link) => {
    return new Promise((resolve, reject) => {
      axios.get(link)
        .then((resp) => {
          const statusCode = resp.status;
          let msg = '';
          statusCode > 399 ? msg = 'Fail!' : msg = 'Ok!'
          objFile.statusCode = statusCode;
          objFile.msg = msg;
          console.log(objFile)
          resolve(objFile);
        })
        .catch((error) => {
          console.log(error.message);
          reject(error);
        });
    });
  }
  const promisesHttp = array.map((a) => requestHttpPromise(a));

  return Promise.all(promisesHttp)
  .then(() => objFile)
  .catch((error) => console.log(error.message))

}

*/

const readContentFile = (pathFile) => {
  const fullLinkOnlyRegex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const filesDotMd = pathFile.filter(isDotMd);
  // console.log(filesDotMd)
  const links = [];
  const readFilePromise = (file) => {
    return new Promise((resolve, reject) => {
      readFile(file, 'utf8', (error, data) => {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        const matchFullLink = [...data.matchAll(fullLinkOnlyRegex)];
        matchFullLink.forEach((data) => {
          const label = data[1].substring(0, 51);
          const url = data[2];
          const objFile = {
            path: file,
            label,
            url,
          }
          /*
          const httpPromise = requestHttp(url, objFile);
          httpPromises.push(httpPromise);
          */
          links.push(objFile);
        })
        // resolve aquiii aaaaaaaaaaaaaaaahhhhhh odioooooooooo
        resolve();
      });
    });
  };
  // const httpPromises = [];
  const promises = filesDotMd.map((file) => readFilePromise(file));

  return Promise.all(promises)
    //.then(() => Promise.all(httpPromises))
    .then(() => links)
    .catch((error) => {
      console.log(error.message);
    });
}



export const mdLinks = (folderPath, options) => {
  const isPathFolder = isFolder(folderPath);
  // checkOptions(options);
  console.log(typeof options);
  if (isPathFolder) {
    console.log(isPathFolder)
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
  } else {
    return new Promise((resolve, reject) => {
      readContentFile([folderPath])
        .then((links) => {
          resolve(links);
        })
        .catch((error) => {
          console.log(error.message);
          reject(error);
        });
    })
  }
}
