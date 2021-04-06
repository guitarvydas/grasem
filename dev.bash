#!/bin/bash

# bootstrapping...
# run glue to give _grasem-sem.js
# the final tool (_grasem.js) is an Ohm parser plus JS semantics

# run the tool on test.grasem to parse a grammar+semantics spec.
# the tool should produce 1 file - an Ohm parser plus embedded semantics.  The single file
# is generated from the test.grasem spec.

cat grasem.ohm grasem.glue >test.grasem
sed -e 's/\\/\\\\/g' <grasem.ohm >_dq_grasem.ohm

node ../glue/gen-glue.js <grasem.glue >_grasem-sem.js

cat parser1.js _dq_grasem.ohm parser2.js _grasem-sem.js parser3.js foreign.js >_grasem.js

node _grasem.js <test.grasem >_.bash
chmod a+x _.bash
./_.bash
mv _aa _.ohm
mv _ac _.glue

node ../glue/gen-glue.js <_.glue >_semantics.js

cat parser1.js _.ohm parser2.js _semantics.js parser3.js foreign.js >_program.js
# diff -w _semantics.js _grasem-sem.js
# diff -w _.ohm _dq_grasem.ohm

node _program.js <test.grasem >_out_bash.js
diff -w _out_bash.js _.bash

