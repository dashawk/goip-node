#!/bin/bash

# Remove existing dist folder
rm -rf dist

# Transpile all source files into dist folder
babel . --out-dir dist --ignore node_modules

# Minify all files in dist folder
find dist -type f -name "*.js" -exec uglifyjs --compress --mangle -o {} {} \;
