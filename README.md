# eslint-plugin-ga-plugin

Плагин для проверки импортов в архитектуре Feature Sliced Design

## Установка

Сначала вам нужно установить [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Далее, установите `eslint-plugin-ga-plugin`:

```sh
npm install eslint-plugin-ga-plugin --save-dev
```

## Использование

Добавьте `ga-plugin` в раздел плагинов вашего конфигурационного файла `.eslintrc`

```js
// .eslintrc.js
module.exports = {
  plugins: ["ga-plugin"],
  rules: {
    "ga-plugin/path-checker": ["error", { alias: '@' }],
    "ga-plugin/public-api-imports": ["error", { alias: '@' }],
  }
}
```

