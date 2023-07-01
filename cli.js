#! /usr/bin/env node

import { mdLinks } from "./index.js";
import { argv } from 'node:process';

const [, , path] = argv;

mdLinks(path)
  .then((files) => {
    console.log('-------------------------------------------------------------------------');
    console.log('ESTOU NO CLI ');
    console.log('RECEBI O PARAMETRO ' + path);

    console.log(files);
    /*
    for (const data in files) {
      const printFile = files[data].path;
      const printText = files[data].text.substring(0, 51);
      const printUrl = files[data].url;
      const printData = `${printFile}  ${printText}  ${printUrl}`;
      console.log(printData);
    }
    */
    console.log('SAÍ DO CLI ');
    console.log('-------------------------------------------------------------------------');
  })
  .catch((error) => console.log(error.message));
