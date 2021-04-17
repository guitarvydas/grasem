
`;


function ohm_parse (grammar, text) {
    var ohm = require ('ohm-js');
    var parser = ohm.grammar (grammar);
    var cst = parser.match (text);
    if (cst.succeeded ()) {
	return { succeeded: true, message: "OK", parser: parser, cst: cst };
    } else {
	//console.log (parser.trace (text).toString ());
	//throw "glue: Ohm matching failed";
        
        return { succeeded: false, message: cst.message, parser: parser, cst: cst };
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
