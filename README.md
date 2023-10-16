# eslint-plugin-ga-plugin

Плагин для проверки импортов в архитектуре Feature Sliced Design

## Установка

Сначала нужно установить [ESLint](https://eslint.org/)

```sh
npm i eslint --save-dev
```



Далее, установите `eslint-plugin-ga-plugin`

```sh
npm install eslint-plugin-ga-plugin --save-dev
```

## Использование

```js
// .eslintrc.js
module.exports = {
  plugins: ["ga-plugin"],
  rules: {
    'ga-plugin/path-checker': ['error', { alias: '@' }],
    'ga-plugin/layer-imports': [
      'error',
      {
        alias: '@',
        ignoreImportPatterns: ['**/StoreProvider', '**/testing'],
      },
    ],
    'ga-plugin/public-api-imports': [
      'error',
      {
        alias: '@',
        testFilesPatterns: ['**/*.test.*', '**/*.story.*', '**/StoreDecorator.tsx'],
      },
    ],
  }
}
```

