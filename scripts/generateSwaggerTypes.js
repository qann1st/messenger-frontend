import path from 'path';
import { generateApi } from 'swagger-typescript-api';

const generateApiConfig = ({ url, name }) => {
  generateApi({
    name: 'index.ts',
    output: path.resolve(path.dirname('.'), `./src/shared/api/${name}/generated/`),
    url: url,
    httpClientType: 'axios',
    modular: true,
    extractEnums: true,
    disableStrictSSL: true,
    enumNamesAsValues: true,
    cleanOutput: true,
    generateClient: false,
  });
};

[{ name: 'MessengerApi', url: 'http://localhost:3000/api-json' }].forEach((config) => generateApiConfig({ ...config }));
