#! /usr/bin/env node

import { mdLinks } from './index.js';
import { argv } from 'node:process';

const [, , path, optionsArgv] = argv;

const checkOptions = (optionsArgv) => {
  switch (optionsArgv) {
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

const options = checkOptions(optionsArgv);

mdLinks(path, options)
  .then((files) => {
   files.forEach((file) => console.log(file))
  })
  .catch((error) => console.log(error.message));
