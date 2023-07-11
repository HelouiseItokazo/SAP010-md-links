import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  extractLinks,
  getAllFiles,
  isFolder,
  isDotMd,
  readFile,
  readFileAndExtractLinks,
  mdLinks,
} from '../index.js';

describe('mdLinks', () => {
  describe('isFolder', () => {
    it('Deveria retornar true se a path recebida for do tipo Pasta/Diretório', () => {
      const result = isFolder('./target_dir');
      expect(result).toBe(true);
    });
    it('Deveria retornar false se a path recebida for do tipo Arquivo', () => {
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
  describe('getAllFiles', () => {
    it('Deveria retornar todos os diretórios de uma path relativa', () => {
      const arrayOfFiles = [
        'target_dir\\child_dir\\doc2.md',
        'target_dir\\child_dir\\test_dir\\abc.md',
        'target_dir\\doc.md',
        'target_dir\\file.md',
        'target_dir\\file1.txt',
        'target_dir\\file2.html',
        'target_dir\\fileTest.md',
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
  describe('readFile', () => {
    it('Deveria ler um arquivo retornando o conteúdo de dentro dele', async () => {
      const resultExpect =`ooooooooooooooooooooooooo
[Markdown](https://pt.wikipedia.org/wiki/Markdown) é uma linguagem de marcação
muito popular entre os programadores. É usada em muitas plataformas que
manipulam texto (GitHub, fórum, blogs e etc) e é muito comum encontrar arquivos
com este formato em qualquer repositório (começando pelo tradicional
\`README.md\`).
[Markdown](https://pt.wikipppppppppppppg/wiki/Markdown) é uma linguagem de marcação
muito popular entre os programadores. É usada em muitas plataformas que
manipulam texto (GitHub, fórum, blogs e etc) e é muito comum encontrar arquivos
com este formato em qualquer repositório (começando pelo tradicional
\`README.md\`).
`;
      const result = readFile('./target_dir/file.md');
      await expect(result).resolves.toBe(resultExpect);
    });
  });
  describe('readFileAndExtractLinks', () => {
    it('', async () => {
      const pathFiles = [
        'target_dir\\child_dir\\doc2.md',
        'target_dir\\child_dir\\test_dir\\abc.md',
        'target_dir\\doc.md',
        'target_dir\\file.md',
        'target_dir\\file1.txt',
        'target_dir\\file2.html',
        'target_dir\\fileTest.md'
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
          label: 'Node.js http.get - Documentação oficial',
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
  describe('mdlinks somente com parametro path relativa', () => {
    it('deveria encontrar e ler arquivos .md de forma recursiva', async () => {
      const options = {
        validate: false,
        stats: false,
      };
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
          label: 'Node.js http.get - Documentação oficial',
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
      const result = await mdLinks('./target_dir', options);
      expect(result).toEqual(resultExpect);
    });
  });
  describe('mdlinks somente com parametro path absoluta', () => {
    it('deveria encontrar e ler o arquivo .md', async () => {
      const options = {
        validate: false,
        stats: false,
      };
      const absolutePath = 'D:/Helouise/CursosEUniversidades/Laboratoria/projetos/cardValidation/SAP010-card-validation/README.md';
      const resultExpect = [
        {
          file: 'D:/Helouise/CursosEUniversidades/Laboratoria/projetos/cardValidation/SAP010-card-validation/README.md',
          label: 'Laboratória',
          url: 'https://www.laboratoria.la/'
        },
        {
          file: 'D:/Helouise/CursosEUniversidades/Laboratoria/projetos/cardValidation/SAP010-card-validation/README.md',
          label: 'algoritmo de Luhn',
          url: 'https://en.wikipedia.org/wiki/Luhn_algorithm'
        },
        {
          file: 'D:/Helouise/CursosEUniversidades/Laboratoria/projetos/cardValidation/SAP010-card-validation/README.md',
          label: 'desenho do protótipo',
          url: 'https://www.figma.com/file/eeHb7cShF6uPt2JZQY7rzv/CartaoDeCreditoValido?node-id=0%3A1&t=rkuIqKLIhaEhH5ws-1'
        },
        {
          file: 'D:/Helouise/CursosEUniversidades/Laboratoria/projetos/cardValidation/SAP010-card-validation/README.md',
          label: 'clicando aqui',
          url: 'https://nodejs.org/en'
        },
        {
          file: 'D:/Helouise/CursosEUniversidades/Laboratoria/projetos/cardValidation/SAP010-card-validation/README.md',
          label: 'clique aqui',
          url: 'https://git-scm.com/downloads'
        }
      ];
      const result = await mdLinks(absolutePath, options);
      expect(result).toEqual(resultExpect);
    });
  });
  describe('mdlinks com parametros: path relativa e --validate', () => {
    it('deveria encontrar e ler arquivos .md de forma recursiva e fazer requisições http', async () => {
      const resultExpect = [
        {
          file: 'target_dir\\child_dir\\test_dir\\abc.md',
          label: 'Sobre Node.js - Documentação oficial',
          url: 'https://nodejs.org/pt-br/about/',
          statusCode: 200,
          msg: 'Ok!'
        },
        {
          file: 'target_dir\\child_dir\\test_dir\\abc.md',
          label: 'Node.js file system - Documentação oficial',
          url: 'https://nodejs.org/api/fs.html',
          statusCode: 200,
          msg: 'Ok!'
        },
        {
          file: 'target_dir\\child_dir\\test_dir\\abc.md',
          label: 'Node.js http.get - Documentação oficial',
          url: 'https://nodejs.org/api/http.html#http_http_get_options_callback',
          statusCode: 200,
          msg: 'Ok!'
        },
        {
          file: 'target_dir\\file.md',
          label: 'Markdown',
          url: 'https://pt.wikipedia.org/wiki/Markdown',
          statusCode: 200,
          msg: 'Ok!'
        },
        {
          file: 'target_dir\\file.md',
          label: 'Markdown',
          url: 'https://pt.wikipppppppppppppg/wiki/Markdown',
          statusCode: 404,
          msg: 'Not Found'
        }
      ];
      const result = await mdLinks('./target_dir', {validate: true});
      expect(result).toStrictEqual(resultExpect);
    });
  });
  describe('mdlinks com parametros: path relativa e --stats', () => {
    it('deveria encontrar e ler arquivos .md de forma recursiva e contabilizar total de links e links únicos', async () => {
      const resultExpect = [
        {
          file: 'target_dir\\child_dir\\test_dir\\abc.md',
          label: 'Sobre Node.js - Documentação oficial',
          url: 'https://nodejs.org/pt-br/about/',
          statusCode: 200,
          msg: 'Ok!'
        },
        {
          file: 'target_dir\\child_dir\\test_dir\\abc.md',
          label: 'Node.js file system - Documentação oficial',
          url: 'https://nodejs.org/api/fs.html',
          statusCode: 200,
          msg: 'Ok!'
        },
        {
          file: 'target_dir\\child_dir\\test_dir\\abc.md',
          label: 'Node.js http.get - Documentação oficial',
          url: 'https://nodejs.org/api/http.html#http_http_get_options_callback',
          statusCode: 200,
          msg: 'Ok!'
        },
        {
          file: 'target_dir\\file.md',
          label: 'Markdown',
          url: 'https://pt.wikipedia.org/wiki/Markdown',
          statusCode: 200,
          msg: 'Ok!'
        },
        {
          file: 'target_dir\\file.md',
          label: 'Markdown',
          url: 'https://pt.wikipppppppppppppg/wiki/Markdown',
          statusCode: 404,
          msg: 'Not Found'
        },
        { total: 5 },
        { unique: 5 }
      ];
      const result = await mdLinks('./target_dir', {stats: true});
      expect(result).toStrictEqual(resultExpect);
    });
  });
  describe('mdlinks com parametros: path relativa e --stats --validate', () => {
    it('deveria encontrar e ler arquivos .md de forma recursiva e contabilizar total de links, links únicos e quebrados', async () => {
      const resultExpect = [
        {
          file: 'target_dir\\child_dir\\test_dir\\abc.md',
          label: 'Sobre Node.js - Documentação oficial',
          url: 'https://nodejs.org/pt-br/about/',
          statusCode: 200,
          msg: 'Ok!'
        },
        {
          file: 'target_dir\\child_dir\\test_dir\\abc.md',
          label: 'Node.js file system - Documentação oficial',
          url: 'https://nodejs.org/api/fs.html',
          statusCode: 200,
          msg: 'Ok!'
        },
        {
          file: 'target_dir\\child_dir\\test_dir\\abc.md',
          label: 'Node.js http.get - Documentação oficial',
          url: 'https://nodejs.org/api/http.html#http_http_get_options_callback',
          statusCode: 200,
          msg: 'Ok!'
        },
        {
          file: 'target_dir\\file.md',
          label: 'Markdown',
          url: 'https://pt.wikipedia.org/wiki/Markdown',
          statusCode: 200,
          msg: 'Ok!'
        },
        {
          file: 'target_dir\\file.md',
          label: 'Markdown',
          url: 'https://pt.wikipppppppppppppg/wiki/Markdown',
          statusCode: 404,
          msg: 'Not Found'
        },
        { total: 5 },
        { unique: 4 },
        { broken: 1 }
      ];
      const result = await mdLinks('./target_dir', {validate: true, stats: true});
      expect(result).toStrictEqual(resultExpect);
    });
  });
});
