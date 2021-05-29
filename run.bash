#!/bin/bash
trap 'catch' ERR

catch () {
    echo '*** fatal error in grasem/run.bash'
    exit 1
}
set -e

# grammar+semantics all in one file
# grammar is specified a la Ohm-JS
# semantics is specified a la Glue

# usage: ./run.bash spec.grasem <input-file

spec=$1
node ~/quicklisp/local-projects/grasem/grasem.js <${spec} >_.bash
chmod a+x _.bash
./_.bash
mv _aa _.ohm
mv _ab _.glue
## now we have _.ohm and _.glue as separate files
## create JS file for semantics
node ~/quicklisp/local-projects/glue/gen-glue.js <_.glue >_semantics.js
## and combine everything into one JS file (with support JS) and run the JS program
cat ~/quicklisp/local-projects/grasem/parser1.js _.ohm ~/quicklisp/local-projects/grasem/parser2.js _semantics.js ~/quicklisp/local-projects/grasem/parser3.js 

