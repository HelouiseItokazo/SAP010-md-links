#! /usr/bin/env node
"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mdLinks = void 0;
require("core-js/modules/es.promise.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.match-all.js");
require("core-js/modules/es.string.replace.js");
require("./mod.js");
var _nodeFs = require("node:fs");
var path = _interopRequireWildcard(require("path"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const isFolder = dirPath => {
  return (0, _nodeFs.lstatSync)(dirPath).isDirectory();
};
const isDotMd = fileName => {
  return path.extname(fileName) === '.md';
};
const getAllFiles = (dirPath, arrayOfFiles) => {
  try {
    const files = (0, _nodeFs.readdirSync)(dirPath);
    files.forEach(fileName => {
      const fullPath = path.join(dirPath, fileName);
      isFolder(fullPath) ? arrayOfFiles.push(getAllFiles(fullPath, arrayOfFiles)) : arrayOfFiles.push(fullPath);
    });
    return arrayOfFiles;
  } catch (error) {
    console.log(error.message);
  }
};
const mdLinks = folderPath => {
  try {
    const directoryTree = getAllFiles(folderPath, []);
    const files = directoryTree.filter(doc => typeof doc === 'string');
    const fullLinkOnlyRegex = /\[([^\[]+)\](\(.*\))/gm;
    return new Promise((resolve, reject) => {
      files.forEach(file => {
        if (isDotMd(file)) {
          (0, _nodeFs.readFile)(file, 'utf8', (error, data) => {
            if (error) {
              reject(console.log(error.message));
            } else {
              const matchFullLink = [...data.matchAll(fullLinkOnlyRegex)];
              const links = [];
              matchFullLink.forEach(dataFile => {
                const text = dataFile[1];
                const url = dataFile[2].replace(/[\(\)']+/g, '');
                const objFile = {
                  file,
                  text,
                  url
                };
                links.push(objFile);
              });
              resolve(links);
            }
          });
        }
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

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
exports.mdLinks = mdLinks;