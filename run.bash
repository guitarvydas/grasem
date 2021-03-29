#!/bin/bash
node gen-glue.js <grasem.glue >_grasem.js
cat gen-glue1.js _grasem.js gen-glue2.js >_grasem.js
node _grasem.js <test.grasem >_out.js
