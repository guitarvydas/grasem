#!/bin/bash
set -e

# grammar+semantics all in one file
# grammar is specified a la Ohm-JS
# semantics is specified a la Glue

# usage: ./run.bash spec.grasem <input-file

spec=$1
node ../grasem/_grasem.js <${spec} >_.bash
chmod a+x _.bash
./_.bash
mv _aa _.ohm
mv _ab _.glue
## now we have _.ohm and _.glue as separate files
## create JS file for semantics
node ../glue/gen-glue.js <_.glue >_semantics.js
## and combine everything into one JS file (with support JS) and run the JS program
cat ../grasem/parser1.js _.ohm ../grasem/parser2.js _semantics.js ../grasem/parser3.js 

