
function main () {
    // usage: node glue <file
    // grammar is inserted from grasem.ohm
    // test.grasem is read from stdin
    var text = getNamedFile ("-");
    var { succeeded, message, parser, cst } = ohm_parse (grammar, text);
    var sem = {};
    var outputString = "";
    if (cst.succeeded ()) {
	sem = parser.createSemantics ();
	addSemantics (sem);
	outputString = sem (cst)._glue ();
	return { succeeded: true, message: "OK", cst: cst, semantics: sem, resultString: outputString };
    } else {
	return { succeeded: false, message: message, cst: cst, semantics: sem, resultString: outputString };
    }
}


var { succeeded, message, cst, semantics, resultString } = main ();
if (succeeded) {
    console.log (resultString);
} else {
    process.stderr.write (`${message}\n`);
    return false;
}
