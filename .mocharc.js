'use strict';

module.exports = {
    diff: true,
    package: './package.json',
    reporter: 'spec',
    slow: 3500,
    timeout: 60000,
    recursive: true,
    parallel: true,
    spec: "test/**/*-spec.ts",
    require: [
        "tsconfig-paths/register",
        "ts-node/register/transpile-only"
    ],
}