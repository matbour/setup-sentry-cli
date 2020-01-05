const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

/*
 * @zeit/ncc generates a source map as an escaped string.
 * This script converts the sourcemap from the escaped string to a regular JSON sourcemap.
 */
const sourceMapPath = resolve(__dirname, 'dist', 'index.js.map');
const sourceMapStr = readFileSync(sourceMapPath).toString();
const sourceMap = JSON.parse(JSON.parse(sourceMapStr));

writeFileSync(sourceMapPath, JSON.stringify(sourceMap));
