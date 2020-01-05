const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const sourceMapPath = resolve(__dirname, 'dist', 'index.js.map');
const sourceMapStr = readFileSync(sourceMapPath).toString();
const sourceMap = JSON.parse(JSON.parse(sourceMapStr));

writeFileSync(sourceMapPath, JSON.stringify(sourceMap));
