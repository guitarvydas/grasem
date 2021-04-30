// npm install ohm-js
'use strict';

const grammar =
      `
grasem {

grasemProgram = ws* ohmGrammar glueSemantics+

ohmGrammar = grammarName grammarBody

grammarBody = "{" ws* grammarToken+ "}" ws*
grammarName = name


glueSemantics = semanticsName semanticsParameters "=" ws* code? "[[" rewriteChar* "]]" ws*

code = "{{" ws* codeChar* "}}" ws*

codeChar = ~"}}" token
rewriteChar = ~"]]" token


semanticsName = name ws*
semanticsParameters = "[" ws* semanticsParam+ "]" ws*
semanticsParam = semanticsTreeParam | semanticsFlatParam
semanticsTreeParam = "@" ws* semanticsFlatParam
semanticsFlatParam = name ws*


name = char1 charRest* ws*
char1 = "_" | "A" .. "Z" | "a" .. "z"
charRest = "0" .. "9" | char1

grammarToken = ~"}" token
token = comment | string | tokenChar
tokenChar = tokenCharNested | tokenCharSimple
tokenCharNested = "}" ws*
tokenCharSimple = ~"]]" any

comment = "%" notNewline* newline

newline = "\\n"
notNewline = ~"\\n" any

string = "\\"" stringChar* "\\""
stringChar = stringCharEscaped | stringCharNotEscaped
stringCharEscaped = "\\\\" any
stringCharNotEscaped = ~"\\"" any

ws = comment | newline | " " 

endGrammar = "}" &newline

}


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
'use strict'

var _scope;

function scopeStack () {
    this._stack = [];
    this.pushNew = function () {this._stack.push ([])};
    this.pop = function () {this._stack.pop ()};
    this._topIndex = function () {return this._stack.length - 1;};
    this._top = function () { return this._stack[this._topIndex ()]; };
    this.scopeAdd = function (key, val) {
	this._top ().push ({key: key, val: val});
    };
    this._lookup = function (key, a) { 
      return a.find (obj => {return obj && obj.key && (obj.key == key)}); };
    this.scopeGet = function (key) {
	var i = this._topIndex ();
	for (; i >= 0 ; i -= 1) {
	    var obj = this._lookup (key, this._stack [i]);
	    if (obj) {
		return obj.val;
	    };
	};
        console.log ('*** scopeGet error ***');
	console.log (this._stack);
	console.log (key);
	throw "scopeGet internal error";
    };
    this.scopeModify = function (key, val) {
	var i = this._topIndex ();
	for (; i >= 0 ; i -= 1) {
	    var obj = this._lookup (key, this._stack [i]);
	    if (obj) {
              obj.val = val;
              return val;
	    };
	};
        console.log ('*** scopeModify error ***');
	console.log (this._stack);
	console.log (key);
	throw "scopeModify internal error";
    };
}

function scopeAdd (key, val) {
  return _scope.scopeAdd (key, val);
}

function scopeModify (key, val) {
  return _scope.scopeModify (key, val);
}

function scopeGet (key, val) {
  return _scope.scopeGet (key, val);
}

function _ruleInit () {
    _scope = new scopeStack ();
}

function _ruleEnter (ruleName) {
    _scope.pushNew ();
}

function _ruleExit (ruleName) {
    _scope.pop ();
}

_ruleInit ();
function addSemantics (sem) {
  sem.addOperation (
'_glue',
{
grasemProgram : function (_ws
,_ohmGrammar,_glueSemantics
,) {
_ruleEnter ("grasemProgram");

var ws = _ws._glue ().join ('');var ohmGrammar = _ohmGrammar._glue ();var glueSemantics = _glueSemantics._glue ().join ('');
var _result = `#!/bin/bash\nsplit -p '%%%%%'  - "_" <<'%%EOF'\n${ws}${escapeEscapes (ohmGrammar)}\n%%%%%\n${glueSemantics}\n%%EOF`;
_ruleExit ("grasemProgram");
return _result;
},
ohmGrammar : function (_grammarName,_grammarBody,) {
_ruleEnter ("ohmGrammar");

var grammarName = _grammarName._glue ();var grammarBody = _grammarBody._glue ();
var _result = `${grammarName}${grammarBody}`;
_ruleExit ("ohmGrammar");
return _result;
},
grammarBody : function (_lb,_ws
,_grammarToken
,_rb,_ws2
,) {
_ruleEnter ("grammarBody");

var lb = _lb._glue ();var ws = _ws._glue ().join ('');var grammarToken = _grammarToken._glue ().join ('');var rb = _rb._glue ();var ws2 = _ws2._glue ().join ('');
var _result = `${lb}${ws}${grammarToken}${rb}${ws2}`;
_ruleExit ("grammarBody");
return _result;
},
grammarName : function (_name,) {
_ruleEnter ("grammarName");

var name = _name._glue ();
var _result = `${name}`;
_ruleExit ("grammarName");
return _result;
},
glueSemantics : function (_semanticsName,_semanticsParameters,_eq,_ws
,_code
,_lbb,_rewriteChar
,_rbb,_ws2
,) {
_ruleEnter ("glueSemantics");

var semanticsName = _semanticsName._glue ();var semanticsParameters = _semanticsParameters._glue ();var eq = _eq._glue ();var ws = _ws._glue ().join ('');var code = _code._glue ().join ('');var lbb = _lbb._glue ();var rewriteChar = _rewriteChar._glue ().join ('');var rbb = _rbb._glue ();var ws2 = _ws2._glue ().join ('');
var _result = `${semanticsName}${semanticsParameters}${eq}${ws}${code}${lbb}${rewriteChar}${rbb}${ws2}`;
_ruleExit ("glueSemantics");
return _result;
},
code : function (_lbb,_ws
,_codeChar
,_rbb,_ws2
,) {
_ruleEnter ("code");

var lbb = _lbb._glue ();var ws = _ws._glue ().join ('');var codeChar = _codeChar._glue ().join ('');var rbb = _rbb._glue ();var ws2 = _ws2._glue ().join ('');
var _result = `${lbb}${ws}${codeChar}${rbb}${ws2}`;
_ruleExit ("code");
return _result;
},
codeChar : function (_token,) {
_ruleEnter ("codeChar");

var token = _token._glue ();
var _result = `${token}`;
_ruleExit ("codeChar");
return _result;
},
rewriteChar : function (_token,) {
_ruleEnter ("rewriteChar");

var token = _token._glue ();
var _result = `${token}`;
_ruleExit ("rewriteChar");
return _result;
},
semanticsName : function (_name,_ws
,) {
_ruleEnter ("semanticsName");

var name = _name._glue ();var ws = _ws._glue ().join ('');
var _result = `${name}${ws}`;
_ruleExit ("semanticsName");
return _result;
},
semanticsParameters : function (_lb,_ws
,_semanticsParam
,_rb,_ws2
,) {
_ruleEnter ("semanticsParameters");

var lb = _lb._glue ();var ws = _ws._glue ().join ('');var semanticsParam = _semanticsParam._glue ().join ('');var rb = _rb._glue ();var ws2 = _ws2._glue ().join ('');
var _result = `${lb}${ws}${semanticsParam}${rb}${ws2}`;
_ruleExit ("semanticsParameters");
return _result;
},
semanticsParam : function (_p,) {
_ruleEnter ("semanticsParam");

var p = _p._glue ();
var _result = `${p}`;
_ruleExit ("semanticsParam");
return _result;
},
semanticsTreeParam : function (_at,_ws
,_semanticsFlatParam,) {
_ruleEnter ("semanticsTreeParam");

var at = _at._glue ();var ws = _ws._glue ().join ('');var semanticsFlatParam = _semanticsFlatParam._glue ();
var _result = `${at}${ws}${semanticsFlatParam}`;
_ruleExit ("semanticsTreeParam");
return _result;
},
semanticsFlatParam : function (_name,_ws
,) {
_ruleEnter ("semanticsFlatParam");

var name = _name._glue ();var ws = _ws._glue ().join ('');
var _result = `${name}${ws}`;
_ruleExit ("semanticsFlatParam");
return _result;
},
name : function (_char1,_charRest
,_ws
,) {
_ruleEnter ("name");

var char1 = _char1._glue ();var charRest = _charRest._glue ().join ('');var ws = _ws._glue ().join ('');
var _result = `${char1}${charRest}${ws}`;
_ruleExit ("name");
return _result;
},
char1 : function (_c,) {
_ruleEnter ("char1");

var c = _c._glue ();
var _result = `${c}`;
_ruleExit ("char1");
return _result;
},
charRest : function (_c,) {
_ruleEnter ("charRest");

var c = _c._glue ();
var _result = `${c}`;
_ruleExit ("charRest");
return _result;
},
grammarToken : function (_token,) {
_ruleEnter ("grammarToken");

var token = _token._glue ();
var _result = `${token}`;
_ruleExit ("grammarToken");
return _result;
},
token : function (_x,) {
_ruleEnter ("token");

var x = _x._glue ();
var _result = `${x}`;
_ruleExit ("token");
return _result;
},
tokenChar : function (_c,) {
_ruleEnter ("tokenChar");

var c = _c._glue ();
var _result = `${c}`;
_ruleExit ("tokenChar");
return _result;
},
tokenCharNested : function (_lb,_ws
,_tokenChar
,_rb,_ws2
,) {
_ruleEnter ("tokenCharNested");

var lb = _lb._glue ();var ws = _ws._glue ().join ('');var tokenChar = _tokenChar._glue ().join ('');var rb = _rb._glue ();var ws2 = _ws2._glue ().join ('');
var _result = `${lb}${ws}${tokenChar}${rb}${ws2}`;
_ruleExit ("tokenCharNested");
return _result;
},
tokenCharSimple : function (_c,) {
_ruleEnter ("tokenCharSimple");

var c = _c._glue ();
var _result = `${c}`;
_ruleExit ("tokenCharSimple");
return _result;
},
comment : function (_pct,_cs
,_nl,) {
_ruleEnter ("comment");

var pct = _pct._glue ();var cs = _cs._glue ().join ('');var nl = _nl._glue ();
var _result = `${pct}${cs}${nl}`;
_ruleExit ("comment");
return _result;
},
newline : function (_c,) {
_ruleEnter ("newline");

var c = _c._glue ();
var _result = `${c}`;
_ruleExit ("newline");
return _result;
},
notNewline : function (_c,) {
_ruleEnter ("notNewline");

var c = _c._glue ();
var _result = `${c}`;
_ruleExit ("notNewline");
return _result;
},
string : function (_lq,_cs
,_rq,) {
_ruleEnter ("string");

var lq = _lq._glue ();var cs = _cs._glue ().join ('');var rq = _rq._glue ();
var _result = `${lq}${cs}${rq}`;
_ruleExit ("string");
return _result;
},
stringChar : function (_c,) {
_ruleEnter ("stringChar");

var c = _c._glue ();
var _result = `${c}`;
_ruleExit ("stringChar");
return _result;
},
stringCharEscaped : function (__bslash,_c,) {
_ruleEnter ("stringCharEscaped");

var _bslash = __bslash._glue ();var c = _c._glue ();
var _result = `${_bslash}${c}`;
_ruleExit ("stringCharEscaped");
return _result;
},
stringCharNotEscaped : function (_c,) {
_ruleEnter ("stringCharNotEscaped");

var c = _c._glue ();
var _result = `${c}`;
_ruleExit ("stringCharNotEscaped");
return _result;
},
ws : function (_c,) {
_ruleEnter ("ws");

var c = _c._glue ();
var _result = `${c}`;
_ruleExit ("ws");
return _result;
},
endGrammar : function (_c,_nl,) {
_ruleEnter ("endGrammar");

var c = _c._glue ();var nl = _nl._glue ();
var _result = `${c}${nl}`;
_ruleExit ("endGrammar");
return _result;
},

_terminal: function () {return this.primitiveValue; }
});
}


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
function escapeEscapes (s) {
    // grammar needs to have all backslashes doubled before inclusion in a backtick string constant, to be compatible with Ohm-JS
    return s.replace (/\\/g,'\\\\');
}

