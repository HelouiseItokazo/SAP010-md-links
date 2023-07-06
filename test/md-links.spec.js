import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  mdLinks,
} from "../index.js";

describe('mdLinks', () => {

  describe('Parametro: path', () => {
    it('deveria receber uma path relativa sem o nome de arquivo e ler o(s) .md de forma recursiva', async () => {
      const mockResult = [
        {
          file: 'test\\mock\\mock_dir\\file.md',
          label: 'Markdown',
          url: 'https://pt.wikipedia.org/wiki/Markdown'
        },
        {
          file: 'test\\mock\\mock_dir\\file.md',
          label: 'Markdown',
          url: 'https://pt.wikipedia.org/wiki/Markdown'
        }
      ]
      const result = await mdLinks('./test/mock/mock_dir');
      expect(result).toStrictEqual(mockResult);
    });

    it('deveria receber uma path relativa com o nome do arquivo .md e lê-lo sem recursividade', async () => {
      const mockResult = [
        {
          file: './test/mock/mock_dir/file.md',
          label: 'Markdown',
          url: 'https://pt.wikipedia.org/wiki/Markdown'
        },
        {
          file: './test/mock/mock_dir/file.md',
          label: 'Markdown',
          url: 'https://pt.wikipedia.org/wiki/Markdown'
        }
      ]
      const result = await mdLinks('./test/mock/mock_dir/file.md');
      expect(result).toStrictEqual(mockResult);
    });

    it('deveria receber uma path absoluta e lê-lo sem recursividade', async () => {
      const mockResult = [
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
      ]
      const result = await mdLinks('D:/Helouise/CursosEUniversidades/Laboratoria/projetos/cardValidation/SAP010-card-validation/README.md');
      expect(result).toStrictEqual(mockResult);
    });
  });
});
