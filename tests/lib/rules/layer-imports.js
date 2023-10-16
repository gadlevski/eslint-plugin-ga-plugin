const rule = require("../../../lib/rules/layer-imports"),
  RuleTester = require("eslint").RuleTester;

const aliasOptions = [
  {
    alias: "@",
  },
];

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: "module"},
});

ruleTester.run("layer-imports", rule, {
  valid: [
    {
      filename: "/mnt/data/project/study/frontend/src/entities/Article/",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Button.tsx'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: "/mnt/data/project/study/frontend/src/entities/Article/",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: "/mnt/data/project/study/frontend/src/app/providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: "/mnt/data/project/study/frontend/src/widgets/pages",
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: "/mnt/data/project/study/frontend/src/app/providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from 'redux'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: "/mnt/data/project/study/frontend/src/index.tsx",
      code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: "/mnt/data/project/study/frontend/src/entities/Article.tsx",
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: "@",
          ignoreImportPatterns: ["**/StoreProvider"],
        },
      ],
    },
  ],

  invalid: [
    {
      filename: "/mnt/data/project/study/frontend/src/entities/providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Article'",
      errors: [
        {
          message:
            "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)",
        },
      ],
      options: aliasOptions,
    },
    {
      filename: "/mnt/data/project/study/frontend/src/features/providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Article'",
      errors: [
        {
          message:
            "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)",
        },
      ],
      options: aliasOptions,
    },
    {
      filename: "/mnt/data/project/study/frontend/src/entities/providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Article'",
      errors: [
        {
          message:
            "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)",
        },
      ],
      options: aliasOptions,
    },
  ],
});
