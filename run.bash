#!/bin/bash

# bootstrapping...
# run glue to give _grasem-sem.js
# the final tool (_grasem.js) is an Ohm parser plus JS semantics

# run the tool on test.grasem to parse a grammar+semantics spec.
# the tool should produce 1 file - an Ohm parser plus embedded semantics.  The single file
# is generated from the test.grasem spec.

node ../glue/gen-glue.js <grasem.glue >_grasem-sem.js

cat parser1.js grasem.ohm parser2.js _grasem-sem.js parser3.js  >_grasem.js
node _grasem.js <test.grasem >_.grasem
diff -w _.grasem test.grasem
