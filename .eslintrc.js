/*
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project's original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint. 
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
    root: true,
    "globals":{
        "browser": true,
        "$": true,
        "WebdriverIO": true
    },
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": [
        "eslint:all",
        "plugin:@typescript-eslint/all",
        "prettier"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "autofix",
        "eslint-plugin-import",
        "eslint-plugin-jsdoc",
        "eslint-plugin-prefer-arrow",
        "@typescript-eslint",
        "@typescript-eslint/tslint",
        "eslint-plugin-prettier"
    ],
    "rules": {        
        "@typescript-eslint/array-type": [
            "error",
            {
                "default": "array"
            }
        ],
        "@typescript-eslint/ban-types": [
            "error",
            {
                "types": {
                    "Object": {
                        "message": "Avoid using the `Object` type. Did you mean `object`?"
                    },
                    "Function": {
                        "message": "Avoid using the `Function` type. Prefer a specific function type, like `() => void`."
                    },
                    "Boolean": {
                        "message": "Avoid using the `Boolean` type. Did you mean `boolean`?"
                    },
                    "Number": {
                        "message": "Avoid using the `Number` type. Did you mean `number`?"
                    },
                    "String": {
                        "message": "Avoid using the `String` type. Did you mean `string`?"
                    },
                    "Symbol": {
                        "message": "Avoid using the `Symbol` type. Did you mean `symbol`?"
                    }
                }
            }
        ],
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                "accessibility": "explicit",
                "overrides": {
                    "accessors": "explicit",
                    "constructors": "explicit",
                    "parameterProperties": "explicit"
                }
            }
        ],
        "@typescript-eslint/indent": [
            "error",
            2,
            {
                "ObjectExpression": "first",
                "FunctionDeclaration": {
                    "parameters": "first"
                },
                "FunctionExpression": {
                    "parameters": "first"
                }
            }
        ],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/no-inferrable-types": [
            "error",
            {
                "ignoreParameters": true
            }
        ],
        "@typescript-eslint/no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "@typescript-eslint/quotes": [
            "error",
            "single",
            {
                "avoidEscape": true
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "@typescript-eslint/triple-slash-reference": [
            "error",
            {
                "path": "always",
                "types": "prefer-import",
                "lib": "always"
            }
        ],
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "import-spacing": true,
                    "prefer-conditional-expression": false,
                    // "prettier": true,
                    "typedef": true,
                    "whitespace": true
                }
            }
        ],
        "@typescript-eslint/consistent-type-assertions": [ "error", { assertionStyle: "angle-bracket", objectLiteralTypeAssertions: "allow" } ],
        "@typescript-eslint/naming-convention": ["warn", {format: ['camelCase'],selector: 'variableLike', custom: {regex: 'ObjectId|mime_type', match: false}} ],
        "@typescript-eslint/require-array-sort-compare": ["warn", {ignoreStringArrays: true} ],
        "@typescript-eslint/no-misused-promises": ["error",{"checksVoidReturn": false}],
        "@typescript-eslint/restrict-template-expressions": ["error", {allowBoolean: true }],
        "autofix/sort-imports": "error",
        "brace-style": ["error","1tbs"],
        "object-curly-spacing": ["warn", "always"],
        "array-bracket-spacing": ["warn", "always"],
        "max-classes-per-file": ["error",1],
        "max-len": ["error",{"ignorePattern": "\\s*from|class [a-zA-Z]+ implements|\\s*\\* |\\s*// ","code": 240}],
        "no-console": ["error",{
                "allow": [
                    "log",
                    "warn",
                    "dir",
                    "timeLog",
                    "assert",
                    "clear",
                    "count",
                    "countReset",
                    "group",
                    "groupEnd",
                    "table",
                    "dirxml",
                    "error",
                    "groupCollapsed",
                    "Console",
                    "profile",
                    "profileEnd",
                    "timeStamp",
                    "context"
                ]
            }
        ],
        "no-plusplus": ["error",{"allowForLoopAfterthoughts": true}],
        "object-curly-spacing": ["error","always",{"objectsInObjects": true}],
        "one-var": [ "error", "never"],
        "prefer-arrow/prefer-arrow-functions": "error",
        "space-in-parens": [ "error", "always"],
        "spaced-comment": [ "error", "always", { "markers": [ "/" ]}],
        "no-underscore-dangle": ["off", {"allow": ["_id", "_model"]}],
        "max-statements": ["error", 21],
        "camelcase": ["error", {allow: ["mime_type", "not_defined", "error_message"]}],
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/prefer-readonly-parameter-types": "off",
        "@typescript-eslint/no-type-alias": "off",
        "@typescript-eslint/consistent-indexed-object-style": "off",
        "@typescript-eslint/lines-between-class-members": "off",
        "@typescript-eslint/no-magic-numbers": "off",
        "@typescript-eslint/require-array-sort-compare": "off",
        "@typescript-eslint/no-invalid-void-type": "off",     
        "multiline-comment-style": "off",
        "prefer-readonly-parameter-types": "off",
        "no-ternary": "off",
        "no-undefined": "off",
        "class-methods-use-this": "off",
        "max-lines-per-function": "off",
        "max-params": "off",
        "capitalized-comments": "off",
        "max-lines": "off",
        "prefer-destructuring": "off",
        "no-plusplus": "off",
        "prettier/prettier": "off",
        "complexity": "off",
        "max-depth": "off",
        "new-cap": "off",
        "sort-keys": "off",
        "line-comment-position": "off",
        "no-inline-comments": "off",
        "method-signature-style": "off",
        "prefer-named-capture-group": "off",
        "arrow-body-style": "off",
    },
    "overrides":[
        {
            "files": [ "test/cucumber/step-definitions/*.ts" ],
            "excludedFiles": "*.*-steps.ts",
            "rules": {
                "prefer-arrow/prefer-arrow-functions": ["off"],
            }
        },
        {
            "files": [ 
                "test/unit/*.ts", 
                "src/lib/generate-report/helpers/generate-html.ts", 
                "src/lib/mongoose-report-manager/mongoose-queries.ts"
            ],
            "excludedFiles": "*.*.ts",
            "rules": {
                "sort-keys": ["off"],
            }
        },
        {
            "files": ["test/unit/*-spec.ts"],
            "rules": { 
                "max-lines-per-function": [ "off"]
            }
        },
        {
            "files": [
                "test/e2e/pages/**/*.ts",
                "test/e2e/steps/**/*.ts"
            ],
            "rules": {"require-unicode-regexp": ["off"]}
        },
        {
            "files":[
                "test/e2e/custom-commands/custom-commands.ts"
            ],
            "rules": { "func-names": ["off"]}            
        },
        {
            "files":[
                "test/e2e/custom-commands/custom-commands.ts"
            ],
            "rules": { "id-length": ["off"]}
        }
    ]
};