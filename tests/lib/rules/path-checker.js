/**
 * @fileoverview fsd path
 * @author gadlevski
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: "module"},
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: "/mnt/data/project/study/frontend/src/entities/Article/",
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: "/mnt/data/project/study/frontend/src/entities/Article/",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
      errors: [
        {message: "В рамках одного слайса все пути должны быть относительными"},
      ],
      options: [
        {
          alias: "@",
        },
      ],
    },
    {
      filename: "/mnt/data/project/study/frontend/src/entities/Article/",
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
      errors: [
        {message: "В рамках одного слайса все пути должны быть относительными"},
      ],
    },
  ],
});
