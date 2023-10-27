const path = require("path");
const {isPathRelative} = require("../helpers");

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "feature sliced relative path checker",
      category: "Fill me in",
      recommended: false,
      url: null,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          alias: {
            type: "string",
          },
        },
      },
    ],
    messages: {
      shouldBeRelative:
        "В рамках одного слайса все пути должны быть относительными",
    },
  },

  create(context) {
    const alias = (context.options[0] && context.options[0].alias) || "";

    return {
      ImportDeclaration(node) {
        // example app/entities/Article
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, "") : value;

        // Текущий файл
        const fromFilename = context.getFilename();

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report({
            node,
            messageId: "shouldBeRelative",
            fix: (fixer) => {
              const normalizedPath = getNormalizedCurrentFilePath(fromFilename);
              const dirPath = path.dirname(normalizedPath); // Получаем директорию текущего файла
              let relativePath = path.relative(
                dirPath,
                path.join("/", importTo)
              ); // Получаем относительный путь

              // Преобразуем путь в Unix-формат независимо от ОС
              relativePath = relativePath.split(path.sep).join("/");

              if (!relativePath.startsWith(".")) {
                relativePath = "./" + relativePath;
              }

              return fixer.replaceText(node.source, `'${relativePath}'`);
            },
          });
        }
      },
    };
  },
};

const layers = {
  entities: "entities",
  features: "features",
  shared: "shared",
  pages: "pages",
  widgets: "widgets",
};

function getNormalizedCurrentFilePath(currentFilePath) {
  const normalizedPath = path.toNamespacedPath(currentFilePath);
  const projectFrom = normalizedPath.split("src")[1];
  return path.normalize(projectFrom); // Используем path.normalize для кроссплатформенности
}

function shouldBeRelative(from, to) {
  if (!from || !to) {
    return false;
  }

  if (isPathRelative(to)) {
    return false;
  }

  const toArray = to.split("/");
  const toLayer = toArray[0];
  const toSlice = toArray[1];

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const projectFrom = getNormalizedCurrentFilePath(from);

  if (!projectFrom) {
    return false;
  }

  const fromArray = projectFrom.split(path.sep);

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;
}
