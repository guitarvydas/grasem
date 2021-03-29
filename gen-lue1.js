// npm install ohm-js
'use strict';

const grammar =
      `
SemanticsSCL {
  semantics = ws* semanticsStatement+
  semanticsStatement = ruleName ws* "[" ws* parameters "]" ws* "=" ws* code? rewrites ws*

  ruleName = letter1 letterRest*
  
  parameters = parameter*
  parameter = treeparameter | flatparameter
  flatparameter = fpws | fpd
  fpws = pname ws+
  fpd = pname delimiter
  treeparameter = "@" tflatparameter
  tflatparameter = tfpws | tfpd
  tfpws = pname ws+
  tfpd = pname delimiter

  pname = letterRest letterRest*
  rewrites = rw1 | rw2
  rw1 = "[[" ws* rwstringWithNewlines "]]" ws*
  rw2 = rwstring

  letter1 = "_" | "a" .. "z" | "A" .. "Z"
  letterRest = "0" .. "9" | letter1

  ws = "\\n" | " " | "\\t" | "," 
  delimiter = &"]" | &"="

  rwstring = stringchar*
  stringchar = ~"\\n" any

  rwstringWithNewlines = nlstringchar*
  nlstringchar = ~"]]" ~"}}" any
  code = "{{" ws* codeString "}}" ws*
  codeString = rwstringWithNewlines

}
`;


function ohm_parse (grammar, text) {
    var ohm = require ('ohm-js');
    var parser = ohm.grammar (grammar);
    var cst = parser.match (text);
    if (cst.succeeded ()) {
	return { parser: parser, cst: cst };
    } else {
	console.log (parser.trace (text).toString ());
	throw "glue: Ohm matching failed";
    }
}

function getNamedFile (fname) {
    var fs = require ('fs');
    if (fname === undefined || fname === null || fname === "-") {
	return fs.readFileSync (0, 'utf-8');
    } else {
	return fs.readFileSync (fname, 'utf-8');
    }	
}
