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
    fixable: null,
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

  const normalizedPath = path.toNamespacedPath(from);
  const projectFrom = normalizedPath.split("src")[1];

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
