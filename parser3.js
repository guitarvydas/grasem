
function main () {
    // usage: node glue <file
    // grammar is inserted from grasem.ohm
    // test.grasem is read from stdin
    var text = getNamedFile ("-");
    var { parser, cst } = ohm_parse (grammar, text);
    var sem = {};
    var outputString = "";
    if (cst.succeeded ()) {
	sem = parser.createSemantics ();
	addSemantics (sem);
	outputString = sem (cst)._glue ();
    }
    return { cst: cst, semantics: sem, resultString: outputString };
}


var { cst, semantics, resultString } = main ();
console.log (resultString);
