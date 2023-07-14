#! /usr/bin/env node

import { mdLinks } from './index.js';
import { argv } from 'node:process';
import chalk from 'chalk';

const [, , path, optionsArgv] = argv;

if (argv.includes('--validate') && argv.includes('--stats')) {
  mdLinks(path, { validate: true, stats: true })
    .then((files) => {
      if (files.length === 3) {
        console.log('O Arquivo não pode ser lido!');
        console.log('Verifique se a extensão é .md');
      } else {
        for (let i = 0; i < files.length; i++) {
          if (i <= files.length - 4) {
            console.log(chalk.bold.magenta('Path:  ') + chalk.magenta(files[i].file));
            console.log(chalk.bold.yellow('About: ') + chalk.yellow(files[i].label));
            console.log(chalk.bold.blueBright('Link:  ') + chalk.underline.blueBright(files[i].url));
            console.log(chalk.bold.greenBright('Status:  ') + chalk.underline.greenBright(files[i].statusCode));
            console.log(chalk.bold.gray('Msg:  ') + chalk.underline.gray(files[i].msg) + '\n\n');
          } else if (i > files.length - 4 && i < files.length - 2) {
            console.log(chalk.bold.green('Total:  ') + chalk.green(files[i].total));
          } else if (i > files.length - 3 && i < files.length - 1) {
            console.log(chalk.bold.gray('Unique: ') + chalk.gray(files[i].unique));
          } else {
            console.log(chalk.bold.red('Broken: ') + chalk.red(files[i].broken));
          }
        }
      }
    })
    .catch((error) => console.log(error.message));
} else if (optionsArgv === '--validate') {
  mdLinks(path, { validate: true })
    .then((files) => {
      files.forEach((file) => {
        if (file.statusCode > 399) {
          console.log(chalk.bold.italic.magentaBright('Path:    ') + chalk.magenta(file.file));
          console.log(chalk.bold.italic('Label:   ') + chalk.yellow(file.label));
          console.log(chalk.bold.italic.blueBright('Link:    ') + chalk.underline.blue(file.url));
          console.log(chalk.bold.italic.redBright('Status:  ') + chalk.red(file.statusCode));
          console.log(chalk.bold.italic.grey('Msg:     ') + chalk.red(file.msg) + '\n\n');
        } else {
          console.log(chalk.bold.italic.magentaBright('Path:    ') + chalk.magenta(file.file));
          console.log(chalk.bold.italic('Label:   ') + chalk.yellow(file.label));
          console.log(chalk.bold.italic.blueBright('Link:    ') + chalk.underline.blue(file.url));
          console.log(chalk.bold.italic.greenBright('Status:  ') + chalk.green(file.statusCode));
          console.log(chalk.bold.italic.gray('Msg:     ') + chalk.gray(file.msg) + '\n\n');
        }
      });
    })
    .catch((error) => console.log(error.message));
} else if (optionsArgv === '--stats') {
  mdLinks(path, { stats: true })
    .then((files) => {
      if (files.length === 2) {
        console.log('O Arquivo não pode ser lido!');
        console.log('Verifique se a extensão é .md');
      } else {
        for (let i = 0; i < files.length; i++) {
          if (i <= files.length - 3) {
            console.log(chalk.bold.magenta('Path:  ') + chalk.magenta(files[i].file));
            console.log(chalk.bold.yellow('About: ') + chalk.yellow(files[i].label));
            console.log(chalk.bold.blueBright('Link:  ') + chalk.underline.blueBright(files[i].url));
            console.log(chalk.bold.greenBright('Status:  ') + chalk.underline.greenBright(files[i].statusCode));
            console.log(chalk.bold.gray('Msg:  ') + chalk.underline.gray(files[i].msg) + '\n\n');
          } else if (i > files.length - 3 && i < files.length - 1) {
            console.log(chalk.bold.green('Total:  ') + chalk.green(files[i].total));
          } else if (i > files.length - 2) {
            console.log(chalk.bold.gray('Unique: ') + chalk.gray(files[i].unique));
          }
        }
      }
    })
    .catch((error) => console.log(error.message));
} else if (path) {
  mdLinks(path, { validate: false, stats: false })
    .then((files) => {
      files.forEach((file) => {
        console.log(chalk.bold.magenta('Path:  ') + chalk.magenta(file.file));
        console.log(chalk.bold.yellow('Label: ') + chalk.yellow(file.label));
        console.log(chalk.bold.green('Link:  ') + chalk.underline.green(file.url) + '\n\n');
      });
    })
    .catch((error) => console.log(error.message));
}
