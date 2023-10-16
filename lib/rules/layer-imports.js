const path = require("path");
const {isPathRelative} = require("../helpers");
const micromatch = require("micromatch");

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "layer imports rule",
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
          ignoreImportPatterns: {
            type: "array",
          },
        },
      },
    ],
  },

  create(context) {
    const layers = {
      app: ["pages", "widgets", "features", "shared", "entities"],
      pages: ["widgets", "features", "shared", "entities"],
      widgets: ["features", "shared", "entities"],
      features: ["shared", "entities"],
      entities: ["shared", "entities"],
      shared: ["shared"],
    };

    const availableLayers = {
      app: "app",
      entities: "entities",
      features: "features",
      shared: "shared",
      pages: "pages",
      widgets: "widgets",
    };

    const {alias = "", ignoreImportPatterns = []} = context.options[0] || {};

    const getCurrentFileLayer = () => {
      const currentFilePath = context.getFilename();
      const normalizedPath = path.normalize(currentFilePath);
      const projectPath = normalizedPath.split("src")[1];

      if (typeof projectPath === "undefined") {
        return null;
      }

      const segments = projectPath.split(path.sep);
      return segments[1];
    };

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, "") : value;
      const segments = importPath ? importPath.split("/") : null;

      return segments ? segments[0] : null;
    };

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileLayer = getCurrentFileLayer();
        const importLayer = getImportLayer(importPath);

        if (isPathRelative(importPath)) {
          return;
        }

        if (
          !availableLayers[importLayer] ||
          !availableLayers[currentFileLayer]
        ) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some((pattern) => {
          return micromatch.isMatch(importPath, pattern);
        });

        if (isIgnored) {
          return;
        }

        if (!layers[currentFileLayer]?.includes(importLayer)) {
          context.report(
            node,
            "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)"
          );
        }
      },
    };
  },
};
