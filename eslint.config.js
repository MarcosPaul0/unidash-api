// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Configuração padrão recomendada pelo ESLint
  eslint.configs.recommended,

  // Configurações recomendadas para TypeScript
  ...tseslint.configs.recommended,

  // Desativa regras do ESLint que conflitam com o Prettier
  prettierConfig,

  {
    languageOptions: {
      globals: {
        node: true,
        es2021: true,
      },
    },
    rules: {
      // Suas regras personalizadas
      "no-useless-constructor": "off",
      "no-new": "off",
      "no-console": "warn",

      // Outras regras úteis para projetos NestJS/TypeScript
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn", // Avisa sobre o uso de 'any'
    },
  },
  {
    // Ignora a pasta de build e os node_modules
    ignores: ['dist/', 'node_modules/'],
  }
);