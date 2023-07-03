#! /usr/bin/env node

import { mdLinks } from "./index.js";
import { argv } from 'node:process';

const [, , path] = argv;

mdLinks(path)
  .then((files) => {
    for (const data in files) {
      const printFile = files[data].path;
      const printText = files[data].label;
      const printUrl = files[data].url;
      const printData = `${printFile}  ${printText}  ${printUrl}`;
      console.log(printData);
    }
  })
  .catch((error) => console.log(error.message));
