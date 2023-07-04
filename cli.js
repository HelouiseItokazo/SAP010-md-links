#! /usr/bin/env node

import { mdLinks } from './index.js';
import { argv } from 'node:process';

const [, , path, optionsArgV] = argv;

const checkOptions = (optionsArgV) => {
  switch (options) {
    case '--validate':
      return {validate: true};
    case '--stats':
      return {stats: true}
    case undefined:
      break;
    default:
    console.log(`Parametros inválidos:
    Tente:
      --validate,
      --stats,
      --validate --stats`);
  }
}

const options = checkOptions(optionsArgV);

mdLinks(path, options)
  .then((files) => {
    console.log(options)
    for (const data in files) {
      const printFile = files[data].path;
      const printText = files[data].label;
      const printUrl = files[data].url;
      const printData = `${printFile}  ${printText}  ${printUrl}`;
      console.log(printData);
    }
  })
  .catch((error) => console.log(error.message));
