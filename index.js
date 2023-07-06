import {
  lstatSync,
  readdirSync,
  readFile as readFileCallback,
} from 'node:fs';

import * as path from 'path';

import axios from 'axios';

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

const extractLinks = (data, file) => {
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
      .then((data) => (extractLinks(data, file)))
      .catch((error) => {
        console.log(error.message);
      });
  });
  return Promise.all(promises)
    .then((results) => results.flat())
    .catch((error) => {
      console.log(error.message);
    });
};

const requestHttp = (httpLink, doc) => {
  return new Promise((resolve, reject) => {
    axios.get(httpLink)
      .then((resp) => {
        const statusCode = resp.status;
        let msg = '';
        statusCode > 399 ? msg = 'Fail!' : msg = 'Ok!';
        doc.statusCode = statusCode;
        doc.msg = msg;
        resolve(doc);
      })
      .catch((error) => {
        if (error.code === 'ENOTFOUND') {
          doc.statusCode = 404; // Not Found
          doc.msg = 'Not Found';
          resolve(doc);
        } else {
          console.log(error.message);
          reject(error);
        }
      });
  });
}

const validateLinks = (files) => {
  let response = []
  const validatePromise = (files) => {
    return new Promise((resolve, reject) => {
      readFileAndExtractLinks(files)
        .then((docs) => {
          response = docs.map((doc) => requestHttp(doc.url, doc));
          resolve(response);
        })
        .catch((error) => {
          console.log(error.message);
          reject(error)
        });
    })
  }
  const httpPromises = validatePromise(files);
  return Promise.all([httpPromises])
    .then(() => Promise.all(response))
    .then((results) => results.flat())
    .catch((error) => {
      console.log(error.message);
    });
}

const statsLink = (files) => {
  return new Promise((resolve, reject) => {
    validateLinks(files)
      .then((file) => {
        const total = file.length
        const links = file.map((doc) => doc.url);
        const unique = new Set(links).size;
        file.push({
          total},
         { unique
        })
        resolve(file)
      })
      .catch((error) => {
        console.log(error.message)
        reject(error)
      })
  })
}

const brokenLinks = (files) => {
  return new Promise((resolve, reject) => {
    statsLink(files)
    .then((file) => {
      const brokenUrls = file.filter((doc) => doc.statusCode > 399);
      const broken = brokenUrls.length;
      file.filter((doc) => {
        if(doc.unique){
          doc.unique -= broken;
        }
      })
      file.push({
        broken,
      })
      resolve(file);
    }).catch((error) => {
      console.log(error.message);
      reject(error);
    })
  })
}


export const mdLinks = (folderPath, options) => {
  const files = isFolder(folderPath) ? getAllFiles(folderPath, []) : [folderPath];
  if (options.validate && options.stats) {
    return brokenLinks(files);
  } else if (options.stats) {
    return statsLink(files);
  } else if (options.validate) {
    return validateLinks(files);
  }
  return readFileAndExtractLinks(files);
};
