domainRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/opt/working_dir/privatesky/builds/tmp/domain_intermediar.js":[function(require,module,exports){
(function (global){
global.domainLoadModules = function(){ 

	if(typeof $$.__runtimeModules["example"] === "undefined"){
		$$.__runtimeModules["example"] = require("example");
	}
}
if (true) {
	domainLoadModules();
}; 
global.domainRequire = require;
if (typeof $$ !== "undefined") {            
    $$.requireBundle("domain");
    };
    
    
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"example":"example"}],"example":[function(require,module,exports){
$$.swarms.describe("Echo",{
    say: function(input){
        this.return(null, "Echo: "+ input);
    }
});

},{}]},{},["/opt/working_dir/privatesky/builds/tmp/domain_intermediar.js"])