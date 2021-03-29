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
	for (; i > 0 ; i -= 1) {
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
	for (; i > 0 ; i -= 1) {
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

semantics : function (_ws,_specs) { 
_ruleEnter ("semantics");

var ws = _ws._glue ().join ('');
var specs = _specs._glue ().join ('');
var _result = `function addSemantics (sem) {
  sem.addOperation (
'_glue',
{
${specs}
_terminal: function () {return this.primitiveValue; }
});
}
`; 
_ruleExit ("semantics");
return _result; 
},
            
semanticsStatement : function (_name,_ws1,__lb,_ws2,_params,__rb,_ws3,__eq,_ws4,_code,_rewrites,_ws5) { 
_ruleEnter ("semanticsStatement");
scopeAdd("varNameStack", []);

var name = _name._glue ();
var ws1 = _ws1._glue ().join ('');
var _lb = __lb._glue ();
var ws2 = _ws2._glue ().join ('');
var params = _params._glue ();
var _rb = __rb._glue ();
var ws3 = _ws3._glue ().join ('');
var _eq = __eq._glue ();
var ws4 = _ws4._glue ().join ('');
var code = _code._glue ();
var rewrites = _rewrites._glue ();
var ws5 = _ws5._glue ().join ('');
var _result = `${name} : function (${params}) {
_ruleEnter ("${name}");
${scopeGet("varNameStack").join ('')}
${code}
var _result = \`${rewrites}\`;
_ruleExit ("${name}");
return _result;
},
`; 
_ruleExit ("semanticsStatement");
return _result; 
},
            
ruleName : function (_c,_cs) { 
_ruleEnter ("ruleName");

var c = _c._glue ();
var cs = _cs._glue ().join ('');
var _result = `${c}${cs}`; 
_ruleExit ("ruleName");
return _result; 
},
            
parameters : function (_p) { 
_ruleEnter ("parameters");

var p = _p._glue ().join ('');
var _result = `${p}`; 
_ruleExit ("parameters");
return _result; 
},
            
parameter : function (_p) { 
_ruleEnter ("parameter");

var p = _p._glue ();
var _result = `${p}`; 
_ruleExit ("parameter");
return _result; 
},
            
flatparameter : function (_p) { 
_ruleEnter ("flatparameter");
var stk = scopeGet("varNameStack");
    var pp = _p._glue ();
    stk.push (`var ${pp} = _${pp}._glue ();`);
    scopeModify ("varNameStack", stk);
  
var p = _p._glue ();
var _result = `_${p}`; 
_ruleExit ("flatparameter");
return _result; 
},
            
fpws : function (_name,_ws) { 
_ruleEnter ("fpws");

var name = _name._glue ();
var ws = _ws._glue ().join ('');
var _result = `${name}`; 
_ruleExit ("fpws");
return _result; 
},
            
fpd : function (_name,_delim) { 
_ruleEnter ("fpd");

var name = _name._glue ();
var delim = _delim._glue ();
var _result = `${name}`; 
_ruleExit ("fpd");
return _result; 
},
            
treeparameter : function (__at,_flatp) { 
_ruleEnter ("treeparameter");
var stk = scopeGet("varNameStack");
    var fp = _flatp._glue ();
    stk.push (`var ${fp} = _${fp}._glue ();`);
    scopeModify ("varNameStack", stk);

var _at = __at._glue ();
var flatp = _flatp._glue ();
var _result = `_${flatp}
`; 
_ruleExit ("treeparameter");
return _result; 
},
            
tflatparameter : function (_tp) { 
_ruleEnter ("tflatparameter");

var tp = _tp._glue ();
var _result = `${tp}`; 
_ruleExit ("tflatparameter");
return _result; 
},
            
tfpws : function (_name,_ws) { 
_ruleEnter ("tfpws");

var name = _name._glue ();
var ws = _ws._glue ().join ('');
var _result = `${name}`; 
_ruleExit ("tfpws");
return _result; 
},
            
tfpd : function (_name,_delim) { 
_ruleEnter ("tfpd");

var name = _name._glue ();
var delim = _delim._glue ();
var _result = `${name}`; 
_ruleExit ("tfpd");
return _result; 
},
            
pname : function (_c,_cs) { 
_ruleEnter ("pname");

var c = _c._glue ();
var cs = _cs._glue ().join ('');
var _result = `${c}${cs}`; 
_ruleExit ("pname");
return _result; 
},
            
rewrites : function (_rwstr) { 
_ruleEnter ("rewrites");

var rwstr = _rwstr._glue ();
var _result = `${rwstr}`; 
_ruleExit ("rewrites");
return _result; 
},
            
rw1 : function (__lbb,_ws1,_rwn,__rbb,_ws2) { 
_ruleEnter ("rw1");

var _lbb = __lbb._glue ();
var ws1 = _ws1._glue ().join ('');
var rwn = _rwn._glue ();
var _rbb = __rbb._glue ();
var ws2 = _ws2._glue ().join ('');
var _result = `${rwn}`; 
_ruleExit ("rw1");
return _result; 
},
            
rw2 : function (_rws) { 
_ruleEnter ("rw2");

var rws = _rws._glue ();
var _result = `${rws}`; 
_ruleExit ("rw2");
return _result; 
},
            
letter1 : function (_c) { 
_ruleEnter ("letter1");

var c = _c._glue ();
var _result = `${c}`; 
_ruleExit ("letter1");
return _result; 
},
            
letterRest : function (_c) { 
_ruleEnter ("letterRest");

var c = _c._glue ();
var _result = `${c}`; 
_ruleExit ("letterRest");
return _result; 
},
            
ws : function (_c) { 
_ruleEnter ("ws");

var c = _c._glue ();
var _result = `${c}`; 
_ruleExit ("ws");
return _result; 
},
            
delimiter : function (_c) { 
_ruleEnter ("delimiter");

var c = _c._glue ();
var _result = ``; 
_ruleExit ("delimiter");
return _result; 
},
            
rwstring : function (_sc) { 
_ruleEnter ("rwstring");

var sc = _sc._glue ().join ('');
var _result = `${sc}`; 
_ruleExit ("rwstring");
return _result; 
},
            
stringchar : function (_c) { 
_ruleEnter ("stringchar");

var c = _c._glue ();
var _result = `${c}`; 
_ruleExit ("stringchar");
return _result; 
},
            
rwstringWithNewlines : function (_cs) { 
_ruleEnter ("rwstringWithNewlines");

var cs = _cs._glue ().join ('');
var _result = `${cs}`; 
_ruleExit ("rwstringWithNewlines");
return _result; 
},
            
nlstringchar : function (_c) { 
_ruleEnter ("nlstringchar");

var c = _c._glue ();
var _result = `${c}`; 
_ruleExit ("nlstringchar");
return _result; 
},
            
codeString : function (_rwsn) { 
_ruleEnter ("codeString");

var rwsn = _rwsn._glue ();
var _result = `${rwsn}`; 
_ruleExit ("codeString");
return _result; 
},
            
code : function (__lb,_ws1,_s,__rb,_ws2) { 
_ruleEnter ("code");

var _lb = __lb._glue ();
var ws1 = _ws1._glue ().join ('');
var s = _s._glue ();
var _rb = __rb._glue ();
var ws2 = _ws2._glue ().join ('');
var _result = `${s}`; 
_ruleExit ("code");
return _result; 
},
            
_terminal: function () { return this.primitiveValue; }
}); 
}

function main () {
    // usage: node glue <file
    // reads grammar from "glue.ohm" 
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
console.log(`'use strict'`);
console.log(`
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
	for (; i > 0 ; i -= 1) {
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
	for (; i > 0 ; i -= 1) {
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
`);
console.log('_ruleInit ();');
console.log (resultString);
