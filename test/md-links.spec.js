import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import axios from 'axios';

import {
  lstatSync,
  readdirSync,
  readFile as readFileCallback,
} from 'node:fs';

import {
  extractLinks,
  getAllFiles,
  isFolder,
  isDotMd,
  readFile,
  requestHttp,
  readFileAndExtractLinks,
  //mdLinks,
} from '../index.js';

jest.mock('node:fs');
jest.mock('axios');

/*
const options = {
  validate: false,
  stats: false,
};
*/

describe('mdLinks', () => {
  describe('isFolder', () => {
    it('Deveria retornar true se a path recebida for do tipo Pasta/Diretório', () => {
      lstatSync.mockImplementation(() => ({ isDirectory: jest.fn(() => true) }));
      const result = isFolder('./target_dir');
      expect(result).toBe(true);
    });
    it('Deveria retornar false se a path recebida for do tipo Arquivo', () => {
      lstatSync.mockImplementation(() => ({ isDirectory: jest.fn(() => false) }));
      const result = isFolder('./target_dir/file.md');
      expect(result).toBe(false);
    });
  });
  describe('isDotMd', () => {
    it('Deveria retornar true se a path recebida terminar com a extensão .md', () => {
      const result = isDotMd('./target_dir/file.md');
      expect(result).toBe(true);
    });
    it('Deveria retornar false se a path recebida for um diretório', () => {
      const result = isDotMd('./target_dir');
      expect(result).toBe(false);
    });
  });
  //teste com falha
  describe('getAllFiles', () => {
    it('Deveria retornar todos os diretórios de uma path relativa', () => {
      readdirSync.mockReturnValue([
        'child_dir',
        'doc.md',
        'file.md',
        'file1.txt',
        'file2.html',
        'fileTest.md'
      ]);
      const arrayOfFiles = [
        'target_dir\\child_dir\\doc2.md',
        'target_dir\\child_dir\\test_dir\\abc.md',
        'target_dir\\doc.md',
        'target_dir\\file.md',
        'target_dir\\file1.txt',
        'target_dir\\file2.html',
        'target_dir\\fileTest.md'

      ];
      const result = getAllFiles('./target_dir', []);
      expect(result).toEqual(arrayOfFiles);
    });
  });
  describe('extractLinks', () => {
    it('Deveria extrair os links de dentro dos arquivos lidos', () => {
      const data = `
        [Markdown](https://pt.wikipedia.org/wiki/Markdown) é uma linguagem de marcação
        muito popular entre os programadores. É usada em muitas plataformas que
        manipulam texto (GitHub, fórum, blogs e etc) e é muito comum encontrar arquivos
        com este formato em qualquer repositório (começando pelo tradicional
        README.md).`;
      const file = 'target_dir\\file.md';
      const resultExpect = [
        {
          file: 'target_dir\\file.md',
          label: 'Markdown',
          url: 'https://pt.wikipedia.org/wiki/Markdown'
        }
      ];
      const result = extractLinks(data, file);
      expect(result).toStrictEqual(resultExpect);
    });
  });
  // não passa no if
  describe('readFile', () => {
    it('Deveria ler um arquivo retornando o conteúdo de dentro dele', () => {
      readFileCallback.mockResolvedValue();
      readFile('./target_dir/file.md');
      expect(readFileCallback).toBeCalledTimes(1);
    });
    /*
    it('', () => {
      readFileCallback.mockRejectedValue(new Error('Erro ao ler arquivo'));
      try {
        readFile('./target_dir/file.md');
      } catch (e) {
        expect(e.message).toEqual('Erro ao ler arquivo');
      }
    });
    */
  });
  //teste incompleto, não passou no if
  describe('requestHttp', () => {
    it('Deveria fazer requisções nos links encontrados', async () => {
      const doc = {};
      axios.get.mockResolvedValue('https://pt.wikipedia.org/wiki/Markdown');
      await requestHttp('https://pt.wikipedia.org/wiki/Markdown', doc);
      expect(axios.get).toBeCalled();
    });
    it('Deveria retornar um erro ao tentar ler um link que não existe', async () => {
      const doc = {};
      axios.get.mockRejectedValue(new Error('ENOTFOUND'));
      try {
        await requestHttp('https://pt.wikipppppppppppppg/wiki/Markdown', doc);
      } catch (e) {
        expect(e.message).toEqual('ENOTFOUND');
      }
    });
  });
  describe('readFileAndExtractLinks', () => {
    it('', async () => {
      const pathFiles = [
        'D:/Helouise/CursosEUniversidades/Laboratoria/projetos/cardValidation/SAP010-card-validation/README.md',
      ];
      const resultExpect = [
        {
          file: 'target_dir\\child_dir\\test_dir\\abc.md',
          label: 'Sobre Node.js - Documentação oficial',
          url: 'https://nodejs.org/pt-br/about/'
        },
        {
          file: 'target_dir\\child_dir\\test_dir\\abc.md',
          label: 'Node.js file system - Documentação oficial',
          url: 'https://nodejs.org/api/fs.html'
        },
        {
          file: 'target_dir\\child_dir\\test_dir\\abc.md',
          label: 'Node.js http.get - Documentação\r\n  oficial',
          url: 'https://nodejs.org/api/http.html#http_http_get_options_callback'
        },
        {
          file: 'target_dir\\file.md',
          label: 'Markdown',
          url: 'https://pt.wikipedia.org/wiki/Markdown'
        },
        {
          file: 'target_dir\\file.md',
          label: 'Markdown',
          url: 'https://pt.wikipppppppppppppg/wiki/Markdown'
        }
      ];
      const result = await readFileAndExtractLinks(pathFiles);
      expect(result).toEqual(resultExpect);
    });
  });
});
