#! /usr/bin/env node

import { mdLinks } from './index.js';
import { argv } from 'node:process';

const [, , path, optionsArgv] = argv;

const checkOptions = (path, optionsArgv) => {
  const options = {
    validate: false,
    stats: false
  }
  if (optionsArgv === '--validate') {
    options.validate = true;
    mdLinks(path, options)
    .then((files) => {
      console.log('CLI')
      files.forEach((file) => console.log(file))
    })
    .catch((error) => console.log(error.message));
  } else if (optionsArgv === '--stats') {
    options.stats = true;
    mdLinks(path, options).then((files) => console.log('CLI', files))
    .catch((error) => console.log(error.message));
  } else if (path) {
    mdLinks(path, options)
      .then((files) => {
        files.forEach((file) => console.log(file))
      })
      .catch((error) => console.log(error.message));
  }
}

const options = checkOptions(path, optionsArgv);

