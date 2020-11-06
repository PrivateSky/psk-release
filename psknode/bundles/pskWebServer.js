pskWebServerRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/travis/build/PrivateSky/privatesky/builds/tmp/pskWebServer.js":[function(require,module,exports){
if(typeof $$ === "undefined" || !$$.environmentType) {
    const or = require('overwrite-require');
    or.enableForEnvironment(or.constants.NODEJS_ENVIRONMENT_TYPE);
} else {
    console.log('VirtualMQ running in test environment');
}

require("./pskWebServer_intermediar");
},{"./pskWebServer_intermediar":"/home/travis/build/PrivateSky/privatesky/builds/tmp/pskWebServer_intermediar.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/builds/tmp/pskWebServer_intermediar.js":[function(require,module,exports){
(function (global){(function (){
global.pskWebServerLoadModules = function(){ 

	if(typeof $$.__runtimeModules["overwrite-require"] === "undefined"){
		$$.__runtimeModules["overwrite-require"] = require("overwrite-require");
	}

	if(typeof $$.__runtimeModules["pskcrypto"] === "undefined"){
		$$.__runtimeModules["pskcrypto"] = require("pskcrypto");
	}

	if(typeof $$.__runtimeModules["psk-cache"] === "undefined"){
		$$.__runtimeModules["psk-cache"] = require("psk-cache");
	}

	if(typeof $$.__runtimeModules["opendsu"] === "undefined"){
		$$.__runtimeModules["opendsu"] = require("opendsu");
	}

	if(typeof $$.__runtimeModules["bdns"] === "undefined"){
		$$.__runtimeModules["bdns"] = require("bdns");
	}

	if(typeof $$.__runtimeModules["dossier"] === "undefined"){
		$$.__runtimeModules["dossier"] = require("dossier");
	}

	if(typeof $$.__runtimeModules["key-ssi-resolver"] === "undefined"){
		$$.__runtimeModules["key-ssi-resolver"] = require("key-ssi-resolver");
	}

	if(typeof $$.__runtimeModules["psk-apihub"] === "undefined"){
		$$.__runtimeModules["psk-apihub"] = require("psk-apihub");
	}

	if(typeof $$.__runtimeModules["buffer-crc32"] === "undefined"){
		$$.__runtimeModules["buffer-crc32"] = require("buffer-crc32");
	}

	if(typeof $$.__runtimeModules["node-fd-slicer"] === "undefined"){
		$$.__runtimeModules["node-fd-slicer"] = require("node-fd-slicer");
	}

	if(typeof $$.__runtimeModules["edfs-middleware"] === "undefined"){
		$$.__runtimeModules["edfs-middleware"] = require("edfs-middleware");
	}

	if(typeof $$.__runtimeModules["psk-http-client"] === "undefined"){
		$$.__runtimeModules["psk-http-client"] = require("psk-http-client");
	}

	if(typeof $$.__runtimeModules["zmq_adapter"] === "undefined"){
		$$.__runtimeModules["zmq_adapter"] = require("zmq_adapter");
	}

	if(typeof $$.__runtimeModules["swarmutils"] === "undefined"){
		$$.__runtimeModules["swarmutils"] = require("swarmutils");
	}

	if(typeof $$.__runtimeModules["callflow"] === "undefined"){
		$$.__runtimeModules["callflow"] = require("callflow");
	}

	if(typeof $$.__runtimeModules["queue"] === "undefined"){
		$$.__runtimeModules["queue"] = require("queue");
	}

	if(typeof $$.__runtimeModules["soundpubsub"] === "undefined"){
		$$.__runtimeModules["soundpubsub"] = require("soundpubsub");
	}

	if(typeof $$.__runtimeModules["psk-security-context"] === "undefined"){
		$$.__runtimeModules["psk-security-context"] = require("psk-security-context");
	}

	if(typeof $$.__runtimeModules["dsu-wizard"] === "undefined"){
		$$.__runtimeModules["dsu-wizard"] = require("dsu-wizard");
	}
};
if (false) {
	pskWebServerLoadModules();
}
global.pskWebServerRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("pskWebServer");
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"bdns":"bdns","buffer-crc32":"buffer-crc32","callflow":"callflow","dossier":"dossier","dsu-wizard":"dsu-wizard","edfs-middleware":"edfs-middleware","key-ssi-resolver":"key-ssi-resolver","node-fd-slicer":"node-fd-slicer","opendsu":"opendsu","overwrite-require":"overwrite-require","psk-apihub":"psk-apihub","psk-cache":"psk-cache","psk-http-client":"psk-http-client","psk-security-context":"psk-security-context","pskcrypto":"pskcrypto","queue":"queue","soundpubsub":"soundpubsub","swarmutils":"swarmutils","zmq_adapter":"zmq_adapter"}],"/home/travis/build/PrivateSky/privatesky/modules/bdns/lib/BDNS.js":[function(require,module,exports){
function BDNS() {
    let hosts;

    const initialize = () => {
        if (typeof hosts !== "undefined") {
            return;
        }

        let initializeFn = require("./configStrategies").init;
        hosts = initializeFn();
    };

    this.getRawInfo = (dlDomain, callback) => {
        const rawInfo = hosts[dlDomain];
        if (typeof rawInfo === "undefined") {
            //TODO: send swarm to parent's BDNS

            callback(`[BDNS] - Unknown configuration for ${dlDomain}.`);
        } else {
            callback(undefined, rawInfo);
        }
    };

    this.getNotificationEndpoints = (dlDomain, callback) => {
        this.getRawInfo(dlDomain, (err, rawInfo) => {
            if (err || typeof rawInfo.notifications === "undefined") {
                return callback(err ? err : "Notification endpoints not available");
            }
            callback(undefined, rawInfo.notifications);
        });
    }

    this.getMQEndpoints = (dlDomain, callback) => {
        this.getRawInfo(dlDomain, (err, rawInfo) => {
            if (err || typeof rawInfo.mq === "undefined") {
                return callback(err ? err : "Message Queue endpoints not available");
            }
            callback(undefined, rawInfo.mq);
        });
    }

    this.getBrickStorages = (dlDomain, callback) => {
        this.getRawInfo(dlDomain, (err, rawInfo) => {
            if (err || typeof rawInfo.brickStorages === "undefined") {
                return callback(err ? err : "Brick Storages not available");
            }
            callback(undefined, rawInfo.brickStorages);
        });
    };

    this.getAnchoringServices = (dlDomain, callback) => {
        this.getRawInfo(dlDomain, (err, rawInfo) => {
            if (err || typeof rawInfo.anchoringServices === "undefined") {
                return callback(err ? err : "Anchoring Services not available");
            }
            callback(undefined, rawInfo.anchoringServices);
        });
    };

    this.getReplicas = (dlDomain, callback) => {
        this.getRawInfo(dlDomain, (err, rawInfo) => {
            if (err || typeof rawInfo.replicas === "undefined") {
                return callback(err ? err : "Domain replicas not available");
            }
            callback(undefined, rawInfo.replicas);
        });
    };

    this.addRawInfo = (dlDomain, rawInfo) => {
        hosts[dlDomain] = rawInfo;
    };

    this.addAnchoringServices = (dlDomain, anchoringServices) => {
        if (typeof hosts[dlDomain] === "undefined") {
            hosts[dlDomain] = {};
            hosts[dlDomain].anchoringServices = [];
        }

        if (typeof anchoringServices === "string") {
            anchoringServices = [anchoringServices];
        }

        if (!Array.isArray(anchoringServices)) {
            throw Error(`Invalid brick storages format. Expected string or array. Received ${typeof anchoringServices}`)
        }

        hosts[dlDomain].anchoringServices = hosts[dlDomain].anchoringServices.concat(anchoringServices);
    };

    this.addBrickStorages = (dlDomain, brickStorages) => {
        if (typeof hosts[dlDomain] === "undefined") {
            hosts[dlDomain] = {};
            hosts[dlDomain].brickStorages = [];
        }

        if (typeof brickStorages === "string") {
            brickStorages = [brickStorages];
        }

        if (!Array.isArray(brickStorages)) {
            throw Error(`Invalid brick storages format. Expected string or array. Received ${typeof brickStorages}`)
        }

        hosts[dlDomain].brickStorages = hosts[dlDomain].brickStorages.concat(brickStorages);
    };

    this.addReplicas = (dlDomain, replicas) => {
        if (typeof hosts[dlDomain] === "undefined") {
            hosts[dlDomain] = {};
            hosts[dlDomain].replicas = [];
        }

        if (typeof replicas === "string") {
            replicas = [replicas];
        }

        if (!Array.isArray(replicas)) {
            throw Error(`Invalid brick storages format. Expected string or array. Received ${typeof replicas}`)
        }

        hosts[dlDomain].replicas = hosts[dlDomain].replicas.concat(replicas);
    };

    initialize();
}

module.exports = BDNS;
},{"./configStrategies":"/home/travis/build/PrivateSky/privatesky/modules/bdns/lib/configStrategies/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/bdns/lib/configStrategies/index.js":[function(require,module,exports){
let or = require("overwrite-require");
const domain = "default";
const defaultURL = "http://localhost:8080";

function buildConfig(domainName, url) {
	let config = {};
	config[domainName] = {
		"replicas": [],
		"brickStorages": [url],
		"anchoringServices": [url]
	};
	return config;
}

function defaultConfigInit() {
	let hosts = buildConfig(domain, "http://localhost:8080");
	return hosts;
}

function browserConfigInit() {
	const protocol = window.location.protocol;
	const host = window.location.hostname;
	const port = window.location.port;

	let url = `${protocol}//${host}:${port}`;
	return buildConfig(domain, url);
}

function swConfigInit() {
	let scope = self.registration.scope;

	let parts = scope.split("/");
	let url  = parts[0] + "//" + parts[2];

	return buildConfig(domain, url);
}

function nodeConfigInit() {
	let hosts;
	try {
		const path = require("swarmutils").path;
		const FILE_PATH = path.join(process.env.PSK_CONFIG_LOCATION, "BDNS.hosts.json");
		hosts = require(FILE_PATH);
	} catch (e) {
		console.log("BDNS config file not found. Using defaults.");
		hosts = buildConfig(domain, defaultURL);
	}
	return hosts;
}

let result = {};
switch ($$.environmentType) {
	case or.constants.BROWSER_ENVIRONMENT_TYPE:
		result.init = browserConfigInit;
		break;
	case or.constants.SERVICE_WORKER_ENVIRONMENT_TYPE:
		result.init = swConfigInit;
		break;
	case or.constants.NODEJS_ENVIRONMENT_TYPE:
		result.init = nodeConfigInit;
		break;
	default:
		result.init = defaultConfigInit;
}

module.exports = result;
},{"overwrite-require":"overwrite-require","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/callflow/constants.js":[function(require,module,exports){
$$.CONSTANTS = {
    SWARM_FOR_EXECUTION:"swarm_for_execution",//TODO: remove
    INBOUND:"inbound",//TODO: remove
    OUTBOUND:"outbound",//TODO: remove
    PDS:"PrivateDataSystem", //TODO: remove
    CRL:"CommunicationReplicationLayer", //TODO: remove
    SWARM_RETURN: 'swarm_return', //TODO: remove
    BEFORE_INTERCEPTOR: 'before',//TODO: document
    AFTER_INTERCEPTOR: 'after'//TODO: document
};


$$.CONSTANTS.mixIn = function(otherConstants){
    for(let v in otherConstants){
        if($$.CONSTANTS[v] && $$.CONSTANTS[v] !== otherConstants[v]){
            $$.warn("Overwriting CONSTANT "+ v + " previous value " + $$.CONSTANTS[v] + "new value " + otherConstants[v]);
        }
        $$.CONSTANTS[v] = otherConstants[v];
    }
}

},{}],"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/InterceptorRegistry.js":[function(require,module,exports){
(function (global){(function (){
// related to: SwarmSpace.SwarmDescription.createPhase()

function InterceptorRegistry() {
    const rules = new Map();

     global._CLASS_NAME = 'InterceptorRegistry';

    /************* PRIVATE METHODS *************/

    function _throwError(err, msg) {
        console.error(err.message, `${_CLASS_NAME} error message:`, msg);
        throw err;
    }

    function _warning(msg) {
        console.warn(`${_CLASS_NAME} warning message:`, msg);
    }

    const getWhenOptions = (function () {
        let WHEN_OPTIONS;
        return function () {
            if (WHEN_OPTIONS === undefined) {
                WHEN_OPTIONS = Object.freeze([
                    $$.CONSTANTS.BEFORE_INTERCEPTOR,
                    $$.CONSTANTS.AFTER_INTERCEPTOR
                ]);
            }
            return WHEN_OPTIONS;
        };
    })();

    function verifyWhenOption(when) {
        if (!getWhenOptions().includes(when)) {
            _throwError(new RangeError(`Option '${when}' is wrong!`),
                `it should be one of: ${getWhenOptions()}`);
        }
    }

    function verifyIsFunctionType(fn) {
        if (typeof fn !== 'function') {
            _throwError(new TypeError(`Parameter '${fn}' is wrong!`),
                `it should be a function, not ${typeof fn}!`);
        }
    }

    function resolveNamespaceResolution(swarmTypeName) {
        if (swarmTypeName === '*') {
            return swarmTypeName;
        }

        return (swarmTypeName.includes(".") ? swarmTypeName : ($$.libraryPrefix + "." + swarmTypeName));
    }

    /**
     * Transforms an array into a generator with the particularity that done is set to true on the last element,
     * not after it finished iterating, this is helpful in optimizing some other functions
     * It is useful if you want call a recursive function over the array elements but without popping the first
     * element of the Array or sending the index as an extra parameter
     * @param {Array<*>} arr
     * @return {IterableIterator<*>}
     */
    function* createArrayGenerator(arr) {
        const len = arr.length;

        for (let i = 0; i < len - 1; ++i) {
            yield arr[i];
        }

        return arr[len - 1];
    }

    /**
     * Builds a tree like structure over time (if called on the same root node) where internal nodes are instances of
     * Map containing the name of the children nodes (each child name is the result of calling next on `keysGenerator)
     * and a reference to them and on leafs it contains an instance of Set where it adds the function given as parameter
     * (ex: for a keyGenerator that returns in this order ("key1", "key2") the resulting structure will be:
     * {"key1": {"key1": Set([fn])}} - using JSON just for illustration purposes because it's easier to represent)
     * @param {Map} rulesMap
     * @param {IterableIterator} keysGenerator - it has the particularity that done is set on last element, not after it
     * @param {function} fn
     */
    function registerRecursiveRule(rulesMap, keysGenerator, fn) {
        const {value, done} = keysGenerator.next();

        if (!done) { // internal node
            const nextKey = rulesMap.get(value);

            if (typeof nextKey === 'undefined') { // if value not found in rulesMap
                rulesMap.set(value, new Map());
            }

            registerRecursiveRule(rulesMap.get(value), keysGenerator, fn);
        } else { // reached leaf node
            if (!rulesMap.has(value)) {

                rulesMap.set(value, new Set([fn]));
            } else {
                const set = rulesMap.get(value);

                if (set.has(fn)) {
                    _warning(`Duplicated interceptor for '${key}'`);
                }

                set.add(fn);
            }
        }
    }

    /**
     * Returns the corresponding set of functions for the given key if found
     * @param {string} key - formatted as a path without the first '/' (ex: swarmType/swarmPhase/before)
     * @return {Array<Set<function>>}
     */
    function getInterceptorsForKey(key) {
        if (key.startsWith('/')) {
            _warning(`Interceptor called on key ${key} starting with '/', automatically removing it`);
            key = key.substring(1);
        }

        const keyElements = key.split('/');
        const keysGenerator = createArrayGenerator(keyElements);

        return getValueRecursively([rules], keysGenerator);
    }

    /**
     * It works like a BFS search returning the leafs resulting from traversing the internal nodes with corresponding
     * names given for each level (depth) by `keysGenerator`
     * @param {Array<Map>} searchableNodes
     * @param {IterableIterator} keysGenerator - it has the particularity that done is set on last element, not after it
     * @return {Array<Set<function>>}
     */
    function getValueRecursively(searchableNodes, keysGenerator) {
        const {value: nodeName, done} = keysGenerator.next();

        const nextNodes = [];

        for (const nodeInRules of searchableNodes) {
            const nextNodeForAll = nodeInRules.get('*');
            const nextNode = nodeInRules.get(nodeName);

            if (typeof nextNode !== "undefined") {
                nextNodes.push(nextNode);
            }

            if (typeof nextNodeForAll !== "undefined") {
                nextNodes.push(nextNodeForAll);
            }

        }

        if (done) {
            return nextNodes;
        }

        return getValueRecursively(nextNodes, keysGenerator);
    }


    /************* PUBLIC METHODS *************/

    this.register = function (swarmTypeName, phaseName, when, fn) {
        verifyWhenOption(when);
        verifyIsFunctionType(fn);

        const resolvedSwarmTypeName = resolveNamespaceResolution(swarmTypeName);
        const keys = createArrayGenerator([resolvedSwarmTypeName, phaseName, when]);

        registerRecursiveRule(rules, keys, fn);
    };

    // this.unregister = function () { }

    this.callInterceptors = function (key, targetObject, args) {
        const interceptors = getInterceptorsForKey(key);

        if (interceptors) {
            for (const interceptorSet of interceptors) {
                for (const fn of interceptorSet) { // interceptors on key '*' are called before those specified by name
                    fn.apply(targetObject, args);
                }
            }
        }
    };
}


exports.createInterceptorRegistry = function () {
    return new InterceptorRegistry();
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/loadLibrary.js":[function(require,module,exports){
/*
Initial License: (c) Axiologic Research & Alboaie Sînică.
Contributors: Axiologic Research , PrivateSky project
Code License: LGPL or MIT.
*/

//var fs = require("fs");
//var path = require("path");


function SwarmLibrary(prefixName, folder){
    var self = this;
    function wrapCall(original, prefixName){
        return function(...args){
            //console.log("prefixName", prefixName)
            var previousPrefix = $$.libraryPrefix;
            var previousLibrary = $$.__global.currentLibrary;

            $$.libraryPrefix = prefixName;
            $$.__global.currentLibrary = self;
            try{
                var ret = original.apply(this, args);
                $$.libraryPrefix = previousPrefix ;
                $$.__global.currentLibrary = previousLibrary;
            }catch(err){
                $$.libraryPrefix = previousPrefix ;
                $$.__global.currentLibrary = previousLibrary;
                throw err;
            }
            return ret;
        }
    }

    $$.libraries[prefixName] = this;
    var prefixedRequire = wrapCall(function(path){
        return require(path);
    }, prefixName);

    function includeAllInRoot(folder) {
        if(typeof folder != "string"){
            //we assume that it is a library module properly required with require and containing $$.library
            for(var v in folder){
                $$.registerSwarmDescription(prefixName,v, prefixName + "." + v,  folder[v]);
            }

            var newNames = $$.__global.requireLibrariesNames[prefixName];
            for(var v in newNames){
                self[v] =  newNames[v];
            }
            return folder;
        }


        var res = prefixedRequire(folder); // a library is just a module
        if(typeof res.__autogenerated_privatesky_libraryName != "undefined"){
            var swarms = $$.__global.requireLibrariesNames[res.__autogenerated_privatesky_libraryName];
        } else {
            var swarms = $$.__global.requireLibrariesNames[folder];
        }
            var existingName;
            for(var v in swarms){
                existingName = swarms[v];
                self[v] = existingName;
                $$.registerSwarmDescription(prefixName,v, prefixName + "." + v,  existingName);
            }
        return res;
    }

    function wrapSwarmRelatedFunctions(space, prefixName){
        var ret = {};
        var names = ["create", "describe", "start", "restart"];
        for(var i = 0; i<names.length; i++ ){
            ret[names[i]] = wrapCall(space[names[i]], prefixName);
        }
        return ret;
    }

    this.callflows        = this.callflow   = wrapSwarmRelatedFunctions($$.callflows, prefixName);
    this.swarms           = this.swarm      = wrapSwarmRelatedFunctions($$.swarms, prefixName);

    includeAllInRoot(folder, prefixName);
}

exports.loadLibrary = function(prefixName, folder){
    var existing = $$.libraries[prefixName];
    if(existing ){
        if(!(existing instanceof SwarmLibrary)){
            var sL = new SwarmLibrary(prefixName, folder);
            for(var prop in existing){
                sL[prop] = existing[prop];
            }
            return sL;
        }
        if(folder) {
            $$.syntaxError("Reusing already loaded library " + prefixName + "could be an error!");
        }
        return existing;
    }
    //var absolutePath = path.resolve(folder);
    return new SwarmLibrary(prefixName, folder);
}


},{}],"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/parallelJoinPoint.js":[function(require,module,exports){

var globalJoinCounter = 0;

function ParallelJoinPoint(swarm, callback, args){
    globalJoinCounter++;
    var channelId = "ParallelJoinPoint" + globalJoinCounter;
    var self = this;
    var counter = 0;
    var stopOtherExecution     = false;

    function executionStep(stepFunc, localArgs, stop){

        this.doExecute = function(){
            if(stopOtherExecution){
                return false;
            }
            try{
                stepFunc.apply(swarm, localArgs);
                if(stop){
                    stopOtherExecution = true;
                    return false;
                }
                return true; //everyting is fine
            } catch(err){
                args.unshift(err);
                sendForSoundExecution(callback, args, true);
                return false; //stop it, do not call again anything
            }
        }
    }

    if(typeof callback !== "function"){
        $$.syntaxError("invalid join",swarm, "invalid function at join in swarm");
        return;
    }

    $$.PSK_PubSub.subscribe(channelId,function(forExecution){
        if(stopOtherExecution){
            return ;
        }

        try{
            if(forExecution.doExecute()){
                decCounter();
            } // had an error...
        } catch(err){
            $$.info(err);
            //$$.errorHandler.syntaxError("__internal__",swarm, "exception in the execution of the join function of a parallel task");
        }
    });

    function incCounter(){
        if(testIfUnderInspection()){
            //preventing inspector from increasing counter when reading the values for debug reason
            //console.log("preventing inspection");
            return;
        }
        counter++;
    }

    function testIfUnderInspection(){
        var res = false;
        var constArgv = process.execArgv.join();
        if(constArgv.indexOf("inspect")!==-1 || constArgv.indexOf("debug")!==-1){
            //only when running in debug
            var callstack = new Error().stack;
            if(callstack.indexOf("DebugCommandProcessor")!==-1){
                console.log("DebugCommandProcessor detected!");
                res = true;
            }
        }
        return res;
    }

    function sendForSoundExecution(funct, args, stop){
        var obj = new executionStep(funct, args, stop);
        $$.PSK_PubSub.publish(channelId, obj); // force execution to be "sound"
    }

    function decCounter(){
        counter--;
        if(counter == 0) {
            args.unshift(null);
            sendForSoundExecution(callback, args, false);
        }
    }

    var inner = swarm.getInnerValue();

    function defaultProgressReport(err, res){
        if(err) {
            throw err;
        }
        return {
            text:"Parallel execution progress event",
            swarm:swarm,
            args:args,
            currentResult:res
        };
    }

    function mkFunction(name){
        return function(...args){
            var f = defaultProgressReport;
            if(name != "progress"){
                f = inner.myFunctions[name];
            }
            var args = $$.__intern.mkArgs(args, 0);
            sendForSoundExecution(f, args, false);
            return __proxyObject;
        }
    }


    this.get = function(target, prop, receiver){
        if(inner.myFunctions.hasOwnProperty(prop) || prop == "progress"){
            incCounter();
            return mkFunction(prop);
        }
        return swarm[prop];
    };

    var __proxyObject;

    this.__setProxyObject = function(p){
        __proxyObject = p;
    }
}

exports.createJoinPoint = function(swarm, callback, args){
    var jp = new ParallelJoinPoint(swarm, callback, args);
    var inner = swarm.getInnerValue();
    var p = new Proxy(inner, jp);
    jp.__setProxyObject(p);
    return p;
};
},{}],"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/serialJoinPoint.js":[function(require,module,exports){

var joinCounter = 0;

function SerialJoinPoint(swarm, callback, args){

    joinCounter++;

    var self = this;
    var channelId = "SerialJoinPoint" + joinCounter;

    if(typeof callback !== "function"){
        $$.syntaxError("unknown", swarm, "invalid function given to serial in swarm");
        return;
    }

    var inner = swarm.getInnerValue();


    function defaultProgressReport(err, res){
        if(err) {
            throw err;
        }
        return res;
    }


    var functionCounter     = 0;
    var executionCounter    = 0;

    var plannedExecutions   = [];
    var plannedArguments    = {};

    function mkFunction(name, pos){
        //console.log("Creating function ", name, pos);
        plannedArguments[pos] = undefined;

        function triggetNextStep(){
            if(plannedExecutions.length == executionCounter || plannedArguments[executionCounter] )  {
                $$.PSK_PubSub.publish(channelId, self);
            }
        }

        var f = function (...args){
            if(executionCounter != pos) {
                plannedArguments[pos] = args;
                //console.log("Delaying function:", executionCounter, pos, plannedArguments, arguments, functionCounter);
                return __proxy;
            } else{
                if(plannedArguments[pos]){
                    //console.log("Executing  function:", executionCounter, pos, plannedArguments, arguments, functionCounter);
					args = plannedArguments[pos];
                } else {
                    plannedArguments[pos] = args;
                    triggetNextStep();
                    return __proxy;
                }
            }

            var f = defaultProgressReport;
            if(name != "progress"){
                f = inner.myFunctions[name];
            }


            try{
                f.apply(self,args);
            } catch(err){
                    args.unshift(err);
                    callback.apply(swarm,args); //error
                    $$.PSK_PubSub.unsubscribe(channelId,runNextFunction);
                return; //terminate execution with an error...!
            }
            executionCounter++;

            triggetNextStep();

            return __proxy;
        };

        plannedExecutions.push(f);
        functionCounter++;
        return f;
    }

     var finished = false;

    function runNextFunction(){
        if(executionCounter == plannedExecutions.length ){
            if(!finished){
                args.unshift(null);
                callback.apply(swarm,args);
                finished = true;
                $$.PSK_PubSub.unsubscribe(channelId,runNextFunction);
            } else {
                console.log("serial construct is using functions that are called multiple times...");
            }
        } else {
            plannedExecutions[executionCounter]();
        }
    }

    $$.PSK_PubSub.subscribe(channelId,runNextFunction); // force it to be "sound"


    this.get = function(target, prop, receiver){
        if(prop == "progress" || inner.myFunctions.hasOwnProperty(prop)){
            return mkFunction(prop, functionCounter);
        }
        return swarm[prop];
    }

    var __proxy;
    this.setProxyObject = function(p){
        __proxy = p;
    }
}

exports.createSerialJoinPoint = function(swarm, callback, args){
    var jp = new SerialJoinPoint(swarm, callback, args);
    var inner = swarm.getInnerValue();
    var p = new Proxy(inner, jp);
    jp.setProxyObject(p);
    return p;
}
},{}],"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/swarmDescription.js":[function(require,module,exports){
const OwM = require("swarmutils").OwM;

const swarmDescriptionsRegistry = {};
let currentInlineCounter = 0;

$$.registerSwarmDescription =  function(libraryName, shortName, swarmTypeName, description){
    if(!$$.libraries[libraryName]){
        $$.libraries[libraryName] = {};
    }

    if(!$$.__global.requireLibrariesNames[libraryName]){
        $$.__global.requireLibrariesNames[libraryName] = {};
    }

    $$.libraries[libraryName][shortName] = description;
    //console.log("Registering ", libraryName,shortName, $$.__global.currentLibraryName);
    if($$.__global.currentLibraryName){
        $$.__global.requireLibrariesNames[$$.__global.currentLibraryName][shortName] = libraryName + "." + shortName;
    }

    $$.__global.requireLibrariesNames[libraryName][shortName] = swarmTypeName;

    if(typeof description == "string"){
        description = swarmDescriptionsRegistry[description];
    }
    swarmDescriptionsRegistry[swarmTypeName] = description;
};


var currentLibraryCounter = 0;
$$.library = function(callback){
    currentLibraryCounter++;
    var previousCurrentLibrary = $$.__global.currentLibraryName;
    var libraryName = "___privatesky_library"+currentLibraryCounter;
    var ret = $$.__global.requireLibrariesNames[libraryName] = {};
    $$.__global.currentLibraryName = libraryName;
    callback();
    $$.__global.currentLibraryName = previousCurrentLibrary;
    ret.__autogenerated_privatesky_libraryName = libraryName;
    return ret;
};


$$.fixSwarmName = function(shortName){
    let fullName;
    try{
        if(shortName && shortName.includes(".")) {
            fullName = shortName;
        } else {
            fullName = $$.libraryPrefix + "." + shortName;
        }

    } catch(err){
        $$.err(err);
    }
    return fullName;
};

function SwarmSpace(swarmType, utils) {
    let beesHealer = require("swarmutils").beesHealer;

    function getFullName(shortName){
        return $$.fixSwarmName(shortName);
    }

    function VarDescription(desc){
        return {
            init:function(){
                return undefined;
            },
            restore:function(jsonString){
                return JSON.parse(jsonString);
            },
            toJsonString:function(x){
                return JSON.stringify();
            }
        };
    }

    function SwarmDescription(swarmTypeName, description){

        swarmTypeName = getFullName(swarmTypeName);

        var localId = 0;  // unique for each swarm

        function createVars(descr){
            var members = {};
            for(var v in descr){
                members[v] = new VarDescription(descr[v]);
            }
            return members;
        }

        function createMembers(descr){
            var members = {};
            for(var v in description){

                if(v != "public" && v != "private"){
                    members[v] = description[v];
                }
            }
            return members;
        }

        var publicVars = createVars(description.public);
        var privateVars = createVars(description.private);
        var myFunctions = createMembers(description);

        function createPhase(thisInstance, func, phaseName){
            var keyBefore = `${swarmTypeName}/${phaseName}/${$$.CONSTANTS.BEFORE_INTERCEPTOR}`;
            var keyAfter = `${swarmTypeName}/${phaseName}/${$$.CONSTANTS.AFTER_INTERCEPTOR}`;

            var phase = function(...args){
                var ret;
                try{
                    $$.PSK_PubSub.blockCallBacks();
                    thisInstance.setMetadata('phaseName', phaseName);
                    $$.interceptor.callInterceptors(keyBefore, thisInstance, args);
                    ret = func.apply(thisInstance, args);
                    $$.interceptor.callInterceptors(keyAfter, thisInstance, args);
                    $$.PSK_PubSub.releaseCallBacks();
                }catch(err){
                    $$.PSK_PubSub.releaseCallBacks();
                    throw err;
                }
                return ret;
            };
            //dynamic named func in order to improve callstack
            Object.defineProperty(phase, "name", {get: function(){return swarmTypeName+"."+func.name}});
            return phase;
        }

        this.initialise = function(serialisedValues){

            var result = new OwM({
                publicVars:{

                },
                privateVars:{

                },
                protectedVars:{

                },
                myFunctions:{

                },
                utilityFunctions:{

                },
                meta:{
                    swarmTypeName:swarmTypeName,
                    swarmDescription:description
                }
            });


            for(var v in publicVars){
                result.publicVars[v] = publicVars[v].init();
            }

            for(var v in privateVars){
                result.privateVars[v] = privateVars[v].init();
            }


            if(serialisedValues){
                beesHealer.jsonToNative(serialisedValues, result);
            }
            return result;
        };

        this.initialiseFunctions = function(valueObject, thisObject){

            for(var v in myFunctions){
                valueObject.myFunctions[v] = createPhase(thisObject, myFunctions[v], v);
            }

            localId++;
            valueObject.utilityFunctions = utils.createForObject(valueObject, thisObject, localId);

        };

        this.get = function(target, property, receiver){


            if(publicVars.hasOwnProperty(property))
            {
                return target.publicVars[property];
            }

            if(privateVars.hasOwnProperty(property))
            {
                return target.privateVars[property];
            }

            if(target.utilityFunctions.hasOwnProperty(property))
            {

                return target.utilityFunctions[property];
            }


            if(myFunctions.hasOwnProperty(property))
            {
                return target.myFunctions[property];
            }

            if(target.protectedVars.hasOwnProperty(property))
            {
                return target.protectedVars[property];
            }

            if(typeof property != "symbol") {
                $$.syntaxError(" Undefined symbol " + property + " in swarm " + target.meta.swarmTypeName);
            }
            return undefined;
        };

        this.set = function(target, property, value, receiver){

            if(target.utilityFunctions.hasOwnProperty(property) || target.myFunctions.hasOwnProperty(property)) {
                $$.syntaxError(property);
                throw new Error("Trying to overwrite immutable member" + property);
            }

            if(privateVars.hasOwnProperty(property))
            {
                target.privateVars[property] = value;
            } else
            if(publicVars.hasOwnProperty(property))
            {
                target.publicVars[property] = value;
            } else {
                target.protectedVars[property] = value;
            }
            return true;
        };

        this.apply = function(target, thisArg, argumentsList){
            console.log("Proxy apply");
            //var func = target[]
            //swarmGlobals.executionProvider.execute(null, thisArg, func, argumentsList)
        };

        var self = this;

        this.isExtensible = function(target) {
            return false;
        };

        this.has = function(target, prop) {
            if(target.publicVars[prop] || target.protectedVars[prop]) {
                return true;
            }
            return false;
        };

        this.ownKeys = function(target) {
            return Reflect.ownKeys(target.publicVars);
        };

        return function(serialisedValues, initialisationContext){
            var valueObject = self.initialise(serialisedValues);
            var result = new Proxy(valueObject,self);
            self.initialiseFunctions(valueObject,result);
			if(!serialisedValues){
				if(!valueObject.getMeta("swarmId")){
					valueObject.setMeta("swarmId", $$.uidGenerator.safe_uuid());  //do not overwrite!!!
				}
				valueObject.utilityFunctions.notify();
			}

			if(result.autoInit){
                result.autoInit(initialisationContext);
                $$.fixMe("Reinstate somehow the next comment")
                //result.autoInit = undefined;
            }
			return result;
        }
    }



    this.describe = function describeSwarm(swarmTypeName, description){
        swarmTypeName = getFullName(swarmTypeName);

        var pointPos = swarmTypeName.lastIndexOf('.');
        var shortName = swarmTypeName.substr( pointPos+ 1);
        var libraryName = swarmTypeName.substr(0, pointPos);
        if(!libraryName){
            libraryName = "global";
        }

        var description = new SwarmDescription(swarmTypeName, description);
        if(swarmDescriptionsRegistry[swarmTypeName] != undefined){
            $$.warn("Duplicate swarm description "+ swarmTypeName);
        }

        swarmDescriptionsRegistry[swarmTypeName] = description;
		//$$.registerSwarmDescription(libraryName, shortName, swarmTypeName, description);
        return description;
    };


    var self = this;
    $$.fixMe("This could generate memory leaks. Fix it later");
    this.inline = function inline(description, ...args){
        currentInlineCounter++;
        var desc = self.describe("inlineSwarm" + currentInlineCounter, description);
        var flow = desc();
        flow.start(...args);
        return flow;
    };

    this.create = function(){
        $$.err("Create APIs for creation of swarms was  removed. Use describe!");
    };

    this.continue = function(swarmTypeName, initialValues){
        if(!initialValues){
            initialValues = swarmTypeName;
            swarmTypeName = initialValues.meta.swarmTypeName;
        }

        swarmTypeName = getFullName(swarmTypeName);
        let desc = swarmDescriptionsRegistry[swarmTypeName];
        if(desc){
            return desc(initialValues);
        } else {
            $$.err(swarmTypeName,initialValues,
                "Failed to restart a swarm with type " + swarmTypeName + "\n Maybe different swarm space (used flow instead of swarm!?)");
        }
    };

    this.start = function(swarmTypeName, ctor, ...params){
        let ret = this.startWithContext(undefined, swarmTypeName, ctor, ...params);
        return ret;
    };

    this.startWithContext = function(context, swarmTypeName, ctor, ...params){
        swarmTypeName = getFullName(swarmTypeName);
        var desc = swarmDescriptionsRegistry[swarmTypeName];
        if(!desc){
            $$.syntaxError(null, swarmTypeName);
            return null;
        }
        let res = desc(undefined, context);
        res.setMetadata("homeSecurityContext", $$.securityContext);

        if(ctor){
            res[ctor].apply(res, params);
        }

        return res;
    }
}

exports.createSwarmEngine = function(swarmType, utils){
    if(typeof utils == "undefined"){
        utils = require("./utilityFunctions/callflow");
    }
    return new SwarmSpace(swarmType, utils);
};


},{"./utilityFunctions/callflow":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/utilityFunctions/callflow.js","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/utilityFunctions/SwarmDebug.js":[function(require,module,exports){
(function (global){(function (){
/*
 Initial License: (c) Axiologic Research & Alboaie Sînică.
 Contributors: Axiologic Research , PrivateSky project
 Code License: LGPL or MIT.
 */

var util = require("util");
global.cprint = console.log;
global.wprint = console.warn;
global.dprint = console.debug;
global.eprint = console.error;


/**
 * Shortcut to JSON.stringify
 * @param obj
 */
global.J = function (obj) {
    return JSON.stringify(obj);
}


/**
 * Print swarm contexts (Messages) and easier to read compared with J
 * @param obj
 * @return {string}
 */
exports.cleanDump = function (obj) {
    var o = obj.valueOf();
    var meta = {
        swarmTypeName:o.meta.swarmTypeName
    };
    return "\t swarmId: " + o.meta.swarmId + "{\n\t\tmeta: "    + J(meta) +
        "\n\t\tpublic: "        + J(o.publicVars) +
        "\n\t\tprotected: "     + J(o.protectedVars) +
        "\n\t\tprivate: "       + J(o.privateVars) + "\n\t}\n";
}

//M = exports.cleanDump;
/**
 * Experimental functions
 */


/*

 logger      = monitor.logger;
 assert      = monitor.assert;
 throwing    = monitor.exceptions;


 var temporaryLogBuffer = [];

 var currentSwarmComImpl = null;

 logger.record = function(record){
 if(currentSwarmComImpl===null){
 temporaryLogBuffer.push(record);
 } else {
 currentSwarmComImpl.recordLog(record);
 }
 }

 var container = require("dicontainer").container;

 container.service("swarmLoggingMonitor", ["swarmingIsWorking", "swarmComImpl"], function(outOfService,swarming, swarmComImpl){

 if(outOfService){
 if(!temporaryLogBuffer){
 temporaryLogBuffer = [];
 }
 } else {
 var tmp = temporaryLogBuffer;
 temporaryLogBuffer = [];
 currentSwarmComImpl = swarmComImpl;
 logger.record = function(record){
 currentSwarmComImpl.recordLog(record);
 }

 tmp.forEach(function(record){
 logger.record(record);
 });
 }
 })

 */
global.uncaughtExceptionString = "";
global.uncaughtExceptionExists = false;
if(typeof globalVerbosity == 'undefined'){
    global.globalVerbosity = false;
}

var DEBUG_START_TIME = new Date().getTime();

function getDebugDelta(){
    var currentTime = new Date().getTime();
    return currentTime - DEBUG_START_TIME;
}

/**
 * Debug functions, influenced by globalVerbosity global variable
 * @param txt
 */
global.dprint = function (txt) {
    if (globalVerbosity == true) {
        if (thisAdapter.initilised ) {
            console.log("DEBUG: [" + thisAdapter.nodeName + "](" + getDebugDelta()+ "):"+txt);
        }
        else {
            console.log("DEBUG: (" + getDebugDelta()+ "):"+txt);
            console.log("DEBUG: " + txt);
        }
    }
}

/**
 * obsolete!?
 * @param txt
 */
global.aprint = function (txt) {
    console.log("DEBUG: [" + thisAdapter.nodeName + "]: " + txt);
}



/**
 * Utility function usually used in tests, exit current process after a while
 * @param msg
 * @param timeout
 */
global.delayExit = function (msg, retCode,timeout) {
    if(retCode == undefined){
        retCode = ExitCodes.UnknownError;
    }

    if(timeout == undefined){
        timeout = 100;
    }

    if(msg == undefined){
        msg = "Delaying exit with "+ timeout + "ms";
    }

    console.log(msg);
    setTimeout(function () {
        process.exit(retCode);
    }, timeout);
}


function localLog (logType, message, err) {
    var fs = require("fs");
    var time = new Date();
    var now = time.getDate() + "-" + (time.getMonth() + 1) + "," + time.getHours() + ":" + time.getMinutes();
    var msg;

    msg = '[' + now + '][' + thisAdapter.nodeName + '] ' + message;

    if (err != null && err != undefined) {
        msg += '\n     Err: ' + err.toString();
        if (err.stack && err.stack != undefined)
            msg += '\n     Stack: ' + err.stack + '\n';
    }

    cprint(msg);
    if(thisAdapter.initilised){
        try{
            fs.appendFileSync(getSwarmFilePath(thisAdapter.config.logsPath + "/" + logType), msg);
        } catch(err){
            console.log("Failing to write logs in ", thisAdapter.config.logsPath );
        }

    }
}


// printf = function (...params) {
//     var args = []; // empty array
//     // copy all other arguments we want to "pass through"
//     for (var i = 0; i < params.length; i++) {
//         args.push(params[i]);
//     }
//     var out = util.format.apply(this, args);
//     console.log(out);
// }
//
// sprintf = function (...params) {
//     var args = []; // empty array
//     for (var i = 0; i < params.length; i++) {
//         args.push(params[i]);
//     }
//     return util.format.apply(this, args);
// }


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"fs":false,"util":false}],"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/utilityFunctions/base.js":[function(require,module,exports){
var beesHealer = require("swarmutils").beesHealer;
var swarmDebug = require("./SwarmDebug");

exports.createForObject = function(valueObject, thisObject, localId){
	let ret = {};


	function getInnerValue(){
		return valueObject;
	}

	function runPhase(functName, args){
		var func = valueObject.myFunctions[functName];
		if(func){
			func.apply(thisObject, args);
		} else {
			$$.syntaxError(functName, valueObject, "Function " + functName + " does not exist!");
		}

	}

	function update(serialisation){
		beesHealer.jsonToNative(serialisation,valueObject);
	}


	function valueOf(){
		var ret = {};
		ret.meta                = valueObject.meta;
		ret.publicVars          = valueObject.publicVars;
		ret.privateVars         = valueObject.privateVars;
		ret.protectedVars       = valueObject.protectedVars;
		return ret;
	}

	function toString (){
		return swarmDebug.cleanDump(thisObject.valueOf());
	}


	function createParallel(callback){
		return require("../parallelJoinPoint").createJoinPoint(thisObject, callback, $$.__intern.mkArgs(arguments,1));
	}

	function createSerial(callback){
		return require("../serialJoinPoint").createSerialJoinPoint(thisObject, callback, $$.__intern.mkArgs(arguments,1));
	}

	function inspect(){
		return swarmDebug.cleanDump(thisObject.valueOf());
	}

	function constructor(){
		return SwarmDescription;
	}

	function ensureLocalId(){
		if(!valueObject.localId){
			valueObject.localId = valueObject.meta.swarmTypeName + "-" + localId;
			localId++;
		}
	}

	function observe(callback, waitForMore, messageIdentityFilter){
		if(!waitForMore){
			waitForMore = function (){
				return false;
			}
		}

		ensureLocalId();

		$$.PSK_PubSub.subscribe(valueObject.localId, callback, waitForMore, messageIdentityFilter);
	}

	function toJSON(prop){
		//preventing max call stack size exceeding on proxy auto referencing
		//replace {} as result of JSON(Proxy) with the string [Object protected object]
		return "[Object protected object]";
	}

	function getJSON(callback){
		return	beesHealer.asJSON(valueObject, null, null,callback);
	}

	function notify(event){
		if(!event){
			event = valueObject;
		}
		ensureLocalId();

		setTimeout(()=>{
			$$.PSK_PubSub.publish(valueObject.localId, event);
		});
	}

	function getMeta(name){
		return valueObject.getMeta(name);
	}

	function setMeta(name, value){
		return valueObject.setMeta(name, value);
	}

	ret.setMeta			= setMeta;
	ret.getMeta			= getMeta;

	ret.notify          = notify;
	ret.getJSON    	    = getJSON;
	ret.toJSON          = toJSON;
	ret.observe         = observe;
	ret.inspect         = inspect;
	ret.join            = createParallel;
	ret.parallel        = createParallel;
	ret.serial          = createSerial;
	ret.valueOf         = valueOf;
	ret.actualize       = update;
	ret.runPhase        = runPhase;


	ret.getInnerValue   = getInnerValue;
	ret.toString        = toString;
	ret.constructor     = constructor;
	ret.setMetadata		= valueObject.setMeta.bind(valueObject);
	ret.getMetadata		= valueObject.getMeta.bind(valueObject);

	ret.autoInit		= null;
	return ret;

};

},{"../parallelJoinPoint":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/parallelJoinPoint.js","../serialJoinPoint":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/serialJoinPoint.js","./SwarmDebug":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/utilityFunctions/SwarmDebug.js","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/utilityFunctions/callflow.js":[function(require,module,exports){
exports.createForObject = function(valueObject, thisObject, localId){
	var ret = require("./base").createForObject(valueObject, thisObject, localId);
	return ret;
};
},{"./base":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/utilityFunctions/base.js"}],"/home/travis/build/PrivateSky/privatesky/modules/dossier/lib/RawDossier.js":[function(require,module,exports){
function RawDossier(bar) {
    Object.assign(this, bar);
}

module.exports = RawDossier;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/CommandRegistry.js":[function(require,module,exports){
function CommandRegistry(server){
	const URL_PREFIX = require("./constants").URL_PREFIX;

	this.register = (url, method, commandFactory)=>{
		const fullUrl = URL_PREFIX+url+"/:transactionId";
		console.log("Registering url", fullUrl, method);
		server[method](fullUrl, (req, res)=>{
			commandFactory(req, (err, command)=>{
				if(err){
					console.log(err);
					res.statusCode = 500;
					return res.end();
				}

				const transactionManager = require("./TransactionManager");
				transactionManager.addCommandToTransaction(req.params.transactionId, command, (err)=>{
					if(err){
						console.log(err);
						res.statusCode = 500;
						return res.end();
					}

					res.statusCode = 200;
					res.end();
				});
			});
		});
	}
}

module.exports = {
	getRegistry : function(server){
		return new CommandRegistry(server);
	}
};
},{"./TransactionManager":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/TransactionManager.js","./constants":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/constants.js"}],"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/TransactionManager.js":[function(require,module,exports){
transactions = {};

function TransactionsManager(){

	this.beginTransaction = function(callback){
		const crypto = require("pskcrypto");
		const Queue = require("swarmutils").Queue;
		const randSize = require("./constants").transactionIdLength;

		let transactionId = crypto.randomBytes(randSize).toString('hex');
		transactions[transactionId] = {
			id: transactionId,
			commands: new Queue(),
			context: {
				result: {},
				domain: "default",
				options: {useSSIAsIdentifier: false}
			}
		}
		return callback(undefined, transactionId);
	}

	this.getTransaction = function(transactionId){
		return transactions[transactionId];
	}

	this.addCommandToTransaction = function(transactionId, command, callback){
		let transaction = transactions[transactionId];
		if(!transaction){
			callback('Transaction could not be found');
		}

		if(typeof command.execute !== "function"){
			callback('Wrong type of the argument called command');
		}

		transaction.commands.push(command);
		return callback();
	}

	this.closeTransaction = function(transactionId, callback){
		let transaction = transactions[transactionId];
		if(!transaction){
			callback('Transaction could not be found');
		}

		function executeCommand(){
			let command = transaction.commands.pop();
			if(!command){
				if(transaction.commands.length === 0){
					return transaction.context.dsu.getKeySSI(callback);
				}
			}

			command.execute(transaction.context, (err)=>{
				if(err){
					return callback(err);
				}

				executeCommand();
			});
		}

		const openDSU = require("opendsu");
		const keyssi = openDSU.loadApi("keyssi");

		if(typeof transaction.context.keySSI === "undefined"){
			transaction.context.keySSI = keyssi.buildSeedSSI(transaction.context.domain);
		}
		openDSU.loadApi("resolver").createDSU(transaction.context.keySSI, transaction.context.options, (err, dsu)=>{
			if(err){
				return callback(err);
			}
			transaction.context.dsu = dsu;

			//start executing the stored commands from transaction
			executeCommand();
		});
	}
}

module.exports = new TransactionsManager();
},{"./constants":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/constants.js","opendsu":"opendsu","pskcrypto":"pskcrypto","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/addFile.js":[function(require,module,exports){
function AddFile(server){
	const pathName = "path";
	const path = require(pathName);
	const fsName = "fs";
	const fs = require(fsName);
	const osName = "os";
	const os = require(osName);

	const utils = require("../utils");

	function createAddFileCommand(filePath, dossierPath){
		const command = {
			execute: function(context, callback){
				context.dsu.addFile(filePath, dossierPath, (err)=>{
					if(err){
						return callback(err);
					}
					//once the file is added into dossier we remove it.
					fs.unlink(filePath, ()=>{
						//we ignore errors that can appear during unlink on windows machines
						return callback();
					});
				});
			}
		}

		return command;
	}

	const commandRegistry = require("../CommandRegistry").getRegistry(server);
	commandRegistry.register("/addFile", "post", (req, callback)=>{
		utils.formDataParser(req, (err, formData)=>{
			if(err){
				return callback(err);
			}
			if(formData.length === 0){
				return callback('No files found');
			}

			let fileContent = formData[0].content;
			const crypto = require("pskcrypto");

			const dossierPath = req.headers["x-dossier-path"];
			let tempFileName = crypto.randomBytes(10).toString('hex');

			fs.mkdtemp(path.join(os.tmpdir(), req.params.transactionId), (err, directory) => {
				if (err){
					return callback(err);
				}

				const tempFilePath = path.join(directory, tempFileName);
				const file = fs.createWriteStream(tempFilePath);

				/*file.on('close', () => {
					return callback(undefined, createAddFileCommand(tempFilePath, dossierPath));
				});

				file.on('error', (err)=>{
					return callback(err);
				});
				req.pipe(file);
				*/

				file.write(fileContent);
				return callback(undefined, createAddFileCommand(tempFilePath, dossierPath));
			});
		});
	});
}

module.exports = AddFile;
},{"../CommandRegistry":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/CommandRegistry.js","../utils":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/utils.js","pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/dummyCommand.js":[function(require,module,exports){
module.exports = {
	execute : function(context, callback){
		//this kind of command isn't to operate on dsu rather on transaction object.
		return callback();
	}
}
},{}],"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/index.js":[function(require,module,exports){
const addFile = require("./addFile");
const mount = require("./mount");
const setDLDomain = require("./setDLDomain");
const setKeySSI = require("./setKeySSI");

module.exports = {
	addFile,
	mount,
	setDLDomain,
	setKeySSI
}
},{"./addFile":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/addFile.js","./mount":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/mount.js","./setDLDomain":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/setDLDomain.js","./setKeySSI":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/setKeySSI.js"}],"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/mount.js":[function(require,module,exports){
function setDLDomain(server){
	const commandRegistry = require("../CommandRegistry").getRegistry(server);

	commandRegistry.register("/mount", "post", (req, callback)=>{
		const path = req.headers['x-mount-path'];
		const keySSI = req.headers['x-mounted-dossier-seed'];

		if(typeof path === "undefined" || typeof keySSI === "undefined"){
			return callback('Wrong usage of the command');
		}

		const command = {
			execute : function(context, callback){
				context.dsu.mount(path, keySSI, callback);
			}
		}

		return callback(undefined, command);
	});
}

module.exports = setDLDomain;
},{"../CommandRegistry":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/CommandRegistry.js"}],"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/setDLDomain.js":[function(require,module,exports){
const command = require("./dummyCommand");

function setDLDomain(server){
	const commandRegistry = require("../CommandRegistry").getRegistry(server);
	const utils = require("../utils");

	commandRegistry.register("/setDLDomain", "post", (req, callback)=>{
		const transactionManager = require("../TransactionManager");
		console.log("reading body...");
		utils.bodyParser(req, (err)=>{
			if(err){
				return callback(err);
			}
			console.log("m citit transaction id-ul", req.params.transactionId, req.body);
			const transaction = transactionManager.getTransaction(req.params.transactionId);
			transaction.context.dlDomain = req.body;

			return callback(undefined, command);
		});
	});
}

module.exports = setDLDomain;
},{"../CommandRegistry":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/CommandRegistry.js","../TransactionManager":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/TransactionManager.js","../utils":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/utils.js","./dummyCommand":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/dummyCommand.js"}],"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/setKeySSI.js":[function(require,module,exports){
const command = require("./dummyCommand");

function setKeySSI(server){
	const commandRegistry = require("../CommandRegistry").getRegistry(server);
	const utils = require("../utils");

	commandRegistry.register("/setKeySSI", "post", (req, callback)=>{
		const transactionManager = require("../TransactionManager");
		const keyssiSpace = require("opendsu").loadApi("keyssi");
		utils.bodyParser(req, (err)=>{
			if(err){
				return callback(err);
			}

			const transaction = transactionManager.getTransaction(req.params.transactionId);
			transaction.context.keySSI = keyssiSpace.parse(req.body);
			transaction.context.options.useSSIAsIdentifier = true;

			return callback(undefined, command);
		});
	});
}

module.exports = setKeySSI;
},{"../CommandRegistry":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/CommandRegistry.js","../TransactionManager":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/TransactionManager.js","../utils":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/utils.js","./dummyCommand":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/dummyCommand.js","opendsu":"opendsu"}],"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/constants.js":[function(require,module,exports){
const URL_PREFIX = '/dsuWizard';
const transactionIdLength = 32;

module.exports = { URL_PREFIX, transactionIdLength};
},{}],"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/utils.js":[function(require,module,exports){
(function (Buffer){(function (){
function bodyParser(req, callback) {
    let bodyContent = '';

    req.on('data', function (dataChunk) {
        bodyContent += dataChunk;
    });

    req.on('end', function () {
        req.body = bodyContent;
        callback(undefined, req.body);
    });

    req.on('error', function (err) {
        callback(err);
    });
}

function formDataParser(req, callback) {
    let formData = [];
    let currentFormItem;
    let currentBoundary;
    let dataBuf = Buffer.alloc(0);
    let defaultItem = {
        bufferStartIndex: 0,
        bufferEndIndex: 0,
        increaseBothBuffers: (size) => {
            currentFormItem.bufferStartIndex += size;
            currentFormItem.bufferEndIndex += size;
        },
        increaseEndBuffer: (size) => {
            currentFormItem.bufferEndIndex += size;
        }
    }

    req.on('data', function (dataChunk) {
        dataBuf = Buffer.concat([dataBuf, dataChunk]);
    });

    req.on('end', function () {
        formParser(dataBuf);
        req.formData = formData;
        callback(undefined, req.formData);
    });

    req.on('error', function (err) {
        callback(err);
    });

    function formParser(data) {
        let dataAsString = data.toString();
        let dataArray = dataAsString.split(/[\r\n]+/g);

        currentFormItem = defaultItem;
        for (let dataLine of dataArray) {
            let lineHandled = false;
            if (dataLine.indexOf('------') === 0) {
                if (typeof currentBoundary === "undefined") {
                    //we got a new boundary
                    currentBoundary = dataLine;

                    currentFormItem.increaseBothBuffers(dataLine.length + 2)

                    lineHandled = true;
                } else if (dataLine.indexOf(currentBoundary) + '--' !== -1) {
                    //we found a boundary end
                    currentBoundary = undefined;

                    //Due to encoding method of the characters, in some scenarios we will need to prevent the lose of bytes
                    //That's why in the final boundary we add them back
                    currentFormItem.increaseEndBuffer(data.byteLength - dataAsString.length);
                    currentFormItem = {
                        type: currentFormItem.type,
                        content: data.slice(currentFormItem.bufferStartIndex + 2, currentFormItem.bufferEndIndex + 2)
                    }
                    //we add the formItem to formData and consider that is done
                    formData.push(currentFormItem);

                    currentFormItem = defaultItem;
                    lineHandled = true;
                }
            }
            if (dataLine.indexOf('Content-Disposition:') !== -1) {
                const formItemMeta = dataLine.split("; ");
                for (let meta of formItemMeta) {
                    if (meta.indexOf("name=") === 0) {
                        currentFormItem.type = meta.replace("name=", "").replace(/\"|'/g, "");
                        break;
                    }
                }

                currentFormItem.increaseBothBuffers(dataLine.length + 2)
                lineHandled = true;
            }
            if (dataLine.indexOf('Content-Type:') !== -1) {
                currentFormItem.increaseBothBuffers(dataLine.length + 2)
                lineHandled = true;
            }
            if (!lineHandled) {
                currentFormItem.increaseEndBuffer(dataLine.length + 1)
            }
        }
    }
}

function redirect(req, res) {
    const URL_PREFIX = require("./constants").URL_PREFIX;
    res.statusCode = 303;
    let redirectLocation = 'index.html';

    if (!req.url.endsWith('/')) {
        redirectLocation = `${URL_PREFIX}/` + redirectLocation;
    }

    res.setHeader("Location", redirectLocation);
    res.end();
}

module.exports = {
    bodyParser,
    formDataParser,
    redirect
}
}).call(this)}).call(this,require("buffer").Buffer)

},{"./constants":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/constants.js","buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/edfs-middleware/flows/AnchorsManager.js":[function(require,module,exports){
(function (Buffer){(function (){
const pathModule = "path";
const path = require(pathModule);
const fsModule = "fs";
const fs = require(fsModule);
const osModule = "os";
const endOfLine = require(osModule).EOL;
let anchorsFolders;

const ALIAS_SYNC_ERR_CODE = 'sync-error';

$$.flow.describe("AnchorsManager", {
    init: function (rootFolder) {
        rootFolder = path.resolve(rootFolder);
        anchorsFolders = rootFolder;
        try{
            fs.mkdirSync(anchorsFolders, {recursive: true});
        }catch (e) {
            throw e;
        }
    },

    addAlias: function (fileHash, lastHash, readStream, callback) {
        if (!fileHash || typeof fileHash !== "string") {
            return callback(new Error("No fileId specified."));
        }

        this.__streamToString(readStream, (err, alias) => {
            if (err) {
                return callback(err);
            }
            if (!alias) {
                return callback(new Error("No alias was provided"));
            }

            const filePath = path.join(anchorsFolders, alias);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    fs.writeFile(filePath, fileHash + endOfLine, callback);
                    return;
                }

                this.__appendHash(filePath, fileHash, {
                    lastHash,
                    fileSize: stats.size
                }, callback);
            });

        });
    },

    readVersions: function (alias, callback) {
        const filePath = path.join(anchorsFolders, alias);
        fs.readFile(filePath, (err, fileHashes) => {
            if (err) {
                if (err.code === "ENOENT") {
                    return callback(undefined, []);
                }
                return callback(err);
            }
            callback(undefined, fileHashes.toString().trimEnd().split(endOfLine));
        });
    },

    /**
     * Append `hash` to file only
     * if the `lastHash` is the last hash in the file
     * 
     * @param {string} path 
     * @param {string} hash 
     * @param {object} options
     * @param {string|undefined} options.lastHash 
     * @param {number} options.fileSize 
     * @param {callback} callback 
     */
    __appendHash: function (path, hash, options, callback) {
        if (!options.lastHash) {
            return fs.appendFile(path, hash + endOfLine, callback);
        }

        fs.open(path, fs.constants.O_RDWR, (err, fd) => {
            if (err) {
                return callback(err);
            }

            const readOptions = {
                buffer: Buffer.alloc(options.fileSize),
                offset: 0,
                length: options.fileSize,
                position: null
            };
            fs.read(fd, Buffer.alloc(options.fileSize), 0, options.fileSize, null, (err, bytesRead, buffer) => {
                if (err) {
                    return callback(err);
                }

                // compare the last hash in the file with the one received in the request
                // if they are not the same, exit with error
                const hashes = buffer.toString().trimEnd().split(endOfLine);
                const lastHash = hashes[hashes.length - 1];

                if (lastHash !== options.lastHash) {
                    return callback({
                        code: ALIAS_SYNC_ERR_CODE,
                        message: "Unable to add alias: versions out of sync."
                    });
                }

                fs.write(fd, hash + endOfLine, options.fileSize, (err) => {
                    if (err) {
                        return callback(err);
                    }

                    fs.close(fd, callback);
                });
            });
        });
    },

    __streamToString: function (readStream, callback) {
        let str = '';
        readStream.on("data", (chunk) => {
            str += chunk;
        });

        readStream.on("end", () => {
            callback(undefined, str);
        });

        readStream.on("error", callback);
    }
});

module.exports = {
    ALIAS_SYNC_ERR_CODE
}
}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/edfs-middleware/flows/BricksManager.js":[function(require,module,exports){
(function (Buffer){(function (){
const pathModule = "path";
const path = require(pathModule);
const fsModule = "fs";
const fs = require(fsModule);
const crypto = require("pskcrypto");
const folderNameSize = process.env.FOLDER_NAME_SIZE || 5;
let brickStorageFolder;
const HASH_ALGORITHM = "sha256";

$$.flow.describe("BricksManager", {
    init: function (rootFolder) {
        rootFolder = path.resolve(rootFolder);
        brickStorageFolder = rootFolder;
        this.__ensureFolderStructure(rootFolder);
    },
    write: function (readFileStream, callback) {
        this.__convertStreamToBuffer(readFileStream, (err, brickData) => {
            if (err) {
                return callback(err);
            }
            const fileName = crypto.hash(HASH_ALGORITHM, brickData, "hex");
            if (!this.__verifyFileName(fileName, callback)) {
                return;
            }


            const folderName = path.join(brickStorageFolder, fileName.substr(0, folderNameSize));

            this.__ensureFolderStructure(folderName, (err) => {
                if (err) {
                    return callback(err);
                }

                this.__writeFile(brickData, folderName, fileName, callback);
            });
        });
    },
    read: function (fileName, writeFileStream, callback) {
        if (!this.__verifyFileName(fileName, callback)) {
            return;
        }

        const folderPath = path.join(brickStorageFolder, fileName.substr(0, folderNameSize));
        const filePath = path.join(folderPath, fileName);

        this.__verifyFileExistence(filePath, (err, result) => {
            if (!err) {
                this.__readFile(writeFileStream, filePath, callback);
            } else {
                callback(new Error(`File ${filePath} was not found.`));
            }
        });
    },

    readMultipleBricks: function (brickHashes, writeStream, callback) {
        if (!Array.isArray(brickHashes)) {
            brickHashes = [brickHashes];
        }
        this.__writeMultipleBricksToStream(brickHashes, 0, writeStream, callback);
    },

    __writeBrickDataToStream: function (brickData, writeStream, callback) {
        const brickSize = Buffer.alloc(4);
        brickSize.writeUInt32BE(brickData.length);
        writeStream.write(brickSize, (err) => {
            if (err) {
                return callback(err);
            }

            writeStream.write(brickData, callback);
        });
    },
    __writeMultipleBricksToStream: function (brickHashes, brickIndex, writeStream, callback) {
        const brickHash = brickHashes[brickIndex];
        this.__readBrick(brickHash, (err, brickData) => {
            this.__writeBrickDataToStream(brickData, writeStream, (err) => {
                if (err) {
                    return callback(err);
                }
                brickIndex++;
                if (brickIndex === brickHashes.length) {
                    callback();
                } else {
                    this.__writeMultipleBricksToStream(brickHashes, brickIndex, writeStream, callback);
                }
            });
        });
    },
    __readBrick: function (brickHash, callback) {
        const folderPath = path.join(brickStorageFolder, brickHash.substr(0, folderNameSize));
        const filePath = path.join(folderPath, brickHash);
        this.__verifyFileExistence(filePath, (err) => {
            if (err) {
                return callback(err);
            }

            fs.readFile(filePath, callback);
        });
    },
    __verifyFileName: function (fileName, callback) {
        if (!fileName || typeof fileName !== "string") {
            return callback(new Error("No fileId specified."));
        }

        if (fileName.length < folderNameSize) {
            return callback(new Error("FileId too small. " + fileName));
        }

        return true;
    },
    __ensureFolderStructure: function (folder, callback) {
        try {
            fs.mkdirSync(folder, {recursive: true});
        } catch (err) {
            if (callback) {
                callback(err);
            } else {
                throw err;
            }
        }
        if (callback) {
            callback();
        }
    },
    __writeFile: function (brickData, folderPath, fileName, callback) {
        const filePath = path.join(folderPath, fileName);
        fs.access(filePath, (err) => {
            if (err) {
                fs.writeFile(filePath, brickData, (err) => {
                    callback(err, fileName)
                });
            } else {
                callback(undefined, fileName);
            }
        });
    },
    __readFile: function (writeFileStream, filePath, callback) {
        const readStream = fs.createReadStream(filePath);

        writeFileStream.on("finish", callback);
        writeFileStream.on("error", callback);

        readStream.pipe(writeFileStream);
    },
    __verifyFileExistence: function (filePath, callback) {
        fs.access(filePath, callback);
    },
    __convertStreamToBuffer: function (readStream, callback){
        let brickData = Buffer.alloc(0);
        readStream.on("data", (chunk) => {
            brickData = Buffer.concat([brickData, chunk]);
        });

        readStream.on("error", (err) => {
            return callback(err);
        });

        readStream.on("end", () => {
            return callback(undefined, brickData);
        });
    }
});

}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false,"pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs-middleware/lib/AnchoringMiddleware.js":[function(require,module,exports){
const URL_PREFIX = "/anchor";
const anchorsStorage = "anchors";

function AnchoringMiddleware(server) {
    const path = require("path");
    const fs = require("fs");

    const AnchorsManager = require("../flows/AnchorsManager");
    const readBody = require("../../psk-apihub/utils").readStringFromStream;

    let storageFolder = path.join(server.rootFolder, anchorsStorage);

    let storageNotAccessible = false;
    try{
        fs.mkdirSync(storageFolder, {recursive: true});
    }catch(err){
        storageNotAccessible = true;
    }


    $$.flow.start("AnchorsManager").init(storageFolder);

    function setHeaders(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, X-Content-Length');
        next();
    }

    function attachHashToAlias(req, res) {
        $$.flow.start("AnchorsManager").addAlias(req.params.fileId, req.params.lastHash, req, (err, result) => {
            res.statusCode = 201;
            if (err) {
                res.statusCode = 500;

                if (err.code === 'EACCES') {
                    res.statusCode = 409;
                }

                if (err.code === AnchorsManager.ALIAS_SYNC_ERR_CODE) {
                    res.statusCode = 428; // see: https://tools.ietf.org/html/rfc6585#section-3
                }
            }
            res.end();
        });
    }

    function getVersions(req, res) {
        $$.flow.start("AnchorsManager").readVersions(req.params.alias, (err, fileHashes) => {
            res.statusCode = 200;
            if (err) {
                console.error(err);
                res.statusCode = 404;
            }
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify(fileHashes));
        });
    }

    function publishHandler(req, res){
        const channelIdentifier = req.params.channelsIdentifier;
        const lastMessage = req.params.lastMessage;

        readBody(req, function(err, newAnchor){
            if(newAnchor === ""){
                //no anchor found in body
                res.statusCode = 428;
                return res.send("");
            }

            readChannel(channelIdentifier, function(err, anchors){
                if(err && typeof lastMessage === "undefined"){
                    // this is a new anchor
                    return publishToChannel(channelIdentifier, newAnchor, function(err){
                        if(err){
                            res.statusCode = 500;
                            return res.send();
                        }
                        res.statusCode = 201;
                        res.send();
                    });
                }

                if(lastMessage !== anchors.pop()){
                    res.statusCode = 403;
                    return res.send();
                }

                return publishToChannel(channelIdentifier, newAnchor, function(err){
                    if(err){
                        res.statusCode = 500;
                        return res.send();
                    }
                    res.statusCode = 201;
                    res.send();
                });
            });
        });
    }

    function readChannel(name, callback){
        const fs = require("fs");
        const path = require("path");

        fs.readFile(path.join(storageFolder, name), function(err, content){
            let anchors;
            if(!err){
                anchors = content.split("\m");
            }
            callback(err, anchors);
        });
    }

    function publishToChannel(name, message, callback){
        const fs = require("fs");
        const path = require("path");

        fs.appendFile(path.join(storageFolder, name), message, function(err){
            if(typeof err === "undefined"){
                //if everything went ok then try to resolve pending requests for that channel
                tryToResolvePendingRequests(name, message);
            }
            return callback(err);
        });
    }

    function tryToResolvePendingRequests(channelIdentifier, message){
        let pending = pendingRequests[channelIdentifier];
        if(typeof  pending === "undefined" || pending.length === 0){
            // no pending requests
            return;
        }

        for(let i=0; i<pending.length; i++){
            let requestPair = pending[i];
            try{
                requestPair.res.statusCode = 200;
                requestPair.res.send(message);
            }catch(err){
                // a pending request can already be resolved as timeout
            }
        }
    }

    let pendingRequests = {};
    function readHandler(req, res){
        const channelIdentifier = req.params.channelsIdentifier;
        const lastMessageKnown = req.params.lastMessage;

        readChannel(channelIdentifier, function(err, anchors){
            if(err){
                if(err.code === "EPERM"){
                    res.statusCode = 500;
                }else{
                    res.statusCode = 404;
                }
                return res.send();
            }
            let knownIndex = anchors.indexOf(lastMessageKnown);
            if(knownIndex !== -1){
                anchors = anchors.slice(knownIndex+1);
            }
            if(anchors.length === 0){
                if(typeof pendingRequests[channelIdentifier] === "undefined"){
                    pendingRequests[channelIdentifier] = [];
                }
                pendingRequests[channelIdentifier].push({req, res});
            }else{
                res.statusCode = 200;
                return res.send(anchors);
            }
        });
    }

    function storageNotAccessibleHandler(req, res, next){
        if(storageNotAccessible){
            res.statusCode = 500;
            return res.send("");
        }
        next();
    }

    //don't need to have this middleware registration because is resolved in psk-apihub/index.js already
    //server.use(`${URL_PREFIX}/*`, setHeaders);

    //new API
    server.use(`${URL_PREFIX}/*`, storageNotAccessibleHandler);
    //we need this handler (without lastMessage) to catch request for new anchors
    server.post(`${URL_PREFIX}/publish/:channelIdentifier/`, publishHandler);
    server.post(`${URL_PREFIX}/publish/:channelIdentifier/:lastMessage`, publishHandler);
    server.get(`${URL_PREFIX}/read/:channelIdentifier`, readHandler);

    //to become obsolete soon
    server.post(`${URL_PREFIX}/add/:fileId/:lastHash`, attachHashToAlias);
    server.post(`${URL_PREFIX}/add/:fileId`, attachHashToAlias);
    server.get(`${URL_PREFIX}/versions/:alias`, getVersions);
}

module.exports = AnchoringMiddleware;
},{"../../psk-apihub/utils":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/index.js","../flows/AnchorsManager":"/home/travis/build/PrivateSky/privatesky/modules/edfs-middleware/flows/AnchorsManager.js","fs":false,"path":false}],"/home/travis/build/PrivateSky/privatesky/modules/edfs-middleware/lib/BrickStorageMiddleware.js":[function(require,module,exports){
const bricks_storage_folder = "brick-storage";
const URL_PREFIX = "/bricks";

function BrickStorageMiddleware(server) {
    const path = require("path");
    require("../flows/BricksManager");

    let storageFolder = path.join(server.rootFolder, bricks_storage_folder);
    if (typeof process.env.EDFS_BRICK_STORAGE_FOLDER !== "undefined") {
        storageFolder = process.env.EDFS_BRICK_STORAGE_FOLDER;
    }

    $$.flow.start("BricksManager").init(storageFolder);
    console.log("Bricks Storage location", storageFolder);

    function setHeaders(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, X-Content-Length');
        next();
    }

    function uploadBrick(req, res) {
        $$.flow.start("BricksManager").write(req, (err, result) => {
            res.statusCode = 201;
            if (err) {
                res.statusCode = 500;

                if (err.code === 'EACCES') {
                    res.statusCode = 409;
                }
            }
            res.end(JSON.stringify(result));
        });
    }

    function downloadBrick(req, res) {
        res.setHeader("content-type", "application/octet-stream");
        res.setHeader('Cache-control', 'max-age=31536000'); // set brick cache expiry to 1 year
        $$.flow.start("BricksManager").read(req.params.fileId, res, (err, result) => {
            res.statusCode = 200;
            if (err) {
                console.log(err);
                res.statusCode = 404;
            }
            res.end();
        });
    }

    function downloadMultipleBricks(req, res) {
        res.setHeader("content-type", "application/octet-stream");
        res.setHeader('Cache-control', 'max-age=31536000'); // set brick cache expiry to 1 year
        $$.flow.start("BricksManager").readMultipleBricks(req.query.hashes, res, (err, result) => {
            res.statusCode = 200;
            if (err) {
                console.log(err);
                res.statusCode = 404;
            }
            res.end();
        });
    }

    server.use(`${URL_PREFIX}/*`, setHeaders);
    server.use(`${URL_PREFIX}/downloadMultipleBricks`, downloadMultipleBricks);
    // server.post(`${URL_PREFIX}/`, uploadBrick);
    server.get(`${URL_PREFIX}/:fileId`, downloadBrick);
    server.post(`${URL_PREFIX}`, uploadBrick);
    server.get(`${URL_PREFIX}/:fileId/:dldomain`, downloadBrick);
}

module.exports = BrickStorageMiddleware;

},{"../flows/BricksManager":"/home/travis/build/PrivateSky/privatesky/modules/edfs-middleware/flows/BricksManager.js","path":false}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/BootstrapingService/RequestsChain.js":[function(require,module,exports){
'use strict';

function RequestsChain() {
    const chain = [];

    /**
     * Check if error fatal
     * If this returns true, the chain should break
     * @param {object} err
     * @return {boolean}
     */
    const isFatalError = (err) => {
        return true;
    }

    /**
     * @param {object} handler
     * @param {string} method
     * @param {Array} args
     */
    this.add = (handler, method, args) => {
        chain.push([handler, method, args]);
    }

    /**
     * @param {callback} callback
     */
    const executeChain = (callback) => {
        if (chain.length === 0) {
            return callback('No endpoint provided. Check EDFS documentation!')
        }
        const chainLink = chain.shift();
        const handler = chainLink[0];
        const method = chainLink[1];
        const args = chainLink[2].slice();

        const next = (err, result) => {
            if (err) {
                if (isFatalError(err)) {
                    return callback(err);
                }

                if (!chain.length) {
                    return callback(err);
                }

                return executeChain(callback);
            }

            return callback(undefined, result);
        };

        args.push(next);
        handler[method].apply(handler, args);
    }

    /**
     * @param {callback} callback
     */
    this.execute = function (callback) {
        executeChain(callback);
    }
}

module.exports = RequestsChain;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/BootstrapingService/index.js":[function(require,module,exports){
'use strict';

const RequestsChain = require('./RequestsChain');
const BRICK_STORAGE = 'brickStorage';
const ANCHOR_SERVICE = 'anchorService';

/**
 *
 * @param options.endpoints - array of objects that contain an endpoint and the endpoint's type
 * @constructor
 */

function BootstrapingService(options) {
    const openDSU = require("opendsu");
    const services = {
        'brickStorage': openDSU.loadApi("bricking"),
        'anchorService': openDSU.loadApi("anchoring")
    }
    const bdns = openDSU.loadApi("bdns");

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////


    /**
     * @param {string} method
     * @param {Array<object>} endpointsPool
     * @param {string} favEndpoint
     * @param {...} args
     * @return {RequestChain}
     */
    const createRequestsChain = (method, serviceName, ...args) => {
        const requestsChain = new RequestsChain();
        const service = services[serviceName];

        requestsChain.add(service, method, args);

        return requestsChain;
    };

    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////
    this.getBrick = (hashLinkSSI, callback) => {
        const requestsChain = createRequestsChain('getBrick', BRICK_STORAGE, hashLinkSSI);
        requestsChain.execute(callback);
    }

    this.getMultipleBricks = (hashLinkSSIs, callback) => {
        const requestsChain = createRequestsChain('getMultipleBricks', BRICK_STORAGE, hashLinkSSIs);
        requestsChain.execute(callback);
    }

    this.putBrick = (keySSI, brick, callback) => {
        const requestsChain = createRequestsChain('putBrick', BRICK_STORAGE, keySSI, brick);
        requestsChain.execute(callback);
    }

    this.versions = (keySSI, callback) => {
        const requestsChain = createRequestsChain('versions', ANCHOR_SERVICE, keySSI);
        requestsChain.execute(callback);

    }

    this.addVersion = (keySSI, hashLinkSSI, lastHashLinkSSI, callback) => {
        const requestsChain = createRequestsChain('addVersion', ANCHOR_SERVICE, keySSI, hashLinkSSI, lastHashLinkSSI);
        requestsChain.execute(callback);
    }
}

module.exports = BootstrapingService;

},{"./RequestsChain":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/BootstrapingService/RequestsChain.js","opendsu":"opendsu"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/ConstDSUFactory.js":[function(require,module,exports){
/**
 * @param {object} options
 * @param {BootstrapingService} options.bootstrapingService
 * @param {string} options.dlDomain
 * @param {KeySSIFactory} options.keySSIFactory
 * @param {BrickMapStrategyFactory} options.brickMapStrategyFactory
 */
function ConstDSUFactory(options) {
    options = options || {};
    this.barFactory = options.barFactory;

    /**
     * @param {object} options
     * @param {string} options.favouriteEndpoint
     * @param {string} options.brickMapStrategy 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BrickMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BrickMap
     * @param {callback} callback
     */
    this.create = (keySSI, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        // enable options.validationRules.preWrite to stop content update
        this.barFactory.create(keySSI, options, callback);
    };

    /**
     * @param {string} keySSI
     * @param {object} options
     * @param {string} options.brickMapStrategy 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BrickMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BrickMap
     * @param {callback} callback
     */
    this.load = (keySSI, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        // enable options.validationRules.preWrite to stop content update
        this.barFactory.load(keySSI, options, callback);
    };
}

module.exports = ConstDSUFactory;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/DSUFactory.js":[function(require,module,exports){
/**
 * @param {object} options
 * @param {BootstrapingService} options.bootstrapingService
 * @param {string} options.dlDomain
 * @param {DIDFactory} options.keySSIFactory
 * @param {BrickMapStrategyFactory} options.brickMapStrategyFactory
 */
const cache = require('psk-cache').factory();
function DSUFactory(options) {
    const barModule = require('bar');
    const fsAdapter = require('bar-fs-adapter');

    const DEFAULT_BRICK_MAP_STRATEGY = "Diff";

    options = options || {};
    this.bootstrapingService = options.bootstrapingService;
    this.keySSIFactory = options.keySSIFactory;
    this.brickMapStrategyFactory = options.brickMapStrategyFactory;

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {BaseDID} keySSI
     * @param {object} options
     * @return {Archive}
     */
    const createInstance = (keySSI, options) => {
        const ArchiveConfigurator = barModule.ArchiveConfigurator;
        ArchiveConfigurator.prototype.registerFsAdapter("FsAdapter", fsAdapter.createFsAdapter);
        const archiveConfigurator = new ArchiveConfigurator();
        archiveConfigurator.setCache(cache);
        const envTypes = require("overwrite-require").constants;
        if($$.environmentType !== envTypes.BROWSER_ENVIRONMENT_TYPE && $$.environmentType !== envTypes.SERVICE_WORKER_ENVIRONMENT_TYPE){
            archiveConfigurator.setFsAdapter("FsAdapter");
        }
        archiveConfigurator.setBufferSize(1000000);
        archiveConfigurator.setKeySSI(keySSI);
        archiveConfigurator.setBootstrapingService(this.bootstrapingService);
        let brickMapStrategyName = options.brickMapStrategy;
        let anchoringOptions = options.anchoringOptions;
        if (!brickMapStrategyName) {
            brickMapStrategyName = DEFAULT_BRICK_MAP_STRATEGY;
        }
        let brickMapStrategy;
        try {
            brickMapStrategy = createBrickMapStrategy(brickMapStrategyName, anchoringOptions);

            archiveConfigurator.setBrickMapStrategy(brickMapStrategy);

            if (options.validationRules) {
                archiveConfigurator.setValidationRules(options.validationRules);
            }
        }catch(e) {
            throw e;
        }

        const bar = barModule.createArchive(archiveConfigurator);
        const DSUBase = require("./mixins/DSUBase");
        DSUBase(bar);

        return bar;
    }

    /**
     * @return {object}
     */
    const createBrickMapStrategy = (name, options) => {
        const strategy = this.brickMapStrategyFactory.create(name, options);
        return strategy;
    }

    /**
     * @return {SecretDID}
     * @param templateKeySSI
     * @param callback
     */
    const initializeKeySSI = (templateKeySSI, callback) => {
        if (typeof templateKeySSI === "function") {
            callback = templateKeySSI;
            templateKeySSI = undefined;
        }

        if (typeof templateKeySSI === "undefined") {
            return callback(Error("A template keySSI should be provided when creating a new DSU."));
        }
        const KeySSIFactory = require("../KeySSIs/KeySSIFactory");
        const keySSI = KeySSIFactory.createType(templateKeySSI.getName());
        keySSI.initialize(templateKeySSI.getDLDomain(), undefined, undefined, undefined, undefined, callback);
    }

    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {object} options
     * @param {string} options.favouriteEndpoint
     * @param {string} options.brickMapStrategy 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BrickMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BrickMap
     * @param {callback} callback
     */
    this.create = (keySSI, options, callback) => {
        options = options || {};
        if (options.useSSIAsIdentifier) {
            const bar = createInstance(keySSI, options);
            return bar.init(err => callback(err, bar));
        }

        initializeKeySSI(keySSI, (err, _keySSI) => {
            if (err) {
                return callback(err);
            }

            const bar = createInstance(_keySSI, options);
            bar.init(err => callback(err, bar));
        });
    }

    /**
     * @param {string} keySSI
     * @param {object} options
     * @param {string} options.brickMapStrategy 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BrickMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BrickMap
     * @param {callback} callback
     */
    this.load = (keySSI, options, callback) => {
        options = options || {};
        const bar = createInstance(keySSI, options);
        bar.load(err => callback(err, bar));
    }
}

module.exports = DSUFactory;

},{"../KeySSIs/KeySSIFactory":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIFactory.js","./mixins/DSUBase":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/mixins/DSUBase.js","bar":false,"bar-fs-adapter":false,"overwrite-require":"overwrite-require","psk-cache":"psk-cache"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/WalletFactory.js":[function(require,module,exports){
/**
 * @param {object} options
 * @param {BootstrapingService} options.bootstrapingService
 * @param {string} options.dlDomain
 * @param {KeySSIFactory} options.keySSIFactory
 * @param {BrickMapStrategyFactory} options.brickMapStrategyFactory
 */
function WalletFactory(options) {
    options = options || {};
    this.barFactory = options.barFactory;

    /**
     * @param {object} options
     * @param {string} options.favouriteEndpoint
     * @param {string} options.brickMapStrategy 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BrickMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BrickMap
     * @param {callback} callback
     */
    this.create = (keySSI, options, callback) => {
        const defaultOpts = {overwrite: false};
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        Object.assign(defaultOpts, options);
        options = defaultOpts;
        this.barFactory.create(keySSI, options, (err, wallet) => {
            if (err) {
                return callback(err);
            }

            wallet.mount("/code", options.dsuTypeSSI, (err => {
                if (err) {
                    return callback(err);
                }

                return callback(undefined, wallet);

                /*wallet.getKeySSI((err, _keySSI) => {
                    if (err) {
                        return callback(err);
                    }

                    callback(undefined, wallet);
                });*/

            }));
        })

    };

    /**
     * @param {string} keySSI
     * @param {object} options
     * @param {string} options.brickMapStrategy 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BrickMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BrickMap
     * @param {callback} callback
     */
    this.load = (keySSI, options, callback) => {
        const defaultOpts = {overwrite: false};
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        Object.assign(defaultOpts, options);
        options = defaultOpts;

        this.barFactory.load(keySSI, options, (err, dossier) => {
            if (err) {
                return callback(err);
            }

            return callback(undefined, dossier);
        });
    };
}

module.exports = WalletFactory;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/index.js":[function(require,module,exports){
const BarFactory = require('./DSUFactory');

/**
 * @param {object} options
 * @param {BootstrapingService} options.bootstrapingService
 * @param {string} options.dlDomain
 * @param {KeySSIFactory} options.keySSIFactory
 * @param {BrickMapStrategyFactory} options.brickMapStrategyFactory
 */
const factories = {};

function Registry(options) {
    options = options || {};

    const bootstrapingService = options.bootstrapingService;
    const keySSIFactory = options.keySSIFactory;
    const brickMapStrategyFactory = options.brickMapStrategyFactory

    if (!bootstrapingService) {
        throw new Error('BootstrapingService is required');
    }

    if (!keySSIFactory) {
        throw new Error('A KeySSI factory is required');
    }

    if (!brickMapStrategyFactory) {
        throw new Error('A BrickMapStratregy factory is required');
    }

    /**
     * Initialize the factory state
     */
    const initialize = () => {
        const barFactory = new BarFactory({
            bootstrapingService,
            keySSIFactory,
            brickMapStrategyFactory
        });

        this.registerDSUType("seed", barFactory);
        const WalletFactory = require("./WalletFactory");
        const walletFactory = new WalletFactory({barFactory});
        this.registerDSUType("wallet", walletFactory);
        const ConstDSUFactory = require("./ConstDSUFactory");
        const constDSUFactory = new ConstDSUFactory({barFactory});
        this.registerDSUType("const", constDSUFactory);
        this.registerDSUType("array", constDSUFactory);
    }

    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {string} representation
     * @return {boolean}
     */
    this.isValidKeySSI = (keySSI) => {
        return typeof factories[keySSI.getName()] !== 'undefined';
    };


    /**
     * @param {object} keySSI
     * @param {object} dsuConfiguration
     * @param {string} dsuConfiguration.favouriteEndpoint
     * @param {string} dsuConfiguration.brickMapStrategyFactory 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} dsuConfiguration.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} dsuConfiguration.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} dsuConfiguration.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BrickMap and then apply the new changes
     * @param {callback} dsuConfiguration.anchoringOptions.anchoringCb A callback which is called when the strategy anchors the changes
     * @param {callback} dsuConfiguration.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} dsuConfiguration.validationRules
     * @param {object} dsuConfiguration.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BrickMap
     * @param {callback} callback
     */
    this.create = (keySSI, dsuConfiguration, callback) => {
        let type = keySSI.getName();
        if (keySSI.options && keySSI.options.dsuFactoryType) {
            type = keySSI.options.dsuFactoryType;
        }
        const factory = factories[type];
        factory.create(keySSI, dsuConfiguration, callback);
    }

    /**
     * @param {object} keySSI
     * @param {string} representation
     * @param {object} dsuConfiguration
     * @param {string} dsuConfiguration.brickMapStrategyFactory 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} dsuConfiguration.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} dsuConfiguration.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} dsuConfiguration.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BrickMap and then apply the new changes
     * @param {callback} dsuConfiguration.anchoringOptions.anchoringCb A callback which is called when the strategy anchors the changes
     * @param {callback} dsuConfiguration.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} dsuConfiguration.validationRules
     * @param {object} dsuConfiguration.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BrickMap
     * @param {callback} callback
     */
    this.load = (keySSI, dsuConfiguration, callback) => {
        let type = keySSI.getName();
        if (keySSI.options && keySSI.options.dsuFactoryType) {
            type = keySSI.options.dsuFactoryType;
        }
        const factory = factories[type];
        return factory.load(keySSI, dsuConfiguration, callback);
    }

    initialize();
}

/**
 * @param {string} dsuType
 * @param {object} factory
 */
Registry.prototype.registerDSUType = (dsuType, factory) => {
    factories[dsuType] = factory;
}

Registry.prototype.getDSUFactory = (dsuType) => {
    return factories[dsuType];
}

module.exports = Registry;
},{"./ConstDSUFactory":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/ConstDSUFactory.js","./DSUFactory":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/DSUFactory.js","./WalletFactory":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/WalletFactory.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/mixins/DSUBase.js":[function(require,module,exports){
module.exports = function(archive){
	archive.call = (functionName, ...args) => {
		if(args.length === 0){
			throw Error('Missing arguments. Usage: call(functionName, [arg1, arg2 ...] callback)');
		}

		const callback = args.pop();

		archive.readFile("/code/api.js", function(err, apiCode){
			if(err){
				return callback(err);
			}

			try{
				//before eval we need to convert from Buffer/ArrayBuffer to String
				const or = require("overwrite-require");
				switch($$.environmentType){
					case or.constants.BROWSER_ENVIRONMENT_TYPE:
					case or.constants.SERVICE_WORKER_ENVIRONMENT_TYPE:
						apiCode = new TextDecoder("utf-8").decode(apiCode);
						break;
					default:
						apiCode = apiCode.toString();
				}
				apiCode = "let module = {exports: {}}\n" + apiCode + "\nmodule.exports";
				const apis = eval(apiCode);
				apis[functionName].call(this, ...args, callback);

			}catch(err){
				return callback(err);
			}
		});
	}
	return archive;
}
},{"overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIResolver.js":[function(require,module,exports){
const constants = require('./constants');
const defaultBootStrapingService = require("./BootstrapingService");
/**
 * @param {string} options.dlDomain
 * @param {BoostrapingService} options.bootstrapingService
 * @param {BrickMapStrategyFactory} options.brickMapStrategyFactory
 * @param {DSUFactory} options.dsuFactory
 */
function KeySSIResolver(options) {
    options = options || {};

    const bootstrapingService = options.bootstrapingService || defaultBootStrapingService;
    const dlDomain = options.dlDomain || constants.DEFAULT_DOMAIN;

    if (!bootstrapingService) {
        throw new Error('BootstrapingService is required');
    }

    const brickMapStrategyFactory = options.brickMapStrategyFactory;

    const dsuFactory = options.dsuFactory;


    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {string} dsuRepresentation
     * @param {object} options
     * @param {string} options.favouriteEndpoint
     * @param {string} options.brickMapStrategy 'Diff' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn A function which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn A function which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BrickMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules 
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BrickMap
     * @param {callback} callback
     */
    this.createDSU = (keySSI, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        dsuFactory.create(keySSI, options, callback);
    };

    /**
     * @param {string} keySSI
     * @param {string} dsuRepresentation
     * @param {object} options
     * @param {string} options.brickMapStrategy 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn A function which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BrickMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules 
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BrickMap
     * @param {callback} callback
     */
    this.loadDSU = (keySSI, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        if (!dsuFactory.isValidKeySSI(keySSI)) {
            return callback(new Error(`Invalid KeySSI: ${keySSI.getName()}`));
        }

        dsuFactory.load(keySSI, options, callback);
    };

    /**
     * @return {DSUFactory}
     */
    this.getDSUFactory = () => {
        return dsuFactory;
    }

    /**
     * @return {BootstrapingService}
     */
    this.getBootstrapingService = () => {
        return bootstrapingService;
    }

    /**
     * @return {BrickMapStrategyFactory}
     */
    this.getBrickMapStrategyFactory = () => {
        return brickMapStrategyFactory;
    }
}

module.exports = KeySSIResolver;

},{"./BootstrapingService":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/BootstrapingService/index.js","./constants":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/constants.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/ConstSSIs/ArraySSI.js":[function(require,module,exports){
function ArraySSI(identifier) {
    const SSITypes = require("../SSITypes");
    const KeySSIMixin = require("../KeySSIMixin");
    const cryptoRegistry = require("../CryptoAlgorithmsRegistry");

    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.autoLoad(identifier);
    }

    this.getName = () => {
        return SSITypes.ARRAY_SSI;
    };

    this.initialize = (dlDomain, arr,   vn, hint) => {
        this.load(SSITypes.ARRAY_SSI, dlDomain, cryptoRegistry.getKeyDerivationFunction(this)(arr.join(''), 1000), "", vn, hint);
    };

    this.derive = () => {
        const ConstSSI = require("./ConstSSI");
        const constSSI = ConstSSI.createConstSSI();
        constSSI.load(SSITypes.CONST_SSI, this.getDLDomain(), getEncryptionKey(), this.getControl(), this.getVn(), this.getHint());
        return constSSI;
    };

    let getEncryptionKey = this.getEncryptionKey;
    this.getEncryptionKey = () => {
        return this.derive().getEncryptionKey();
    };
}

function createArraySSI(identifier) {
    return new ArraySSI(identifier);
}

module.exports = {
    createArraySSI
};
},{"../CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./ConstSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/ConstSSIs/ConstSSI.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/ConstSSIs/CZaSSI.js":[function(require,module,exports){
const KeySSIMixin = require("../KeySSIMixin");
const SSITypes = require("../SSITypes");

function CZaSSI(identifier) {
    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.autoLoad(identifier);
    }

    this.initialize = (dlDomain, hpk, vn, hint) => {
        this.load(SSITypes.CONSTANT_ZERO_ACCESS_SSI, dlDomain, subtypeSpecificString, hpk, vn, hint);
    };

    this.derive = () => {
        throw Error("Not implemented");
    };
}

function createCZaSSI(identifier) {
    return new CZaSSI(identifier);
}

module.exports = {
    createCZaSSI
};
},{"../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/ConstSSIs/ConstSSI.js":[function(require,module,exports){
const KeySSIMixin = require("../KeySSIMixin");
const CZaSSI = require("./CZaSSI");
const SSITypes = require("../SSITypes");
const cryptoRegistry = require("../CryptoAlgorithmsRegistry");

function ConstSSI(identifier){
    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.autoLoad(identifier);
    }

    this.initialize = (dlDomain, subtypeSpecificString, vn, hint) => {
        this.load(SSITypes.CONST_SSI, dlDomain, subtypeSpecificString, control, vn, hint);
    };

    this.derive = () => {
        const cZaSSI = CZaSSI.createCZaSSI();
        const subtypeKey = cryptoRegistry.getHashFunction(this)(this.getEncryptionKey());
        cZaSSI.load(SSITypes.CONSTANT_ZERO_ACCESS_SSI, this.getDLDomain(), subtypeKey, this.getControl(), this.getVn(), this.getHint());
        return cZaSSI;
    };
}

function createConstSSI(identifier) {
    return new ConstSSI(identifier);
}

module.exports = {
    createConstSSI
};
},{"../CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./CZaSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/ConstSSIs/CZaSSI.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/ConstSSIs/PasswordSSI.js":[function(require,module,exports){
const KeySSIMixin = require("../KeySSIMixin");
const ConstSSI = require("./ConstSSI");
const SSITypes = require("../SSITypes");
const cryptoRegistry = require("../CryptoAlgorithmsRegistry");

function PasswordSSI(identifier){
    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.autoLoad(identifier);
    }

    this.initialize = (dlDomain, context, password, kdfOptions, vn, hint) => {
        const subtypeSpecificString = cryptoRegistry.getKeyDerivationFunction(this)(context + password, kdfOptions);
        this.load(SSITypes.PASSWORD_SSI, dlDomain, subtypeSpecificString, '', vn, hint);
    };

    this.derive = () => {
        const constSSI = ConstSSI.createConstSSI();
        constSSI.load(SSITypes.CONST_SSI, this.getDLDomain(), this.getSubtypeSpecificString(), this.getControl(), this.getVn(), this.getHint());
        return constSSI;
    };

    this.getEncryptionKey = () => {
        return this.derive().getEncryptionKey();
    };
}

function createPasswordSSI(identifier) {
    return new PasswordSSI(identifier);
}

module.exports = {
    createPasswordSSI
};
},{"../CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./ConstSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/ConstSSIs/ConstSSI.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js":[function(require,module,exports){
(function (Buffer){(function (){
const crypto = require("pskcrypto");
const SSITypes = require("./SSITypes");
const algorithms = {};
const defaultAlgorithms = {
    hash: (data) => {
        return crypto.hash('sha256', data, 'hex');
    },
    keyDerivation: (password, iterations) => {
        return crypto.deriveKey('aes-256-gcm', password, iterations);
    },
    encryptionKeyGeneration: () => {
        const pskEncryption = crypto.createPskEncryption('aes-256-gcm');
        return pskEncryption.generateEncryptionKey();
    },
    encryption: (plainData, encryptionKey, options) => {
        const pskEncryption = crypto.createPskEncryption('aes-256-gcm');
        return pskEncryption.encrypt(plainData, encryptionKey, options);
    },
    decryption: (encryptedData, decryptionKey, authTagLength, options) => {
        const pskEncryption = crypto.createPskEncryption('aes-256-gcm');
        const utils = require("swarmutils");
        if (!Buffer.isBuffer(decryptionKey)) {
            decryptionKey = utils.convertToBuffer(decryptionKey);
        }
        if (!Buffer.isBuffer(encryptedData)) {
            encryptedData = utils.convertToBuffer(encryptedData);
        }
        return pskEncryption.decrypt(encryptedData, decryptionKey, 16, options);
    },
    encoding: (data) => {
        return crypto.pskBase58Encode(data);
    },
    decoding: (data) => {
        return crypto.pskBase58Decode(data);
    },
    keyPairGenerator: () => {
        return crypto.createKeyPairGenerator();
    },
    sign: (data, privateKey) => {
        const keyGenerator = crypto.createKeyPairGenerator();
        const rawPublicKey = keyGenerator.getPublicKey(privateKey, 'secp256k1');
        return crypto.sign('sha256', data, keyGenerator.convertKeys(privateKey, rawPublicKey).privateKey);
    },
    verify: (data, privateKey, signature) => {
        const keyGenerator = crypto.createKeyPairGenerator();
        const rawPublicKey = keyGenerator.getPublicKey(privateKey, 'secp256k1');
        const publicKey = keyGenerator.convertKeys(privateKey, rawPublicKey).publicKey;
        return crypto.verify('sha256', data, publicKey, signature);
    }
};

function CryptoAlgorithmsRegistry() {
}

const registerCryptoFunction = (keySSIType, vn, algorithmType, cryptoFunction) => {
    if (typeof algorithms[keySSIType] !== "undefined" && typeof algorithms[vn] !== "undefined" && typeof algorithms[vn][algorithmType] !== "undefined") {
        throw Error(`A ${algorithmType} is already registered for version ${vn}`);
    }
    if (typeof algorithms[keySSIType] === "undefined") {
        algorithms[keySSIType] = {};
    }

    if (typeof algorithms[keySSIType][vn] === "undefined") {
        algorithms[keySSIType][vn] = {};
    }

    algorithms[keySSIType][vn][algorithmType] = cryptoFunction;
};

const getCryptoFunction = (keySSI, algorithmType) => {
    let cryptoFunction;
    try {
        cryptoFunction = algorithms[keySSI.getName()][keySSI.getVn()][algorithmType];
    } catch (e) {
        cryptoFunction = defaultAlgorithms[algorithmType];
    }

    if (typeof cryptoFunction === "undefined") {
        throw Error(`Algorithm type <${algorithmType}> not recognized`);
    }
    return cryptoFunction;
};


CryptoAlgorithmsRegistry.prototype.registerHashFunction = (keySSIType, vn, hashFunction) => {
    registerCryptoFunction(keySSIType, vn, 'hash', hashFunction);
};

CryptoAlgorithmsRegistry.prototype.getHashFunction = (keySSI) => {
    return getCryptoFunction(keySSI, 'hash');
};

CryptoAlgorithmsRegistry.prototype.registerKeyDerivationFunction = (keySSIType, vn, keyDerivationFunction) => {
    registerCryptoFunction(keySSIType, vn, 'keyDerivation', keyDerivationFunction);
};

CryptoAlgorithmsRegistry.prototype.getKeyDerivationFunction = (keySSI) => {
    return getCryptoFunction(keySSI, 'keyDerivation');
};

CryptoAlgorithmsRegistry.prototype.registerEncryptionFunction = (keySSIType, vn, encryptionFunction) => {
    registerCryptoFunction(keySSIType, vn, 'encryption', encryptionFunction);
};

CryptoAlgorithmsRegistry.prototype.getEncryptionFunction = (keySSI) => {
    return getCryptoFunction(keySSI, 'encryption');
};

CryptoAlgorithmsRegistry.prototype.registerEncryptionKeyGenerationFunction = (keySSIType, vn, keyGeneratorFunction) => {
    registerCryptoFunction(keySSIType, vn, 'encryptionKeyGeneration', keyGeneratorFunction);
};

CryptoAlgorithmsRegistry.prototype.getEncryptionKeyGenerationFunction = (keySSI) => {
    return getCryptoFunction(keySSI, 'encryptionKeyGeneration');
};

CryptoAlgorithmsRegistry.prototype.registerDecryptionFunction = (keySSIType, vn, decryptionFunction) => {
    registerCryptoFunction(keySSIType, vn, 'decryption', decryptionFunction);
};

CryptoAlgorithmsRegistry.prototype.getDecryptionFunction = (keySSI) => {
    return getCryptoFunction(keySSI, 'decryption');
};

CryptoAlgorithmsRegistry.prototype.registerEncodingFunction = (keySSIType, vn, encodingFunction) => {
    registerCryptoFunction(keySSIType, vn, 'encoding', encodingFunction);
};

CryptoAlgorithmsRegistry.prototype.getEncodingFunction = (keySSI) => {
    return getCryptoFunction(keySSI, 'encoding');
};

CryptoAlgorithmsRegistry.prototype.registerDecodingFunction = (keySSIType, vn, decodingFunction) => {
    registerCryptoFunction(keySSIType, vn, 'decoding', decodingFunction);
};

CryptoAlgorithmsRegistry.prototype.getDecodingFunction = (keySSI) => {
    return getCryptoFunction(keySSI, 'decoding');
};

CryptoAlgorithmsRegistry.prototype.registerKeyPairGenerator = (keySSIType, vn, keyPairGenerator) => {
    registerCryptoFunction(keySSIType, vn, 'keyPairGenerator', keyPairGenerator);
};

CryptoAlgorithmsRegistry.prototype.getKeyPairGenerator = (keySSI) => {
    return getCryptoFunction(keySSI, 'keyPairGenerator');
};

CryptoAlgorithmsRegistry.prototype.registerSignFunction = (keySSIType, vn, signFunction) => {
    registerCryptoFunction(keySSIType, vn, 'sign', signFunction);
};

CryptoAlgorithmsRegistry.prototype.getSignFunction = (keySSI) => {
    return getCryptoFunction(keySSI, 'sign');
};

CryptoAlgorithmsRegistry.prototype.registerVerifyFunction = (keySSIType, vn, verifyFunction) => {
    registerCryptoFunction(keySSIType, vn, 'verify', verifyFunction);
};

CryptoAlgorithmsRegistry.prototype.getVerifyFunction = (keySSI) => {
    return getCryptoFunction(keySSI, 'verify');
};

module.exports = new CryptoAlgorithmsRegistry();
}).call(this)}).call(this,{"isBuffer":require("../../../../node_modules/is-buffer/index.js")})

},{"../../../../node_modules/is-buffer/index.js":"/home/travis/build/PrivateSky/privatesky/node_modules/is-buffer/index.js","./SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","pskcrypto":"pskcrypto","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/DSURepresentationNames.js":[function(require,module,exports){
const DSURepresentationNames = {
    "seed": "RawDossier"
}

module.exports = DSURepresentationNames;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIFactory.js":[function(require,module,exports){
const createSecretSSI = require("./SecretSSIs/SecretSSI").createSecretSSI;
const createAnchorSSI = require("./SecretSSIs/AnchorSSI").createAnchorSSI;
const createReadSSI = require("./SecretSSIs/ReadSSI").createReadSSI;
const createPublicSSI = require("./SecretSSIs/PublicSSI").createPublicSSI;
const createZaSSI = require("./SecretSSIs/ZaSSI").createZaSSI;
const createSeedSSI = require("./SeedSSIs/SeedSSI").createSeedSSI;
const createWalletSSI = require("./OtherKeySSIs/WalletSSI").createWalletSSI;
const createSReadSSI = require("./SeedSSIs/SReadSSI").createSReadSSI;
const createSZaSSI = require("./SeedSSIs/SZaSSI").createSZaSSI;
const createPasswordSSI = require("./ConstSSIs/PasswordSSI").createPasswordSSI;
const createArraySSI = require("./ConstSSIs/ArraySSI").createArraySSI;
const createConstSSI = require("./ConstSSIs/ConstSSI").createConstSSI;
const createCZaSSI = require("./ConstSSIs/CZaSSI").createCZaSSI;
const createHashLinkSSI = require("./OtherKeySSIs/HashLinkSSI").createHashLinkSSI;

const SSITypes = require("./SSITypes");

const registry = {};

function KeySSIFactory() {
}

KeySSIFactory.prototype.registerFactory = (typeName, vn, derivedType, functionFactory) => {
    if (typeof derivedType === "function") {
        functionFactory = derivedType;
        derivedType = undefined;
    }

    if (typeof registry[typeName] !== "undefined") {
        throw Error(`A function factory for KeySSI of type ${typeName} is already registered.`);
    }

    registry[typeName] = {derivedType, functionFactory};
};

KeySSIFactory.prototype.create = (identifier, options) => {
    if (typeof identifier === "undefined") {
        throw Error("An SSI should be provided");
    }

    const KeySSIMixin = require("./KeySSIMixin");
    let keySSI = {}
    KeySSIMixin(keySSI);
    keySSI.autoLoad(identifier);

    const typeName = keySSI.getName();

    keySSI = registry[typeName].functionFactory(identifier);
    keySSI.options = options;
    return keySSI;
};

KeySSIFactory.prototype.createType = (typeName)=>{
    return registry[typeName].functionFactory();
}

KeySSIFactory.prototype.getRelatedType = (keySSI, otherType, callback) => {
    if (keySSI.getName() === otherType) {
        return keySSI;
    }
    let currentEntry = registry[otherType];
    if (typeof currentEntry === "undefined") {
        return callback(Error(`${otherType} is not a registered KeySSI type.`))
    }

    while (typeof currentEntry.derivedType !== "undefined") {
        if (currentEntry.derivedType === keySSI.getName()) {
            return $$.securityContext.getRelatedSSI(keySSI, otherType, callback);
        }
        currentEntry = registry[currentEntry.derivedType];
    }

    let derivedKeySSI;
    try {
        derivedKeySSI = getDerivedType(keySSI, otherType);
    } catch (err){
        return callback(err);
    }

    callback(undefined, derivedKeySSI);
};

KeySSIFactory.prototype.getAnchorType = (keySSI) => {
    let localKeySSI = keySSI;
    while (typeof registry[localKeySSI.getName()].derivedType !== "undefined") {
        localKeySSI = localKeySSI.derive();
    }
    return localKeySSI;
};

const getDerivedType = (keySSI, derivedTypeName) => {
    let localKeySSI = keySSI;
    let currentEntry = registry[localKeySSI.getName()];
    while (typeof currentEntry.derivedType !== "undefined") {
        if (currentEntry.derivedType === derivedTypeName) {
            return localKeySSI.derive();
        }
        localKeySSI = localKeySSI.derive();
        currentEntry = registry[currentEntry.derivedType];
    }

    throw Error(`${derivedTypeName} is not a valid KeySSI Type`);
};

KeySSIFactory.prototype.registerFactory(SSITypes.SECRET_SSI, 'v0', SSITypes.ANCHOR_SSI, createSecretSSI);
KeySSIFactory.prototype.registerFactory(SSITypes.ANCHOR_SSI, 'v0', SSITypes.READ_SSI, createAnchorSSI);
KeySSIFactory.prototype.registerFactory(SSITypes.READ_SSI, 'v0', SSITypes.PUBLIC_SSI, createReadSSI);
KeySSIFactory.prototype.registerFactory(SSITypes.PUBLIC_SSI, 'v0', SSITypes.ZERO_ACCESS_SSI, createPublicSSI);
KeySSIFactory.prototype.registerFactory(SSITypes.ZERO_ACCESS_SSI, 'v0', undefined, createZaSSI);
KeySSIFactory.prototype.registerFactory(SSITypes.SEED_SSI, 'v0', SSITypes.SREAD_SSI, createSeedSSI);
KeySSIFactory.prototype.registerFactory(SSITypes.WALLET_SSI, 'v0', SSITypes.SREAD_SSI, createWalletSSI);
KeySSIFactory.prototype.registerFactory(SSITypes.SREAD_SSI, 'v0', SSITypes.SZERO_ACCESS_SSI, createSReadSSI);
KeySSIFactory.prototype.registerFactory(SSITypes.SZERO_ACCESS_SSI, 'v0', undefined, createSZaSSI);
KeySSIFactory.prototype.registerFactory(SSITypes.PASSWORD_SSI, 'v0', SSITypes.CONST_SSI, createPasswordSSI);
KeySSIFactory.prototype.registerFactory(SSITypes.ARRAY_SSI, 'v0', SSITypes.CONST_SSI, createArraySSI);
KeySSIFactory.prototype.registerFactory(SSITypes.CONST_SSI, 'v0', SSITypes.CONSTANT_ZERO_ACCESS_SSI, createConstSSI);
KeySSIFactory.prototype.registerFactory(SSITypes.CONSTANT_ZERO_ACCESS_SSI, 'v0', undefined, createCZaSSI);
KeySSIFactory.prototype.registerFactory(SSITypes.HASH_LINK_SSI, 'v0', undefined, createHashLinkSSI);

module.exports = new KeySSIFactory();
},{"./ConstSSIs/ArraySSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/ConstSSIs/ArraySSI.js","./ConstSSIs/CZaSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/ConstSSIs/CZaSSI.js","./ConstSSIs/ConstSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/ConstSSIs/ConstSSI.js","./ConstSSIs/PasswordSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/ConstSSIs/PasswordSSI.js","./KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","./OtherKeySSIs/HashLinkSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/OtherKeySSIs/HashLinkSSI.js","./OtherKeySSIs/WalletSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/OtherKeySSIs/WalletSSI.js","./SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./SecretSSIs/AnchorSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/AnchorSSI.js","./SecretSSIs/PublicSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/PublicSSI.js","./SecretSSIs/ReadSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/ReadSSI.js","./SecretSSIs/SecretSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/SecretSSI.js","./SecretSSIs/ZaSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/ZaSSI.js","./SeedSSIs/SReadSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SeedSSIs/SReadSSI.js","./SeedSSIs/SZaSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SeedSSIs/SZaSSI.js","./SeedSSIs/SeedSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SeedSSIs/SeedSSI.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js":[function(require,module,exports){
const cryptoRegistry = require("./CryptoAlgorithmsRegistry");
const pskCrypto = require("pskcrypto");

function keySSIMixin(target){
        let _prefix = "ssi";
        let _subtype;
        let _dlDomain;
        let _subtypeSpecificString;
        let _control;
        let _vn = "v0";
        let _hint;

    target.autoLoad = function (identifier) {
        if(typeof identifier === "undefined"){
            return;
        }

        if(typeof identifier !== "string"){
            throw new Error("The identifier should be string");
        }

        let originalId = identifier;
        if(identifier.indexOf(":") === -1){
            identifier = pskCrypto.pskBase58Decode(identifier).toString();
        }

        if(identifier.indexOf(":") === -1){
            throw new Error(`Wrong format of SSI. ${originalId} ${identifier}`);
        }

        let segments = identifier.split(":");
        segments.shift();
        _subtype = segments.shift();
        _dlDomain = segments.shift();
        _subtypeSpecificString = segments.shift();
        _control = segments.shift();
        let version = segments.shift();
        if (version !== '') {
            _vn = version;
        }
        if (segments.length > 0) {
            _hint = segments.join(":");
        }
        _subtypeSpecificString = cryptoRegistry.getDecodingFunction(target)(_subtypeSpecificString);
    }

    target.load = function (subtype, dlDomain, subtypeSpecificString, control, vn, hint) {
        _subtype = subtype;
        _dlDomain = dlDomain;
        _subtypeSpecificString = subtypeSpecificString;
        _control = control;
        _vn = vn || "v0";
        _hint = hint;
    }

    /**
     *
     * @param ssiType - string
     * @param callback - function
     */
    target.getRelatedType = function (ssiType, callback) {
        const KeySSIFactory = require("./KeySSIFactory");
        KeySSIFactory.getRelatedType(target, ssiType, callback);
    }

    target.getAnchorId = function () {
        const keySSIFactory = require("./KeySSIFactory");
        return keySSIFactory.getAnchorType(target).getIdentifier();
    }

    target.getEncryptionKey = function () {
        return _subtypeSpecificString;
    }

    target.getSpecificString = function () {
        return _subtypeSpecificString;
    }

    target.getName = function () {
        return _subtype;
    }

    target.getDLDomain = function () {
        return _dlDomain;
    }

    target.getControl = function () {
        return _control;
    }

    target.getHint = function () {
        return _hint;
    }

    target.getVn = function () {
        return _vn;
    }

    target.getDSURepresentationName = function () {
        const DSURepresentationNames = require("./DSURepresentationNames");
        return DSURepresentationNames[_subtype];
    }

    target.getIdentifier = function (plain) {
        const key = cryptoRegistry.getEncodingFunction(target)(_subtypeSpecificString);
        let id = `${_prefix}:${target.getName()}:${_dlDomain}:${key}:${_control}:${_vn}`;

        if (typeof _hint !== "undefined") {
            id += ":" + _hint;
        }

        return plain ? id : pskCrypto.pskBase58Encode(id);
    }

    target.clone = function(){
        let clone = {};
        clone.prototype = target.prototype;
        for (let attr in target) {
            if (target.hasOwnProperty(attr)){
                clone[attr] = target[attr];
            }
        }
        keySSIMixin(clone);
        return clone;
    }
}

module.exports = keySSIMixin;
},{"./CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","./DSURepresentationNames":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/DSURepresentationNames.js","./KeySSIFactory":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIFactory.js","pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/OtherKeySSIs/HashLinkSSI.js":[function(require,module,exports){
const KeySSIMixin = require("../KeySSIMixin");
const SSITypes = require("../SSITypes");

function HashLinkSSI(identifier) {
    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.autoLoad(identifier);
    }

    this.initialize = (dlDomain, hash, vn) => {
        this.load(SSITypes.HASH_LINK_SSI, dlDomain, hash, '', vn);
    };

    this.getHash = () => {
        return this.getEncryptionKey();
    };

    this.derive = () => {
        throw Error("Not implemented");
    };
}

function createHashLinkSSI(identifier) {
    return new HashLinkSSI(identifier);
}

module.exports = {
    createHashLinkSSI
};
},{"../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/OtherKeySSIs/WalletSSI.js":[function(require,module,exports){
const SeedSSI = require("./../SeedSSIs/SeedSSI");
const SSITypes = require("../SSITypes");

function WalletSSI(identifier) {
    const seedSSI = SeedSSI.createSeedSSI(identifier);

    seedSSI.getName = () => {
        return SSITypes.WALLET_SSI;
    };

    Object.assign(this, seedSSI);

    this.initialize = (dlDomain, privateKey, publicKey, vn, hint, callback) => {

        let oldLoad = seedSSI.load;
        seedSSI.load = function (subtype, dlDomain, subtypeSpecificString, control, vn, hint) {
            oldLoad(SSITypes.WALLET_SSI, dlDomain, subtypeSpecificString, control, vn, hint);
        }

        seedSSI.initialize(dlDomain, privateKey, publicKey, vn, hint, callback);
    }

    this.store = (options, callback) => {
        let ssiCage = require("./../../ssiCage");
        if(typeof options !== "undefined" && typeof options.ssiCage !== "undefined"){
            ssiCage = options.ssiCage;
        }

        ssiCage.putSSI(this.getIdentifier(), options.password, options.overwrite, (err) => {
            if (err) {
                return callback(err);
            }
            callback(undefined, this);
        });
    }

    //options.ssiCage - custom implementation of a SSI Cage
    this.getSeedSSI = (secret, options, callback) => {
        if(typeof options === "function"){
            callback = options;
            options = {};
        }

        let ssiCage = require("../../ssiCage");
        if(typeof options.ssiCage !== "undefined"){
            ssiCage = options.ssiCage;
        }
        ssiCage.getSSI(secret, (err, ssiSerialization)=>{
            if(err){
                return callback(err);
            }

            //SeedSSI or WalletSSI ???????????
            let keySSI = SeedSSI.createSeedSSI(ssiSerialization);
            keySSI.options = options;
            callback(undefined, keySSI);
        });
    }

    this.checkForSSICage = (callback) => {
        let ssiCage = require("../../ssiCage");
        ssiCage.check(callback);
    }
}

function createWalletSSI(identifier) {
    return new WalletSSI(identifier);
}

module.exports = {
    createWalletSSI
}

},{"../../ssiCage":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/ssiCage/index.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./../../ssiCage":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/ssiCage/index.js","./../SeedSSIs/SeedSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SeedSSIs/SeedSSI.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js":[function(require,module,exports){
module.exports = {
    DEFAULT: "default",
    SECRET_SSI: "secret",
    ANCHOR_SSI: "anchor",
    READ_SSI: "read",
    PUBLIC_SSI: "public",
    ZERO_ACCESS_SSI: "za",
    SEED_SSI: "seed",
    SREAD_SSI: "sread",
    SZERO_ACCESS_SSI: "sza",
    PASSWORD_SSI: "pass",
    CONST_SSI: "const",
    CONSTANT_ZERO_ACCESS_SSI: "cza",
    ARRAY_SSI: "array",
    HASH_LINK_SSI: "hl",
    WALLET_SSI: "wallet"
};
},{}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/AnchorSSI.js":[function(require,module,exports){
const KeySSIMixin = require("../KeySSIMixin");
const ReadSSI = require("./ReadSSI");
const SSITypes = require("../SSITypes");
const cryptoRegistry = require("../CryptoAlgorithmsRegistry");

function AnchorSSI(identifier) {
    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.autoLoad(identifier);
    }

    this.derive = () => {
        const readSSI = ReadSSI.createReadSSI();
        const subtypeKey = cryptoRegistry.getHashFunction(this)(this.getEncryptionKey());
        readSSI.load(SSITypes.READ_SSI, this.getDLDomain(), subtypeKey, this.getControl(), this.getVn(), this.getHint());
        return readSSI;
    };
}

function createAnchorSSI(identifier) {
    return new AnchorSSI(identifier);
}

module.exports = {
    createAnchorSSI
}
},{"../CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./ReadSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/ReadSSI.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/PublicSSI.js":[function(require,module,exports){
const KeySSIMixin = require("../KeySSIMixin");
const ZaSSI = require("./ZaSSI");
const SSITypes = require("../SSITypes");
const cryptoRegistry = require("../CryptoAlgorithmsRegistry");

function PublicSSI(identifier) {
    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.autoLoad(identifier);
    }

    this.derive = () => {
        const zaSSI = ZaSSI.createZaSSI();
        const subtypeKey = cryptoRegistry.getHashFunction(this)(this.getEncryptionKey())
        zaSSI.initialize(SSITypes.ZERO_ACCESS_SSI, this.getDLDomain(), subtypeKey, this.getControl(), this.getVn(), this.getHint());
        return zaSSI;
    };
}

function createPublicSSI(identifier) {
    return new PublicSSI(identifier);
}

module.exports = {
    createPublicSSI
};
},{"../CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./ZaSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/ZaSSI.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/ReadSSI.js":[function(require,module,exports){
const KeySSIMixin = require("../KeySSIMixin");
const PublicSSI = require("./PublicSSI");
const SSITypes = require("../SSITypes");
const cryptoRegistry = require("../CryptoAlgorithmsRegistry");

function ReadSSI(identifier) {
    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.load(identifier);
    }

    this.derive = () => {
        const publicSSI = PublicSSI.createPublicSSI();
        const subtypeKey = cryptoRegistry.getHashFunction(this)(this.getEncryptionKey());
        publicSSI.load(SSITypes.PUBLIC_SSI, this.getDLDomain(), subtypeKey, this.getControl(), this.getVn(), this.getHint());
        return publicSSI;
    };
}

function createReadSSI(identifier) {
    return new ReadSSI(identifier);
}

module.exports = {
    createReadSSI
};
},{"../CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./PublicSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/PublicSSI.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/SecretSSI.js":[function(require,module,exports){
const KeySSIMixin = require("../KeySSIMixin");
const AnchorSSI = require("./AnchorSSI");
const SSITypes = require("../SSITypes");
const cryptoRegistry = require("../CryptoAlgorithmsRegistry");

function SecretSSI(identifier) {
    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.autoLoad(identifier);
    }

    this.derive = () => {
        const anchorSSI = AnchorSSI.createAnchorSSI();
        const subtypeKey = cryptoRegistry.getHashFunction(this)(this.getEncryptionKey())
        anchorSSI.load(SSITypes.ANCHOR_SSI, this.getDLDomain(), subtypeKey, this.getControl(), this.getVn(), this.getHint());
        return anchorSSI;
    };
}

function createSecretSSI (identifier){
    return new SecretSSI(identifier);
}
module.exports = {
    createSecretSSI
}
},{"../CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./AnchorSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/AnchorSSI.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SecretSSIs/ZaSSI.js":[function(require,module,exports){
const KeySSIMixin = require("../KeySSIMixin");
function ZaSSI(identifier) {
    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.autoLoad(identifier);
    }

    this.derive = () => {
        throw Error("Not implemented");
    };
}

function createZaSSI(identifier) {
    return new ZaSSI(identifier);
}

module.exports = {
    createZaSSI
};
},{"../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SeedSSIs/SReadSSI.js":[function(require,module,exports){
(function (Buffer){(function (){
const KeySSIMixin = require("../KeySSIMixin");
const SZaSSI = require("./SZaSSI");
const SSITypes = require("../SSITypes");
const cryptoRegistry = require("../CryptoAlgorithmsRegistry");

function SReadSSI(identifier) {
    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.autoLoad(identifier);
    }

    this.initialize = (dlDomain, vn, hint) => {
        this.load(SSITypes.SREAD_SSI, dlDomain, "", undefined, vn, hint);
    };

    this.derive = () => {
        const sZaSSI = SZaSSI.createSZaSSI();
        const subtypeKey = '';
        const subtypeControl = cryptoRegistry.getHashFunction(this)(this.getControl());
        sZaSSI.load(SSITypes.SZERO_ACCESS_SSI, this.getDLDomain(), subtypeKey, subtypeControl, this.getVn(), this.getHint());
        return sZaSSI;
    };

    let getEncryptionKey = this.getEncryptionKey;

    this.getEncryptionKey = () => {
        return Buffer.from(getEncryptionKey(), 'hex');
    };
}

function createSReadSSI(identifier) {
    return new SReadSSI(identifier)
}

module.exports = {
    createSReadSSI
};
}).call(this)}).call(this,require("buffer").Buffer)

},{"../CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./SZaSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SeedSSIs/SZaSSI.js","buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SeedSSIs/SZaSSI.js":[function(require,module,exports){
const KeySSIMixin = require("../KeySSIMixin");
const SSITypes = require("../SSITypes");

function SZaSSI(identifier) {
    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.autoLoad(identifier);
    }

    this.initialize = (dlDomain, hpk, vn, hint) => {
        this.load(SSITypes.SZERO_ACCESS_SSI, dlDomain, '', hpk, vn, hint);
    };

    this.derive = () => {
        throw Error("Not implemented");
    };
}

function createSZaSSI(identifier) {
    return new SZaSSI(identifier);
}

module.exports = {
    createSZaSSI
};
},{"../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SeedSSIs/SeedSSI.js":[function(require,module,exports){
const KeySSIMixin = require("../KeySSIMixin");
const SReadSSI = require("./SReadSSI");
const SSITypes = require("../SSITypes");
const cryptoRegistry = require("../CryptoAlgorithmsRegistry");

function SeedSSI(identifier) {
    KeySSIMixin(this);

    if (typeof identifier !== "undefined") {
        this.autoLoad(identifier);
    }

    this.getName = () => {
        return SSITypes.SEED_SSI;
    };

    this.initialize = function (dlDomain, privateKey, publicKey, vn, hint, callback){
        let subtypeSpecificString = privateKey;

        if (typeof subtypeSpecificString === "undefined") {
            return cryptoRegistry.getKeyPairGenerator(this)().generateKeyPair((err, publicKey, privateKey) => {
                if (err) {
                    return callback(err);
                }
                subtypeSpecificString = privateKey;
                this.load(SSITypes.SEED_SSI, dlDomain, subtypeSpecificString, '', vn, hint);
                callback(undefined, this);
            });
        }
        this.load(SSITypes.SEED_SSI, dlDomain, subtypeSpecificString, '', vn, hint);
        callback(undefined, this);
    };

    this.derive = function() {
        const sReadSSI = SReadSSI.createSReadSSI();
        const subtypeKey = cryptoRegistry.getHashFunction(this)(this.getSpecificString());
        const publicKey = cryptoRegistry.getKeyPairGenerator(this)().getPublicKey(this.getSpecificString());
        const subtypeControl = cryptoRegistry.getHashFunction(this)(publicKey);
        sReadSSI.load(SSITypes.SREAD_SSI, this.getDLDomain(), subtypeKey, subtypeControl, this.getVn(), this.getHint());
        return sReadSSI;

        /*
        const sReadSSI = SReadSSI.createSReadSSI();
        const subtypeKey = cryptoRegistry.getHashFunction(this)(this.subtypeSpecificString);
        const publicKey = cryptoRegistry.getKeyPairGenerator(this)().getPublicKey(this.subtypeSpecificString);
        const subtypeControl = cryptoRegistry.getHashFunction(this)(publicKey);
        sReadSSI.load(SSITypes.SREAD_SSI, this.dlDomain, subtypeKey, subtypeControl, this.vn, this.hint);
        return sReadSSI;
        * */
    };

    let getEncryptionKey = this.getEncryptionKey;

    this.getEncryptionKey = function() {
        return this.derive().getEncryptionKey();
    };
}

function createSeedSSI(identifier) {
    return new SeedSSI(identifier);
}

module.exports = {
    createSeedSSI
};
},{"../CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","../KeySSIMixin":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIMixin.js","../SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./SReadSSI":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SeedSSIs/SReadSSI.js"}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/constants.js":[function(require,module,exports){
'use strict';

module.exports = {
    DEFAULT_DOMAIN: 'localDomain',
    DID_VERSION: '1',
    DEFAULT_BAR_MAP_STRATEGY: 'Diff',
}

},{}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/ssiCage/BrowserSSICage.js":[function(require,module,exports){
(function (Buffer){(function (){
const pskcrypto = "pskcrypto";
const crypto = require(pskcrypto);

const storageLocation = "SSICage";
const algorithm = "aes-256-cfb";

/**
 * local storage can't handle properly binary data
 *  https://stackoverflow.com/questions/52419694/how-to-store-uint8array-in-the-browser-with-localstorage-using-javascript
 * @param secret
 * @param callback
 * @returns {*}
 */
function getSSI(secret, callback) {
    let encryptedSSI;
    let keySSI;
    try {
        encryptedSSI = localStorage.getItem(storageLocation);
        if (encryptedSSI === null || typeof encryptedSSI !== "string" || encryptedSSI.length === 0) {
            return callback(new Error("SSI Cage is empty or data was altered"));
        }

        const retrievedEncryptedArr = JSON.parse(encryptedSSI);
        encryptedSSI = new Uint8Array(retrievedEncryptedArr);
        const pskEncryption = crypto.createPskEncryption(algorithm);
        const encKey = crypto.deriveKey(algorithm, secret);
        keySSI = pskEncryption.decrypt(encryptedSSI, encKey).toString();
    } catch (e) {
        return callback(e);
    }
    callback(undefined, keySSI);
}

function putSSI(keySSI, secret, overwrite = false, callback) {
    let encryptedSSI;

    if (typeof overwrite === "function") {
        callback(Error("TODO: api signature updated!"));
    }
    try {
        if (typeof keySSI === "string") {
            keySSI = Buffer.from(keySSI);
        }
        if (typeof keySSI === "object" && !Buffer.isBuffer(keySSI)) {
            keySSI = Buffer.from(keySSI);
        }

        const pskEncryption = crypto.createPskEncryption(algorithm);
        const encKey = crypto.deriveKey(algorithm, secret);
        encryptedSSI = pskEncryption.encrypt(keySSI, encKey);
        const encryptedArray =  Array.from(encryptedSSI);
        const encryptedSeed = JSON.stringify(encryptedArray);

        localStorage.setItem(storageLocation, encryptedSeed);
    } catch (e) {
        return callback(e);
    }
    callback(undefined);
}

function check(callback) {
    let item;
    try {
        item = localStorage.getItem(storageLocation);
    } catch (e) {
        return callback(e);
    }
    if (item) {
        return callback();
    }
    callback(new Error("SSI Cage does not exists"));
}

module.exports = {
    check,
    putSSI,
    getSSI
};

}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/ssiCage/NodeSSICage.js":[function(require,module,exports){
(function (Buffer){(function (){
const pth = "path";
const path = require(pth);

const fileSystem = "fs";
const fs = require(fileSystem);

const pskcrypto = "pskcrypto";
const crypto = require(pskcrypto);
const algorithm = "aes-256-cfb";

const os = "os";
const storageLocation = process.env.SEED_CAGE_LOCATION || require(os).homedir();
const storageFileName = ".SSICage";
const ssiCagePath = path.join(storageLocation, storageFileName);

function getSSI(secret, callback) {
    fs.readFile(ssiCagePath, (err, encryptedSeed) => {
        if (err) {
            return callback(err);
        }

        let keySSI;
        try {
            const pskEncryption = crypto.createPskEncryption(algorithm);
            const encKey = crypto.deriveKey(algorithm, secret);
            keySSI = pskEncryption.decrypt(encryptedSeed, encKey).toString();
        } catch (e) {
            return callback(e);
        }

        callback(undefined, keySSI);
    });
}

function putSSI(keySSI, secret, overwrite = false, callback) {
    fs.mkdir(storageLocation, {recursive: true}, (err) => {
        if (err) {
            return callback(err);
        }

        fs.stat(ssiCagePath, (err, stats) => {
            if (!err && stats.size > 0) {
                if (overwrite) {
                    __encryptSSI();
                } else {
                    return callback(Error("Attempted to overwrite existing SEED."));
                }
            } else {
                __encryptSSI();
            }

            function __encryptSSI() {
                let encSeed;
                try {
                    if (typeof keySSI === "string") {
                        keySSI = Buffer.from(keySSI);
                    }

                    if (typeof keySSI === "object" && !Buffer.isBuffer(keySSI)) {
                        keySSI = Buffer.from(keySSI);
                    }

                    const pskEncryption = crypto.createPskEncryption(algorithm);
                    const encKey = crypto.deriveKey(algorithm, secret);
                    encSeed = pskEncryption.encrypt(keySSI, encKey);
                } catch (e) {
                    return callback(e);
                }

                fs.writeFile(ssiCagePath, encSeed, callback);
            }
        });
    });
}

function check(callback) {
    fs.access(ssiCagePath, callback);
}

module.exports = {
    check,
    putSSI,
    getSSI
};

}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/ssiCage/index.js":[function(require,module,exports){
const or = require("overwrite-require");
switch ($$.environmentType) {
    case or.constants.THREAD_ENVIRONMENT_TYPE:
    case or.constants.NODEJS_ENVIRONMENT_TYPE:
        module.exports = require("./NodeSSICage");
        break;
    case or.constants.BROWSER_ENVIRONMENT_TYPE:
        module.exports = require("./BrowserSSICage");
        break;
    case or.constants.SERVICE_WORKER_ENVIRONMENT_TYPE:
    case or.constants.ISOLATE_ENVIRONMENT_TYPE:
    default:
        throw new Error("No implementation of SSI Cage for this env type.");
}
},{"./BrowserSSICage":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/ssiCage/BrowserSSICage.js","./NodeSSICage":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/ssiCage/NodeSSICage.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/node-fd-slicer/modules/node-pend/index.js":[function(require,module,exports){
module.exports = Pend;

function Pend() {
  this.pending = 0;
  this.max = Infinity;
  this.listeners = [];
  this.waiting = [];
  this.error = null;
}

Pend.prototype.go = function(fn) {
  if (this.pending < this.max) {
    pendGo(this, fn);
  } else {
    this.waiting.push(fn);
  }
};

Pend.prototype.wait = function(cb) {
  if (this.pending === 0) {
    cb(this.error);
  } else {
    this.listeners.push(cb);
  }
};

Pend.prototype.hold = function() {
  return pendHold(this);
};

function pendHold(self) {
  self.pending += 1;
  var called = false;
  return onCb;
  function onCb(err) {
    if (called) throw new Error("callback called twice");
    called = true;
    self.error = self.error || err;
    self.pending -= 1;
    if (self.waiting.length > 0 && self.pending < self.max) {
      pendGo(self, self.waiting.shift());
    } else if (self.pending === 0) {
      var listeners = self.listeners;
      self.listeners = [];
      listeners.forEach(cbListener);
    }
  }
  function cbListener(listener) {
    listener(self.error);
  }
}

function pendGo(self, fn) {
  fn(pendHold(self));
}

},{}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/anchoring/index.js":[function(require,module,exports){
const openDSU = require("opendsu");
const bdns = openDSU.loadApi("bdns");
const keyssi = openDSU.loadApi("keyssi");
const { fetch, doPut } = openDSU.loadApi("http");

/**
 * Get versions
 * @param {keySSI} keySSI 
 * @param {string} authToken 
 * @param {function} callback 
 */
const versions = (keySSI, authToken, callback) => {
    if (typeof authToken === 'function') {
        callback = authToken;
        authToken = undefined;
    }

    bdns.getAnchoringServices(keySSI.getDLDomain(), (err, anchoringServicesArray) => {
        if (err) {
            return callback(err);
        }

        if (!anchoringServicesArray.length) {
            return callback('No anchoring service provided');
        }

        const queries = anchoringServicesArray.map((service) => fetch(`${service}/anchor/versions/${keySSI.getAnchorId()}`));
        //TODO: security issue (which response we trust)
        Promise.allSettled(queries).then((responses) => {
            const response = responses.find((response) => response.status === 'fulfilled');

            response.value.json().then((hlStrings) => {

                const hashLinks = hlStrings.map(hlString => {
                    return keyssi.parse(hlString)
                });

                return callback(null, hashLinks)
            })
        }).catch((err) => callback(err));
    });
};

/**
 * Add new version
 * @param {keySSI} keySSI 
 * @param {hashLinkSSI} newHashLinkSSI 
 * @param {hashLinkSSI} lastHashLinkSSI 
 * @param {string} zkpValue 
 * @param {string} digitalProof 
 * @param {function} callback 
 */
const addVersion = (keySSI, newHashLinkSSI, lastHashLinkSSI, zkpValue, digitalProof, callback) => {
    if (typeof lastHashLinkSSI === "function") {
        callback = lastHashLinkSSI;
        lastHashLinkSSI = undefined;
    }

    if (typeof zkpValue === "function") {
        callback = zkpValue;
        zkpValue = undefined;
    }

    bdns.getAnchoringServices(keySSI.getDLDomain(), (err, anchoringServicesArray) => {
        if (err) {
            return callback(err);
        }

        if (!anchoringServicesArray.length) {
            return callback('No anchoring service provided');
        }

        const body = {
            hash: {
                last: lastHashLinkSSI ? lastHashLinkSSI.getIdentifier() : null,
                new: newHashLinkSSI.getIdentifier()
            },
            zkpValue,
            digitalProof
        };

        const queries = anchoringServicesArray.map((service) => {
            return new Promise((resolve, reject) => {
                doPut(`${service}/anchor/add/${keySSI.getAnchorId()}`, JSON.stringify(body), (err, data) => {
                    if (err) {
                        return reject({
                            statusCode: err.statusCode,
                            message: err.statusCode === 428 ? 'Unable to add alias: versions out of sync' : err.message || 'Error'
                        });
                    }

                    return resolve(data);
                });
            })
        });

        Promise.allSettled(queries).then((responses) => {
            const response = responses.find((response) => response.status === 'fulfilled');

            if (!response) {
                const rejected = responses.find((response) => response.status === 'rejected');
                return callback(rejected.reason)
            }

            callback(null, response.value);
        });
    });

};

const getObservable = (keySSI, fromVersion, authToken, timeout) => {
    // TODO: to be implemented
}

module.exports = {
    addVersion,
    versions
}
},{"opendsu":"opendsu"}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/bdns/index.js":[function(require,module,exports){
if (typeof bdns === "undefined") {
    bdns = require("bdns").create();
}
const getRawInfo = (dlDomain, callback) => {
    bdns.getRawInfo(dlDomain, callback);
};

const getBrickStorages = (dlDomain, callback) => {
    bdns.getBrickStorages(dlDomain, callback);
};

const getAnchoringServices = (dlDomain, callback) => {
    bdns.getAnchoringServices(dlDomain, callback);
};

const getReplicas = (dlDomain, callback) => {
    bdns.getReplicas(dlDomain, callback);
};

const addRawInfo = (dlDomain, rawInfo) => {
    bdns.addRawInfo(dlDomain, rawInfo);
};

const addAnchoringServices = (dlDomain, anchoringServices) => {
    bdns.addAnchoringServices(dlDomain, anchoringServices);
};

const addBrickStorages = (dlDomain, brickStorages) => {
    bdns.addBrickStorages(dlDomain, brickStorages);
};

const addReplicas = (dlDomain, replicas) => {
    bdns.addReplicas(dlDomain, replicas);
};

module.exports = {
    getRawInfo,
    getBrickStorages,
    getAnchoringServices,
    getReplicas,
    addRawInfo,
    addAnchoringServices,
    addBrickStorages,
    addReplicas
}
},{"bdns":"bdns"}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/bricking/index.js":[function(require,module,exports){
(function (Buffer){(function (){
const openDSU = require("opendsu");
const bdns = openDSU.loadApi("bdns");
const {fetch, doPut} = openDSU.loadApi("http");
const or = require("overwrite-require");
/**
 * Get brick
 * @param {hashLinkSSI} hashLinkSSI
 * @param {string} authToken
 * @param {function} callback
 * @returns {any}
 */
const getBrick = (hashLinkSSI, authToken, callback) => {
    if (typeof authToken === 'function') {
        callback = authToken;
        authToken = undefined;
    }

    bdns.getBrickStorages(hashLinkSSI.getDLDomain(), (err, brickStorageArray) => {
        if (err) {
            return callback(err);
        }

        const brickHash = hashLinkSSI.getHash();

        if (!brickStorageArray.length) {
            return callback('No storage provided');
        }

        const queries = brickStorageArray.map((storage) => fetch(`${storage}/bricks/get-brick/${brickHash}`));

        Promise.all(queries).then((responses) => {
            responses[0].arrayBuffer().then((data) => callback(null, data));
        }).catch((err) => callback(err));
    });
};

/**
 * Get multiple bricks
 * @param {hashLinkSSIList} hashLinkSSIList
 * @param {string} authToken
 * @param {function} callback
 */
const getMultipleBricks = (hashLinkSSIList, authToken, callback) => {
    if (typeof authToken === 'function') {
        callback = authToken;
        authToken = undefined;
    }

    bdns.getBrickStorages(hashLinkSSIList[0].getDLDomain(), (err, brickStorageArray) => {
        const bricksHashes = hashLinkSSIList.map((hashLinkSSI) => hashLinkSSI.getHash());
        if (!brickStorageArray.length) {
            return callback('No storage provided');
        }

        let index = 0;
        const size = 50;
        const queries = [];

        while (index < bricksHashes.length) {
            const hashQuery = `${bricksHashes.slice(index, size + index).join('&hashes=')}`;
            index += size;
            queries.push(Promise.allSettled(brickStorageArray.map((storage) => {
                return fetch(`${storage}/bricks/downloadMultipleBricks/?hashes=${hashQuery}`)
            })));
        }

        Promise.all(queries).then((responses) => {
            Promise.all(responses.reduce((acc, response) => {
                const batch = response.find((item) => item.status === 'fulfilled');

                acc.push(batch.value.arrayBuffer());
                return acc;
            }, [])).
            then(
                (dataArray) => {
                    if ($$.environmentType === or.constants.BROWSER_ENVIRONMENT_TYPE ||
                            $$.environmentType === or.constants.SERVICE_WORKER_ENVIRONMENT_TYPE) {
                        let len = 0;
                        dataArray.forEach(arr => len += arr.byteLength);
                        const newBuffer = new Buffer(len);
                        let currentPos = 0;
                        while (dataArray.length > 0) {
                            const arrBuf = dataArray.shift();
                            const partialDataView = new DataView(arrBuf);
                            for (let i = 0; i < arrBuf.byteLength; i++) {
                                newBuffer.writeUInt8(partialDataView.getUint8(i), currentPos);
                                currentPos += 1;
                            }
                        }
                        return parseResponse(newBuffer, callback);
                    }
                    return parseResponse(Buffer.concat(dataArray), callback)});
        }).catch((err) => {
            callback(err);
        });

        function parseResponse(response, callback) {
            const BRICK_MAX_SIZE_IN_BYTES = 4;

            if (response.length > 0) {
                const brickSizeBuffer = response.slice(0, BRICK_MAX_SIZE_IN_BYTES);

                const brickSize = brickSizeBuffer.readUInt32BE();
                const brickData = response.slice(BRICK_MAX_SIZE_IN_BYTES, brickSize + BRICK_MAX_SIZE_IN_BYTES);

                callback(null, brickData);

                response = response.slice(brickSize + BRICK_MAX_SIZE_IN_BYTES);

                return parseResponse(response, callback);
            }
        }
    });
};

/**
 * Put brick
 * @param {keySSI} keySSI
 * @param {ReadableStream} brick
 * @param {string} authToken
 * @param {function} callback
 * @returns {string} brickhash
 */
const putBrick = (keySSI, brick, authToken, callback) => {
    if (typeof authToken === 'function') {
        callback = authToken;
        authToken = undefined;
    }

    bdns.getBrickStorages(keySSI.getDLDomain(), (err, brickStorageArray) => {
        if (err) {
            return callback(err);
        }

        const queries = brickStorageArray.map((storage) => {
            return new Promise((resolve, reject) => {
                doPut(`${storage}/bricks/put-brick`, brick, (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(data);
                });
            })
        });

        Promise.allSettled(queries).then((responses) => {
            const foundBrick = responses.find((response) => response.status === 'fulfilled');

            if (!foundBrick) {
                return callback({message: 'Brick not created'});
            }

            return callback(null, JSON.parse(foundBrick.value).message)
        });
    });
};

module.exports = {getBrick, putBrick, getMultipleBricks};

}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false,"opendsu":"opendsu","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/crypto/index.js":[function(require,module,exports){
(function (Buffer){(function (){
const cryptoRegistry = require("key-ssi-resolver").CryptoAlgorithmsRegistry;

const hash = (keySSI, data, callback) => {
    if (typeof data === "object" && !Buffer.isBuffer(data)) {
        data = JSON.stringify(data);
    }
    const hash = cryptoRegistry.getHashFunction(keySSI);
    callback(undefined, hash(data));
};

const encrypt = (keySSI, buffer, callback) => {
    const encrypt = cryptoRegistry.getEncryptionFunction(keySSI);
    callback(undefined, encrypt(buffer, keySSI.getEncryptionKey()));

};

const decrypt = (keySSI, encryptedBuffer, callback) => {
    const decrypt = cryptoRegistry.getDecryptionFunction(keySSI);
    let decryptedBuffer;
    try {
        decryptedBuffer = decrypt(encryptedBuffer, keySSI.getEncryptionKey());
    } catch (e) {
        return callback(e);
    }
    callback(undefined, decryptedBuffer);

};

const sign = (keySSI, hash, callback) => {
    const sign = cryptoRegistry.getSignFunction(keySSI);
    callback(undefined, sign(hash, keySSI.getEncryptionKey()));
};

const verifySignature = (keySSI, hash, signature, callback) => {
    const verify = cryptoRegistry.getVerifyFunction(keySSI);
    callback(undefined, verify(hash, keySSI.getEncryptionKey(), signature));
};

const generateEncryptionKey = (keySSI, callback) => {
    const generateEncryptionKey = cryptoRegistry.getEncryptionKeyGenerationFunction(keySSI);
    callback(undefined, generateEncryptionKey());
};

const encode = (keySSI, data) => {
    const encode = cryptoRegistry.getEncodingFunction(keySSI);
    return encode(data);
};

const decode = (keySSI, data) => {
    const decode = cryptoRegistry.getDecodingFunction(keySSI);
    return decode(data);
};

module.exports = {
    hash,
    encrypt,
    decrypt,
    sign,
    verifySignature,
    generateEncryptionKey,
    encode,
    decode
};

}).call(this)}).call(this,{"isBuffer":require("../../../node_modules/is-buffer/index.js")})

},{"../../../node_modules/is-buffer/index.js":"/home/travis/build/PrivateSky/privatesky/node_modules/is-buffer/index.js","key-ssi-resolver":"key-ssi-resolver"}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/dc/index.js":[function(require,module,exports){
/*
html API space
*/
},{}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/dt/index.js":[function(require,module,exports){
arguments[4]["/home/travis/build/PrivateSky/privatesky/modules/opendsu/dc/index.js"][0].apply(exports,arguments)
},{}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/http/browser/index.js":[function(require,module,exports){
(function (Buffer){(function (){
function generateMethodForRequestWithData(httpMethod) {
	return function (url, data, callback) {
		const xhr = new XMLHttpRequest();

		xhr.onload = function () {
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
				const data = xhr.response;
				callback(undefined, data);
			} else {
				if(xhr.status>=400){
					const error = new Error("An error occured. StatusCode: " + xhr.status);
					callback({error: error, statusCode: xhr.status});
				} else {
					console.log(`Status code ${xhr.status} received, response is ignored.`);
				}
			}
		};

		xhr.onerror = function (e) {
			callback(new Error("A network error occurred"));
		};

		xhr.open(httpMethod, url, true);
		//xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

		if(data && data.pipe && typeof data.pipe === "function"){
			const buffers = [];
			data.on("data", function(data) {
				buffers.push(data);
			});
			data.on("end", function() {
				const actualContents = Buffer.concat(buffers);
				xhr.send(actualContents);
			});
		}
		else {
			if(ArrayBuffer.isView(data) || data instanceof ArrayBuffer) {
				xhr.setRequestHeader('Content-Type', 'application/octet-stream');

				/**
				 * Content-Length is an unsafe header and we cannot set it.
				 * When browser is making a request that is intercepted by a service worker,
				 * the Content-Length header is not set implicitly.
				 */
				xhr.setRequestHeader('X-Content-Length', data.byteLength);
			}
			xhr.send(data);
		}
	};
}

module.exports = {
	fetch: fetch,
	doPost: generateMethodForRequestWithData('POST'),
	doPut: generateMethodForRequestWithData('PUT')
}
}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/http/index.js":[function(require,module,exports){
/**
 * http API space
 */
const or = require('overwrite-require');

switch ($$.environmentType) {
	case or.constants.BROWSER_ENVIRONMENT_TYPE:
		module.exports = require("./browser");
		break;
	case or.constants.SERVICE_WORKER_ENVIRONMENT_TYPE:
		module.exports = require("./serviceWorker");
		break;
	default:
		module.exports = require("./node");
}

const PollRequestManager = require("./utils/PollRequestManager");
const rm = new PollRequestManager(module.exports.fetch);

module.exports.poll = function (url, options, delayStart) {
	const request = rm.createRequest(url, options, delayStart);
	return request;
};

module.exports.unpoll = function(request){
	rm.cancelRequest(request);
}

},{"./browser":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/http/browser/index.js","./node":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/http/node/index.js","./serviceWorker":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/http/serviceWorker/index.js","./utils/PollRequestManager":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/http/utils/PollRequestManager.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/http/node/fetch.js":[function(require,module,exports){
(function (Buffer){(function (){
const http = require("http");
const https = require("https");
const URL = require("url");

function getProtocol(url, options) {
	let protocol;

	// const urlObject = new URL(url).catch((err) => { throw new Error(err) });
	// return urlObject.protocol === 'http:' ? http : https

	if (typeof options !== "undefined") {
		if (options.protocol === 'http') {
			protocol = http;
		} else if (options.protocol === 'https') {
			protocol = https;
		} else {
			if (url.startsWith("https:")) {
				protocol = https;
			} else if (url.startsWith("http:")) {
				protocol = http;
			}
		}
	} else {
		if (url.startsWith("https:")) {
			protocol = https;
		} else if (url.startsWith("http:")) {
			protocol = http;
		}
	}

	if (typeof protocol === "undefined") {
		throw new Error(`Unable to determine the protocol`);
	}

	return protocol;
}

function decipherUrl(url, options) {
	const innerUrl = URL.parse(url);

	options.hostname = innerUrl.hostname;
	options.path = innerUrl.pathname + (innerUrl.search || '');
	options.port = parseInt(innerUrl.port);
}

function getMethod(options) {
	let method = 'get';
	if (typeof options !== "undefined") {
		method = options.method;
	}
	return method;
}

function convertOptions(options = {}) {
	//convert from fetch options into xhr options

	if (typeof options.method === "undefined") {
		options.method = 'GET';
	}

	return options;
}

function fetch(url, options = {}) {
	const protocol = getProtocol(url, options);

	let promise = new Promise((resolve, reject) => {
		decipherUrl(url, options);
		let request = protocol.request(url, {}, (response) => {
			resolve(new Response(request, response));
		});

		request.on("error", (error) => {
			reject(error);
		});

		request.end();
	});

	return promise;
}

function Response(httpRequest, httpResponse) {
	let handlers = {};

	let readingInProgress = false;
	function readResponse(callback) {
		if (readingInProgress) {
			throw new Error("Response reading in progress");
		}

		readingInProgress = true;

		//data collecting
		let rawData;
		const contentType = httpResponse.headers['content-type'];

		if (contentType === "application/octet-stream") {
			rawData = [];
		} else {
			rawData = '';
		}

		httpResponse.on('data', (chunk) => {
			if (Array.isArray(rawData)) {
				rawData.push(...chunk);
			} else {
				rawData += chunk;
			}
		});

		httpResponse.on('end', () => {
			try {
				if (Array.isArray(rawData)) {
					rawData = Buffer.from(rawData);
				}
				callback(undefined, rawData);
			} catch (err) {
				callback(err);
			} finally {
				//trying to prevent getting ECONNRESET error after getting our response
				httpRequest.abort();
			}
		});
	}

	this.ok = httpResponse.statusCode >= 200 && httpResponse.statusCode < 300 ? true : false;

	this.arrayBuffer = function () {
		let promise = new Promise((resolve, reject) => {
			readResponse((err, responseBody) => {
				if (err) {
					return reject(err);
				}
				//endure responseBody has the wright type of ArrayBuffer
				resolve(responseBody);
			});
		});
		return promise;
	}

	this.blob = function () {
		let promise = new Promise((resolve, reject) => {
			readResponse((err, responseBody) => {
				if (err) {
					return reject(err);
				}
				resolve(responseBody);
			});
		});
		return promise;
	}

	this.text = function () {
		let promise = new Promise((resolve, reject) => {
			readResponse((err, responseBody) => {
				if (err) {
					return reject(err);
				}
				resolve(responseBody);
			});
		});
		return promise;
	}

	this.formData = function () {
		let promise = new Promise((resolve, reject) => {
			readResponse((err, responseBody) => {
				if (err) {
					return reject(err);
				}
				resolve(responseBody);
			});
		});
		return promise;
	}

	this.json = function () {
		let promise = new Promise((resolve, reject) => {
			readResponse((err, responseBody) => {
				if (err) {
					return reject(err);
				}
				let jsonContent;
				try {
					//do we really need this if ?!
					if (Buffer.isBuffer(responseBody)) {
						responseBody = responseBody.toString();
					}
					jsonContent = JSON.parse(responseBody);
				} catch (err) {
					return reject(err);
				}
				resolve(jsonContent);
			});
		});
		return promise;
	}

	return this;
}

module.exports = {
	fetch
}
}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false,"http":false,"https":false,"url":false}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/http/node/index.js":[function(require,module,exports){
(function (Buffer){(function (){
const http = require("http");
const https = require("https");
const URL = require("url");

const userAgent = 'PSK NodeAgent/0.0.1';
const signatureHeaderName = process.env.vmq_signature_header_name || "x-signature";

function getNetworkForOptions(options) {
	if(options.protocol === 'http:') {
		return http;
	} else if(options.protocol === 'https:') {
		return https;
	} else {
		throw new Error(`Can't handle protocol ${options.protocol}`);
	}

}

function generateMethodForRequestWithData(httpMethod) {
	return function (url, data, callback) {
		const innerUrl = URL.parse(url);

		const options = {
			hostname: innerUrl.hostname,
			path: innerUrl.pathname,
			port: parseInt(innerUrl.port),
			headers: {
				'User-Agent': userAgent,
				[signatureHeaderName]: 'replaceThisPlaceholderSignature'
			},
			method: httpMethod
		};

		const network = getNetworkForOptions(innerUrl);

		if (ArrayBuffer.isView(data) || Buffer.isBuffer(data) || data instanceof ArrayBuffer) {
			if (!Buffer.isBuffer(data)) {
				data = Buffer.from(data);
			}

			options.headers['Content-Type'] = 'application/octet-stream';
			options.headers['Content-Length'] = data.length;
		}

		const req = network.request(options, (res) => {
			const {statusCode} = res;

			let error;
			if (statusCode >= 400) {
				error = new Error('Request Failed.\n' +
					`Status Code: ${statusCode}\n` +
					`URL: ${options.hostname}:${options.port}${options.path}`);
			}

			if (error) {
				callback({error: error, statusCode: statusCode});
				// free up memory
				res.resume();
				return;
			}

			let rawData = '';
			res.on('data', (chunk) => {
				rawData += chunk;
			});
			res.on('end', () => {
				try {
					callback(undefined, rawData, res.headers);
				} catch (err) {
					console.error(err);
				}finally {
					//trying to prevent getting ECONNRESET error after getting our response
					req.abort();
				}
			});
		}).on("error", (error) => {
			console.log(`[POST] ${url}`, error);
			callback(error);
		});

		if (data && data.pipe && typeof data.pipe === "function") {
			data.pipe(req);
			return;
		}

		if (typeof data !== 'string' && !Buffer.isBuffer(data) && !ArrayBuffer.isView(data)) {
			data = JSON.stringify(data);
		}

		req.write(data);
		req.end();
	};
}

module.exports = {
	fetch: require("./fetch").fetch,
	doPost: generateMethodForRequestWithData('POST'),
	doPut: generateMethodForRequestWithData('PUT')
}
}).call(this)}).call(this,require("buffer").Buffer)

},{"./fetch":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/http/node/fetch.js","buffer":false,"http":false,"https":false,"url":false}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/http/serviceWorker/index.js":[function(require,module,exports){
function generateMethodForRequestWithData(httpMethod) {
	return function (url, data, callback) {
		const headers = {}
		if(ArrayBuffer.isView(data) || data instanceof ArrayBuffer) {
			headers['Content-Type'] = 'application/octet-stream';

			/**
			 * Content-Length is an unsafe header and we cannot set it.
			 * When browser is making a request that is intercepted by a service worker,
			 * the Content-Length header is not set implicitly.
			 */
			headers['X-Content-Length'] = data.byteLength;
		}

		fetch(url, {
			method: httpMethod,
			mode: 'cors',
			headers,
			body: data
		}).then(function (response) {
			if (response.status >= 400) {
				throw new Error(`An error occurred ${response.statusText}`);
			}
			return response.text().catch((err) => {
				// This happens when the response is empty
				let emptyResponse = {message: ""}
				return JSON.stringify(emptyResponse);
			});
		}).then(function (data) {
			callback(null, data)
		}).catch(error => {
			callback(error);
		});
	};
}

module.exports = {
	fetch: fetch,
	doPost: generateMethodForRequestWithData('POST'),
	doPut: generateMethodForRequestWithData('PUT')
}

},{}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/http/utils/PollRequestManager.js":[function(require,module,exports){
function PollRequestManager(fetchFunction, pollingTimeout = 1000){

	const requests = {};

	function Request(url, options, delayedStart) {
		let self = this;

		let currentState = undefined;
		this.execute = function(){
			//if there is a delayedStart and it's the first time when the request is executed
			if(delayedStart && typeof currentState === "undefined"){
				setTimeout(function(){
					currentState = fetchFunction(url, options);
				}, delayedStart);
			}else{
				currentState = fetchFunction(url, options);
			}

			return currentState;
		}

		this.cancelExecution = function(){
			if(typeof this.currentState !== "undefined"){
				this.currentState = undefined;
			}
			this.resolve = ()=>{};
			this.reject = ()=>{};
		}

		let promiseHandlers = {};
		this.setExecutor = function(resolve, reject){
			promiseHandlers.resolve = resolve;
			promiseHandlers.reject = reject;
		}

		this.resolve = function(...args){
			this.destroy();
			promiseHandlers.resolve(...args);
		}

		this.reject = function(...args){
			this.destroy();
			promiseHandlers.reject(...args);
		}

		this.destroy = function(identifier){
			this.cancelExecution();

			requests[identifier] = undefined;
			delete requests[identifier];
		}
	}

	this.createRequest = function (url, options, delayedStart=0) {
		let request = new Request(url, options, delayedStart);

		let promise = new Promise((resolve, reject) => {

			request.setExecutor(resolve, reject);

			if(delayedStart){
				setTimeout(function(){
					createPollThread(request);
				}, delayedStart);
			}else{
				createPollThread(request);
			}
		});

		requests[promise] = request;
		promise.abort = () => {
			this.cancelRequest(promise);
		};

		return promise;
	};

	this.cancelRequest = function(promiseHandler){
		let request = requests[promiseHandler];
		if(typeof request === "undefined"){
			console.log("No active request found.");
			return;
		}

		request.destroy();
	}


	/* *************************** polling zone ****************************/
	function createPollThread(request) {
		function reArm() {
			request.execute().then( (response) => {
				if (!response.ok) {
					//todo check for http errors like 404
					return setTimeout(reArm, pollingTimeout);
				}
				request.resolve(response);
			}).catch( (err) => {
				switch(err.code){
					case "ETIMEDOUT":
						setTimeout(reArm, pollingTimeout);
						break;
					case "ECONNREFUSED":
						setTimeout(reArm, pollingTimeout*1.5);
						break;
					default:
						request.reject(err);
				}
			});
		}

		reArm();
	}

}

module.exports = PollRequestManager;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/keyssi/index.js":[function(require,module,exports){
const keySSIResolver = require("key-ssi-resolver");
const keySSIFactory = keySSIResolver.KeySSIFactory;
const SSITypes = keySSIResolver.SSITypes;

const parse = (ssiString, options) => {
    return keySSIFactory.create(ssiString, options);
};

const buildSeedSSI = (domain, specificString, control, vn, hint) => {
    return buildTemplateKeySSI(SSITypes.SEED_SSI, domain, specificString, control, vn, hint);
};

const buildWalletSSI = (domain, specificString, control, vn, hint) => {
    return buildTemplateKeySSI(SSITypes.WALLET_SSI, domain, specificString, control, vn, hint);
};

const buildSReadSSI = (domain,  specificString, control, vn, hint) => {
    return buildTemplateKeySSI(SSITypes.SREAD_SSI, domain, specificString, control, vn, hint);
};

const buildSZeroAccessSSI = (domain,  specificString, control, vn, hint) => {
    return buildTemplateKeySSI(SSITypes.SZERO_ACCESS_SSI, domain, specificString, control, vn, hint);
};

const buildHashLinkSSI = (domain, specificString, control, vn, hint) => {
    return buildTemplateKeySSI(SSITypes.HASH_LINK_SSI, domain,  specificString, control, vn, hint);
};

const buildTemplateKeySSI = (ssiType, domain, specificString, control, vn, hint) => {
    const keySSI = keySSIFactory.createType(ssiType);
    keySSI.load(ssiType, domain, specificString, control, vn, hint);
    return keySSI;
};

const buildArraySSI = (domain, arr, vn, hint) => {
    const arraySSI = keySSIFactory.createType(SSITypes.ARRAY_SSI);
    arraySSI.initialize(domain, arr, vn, hint);
    return arraySSI;
};

module.exports = {
    parse,
    buildSeedSSI,
    buildWalletSSI,
    buildSReadSSI,
    buildSZeroAccessSSI,
    buildHashLinkSSI,
    buildTemplateKeySSI,
    buildArraySSI
};
},{"key-ssi-resolver":"key-ssi-resolver"}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/moduleConstants.js":[function(require,module,exports){
module.exports = {
	CODE_FOLDER: "/code",
	CONSTITUTION_FOLDER: '/code/constitution',
	BLOCKCHAIN_FOLDER: '/blockchain',
	APP_FOLDER: '/app',
	DOMAIN_IDENTITY_FILE: '/domain_identity',
	ASSETS_FOLDER: "/assets",
	TRANSACTIONS_FOLDER: "/transactions",
	APPS_FOLDER: "/apps",
	DATA_FOLDER: "/data",
	MANIFEST_FILE: "/manifest"
}
},{}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/mq/index.js":[function(require,module,exports){
/*
Message Queues API space
*/

let http = require("../index").loadApi("http");
let bdns = require("../index").loadApi("bdns");

function send(keySSI, message, callback){
    bdns.getAnchoringServices(keySSI, (err, endpoints) => {
        let url = endpoints[0]+`/mq/send-message/${keySSI}`;
        let options = {body: message};

        let request = http.poll(url, options, timeout);

        request.then((response)=>{
            callback(undefined, response);
        }).catch((err)=>{
            callback(err);
        });
    });
}

let requests = {};
function getHandler(keySSI, timeout){
    let obs = require("../utils/observable").createObservable();
    bdns.getMQEndpoints(keySSI, (err, endpoints) => {
        if(err || endpoints.length === 0){
            return callback(new Error("Not available!"));
        }

        let createChannelUrl = endpoints[0] + `/mq/create-channel/${keySSI}`;
        http.doPost(createChannelUrl, undefined, (err, response) => {
            if (err) {
                if (err.statusCode === 409) {
                    //channels already exists. no problem :D
                } else {
                    obs.dispatch("error", err);
                    return;
                }
            }
            function makeRequest(){
                let url = endpoints[0] + `/mq/receive-message/${keySSI}`;
                let options = {};

                let request = http.poll(url, options, timeout);

                request.then((response) => {
                    obs.dispatch("message", response);
                    makeRequest();
                }).catch((err) => {
                    obs.dispatch("error", err);
                });

                requests[obs] = request;
            }

            makeRequest();

        });
    });

    return obs;
}

function unsubscribe(keySSI, observable){
    http.unpoll(requests[observable]);
}

module.exports = {
    send,
    getHandler,
    unsubscribe
}
},{"../index":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/index.js","../utils/observable":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/utils/observable.js"}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/notifications/index.js":[function(require,module,exports){
/*
KeySSI Notification API space
*/

let http = require("../index").loadApi("http");
let bdns = require("../index").loadApi("bdns");

function publish(keySSI, message, callback){
	bdns.getNotificationEndpoints(keySSI, (err, endpoints) => {
		if(err || endpoints.length === 0){
			return callback(new Error("Not available!"));
		}

		let url = endpoints[0]+`/notifications/publish/${keySSI}`;
		let options = {body: message};

		let request = http.poll(url, options, timeout);

		request.then((response)=>{
			callback(undefined, response);
		}).catch((err)=>{
			callback(err);
		});
	});
}

let requests = {};
function getObservableHandler(keySSI, timeout){
	let obs = require("../utils/observable").createObservable();
	bdns.getNotificationEndpoints(keySSI, (err, endpoints) => {
		if(err || endpoints.length === 0){
			return callback(new Error("Not available!"));
		}

		function makeRequest(){
			let url = endpoints[0] + `/notifications/subscribe/${keySSI}`;
			let options = {};
			let request = http.poll(url, options, timeout);

			request.then((response) => {
				obs.dispatch("message", response);
				makeRequest();
			}).catch((err) => {
				obs.dispatch("error", err);
			});

			requests[obs] = request;
		}

		makeRequest();
	});
	return obs;
}

function unsubscribe(keySSI, observable){
	http.unpoll(requests[observable]);
}

module.exports = {
	publish,
	getObservableHandler,
	unsubscribe
}
},{"../index":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/index.js","../utils/observable":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/utils/observable.js"}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/resolver/index.js":[function(require,module,exports){
const KeySSIResolver = require("key-ssi-resolver");
const keySSISpace = require("opendsu").loadApi("keyssi");

const initializeResolver = (options) => {
    options = options || {};
    return KeySSIResolver.initialize(options);
}

const registerDSUFactory = (type, factory) => {
    KeySSIResolver.DSUFactory.prototype.registerDSUType(type, factory);
};

const createDSU = (keySSI, options, callback) => {
    if (typeof keySSI === "string") {
        keySSI = keySSISpace.parse(keySSI);
    }
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }

    const keySSIResolver = initializeResolver(options);
    keySSIResolver.createDSU(keySSI, options, callback);
};

const loadDSU = (keySSI, options, callback) => {
    if (typeof keySSI === "string") {
        keySSI = keySSISpace.parse(keySSI);
    }

    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }

    const keySSIResolver = initializeResolver(options);
    keySSIResolver.loadDSU(keySSI, options, callback);
};

const createWallet = (templateKeySSI, dsuTypeSSI, options, callback) => {
    let keySSI = keySSISpace.parse(templateKeySSI);
    if(typeof options === "function"){
        callback = options;
        options = {};
    }

    options.dsuTypeSSI = dsuTypeSSI;

    const keySSIResolver = initializeResolver(options);
    keySSIResolver.createDSU(keySSI, options, callback);
}

const loadWallet = (secret, options, callback) => {
    let tmpKeySSI = keySSISpace.buildWalletSSI();
    if(typeof options === "function"){
        callback = options;
        options = {};
    }

    tmpKeySSI.getSeedSSI(secret, options, (err, seedSSI)=>{
        if(err){
            return callback(err);
        }

        loadDSU(seedSSI, (err, wallet) =>{
            if(err){
                return callback(err);
            }
            callback(undefined, wallet);
        });
    });
}

const createCustomDSU = () => {

};

const getHandler = () => {

};

module.exports = {
    createDSU,
    loadDSU,
    createWallet,
    loadWallet,
    createCustomDSU,
    getHandler,
    registerDSUFactory
}
},{"key-ssi-resolver":"key-ssi-resolver","opendsu":"opendsu"}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/sc/index.js":[function(require,module,exports){
const getMainDSU = () => {
    if (typeof rawDossier === "undefined") {
        throw Error("Main DSU does not exist in the current context.");
    }

    return rawDossier;
};

module.exports = {
    getMainDSU
}
},{}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/utils/observable.js":[function(require,module,exports){
function Observable(){
	let handlers = {};

	this.dispatch = function(eventName, data){
		if(typeof handlers[eventName] === "undefined"){
			//no handlers registered
			return;
		}
		let subscribers = handlers[eventName];
		subscribers.forEach((subscriber)=>{
			try{
				subscriber(data);
			}catch(err){
				// what to do if we get an error?!
			}
		});
	}

	this.on = function(eventName, callback){
		if(typeof handlers[eventName] === "undefined"){
			handlers[eventName] = [];
		}
		handlers[eventName].push(callback);
	}

	this.off = function(eventName, callback){
		if(typeof handlers[eventName] === "undefined" || !Array.isArray(handlers[eventName])){
			//nothing to do...
			return;
		}
		let index = handlers[eventName].indexOf(callback);
		if(index === -1){
			return;
		}

		handlers[eventName].splice(index, 1);
	}
}

module.exports.createObservable = function(){
	return new Observable();
}
},{}],"/home/travis/build/PrivateSky/privatesky/modules/overwrite-require/moduleConstants.js":[function(require,module,exports){
module.exports = {
  BROWSER_ENVIRONMENT_TYPE: 'browser',
  SERVICE_WORKER_ENVIRONMENT_TYPE: 'service-worker',
  ISOLATE_ENVIRONMENT_TYPE: 'isolate',
  THREAD_ENVIRONMENT_TYPE: 'thread',
  NODEJS_ENVIRONMENT_TYPE: 'nodejs'
};

},{}],"/home/travis/build/PrivateSky/privatesky/modules/overwrite-require/standardGlobalSymbols.js":[function(require,module,exports){
(function (global){(function (){
let logger = console;

if (!global.process || process.env.NO_LOGS !== 'true') {
    try {
        const zmqName = "zeromq";
        require(zmqName);
        const PSKLoggerModule = require('psklogger');
        const PSKLogger = PSKLoggerModule.PSKLogger;

        logger = PSKLogger.getLogger();

        console.log('Logger init successful', process.pid);
    } catch (e) {
        if(e.message.indexOf("psklogger")!==-1 || e.message.indexOf("zeromq")!==-1){
            console.log('Logger not available, using console');
            logger = console;
        }else{
            console.log(e);
        }
    }
} else {
    console.log('Environment flag NO_LOGS is set, logging to console');
}

$$.registerGlobalSymbol = function (newSymbol, value) {
    if (typeof $$[newSymbol] == "undefined") {
        Object.defineProperty($$, newSymbol, {
            value: value,
            writable: false
        });
    } else {
        logger.error("Refusing to overwrite $$." + newSymbol);
    }
};

console.warn = (...args)=>{
    console.log(...args);
};

/**
 * @method
 * @name $$#autoThrow
 * @param {Error} err
 * @throws {Error}
 */

$$.registerGlobalSymbol("autoThrow", function (err) {
    if (!err) {
        throw err;
    }
});

/**
 * @method
 * @name $$#propagateError
 * @param {Error} err
 * @param {function} callback
 */
$$.registerGlobalSymbol("propagateError", function (err, callback) {
    if (err) {
        callback(err);
        throw err; //stop execution
    }
});

/**
 * @method
 * @name $$#logError
 * @param {Error} err
 */
$$.registerGlobalSymbol("logError", function (err) {
    if (err) {
        console.log(err);
        $$.err(err);
    }
});

/**
 * @method
 * @name $$#fixMe
 * @param {...*} args
 */
console.log("Fix the fixMe to not display on console but put in logs");
$$.registerGlobalSymbol("fixMe", function (...args) {
    //$$.log(...args);
});

/**
 * @method - Throws an error
 * @name $$#exception
 * @param {string} message
 * @param {*} type
 */
$$.registerGlobalSymbol("exception", function (message, type) {
    throw new Error(message);
});

/**
 * @method - Throws an error
 * @name $$#throw
 * @param {string} message
 * @param {*} type
 */
$$.registerGlobalSymbol("throw", function (message, type) {
    throw new Error(message);
});


/**
 * @method - Warns that method is not implemented
 * @name $$#incomplete
 * @param {...*} args
 */
/* signal a  planned feature but not implemented yet (during development) but
also it could remain in production and should be flagged asap*/
$$.incomplete = function (...args) {
    args.unshift("Incomplete feature touched:");
    logger.warn(...args);
};

/**
 * @method - Warns that method is not implemented
 * @name $$#notImplemented
 * @param {...*} args
 */
$$.notImplemented = $$.incomplete;


/**
 * @method Throws if value is false
 * @name $$#assert
 * @param {boolean} value - Value to assert against
 * @param {string} explainWhy - Reason why assert failed (why value is false)
 */
/* used during development and when trying to discover elusive errors*/
$$.registerGlobalSymbol("assert", function (value, explainWhy) {
    if (!value) {
        throw new Error("Assert false " + explainWhy);
    }
});

/**
 * @method
 * @name $$#flags
 * @param {string} flagName
 * @param {*} value
 */
/* enable/disabale flags that control psk behaviour*/
$$.registerGlobalSymbol("flags", function (flagName, value) {
    $$.incomplete("flags handling not implemented");
});

/**
 * @method - Warns that a method is obsolete
 * @name $$#obsolete
 * @param {...*} args
 */
$$.registerGlobalSymbol("obsolete", function (...args) {
    args.unshift("Obsolete feature:");
    logger.log(...args);
    console.log(...args);
});

/**
 * @method - Uses the logger to log a message of level "log"
 * @name $$#log
 * @param {...*} args
 */
$$.registerGlobalSymbol("log", function (...args) {
    args.unshift("Log:");
    logger.log(...args);
});

/**
 * @method - Uses the logger to log a message of level "info"
 * @name $$#info
 * @param {...*} args
 */
$$.registerGlobalSymbol("info", function (...args) {
    args.unshift("Info:");
    logger.log(...args);
    console.log(...args);
});

/**
 * @method - Uses the logger to log a message of level "error"
 * @name $$#err
 * @param {...*} args
 */
$$.registerGlobalSymbol("err", function (...args) {
    args.unshift("Error:");
    logger.error(...args);
    console.error(...args);
});

/**
 * @method - Uses the logger to log a message of level "error"
 * @name $$#err
 * @param {...*} args
 */
$$.registerGlobalSymbol("error", function (...args) {
    args.unshift("Error:");
    logger.error(...args);
    console.error(...args);
});

/**
 * @method - Uses the logger to log a message of level "warning"
 * @name $$#warn
 * @param {...*} args
 */
$$.registerGlobalSymbol("warn", function (...args) {
    args.unshift("Warn:");
    logger.warn(...args);
    console.log(...args);
});

/**
 * @method - Uses the logger to log a message of level "syntexError"
 * @name $$#syntexError
 * @param {...*} args
 */
$$.registerGlobalSymbol("syntaxError", function (...args) {
    args.unshift("Syntax error:");
    logger.error(...args);
    try{
        throw new Error("Syntax error or misspelled symbol!");
    }catch(err){
        console.error(...args);
        console.error(err.stack);
    }

});

/**
 * @method - Logs an invalid member name for a swarm
 * @name $$#invalidMemberName
 * @param {string} name
 * @param {Object} swarm
 */
$$.invalidMemberName = function (name, swarm) {
    let swarmName = "unknown";
    if (swarm && swarm.meta) {
        swarmName = swarm.meta.swarmTypeName;
    }
    const text = "Invalid member name " + name + "in swarm " + swarmName;
    console.error(text);
    logger.err(text);
};

/**
 * @method - Logs an invalid swarm name
 * @name $$#invalidSwarmName
 * @param {string} name
 * @param {Object} swarm
 */
$$.registerGlobalSymbol("invalidSwarmName", function (swarmName) {
    const text = "Invalid swarm name " + swarmName;
    console.error(text);
    logger.err(text);
});

/**
 * @method - Logs unknown exceptions
 * @name $$#unknownException
 * @param {...*} args
 */
$$.registerGlobalSymbol("unknownException", function (...args) {
    args.unshift("unknownException:");
    logger.err(...args);
    console.error(...args);
});

/**
 * @method - PrivateSky event, used by monitoring and statistics
 * @name $$#event
 * @param {string} event
 * @param {...*} args
 */
$$.registerGlobalSymbol("event", function (event, ...args) {
    if (logger.hasOwnProperty('event')) {
        logger.event(event, ...args);
    } else {
        if(event === "status.domains.boot"){
            console.log("Failing to console...", event, ...args);
        }
    }
});

/**
 * @method -
 * @name $$#redirectLog
 * @param {string} event
 * @param {...*} args
 */
$$.registerGlobalSymbol("redirectLog", function (logType, logObject) {
    if(logger.hasOwnProperty('redirect')) {
        logger.redirect(logType, logObject);
    }
});

/**
 * @method - log throttling event // it is just an event?
 * @name $$#throttlingEvent
 * @param {...*} args
 */
$$.registerGlobalSymbol("throttlingEvent", function (...args) {
    logger.log(...args);
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"psklogger":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/constants.js":[function(require,module,exports){
const URL_PREFIX = '/anchor';

module.exports = { URL_PREFIX };
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/controllers.js":[function(require,module,exports){
const { ALIAS_SYNC_ERR_CODE } = require('./strategies/FS');

function createHandler(server){

    return function  addAnchor(request, response, next) {


        // get the strategy based on the domain extracted from keyssi. if no domain found fallback on default
        const strategy = require("./utils").getAnchoringStrategy(request.params.keyssi);
        //init will receive all the available context information : the whole strategy, body, keyssi from the query and the protocol
        let flow = $$.flow.start(strategy.type);
        flow.init(strategy, request.params.keyssi, request.body, server.rootFolder);

        // all the available information was passed on init.
        flow.addAlias(server, (err, result) => {
            if (err) {
                if (err.code === 'EACCES') {
                    return response.send(409);
                }
                if (err.code === ALIAS_SYNC_ERR_CODE) {
                    // see: https://tools.ietf.org/html/rfc6585#section-3
                    return response.send(428);
                }
                return response.send(500);
            }

            response.send(201);
        });


    }
}




module.exports = createHandler;

},{"./strategies/FS":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/strategies/FS.js","./utils":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/utils/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/index.js":[function(require,module,exports){



function Anchoring(server) {

    require('./strategies/FS');


    const { URL_PREFIX } = require('./constants.js');
    const AnchorSubrscribe = require('./subscribe');
    const AnchorVersions = require('./versions');
    const  addAnchor = require('./controllers')(server);
    const { responseModifierMiddleware, requestBodyJSONMiddleware } = require('../../utils/middlewares');

    server.use(`${URL_PREFIX}/*`, responseModifierMiddleware);
    server.put(`${URL_PREFIX}/add/:keyssi`, requestBodyJSONMiddleware);
    server.put(`${URL_PREFIX}/add/:keyssi`, addAnchor); // to do : add call in brickledger to store the trasantion call

    AnchorVersions(server);
    AnchorSubrscribe(server);
}

module.exports = Anchoring;

},{"../../utils/middlewares":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/middlewares/index.js","./constants.js":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/constants.js","./controllers":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/controllers.js","./strategies/FS":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/strategies/FS.js","./subscribe":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/subscribe/index.js","./versions":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/versions/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/strategies/FS.js":[function(require,module,exports){
(function (Buffer){(function (){
const fs = require('fs');
const endOfLine = require('os').EOL;
const path = require('swarmutils').path;

const ALIAS_SYNC_ERR_CODE = 'sync-error';

let folderStrategy = [];

$$.flow.describe('FS', {
    init: function (strategy, anchorId, jsonData, rootFolder) {
            this.commandData = {};
            this.commandData.option = strategy.option;
            this.commandData.anchorId = anchorId;
            this.commandData.jsonData = jsonData;
            const folderPrepared = folderStrategy.find(elem => elem.type === strategy.type);

            //because we work instance based, ensure that folder structure is done only once per strategy type
            if (folderPrepared && folderPrepared.IsDone === true)
            {
                //skip, folder structure is already done for this strategy type
            } else {
                folderStrategy.push({
                    "IsDone" : false,
                    "type" : strategy.type
                });
                let storageFolder = path.join(rootFolder, strategy.option.path);
                if (typeof process.env.ANCHOR_STORAGE_FOLDER !== 'undefined') {
                    storageFolder = process.env.ANCHOR_STORAGE_FOLDER;
                }
                this.__prepareFolderStructure(storageFolder);
            };


    },

    __prepareFolderStructure: function (storageFolder) {
        this.anchorsFolders = path.resolve(storageFolder);
        try {
            if (!fs.existsSync(this.anchorsFolders)) {
                fs.mkdirSync(this.anchorsFolders, { recursive: true });
            }
        } catch (e) {
            console.log('error creating anchoring folder', e);
            throw e;
        }
    },
    addAlias : function (server, callback) {
        const fileHash = this.commandData.anchorId;
        if (!fileHash || typeof fileHash !== 'string') {
            return callback(new Error('No fileId specified.'));
        }
        const filePath = path.join(this.anchorsFolders, fileHash);
        fs.stat(filePath, (err, stats) => {
            if (err) {
                if (err.code !== 'ENOENT') {
                    console.log(err);
                }
                fs.writeFile(filePath, this.commandData.jsonData.hash.new + endOfLine, callback);
                return;
            }

            this.__appendHash(filePath, this.commandData.jsonData.hash.new, {
                lastHash: this.commandData.jsonData.hash.last,
                fileSize: stats.size
            }, callback);
        });

        //send log info
        this.__logWriteRequest(server);
    },

    __logWriteRequest : function(server){
        const runCommandBody = {
            "commandType" : "anchor",
            "data" : this.commandData
        };
        const bodyData = JSON.stringify(runCommandBody);
        //build path
        const runCommandPath = require('../../bricksLedger/constants').URL_PREFIX + '/runCommand';
        //run Command method
        const runCmdMethod = 'POST';
        // run Command headers
        const runCmdHeaders = {
            'Content-Type': 'application/json',
            'Content-Length': bodyData.length
        };
        try {
            server.makeLocalRequest(runCmdMethod, runCommandPath, bodyData, runCmdHeaders, (err, result) => {
                //callback is for local only if we register only access logs
                if (err) {
                    console.log(err);
                }
                //console.log(result);
            })
        }catch (err) {
            console.log("anchoring ",err);
        };
    },

    readVersions: function (alias, callback) {
        const filePath = path.join(this.anchorsFolders, alias);
        fs.readFile(filePath, (err, fileHashes) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return callback(undefined, []);
                }
                return callback(err);
            }
            callback(undefined, fileHashes.toString().trimEnd().split(endOfLine));
        });
    },

    /**
     * Append `hash` to file only
     * if the `lastHash` is the last hash in the file
     * 
     * @param {string} path 
     * @param {string} hash 
     * @param {object} options
     * @param {string|undefined} options.lastHash 
     * @param {number} options.fileSize 
     * @param {callback} callback 
     */
    __appendHash: function (path, hash, options, callback) {
        fs.open(path, fs.constants.O_RDWR, (err, fd) => {
            if (err) {
                console.log("__appendHash-open-error : ",err);
                return callback(err);
            }

            fs.read(fd, Buffer.alloc(options.fileSize), 0, options.fileSize, null, (err, bytesRead, buffer) => {
                if (err) {
                    console.log("__appendHash-read-error : ",err);

                    return callback(err);
                }
                // compare the last hash in the file with the one received in the request
                // if they are not the same, exit with error
                const hashes = buffer.toString().trimEnd().split(endOfLine);
                const lastHash = hashes[hashes.length - 1];

                if (lastHash !== options.lastHash) {
                    console.log('__appendHash error.Unable to add alias: versions out of sync.', lastHash, options.lastHash)
                    console.log("existing hashes :", hashes);
                    console.log("received hashes :", options);
                    return callback({
                        code: ALIAS_SYNC_ERR_CODE,
                        message: 'Unable to add alias: versions out of sync'
                    });
                }

                fs.write(fd, hash + endOfLine, options.fileSize, (err) => {
                    if (err) {
                        console.log("__appendHash-write : ",err);
                        return callback(err);
                    }
                    
                    fs.close(fd, callback);
                });
            });
        });
    }
});

module.exports = {
    ALIAS_SYNC_ERR_CODE
};
}).call(this)}).call(this,require("buffer").Buffer)

},{"../../bricksLedger/constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksLedger/constants.js","buffer":false,"fs":false,"os":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/subscribe/controllers.js":[function(require,module,exports){
let pendingRequests = {};

const readBody = require("../../../utils").readStringFromStream;

function readHandler(req, res, next) {
    const channelIdentifier = req.params.channelsIdentifier;
    const lastMessageKnown = req.params.lastMessage;

    readChannel(channelIdentifier, function (err, anchors) {
        if (err) {
            return res.send(err.code === "EPERM" ? 500 : 404);
        }

        const hasLastMessage = anchors.indexOf(lastMessageKnown);

        if (hasLastMessage !== -1) {
            anchors = anchors.slice(knownIndex + 1);
        }

        if (anchors.length === 0) {
            if (typeof pendingRequests[channelIdentifier] === "undefined") {
                pendingRequests[channelIdentifier] = [];
            }

            pendingRequests[channelIdentifier].push({ req, res });
        } else {
            return res.send(200, anchors);
        }
    });
}

function readChannel(name, callback) {
    const fs = require("fs");
    const path = require("swarmutils").path;

    fs.readFile(path.join(storageFolder, name), function (err, content) {
        let anchors;

        if (!err) {
            anchors = content.split("\m");
        }

        callback(err, anchors);
    });
}

function publishToChannel(name, message, callback) {
    const fs = require("fs");
    const path = require("swarmutils").path;

    fs.appendFile(path.join(storageFolder, name), message, function (err) {
        if (typeof err === "undefined") {
            //if everything went ok then try to resolve pending requests for that channel
            tryToResolvePendingRequests(name, message);
        }
        
        return callback(err);
    });
}

function publishHandler(request, reponse, next) {
    const channelIdentifier = request.params.channelsIdentifier;
    const lastMessage = request.params.lastMessage;

    readBody(request, function (err, newAnchor) {
        if (newAnchor === "") {
            return res.send(428);
        }

        readChannel(channelIdentifier, function (err, anchors) {
            if (err && typeof lastMessage === "undefined") {
                // this is a new anchor
                return publishToChannel(channelIdentifier, newAnchor, function (err) {
                    if (err) {
                        return reponse.send(500, 'Internal error');
                    }

                    return reponse.send(201);
                });
            }

            if (lastMessage !== anchors.pop()) {
                return reponse.send(403);
            }

            return publishToChannel(channelIdentifier, newAnchor, function (err) {
                if (err) {
                    return reponse.send(500);
                }

                reponse.send(201);
                next();
            });
        });
    });
}

module.exports = { readHandler, publishHandler };

},{"../../../utils":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/index.js","fs":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/subscribe/index.js":[function(require,module,exports){
function AnchorSubrscribe(server) {
    const { URL_PREFIX } = require('../constants');
    const { publishHandler } = require('./controllers');

    server.get(`${URL_PREFIX}/subscribe/:keyssi`, publishHandler);

    server.delete(`${URL_PREFIX}/subscribe/:keyssi`, (request, response, next) => {
        // delete ANCHOR ?subscribeId=
    });
    
}

module.exports = AnchorSubrscribe;

},{"../constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/constants.js","./controllers":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/subscribe/controllers.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/utils/index.js":[function(require,module,exports){
const getAnchoringStrategy = (ssiString) => {
    const config = require("../../../config");
    const openDSU = require("opendsu");
    const keySSISpace = openDSU.loadApi("keyssi");

    const keySSI = keySSISpace.parse(ssiString);
    const domain = keySSI.getDLDomain();
    let strategy = config.getConfig('endpointsConfig', 'anchoring', 'domainStrategies', domain);

    if (!strategy) {
        strategy = config.getConfig('endpointsConfig', 'anchoring', 'domainStrategies', 'default');
    }

    return strategy;
};

module.exports = {getAnchoringStrategy}
},{"../../../config":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/index.js","opendsu":"opendsu"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/versions/index.js":[function(require,module,exports){
function AnchorVersions(server) {
    const { URL_PREFIX } = require('./../constants.js');

    server.get(`${URL_PREFIX}/versions/:keyssi`, (request, response, next) => {
        const strategy = require("../utils").getAnchoringStrategy(request.params.keyssi);
        const flow = $$.flow.start(strategy.type);
        flow.init(strategy,request.params.keyssi, request.body, server.rootFolder);
        flow.readVersions(request.params.keyssi, (err, fileHashes) => {
            if (err) {
                return response.send(404, 'Anchor not found');
            }

            response.setHeader('Content-Type', 'application/json');

            return response.send(200, fileHashes);
        });
    });
}

module.exports = AnchorVersions;

},{"../utils":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/utils/index.js","./../constants.js":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/constants.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricks/constants.js":[function(require,module,exports){
const URL_PREFIX = '/bricks';

module.exports = { URL_PREFIX };
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricks/controllers.js":[function(require,module,exports){
function uploadBrick(request, response, next) {
    $$.flow.start('BricksManager').write(request, (err, result) => {
        if (err) {
            return response.send(err.code === 'EACCES' ? 409 : 500);
        }

        response.send(201, result);
    });
}

function downloadBrick(request, response, next) {
    response.setHeader('content-type', 'application/octet-stream');
    response.setHeader('Cache-control', 'max-age=31536000'); // set brick cache expiry to 1 year

    $$.flow.start('BricksManager').read(request.params.hashLink, response, (err, result) => {
        if (err) {
            return response.send(404, 'Brick not found');
        }

        response.send(200);
    });
}

function downloadMultipleBricks(request, response, next) {
    response.setHeader('content-type', 'application/octet-stream');
    response.setHeader('Cache-control', 'max-age=31536000'); // set brick cache expiry to 1 year

    $$.flow.start('BricksManager').readMultipleBricks(request.query.hashes, response, (err, result) => {
        if (err) {
            return response.send(404, 'Brick not found');
        }

        response.send(200);
    });
}

module.exports = { uploadBrick, downloadBrick, downloadMultipleBricks };

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricks/flows/BricksManager.js":[function(require,module,exports){
(function (Buffer){(function (){
const fs = require('fs');
const path = require('swarmutils').path;
const crypto = require('pskcrypto');

let brickStorageFolder;
const HASH_ALGORITHM = 'sha256';
const folderNameSize = process.env.FOLDER_NAME_SIZE || 5;

$$.flow.describe('BricksManager', {
    init: function (rootFolder) {
        rootFolder = path.resolve(rootFolder);
        brickStorageFolder = rootFolder;
        this.__ensureFolderStructure(rootFolder);
    },
    write: function (readFileStream, callback) {
        this.__convertStreamToBuffer(readFileStream, (err, brickData) => {
            if (err) {
                return callback(err);
            }
            const fileName = crypto.hash(HASH_ALGORITHM, brickData, 'hex');
            if (!this.__verifyFileName(fileName, callback)) {
                return;
            }


            const folderName = path.join(brickStorageFolder, fileName.substr(0, folderNameSize));

            this.__ensureFolderStructure(folderName, (err) => {
                if (err) {
                    return callback(err);
                }

                this.__writeFile(brickData, folderName, fileName, callback);
            });
        });
    },
    read: function (fileName, writeFileStream, callback) {
        if (!this.__verifyFileName(fileName, callback)) {
            return;
        }

        const folderPath = path.join(brickStorageFolder, fileName.substr(0, folderNameSize));
        const filePath = path.join(folderPath, fileName);

        this.__verifyFileExistence(filePath, (err, result) => {
            if (!err) {
                this.__readFile(writeFileStream, filePath, callback);
            } else {
                callback(new Error(`File ${filePath} was not found.`));
            }
        });
    },
    readMultipleBricks: function (brickHashes, writeStream, callback) {
        if (!Array.isArray(brickHashes)) {
            brickHashes = [brickHashes];
        }
        this.__writeMultipleBricksToStream(brickHashes, 0, writeStream, callback);
    },
    __writeBrickDataToStream: function (brickData, writeStream, callback) {
        const brickSize = Buffer.alloc(4);
        brickSize.writeUInt32BE(brickData.length);
        writeStream.write(brickSize, (err) => {
            if (err) {
                return callback(err);
            }

            writeStream.write(brickData, callback);
        });
    },
    __writeMultipleBricksToStream: function (brickHashes, brickIndex, writeStream, callback) {
        const brickHash = brickHashes[brickIndex];
        this.__readBrick(brickHash, (err, brickData) => {
            this.__writeBrickDataToStream(brickData, writeStream, (err) => {
                if (err) {
                    return callback(err);
                }
                brickIndex++;
                if (brickIndex === brickHashes.length) {
                    callback();
                } else {
                    this.__writeMultipleBricksToStream(brickHashes, brickIndex, writeStream, callback);
                }
            });
        });
    },
    __readBrick: function (brickHash, callback) {
        const folderPath = path.join(brickStorageFolder, brickHash.substr(0, folderNameSize));
        const filePath = path.join(folderPath, brickHash);
        this.__verifyFileExistence(filePath, (err) => {
            if (err) {
                return callback(err);
            }

            fs.readFile(filePath, callback);
        });
    },
    __verifyFileName: function (fileName, callback) {
        if (!fileName || typeof fileName !== 'string') {
            return callback(new Error('No fileId specified.'));
        }

        if (fileName.length < folderNameSize) {
            return callback(new Error(`FileId too small. ${fileName}`));
        }

        return true;
    },
    __ensureFolderStructure: function (folder, callback) {
        try {
            fs.mkdirSync(folder, {recursive: true});
        } catch (err) {
            if (callback) {
                callback(err);
            } else {
                throw err;
            }
        }
        if (callback) {
            callback();
        }
    },
    __writeFile: function (brickData, folderPath, fileName, callback) {
        const filePath = path.join(folderPath, fileName);
        fs.access(filePath, (err) => {
            if (err) {
                fs.writeFile(filePath, brickData, (err) => {
                    callback(err, fileName)
                });
            } else {
                callback(undefined, fileName);
            }
        });
    },
    __readFile: function (writeFileStream, filePath, callback) {
        const readStream = fs.createReadStream(filePath);

        writeFileStream.on('finish', callback);
        writeFileStream.on('error', callback);

        readStream.pipe(writeFileStream);
    },
    __verifyFileExistence: function (filePath, callback) {
        fs.access(filePath, callback);
    },
    __convertStreamToBuffer: function (readStream, callback){
        let brickData = Buffer.alloc(0);
        readStream.on('data', (chunk) => {
            brickData = Buffer.concat([brickData, chunk]);
        });

        readStream.on('error', (err) => {
            return callback(err);
        });

        readStream.on('end', () => {
            return callback(undefined, brickData);
        });
    }
});

}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false,"fs":false,"pskcrypto":"pskcrypto","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricks/index.js":[function(require,module,exports){

function Bricks(server) {
    require('./flows/BricksManager');

    const path = require("swarmutils").path;
    const bricks_storage_folder = 'brick-storage';
    const { URL_PREFIX } = require('./constants');
    const { headersMiddleware, responseModifierMiddleware } = require('../../utils/middlewares');
    const { downloadBrick, downloadMultipleBricks, uploadBrick } = require('./controllers');

    let storageFolder = path.join(server.rootFolder, bricks_storage_folder);

    if (typeof process.env.EDFS_BRICK_STORAGE_FOLDER !== 'undefined') {
        storageFolder = process.env.EDFS_BRICK_STORAGE_FOLDER;
    }

    $$.flow.start('BricksManager').init(storageFolder);
    console.log('Bricks Storage location', storageFolder);

    server.use(`${URL_PREFIX}/*`, headersMiddleware);
    server.use(`${URL_PREFIX}/*`, responseModifierMiddleware);
    server.use(`${URL_PREFIX}/downloadMultipleBricks`, downloadMultipleBricks);

    server.put(`${URL_PREFIX}/put-brick`, uploadBrick);
    server.get(`${URL_PREFIX}/get-brick/:hashLink`, downloadBrick);
    server.get(`${URL_PREFIX}/downloadMultipleBricks`, downloadMultipleBricks);
}

module.exports = Bricks;

},{"../../utils/middlewares":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/middlewares/index.js","./constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricks/constants.js","./controllers":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricks/controllers.js","./flows/BricksManager":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricks/flows/BricksManager.js","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksFabric/constants.js":[function(require,module,exports){
const URL_PREFIX='/bricksFabric';

module.exports = {URL_PREFIX};
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksFabric/controllers.js":[function(require,module,exports){

function createHandler(flow, server) {

    return function storeTransaction (request, response, next) {

        console.log('store anchored called');
        //strategy is already booted up
        flow.storeData(request.body, server, (err, result) => {
            if (err) {
                return response.send(500,"Failed to store transaction."+ err.toString());
            }
            response.send(201, result);
        });

    }
}


module.exports = createHandler;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksFabric/index.js":[function(require,module,exports){


function AutoSavePendingTransactions (flow, timeout, server) {
    flow.completeBlock(server);
    setTimeout (  () => {
         AutoSavePendingTransactions(flow, timeout, server);
    }, timeout);

}


function BricksFabric(server) {

    require('./strategies/BrickStorage.js');

    const bricksFabricStrategy = require('./utils').getBricksFabricStrategy();
    const rootFolder = require('./utils').getRootFolder();
    //options
    const noOfTran = bricksFabricStrategy.option.transactionsPerBlock;
    const strategyType = bricksFabricStrategy.name;

    //init strategy
    let flow = $$.flow.start(strategyType);
    flow.init(rootFolder,noOfTran);

    //resume if necessary
    flow.bootUp();

    const timeout = bricksFabricStrategy.option.timeout;
    setTimeout (  () => {
        //start forever loop starting in timeout
        AutoSavePendingTransactions(flow, timeout, server);
    }, timeout);

    const { URL_PREFIX } = require('./constants.js');
    const { responseModifierMiddleware, requestBodyJSONMiddleware } = require('../../utils/middlewares');
    const  storeTransaction  = require('./controllers')(flow, server);

    server.use(`${URL_PREFIX}/*`, responseModifierMiddleware);
    // request.body is populated with what data needs to be stored
    server.put(`${URL_PREFIX}/add`, requestBodyJSONMiddleware);

    server.put(`${URL_PREFIX}/add`, storeTransaction);
};






module.exports = BricksFabric;
},{"../../utils/middlewares":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/middlewares/index.js","./constants.js":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksFabric/constants.js","./controllers":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksFabric/controllers.js","./strategies/BrickStorage.js":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksFabric/strategies/BrickStorage.js","./utils":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksFabric/utils/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksFabric/strategies/BrickStorage.js":[function(require,module,exports){
const fs = require('fs');
const path = require('swarmutils').path;
const BRICKSFABRIC_ERROR_CODE = 'bricks fabric error';


$$.flow.describe('BrickStorage', {

    init : function (brickFabricRootFolder,noOfTransactionsPerBlock) {
        this.rootFolder = brickFabricRootFolder;
        this.transactionsPerBlock = noOfTransactionsPerBlock;
        this.hashlinkfile = 'lasthashlink';
        this.lastBlockHashLink = undefined;
        this.pendingTransactions = [];
        this.pendingBuffer = [];
        this.isCommitingBlock = false;
    },
    bootUp : function(){
      //get latest hashlink
        const hashlinkpath = path.join(this.rootFolder,this.hashlinkfile);
        if (fs.existsSync(hashlinkpath))
        {
            this.lastBlockHashLink = fs.readFileSync(hashlinkpath).toString();
        }
    },
    __storeLastHashLink : function () {
        const hashlinkpath = path.join(this.rootFolder,this.hashlinkfile);
        fs.writeFileSync(hashlinkpath,this.lastBlockHashLink);
    },
    completeBlock : function (server, callback) {

        if (callback === undefined)
        {
            callback = (err, result) => {
                // Autosave callback.
            };
        }

        if (this.pendingTransactions.length === 0)
        {
            //No pending transactions
            return;
        }

        //build block
        const blockId = $$.uidGenerator.safe_uuid();
        const block = {
            'blockId' : blockId,
            'previousBlockHashLink' : this.lastBlockHashLink,
            'transactions' : []

        };

        for (let i = 0; i < this.pendingTransactions.length; i++) {
            block.transactions.push(this.pendingTransactions[i])
        }

        this.__SaveBlockToBrickStorage(JSON.stringify(block), server, callback);
    },
    __SaveBlockToBrickStorage : function (data, server, callback){

        const blockHeaders = {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        };
        const blockPath = require("../../bricks/constants").URL_PREFIX + "/put-brick";
        const blockMethod = "PUT";
        this.isCommitingBlock = true;

        try {
            server.makeLocalRequest(blockMethod, blockPath, data, blockHeaders, (err, result) => {
                if (err) {
                    console.log(err);
                    this.__pushBuffer();
                    this.isCommitingBlock = false;
                    callback(err, undefined);
                }

                if (result) {
                    this.lastBlockHashLink = JSON.parse(result).message;
                    this.__storeLastHashLink();
                    this.pendingTransactions.splice(0, this.pendingTransactions.length);
                    this.__pushBuffer();
                    this.isCommitingBlock = false;
                    //console.log(result);
                    console.log('block finished');

                    callback(undefined, result);
                }


            });
        } catch (err)
        {
            console.log("bricks fabric", err);
        }
    },
    __pushBuffer : function (){
        if (this.pendingBuffer.length > 0)
        {
            console.log("push buffer to pending block", this.pendingBuffer);
            for (let i = 0; i < this.pendingBuffer.length; i++) {
                this.pendingTransactions.push(this.pendingBuffer[i]);
            }
            this.pendingBuffer.splice(0, this.pendingBuffer.length);
        }
    },
    storeData : function (anchorData, server, callback) {
        if (this.isCommitingBlock === true)
        {
            console.log("transaction cached");
            this.pendingBuffer.push(anchorData);
            callback(undefined,"Transaction was added to the block.");
            return;
        }
        console.log("transaction pushed to pending block");
        this.pendingTransactions.push(anchorData);
        if (this.pendingTransactions.length >= this.transactionsPerBlock)
        {
           // console.log("commit block callback");
           this.completeBlock(server, callback);
        }else {
            //console.log("pending callback");
            callback(undefined,"Transaction was added to the block.");
        }
    }









});

module.exports = { BRICKSFABRIC_ERROR_CODE};
},{"../../bricks/constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricks/constants.js","fs":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksFabric/utils/index.js":[function(require,module,exports){

const getBricksFabricStrategy = () => {
    const config = require("../../../config");
    return config.getConfig('endpointsConfig', 'bricksFabric', 'domainStrategies', 'default');
};

const getRootFolder = () => {
    // temporary location where we store the last hashlink
    const config = require("../../../config");
    return config.getConfig('endpointsConfig', 'bricksFabric').path;
};

module.exports.getBricksFabricStrategy = getBricksFabricStrategy;
module.exports.getRootFolder = getRootFolder;


},{"../../../config":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksLedger/constants.js":[function(require,module,exports){
const URL_PREFIX = '/bricksledger';

module.exports = {URL_PREFIX};
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksLedger/controlers.js":[function(require,module,exports){
const path = require('swarmutils').path;

function createHandler(server) {

    return function executeCommand(request, response, next) {
        console.log('runCommand received');

        const commandType = request.body.commandType;
        const getCmdConfig = require('./utils').getCmdConfig(commandType);
        //we need to provide full path to the file, relative path will generate not found module error
        const modulePath = path.join(process.env.PSK_ROOT_INSTALATION_FOLDER,'modules/psk-apihub/components/bricksLedger/commands', getCmdConfig);
        try {
            require(`${modulePath}`)(request.body , server, (err, result) => {
                if (err) {
                    console.log('command controler error. err :', err);
                    return response.send(500, err);
                }
                console.log("completed executedCommand", result);
                //no err, then maybe we get something in result
                return response.send(201, result);
            });
        } catch (err)
        {
            console.log("command controller catch error. err :",err);
            return response.send(500, err);
        }


    }

}


module.exports = createHandler;
},{"./utils":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksLedger/utils/index.js","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksLedger/index.js":[function(require,module,exports){
function BricksLedger(server) {

    const executeCommand= require('./controlers')(server);
    const { URL_PREFIX } = require('./constants');
    const { responseModifierMiddleware, requestBodyJSONMiddleware } = require('../../utils/middlewares');

    server.use(`${URL_PREFIX}/*`, responseModifierMiddleware);

    server.post(`${URL_PREFIX}/runCommand`, requestBodyJSONMiddleware);
    server.post(`${URL_PREFIX}/runCommand`, executeCommand);

    console.log(`listening on ${URL_PREFIX}/runCommand`)
}


module.exports = BricksLedger;
},{"../../utils/middlewares":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/middlewares/index.js","./constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksLedger/constants.js","./controlers":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksLedger/controlers.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksLedger/utils/index.js":[function(require,module,exports){
function getCmdConfig(commandType)
{
    const config = require('../../../config');
    const cfg = config.getConfig('endpointsConfig', 'bricksLedger');
    const cmdConfig = 'do' + capitalize(commandType);
    return cfg[cmdConfig];

}


function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {getCmdConfig};
},{"../../../config":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/channelManager/index.js":[function(require,module,exports){
(function (Buffer,__dirname){(function (){
const path = require("swarmutils").path;
const fs = require("fs");
const crypto = require('crypto');
const integration = require("zmq_adapter");

const Queue = require("swarmutils").Queue;
const SwarmPacker = require("swarmutils").SwarmPacker;

// Code smaell 
function ChannelsManager(server) {
    const utils = require("../../utils");
    const readBody = utils.streams.readStringFromStream;
    const config = require("../../config").getConfig();
    const channelKeyFileName = "channel_key";

    const rootFolder = path.join(config.storage, config.endpointsConfig.virtualMQ.channelsFolderName);

    if (!fs.existsSync(rootFolder)) {
        fs.mkdirSync(rootFolder, { recursive: true });
    }

    const channelKeys = {};
    const queues = {};
    const subscribers = {};

    let baseDir = __dirname;

    //if __dirname appears in process.cwd path it means that the code isn't run from browserified version
    //TODO: check for better implementation
    if (process.cwd().indexOf(__dirname) === -1) {
        baseDir = path.join(process.cwd(), __dirname);
    }


    let forwarder;
    if (integration.testIfAvailable()) {
        forwarder = integration.getForwarderInstance(config.zeromqForwardAddress);
    }

    function generateToken() {
        let buffer = crypto.randomBytes(config.endpointsConfig.virtualMQ.tokenSize);
        return buffer.toString('hex');
    }

    function createChannel(name, publicKey, callback) {
        let channelFolder = path.join(rootFolder, name);
        let keyFile = path.join(channelFolder, channelKeyFileName);
        let token = generateToken();

        if (typeof channelKeys[name] !== "undefined" || fs.existsSync(channelFolder)) {
            let e = new Error("channel exists!");
            e.code = 409;
            return callback(e);
        }

        fs.mkdirSync(channelFolder);

        if (fs.existsSync(keyFile)) {
            let e = new Error("channel exists!");
            e.code = 409;
            return callback(e);
        }

        const config = JSON.stringify({ publicKey, token });
        fs.writeFile(keyFile, config, (err, res) => {
            if (!err) {
                channelKeys[name] = config;
            }
            return callback(err, !err ? token : undefined);
        });
    }

    function retrieveChannelDetails(channelName, callback) {
        if (typeof channelKeys[channelName] !== "undefined") {
            return callback(null, channelKeys[channelName]);
        } else {
            fs.readFile(path.join(rootFolder, channelName, channelKeyFileName), (err, res) => {
                if (res) {
                    try {
                        channelKeys[channelName] = JSON.parse(res);
                    } catch (e) {
                        console.log(e);
                        return callback(e);
                    }
                }
                callback(err, channelKeys[channelName]);
            });
        }
    }

    function forwardChannel(channelName, forward, callback) {
        let channelKeyFile = path.join(rootFolder, channelName, channelKeyFileName);
        fs.readFile(channelKeyFile, (err, content) => {
            let config;
            try {
                config = JSON.parse(content);
            } catch (e) {
                return callback(e);
            }

            if (typeof config !== "undefined") {
                config.forward = forward;
                fs.writeFile(channelKeyFile, JSON.stringify(config), (err, ...args) => {
                    if (!err) {
                        channelKeys[channelName] = config;
                    }
                    callback(err, ...args);
                });
            }
        });
    }

    function createChannelHandler(req, res) {
        const channelName = req.params.channelName;

        readBody(req, (err, message) => {
            if (err) {
                return sendStatus(res, 400);
            }

            const publicKey = message;
            if (typeof channelName !== "string" || channelName.length === 0 ||
                typeof publicKey !== "string" || publicKey.length === 0) {
                return sendStatus(res, 400);
            }

            let handler = getBasicReturnHandler(res);

            createChannel(channelName, publicKey, (err, token) => {
                if (!err) {
                    res.setHeader('Cookie', [`${config.endpointsConfig.virtualMQ.tokenSize}=${token}`]);
                }
                handler(err, res);
            });
        });
    }

    function sendStatus(res, reasonCode) {
        res.statusCode = reasonCode;
        res.end();
    }

    function getBasicReturnHandler(res) {
        return function (err, result) {
            if (err) {
                return sendStatus(res, err.code || 500);
            }

            return sendStatus(res, 200);
        }
    }

    function enableForwarderHandler(req, res) {
        if (integration.testIfAvailable() === false) {
            return sendStatus(res, 417);
        }
        readBody(req, (err, message) => {
            const { enable } = message;
            const channelName = req.params.channelName;
            const signature = req.headers[config.endpointsConfig.virtualMQ.signatureHeaderName];

            if (typeof channelName !== "string" || typeof signature !== "string") {
                return sendStatus(res, 400);
            }

            retrieveChannelDetails(channelName, (err, details) => {
                if (err) {
                    return sendStatus(res, 500);
                } else {
                    //todo: check signature against key [details.publickey]

                    if (typeof enable === "undefined" || enable) {
                        forwardChannel(channelName, true, getBasicReturnHandler(res));
                    } else {
                        forwardChannel(channelName, null, getBasicReturnHandler(res));
                    }
                }
            });
        });
    }

    function getQueue(name) {
        if (typeof queues[name] === "undefined") {
            queues[name] = new Queue();
        }

        return queues[name];
    }

    function checkIfChannelExist(channelName, callback) {
        retrieveChannelDetails(channelName, (err, details) => {
            callback(null, err ? false : true);
        });
    }

    function writeMessage(subscribers, message) {
        let dispatched = false;
        try {
            while (subscribers.length > 0) {
                let subscriber = subscribers.pop();
                if (!dispatched) {
                    deliverMessage(subscriber, message);
                    dispatched = true;
                } else {
                    sendStatus(subscriber, 403);
                }
            }
        } catch (err) {
            //... some subscribers could have a timeout connection
            if (subscribers.length > 0) {
                deliverMessage(subscribers, message);
            }
        }

        return dispatched;
    }

    function readSendMessageBody(req, callback) {
        const contentType = req.headers['content-type'];

        if (contentType === 'application/octet-stream') {
            const contentLength = Number.parseInt(req.headers['content-length'], 10);

            if (Number.isNaN(contentLength)) {
                let error = new Error("Wrong content length header received!");
                error.code = 411;
                return callback(error);
            }

            streamToBuffer(req, contentLength, (err, bodyAsBuffer) => {
                if (err) {
                    return callback(err);
                }
                callback(undefined, bodyAsBuffer);
            });
        } else {
            callback(new Error("Wrong message format received!"));
        }

        function streamToBuffer(stream, bufferSize, callback) {
            const buffer = Buffer.alloc(bufferSize);
            let currentOffset = 0;

            stream.on('data', function (chunk) {
                const chunkSize = chunk.length;
                const nextOffset = chunkSize + currentOffset;

                if (currentOffset > bufferSize - 1) {
                    stream.close();
                    return callback(new Error('Stream is bigger than reported size'));
                }

                write2Buffer(buffer, chunk, currentOffset);
                currentOffset = nextOffset;

            });
            stream.on('end', function () {
                callback(undefined, buffer);
            });
            stream.on('error', callback);
        }

        function write2Buffer(buffer, dataToAppend, offset) {
            const dataSize = dataToAppend.length;

            for (let i = 0; i < dataSize; i++) {
                buffer[offset++] = dataToAppend[i];
            }
        }
    }

    function sendMessageHandler(req, res) {
        let channelName = req.params.channelName;

        checkIfChannelExist(channelName, (err, exists) => {
            if (!exists) {
                return sendStatus(res, 403);
            } else {
                retrieveChannelDetails(channelName, (err, details) => {
                    //we choose to read the body of request only after we know that we recognize the destination channel
                    readSendMessageBody(req, (err, message) => {
                        if (err) {
                            //console.log(err);
                            return sendStatus(res, 403);
                        }

                        let header;
                        try {
                            header = SwarmPacker.unpack(message.buffer);
                        } catch (error) {
                            //console.log(error);
                            return sendStatus(res, 400);
                        }

                        //TODO: to all checks based on message header

                        if (integration.testIfAvailable() && details.forward) {
                            //console.log("Forwarding message <", message, "> on channel", channelName);
                            forwarder.send(channelName, message);
                        } else {
                            let queue = getQueue(channelName);
                            let subscribers = getSubscribersList(channelName);
                            let dispatched = false;
                            if (queue.isEmpty()) {
                                dispatched = writeMessage(subscribers, message);
                            }
                            if (!dispatched) {
                                if (queue.length < config.endpointsConfig.virtualMQ.maxSize) {
                                    queue.push(message);
                                } else {
                                    //queue is full
                                    return sendStatus(res, 429);
                                }

                                /*
                                if(subscribers.length>0){
                                    //... if we have somebody waiting for a message and the queue is not empty means that something bad
                                    //happened and maybe we should try to dispatch first message from queue
                                }
                                */

                            }
                        }
                        return sendStatus(res, 200);
                    });
                })
            }
        });
    }

    function getSubscribersList(channelName) {
        if (typeof subscribers[channelName] === "undefined") {
            subscribers[channelName] = [];
        }

        return subscribers[channelName];
    }

    function deliverMessage(res, message) {
        if (Buffer.isBuffer(message)) {
            res.setHeader('content-type', 'application/octet-stream');
        }

        if (typeof message.length !== "undefined") {
            res.setHeader('content-length', message.length);
        }

        res.write(message);
        sendStatus(res, 200);
    }

    function getCookie(res, cookieName) {
        let cookies = res.headers['cookie'];
        if (typeof cookies === "undefined") {
            return undefined;
        }
        if (Array.isArray(cookies)) {
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i];
                if (cookie.indexOf(cookieName) !== -1) {
                    return cookie.substr(cookieName.length + 1);
                }
            }
        } else {
            cookieName = cookieName.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');

            let regex = new RegExp('(?:^|;)\\s?' + cookieName + '=(.*?)(?:;|$)', 'i');
            let match = cookies.match(regex);

            return match && unescape(match[1]);
        }
    }

    function receiveMessageHandler(req, res) {
        let channelName = req.params.channelName;
        checkIfChannelExist(channelName, (err, exists) => {
            if (!exists) {
                return sendStatus(res, 403);
            } else {
                retrieveChannelDetails(channelName, (err, details) => {
                    if (err) {
                        return sendStatus(res, 500);
                    }
                    //TODO: check signature agains details.publickey


                    if (details.forward) {
                        //if channel is forward it does not make sense
                        return sendStatus(res, 409);
                    }

                    /*let signature = req.headers["signature"];
                    if(typeof signature === "undefined"){
                        return sendStatus(res, 403);
                    }*/

                    // let cookie = getCookie(req, tokenHeaderName);

                    // if(typeof cookie === "undefined" || cookie === null){
                    //     return sendStatus(res, 412);
                    // }

                    let queue = getQueue(channelName);
                    let message = queue.pop();

                    if (!message) {
                        getSubscribersList(channelName).push(res);
                    } else {
                        deliverMessage(res, message);
                    }
                });
            }
        });
    }

    server.put("/create-channel/:channelName", createChannelHandler);
    server.post("/forward-zeromq/:channelName", enableForwarderHandler);
    server.post("/send-message/:channelName", sendMessageHandler);
    server.get("/receive-message/:channelName", receiveMessageHandler);
}

module.exports = ChannelsManager;
}).call(this)}).call(this,require("buffer").Buffer,"/modules/psk-apihub/components/channelManager")

},{"../../config":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/index.js","../../utils":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/index.js","buffer":false,"crypto":false,"fs":false,"swarmutils":"swarmutils","zmq_adapter":"zmq_adapter"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/fileManager/controllers/downloadFile.js":[function(require,module,exports){
(function (Buffer){(function (){
const fs = require('fs');
const path = require("swarmutils").path;
const config = require('../../../config');

function sendResult(resHandler, resultStream) {
    resHandler.statusCode = 200;
    resultStream.pipe(resHandler);

    resultStream.on('finish', () => {
        resHandler.end();
    });
}

function downloadFile(req, res) {
    download(req, res, (err, result) => {
        if (err) {
            res.statusCode = 404;
            res.end();
        } else {
            sendResult(res, result);
        }
    });
}

function download(req, res, callback) {
    const readFileStream = req;
    if (!readFileStream || !readFileStream.pipe || typeof readFileStream.pipe !== "function") {
        callback(new Error("Something wrong happened"));
        return;
    }

    const folder = Buffer.from(req.params.filepath, 'base64').toString().replace('\n', '');
    const completeFolderPath = path.join(config.getConfig('storage'), folder);

    if (folder.includes('..')) {
        return callback(new Error("invalidPath"));
    }

    if (fs.existsSync(completeFolderPath)) {
        const fileToSend = fs.createReadStream(completeFolderPath);
        res.setHeader('Content-Type', `image/${folder.split('.')[1]}`);
        return callback(null, fileToSend);
    }

    return callback(new Error("PathNotFound"));
}

module.exports = downloadFile;

}).call(this)}).call(this,require("buffer").Buffer)

},{"../../../config":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/index.js","buffer":false,"fs":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/fileManager/controllers/uploadFile.js":[function(require,module,exports){
(function (Buffer){(function (){

const fs = require('fs');
const path = require("swarmutils").path;
const config = require('../../../config');

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function uploadFile(req, res) {
    upload(req, (err, result) => {
        if (err) {
            res.statusCode = 500;
            res.end();
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify(result));
        }
    })
};

function upload(req, callback) {
    const readFileStream = req;
    if (!readFileStream || !readFileStream.pipe || typeof readFileStream.pipe !== "function") {
        return callback(new Error("Something wrong happened"));
    }

    const folder = Buffer.from(req.params.folder, 'base64').toString().replace('\n', '');

    if (folder.includes('..')) {
        return callback('err');
    }

    let filename = guid();

    if (filename.split('.').length > 1) {
        return callback('err');
    }

    const completeFolderPath = path.join(config.getConfig('storage'), folder);

    const contentType = req.headers['content-type'].split('/');

    if (contentType[0] === 'image' || (contentType[0] === 'application' && contentType[1] === 'pdf')) {
        filename += '.' + contentType[1];
    } else {
        return callback('err');
    }

    try {
        fs.mkdirSync(completeFolderPath, { recursive: true });
    } catch (e) {
        return callback(e);
    }

    const writeStream = fs.createWriteStream(path.join(completeFolderPath, filename));

    writeStream.on('finish', () => {
        writeStream.close();
        return callback(null, { 'path': path.posix.join(folder, filename) });
    });

    writeStream.on('error', (err) => {
        writeStream.close();
        return callback(err);
    });

    req.pipe(writeStream);
}

module.exports =  uploadFile;
}).call(this)}).call(this,require("buffer").Buffer)

},{"../../../config":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/index.js","buffer":false,"fs":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/fileManager/index.js":[function(require,module,exports){
function filesManager(server) {

	const uploadFile = require('./controllers/uploadFile');
	const downloadFile = require('./controllers/downloadFile');

	server.post('/files/upload/:folder', uploadFile);
	server.get('/files/download/:filepath', downloadFile);
}

module.exports = filesManager;
},{"./controllers/downloadFile":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/fileManager/controllers/downloadFile.js","./controllers/uploadFile":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/fileManager/controllers/uploadFile.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/keySsiNotifications/constants.js":[function(require,module,exports){
const URL_PREFIX = '/notifications';

module.exports = { URL_PREFIX };
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/keySsiNotifications/index.js":[function(require,module,exports){
function KeySSINotifications(server) {
	let notificationManager;
	const utils = require('../../utils');
	const readBody = utils.streams.readStringFromStream;
	const config = require('../../config');
	const { responseModifierMiddleware } = require('./../../utils/middlewares');
	const { URL_PREFIX } = require('./constants');
	const workingDirPath = config.getConfig('endpointsConfig', 'messaging', 'workingDirPath');

	function publish(request, response) {
		let anchorId = request.params.anchorId;

		readBody(request, (err, message) => {
			if (err) {
				return response.send(400);
			}

			notificationManager.createQueue(anchorId, function (err) {
				if (err) {
					if (err.statusCode) {
						if (err.statusCode !== 409) {
							return response.send(err.statusCode);
						}
					} else {
						return response.send(500);
					}
				}

				notificationManager.sendMessage(anchorId, message, function (err, counter) {
					if (err) {
						return response.send(500);
					}

					let message;

					if (counter > 0) {
						message = `Message delivered to ${counter} subscribers.`;
					} else {
						message = `Message was added to queue and will be delivered later.`;
					}

					return response.send(200, message);
				});
			});
		});
	}

	function subscribe(request, response) {
		let anchorId = request.params.anchorId;

		notificationManager.createQueue(anchorId, function (err) {
			if (err) {
				if (err.statusCode) {
					if (err.statusCode !== 409) {
						return response.send(err.statusCode);
					}
				} else {
					return response.send(500);
				}
			}

			notificationManager.readMessage(anchorId, function (err, message) {
				try {
					if (err) {
						return response.send(err.statusCode || 500, message);
					}

					response.send(200, message);
				} catch (err) {
					//here we expect to get errors when a connection has reached timeout
					console.log(err);
					response.send(400, 'opps');
				}
			});
		});
	}

	function unsubscribe(request, response) {
		//to be implemented later
		response.send(503);
	}

	require('./../../libs/Notifications').getManagerInstance(workingDirPath, (err, instance) => {
		if (err) {
			return console.log(err);
		}

		notificationManager = instance;
		server.use(`${URL_PREFIX}/*`, responseModifierMiddleware)

		server.post(`${URL_PREFIX}/subscribe/:anchorId`, subscribe);
		server.delete(`${URL_PREFIX}/unsubscribe/:anchorId`, unsubscribe);
		server.put(`${URL_PREFIX}/publish/:anchorId`, publish);
	});
}

module.exports = KeySSINotifications;

},{"../../config":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/index.js","../../utils":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/index.js","./../../libs/Notifications":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/Notifications.js","./../../utils/middlewares":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/middlewares/index.js","./constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/keySsiNotifications/constants.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/mqManager/constants.js":[function(require,module,exports){
const URL_PREFIX = '/mq';

module.exports = { URL_PREFIX };
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/mqManager/index.js":[function(require,module,exports){
function mqManager(server) {
	let notificationManager;
	const utils = require('./../../utils');
	const { URL_PREFIX } = require('./constants');
	const readBody = utils.streams.readStringFromStream;
	const config = require('../../config');
	const workingDirPath = config.getConfig('endpointsConfig', 'messaging', 'workingDirPath');
	const storageDirPath = config.getConfig('endpointsConfig', 'messaging', 'storageDirPath');


	function sendStatus(res, reasonCode) {
		res.statusCode = reasonCode;
		res.end();
	}

	function createChannel(req, res) {
		let anchorId = req.params.anchorId;
		let SSI = req.headers['ssi'];
		if (typeof SSI === 'undefined' || typeof anchorId === 'undefined') {
			return sendStatus(res, 400);
		}

		notificationManager.createQueue(anchorId, function (err) {
			if (err) {
				if (err.statusCode) {
					res.write(err.message);
					return sendStatus(res, err.statusCode);
				} else {
					return sendStatus(res, 500);
				}
			}

			//store SSI to check ownership

			sendStatus(res, 200);
		});
	}

	function sendMessage(req, res) {
		let anchorId = req.params.anchorId;
		if (typeof anchorId === 'undefined') {
			return sendStatus(res, 400);
		}
		readBody(req, (err, message) => {
			if (err) {
				return sendStatus(res, 400);
			}
			notificationManager.sendMessage(anchorId, message, function (err, counter) {
				if (err) {
					return sendStatus(res, 500);
				}

				if (counter > 0) {
					res.write(`Message delivered to ${counter} subscribers.`);
				} else {
					res.write(`Message was added to queue and will be delivered later.`);
				}

				return sendStatus(res, 200);
			});
		});
	}

	function receiveMessage(req, res) {
		let anchorId = req.params.anchorId;
		if (typeof anchorId === 'undefined') {
			return sendStatus(res, 400);
		}

		//check tokens before delivering a message

		notificationManager.readMessage(anchorId, function (err, message) {
			try {
				if (err) {
					if (err.statusCode) {
						return sendStatus(res, err.statusCode);
					} else {
						return sendStatus(res, 500);
					}
				}
				res.write(message);
				sendStatus(res, 200);
			} catch (err) {
				//here we expect to get errors when a connection has reached timeout
				console.log(err);
			}
		});
	}

	require('./../../libs/Notifications').getManagerInstance(workingDirPath, storageDirPath, (err, instance) => {
		if (err) {
			return console.log(err);
		}

		notificationManager = instance;

		// Proposed
		// server.get(`${URL_PREFIX}/channel/:anchorId/message`, createChannel);

		server.post(`${URL_PREFIX}/create-channel/:anchorId`, createChannel);
		server.post(`${URL_PREFIX}/send-message/:anchorId`, sendMessage);
		server.get(`${URL_PREFIX}/receive-message/:anchorId`, receiveMessage);
	});
}

module.exports = mqManager;

},{"../../config":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/index.js","./../../libs/Notifications":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/Notifications.js","./../../utils":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/index.js","./constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/mqManager/constants.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/staticServer/index.js":[function(require,module,exports){
function StaticServer(server) {
    const fs = require("fs");
    const path = require('swarmutils').path;
    const utils = require("../../utils");

    function sendFiles(req, res, next) {
        const prefix = "/directory-summary/";
        requestValidation(req, "GET", prefix, function (notOurResponsibility, targetPath) {
            if (notOurResponsibility) {
                return next();
            }
            targetPath = targetPath.replace(prefix, "");
            serverTarget(targetPath);
        });

        function serverTarget(targetPath) {
            console.log("Serving summary for dir:", targetPath);
            fs.stat(targetPath, function (err, stats) {
                if (err) {
                    res.statusCode = 404;
                    res.end();
                    return;
                }
                if (!stats.isDirectory()) {
                    res.statusCode = 403;
                    res.end();
                    return;
                }

                function send() {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', "application/json");
                    //let's clean some empty objects
                    for (let prop in summary) {
                        if (Object.keys(summary[prop]).length === 0) {
                            delete summary[prop];
                        }
                    }

                    res.write(JSON.stringify(summary));
                    res.end();
                }

                let summary = {};
                let directories = {};

                function extractContent(currentPath) {
                    directories[currentPath] = -1;
                    let summaryId = currentPath.replace(targetPath, "");
                    summaryId = summaryId.split(path.sep).join("/");
                    if (summaryId === "") {
                        summaryId = "/";
                    }
                    //summaryId = path.basename(summaryId);
                    summary[summaryId] = {};

                    fs.readdir(currentPath, function (err, files) {
                        if (err) {
                            return markAsFinish(currentPath);
                        }
                        directories[currentPath] = files.length;
                        //directory empty test
                        if (files.length === 0) {
                            return markAsFinish(currentPath);
                        } else {
                            for (let i = 0; i < files.length; i++) {
                                let file = files[i];
                                const fileName = path.join(currentPath, file);
                                if (fs.statSync(fileName).isDirectory()) {
                                    extractContent(fileName);
                                } else {
                                    let fileContent = fs.readFileSync(fileName);
                                    let fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
                                    let mimeType = utils.getMimeTypeFromExtension(fileExtension);
                                    if (mimeType.binary) {
                                        summary[summaryId][file] = Array.from(fileContent);
                                    } else {
                                        summary[summaryId][file] = fileContent.toString();
                                    }

                                }
                                directories[currentPath]--;
                            }
                            return markAsFinish(currentPath);
                        }
                    });
                }

                function markAsFinish(targetPath) {
                    if (directories [targetPath] > 0) {
                        return;
                    }
                    delete directories [targetPath];
                    const dirsLeftToProcess = Object.keys(directories);
                    //if there are no other directories left to process
                    if (dirsLeftToProcess.length === 0) {
                        send();
                    }
                }

                extractContent(targetPath);
            })
        }

    }

    function sendFile(res, file) {
        let stream = fs.createReadStream(file);
        let ext = path.extname(file);

        if (ext !== "") {
            ext = ext.replace(".", "");
            res.setHeader('Content-Type', utils.getMimeTypeFromExtension(ext).name);
        } else {
            res.setHeader('Content-Type', "application/octet-stream");
        }

        res.statusCode = 200;
        stream.pipe(res);
        stream.on('finish', () => {
            res.end();
        });
    }

    function requestValidation(req, method, urlPrefix, callback) {
        if (typeof urlPrefix === "function") {
            callback = urlPrefix;
            urlPrefix = undefined;
        }

        if (req.method !== method) {
            //we resolve only GET requests
            return callback(true);
        }

        if (typeof urlPrefix !== "undefined") {
            if (req.url.indexOf(urlPrefix) !== 0) {
                return callback(true);
            }
        }

        const rootFolder = server.rootFolder;
        const path = require("swarmutils").path;
        let requestedUrl = new URL(req.url, `http://${req.headers.host}`);
		let requestedUrlPathname = requestedUrl.pathname;
        if (urlPrefix) {
            requestedUrlPathname = requestedUrlPathname.replace(urlPrefix, "");
        }
        let targetPath = path.resolve(path.join(rootFolder, requestedUrlPathname));
        //if we detect tricks that tries to make us go above our rootFolder to don't resolve it!!!!
       
        if (targetPath.indexOf(rootFolder) !== 0) {
            return callback(true);
        }
       
        callback(false, targetPath);
    }

    function redirect(req, res, next) {
        requestValidation(req, "GET", function (notOurResponsibility, targetPath) {
            if (notOurResponsibility) {
                return next();
            }
            //from now on we mean to resolve the url
            //remove existing query params
            fs.stat(targetPath, function (err, stats) {
                if (err) {
                    res.statusCode = 404;
                    res.end();
                    return;
                }
                
                if (stats.isDirectory()) {

					let protocol = req.socket.encrypted ? "https" : "http";
					let url = new URL(req.url, `${protocol}://${req.headers.host}`);

                    if (url.pathname[url.pathname.length - 1] !== "/") {
                        res.writeHead(302, {
                            'Location': url.pathname + "/" +url.search
                        });
                        res.end();
                        return;
                    }
                    
                    const defaultFileName = "index.html";
                    const defaultPath = path.join(targetPath, defaultFileName);
                    fs.stat(defaultPath, function (err) {
                        if (err) {
                            res.statusCode = 403;
                            res.end();
                            return;
                        }
                        
                        return sendFile(res, defaultPath);
                    });
                } else {
                    return sendFile(res, targetPath);
                }
            });
        });
    }

    server.use("*", sendFiles);
    server.use("*", redirect);
}

module.exports = StaticServer;

},{"../../utils":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/index.js","fs":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/vmq/requestFactory.js":[function(require,module,exports){
(function (Buffer){(function (){
const http = require('http');
const { URL } = require('url');
const swarmUtils = require('swarmutils');
const SwarmPacker = swarmUtils.SwarmPacker;
const signatureHeaderName = process.env.vmq_signature_header_name || "x-signature";

function requestFactory(virtualMQAddress, zeroMQAddress) {
    function createChannel(channelName, publicKey, callback) {
        const options = {
            path: `/create-channel/${channelName}`,
            method: "PUT"
        };

        const req = http.request(virtualMQAddress, options, callback);
        req.write(publicKey);
        req.end();
    }

    function createForwardChannel(channelName, publicKey, callback) {
        const options = {
            path: `/create-channel/${channelName}`,
            method: "PUT"
        };

        const req = http.request(virtualMQAddress, options, (res) => {
            this.enableForward(channelName, "justASignature", callback);
        });
        req.write(publicKey);
        req.end();
    }

    function enableForward(channelName, signature, callback) {
        const options = {
            path: `/forward-zeromq/${channelName}`,
            method: "POST"
        };

        const req = http.request(virtualMQAddress, options, callback);
        req.setHeader(signatureHeaderName, signature);
        req.end();
    }

    function sendMessage(channelName, message, signature, callback) {
        const options = {
            path: `/send-message/${channelName}`,
            method: "POST"
        };

        const req = http.request(virtualMQAddress, options, callback);
        req.setHeader(signatureHeaderName, signature);

        let pack = SwarmPacker.pack(message);

        req.setHeader("content-length", pack.byteLength);
        req.setHeader("content-type", 'application/octet-stream');
        req.write(Buffer.from(pack));
        req.end();
    }

    function receiveMessage(channelName, signature, callback) {
        const options = {
            path: `/receive-message/${channelName}`,
            method: "GET"
        };

        const req = http.request(virtualMQAddress, options, function (res) {
            const utils = require("../../utils").streams;
            utils.readMessageBufferFromStream(res, function (err, message) {

                callback(err, res, (message && Buffer.isBuffer(message)) ? SwarmPacker.unpack(message.buffer) : message);
            });
        });

        req.setHeader(signatureHeaderName, signature);
        req.end();
    }

    function receiveMessageFromZMQ(channelName, signature, readyCallback, receivedCallback) {
        const zmqIntegration = require("zmq_adapter");

        let catchEvents = (eventType, ...args) => {
            // console.log("Event type caught", eventType, ...args);
            if (eventType === "connect") {
                //connected so all good
                readyCallback();
            }
        };

        let consumer = zmqIntegration.createZeromqConsumer(zeroMQAddress, catchEvents);
        consumer.subscribe(channelName, signature, (channel, receivedMessage) => {
            receivedCallback(JSON.parse(channel.toString()).channelName, receivedMessage.buffer);
        });
    }

    function generateMessage(swarmName, swarmPhase, args, targetAgent, returnAddress) {
        return {
            meta: {
                swarmId: swarmUtils.generateUid(32).toString("hex"),
                requestId: swarmUtils.generateUid(32).toString("hex"),
                swarmTypeName: swarmName || "testSwarmType",
                phaseName: swarmPhase || "swarmPhaseName",
                args: args || [],
                command: "executeSwarmPhase",
                target: targetAgent || "agentURL",
                homeSecurityContext: returnAddress || "no_home_no_return"
            }
        };
    }

    function getPort() {
        try {
            return new URL(virtualMQAddress).port;
        } catch (e) {
            console.error(e);
        }
    }

    // targeted virtualmq apis
    this.createChannel = createChannel;
    this.createForwardChannel = createForwardChannel;
    this.enableForward = enableForward;
    this.sendMessage = sendMessage;
    this.receiveMessage = receiveMessage;
    this.receiveMessageFromZMQ = receiveMessageFromZMQ;

    // utils for testing
    if (!process.env.NODE_ENV || (process.env.NODE_ENV && !process.env.NODE_ENV.startsWith('prod'))) { // if NODE_ENV does not exist or if it exists and is not set to production
        this.getPort = getPort;
        this.generateMessage = generateMessage;
    }
}

module.exports = requestFactory;
}).call(this)}).call(this,require("buffer").Buffer)

},{"../../utils":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/index.js","buffer":false,"http":false,"swarmutils":"swarmutils","url":false,"zmq_adapter":"zmq_adapter"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/default.js":[function(require,module,exports){
const path = require("swarmutils").path;

const defaultConfig = {
    "storage": path.join(process.env.PSK_ROOT_INSTALATION_FOLDER, "tmp"),
    "sslFolder": path.join(process.env.PSK_ROOT_INSTALATION_FOLDER, "conf", "ssl"),
    "port": 8080,
    "host": "0.0.0.0",
    "zeromqForwardAddress": "tcp://127.0.0.1:5001",
    "preventRateLimit": false,
    // staticServer needs to load last
    "activeEndpoints": ["virtualMQ", "messaging", "notifications", "filesManager", "bricksLedger", "bricks", "anchoring", "bricksFabric", "dsu-wizard", "staticServer"],
    "endpointsConfig": {
        "messaging": {
            "module": "./components/mqManager",
            "workingDirPath": "./messaging",
            "storageDirPath": "./messaging/storage"
        },
        "notifications": {
            "module": "./components/keySsiNotifications",
            "workingDirPath": "./notifications"
        },
        "virtualMQ": {
            "module": "./components/channelManager",
            "channelsFolderName": "channels",
            "maxSize": 100,
            "tokenSize": 48,
            "tokenHeaderName": "x-tokenHeader",
            "signatureHeaderName": "x-signature",
            "enableSignatureCheck": true
        },
        "dsu-wizard": {
            "module": "dsu-wizard",
            "function": "initWizard"
        },
        "bricks": {
            "module": "./components/bricks"
        },
        "filesManager": {
            "module": "./components/fileManager"
        },
        "bricksFabric":{
          "module" : "./components/bricksFabric",
            "path": "./",
          "domainStrategies" : {
              "default" : {
                  "name": "BrickStorage",
                  "option" : {
                      "timeout" : 15000,
                     "transactionsPerBlock" : 5
                  }
              }
          }
        },
        "anchoring": {
            "module": "./components/anchoring",
            "domainStrategies": {
                "default": {
                    "type": "FS",
                    "option": {
                        "path": "/anchors"
                    },
                    "commands" : {
                        "addAnchor": "anchor"
                        // anchor se trimite in body ca si commandType, apoi este tradus in doAnchor si acesta e cautat in settings pentru a vedea ce executa
                        // domainStrategies : sunt legate intre ele ? adica anchoring va trimite strategia sa catre bricksLedger si acesta o va trimite catree bricksFabric ?
                        // momentan strategia pare sa poata fii determinata doar de anchoring care primeste un keySSI in params. Restul componentelor nu au metode prin care sa poata determina o strategie
                    }

                },
                "EPI": {
                    "type" : "etherum",
                    "endpoint" : "http://localhost:3000", // endpoitn catre API care proceseaza cererile catre etherum network
                    "option" : {
                       //maybe other options will be required
                    } // operation will be done dirrectlly into the Ethereum API -> jsonrpc-> network
                }
            }
        },
        "staticServer": {
            "module": "./components/staticServer"
        },
        "bricksLedger": {
            "module": "./components/bricksLedger",
            "doAnchor" : "anchorCommand.js",
            "doEPIAnchor" : "EPIAnchorCommand.js"
        }
    },
    "tokenBucket": {
        "cost": {
            "low": 10,
            "medium": 100,
            "high": 500
        },
        "error": {
            "limitExceeded": "error_limit_exceeded",
            "badArgument": "error_bad_argument"
        },
        "startTokens": 6000,
        "tokenValuePerTime": 10,
        "unitOfTime": 100
    }
};

module.exports = Object.freeze(defaultConfig);
},{"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/index.js":[function(require,module,exports){
const path = require("swarmutils").path;
const defaultConf = require('./default');

let serverConfig;

function getConfig(...keys) {
    if (!serverConfig) {
        const serverJson = typeof serverConfig === "undefined" ? require(path.join(path.resolve(process.env.PSK_CONFIG_LOCATION), 'server.json')) : '';

        serverConfig = new ServerConfig(serverJson);
    }

    if (!Array.isArray(keys) || !keys) {
        return serverConfig;
    }

    return getSource(keys, serverConfig);
}

function ServerConfig(conf) {
    function createConfig(config, defaultConfig) {
        if (typeof config === "undefined") {
            return defaultConfig;
        }

        //ensure that the config object will contain all the necessary keys for server configuration
        for (let mandatoryKey in defaultConfig) {
            if (typeof config[mandatoryKey] === "undefined") {
                config[mandatoryKey] = defaultConfig[mandatoryKey];
            }
        }
        return __createConfigRecursively(conf, defaultConf);

        function __createConfigRecursively(config, defaultConfig) {
            for (let prop in defaultConfig) {
                if (typeof config[prop] === "object" && !Array.isArray(config[prop])) {
                    __createConfigRecursively(config[prop], defaultConfig[prop]);
                } else {
                    if (typeof config[prop] === "undefined") {
                        config[prop] = defaultConfig[prop];
                        __createConfigRecursively(config[prop], defaultConfig[prop]);
                    }
                }
            }
            return config;
        }
    }

    conf = createConfig(conf, defaultConf);
    conf.defaultEndpoints = defaultConf.activeEndpoints;
    return conf;
}

function getSource(arrayKeys, source) {
    if (!arrayKeys.length || source === undefined) {
        return source;
    }

    return getSource(arrayKeys, source[arrayKeys.shift()]);
}

module.exports = { getConfig }

},{"./default":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/default.js","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/Notifications.js":[function(require,module,exports){
const stateStorageFileName = 'queues.json';

function NotificationsManager(workingFolderPath, storageFolderPath) {
	const queues = {};
	const queueMessageLifeTimers = {};
	const subscribers = {};
	const swarmUtils = require('swarmutils');

	this.createQueue = function (queueName, timeout, callback) {
		if (typeof timeout === 'function') {
			callback = timeout;
			timeout = 30 * 1000; //number of seconds * ms
		}

		if (typeof queues[queueName] !== "undefined") {
			return callback({ message: 'Queue already exists.', statusCode: 409 });
		}

		createQueue(queueName, timeout, (err) => {
			if (err) {
				return callback(err);
			}

			try {
				if (typeof storageFolderPath !== undefined) {
					require('fs').mkdirSync(getQueueStoragePath(queueName), { recursive: true });
				}
			} catch (err) {
				return callback(err);
			}

			return callback();
		});
	}

	function createQueue(name, timeout, callback) {
		queues[name] = new swarmUtils.Queue();
		queueMessageLifeTimers[name] = timeout;
		if (callback) {
			saveState(callback);
		}
	}

	function getQueueStoragePath(queueName) {
		let path = swarmUtils.path;
		return path.join(storageFolderPath, queueName);
	}

	function deliverMessage(subs, message, callback) {
		let counter = 0;
		while (subs.length > 0) {
			let sub = subs.pop();
			try {
				sub(undefined, message);
				counter++;
			} catch (err) {
				//we should not get any errors here but lets log it
				console.log('We weren\'t expecting for this', err);
			}
		}
		callback(undefined, counter);
	}

	function storeMessage(queueName, message, callback) {
		let path = swarmUtils.path;
		let fileName = path.join(getQueueStoragePath(queueName), new Date().getTime());
		require('fs').writeFile(fileName, message, (err) => {
			if (err) {
				return callback(err);
			}
			return callback(undefined, fileName);
		});
	}

	function buildNotification(message, timestamp, filename) {
		return { filename, message, timeout: undefined, timestamp: timestamp ? timestamp : new Date().getTime() };
	}

	function addMessageToQueue(queueName, message, callback) {
		const notificationObject = buildNotification(message);
		const notificationLifeTimer = queueMessageLifeTimers[queueName];

		if(typeof queues[queueName] === "undefined"){
			return callback(new Error(`There is no queue called ${queueName}`));
		}

		queues[queueName].push(notificationObject);
		
		if (typeof storageFolderPath) {
			notificationObject.timeout = setTimeout(function () {
				//maybe we don't need to do this ... bur for safety reasons...
				for (let notification in queues[queueName]) {
					if (notification === notificationObject) {
						return;
					}
				}

				return storeMessage(queueName, message, (err, fileName) => {
					if (fileName) {
						notificationObject.filename = fileName;
					}
					callback(err);
				});
			}, notificationLifeTimer);
		}
	}

	this.sendMessage = function (queueName, message, callback) {
		let subs = subscribers[queueName];
		console.log('sub',queueName, subscribers[queueName])
		if (typeof subs !== 'undefined' && subs.length > 0) {
			return deliverMessage(subs, message, callback);
		}
		
		return addMessageToQueue(queueName, message, callback);
	}

	this.readMessage = function (queueName, callback) {
		if (typeof subscribers[queueName] === 'undefined') {
			subscribers[queueName] = [];
		}
		
		const subs = subscribers[queueName];		
		subs.push(callback);
		
		const notificationObject = queues[queueName].pop();

		if (typeof notificationObject !== 'undefined' && notificationObject !== null) {
			deliverMessage(subs, notificationObject.message, (err, counter) => {
				if (counter > 0) {
					//message delivered... let's check if has a timer waiting to persist it
					if (typeof notificationObject.timeout !== 'undefined') {
						clearTimeout(notificationObject.timeout);
						return;
					}
					//message delivered... let's remove from storage if it was persisted
					if (typeof notificationObject.filename !== 'undefined') {
						try {
							require('fs').unlinkSync(notificationObject.filename);
						} catch (err) {
							console.log(err);
						}
					}
				}
			});
		}
	}

	function loadState(callback) {
		let state;

		try {
			state = require(path.join(workingFolderPath, stateStorageFileName));
		} catch (err) {
			return callback(err);
		}

		if (typeof state !== 'undefined') {
			for (let i = 0; i < state.queues.length; i++) {
				let queueName = state.queues[i];
				createQueue(queueName, state.timeouts[queueName]);
			}
		}

		callback(undefined, state);
	}

	function saveState(callback) {
		let state = {
			timeouts: queueMessageLifeTimers,
			queues: Object.keys(queues)
		}

		let fs = require('fs');
		let path = swarmUtils.path;

		fs.writeFile(path.join(workingFolderPath, stateStorageFileName), JSON.stringify(state, null, 4), callback);
	}

	this.initialize = function (callback) {
		let fs = require('fs');
		let path = swarmUtils.path;

		//if it's the first time we need to ensure that the working folder exists
		if (!fs.existsSync(workingFolderPath)) {
			fs.mkdirSync(workingFolderPath, { recursive: true });
		}

		loadState((err, state) => {
			if (typeof storageFolderPath === 'undefined') {
				return callback();
			}

			//if it's the first time we need to ensure that the storage folder exists
			if (!fs.existsSync(storageFolderPath)) {
				fs.mkdirSync(storageFolderPath, { recursive: true });
			}

			//if is our first boot using a specific folder there is no state to be loaded
			if (typeof state === 'undefined') {
				return callback();
			}

			for (let i = 0; i < state.queues.length; i++) {
				let queueName = state.queues[i];
				let queueStoragePath = path.join(storageFolderPath, queueName);
				fs.readdir(queueStoragePath, (err, messages) => {
					if (err) {
						return callback(err);
					}

					messages.sort(function (a, b) {
						return Number(a) - Number(b);
					});

					for (let i = 0; i < messages.length; i++) {
						let messageTimestamp = messages[i];
						let messageStoragePath = path.join(queueStoragePath, messageTimestamp);
						queues[queueName].push(buildNotification(fs.readFileSync(messageStoragePath), messageTimestamp, messageStoragePath));
					}
				});
			}
		});
	}
}

module.exports = {
	getManagerInstance: function (workingFolderPath, storageFolderPath, callback) {
		if (typeof storageFolderPath === 'function') {
			callback = storageFolderPath;
			storageFolderPath = undefined;
		}

		let manager = new NotificationsManager(workingFolderPath, storageFolderPath);
		manager.initialize((err) => {
			callback(err, manager);
		});
	}
};

},{"fs":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/TokenBucket.js":[function(require,module,exports){
/**
 * An implementation of the Token bucket algorithm
 * @param startTokens - maximum number of tokens possible to obtain and the default starting value
 * @param tokenValuePerTime - number of tokens given back for each "unitOfTime"
 * @param unitOfTime - for each "unitOfTime" (in milliseconds) passed "tokenValuePerTime" amount of tokens will be given back
 * @constructor
 */
const config = require('./../config');

function TokenBucket(startTokens = config.getConfig('tokenBucket', 'startTokens'),
    tokenValuePerTime = config.getConfig('tokenBucket', 'tokenValuePerTime'),
    unitOfTime = config.getConfig('tokenBucket', 'unitOfTime')) {

    if (typeof startTokens !== 'number' || typeof tokenValuePerTime !== 'number' || typeof unitOfTime !== 'number') {
        throw new Error('All parameters must be of type number');
    }

    if (isNaN(startTokens) || isNaN(tokenValuePerTime) || isNaN(unitOfTime)) {
        throw new Error('All parameters must not be NaN');
    }

    if (startTokens <= 0 || tokenValuePerTime <= 0 || unitOfTime <= 0) {
        throw new Error('All parameters must be bigger than 0');
    }

    TokenBucket.prototype.COST_LOW = config.getConfig('tokenBucket', 'cost', 'low');  // equivalent to 10op/s with default values
    TokenBucket.prototype.COST_MEDIUM = config.getConfig('tokenBucket', 'cost', 'medium'); // equivalent to 1op/s with default values
    TokenBucket.prototype.COST_HIGH = config.getConfig('tokenBucket', 'cost', 'high'); // equivalent to 12op/minute with default values

    TokenBucket.ERROR_LIMIT_EXCEEDED = config.getConfig('tokenBucket', 'error', 'limitExceeded');
    TokenBucket.ERROR_BAD_ARGUMENT = config.getConfig('tokenBucket', 'error', 'badArgument');

    const limits = {};

    function takeToken(userKey, cost, callback = () => { }) {
        if (typeof cost !== 'number' || isNaN(cost) || cost <= 0 || cost === Infinity) {
            callback(TokenBucket.ERROR_BAD_ARGUMENT);
            return;
        }

        const userBucket = limits[userKey];

        if (userBucket) {
            userBucket.tokens += calculateReturnTokens(userBucket.timestamp);
            userBucket.tokens -= cost;

            userBucket.timestamp = Date.now();

            if (userBucket.tokens < 0) {
                userBucket.tokens = 0;
                callback(TokenBucket.ERROR_LIMIT_EXCEEDED, 0);
                return;
            }

            return callback(undefined, userBucket.tokens);
        } else {
            limits[userKey] = new Limit(startTokens, Date.now());
            takeToken(userKey, cost, callback);
        }
    }

    function getLimitByCost(cost) {
        if (startTokens === 0 || cost === 0) {
            return 0;
        }

        return Math.floor(startTokens / cost);
    }

    function getRemainingTokenByCost(tokens, cost) {
        if (tokens === 0 || cost === 0) {
            return 0;
        }

        return Math.floor(tokens / cost);
    }

    function Limit(maximumTokens, timestamp) {
        this.tokens = maximumTokens;
        this.timestamp = timestamp;

        const self = this;

        return {
            set tokens(numberOfTokens) {
                if (numberOfTokens < 0) {
                    numberOfTokens = -1;
                }

                if (numberOfTokens > maximumTokens) {
                    numberOfTokens = maximumTokens;
                }

                self.tokens = numberOfTokens;
            },
            get tokens() {
                return self.tokens;
            },
            timestamp
        };
    }


    function calculateReturnTokens(timestamp) {
        const currentTime = Date.now();

        const elapsedTime = Math.floor((currentTime - timestamp) / unitOfTime);

        return elapsedTime * tokenValuePerTime;
    }

    this.takeToken = takeToken;
    this.getLimitByCost = getLimitByCost;
    this.getRemainingTokenByCost = getRemainingTokenByCost;
}

module.exports = TokenBucket;

},{"./../config":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/http-wrapper/src/classes/Client.js":[function(require,module,exports){
(function (Buffer){(function (){
const http = require('http');
const url = require('url');
const stream = require('stream');

/**
 * Wraps a request and augments it with a "do" method to modify it in a "fluent builder" style
 * @param {string} url
 * @param {*} body
 * @constructor
 */
function Request(url, body) {
    this.request = {
        options: url,
        body
    };

    this.do = function (modifier) {
        modifier(this.request);
        return this;
    };

    this.getHttpRequest = function () {
        return this.request;
    };
}


/**
 * Modifies request.options to contain the url parsed instead of as string
 * @param {Object} request - Object that contains options and body
 */
function urlToOptions(request) {
    const parsedUrl = url.parse(request.options);

    // TODO: movie headers declaration from here
    request.options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        headers: {}
    };
}


/**
 * Transforms the request.body in a type that can be sent through network if it is needed
 * @param {Object} request - Object that contains options and body
 */
function serializeBody(request) {
    if (!request.body) {
        return;
    }

    const handler = {
        get: function (target, name) {
            return name in target ? target[name] : (data) => data;
        }
    };

    const bodySerializationMapping = new Proxy({
        'Object': (data) => JSON.stringify(data),
    }, handler);

    request.body = bodySerializationMapping[request.body.constructor.name](request.body);
}

/**
 *
 * @param {Object} request - Object that contains options and body
 */
function bodyContentLength(request) {
    if (!request.body) {
        return;
    }

    if (request.body.constructor.name in [ 'String', 'Buffer', 'ArrayBuffer' ]) {
        request.options.headers['Content-Length'] = Buffer.byteLength(request.body);
    }
}


function Client() {
    /**
     *
     * @param {Request} customRequest
     * @param modifiers - array of functions that modify the request
     * @returns {Object} - with url and body properties
     */
    function request(customRequest, modifiers) {
        for (let i = 0; i < modifiers.length; ++i) {
            customRequest.do(modifiers[i]);
        }

        return customRequest.getHttpRequest();
    }

    function getReq(url, config, callback) {
        const modifiers = [
            urlToOptions,
            (request) => {request.options.headers = config.headers || {};}
        ];

        const packedRequest = request(new Request(url, config.body), modifiers);
        const httpRequest = http.request(packedRequest.options, callback);
        httpRequest.end();

        return httpRequest;
    }

    function postReq(url, config, callback) {
        const modifiers = [
            urlToOptions,
            (request) => {request.options.method = 'POST'; },
            (request) => {request.options.headers = config.headers || {}; },
            serializeBody,
            bodyContentLength
        ];

        const packedRequest = request(new Request(url, config.body), modifiers);
        const httpRequest = http.request(packedRequest.options, callback);

        if (config.body instanceof stream.Readable) {
            config.body.pipe(httpRequest);
        }
        else {
            httpRequest.end(packedRequest.body, config.encoding || 'utf8');
        }
        return httpRequest;
    }

    function deleteReq(url, config, callback) {
        const modifiers = [
            urlToOptions,
            (request) => {request.options.method = 'DELETE';},
            (request) => {request.options.headers = config.headers || {};},
        ];

        const packedRequest = request(new Request(url, config.body), modifiers);
        const httpRequest = http.request(packedRequest.options, callback);
        httpRequest.end();

        return httpRequest;
    }

    this.get = getReq;
    this.post = postReq;
    this.delete = deleteReq;
}

/**
 * Swap third and second parameter if only two are provided and converts arguments to array
 * @param {Object} params
 * @returns {Array} - arguments as array
 */
function parametersPreProcessing(params) {
    const res = [];

    if (typeof params[0] !== 'string') {
        throw new Error('First parameter must be a string (url)');
    }

    const parsedUrl = url.parse(params[0]);

    if (!parsedUrl.hostname) {
        throw new Error('First argument (url) is not valid');
    }

    if (params.length >= 3) {
        if (typeof params[1] !== 'object' || !params[1]) {
            throw new Error('When 3 parameters are provided the second parameter must be a not null object');
        }

        if (typeof params[2] !== 'function') {
            throw new Error('When 3 parameters are provided the third parameter must be a function');
        }
    }

    if (params.length === 2) {
        if (typeof params[1] !== 'function') {
            throw new Error('When 2 parameters are provided the second one must be a function');
        }

        params[2] = params[1];
        params[1] = {};
    }

    const properties = Object.keys(params);
    for(let i = 0, len = properties.length; i < len; ++i) {
        res.push(params[properties[i]]);
    }

    return res;
}

const handler = {
    get(target, propName) {
        if (!target[propName]) {
            console.log(propName, "Not implemented!");
        } else {
            return function () {
                const args = parametersPreProcessing(arguments);
                return target[propName].apply(target, args);
            };
        }
    }
};

module.exports = function () {
    return new Proxy(new Client(), handler);
};
}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false,"http":false,"stream":false,"url":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/http-wrapper/src/classes/MiddlewareRegistry.js":[function(require,module,exports){
const querystring = require('querystring');

function matchUrl(pattern, url) {
	const result = {
		match: true,
		params: {},
		query: {}
	};

	const queryParametersStartIndex = url.indexOf('?');
	if(queryParametersStartIndex !== -1) {
		const urlQueryString = url.substr(queryParametersStartIndex + 1); // + 1 to ignore the '?'
		result.query = querystring.parse(urlQueryString);
		url = url.substr(0, queryParametersStartIndex);
	}

    const patternTokens = pattern.split('/');
    const urlTokens = url.split('/');

    if(urlTokens[urlTokens.length - 1] === '') {
        urlTokens.pop();
    }

    if (patternTokens.length !== urlTokens.length) {
        result.match = false;
    }

    if(patternTokens[patternTokens.length - 1] === '*') {
        result.match = true;
        patternTokens.pop();
    }

    for (let i = 0; i < patternTokens.length && result.match; ++i) {
        if (patternTokens[i].startsWith(':')) {
            result.params[patternTokens[i].substring(1)] = urlTokens[i];
        } else if (patternTokens[i] !== urlTokens[i]) {
            result.match = false;
        }
    }

    return result;
}

function isTruthy(value) {
    return !!value;

}

function methodMatch(pattern, method) {
    if (!pattern || !method) {
        return true;
    }

    return pattern === method;
}

function MiddlewareRegistry() {
    const registeredMiddlewareFunctions = [];

    function use(method, url, fn) {
        method = method ? method.toLowerCase() : undefined;
        registeredMiddlewareFunctions.push({method, url, fn});
    }

    this.use = function (...params) {
	    let args = [ undefined, undefined, undefined ];

	    switch (params.length) {
            case 0:
				throw Error('Use method needs at least one argument.');
				
            case 1:
                if (typeof params[0] !== 'function') {
                    throw Error('If only one argument is provided it must be a function');
                }

                args[2] = params[0];

                break;
            case 2:
                if (typeof params[0] !== 'string' || typeof params[1] !== 'function') {
                    throw Error('If two arguments are provided the first one must be a string (url) and the second a function');
                }

                args[1]=params[0];
                args[2]=params[1];

                break;
            default:
                if (typeof params[0] !== 'string' || typeof params[1] !== 'string' || typeof params[2] !== 'function') {
                    throw Error('If three or more arguments are provided the first one must be a string (HTTP verb), the second a string (url) and the third a function');
                }

                if (!([ 'get', 'post', 'put', 'delete', 'patch', 'head', 'connect', 'options', 'trace' ].includes(params[0].toLowerCase()))) {
                    throw new Error('If three or more arguments are provided the first one must be a HTTP verb but none could be matched');
                }

                args = params;

                break;
        }

        use.apply(this, args);
    };


    /**
     * Starts execution from the first registered middleware function
     * @param {Object} req
     * @param {Object} res
     */
    this.go = function go(req, res) {
        execute(0, req.method.toLowerCase(), req.url, req, res);
    };

    /**
     * Executes a middleware if it passes the method and url validation and calls the next one when necessary
     * @param index
     * @param method
     * @param url
     * @param params
     */
    function execute(index, method, url, ...params) {
        if (!registeredMiddlewareFunctions[index]) {
            if(index===0){
                console.error("No handlers registered yet!");
            }
            return;
        }

	    const registeredMethod = registeredMiddlewareFunctions[index].method;
	    const registeredUrl = registeredMiddlewareFunctions[index].url;
	    const fn = registeredMiddlewareFunctions[index].fn;

	    if (!methodMatch(registeredMethod, method)) {
            execute(++index, method, url, ...params);
            return;
        }

        if (isTruthy(registeredUrl)) {
            const urlMatch = matchUrl(registeredUrl, url);

            if (!urlMatch.match) {
                execute(++index, method, url, ...params);
                return;
            }

            if (params[0]) {
                params[0].params = urlMatch.params;
                params[0].query  = urlMatch.query;
            }
        }

        let counter = 0;

        fn(...params, (err) => {
            counter++;
            if (counter > 1) {
                console.warn('You called next multiple times, only the first one will be executed');
                return;
            }

            if (err) {
                console.error(err);
                return;
            }

            execute(++index, method, url, ...params);
        });
    }
}

module.exports = MiddlewareRegistry;

},{"querystring":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/http-wrapper/src/classes/Router.js":[function(require,module,exports){
function Router(server) {
    this.use = function use(url, callback) {
        callback(serverWrapper(url, server));
    };
}

function serverWrapper(baseUrl, server) {
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    }

    return {
        use(url, reqResolver) {
            server.use(baseUrl + url, reqResolver);
        },
        get(url, reqResolver) {
            server.get(baseUrl + url, reqResolver);
        },
        post(url, reqResolver) {
            server.post(baseUrl + url, reqResolver);
        },
        put(url, reqResolver) {
            server.put(baseUrl + url, reqResolver);
        },
        delete(url, reqResolver) {
            server.delete(baseUrl + url, reqResolver);
        },
        options(url, reqResolver) {
            server.options(baseUrl + url, reqResolver);
        }
    };
}

module.exports = Router;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/http-wrapper/src/classes/Server.js":[function(require,module,exports){
(function (Buffer){(function (){
const MiddlewareRegistry = require('./MiddlewareRegistry');
const http = require('http');
const https = require('https');


function Server(sslOptions) {
    const middleware = new MiddlewareRegistry();
    const server = _initServer(sslOptions);


    this.use = function use(url, callback) {
        //TODO: find a better way
        if (arguments.length >= 2) {
            middleware.use(url, callback);
        } else if (arguments.length === 1) {
            callback = url;
            middleware.use(callback);
        }

    };


    this.get = function getReq(reqUrl, reqResolver) {
        middleware.use("GET", reqUrl, reqResolver);
    };

    this.post = function postReq(reqUrl, reqResolver) {
        middleware.use("POST", reqUrl, reqResolver);
    };

    this.put = function putReq(reqUrl, reqResolver) {
        middleware.use("PUT", reqUrl, reqResolver);
    };

    this.delete = function deleteReq(reqUrl, reqResolver) {
        middleware.use("DELETE", reqUrl, reqResolver);
    };

    this.options = function optionsReq(reqUrl, reqResolver) {
        middleware.use("OPTIONS", reqUrl, reqResolver);
    };
    this.makeLocalRequest = function (method,path, body,headers, callback)
    {
        if (typeof headers === "function")
        {
            callback = headers;
            headers = undefined;
        }

        if (typeof body === "function")
        {
            callback = body;
            headers = undefined;
            body = undefined;
        }

        const protocol =  require(this.protocol);
        const options = {
            hostname : 'localhost',
            port : server.address().port,
            path,
            method,
            headers
        };
        const req = protocol.request(options, response => {

            if (response.statusCode < 200 || response.statusCode >= 300) {

                return callback(new Error("Failed to execute command. StatusCode " + response.statusCode));
            }
            let data = [];
            response.on('data', chunk => {
                data.push(chunk);
            });

            response.on('end', () => {
                try {
                    const bodyContent = Buffer.concat(data).toString();
                    console.log('resolve will be called. bodyContent received : ', bodyContent);
                    return callback(undefined,bodyContent);
                } catch (err) {
                    return callback(err);
                }
            });
        });

        req.on('error', err => {
            console.log("reject will be called. err :", err);
            return callback(err);
        });

        req.write(body);
        req.end();
    };

    /* INTERNAL METHODS */

    function _initServer(sslConfig) {
        let server;
        if (sslConfig) {
             server = https.createServer(sslConfig, middleware.go);
             server.protocol = "https";
        } else {
            server = http.createServer(middleware.go);
            server.protocol = "http";
        }

        return server;
    }

    return new Proxy(this, {
       get(target, prop, receiver) {
           if(typeof target[prop] !== "undefined") {
               return target[prop];
           }

           if(typeof server[prop] === "function") {
               return function(...args) {
                   server[prop](...args);
               }
           } else {
               return server[prop];
           }
       }
    });
}

module.exports = Server;
}).call(this)}).call(this,require("buffer").Buffer)

},{"./MiddlewareRegistry":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/http-wrapper/src/classes/MiddlewareRegistry.js","buffer":false,"http":false,"https":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/http-wrapper/src/httpUtils.js":[function(require,module,exports){
const fs = require('fs');
const path = require("swarmutils").path;

function setDataHandler(request, callback) {
    let bodyContent = '';

    request.on('data', function (dataChunk) {
        bodyContent += dataChunk;
    });

    request.on('end', function () {
        callback(undefined, bodyContent);
    });

    request.on('error', callback);
}

function setDataHandlerMiddleware(request, response, next) {
    if (request.headers['content-type'] !== 'application/octet-stream') {
        setDataHandler(request, function (error, bodyContent) {
            request.body = bodyContent;
            next(error);
        });
    } else {
        return next();
    }
}

function sendErrorResponse(error, response, statusCode) {
    console.error(error);
    response.statusCode = statusCode;
    response.end();
}

function bodyParser(req, res, next) {
    let bodyContent = '';

    req.on('data', function (dataChunk) {
        bodyContent += dataChunk;
    });

    req.on('end', function () {
        req.body = bodyContent;
        next();
    });

    req.on('error', function (err) {
        next(err);
    });
}

function serveStaticFile(baseFolder, ignorePath) {
    return function (req, res) {
        const url = req.url.substring(ignorePath.length);
        const filePath = path.join(baseFolder, url);
        fs.stat(filePath, (err) => {
            if (err) {
                res.statusCode = 404;
                res.end();
                return;
            }

            if (url.endsWith('.html')) {
                res.contentType = 'text/html';
            } else if (url.endsWith('.css')) {
                res.contentType = 'text/css';
            } else if (url.endsWith('.js')) {
                res.contentType = 'text/javascript';
            }

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);

        });
    };
}

module.exports = {setDataHandler, setDataHandlerMiddleware, sendErrorResponse, bodyParser, serveStaticFile};

},{"fs":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/http-wrapper/src/index.js":[function(require,module,exports){
const Client = require('./classes/Client');
const Server = require('./classes/Server');
const httpUtils = require('./httpUtils');
const Router = require('./classes/Router');

module.exports = {Server, Client, httpUtils, Router};


},{"./classes/Client":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/http-wrapper/src/classes/Client.js","./classes/Router":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/http-wrapper/src/classes/Router.js","./classes/Server":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/http-wrapper/src/classes/Server.js","./httpUtils":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/http-wrapper/src/httpUtils.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/index.js":[function(require,module,exports){
module.exports.streams = require("./streams");
module.exports.requests = require("./requests");
module.exports.responseWrapper = require("./responseWrapper");
module.exports.getMimeTypeFromExtension = require("./mimeType");
},{"./mimeType":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/mimeType.js","./requests":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/requests.js","./responseWrapper":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/responseWrapper.js","./streams":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/streams.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/middlewares/index.js":[function(require,module,exports){
const responseWrapper = require('../responseWrapper');

function requestBodyJSONMiddleware(request, response, next) {
    /**
     * Prepare headers for response
     */
    response.setHeader('Content-Type', 'application/json');

    const data = [];

    request.on('data', (chunk) => {
        data.push(chunk);
    });

    request.on('end', () => {
        request.body = data.length ? JSON.parse(data) : {};
        next();
    });
}

function responseModifierMiddleware(request, response, next) {
    if (!response.hasOwnProperty('send')) {
        response.send = function (statusCode, body, callback = response.end) {
            response.statusCode = statusCode;

            if (body) {
                response.write(responseWrapper(body));
            }

            callback.call(response);
            // callback();
        };
    }

    next();
}

function headersMiddleware(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, X-Content-Length');
    next();
}

module.exports = { requestBodyJSONMiddleware, responseModifierMiddleware, headersMiddleware };
},{"../responseWrapper":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/responseWrapper.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/mimeType.js":[function(require,module,exports){
const extensionsMimeTypes = {
    "aac": {
        name: "audio/aac",
        binary: true
    },
    "abw": {
        name: "application/x-abiword",
        binary: true
    },
    "arc": {
        name: "application/x-freearc",
        binary: true
    },
    "avi": {
        name: "video/x-msvideo",
        binary: true
    },
    "azw": {
        name: "application/vnd.amazon.ebook",
        binary: true
    },
    "bin": {
        name: "application/octet-stream",
        binary: true
    }, "bmp": {
        name: "image/bmp",
        binary: true
    }, "bz": {
        name: "application/x-bzip",
        binary: true
    }, "bz2": {
        name: "application/x-bzip2",
        binary: true
    }, "csh": {
        name: "application/x-csh",
        binary: false
    }, "css": {
        name: "text/css",
        binary: false
    }, "csv": {
        name: "text/csv",
        binary: false
    }, "doc": {
        name: "application/msword",
        binary: true
    }, "docx": {
        name: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        binary: true
    }, "eot": {
        name: "application/vnd.ms-fontobject",
        binary: true
    }, "epub": {
        name: "application/epub+zip",
        binary: true
    }, "gz": {
        name: "application/gzip",
        binary: true
    }, "gif": {
        name: "image/gif",
        binary: true
    }, "htm": {
        name: "text/html",
        binary: false
    }, "html": {
        name: "text/html",
        binary: false
    }, "ico": {
        name: "image/vnd.microsoft.icon",
        binary: true
    }, "ics": {
        name: "text/calendar",
        binary: false
    }, "jpeg": {
        name: "image/jpeg",
        binary: true
    }, "jpg": {
        name: "image/jpeg",
        binary: true
    }, "js": {
        name: "text/javascript",
        binary: false
    }, "json": {
        name: "application/json",
        binary: false
    }, "jsonld": {
        name: "application/ld+json",
        binary: false
    }, "mid": {
        name: "audio/midi",
        binary: true
    }, "midi": {
        name: "audio/midi",
        binary: true
    }, "mjs": {
        name: "text/javascript",
        binary: false
    }, "mp3": {
        name: "audio/mpeg",
        binary: true
    }, "mpeg": {
        name: "video/mpeg",
        binary: true
    }, "mpkg": {
        name: "application/vnd.apple.installer+xm",
        binary: true
    }, "odp": {
        name: "application/vnd.oasis.opendocument.presentation",
        binary: true
    }, "ods": {
        name: "application/vnd.oasis.opendocument.spreadsheet",
        binary: true
    }, "odt": {
        name: "application/vnd.oasis.opendocument.text",
        binary: true
    }, "oga": {
        name: "audio/ogg",
        binary: true
    },
    "ogv": {
        name: "video/ogg",
        binary: true
    },
    "ogx": {
        name: "application/ogg",
        binary: true
    },
    "opus": {
        name: "audio/opus",
        binary: true
    },
    "otf": {
        name: "font/otf",
        binary: true
    },
    "png": {
        name: "image/png",
        binary: true
    },
    "pdf": {
        name: "application/pdf",
        binary: true
    },
    "php": {
        name: "application/php",
        binary: false
    },
    "ppt": {
        name: "application/vnd.ms-powerpoint",
        binary: true
    },
    "pptx": {
        name: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        binary: true
    },
    "rtf": {
        name: "application/rtf",
        binary: true
    },
    "sh": {
        name: "application/x-sh",
        binary: false
    },
    "svg": {
        name: "image/svg+xml",
        binary: false
    },
    "swf": {
        name: "application/x-shockwave-flash",
        binary: true
    },
    "tar": {
        name: "application/x-tar",
        binary: true
    },
    "tif": {
        name: "image/tiff",
        binary: true
    },
    "tiff": {
        name: "image/tiff",
        binary: true
    },
    "ts": {
        name: "video/mp2t",
        binary: true
    },
    "ttf": {
        name: "font/ttf",
        binary: true
    },
    "txt": {
        name: "text/plain",
        binary: false
    },
    "vsd": {
        name: "application/vnd.visio",
        binary: true
    },
    "wav": {
        name: "audio/wav",
        binary: true
    },
    "weba": {
        name: "audio/webm",
        binary: true
    },
    "webm": {
        name: "video/webm",
        binary: true
    },
    "webp": {
        name: "image/webp",
        binary: true
    },
    "woff": {
        name: "font/woff",
        binary: true
    },
    "woff2": {
        name: "font/woff2",
        binary: true
    },
    "xhtml": {
        name: "application/xhtml+xml",
        binary: false
    },
    "xls": {
        name: "application/vnd.ms-excel",
        binary: true
    },
    "xlsx": {
        name: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        binary: true
    },
    "xml": {
        name: "text/xml",
        binary: false
    },
    "xul": {
        name: "application/vnd.mozilla.xul+xml",
        binary: true
    },
    "zip": {
        name: "application/zip",
        binary: true
    },
    "3gp": {
        name: "video/3gpp",
        binary: true
    },
    "3g2": {
        name: "video/3gpp2",
        binary: true
    },
    "7z": {
        name: "application/x-7z-compressed",
        binary: true
    }
};

const defaultMimeType = {
    name: "text/plain",
    binary: false
};
module.exports = function (extension) {
    if (typeof extensionsMimeTypes[extension] !== "undefined") {
        return extensionsMimeTypes[extension];
    }
    return defaultMimeType;
};
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/requests.js":[function(require,module,exports){
(function (Buffer){(function (){

const http = require("http");
const https = require("https");

function makeRequest(url, method = 'GET', requestData, requestOptions = {}) {
    return new Promise((resolve, reject) => {
        const myURL = new URL(url);

        const options = {
            hostname: myURL.hostname,
            path: myURL.pathname,
            protocol: myURL.protocol,
            port: myURL.port,
            method: method,
            headers: getHeaders(requestData, requestOptions.headers)
        };

        const request = (options.protocol === 'https:' ? https : http).request(options, (response) => {
            let data = [];

            response.on('data', (chunk) => {
                data.push(chunk);
            });

            response.on('end', () => {
                const stringData = Buffer.concat(data).toString();

                return resolve({
                    statusCode: response.statusCode,
                    body: isJSON(stringData) ? JSON.parse(stringData) : stringData
                });
            });
        }).on("error", (err) => {
            return reject({
                statusCode: err.statusCode,
                body: err.message || 'Internal error'
            });
        });

        if ((method === 'POST' || method === 'PUT') && requestData) {
            request.write(typeof requestData === 'object' ? JSON.stringify(requestData) : requestData);
        }

        request.end();
    })
}

function isJSON(data) {
    try {
        JSON.parse(data)
    } catch {
        return false;
    }

    return true;
}

function getHeaders(data, headers) {
    const dataString = data ? JSON.stringify(data) : null;
    return Object.assign({}, { 'Content-Type': 'application/json' }, dataString ? { 'Content-Length': dataString.length } : null, headers);
};

module.exports = makeRequest;

}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false,"http":false,"https":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/responseWrapper.js":[function(require,module,exports){

function responseWrapper(body) {
    if (typeof body === 'string') {
        return JSON.stringify({ message: body });
    }

    return JSON.stringify(body);
}

module.exports = responseWrapper;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/utils/streams.js":[function(require,module,exports){
(function (Buffer){(function (){
function readStringFromStream(stream, callback){
    let data = "";
    stream.on("data", (messagePart)=>{
        data += messagePart;
    });

    stream.on("end", ()=>{
        callback(null, data);
    });

    stream.on("error", (err)=>{
        callback(err);
    });
}

function readMessageBufferFromHTTPStream(reqORres, callback) {
    const contentType = reqORres.headers['content-type'];

    if (contentType === 'application/octet-stream') {
        const contentLength = Number.parseInt(reqORres.headers['content-length'], 10);

        if (Number.isNaN(contentLength)) {
            return callback(new Error("Wrong content length header received!"));
        }

        streamToBuffer(reqORres, contentLength, (err, bodyAsBuffer) => {
            if (err) {
                return callback(err);
            }
            callback(undefined, bodyAsBuffer);
        });
    } else {
        callback(new Error("Wrong message format received!"));
    }

    function streamToBuffer(stream, bufferSize, callback) {
        const buffer = Buffer.alloc(bufferSize);
        let currentOffset = 0;

        stream.on('data', function (chunk) {
            const chunkSize = chunk.length;
            const nextOffset = chunkSize + currentOffset;

            if (currentOffset > bufferSize - 1) {
                stream.close();
                return callback(new Error('Stream is bigger than reported size'));
            }

            write2Buffer(buffer, chunk, currentOffset);
            currentOffset = nextOffset;
            

        });
        stream.on('end', function () {
            callback(undefined, buffer);
        });
        stream.on('error', callback);
    }

    function write2Buffer(buffer, dataToAppend, offset) {
        const dataSize = dataToAppend.length;

        for (let i = 0; i < dataSize; i++) {
            buffer[offset++] = dataToAppend[i];
        }
    }
}

module.exports = {
    readStringFromStream,
    readMessageBufferFromHTTPStream
}

}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-cache/lib/Cache.js":[function(require,module,exports){
const DEFAULT_ITEMS_LIMIT = 1000;
const DEFAULT_STORAGE_LEVELS = 3;

/**
 * @param {object} options
 * @param {Number} options.maxLevels Number of storage levels. Defaults to 3
 * @param {Number} options.limit Number of max items the cache can store per level.
 *                               Defaults to 1000
 */
function Cache(options) {
    options = options || {};
    this.limit = parseInt(options.limit, 10) || DEFAULT_ITEMS_LIMIT;
    this.maxLevels = parseInt(options.maxLevels, 10) || DEFAULT_STORAGE_LEVELS;
    this.storage = null;

    if (this.limit < 0) {
        throw new Error('Limit must be a positive number');
    }
    if (this.maxLevels < 1) {
        throw new Error('Cache needs at least one storage level');
    }


    /**
     * Create an array of Map objects for storing items
     *
     * @param {Number} maxLevels
     * @return {Array.<Map>}
     */
    this.createStorage = function (maxLevels) {
        const storage = [];
        for (let i = 0; i < maxLevels; i++) {
            storage.push(new Map());
        }

        return storage;
    }

    this.storage = this.createStorage(this.maxLevels);

    /**
     * @param {*} key
     * @param {*} value
     */
    this.set = function (key, value) {
        if (this.cacheIsFull()) {
            this.makeRoom();
        }

        this.storage[0].set(key, value);
    }

    /**
     * @param {*} key
     * @return {Boolean}
     */
    this.has = function (key) {
        for (let i = 0; i < this.storage.length; i++) {
            if (this.storage[i].has(key)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param {*} key
     * @return {*}
     */
    this.get = function (key) {
        if (this.storage[0].has(key)) {
            return this.storage[0].get(key);
        }

        return this.getFromLowerLevels(key);
    }

    /**
     * Get an item from the lower levels.
     * If one is found added it to the first level as well
     *
     * @param {*} key
     * @return {*}
     */
    this.getFromLowerLevels = function (key) {
        for (let i = 1; i < this.storage.length; i++) {
            const storageLevel = this.storage[i];
            if (!storageLevel.has(key)) {
                continue;
            }
            const value = storageLevel.get(key);
            this.set(key, value);
            return value;
        }
    }

    /**
     * @return {Boolean}
     */
    this.cacheIsFull = function () {
        return this.storage[0].size >= this.limit;
    }

    /**
     * Move all the items down by one level
     * and clear the first one to make room for new items
     */
    this.makeRoom = function () {
        for (let i = this.storage.length - 1; i > 0; i--) {
            this.storage[i] = this.storage[i - 1];
        }
        this.storage[0] = new Map();
    }
}

module.exports = Cache;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-abstract-client.js":[function(require,module,exports){
/**********************  utility class **********************************/
function RequestManager(pollingTimeOut) {
    if (!pollingTimeOut) {
        pollingTimeOut = 1000; //1 second by default
    }

    const self = this;

    function Request(endPoint, initialSwarm, delayedStart) {
        let onReturnCallbacks = [];
        let onErrorCallbacks = [];
        let onCallbacks = [];
        const requestId = initialSwarm ? initialSwarm.meta.requestId : "weneedarequestid";
        initialSwarm = null;

        this.getRequestId = function () {
            return requestId;
        };

        this.on = function (phaseName, callback) {
            if (typeof phaseName != "string" && typeof callback != "function") {
                throw new Error("The first parameter should be a string and the second parameter should be a function");
            }

            onCallbacks.push({
                callback: callback,
                phase: phaseName
            });

            if (typeof delayedStart === "undefined") {
                self.poll(endPoint, this);
            }

            return this;
        };

        this.onReturn = function (callback) {
            onReturnCallbacks.push(callback);
            if (typeof delayedStart === "undefined") {
                self.poll(endPoint, this);
            }
            return this;
        };

        this.onError = function (callback) {
            if (onErrorCallbacks.indexOf(callback) !== -1) {
                onErrorCallbacks.push(callback);
            } else {
                console.log("Error callback already registered!");
            }
        };

        this.start = function () {
            if (typeof delayedStart !== "undefined") {
                self.poll(endPoint, this);
            }
        };

        this.dispatch = function (err, result) {
            if (result instanceof ArrayBuffer) {
                result = SwarmPacker.unpack(result);
            }

            result = typeof result === "string" ? JSON.parse(result) : result;

            result = OwM.prototype.convert(result);
            const resultReqId = result.getMeta("requestId");
            const phaseName = result.getMeta("phaseName");
            let onReturn = false;

            if (resultReqId === requestId) {
                onReturnCallbacks.forEach(function (c) {
                    c(null, result);
                    onReturn = true;
                });
                if (onReturn) {
                    onReturnCallbacks = [];
                    onErrorCallbacks = [];
                }

                onCallbacks.forEach(function (i) {
                    //console.log("XXXXXXXX:", phaseName , i);
                    if (phaseName === i.phase || i.phase === '*') {
                        i.callback(err, result);
                    }
                });
            }

            if (onReturnCallbacks.length === 0 && onCallbacks.length === 0) {
                self.unpoll(endPoint, this);
            }
        };

        this.dispatchError = function (err) {
            for (let i = 0; i < onErrorCallbacks.length; i++) {
                const errCb = onErrorCallbacks[i];
                errCb(err);
            }
        };

        this.off = function () {
            self.unpoll(endPoint, this);
        };
    }

    this.createRequest = function (remoteEndPoint, swarm, delayedStart) {
        return new Request(remoteEndPoint, swarm, delayedStart);
    };

    /* *************************** polling zone ****************************/

    const pollSet = {};

    const activeConnections = {};

    this.poll = function (remoteEndPoint, request) {
        let requests = pollSet[remoteEndPoint];
        if (!requests) {
            requests = {};
            pollSet[remoteEndPoint] = requests;
        }
        requests[request.getRequestId()] = request;
        pollingHandler();
    };

    this.unpoll = function (remoteEndPoint, request) {
        const requests = pollSet[remoteEndPoint];
        if (requests) {
            delete requests[request.getRequestId()];
            if (Object.keys(requests).length === 0) {
                delete pollSet[remoteEndPoint];
            }
        } else {
            console.log("Unpolling wrong request:", remoteEndPoint, request);
        }
    };

    function createPollThread(remoteEndPoint) {
        function reArm() {
            $$.remote.doHttpGet(remoteEndPoint, function (err, res) {
                let requests = pollSet[remoteEndPoint];
                if (err) {
                    for (const req_id in requests) {
                        if (!requests.hasOwnProperty(req_id)) {
                            return;
                        }

                        let err_handler = requests[req_id].dispatchError;
                        if (err_handler) {
                            err_handler(err);
                        }
                    }
                    activeConnections[remoteEndPoint] = false;
                } else {

                    for (const k in requests) {
                        if (!requests.hasOwnProperty(k)) {
                            return;
                        }

                        requests[k].dispatch(null, res);
                    }

                    if (Object.keys(requests).length !== 0) {
                        reArm();
                    } else {
                        delete activeConnections[remoteEndPoint];
                        console.log("Ending polling for ", remoteEndPoint);
                    }
                }
            });
        }

        reArm();
    }

    function pollingHandler() {
        let setTimer = false;
        for (const remoteEndPoint in pollSet) {
            if (!pollSet.hasOwnProperty(remoteEndPoint)) {
                return;
            }

            if (!activeConnections[remoteEndPoint]) {
                createPollThread(remoteEndPoint);
                activeConnections[remoteEndPoint] = true;
            }
            setTimer = true;
        }
        if (setTimer) {
            setTimeout(pollingHandler, pollingTimeOut);
        }
    }

    setTimeout(pollingHandler, pollingTimeOut);
}

function urlEndWithSlash(url) {
    if (url[url.length - 1] !== "/") {
        url += "/";
    }
    return url;
}

/********************** main APIs on working with virtualMQ channels **********************************/
function HttpChannelClient(remoteEndPoint, channelName, options) {

    let clientType;
    const opts = {
        autoCreate: true,
        publicSignature: "no_signature_provided"
    };

    Object.keys(options).forEach((optName) => {
        opts[optName] = options[optName];
    });

    let channelCreated = false;
    function readyToBeUsed(){
        let res = false;

        if(clientType === HttpChannelClient.prototype.PRODUCER_CLIENT_TYPE){
            res = true;
        }
        if(clientType === HttpChannelClient.prototype.CONSUMER_CLIENT_TYPE){
            if(!options.autoCreate){
                res = true;
            }else{
                res = channelCreated;
            }
        }

        return res;
    }

    function encryptChannelName(channelName) {
        return $$.remote.base64Encode(channelName);
    }

    function CatchAll(swarmName, phaseName, callback) { //same interface as Request
        const requestId = requestsCounter++;
        this.getRequestId = function () {
            return "swarmName" + "phaseName" + requestId;
        };

        this.dispatch = function (err, result) {
            /*result = OwM.prototype.convert(result);
            const currentPhaseName = result.getMeta("phaseName");
            const currentSwarmName = result.getMeta("swarmTypeName");
            if ((currentSwarmName === swarmName || swarmName === '*') && (currentPhaseName === phaseName || phaseName === '*')) {
                return callback(err, result);
            }*/
            return callback(err, result);
        };
    }

    this.setSenderMode = function () {
        if (typeof clientType !== "undefined") {
            throw new Error(`HttpChannelClient is set as ${clientType}`);
        }
        clientType = HttpChannelClient.prototype.PRODUCER_CLIENT_TYPE;

        this.sendSwarm = function (swarmSerialization) {
            $$.remote.doHttpPost(getRemoteToSendMessage(remoteEndPoint, channelName), swarmSerialization, (err, res)=>{
                if(err){
                    console.log("Sending swarm failed", err);
                }else{
                    console.log("Swarm sent");
                }
            });
        };
    };

    this.setReceiverMode = function () {
        if (typeof clientType !== "undefined") {
            throw new Error(`HttpChannelClient is set as ${clientType}`);
        }
        clientType = HttpChannelClient.prototype.CONSUMER_CLIENT_TYPE;

        function createChannel(callback){
            if (!readyToBeUsed()) {
                $$.remote.doHttpPut(getRemoteToCreateChannel(), opts.publicSignature, (err) => {
                    if (err) {
                        if (err.statusCode !== 409) {
                            return callback(err);
                        }
                    }
                    channelCreated = true;
                    if(opts.enableForward){
                        console.log("Enabling forward");
                        $$.remote.doHttpPost(getUrlToEnableForward(), opts.publicSignature, (err, res)=>{
                            if(err){
                                console.log("Request to enable forward to zeromq failed", err);
                            }
                        });
                    }
                    return callback();
                });
            }
        }

        this.getReceiveAddress = function(){
            return getRemoteToSendMessage();
        };

        this.on = function (swarmId, swarmName, phaseName, callback) {
            const c = new CatchAll(swarmName, phaseName, callback);
            allCatchAlls.push({
                s: swarmName,
                p: phaseName,
                c: c
            });

           /* if (!readyToBeUsed()) {
                createChannel((err)=>{
                    $$.remote.requestManager.poll(getRemoteToReceiveMessage(), c);
                });
            } else {*/
                $$.remote.requestManager.poll(getRemoteToReceiveMessage(), c);
            /*}*/
        };

        this.off = function (swarmName, phaseName) {
            allCatchAlls.forEach(function (ca) {
                if ((ca.s === swarmName || swarmName === '*') && (phaseName === ca.p || phaseName === '*')) {
                    $$.remote.requestManager.unpoll(getRemoteToReceiveMessage(remoteEndPoint, domainInfo.domain), ca.c);
                }
            });
        };

        createChannel((err) => {
            if(err){
                console.log(err);
            }
        });

        $$.remote.createRequestManager();
    };

    const allCatchAlls = [];
    let requestsCounter = 0;

    this.uploadCSB = function (cryptoUid, binaryData, callback) {
        $$.remote.doHttpPost(baseOfRemoteEndPoint + "/CSB/" + cryptoUid, binaryData, callback);
    };

    this.downloadCSB = function (cryptoUid, callback) {
        $$.remote.doHttpGet(baseOfRemoteEndPoint + "/CSB/" + cryptoUid, callback);
    };

    function getRemoteToReceiveMessage() {
        return [urlEndWithSlash(remoteEndPoint), urlEndWithSlash(HttpChannelClient.prototype.RECEIVE_API_NAME), urlEndWithSlash(encryptChannelName(channelName))].join("");
    }

    function getRemoteToSendMessage() {
        return [urlEndWithSlash(remoteEndPoint), urlEndWithSlash(HttpChannelClient.prototype.SEND_API_NAME), urlEndWithSlash(encryptChannelName(channelName))].join("");
    }

    function getRemoteToCreateChannel() {
        return [urlEndWithSlash(remoteEndPoint), urlEndWithSlash(HttpChannelClient.prototype.CREATE_CHANNEL_API_NAME), urlEndWithSlash(encryptChannelName(channelName))].join("");
    }

    function getUrlToEnableForward() {
        return [urlEndWithSlash(remoteEndPoint), urlEndWithSlash(HttpChannelClient.prototype.FORWARD_CHANNEL_API_NAME), urlEndWithSlash(encryptChannelName(channelName))].join("");
    }
}

/********************** constants **********************************/
HttpChannelClient.prototype.RECEIVE_API_NAME = "receive-message";
HttpChannelClient.prototype.SEND_API_NAME = "send-message";
HttpChannelClient.prototype.CREATE_CHANNEL_API_NAME = "create-channel";
HttpChannelClient.prototype.FORWARD_CHANNEL_API_NAME = "forward-zeromq";
HttpChannelClient.prototype.PRODUCER_CLIENT_TYPE = "producer";
HttpChannelClient.prototype.CONSUMER_CLIENT_TYPE = "consumer";

/********************** initialisation stuff **********************************/
if (typeof $$ === "undefined") {
    $$ = {};
}

if (typeof $$.remote === "undefined") {
    $$.remote = {};

    function createRequestManager(timeOut) {
        const newRequestManager = new RequestManager(timeOut);
        Object.defineProperty($$.remote, "requestManager", {value: newRequestManager});
    }

    function registerHttpChannelClient(alias, remoteEndPoint, channelName, options) {
        $$.remote[alias] = new HttpChannelClient(remoteEndPoint, channelName, options);
    }

    Object.defineProperty($$.remote, "createRequestManager", {value: createRequestManager});
    Object.defineProperty($$.remote, "registerHttpChannelClient", {value: registerHttpChannelClient});

    $$.remote.doHttpPost = function (url, data, callback) {
        throw new Error("Overwrite this!");
    };

    $$.remote.doHttpPut = function (url, data, callback) {
        throw new Error("Overwrite this!");
    };

    $$.remote.doHttpGet = function doHttpGet(url, callback) {
        throw new Error("Overwrite this!");
    };

    $$.remote.base64Encode = function base64Encode(stringToEncode) {
        throw new Error("Overwrite this!");
    };

    $$.remote.base64Decode = function base64Decode(encodedString) {
        throw new Error("Overwrite this!");
    };
}


//new implementation in order to expose as much as possible APIHUB services
$$.apihub = {connections:{}};
$$.apihub.createConnection = function(alias, url, ssi){

    $$.apihub.connections[alias] = {
        //mq apis
        createMQ: function(queueName, callback){

        },
        sendMessageToQueue: function(queueName, message, callback){

        },
        receiveMessageFromQueue: function(queueName, callback){
            // integrate request manager from above in order to have long pooling mechanism enabled
        },

        //notifications apis
        subscribe: function(topic, callback){
            // integrate request manager from above in order to have long pooling mechanism enabled
        },

        unsubscribe: function(topic, callback){

        },

        publish: function(topic, message, callback){

        },

        //authentication apis
        getAuthToken: function(expiration, callback){

        },

        setQuota: function(quota, targetSSI, callback){

        },

        setTagPolicy: function(tag, requireAuthToken, callback){

        },

        addUserInTag: function(targetSSI, callback){

        },

        addAdmin: function(targetSSI, callback){

        },

        removeAdmin: function(callback){

        }

    }

    return $$.apihub.connections[alias];
}

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-browser-client.js":[function(require,module,exports){
(function (Buffer){(function (){
function generateMethodForRequestWithData(httpMethod) {
    return function (url, data, callback) {
        const xhr = new XMLHttpRequest();

        xhr.onload = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                const data = xhr.response;
                callback(undefined, data);
            } else {
                if(xhr.status>=400){
                    const error = new Error("An error occured. StatusCode: " + xhr.status);
                    callback({error: error, statusCode: xhr.status});
                } else {
                    console.log(`Status code ${xhr.status} received, response is ignored.`);
                }
            }
        };

        xhr.onerror = function (e) {
            callback(new Error("A network error occurred"));
        };

        xhr.open(httpMethod, url, true);
        //xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        if(data && data.pipe && typeof data.pipe === "function"){
            const buffers = [];
            data.on("data", function(data) {
                buffers.push(data);
            });
            data.on("end", function() {
                const actualContents = Buffer.concat(buffers);
                xhr.send(actualContents);
            });
        }
        else {
            if(data instanceof ArrayBuffer){
                data = new DataView(data);
            }

            if(ArrayBuffer.isView(data)) {
                xhr.setRequestHeader('Content-Type', 'application/octet-stream');

                /**
                 * Content-Length is an unsafe header and we cannot set it.
                 * When browser is making a request that is intercepted by a service worker,
                 * the Content-Length header is not set implicitly.
                 */
                xhr.setRequestHeader('X-Content-Length', data.byteLength);
            }
            xhr.send(data);
        }
    };
}


$$.remote.doHttpPost = generateMethodForRequestWithData('POST');

$$.remote.doHttpPut = generateMethodForRequestWithData('PUT');


$$.remote.doHttpGet = function doHttpGet(url, callback) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        //check if headers were received and if any action should be performed before receiving data
        if (xhr.readyState === 2) {
            var contentType = xhr.getResponseHeader("Content-Type");
            if (contentType === "application/octet-stream") {
                xhr.responseType = 'arraybuffer';
            }
        }
    };

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status == "200") {
            var contentType = xhr.getResponseHeader("Content-Type");
            if (contentType === "application/octet-stream") {
                let responseBuffer = this.response;

                let buffer = new Buffer(responseBuffer.byteLength);
                let view = new Uint8Array(responseBuffer);
                for (let i = 0; i < buffer.length; ++i) {
                    buffer[i] = view[i];
                }
                callback(undefined, buffer);
            }
            else{
                callback(undefined, xhr.response);
            }
        } else {
            const error = new Error("An error occurred. StatusCode: " + xhr.status);

            callback({error: error, statusCode: xhr.status});
        }
    };
    xhr.onerror = function (e) {
        callback(new Error("A network error occurred"));
    };

    xhr.open("GET", url);
    xhr.send();
};


function CryptoProvider(){

    this.generateSafeUid = function(){
        let uid = "";
        var array = new Uint32Array(10);
        window.crypto.getRandomValues(array);


        for (var i = 0; i < array.length; i++) {
            uid += array[i].toString(16);
        }

        return uid;
    };

    this.signSwarm = function(swarm, agent){
        swarm.meta.signature = agent;
    };
}



$$.remote.cryptoProvider = new CryptoProvider();

$$.remote.base64Encode = function base64Encode(stringToEncode){
    return window.btoa(stringToEncode);
};

$$.remote.base64Decode = function base64Decode(encodedString){
    return window.atob(encodedString);
};

}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-node-client.js":[function(require,module,exports){
(function (Buffer){(function (){
require("./psk-abstract-client");

const http = require("http");
const https = require("https");
const URL = require("url");
const userAgent = 'PSK NodeAgent/0.0.1';
const signatureHeaderName = process.env.vmq_signature_header_name || "x-signature";


console.log("PSK node client loading");

function getNetworkForOptions(options) {
	if(options.protocol === 'http:') {
		return http;
	} else if(options.protocol === 'https:') {
		return https;
	} else {
		throw new Error(`Can't handle protocol ${options.protocol}`);
	}

}

function generateMethodForRequestWithData(httpMethod) {
	return function (url, data, callback) {
		const innerUrl = URL.parse(url);

		const options = {
			hostname: innerUrl.hostname,
			path: innerUrl.pathname,
			port: parseInt(innerUrl.port),
			headers: {
				'User-Agent': userAgent,
				[signatureHeaderName]: 'replaceThisPlaceholderSignature'
			},
			method: httpMethod
		};

		const network = getNetworkForOptions(innerUrl);

		if (ArrayBuffer.isView(data) || Buffer.isBuffer(data) || data instanceof ArrayBuffer) {
			if (!Buffer.isBuffer(data)) {
				data = Buffer.from(data);
			}

			options.headers['Content-Type'] = 'application/octet-stream';
			options.headers['Content-Length'] = data.length;
		}

		const req = network.request(options, (res) => {
			const {statusCode} = res;

			let error;
			if (statusCode >= 400) {
				error = new Error('Request Failed.\n' +
					`Status Code: ${statusCode}\n` +
					`URL: ${options.hostname}:${options.port}${options.path}`);
			}

			if (error) {
				callback({error: error, statusCode: statusCode});
				// free up memory
				res.resume();
				return;
			}

			let rawData = '';
			res.on('data', (chunk) => {
				rawData += chunk;
			});
			res.on('end', () => {
				try {
					callback(undefined, rawData, res.headers);
				} catch (err) {
                    console.error(err);
				}finally {
					//trying to prevent getting ECONNRESET error after getting our response
					req.abort();
				}
			});
		}).on("error", (error) => {
			console.log(`[POST] ${url}`, error);
			callback(error);
		});

		if (data && data.pipe && typeof data.pipe === "function") {
			data.pipe(req);
			return;
		}

		if (typeof data !== 'string' && !Buffer.isBuffer(data) && !ArrayBuffer.isView(data)) {
			data = JSON.stringify(data);
		}

		req.write(data);
		req.end();
	};
}

$$.remote.doHttpPost = generateMethodForRequestWithData('POST');

$$.remote.doHttpPut = generateMethodForRequestWithData('PUT');

$$.remote.doHttpGet = function doHttpGet(url, callback){
    const innerUrl = URL.parse(url);

	const options = {
		hostname: innerUrl.hostname,
		path: innerUrl.pathname + (innerUrl.search || ''),
		port: parseInt(innerUrl.port),
		headers: {
			'User-Agent': userAgent,
            [signatureHeaderName]: 'someSignature'
		},
		method: 'GET'
	};

	const network = getNetworkForOptions(innerUrl);
	const req = network.request(options, (res) => {
		const { statusCode } = res;

		let error;
		if (statusCode !== 200) {
			error = new Error('Request Failed.\n' +
				`Status Code: ${statusCode}`);
			error.code = statusCode;
		}

		if (error) {
			callback({error:error, statusCode:statusCode});
			// free up memory
			res.resume();
			return
		}

		let rawData;
		const contentType = res.headers['content-type'];

		if(contentType === "application/octet-stream"){
			rawData = [];
		}else{
			rawData = '';
		}

		res.on('data', (chunk) => {
			if(Array.isArray(rawData)){
				rawData.push(...chunk);
			}else{
				rawData += chunk;
			}
		});
		res.on('end', () => {
			try {
				if(Array.isArray(rawData)){
					rawData = Buffer.from(rawData);
				}
				callback(null, rawData, res.headers);
			} catch (err) {
				console.log("Client error:", err);
			}finally {
				//trying to prevent getting ECONNRESET error after getting our response
				req.abort();
			}
		});
	});

	req.on("error", (error) => {
		if(error && error.code !== 'ECONNRESET'){
        	console.log(`[GET] ${url}`, error);
		}

		callback(error);
	});

	req.end();
};

$$.remote.base64Encode = function base64Encode(stringToEncode){
    return Buffer.from(stringToEncode).toString('base64');
};

$$.remote.base64Decode = function base64Decode(encodedString){
    return Buffer.from(encodedString, 'base64').toString('ascii');
};

}).call(this)}).call(this,require("buffer").Buffer)

},{"./psk-abstract-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-abstract-client.js","buffer":false,"http":false,"https":false,"url":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/Agent.js":[function(require,module,exports){
function Agent(agentId, publicKey){
    this.agentId = agentId;
    this.publicKey = publicKey;
}

module.exports = Agent;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/EncryptedSecret.js":[function(require,module,exports){
function EncryptedSecret(encryptedData, agentId){
    this.encryptedData = encryptedData;
    this.agentId = agentId;
}

module.exports = EncryptedSecret;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/PSKSignature.js":[function(require,module,exports){
function PSKSignature(message, signature, type, agentId) {
    this.message = message;
    this.signature = signature;
    this.type = type;
    this.agentId = agentId;
}

module.exports = PSKSignature;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/RawCSBSecurityContext.js":[function(require,module,exports){
function RawCSBSecurityContext(parentSecurityContext) {
    this.generateIdentity = parentSecurityContext.generateIdentity;
    this.getCurrentAgentIdentity = parentSecurityContext.getCurrentAgentIdentity;
    this.generateSeed = parentSecurityContext.generateRandom;
    this.getSeed = parentSecurityContext.getSecret;
    this.shareSeed = parentSecurityContext.shareSecret;
    this.sign = parentSecurityContext.sign;
    this.verify = parentSecurityContext.verify;
}

module.exports = RawCSBSecurityContext;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/RootCSBSecurityContext.js":[function(require,module,exports){
const SecurityContext = require("./SecurityContext");

function RootCSBSecurityContext() {
    const securityContext = new SecurityContext();

    this.generateIdentity = securityContext.generateIdentity;
    this.getCurrentAgentIdentity = securityContext.getCurrentAgentIdentity;
    this.generateSeed = securityContext.generateRandom;
    this.getSeed = securityContext.getSecret;
    this.shareSeed = securityContext.shareSecret;
    this.sign = securityContext.sign;
    this.verify = securityContext.verify;
}

module.exports = RootCSBSecurityContext;
},{"./SecurityContext":"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/SecurityContext.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/SecurityContext.js":[function(require,module,exports){
const crypto = require("pskcrypto");
const swarmUtils = require("swarmutils");
const PSKSignature = require("./PSKSignature");
const EncryptedSecret = require("./EncryptedSecret");
const Agent = require("./Agent");

function SecurityContext() {

    const knownAgents = []; // contains pairs (agentId, publicKey)
    const privateKeys = {};
    const signType = "sha256";

    this.generateIdentity = (callback) => {
        crypto.generateKeyPair((err, publicKey, privateKey) => {
            if (err) {
                return callback(err);
            }

            const agent = new Agent($$.uidGenerator.safe_uuid(), publicKey);
            knownAgents.push(agent);
            privateKeys[agent.agentId] = privateKey;

            return callback(undefined, agent.agentId);
        });
    };

    this.getCurrentAgentIdentity = () => {
        return knownAgents[0].agentId;
    };

    this.getSecret = (readList, callback) => {
        const encSecret = readList.find(secret => secret.agentId === this.getCurrentAgentIdentity());
        if (!encSecret) {
            return callback(Error("The current agent cannot get the secret"));
        }

        callback(undefined, crypto.privateDecrypt(privateKeys[this.getCurrentAgentIdentity()], encSecret));
    };

    this.shareSecret = (secret, list, callback) => {
        const readList = [];
        list.forEach(agentId => {
            const publicKey = getPublicKey(agentId);
            readList.push(new EncryptedSecret(crypto.publicEncrypt(publicKey, secret), agentId));
        });

        callback(undefined, readList);
    };

    this.sign = (digest, writeList, all, callback) => {
        if (typeof all === "function") {
            callback = all;
            all = false;
        }

        if (!listHasElement(writeList, this.getCurrentAgentIdentity())) {
            return callback(Error("The current agent does not have signing privileges"));
        }

        if (!all) {
            const agentId = this.getCurrentAgentIdentity();
            const signature = crypto.sign(privateKeys[agentId], digest);
            return callback(undefined, new PSKSignature(digest, signature, signType, agentId));
        }

        const pskSignatures = [];
        const taskCounter = new swarmUtils.TaskCounter(() => {
            callback(undefined, pskSignatures);
        });

        taskCounter.increment(knownAgents.length);
        knownAgents.forEach(agent => {
            if (listHasElement(writeList, agent.agentId)) {
                const signature = crypto.sign(privateKeys[agent.agentId], digest);
                pskSignatures.push(new PSKSignature(digest, signature, signType, agent.agentId));
                taskCounter.decrement();
            }else{
                taskCounter.decrement();
            }
        })
    };

    this.verify = (pskSignature) => {
        return crypto.verify(getPublicKey(pskSignature.agentId), pskSignature.signature, pskSignature.message);
    };

    this.generateRandom = (len = 32) => {
        crypto.randomBytes(len);
    };

    //----------------------------- internal functions ------------------------------
    function listHasElement(list, element) {
        return !!list.find(el => element === el);
    }

    function getPublicKey(agentId) {
        const agent = knownAgents.find(ag => ag.agentId === agentId);
        if(!agent){
            return undefined;
        }

        return agent.publicKey;
    }

}

module.exports = SecurityContext;

},{"./Agent":"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/Agent.js","./EncryptedSecret":"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/EncryptedSecret.js","./PSKSignature":"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/PSKSignature.js","pskcrypto":"pskcrypto","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/ECKeyGenerator.js":[function(require,module,exports){
const crypto = require('crypto');
const KeyEncoder = require('./keyEncoder');

function ECKeyGenerator() {

    this.generateKeyPair = (namedCurve, callback) => {
        if (typeof namedCurve === "function") {
            callback = namedCurve;
            namedCurve = 'secp256k1';
        }
        const ec = crypto.createECDH(namedCurve);
        const publicKey = ec.generateKeys();
        const privateKey = ec.getPrivateKey();
        callback(undefined, publicKey, privateKey);
    };

    this.convertKeys = (privateKey, publicKey, options) => {
        const defaultOpts = {format: 'pem', namedCurve: 'secp256k1'};
        Object.assign(defaultOpts, options);
        options = defaultOpts;

        const result = {};
        const ECPrivateKeyASN = KeyEncoder.ECPrivateKeyASN;
        const SubjectPublicKeyInfoASN = KeyEncoder.SubjectPublicKeyInfoASN;
        const keyEncoder = new KeyEncoder(options.namedCurve);

        const privateKeyObject = keyEncoder.privateKeyObject(privateKey, publicKey);
        const publicKeyObject = keyEncoder.publicKeyObject(publicKey)

        result.privateKey = ECPrivateKeyASN.encode(privateKeyObject, options.format, privateKeyObject.pemOptions);
        result.publicKey = SubjectPublicKeyInfoASN.encode(publicKeyObject, options.format, publicKeyObject.pemOptions);

        return result;
    }

    this.getPublicKey = (privateKey, namedCurve) => {
        namedCurve = namedCurve || 'secp256k1';
        const ecdh = crypto.createECDH(namedCurve);
        ecdh.setPrivateKey(privateKey);
        return ecdh.getPublicKey();
    };
}

exports.createECKeyGenerator = () => {
    return new ECKeyGenerator();
};
},{"./keyEncoder":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/keyEncoder.js","crypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/PskCrypto.js":[function(require,module,exports){
(function (Buffer){(function (){
function PskCrypto() {
    const crypto = require('crypto');
    const utils = require("./utils/cryptoUtils");
    const PskEncryption = require("./PskEncryption");
    const or = require('overwrite-require');

    this.createPskEncryption = (algorithm) => {
        return new PskEncryption(algorithm);
    };

    this.generateKeyPair = (options, callback) => {
        this.createKeyPairGenerator().generateKeyPair(options, callback);
    };

    this.createKeyPairGenerator = require("./ECKeyGenerator").createECKeyGenerator;

    this.sign = (algorithm, data, privateKey) => {
        if (typeof data === "string") {
            data = Buffer.from(data);
        }

        const sign = crypto.createSign(algorithm);
        sign.update(data);
        sign.end();
        return sign.sign(privateKey);
    };

    this.verify = (algorithm, data, publicKey, signature) => {
        if (typeof data === "string") {
            data = Buffer.from(data);
        }
        const verify = crypto.createVerify(algorithm);
        verify.update(data);
        verify.end();
        return verify.verify(publicKey, signature);
    };

    this.privateEncrypt = (privateKey, data) => {
        if (typeof data === "string") {
            data = Buffer.from(data);
        }

        return crypto.privateEncrypt(privateKey, data);
    };

    this.privateDecrypt = (privateKey, encryptedData) => {
        if (typeof encryptedData === "string") {
            encryptedData = Buffer.from(encryptedData);
        }

        return crypto.privateDecrypt(privateKey, encryptedData);
    };

    this.publicEncrypt = (publicKey, data) => {
        if (typeof data === "string") {
            data = Buffer.from(data);
        }

        return crypto.publicEncrypt(publicKey, data);
    };

    this.publicDecrypt = (publicKey, encryptedData) => {
        if (typeof encryptedData === "string") {
            encryptedData = Buffer.from(encryptedData);
        }

        return crypto.publicDecrypt(publicKey, encryptedData);
    };

    this.pskHash = function (data, encoding) {
        if (Buffer.isBuffer(data)) {
            return utils.createPskHash(data, encoding);
        }
        if (data instanceof Object) {
            return utils.createPskHash(JSON.stringify(data), encoding);
        }
        return utils.createPskHash(data, encoding);
    };

    this.hash = (algorithm, data, encoding) => {
        const hash = crypto.createHash(algorithm);
        hash.update(data);
        return hash.digest(encoding);
    };

    this.pskBase58Encode = function (data) {
        return utils.base58Encode(data);
    }

    this.pskBase58Decode = function (data) {
        return utils.base58Decode(data);
    }

    this.pskHashStream = function (readStream, callback) {
        const pskHash = new utils.PskHash();

        readStream.on('data', (chunk) => {
            pskHash.update(chunk);
        });


        readStream.on('end', () => {
            callback(null, pskHash.digest());
        })
    };

    this.generateSafeUid = function (password, additionalData) {
        password = password || Buffer.alloc(0);
        if (!additionalData) {
            additionalData = Buffer.alloc(0);
        }

        if (!Buffer.isBuffer(additionalData)) {
            additionalData = Buffer.from(additionalData);
        }

        return utils.encode(this.pskHash(Buffer.concat([password, additionalData])));
    };

    this.deriveKey = function deriveKey(algorithm, password, iterations) {
        if (arguments.length === 2) {
            if (typeof password === "number") {
                iterations = password
                password = algorithm;
                algorithm = "aes-256-gcm";
            } else {
                iterations = 1000;
            }
        }
        if (typeof password === "undefined") {
            iterations = 1000;
            password = algorithm;
            algorithm = "aes-256-gcm";
        }

        const keylen = utils.getKeyLength(algorithm);
        const salt = utils.generateSalt(password, 32);
        return crypto.pbkdf2Sync(password, salt, iterations, keylen, 'sha256');
    };


    this.randomBytes = (len) => {
        if ($$.environmentType === or.constants.BROWSER_ENVIRONMENT_TYPE) {
            let randomArray = new Uint8Array(len);

            return window.crypto.getRandomValues(randomArray);
        } else {
            return crypto.randomBytes(len);
        }
    };

    this.xorBuffers = (...args) => {
        if (args.length < 2) {
            throw Error(`The function should receive at least two arguments. Received ${args.length}`);
        }

        if (args.length === 2) {
            __xorTwoBuffers(args[0], args[1]);
            return args[1];
        }

        for (let i = 0; i < args.length - 1; i++) {
            __xorTwoBuffers(args[i], args[i + 1]);
        }

        function __xorTwoBuffers(a, b) {
            if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                throw Error("The argument type should be Buffer.");
            }

            const length = Math.min(a.length, b.length);
            for (let i = 0; i < length; i++) {
                b[i] ^= a[i];
            }

            return b;
        }

        return args[args.length - 1];
    };

    this.PskHash = utils.PskHash;
}

module.exports = new PskCrypto();



}).call(this)}).call(this,require("buffer").Buffer)

},{"./ECKeyGenerator":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/ECKeyGenerator.js","./PskEncryption":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/PskEncryption.js","./utils/cryptoUtils":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/cryptoUtils.js","buffer":false,"crypto":false,"overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/PskEncryption.js":[function(require,module,exports){
(function (Buffer){(function (){
const crypto = require("crypto");
const utils = require("./utils/cryptoUtils");

function PskEncryption(algorithm) {
    if (!algorithm) {
        throw Error("No encryption algorithm was provided");
    }

    let iv;
    let aad;
    let tag;
    let data;
    let key;

    let keylen = utils.getKeyLength(algorithm);
    let encryptionIsAuthenticated = utils.encryptionIsAuthenticated(algorithm);

    this.encrypt = (plainData, encryptionKey, options) => {
        iv = iv || crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv, options);
        if (encryptionIsAuthenticated) {
            aad = crypto.randomBytes(encryptionKey.length);
            cipher.setAAD(aad);
        }

        let encData = Buffer.concat([cipher.update(plainData), cipher.final()]);
        if (encryptionIsAuthenticated) {
            tag = cipher.getAuthTag();
        }

        if (iv) {
            encData = Buffer.concat([encData, iv]);
        }

        if (aad) {
            encData = Buffer.concat([encData, aad]);
        }

        if (tag) {
            encData = Buffer.concat([encData, tag]);
        }
        
        key = encryptionKey;
        return encData;
    };

    this.decrypt = (encryptedData, decryptionKey, authTagLength = 0, options) => {
        if (!iv) {
            this.getDecryptionParameters(encryptedData, authTagLength);
        }
        const decipher = crypto.createDecipheriv(algorithm, decryptionKey, iv, options);
        if (encryptionIsAuthenticated) {
            decipher.setAAD(aad);
            decipher.setAuthTag(tag);
        }

        return Buffer.concat([decipher.update(data), decipher.final()]);
    };

    this.getDecryptionParameters = (encryptedData, authTagLength = 0) => {
        let aadLen = 0;
        if (encryptionIsAuthenticated) {
            authTagLength = 16;
            aadLen = keylen;
        }

        const tagOffset = encryptedData.length - authTagLength;
        tag = encryptedData.slice(tagOffset, encryptedData.length);

        const aadOffset = tagOffset - aadLen;
        aad = encryptedData.slice(aadOffset, tagOffset);

        iv = encryptedData.slice(aadOffset - 16, aadOffset);
        data = encryptedData.slice(0, aadOffset - 16);

        return {iv, aad, tag, data};
    };

    this.generateEncryptionKey = () => {
        keylen = utils.getKeyLength(algorithm);
        return crypto.randomBytes(keylen);
    };
}

module.exports = PskEncryption;
}).call(this)}).call(this,require("buffer").Buffer)

},{"./utils/cryptoUtils":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/cryptoUtils.js","buffer":false,"crypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/api.js":[function(require,module,exports){
var asn1 = require('./asn1');
var inherits = require('util').inherits;

var api = exports;

api.define = function define(name, body) {
  return new Entity(name, body);
};

function Entity(name, body) {
  this.name = name;
  this.body = body;

  this.decoders = {};
  this.encoders = {};
};

Entity.prototype._createNamed = function createNamed(base) {
  var named;
  try {
    named = require('vm').runInThisContext(
      '(function ' + this.name + '(entity) {\n' +
      '  this._initNamed(entity);\n' +
      '})'
    );
  } catch (e) {
    named = function (entity) {
      this._initNamed(entity);
    };
  }
  inherits(named, base);
  named.prototype._initNamed = function initnamed(entity) {
    base.call(this, entity);
  };

  return new named(this);
};

Entity.prototype._getDecoder = function _getDecoder(enc) {
  // Lazily create decoder
  if (!this.decoders.hasOwnProperty(enc))
    this.decoders[enc] = this._createNamed(asn1.decoders[enc]);
  return this.decoders[enc];
};

Entity.prototype.decode = function decode(data, enc, options) {
  return this._getDecoder(enc).decode(data, options);
};

Entity.prototype._getEncoder = function _getEncoder(enc) {
  // Lazily create encoder
  if (!this.encoders.hasOwnProperty(enc))
    this.encoders[enc] = this._createNamed(asn1.encoders[enc]);
  return this.encoders[enc];
};

Entity.prototype.encode = function encode(data, enc, /* internal */ reporter) {
  return this._getEncoder(enc).encode(data, reporter);
};

},{"./asn1":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/asn1.js","util":false,"vm":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/asn1.js":[function(require,module,exports){
var asn1 = exports;

asn1.bignum = require('./bignum/bn');

asn1.define = require('./api').define;
asn1.base = require('./base/index');
asn1.constants = require('./constants/index');
asn1.decoders = require('./decoders/index');
asn1.encoders = require('./encoders/index');

},{"./api":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/api.js","./base/index":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/base/index.js","./bignum/bn":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/bignum/bn.js","./constants/index":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/constants/index.js","./decoders/index":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/decoders/index.js","./encoders/index":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/encoders/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/base/buffer.js":[function(require,module,exports){
(function (Buffer){(function (){
const inherits = require('util').inherits;
const Reporter = require('../base').Reporter;

function DecoderBuffer(base, options) {
    Reporter.call(this, options);
    if (!Buffer.isBuffer(base)) {
        this.error('Input not Buffer');
        return;
    }

    this.base = base;
    this.offset = 0;
    this.length = base.length;
}

inherits(DecoderBuffer, Reporter);
exports.DecoderBuffer = DecoderBuffer;

DecoderBuffer.prototype.save = function save() {
    return {offset: this.offset, reporter: Reporter.prototype.save.call(this)};
};

DecoderBuffer.prototype.restore = function restore(save) {
    // Return skipped data
    const res = new DecoderBuffer(this.base);
    res.offset = save.offset;
    res.length = this.offset;

    this.offset = save.offset;
    Reporter.prototype.restore.call(this, save.reporter);

    return res;
};

DecoderBuffer.prototype.isEmpty = function isEmpty() {
    return this.offset === this.length;
};

DecoderBuffer.prototype.readUInt8 = function readUInt8(fail) {
    if (this.offset + 1 <= this.length)
        return this.base.readUInt8(this.offset++, true);
    else
        return this.error(fail || 'DecoderBuffer overrun');
}

DecoderBuffer.prototype.skip = function skip(bytes, fail) {
    if (!(this.offset + bytes <= this.length))
        return this.error(fail || 'DecoderBuffer overrun');

    const res = new DecoderBuffer(this.base);

    // Share reporter state
    res._reporterState = this._reporterState;

    res.offset = this.offset;
    res.length = this.offset + bytes;
    this.offset += bytes;
    return res;
}

DecoderBuffer.prototype.raw = function raw(save) {
    return this.base.slice(save ? save.offset : this.offset, this.length);
}

function EncoderBuffer(value, reporter) {
    if (Array.isArray(value)) {
        this.length = 0;
        this.value = value.map(function (item) {
            if (!(item instanceof EncoderBuffer))
                item = new EncoderBuffer(item, reporter);
            this.length += item.length;
            return item;
        }, this);
    } else if (typeof value === 'number') {
        if (!(0 <= value && value <= 0xff))
            return reporter.error('non-byte EncoderBuffer value');
        this.value = value;
        this.length = 1;
    } else if (typeof value === 'string') {
        this.value = value;
        this.length = Buffer.byteLength(value);
    } else if (Buffer.isBuffer(value)) {
        this.value = value;
        this.length = value.length;
    } else {
        return reporter.error('Unsupported type: ' + typeof value);
    }
}

exports.EncoderBuffer = EncoderBuffer;

EncoderBuffer.prototype.join = function join(out, offset) {
    if (!out)
        out = Buffer.alloc(this.length);
    if (!offset)
        offset = 0;

    if (this.length === 0)
        return out;

    if (Array.isArray(this.value)) {
        this.value.forEach(function (item) {
            item.join(out, offset);
            offset += item.length;
        });
    } else {
        if (typeof this.value === 'number')
            out[offset] = this.value;
        else if (typeof this.value === 'string')
            out.write(this.value, offset);
        else if (Buffer.isBuffer(this.value))
            this.value.copy(out, offset);
        offset += this.length;
    }

    return out;
};

}).call(this)}).call(this,require("buffer").Buffer)

},{"../base":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/base/index.js","buffer":false,"util":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/base/index.js":[function(require,module,exports){
var base = exports;

base.Reporter = require('./reporter').Reporter;
base.DecoderBuffer = require('./buffer').DecoderBuffer;
base.EncoderBuffer = require('./buffer').EncoderBuffer;
base.Node = require('./node');

},{"./buffer":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/base/buffer.js","./node":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/base/node.js","./reporter":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/base/reporter.js"}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/base/node.js":[function(require,module,exports){
var Reporter = require('../base').Reporter;
var EncoderBuffer = require('../base').EncoderBuffer;
//var assert = require('double-check').assert;

// Supported tags
var tags = [
  'seq', 'seqof', 'set', 'setof', 'octstr', 'bitstr', 'objid', 'bool',
  'gentime', 'utctime', 'null_', 'enum', 'int', 'ia5str', 'utf8str'
];

// Public methods list
var methods = [
  'key', 'obj', 'use', 'optional', 'explicit', 'implicit', 'def', 'choice',
  'any'
].concat(tags);

// Overrided methods list
var overrided = [
  '_peekTag', '_decodeTag', '_use',
  '_decodeStr', '_decodeObjid', '_decodeTime',
  '_decodeNull', '_decodeInt', '_decodeBool', '_decodeList',

  '_encodeComposite', '_encodeStr', '_encodeObjid', '_encodeTime',
  '_encodeNull', '_encodeInt', '_encodeBool'
];

function Node(enc, parent) {
  var state = {};
  this._baseState = state;

  state.enc = enc;

  state.parent = parent || null;
  state.children = null;

  // State
  state.tag = null;
  state.args = null;
  state.reverseArgs = null;
  state.choice = null;
  state.optional = false;
  state.any = false;
  state.obj = false;
  state.use = null;
  state.useDecoder = null;
  state.key = null;
  state['default'] = null;
  state.explicit = null;
  state.implicit = null;

  // Should create new instance on each method
  if (!state.parent) {
    state.children = [];
    this._wrap();
  }
}
module.exports = Node;

var stateProps = [
  'enc', 'parent', 'children', 'tag', 'args', 'reverseArgs', 'choice',
  'optional', 'any', 'obj', 'use', 'alteredUse', 'key', 'default', 'explicit',
  'implicit'
];

Node.prototype.clone = function clone() {
  var state = this._baseState;
  var cstate = {};
  stateProps.forEach(function(prop) {
    cstate[prop] = state[prop];
  });
  var res = new this.constructor(cstate.parent);
  res._baseState = cstate;
  return res;
};

Node.prototype._wrap = function wrap() {
  var state = this._baseState;
  methods.forEach(function(method) {
    this[method] = function _wrappedMethod() {
      var clone = new this.constructor(this);
      state.children.push(clone);
      return clone[method].apply(clone, arguments);
    };
  }, this);
};

Node.prototype._init = function init(body) {
  var state = this._baseState;

  //assert.equal(state.parent,null,'state.parent should be null');
  body.call(this);

  // Filter children
  state.children = state.children.filter(function(child) {
    return child._baseState.parent === this;
  }, this);
  // assert.equal(state.children.length, 1, 'Root node can have only one child');
};

Node.prototype._useArgs = function useArgs(args) {
  var state = this._baseState;

  // Filter children and args
  var children = args.filter(function(arg) {
    return arg instanceof this.constructor;
  }, this);
  args = args.filter(function(arg) {
    return !(arg instanceof this.constructor);
  }, this);

  if (children.length !== 0) {
    // assert.equal(state.children, null, 'state.children should be null');
    state.children = children;

    // Replace parent to maintain backward link
    children.forEach(function(child) {
      child._baseState.parent = this;
    }, this);
  }
  if (args.length !== 0) {
    // assert.equal(state.args, null, 'state.args should be null');
    state.args = args;
    state.reverseArgs = args.map(function(arg) {
      if (typeof arg !== 'object' || arg.constructor !== Object)
        return arg;

      var res = {};
      Object.keys(arg).forEach(function(key) {
        if (key == (key | 0))
          key |= 0;
        var value = arg[key];
        res[value] = key;
      });
      return res;
    });
  }
};

//
// Overrided methods
//

overrided.forEach(function(method) {
  Node.prototype[method] = function _overrided() {
    var state = this._baseState;
    throw new Error(method + ' not implemented for encoding: ' + state.enc);
  };
});

//
// Public methods
//

tags.forEach(function(tag) {
  Node.prototype[tag] = function _tagMethod() {
    var state = this._baseState;
    var args = Array.prototype.slice.call(arguments);

    // assert.equal(state.tag, null, 'state.tag should be null');
    state.tag = tag;

    this._useArgs(args);

    return this;
  };
});

Node.prototype.use = function use(item) {
  var state = this._baseState;

  // assert.equal(state.use, null, 'state.use should be null');
  state.use = item;

  return this;
};

Node.prototype.optional = function optional() {
  var state = this._baseState;

  state.optional = true;

  return this;
};

Node.prototype.def = function def(val) {
  var state = this._baseState;

  // assert.equal(state['default'], null, "state['default'] should be null");
  state['default'] = val;
  state.optional = true;

  return this;
};

Node.prototype.explicit = function explicit(num) {
  var state = this._baseState;

  // assert.equal(state.explicit,null, 'state.explicit should be null');
  // assert.equal(state.implicit,null, 'state.implicit should be null');

  state.explicit = num;

  return this;
};

Node.prototype.implicit = function implicit(num) {
  var state = this._baseState;

    // assert.equal(state.explicit,null, 'state.explicit should be null');
    // assert.equal(state.implicit,null, 'state.implicit should be null');

    state.implicit = num;

  return this;
};

Node.prototype.obj = function obj() {
  var state = this._baseState;
  var args = Array.prototype.slice.call(arguments);

  state.obj = true;

  if (args.length !== 0)
    this._useArgs(args);

  return this;
};

Node.prototype.key = function key(newKey) {
  var state = this._baseState;

  // assert.equal(state.key, null, 'state.key should be null');
  state.key = newKey;

  return this;
};

Node.prototype.any = function any() {
  var state = this._baseState;

  state.any = true;

  return this;
};

Node.prototype.choice = function choice(obj) {
  var state = this._baseState;

  // assert.equal(state.choice, null,'state.choice should be null');
  state.choice = obj;
  this._useArgs(Object.keys(obj).map(function(key) {
    return obj[key];
  }));

  return this;
};

//
// Decoding
//

Node.prototype._decode = function decode(input) {
  var state = this._baseState;

  // Decode root node
  if (state.parent === null)
    return input.wrapResult(state.children[0]._decode(input));

  var result = state['default'];
  var present = true;

  var prevKey;
  if (state.key !== null)
    prevKey = input.enterKey(state.key);

  // Check if tag is there
  if (state.optional) {
    var tag = null;
    if (state.explicit !== null)
      tag = state.explicit;
    else if (state.implicit !== null)
      tag = state.implicit;
    else if (state.tag !== null)
      tag = state.tag;

    if (tag === null && !state.any) {
      // Trial and Error
      var save = input.save();
      try {
        if (state.choice === null)
          this._decodeGeneric(state.tag, input);
        else
          this._decodeChoice(input);
        present = true;
      } catch (e) {
        present = false;
      }
      input.restore(save);
    } else {
      present = this._peekTag(input, tag, state.any);

      if (input.isError(present))
        return present;
    }
  }

  // Push object on stack
  var prevObj;
  if (state.obj && present)
    prevObj = input.enterObject();

  if (present) {
    // Unwrap explicit values
    if (state.explicit !== null) {
      var explicit = this._decodeTag(input, state.explicit);
      if (input.isError(explicit))
        return explicit;
      input = explicit;
    }

    // Unwrap implicit and normal values
    if (state.use === null && state.choice === null) {
      if (state.any)
        var save = input.save();
      var body = this._decodeTag(
        input,
        state.implicit !== null ? state.implicit : state.tag,
        state.any
      );
      if (input.isError(body))
        return body;

      if (state.any)
        result = input.raw(save);
      else
        input = body;
    }

    // Select proper method for tag
    if (state.any)
      result = result;
    else if (state.choice === null)
      result = this._decodeGeneric(state.tag, input);
    else
      result = this._decodeChoice(input);

    if (input.isError(result))
      return result;

    // Decode children
    if (!state.any && state.choice === null && state.children !== null) {
      var fail = state.children.some(function decodeChildren(child) {
        // NOTE: We are ignoring errors here, to let parser continue with other
        // parts of encoded data
        child._decode(input);
      });
      if (fail)
        return err;
    }
  }

  // Pop object
  if (state.obj && present)
    result = input.leaveObject(prevObj);

  // Set key
  if (state.key !== null && (result !== null || present === true))
    input.leaveKey(prevKey, state.key, result);

  return result;
};

Node.prototype._decodeGeneric = function decodeGeneric(tag, input) {
  var state = this._baseState;

  if (tag === 'seq' || tag === 'set')
    return null;
  if (tag === 'seqof' || tag === 'setof')
    return this._decodeList(input, tag, state.args[0]);
  else if (tag === 'octstr' || tag === 'bitstr')
    return this._decodeStr(input, tag);
  else if (tag === 'ia5str' || tag === 'utf8str')
    return this._decodeStr(input, tag);
  else if (tag === 'objid' && state.args)
    return this._decodeObjid(input, state.args[0], state.args[1]);
  else if (tag === 'objid')
    return this._decodeObjid(input, null, null);
  else if (tag === 'gentime' || tag === 'utctime')
    return this._decodeTime(input, tag);
  else if (tag === 'null_')
    return this._decodeNull(input);
  else if (tag === 'bool')
    return this._decodeBool(input);
  else if (tag === 'int' || tag === 'enum')
    return this._decodeInt(input, state.args && state.args[0]);
  else if (state.use !== null)
    return this._getUse(state.use, input._reporterState.obj)._decode(input);
  else
    return input.error('unknown tag: ' + tag);

  return null;
};

Node.prototype._getUse = function _getUse(entity, obj) {

  var state = this._baseState;
  // Create altered use decoder if implicit is set
  state.useDecoder = this._use(entity, obj);
  // assert.equal(state.useDecoder._baseState.parent, null, 'state.useDecoder._baseState.parent should be null');
  state.useDecoder = state.useDecoder._baseState.children[0];
  if (state.implicit !== state.useDecoder._baseState.implicit) {
    state.useDecoder = state.useDecoder.clone();
    state.useDecoder._baseState.implicit = state.implicit;
  }
  return state.useDecoder;
};

Node.prototype._decodeChoice = function decodeChoice(input) {
  var state = this._baseState;
  var result = null;
  var match = false;

  Object.keys(state.choice).some(function(key) {
    var save = input.save();
    var node = state.choice[key];
    try {
      var value = node._decode(input);
      if (input.isError(value))
        return false;

      result = { type: key, value: value };
      match = true;
    } catch (e) {
      input.restore(save);
      return false;
    }
    return true;
  }, this);

  if (!match)
    return input.error('Choice not matched');

  return result;
};

//
// Encoding
//

Node.prototype._createEncoderBuffer = function createEncoderBuffer(data) {
  return new EncoderBuffer(data, this.reporter);
};

Node.prototype._encode = function encode(data, reporter, parent) {
  var state = this._baseState;
  if (state['default'] !== null && state['default'] === data)
    return;

  var result = this._encodeValue(data, reporter, parent);
  if (result === undefined)
    return;

  if (this._skipDefault(result, reporter, parent))
    return;

  return result;
};

Node.prototype._encodeValue = function encode(data, reporter, parent) {
  var state = this._baseState;

  // Decode root node
  if (state.parent === null)
    return state.children[0]._encode(data, reporter || new Reporter());

  var result = null;
  var present = true;

  // Set reporter to share it with a child class
  this.reporter = reporter;

  // Check if data is there
  if (state.optional && data === undefined) {
    if (state['default'] !== null)
      data = state['default']
    else
      return;
  }

  // For error reporting
  var prevKey;

  // Encode children first
  var content = null;
  var primitive = false;
  if (state.any) {
    // Anything that was given is translated to buffer
    result = this._createEncoderBuffer(data);
  } else if (state.choice) {
    result = this._encodeChoice(data, reporter);
  } else if (state.children) {
    content = state.children.map(function(child) {
      if (child._baseState.tag === 'null_')
        return child._encode(null, reporter, data);

      if (child._baseState.key === null)
        return reporter.error('Child should have a key');
      var prevKey = reporter.enterKey(child._baseState.key);

      if (typeof data !== 'object')
        return reporter.error('Child expected, but input is not object');

      var res = child._encode(data[child._baseState.key], reporter, data);
      reporter.leaveKey(prevKey);

      return res;
    }, this).filter(function(child) {
      return child;
    });

    content = this._createEncoderBuffer(content);
  } else {
    if (state.tag === 'seqof' || state.tag === 'setof') {
      // TODO(indutny): this should be thrown on DSL level
      if (!(state.args && state.args.length === 1))
        return reporter.error('Too many args for : ' + state.tag);

      if (!Array.isArray(data))
        return reporter.error('seqof/setof, but data is not Array');

      var child = this.clone();
      child._baseState.implicit = null;
      content = this._createEncoderBuffer(data.map(function(item) {
        var state = this._baseState;

        return this._getUse(state.args[0], data)._encode(item, reporter);
      }, child));
    } else if (state.use !== null) {
      result = this._getUse(state.use, parent)._encode(data, reporter);
    } else {
      content = this._encodePrimitive(state.tag, data);
      primitive = true;
    }
  }

  // Encode data itself
  var result;
  if (!state.any && state.choice === null) {
    var tag = state.implicit !== null ? state.implicit : state.tag;
    var cls = state.implicit === null ? 'universal' : 'context';

    if (tag === null) {
      if (state.use === null)
        reporter.error('Tag could be ommited only for .use()');
    } else {
      if (state.use === null)
        result = this._encodeComposite(tag, primitive, cls, content);
    }
  }

  // Wrap in explicit
  if (state.explicit !== null)
    result = this._encodeComposite(state.explicit, false, 'context', result);

  return result;
};

Node.prototype._encodeChoice = function encodeChoice(data, reporter) {
  var state = this._baseState;

  var node = state.choice[data.type];
  // if (!node) {
  //   assert(
  //       false,
  //       data.type + ' not found in ' +
  //           JSON.stringify(Object.keys(state.choice)));
  // }
  return node._encode(data.value, reporter);
};

Node.prototype._encodePrimitive = function encodePrimitive(tag, data) {
  var state = this._baseState;

  if (tag === 'octstr' || tag === 'bitstr' || tag === 'ia5str')
    return this._encodeStr(data, tag);
  else if (tag === 'utf8str')
    return this._encodeStr(data, tag);
  else if (tag === 'objid' && state.args)
    return this._encodeObjid(data, state.reverseArgs[0], state.args[1]);
  else if (tag === 'objid')
    return this._encodeObjid(data, null, null);
  else if (tag === 'gentime' || tag === 'utctime')
    return this._encodeTime(data, tag);
  else if (tag === 'null_')
    return this._encodeNull();
  else if (tag === 'int' || tag === 'enum')
    return this._encodeInt(data, state.args && state.reverseArgs[0]);
  else if (tag === 'bool')
    return this._encodeBool(data);
  else
    throw new Error('Unsupported tag: ' + tag);
};

},{"../base":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/base/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/base/reporter.js":[function(require,module,exports){
var inherits = require('util').inherits;

function Reporter(options) {
  this._reporterState = {
    obj: null,
    path: [],
    options: options || {},
    errors: []
  };
}
exports.Reporter = Reporter;

Reporter.prototype.isError = function isError(obj) {
  return obj instanceof ReporterError;
};

Reporter.prototype.save = function save() {
  var state = this._reporterState;

  return { obj: state.obj, pathLen: state.path.length };
};

Reporter.prototype.restore = function restore(data) {
  var state = this._reporterState;

  state.obj = data.obj;
  state.path = state.path.slice(0, data.pathLen);
};

Reporter.prototype.enterKey = function enterKey(key) {
  return this._reporterState.path.push(key);
};

Reporter.prototype.leaveKey = function leaveKey(index, key, value) {
  var state = this._reporterState;

  state.path = state.path.slice(0, index - 1);
  if (state.obj !== null)
    state.obj[key] = value;
};

Reporter.prototype.enterObject = function enterObject() {
  var state = this._reporterState;

  var prev = state.obj;
  state.obj = {};
  return prev;
};

Reporter.prototype.leaveObject = function leaveObject(prev) {
  var state = this._reporterState;

  var now = state.obj;
  state.obj = prev;
  return now;
};

Reporter.prototype.error = function error(msg) {
  var err;
  var state = this._reporterState;

  var inherited = msg instanceof ReporterError;
  if (inherited) {
    err = msg;
  } else {
    err = new ReporterError(state.path.map(function(elem) {
      return '[' + JSON.stringify(elem) + ']';
    }).join(''), msg.message || msg, msg.stack);
  }

  if (!state.options.partial)
    throw err;

  if (!inherited)
    state.errors.push(err);

  return err;
};

Reporter.prototype.wrapResult = function wrapResult(result) {
  var state = this._reporterState;
  if (!state.options.partial)
    return result;

  return {
    result: this.isError(result) ? null : result,
    errors: state.errors
  };
};

function ReporterError(path, msg) {
  this.path = path;
  this.rethrow(msg);
};
inherits(ReporterError, Error);

ReporterError.prototype.rethrow = function rethrow(msg) {
  this.message = msg + ' at: ' + (this.path || '(shallow)');
  Error.captureStackTrace(this, ReporterError);

  return this;
};

},{"util":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/bignum/bn.js":[function(require,module,exports){
(function (module, exports) {

'use strict';

// Utils

function assert(val, msg) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

// Could use `inherits` module, but don't want to move from single file
// architecture yet.
function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  var TempCtor = function () {};
  TempCtor.prototype = superCtor.prototype;
  ctor.prototype = new TempCtor();
  ctor.prototype.constructor = ctor;
}

// BN

function BN(number, base, endian) {
  // May be `new BN(bn)` ?
  if (number !== null &&
      typeof number === 'object' &&
      Array.isArray(number.words)) {
    return number;
  }

  this.sign = false;
  this.words = null;
  this.length = 0;

  // Reduction context
  this.red = null;

  if (base === 'le' || base === 'be') {
    endian = base;
    base = 10;
  }

  if (number !== null)
    this._init(number || 0, base || 10, endian || 'be');
}
if (typeof module === 'object')
  module.exports = BN;
else
  exports.BN = BN;

BN.BN = BN;
BN.wordSize = 26;

BN.prototype._init = function init(number, base, endian) {
  if (typeof number === 'number') {
    return this._initNumber(number, base, endian);
  } else if (typeof number === 'object') {
    return this._initArray(number, base, endian);
  }
  if (base === 'hex')
    base = 16;
  assert(base === (base | 0) && base >= 2 && base <= 36);

  number = number.toString().replace(/\s+/g, '');
  var start = 0;
  if (number[0] === '-')
    start++;

  if (base === 16)
    this._parseHex(number, start);
  else
    this._parseBase(number, base, start);

  if (number[0] === '-')
    this.sign = true;

  this.strip();

  if (endian !== 'le')
    return;

  this._initArray(this.toArray(), base, endian);
};

BN.prototype._initNumber = function _initNumber(number, base, endian) {
  if (number < 0) {
    this.sign = true;
    number = -number;
  }
  if (number < 0x4000000) {
    this.words = [ number & 0x3ffffff ];
    this.length = 1;
  } else if (number < 0x10000000000000) {
    this.words = [
      number & 0x3ffffff,
      (number / 0x4000000) & 0x3ffffff
    ];
    this.length = 2;
  } else {
    assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
    this.words = [
      number & 0x3ffffff,
      (number / 0x4000000) & 0x3ffffff,
      1
    ];
    this.length = 3;
  }

  if (endian !== 'le')
    return;

  // Reverse the bytes
  this._initArray(this.toArray(), base, endian);
};

BN.prototype._initArray = function _initArray(number, base, endian) {
  // Perhaps a Uint8Array
  assert(typeof number.length === 'number');
  if (number.length <= 0) {
    this.words = [ 0 ];
    this.length = 1;
    return this;
  }

  this.length = Math.ceil(number.length / 3);
  this.words = new Array(this.length);
  for (var i = 0; i < this.length; i++)
    this.words[i] = 0;

  var off = 0;
  if (endian === 'be') {
    for (var i = number.length - 1, j = 0; i >= 0; i -= 3) {
      var w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
      this.words[j] |= (w << off) & 0x3ffffff;
      this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
      off += 24;
      if (off >= 26) {
        off -= 26;
        j++;
      }
    }
  } else if (endian === 'le') {
    for (var i = 0, j = 0; i < number.length; i += 3) {
      var w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
      this.words[j] |= (w << off) & 0x3ffffff;
      this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
      off += 24;
      if (off >= 26) {
        off -= 26;
        j++;
      }
    }
  }
  return this.strip();
};

function parseHex(str, start, end) {
  var r = 0;
  var len = Math.min(str.length, end);
  for (var i = start; i < len; i++) {
    var c = str.charCodeAt(i) - 48;

    r <<= 4;

    // 'a' - 'f'
    if (c >= 49 && c <= 54)
      r |= c - 49 + 0xa;

    // 'A' - 'F'
    else if (c >= 17 && c <= 22)
      r |= c - 17 + 0xa;

    // '0' - '9'
    else
      r |= c & 0xf;
  }
  return r;
}

BN.prototype._parseHex = function _parseHex(number, start) {
  // Create possibly bigger array to ensure that it fits the number
  this.length = Math.ceil((number.length - start) / 6);
  this.words = new Array(this.length);
  for (var i = 0; i < this.length; i++)
    this.words[i] = 0;

  // Scan 24-bit chunks and add them to the number
  var off = 0;
  for (var i = number.length - 6, j = 0; i >= start; i -= 6) {
    var w = parseHex(number, i, i + 6);
    this.words[j] |= (w << off) & 0x3ffffff;
    this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
    off += 24;
    if (off >= 26) {
      off -= 26;
      j++;
    }
  }
  if (i + 6 !== start) {
    var w = parseHex(number, start, i + 6);
    this.words[j] |= (w << off) & 0x3ffffff;
    this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
  }
  this.strip();
};

function parseBase(str, start, end, mul) {
  var r = 0;
  var len = Math.min(str.length, end);
  for (var i = start; i < len; i++) {
    var c = str.charCodeAt(i) - 48;

    r *= mul;

    // 'a'
    if (c >= 49)
      r += c - 49 + 0xa;

    // 'A'
    else if (c >= 17)
      r += c - 17 + 0xa;

    // '0' - '9'
    else
      r += c;
  }
  return r;
}

BN.prototype._parseBase = function _parseBase(number, base, start) {
  // Initialize as zero
  this.words = [ 0 ];
  this.length = 1;

  // Find length of limb in base
  for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base)
    limbLen++;
  limbLen--;
  limbPow = (limbPow / base) | 0;

  var total = number.length - start;
  var mod = total % limbLen;
  var end = Math.min(total, total - mod) + start;

  var word = 0;
  for (var i = start; i < end; i += limbLen) {
    word = parseBase(number, i, i + limbLen, base);

    this.imuln(limbPow);
    if (this.words[0] + word < 0x4000000)
      this.words[0] += word;
    else
      this._iaddn(word);
  }

  if (mod !== 0) {
    var pow = 1;
    var word = parseBase(number, i, number.length, base);

    for (var i = 0; i < mod; i++)
      pow *= base;
    this.imuln(pow);
    if (this.words[0] + word < 0x4000000)
      this.words[0] += word;
    else
      this._iaddn(word);
  }
};

BN.prototype.copy = function copy(dest) {
  dest.words = new Array(this.length);
  for (var i = 0; i < this.length; i++)
    dest.words[i] = this.words[i];
  dest.length = this.length;
  dest.sign = this.sign;
  dest.red = this.red;
};

BN.prototype.clone = function clone() {
  var r = new BN(null);
  this.copy(r);
  return r;
};

// Remove leading `0` from `this`
BN.prototype.strip = function strip() {
  while (this.length > 1 && this.words[this.length - 1] === 0)
    this.length--;
  return this._normSign();
};

BN.prototype._normSign = function _normSign() {
  // -0 = 0
  if (this.length === 1 && this.words[0] === 0)
    this.sign = false;
  return this;
};

BN.prototype.inspect = function inspect() {
  return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
};

/*

var zeros = [];
var groupSizes = [];
var groupBases = [];

var s = '';
var i = -1;
while (++i < BN.wordSize) {
  zeros[i] = s;
  s += '0';
}
groupSizes[0] = 0;
groupSizes[1] = 0;
groupBases[0] = 0;
groupBases[1] = 0;
var base = 2 - 1;
while (++base < 36 + 1) {
  var groupSize = 0;
  var groupBase = 1;
  while (groupBase < (1 << BN.wordSize) / base) {
    groupBase *= base;
    groupSize += 1;
  }
  groupSizes[base] = groupSize;
  groupBases[base] = groupBase;
}

*/

var zeros = [
  '',
  '0',
  '00',
  '000',
  '0000',
  '00000',
  '000000',
  '0000000',
  '00000000',
  '000000000',
  '0000000000',
  '00000000000',
  '000000000000',
  '0000000000000',
  '00000000000000',
  '000000000000000',
  '0000000000000000',
  '00000000000000000',
  '000000000000000000',
  '0000000000000000000',
  '00000000000000000000',
  '000000000000000000000',
  '0000000000000000000000',
  '00000000000000000000000',
  '000000000000000000000000',
  '0000000000000000000000000'
];

var groupSizes = [
  0, 0,
  25, 16, 12, 11, 10, 9, 8,
  8, 7, 7, 7, 7, 6, 6,
  6, 6, 6, 6, 6, 5, 5,
  5, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 5, 5, 5
];

var groupBases = [
  0, 0,
  33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
  43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
  16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
  6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
  24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
];

BN.prototype.toString = function toString(base, padding) {
  base = base || 10;
  if (base === 16 || base === 'hex') {
    var out = '';
    var off = 0;
    var padding = padding | 0 || 1;
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var w = this.words[i];
      var word = (((w << off) | carry) & 0xffffff).toString(16);
      carry = (w >>> (24 - off)) & 0xffffff;
      if (carry !== 0 || i !== this.length - 1)
        out = zeros[6 - word.length] + word + out;
      else
        out = word + out;
      off += 2;
      if (off >= 26) {
        off -= 26;
        i--;
      }
    }
    if (carry !== 0)
      out = carry.toString(16) + out;
    while (out.length % padding !== 0)
      out = '0' + out;
    if (this.sign)
      out = '-' + out;
    return out;
  } else if (base === (base | 0) && base >= 2 && base <= 36) {
    // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
    var groupSize = groupSizes[base];
    // var groupBase = Math.pow(base, groupSize);
    var groupBase = groupBases[base];
    var out = '';
    var c = this.clone();
    c.sign = false;
    while (c.cmpn(0) !== 0) {
      var r = c.modn(groupBase).toString(base);
      c = c.idivn(groupBase);

      if (c.cmpn(0) !== 0)
        out = zeros[groupSize - r.length] + r + out;
      else
        out = r + out;
    }
    if (this.cmpn(0) === 0)
      out = '0' + out;
    if (this.sign)
      out = '-' + out;
    return out;
  } else {
    assert(false, 'Base should be between 2 and 36');
  }
};

BN.prototype.toJSON = function toJSON() {
  return this.toString(16);
};

BN.prototype.toArray = function toArray(endian) {
  this.strip();
  var res = new Array(this.byteLength());
  res[0] = 0;

  var q = this.clone();
  if (endian !== 'le') {
    // Assume big-endian
    for (var i = 0; q.cmpn(0) !== 0; i++) {
      var b = q.andln(0xff);
      q.ishrn(8);

      res[res.length - i - 1] = b;
    }
  } else {
    // Assume little-endian
    for (var i = 0; q.cmpn(0) !== 0; i++) {
      var b = q.andln(0xff);
      q.ishrn(8);

      res[i] = b;
    }
  }

  return res;
};

if (Math.clz32) {
  BN.prototype._countBits = function _countBits(w) {
    return 32 - Math.clz32(w);
  };
} else {
  BN.prototype._countBits = function _countBits(w) {
    var t = w;
    var r = 0;
    if (t >= 0x1000) {
      r += 13;
      t >>>= 13;
    }
    if (t >= 0x40) {
      r += 7;
      t >>>= 7;
    }
    if (t >= 0x8) {
      r += 4;
      t >>>= 4;
    }
    if (t >= 0x02) {
      r += 2;
      t >>>= 2;
    }
    return r + t;
  };
}

BN.prototype._zeroBits = function _zeroBits(w) {
  // Short-cut
  if (w === 0)
    return 26;

  var t = w;
  var r = 0;
  if ((t & 0x1fff) === 0) {
    r += 13;
    t >>>= 13;
  }
  if ((t & 0x7f) === 0) {
    r += 7;
    t >>>= 7;
  }
  if ((t & 0xf) === 0) {
    r += 4;
    t >>>= 4;
  }
  if ((t & 0x3) === 0) {
    r += 2;
    t >>>= 2;
  }
  if ((t & 0x1) === 0)
    r++;
  return r;
};

// Return number of used bits in a BN
BN.prototype.bitLength = function bitLength() {
  var hi = 0;
  var w = this.words[this.length - 1];
  var hi = this._countBits(w);
  return (this.length - 1) * 26 + hi;
};

// Number of trailing zero bits
BN.prototype.zeroBits = function zeroBits() {
  if (this.cmpn(0) === 0)
    return 0;

  var r = 0;
  for (var i = 0; i < this.length; i++) {
    var b = this._zeroBits(this.words[i]);
    r += b;
    if (b !== 26)
      break;
  }
  return r;
};

BN.prototype.byteLength = function byteLength() {
  return Math.ceil(this.bitLength() / 8);
};

// Return negative clone of `this`
BN.prototype.neg = function neg() {
  if (this.cmpn(0) === 0)
    return this.clone();

  var r = this.clone();
  r.sign = !this.sign;
  return r;
};


// Or `num` with `this` in-place
BN.prototype.ior = function ior(num) {
  this.sign = this.sign || num.sign;

  while (this.length < num.length)
    this.words[this.length++] = 0;

  for (var i = 0; i < num.length; i++)
    this.words[i] = this.words[i] | num.words[i];

  return this.strip();
};


// Or `num` with `this`
BN.prototype.or = function or(num) {
  if (this.length > num.length)
    return this.clone().ior(num);
  else
    return num.clone().ior(this);
};


// And `num` with `this` in-place
BN.prototype.iand = function iand(num) {
  this.sign = this.sign && num.sign;

  // b = min-length(num, this)
  var b;
  if (this.length > num.length)
    b = num;
  else
    b = this;

  for (var i = 0; i < b.length; i++)
    this.words[i] = this.words[i] & num.words[i];

  this.length = b.length;

  return this.strip();
};


// And `num` with `this`
BN.prototype.and = function and(num) {
  if (this.length > num.length)
    return this.clone().iand(num);
  else
    return num.clone().iand(this);
};


// Xor `num` with `this` in-place
BN.prototype.ixor = function ixor(num) {
  this.sign = this.sign || num.sign;

  // a.length > b.length
  var a;
  var b;
  if (this.length > num.length) {
    a = this;
    b = num;
  } else {
    a = num;
    b = this;
  }

  for (var i = 0; i < b.length; i++)
    this.words[i] = a.words[i] ^ b.words[i];

  if (this !== a)
    for (; i < a.length; i++)
      this.words[i] = a.words[i];

  this.length = a.length;

  return this.strip();
};


// Xor `num` with `this`
BN.prototype.xor = function xor(num) {
  if (this.length > num.length)
    return this.clone().ixor(num);
  else
    return num.clone().ixor(this);
};


// Set `bit` of `this`
BN.prototype.setn = function setn(bit, val) {
  assert(typeof bit === 'number' && bit >= 0);

  var off = (bit / 26) | 0;
  var wbit = bit % 26;

  while (this.length <= off)
    this.words[this.length++] = 0;

  if (val)
    this.words[off] = this.words[off] | (1 << wbit);
  else
    this.words[off] = this.words[off] & ~(1 << wbit);

  return this.strip();
};


// Add `num` to `this` in-place
BN.prototype.iadd = function iadd(num) {
  // negative + positive
  if (this.sign && !num.sign) {
    this.sign = false;
    var r = this.isub(num);
    this.sign = !this.sign;
    return this._normSign();

  // positive + negative
  } else if (!this.sign && num.sign) {
    num.sign = false;
    var r = this.isub(num);
    num.sign = true;
    return r._normSign();
  }

  // a.length > b.length
  var a;
  var b;
  if (this.length > num.length) {
    a = this;
    b = num;
  } else {
    a = num;
    b = this;
  }

  var carry = 0;
  for (var i = 0; i < b.length; i++) {
    var r = a.words[i] + b.words[i] + carry;
    this.words[i] = r & 0x3ffffff;
    carry = r >>> 26;
  }
  for (; carry !== 0 && i < a.length; i++) {
    var r = a.words[i] + carry;
    this.words[i] = r & 0x3ffffff;
    carry = r >>> 26;
  }

  this.length = a.length;
  if (carry !== 0) {
    this.words[this.length] = carry;
    this.length++;
  // Copy the rest of the words
  } else if (a !== this) {
    for (; i < a.length; i++)
      this.words[i] = a.words[i];
  }

  return this;
};

// Add `num` to `this`
BN.prototype.add = function add(num) {
  if (num.sign && !this.sign) {
    num.sign = false;
    var res = this.sub(num);
    num.sign = true;
    return res;
  } else if (!num.sign && this.sign) {
    this.sign = false;
    var res = num.sub(this);
    this.sign = true;
    return res;
  }

  if (this.length > num.length)
    return this.clone().iadd(num);
  else
    return num.clone().iadd(this);
};

// Subtract `num` from `this` in-place
BN.prototype.isub = function isub(num) {
  // this - (-num) = this + num
  if (num.sign) {
    num.sign = false;
    var r = this.iadd(num);
    num.sign = true;
    return r._normSign();

  // -this - num = -(this + num)
  } else if (this.sign) {
    this.sign = false;
    this.iadd(num);
    this.sign = true;
    return this._normSign();
  }

  // At this point both numbers are positive
  var cmp = this.cmp(num);

  // Optimization - zeroify
  if (cmp === 0) {
    this.sign = false;
    this.length = 1;
    this.words[0] = 0;
    return this;
  }

  // a > b
  var a;
  var b;
  if (cmp > 0) {
    a = this;
    b = num;
  } else {
    a = num;
    b = this;
  }

  var carry = 0;
  for (var i = 0; i < b.length; i++) {
    var r = a.words[i] - b.words[i] + carry;
    carry = r >> 26;
    this.words[i] = r & 0x3ffffff;
  }
  for (; carry !== 0 && i < a.length; i++) {
    var r = a.words[i] + carry;
    carry = r >> 26;
    this.words[i] = r & 0x3ffffff;
  }

  // Copy rest of the words
  if (carry === 0 && i < a.length && a !== this)
    for (; i < a.length; i++)
      this.words[i] = a.words[i];
  this.length = Math.max(this.length, i);

  if (a !== this)
    this.sign = true;

  return this.strip();
};

// Subtract `num` from `this`
BN.prototype.sub = function sub(num) {
  return this.clone().isub(num);
};

/*
// NOTE: This could be potentionally used to generate loop-less multiplications
function _genCombMulTo(alen, blen) {
  var len = alen + blen - 1;
  var src = [
    'var a = this.words, b = num.words, o = out.words, c = 0, w, ' +
        'mask = 0x3ffffff, shift = 0x4000000;',
    'out.length = ' + len + ';'
  ];
  for (var k = 0; k < len; k++) {
    var minJ = Math.max(0, k - alen + 1);
    var maxJ = Math.min(k, blen - 1);

    for (var j = minJ; j <= maxJ; j++) {
      var i = k - j;
      var mul = 'a[' + i + '] * b[' + j + ']';

      if (j === minJ) {
        src.push('w = ' + mul + ' + c;');
        src.push('c = (w / shift) | 0;');
      } else {
        src.push('w += ' + mul + ';');
        src.push('c += (w / shift) | 0;');
      }
      src.push('w &= mask;');
    }
    src.push('o[' + k + '] = w;');
  }
  src.push('if (c !== 0) {',
           '  o[' + k + '] = c;',
           '  out.length++;',
           '}',
           'return out;');

  return src.join('\n');
}
*/

BN.prototype._smallMulTo = function _smallMulTo(num, out) {
  out.sign = num.sign !== this.sign;
  out.length = this.length + num.length;

  var carry = 0;
  for (var k = 0; k < out.length - 1; k++) {
    // Sum all words with the same `i + j = k` and accumulate `ncarry`,
    // note that ncarry could be >= 0x3ffffff
    var ncarry = carry >>> 26;
    var rword = carry & 0x3ffffff;
    var maxJ = Math.min(k, num.length - 1);
    for (var j = Math.max(0, k - this.length + 1); j <= maxJ; j++) {
      var i = k - j;
      var a = this.words[i] | 0;
      var b = num.words[j] | 0;
      var r = a * b;

      var lo = r & 0x3ffffff;
      ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
      lo = (lo + rword) | 0;
      rword = lo & 0x3ffffff;
      ncarry = (ncarry + (lo >>> 26)) | 0;
    }
    out.words[k] = rword;
    carry = ncarry;
  }
  if (carry !== 0) {
    out.words[k] = carry;
  } else {
    out.length--;
  }

  return out.strip();
};

BN.prototype._bigMulTo = function _bigMulTo(num, out) {
  out.sign = num.sign !== this.sign;
  out.length = this.length + num.length;

  var carry = 0;
  var hncarry = 0;
  for (var k = 0; k < out.length - 1; k++) {
    // Sum all words with the same `i + j = k` and accumulate `ncarry`,
    // note that ncarry could be >= 0x3ffffff
    var ncarry = hncarry;
    hncarry = 0;
    var rword = carry & 0x3ffffff;
    var maxJ = Math.min(k, num.length - 1);
    for (var j = Math.max(0, k - this.length + 1); j <= maxJ; j++) {
      var i = k - j;
      var a = this.words[i] | 0;
      var b = num.words[j] | 0;
      var r = a * b;

      var lo = r & 0x3ffffff;
      ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
      lo = (lo + rword) | 0;
      rword = lo & 0x3ffffff;
      ncarry = (ncarry + (lo >>> 26)) | 0;

      hncarry += ncarry >>> 26;
      ncarry &= 0x3ffffff;
    }
    out.words[k] = rword;
    carry = ncarry;
    ncarry = hncarry;
  }
  if (carry !== 0) {
    out.words[k] = carry;
  } else {
    out.length--;
  }

  return out.strip();
};

BN.prototype.mulTo = function mulTo(num, out) {
  var res;
  if (this.length + num.length < 63)
    res = this._smallMulTo(num, out);
  else
    res = this._bigMulTo(num, out);
  return res;
};

// Multiply `this` by `num`
BN.prototype.mul = function mul(num) {
  var out = new BN(null);
  out.words = new Array(this.length + num.length);
  return this.mulTo(num, out);
};

// In-place Multiplication
BN.prototype.imul = function imul(num) {
  if (this.cmpn(0) === 0 || num.cmpn(0) === 0) {
    this.words[0] = 0;
    this.length = 1;
    return this;
  }

  var tlen = this.length;
  var nlen = num.length;

  this.sign = num.sign !== this.sign;
  this.length = this.length + num.length;
  this.words[this.length - 1] = 0;

  for (var k = this.length - 2; k >= 0; k--) {
    // Sum all words with the same `i + j = k` and accumulate `carry`,
    // note that carry could be >= 0x3ffffff
    var carry = 0;
    var rword = 0;
    var maxJ = Math.min(k, nlen - 1);
    for (var j = Math.max(0, k - tlen + 1); j <= maxJ; j++) {
      var i = k - j;
      var a = this.words[i];
      var b = num.words[j];
      var r = a * b;

      var lo = r & 0x3ffffff;
      carry += (r / 0x4000000) | 0;
      lo += rword;
      rword = lo & 0x3ffffff;
      carry += lo >>> 26;
    }
    this.words[k] = rword;
    this.words[k + 1] += carry;
    carry = 0;
  }

  // Propagate overflows
  var carry = 0;
  for (var i = 1; i < this.length; i++) {
    var w = this.words[i] + carry;
    this.words[i] = w & 0x3ffffff;
    carry = w >>> 26;
  }

  return this.strip();
};

BN.prototype.imuln = function imuln(num) {
  assert(typeof num === 'number');

  // Carry
  var carry = 0;
  for (var i = 0; i < this.length; i++) {
    var w = this.words[i] * num;
    var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
    carry >>= 26;
    carry += (w / 0x4000000) | 0;
    // NOTE: lo is 27bit maximum
    carry += lo >>> 26;
    this.words[i] = lo & 0x3ffffff;
  }

  if (carry !== 0) {
    this.words[i] = carry;
    this.length++;
  }

  return this;
};

BN.prototype.muln = function muln(num) {
  return this.clone().imuln(num);
};

// `this` * `this`
BN.prototype.sqr = function sqr() {
  return this.mul(this);
};

// `this` * `this` in-place
BN.prototype.isqr = function isqr() {
  return this.mul(this);
};

// Shift-left in-place
BN.prototype.ishln = function ishln(bits) {
  assert(typeof bits === 'number' && bits >= 0);
  var r = bits % 26;
  var s = (bits - r) / 26;
  var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);

  if (r !== 0) {
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var newCarry = this.words[i] & carryMask;
      var c = (this.words[i] - newCarry) << r;
      this.words[i] = c | carry;
      carry = newCarry >>> (26 - r);
    }
    if (carry) {
      this.words[i] = carry;
      this.length++;
    }
  }

  if (s !== 0) {
    for (var i = this.length - 1; i >= 0; i--)
      this.words[i + s] = this.words[i];
    for (var i = 0; i < s; i++)
      this.words[i] = 0;
    this.length += s;
  }

  return this.strip();
};

// Shift-right in-place
// NOTE: `hint` is a lowest bit before trailing zeroes
// NOTE: if `extended` is present - it will be filled with destroyed bits
BN.prototype.ishrn = function ishrn(bits, hint, extended) {
  assert(typeof bits === 'number' && bits >= 0);
  var h;
  if (hint)
    h = (hint - (hint % 26)) / 26;
  else
    h = 0;

  var r = bits % 26;
  var s = Math.min((bits - r) / 26, this.length);
  var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
  var maskedWords = extended;

  h -= s;
  h = Math.max(0, h);

  // Extended mode, copy masked part
  if (maskedWords) {
    for (var i = 0; i < s; i++)
      maskedWords.words[i] = this.words[i];
    maskedWords.length = s;
  }

  if (s === 0) {
    // No-op, we should not move anything at all
  } else if (this.length > s) {
    this.length -= s;
    for (var i = 0; i < this.length; i++)
      this.words[i] = this.words[i + s];
  } else {
    this.words[0] = 0;
    this.length = 1;
  }

  var carry = 0;
  for (var i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
    var word = this.words[i];
    this.words[i] = (carry << (26 - r)) | (word >>> r);
    carry = word & mask;
  }

  // Push carried bits as a mask
  if (maskedWords && carry !== 0)
    maskedWords.words[maskedWords.length++] = carry;

  if (this.length === 0) {
    this.words[0] = 0;
    this.length = 1;
  }

  this.strip();

  return this;
};

// Shift-left
BN.prototype.shln = function shln(bits) {
  return this.clone().ishln(bits);
};

// Shift-right
BN.prototype.shrn = function shrn(bits) {
  return this.clone().ishrn(bits);
};

// Test if n bit is set
BN.prototype.testn = function testn(bit) {
  assert(typeof bit === 'number' && bit >= 0);
  var r = bit % 26;
  var s = (bit - r) / 26;
  var q = 1 << r;

  // Fast case: bit is much higher than all existing words
  if (this.length <= s) {
    return false;
  }

  // Check bit and return
  var w = this.words[s];

  return !!(w & q);
};

// Return only lowers bits of number (in-place)
BN.prototype.imaskn = function imaskn(bits) {
  assert(typeof bits === 'number' && bits >= 0);
  var r = bits % 26;
  var s = (bits - r) / 26;

  assert(!this.sign, 'imaskn works only with positive numbers');

  if (r !== 0)
    s++;
  this.length = Math.min(s, this.length);

  if (r !== 0) {
    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
    this.words[this.length - 1] &= mask;
  }

  return this.strip();
};

// Return only lowers bits of number
BN.prototype.maskn = function maskn(bits) {
  return this.clone().imaskn(bits);
};

// Add plain number `num` to `this`
BN.prototype.iaddn = function iaddn(num) {
  assert(typeof num === 'number');
  if (num < 0)
    return this.isubn(-num);

  // Possible sign change
  if (this.sign) {
    if (this.length === 1 && this.words[0] < num) {
      this.words[0] = num - this.words[0];
      this.sign = false;
      return this;
    }

    this.sign = false;
    this.isubn(num);
    this.sign = true;
    return this;
  }

  // Add without checks
  return this._iaddn(num);
};

BN.prototype._iaddn = function _iaddn(num) {
  this.words[0] += num;

  // Carry
  for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
    this.words[i] -= 0x4000000;
    if (i === this.length - 1)
      this.words[i + 1] = 1;
    else
      this.words[i + 1]++;
  }
  this.length = Math.max(this.length, i + 1);

  return this;
};

// Subtract plain number `num` from `this`
BN.prototype.isubn = function isubn(num) {
  assert(typeof num === 'number');
  if (num < 0)
    return this.iaddn(-num);

  if (this.sign) {
    this.sign = false;
    this.iaddn(num);
    this.sign = true;
    return this;
  }

  this.words[0] -= num;

  // Carry
  for (var i = 0; i < this.length && this.words[i] < 0; i++) {
    this.words[i] += 0x4000000;
    this.words[i + 1] -= 1;
  }

  return this.strip();
};

BN.prototype.addn = function addn(num) {
  return this.clone().iaddn(num);
};

BN.prototype.subn = function subn(num) {
  return this.clone().isubn(num);
};

BN.prototype.iabs = function iabs() {
  this.sign = false;

  return this;
};

BN.prototype.abs = function abs() {
  return this.clone().iabs();
};

BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
  // Bigger storage is needed
  var len = num.length + shift;
  var i;
  if (this.words.length < len) {
    var t = new Array(len);
    for (var i = 0; i < this.length; i++)
      t[i] = this.words[i];
    this.words = t;
  } else {
    i = this.length;
  }

  // Zeroify rest
  this.length = Math.max(this.length, len);
  for (; i < this.length; i++)
    this.words[i] = 0;

  var carry = 0;
  for (var i = 0; i < num.length; i++) {
    var w = this.words[i + shift] + carry;
    var right = num.words[i] * mul;
    w -= right & 0x3ffffff;
    carry = (w >> 26) - ((right / 0x4000000) | 0);
    this.words[i + shift] = w & 0x3ffffff;
  }
  for (; i < this.length - shift; i++) {
    var w = this.words[i + shift] + carry;
    carry = w >> 26;
    this.words[i + shift] = w & 0x3ffffff;
  }

  if (carry === 0)
    return this.strip();

  // Subtraction overflow
  assert(carry === -1);
  carry = 0;
  for (var i = 0; i < this.length; i++) {
    var w = -this.words[i] + carry;
    carry = w >> 26;
    this.words[i] = w & 0x3ffffff;
  }
  this.sign = true;

  return this.strip();
};

BN.prototype._wordDiv = function _wordDiv(num, mode) {
  var shift = this.length - num.length;

  var a = this.clone();
  var b = num;

  // Normalize
  var bhi = b.words[b.length - 1];
  var bhiBits = this._countBits(bhi);
  shift = 26 - bhiBits;
  if (shift !== 0) {
    b = b.shln(shift);
    a.ishln(shift);
    bhi = b.words[b.length - 1];
  }

  // Initialize quotient
  var m = a.length - b.length;
  var q;

  if (mode !== 'mod') {
    q = new BN(null);
    q.length = m + 1;
    q.words = new Array(q.length);
    for (var i = 0; i < q.length; i++)
      q.words[i] = 0;
  }

  var diff = a.clone()._ishlnsubmul(b, 1, m);
  if (!diff.sign) {
    a = diff;
    if (q)
      q.words[m] = 1;
  }

  for (var j = m - 1; j >= 0; j--) {
    var qj = a.words[b.length + j] * 0x4000000 + a.words[b.length + j - 1];

    // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
    // (0x7ffffff)
    qj = Math.min((qj / bhi) | 0, 0x3ffffff);

    a._ishlnsubmul(b, qj, j);
    while (a.sign) {
      qj--;
      a.sign = false;
      a._ishlnsubmul(b, 1, j);
      if (a.cmpn(0) !== 0)
        a.sign = !a.sign;
    }
    if (q)
      q.words[j] = qj;
  }
  if (q)
    q.strip();
  a.strip();

  // Denormalize
  if (mode !== 'div' && shift !== 0)
    a.ishrn(shift);
  return { div: q ? q : null, mod: a };
};

BN.prototype.divmod = function divmod(num, mode) {
  assert(num.cmpn(0) !== 0);

  if (this.sign && !num.sign) {
    var res = this.neg().divmod(num, mode);
    var div;
    var mod;
    if (mode !== 'mod')
      div = res.div.neg();
    if (mode !== 'div')
      mod = res.mod.cmpn(0) === 0 ? res.mod : num.sub(res.mod);
    return {
      div: div,
      mod: mod
    };
  } else if (!this.sign && num.sign) {
    var res = this.divmod(num.neg(), mode);
    var div;
    if (mode !== 'mod')
      div = res.div.neg();
    return { div: div, mod: res.mod };
  } else if (this.sign && num.sign) {
    return this.neg().divmod(num.neg(), mode);
  }

  // Both numbers are positive at this point

  // Strip both numbers to approximate shift value
  if (num.length > this.length || this.cmp(num) < 0)
    return { div: new BN(0), mod: this };

  // Very short reduction
  if (num.length === 1) {
    if (mode === 'div')
      return { div: this.divn(num.words[0]), mod: null };
    else if (mode === 'mod')
      return { div: null, mod: new BN(this.modn(num.words[0])) };
    return {
      div: this.divn(num.words[0]),
      mod: new BN(this.modn(num.words[0]))
    };
  }

  return this._wordDiv(num, mode);
};

// Find `this` / `num`
BN.prototype.div = function div(num) {
  return this.divmod(num, 'div').div;
};

// Find `this` % `num`
BN.prototype.mod = function mod(num) {
  return this.divmod(num, 'mod').mod;
};

// Find Round(`this` / `num`)
BN.prototype.divRound = function divRound(num) {
  var dm = this.divmod(num);

  // Fast case - exact division
  if (dm.mod.cmpn(0) === 0)
    return dm.div;

  var mod = dm.div.sign ? dm.mod.isub(num) : dm.mod;

  var half = num.shrn(1);
  var r2 = num.andln(1);
  var cmp = mod.cmp(half);

  // Round down
  if (cmp < 0 || r2 === 1 && cmp === 0)
    return dm.div;

  // Round up
  return dm.div.sign ? dm.div.isubn(1) : dm.div.iaddn(1);
};

BN.prototype.modn = function modn(num) {
  assert(num <= 0x3ffffff);
  var p = (1 << 26) % num;

  var acc = 0;
  for (var i = this.length - 1; i >= 0; i--)
    acc = (p * acc + this.words[i]) % num;

  return acc;
};

// In-place division by number
BN.prototype.idivn = function idivn(num) {
  assert(num <= 0x3ffffff);

  var carry = 0;
  for (var i = this.length - 1; i >= 0; i--) {
    var w = this.words[i] + carry * 0x4000000;
    this.words[i] = (w / num) | 0;
    carry = w % num;
  }

  return this.strip();
};

BN.prototype.divn = function divn(num) {
  return this.clone().idivn(num);
};

BN.prototype.egcd = function egcd(p) {
  assert(!p.sign);
  assert(p.cmpn(0) !== 0);

  var x = this;
  var y = p.clone();

  if (x.sign)
    x = x.mod(p);
  else
    x = x.clone();

  // A * x + B * y = x
  var A = new BN(1);
  var B = new BN(0);

  // C * x + D * y = y
  var C = new BN(0);
  var D = new BN(1);

  var g = 0;

  while (x.isEven() && y.isEven()) {
    x.ishrn(1);
    y.ishrn(1);
    ++g;
  }

  var yp = y.clone();
  var xp = x.clone();

  while (x.cmpn(0) !== 0) {
    while (x.isEven()) {
      x.ishrn(1);
      if (A.isEven() && B.isEven()) {
        A.ishrn(1);
        B.ishrn(1);
      } else {
        A.iadd(yp).ishrn(1);
        B.isub(xp).ishrn(1);
      }
    }

    while (y.isEven()) {
      y.ishrn(1);
      if (C.isEven() && D.isEven()) {
        C.ishrn(1);
        D.ishrn(1);
      } else {
        C.iadd(yp).ishrn(1);
        D.isub(xp).ishrn(1);
      }
    }

    if (x.cmp(y) >= 0) {
      x.isub(y);
      A.isub(C);
      B.isub(D);
    } else {
      y.isub(x);
      C.isub(A);
      D.isub(B);
    }
  }

  return {
    a: C,
    b: D,
    gcd: y.ishln(g)
  };
};

// This is reduced incarnation of the binary EEA
// above, designated to invert members of the
// _prime_ fields F(p) at a maximal speed
BN.prototype._invmp = function _invmp(p) {
  assert(!p.sign);
  assert(p.cmpn(0) !== 0);

  var a = this;
  var b = p.clone();

  if (a.sign)
    a = a.mod(p);
  else
    a = a.clone();

  var x1 = new BN(1);
  var x2 = new BN(0);

  var delta = b.clone();

  while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
    while (a.isEven()) {
      a.ishrn(1);
      if (x1.isEven())
        x1.ishrn(1);
      else
        x1.iadd(delta).ishrn(1);
    }
    while (b.isEven()) {
      b.ishrn(1);
      if (x2.isEven())
        x2.ishrn(1);
      else
        x2.iadd(delta).ishrn(1);
    }
    if (a.cmp(b) >= 0) {
      a.isub(b);
      x1.isub(x2);
    } else {
      b.isub(a);
      x2.isub(x1);
    }
  }
  if (a.cmpn(1) === 0)
    return x1;
  else
    return x2;
};

BN.prototype.gcd = function gcd(num) {
  if (this.cmpn(0) === 0)
    return num.clone();
  if (num.cmpn(0) === 0)
    return this.clone();

  var a = this.clone();
  var b = num.clone();
  a.sign = false;
  b.sign = false;

  // Remove common factor of two
  for (var shift = 0; a.isEven() && b.isEven(); shift++) {
    a.ishrn(1);
    b.ishrn(1);
  }

  do {
    while (a.isEven())
      a.ishrn(1);
    while (b.isEven())
      b.ishrn(1);

    var r = a.cmp(b);
    if (r < 0) {
      // Swap `a` and `b` to make `a` always bigger than `b`
      var t = a;
      a = b;
      b = t;
    } else if (r === 0 || b.cmpn(1) === 0) {
      break;
    }

    a.isub(b);
  } while (true);

  return b.ishln(shift);
};

// Invert number in the field F(num)
BN.prototype.invm = function invm(num) {
  return this.egcd(num).a.mod(num);
};

BN.prototype.isEven = function isEven() {
  return (this.words[0] & 1) === 0;
};

BN.prototype.isOdd = function isOdd() {
  return (this.words[0] & 1) === 1;
};

// And first word and num
BN.prototype.andln = function andln(num) {
  return this.words[0] & num;
};

// Increment at the bit position in-line
BN.prototype.bincn = function bincn(bit) {
  assert(typeof bit === 'number');
  var r = bit % 26;
  var s = (bit - r) / 26;
  var q = 1 << r;

  // Fast case: bit is much higher than all existing words
  if (this.length <= s) {
    for (var i = this.length; i < s + 1; i++)
      this.words[i] = 0;
    this.words[s] |= q;
    this.length = s + 1;
    return this;
  }

  // Add bit and propagate, if needed
  var carry = q;
  for (var i = s; carry !== 0 && i < this.length; i++) {
    var w = this.words[i];
    w += carry;
    carry = w >>> 26;
    w &= 0x3ffffff;
    this.words[i] = w;
  }
  if (carry !== 0) {
    this.words[i] = carry;
    this.length++;
  }
  return this;
};

BN.prototype.cmpn = function cmpn(num) {
  var sign = num < 0;
  if (sign)
    num = -num;

  if (this.sign && !sign)
    return -1;
  else if (!this.sign && sign)
    return 1;

  num &= 0x3ffffff;
  this.strip();

  var res;
  if (this.length > 1) {
    res = 1;
  } else {
    var w = this.words[0];
    res = w === num ? 0 : w < num ? -1 : 1;
  }
  if (this.sign)
    res = -res;
  return res;
};

// Compare two numbers and return:
// 1 - if `this` > `num`
// 0 - if `this` == `num`
// -1 - if `this` < `num`
BN.prototype.cmp = function cmp(num) {
  if (this.sign && !num.sign)
    return -1;
  else if (!this.sign && num.sign)
    return 1;

  var res = this.ucmp(num);
  if (this.sign)
    return -res;
  else
    return res;
};

// Unsigned comparison
BN.prototype.ucmp = function ucmp(num) {
  // At this point both numbers have the same sign
  if (this.length > num.length)
    return 1;
  else if (this.length < num.length)
    return -1;

  var res = 0;
  for (var i = this.length - 1; i >= 0; i--) {
    var a = this.words[i];
    var b = num.words[i];

    if (a === b)
      continue;
    if (a < b)
      res = -1;
    else if (a > b)
      res = 1;
    break;
  }
  return res;
};

//
// A reduce context, could be using montgomery or something better, depending
// on the `m` itself.
//
BN.red = function red(num) {
  return new Red(num);
};

BN.prototype.toRed = function toRed(ctx) {
  assert(!this.red, 'Already a number in reduction context');
  assert(!this.sign, 'red works only with positives');
  return ctx.convertTo(this)._forceRed(ctx);
};

BN.prototype.fromRed = function fromRed() {
  assert(this.red, 'fromRed works only with numbers in reduction context');
  return this.red.convertFrom(this);
};

BN.prototype._forceRed = function _forceRed(ctx) {
  this.red = ctx;
  return this;
};

BN.prototype.forceRed = function forceRed(ctx) {
  assert(!this.red, 'Already a number in reduction context');
  return this._forceRed(ctx);
};

BN.prototype.redAdd = function redAdd(num) {
  assert(this.red, 'redAdd works only with red numbers');
  return this.red.add(this, num);
};

BN.prototype.redIAdd = function redIAdd(num) {
  assert(this.red, 'redIAdd works only with red numbers');
  return this.red.iadd(this, num);
};

BN.prototype.redSub = function redSub(num) {
  assert(this.red, 'redSub works only with red numbers');
  return this.red.sub(this, num);
};

BN.prototype.redISub = function redISub(num) {
  assert(this.red, 'redISub works only with red numbers');
  return this.red.isub(this, num);
};

BN.prototype.redShl = function redShl(num) {
  assert(this.red, 'redShl works only with red numbers');
  return this.red.shl(this, num);
};

BN.prototype.redMul = function redMul(num) {
  assert(this.red, 'redMul works only with red numbers');
  this.red._verify2(this, num);
  return this.red.mul(this, num);
};

BN.prototype.redIMul = function redIMul(num) {
  assert(this.red, 'redMul works only with red numbers');
  this.red._verify2(this, num);
  return this.red.imul(this, num);
};

BN.prototype.redSqr = function redSqr() {
  assert(this.red, 'redSqr works only with red numbers');
  this.red._verify1(this);
  return this.red.sqr(this);
};

BN.prototype.redISqr = function redISqr() {
  assert(this.red, 'redISqr works only with red numbers');
  this.red._verify1(this);
  return this.red.isqr(this);
};

// Square root over p
BN.prototype.redSqrt = function redSqrt() {
  assert(this.red, 'redSqrt works only with red numbers');
  this.red._verify1(this);
  return this.red.sqrt(this);
};

BN.prototype.redInvm = function redInvm() {
  assert(this.red, 'redInvm works only with red numbers');
  this.red._verify1(this);
  return this.red.invm(this);
};

// Return negative clone of `this` % `red modulo`
BN.prototype.redNeg = function redNeg() {
  assert(this.red, 'redNeg works only with red numbers');
  this.red._verify1(this);
  return this.red.neg(this);
};

BN.prototype.redPow = function redPow(num) {
  assert(this.red && !num.red, 'redPow(normalNum)');
  this.red._verify1(this);
  return this.red.pow(this, num);
};

// Prime numbers with efficient reduction
var primes = {
  k256: null,
  p224: null,
  p192: null,
  p25519: null
};

// Pseudo-Mersenne prime
function MPrime(name, p) {
  // P = 2 ^ N - K
  this.name = name;
  this.p = new BN(p, 16);
  this.n = this.p.bitLength();
  this.k = new BN(1).ishln(this.n).isub(this.p);

  this.tmp = this._tmp();
}

MPrime.prototype._tmp = function _tmp() {
  var tmp = new BN(null);
  tmp.words = new Array(Math.ceil(this.n / 13));
  return tmp;
};

MPrime.prototype.ireduce = function ireduce(num) {
  // Assumes that `num` is less than `P^2`
  // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
  var r = num;
  var rlen;

  do {
    this.split(r, this.tmp);
    r = this.imulK(r);
    r = r.iadd(this.tmp);
    rlen = r.bitLength();
  } while (rlen > this.n);

  var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
  if (cmp === 0) {
    r.words[0] = 0;
    r.length = 1;
  } else if (cmp > 0) {
    r.isub(this.p);
  } else {
    r.strip();
  }

  return r;
};

MPrime.prototype.split = function split(input, out) {
  input.ishrn(this.n, 0, out);
};

MPrime.prototype.imulK = function imulK(num) {
  return num.imul(this.k);
};

function K256() {
  MPrime.call(
    this,
    'k256',
    'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
}
inherits(K256, MPrime);

K256.prototype.split = function split(input, output) {
  // 256 = 9 * 26 + 22
  var mask = 0x3fffff;

  var outLen = Math.min(input.length, 9);
  for (var i = 0; i < outLen; i++)
    output.words[i] = input.words[i];
  output.length = outLen;

  if (input.length <= 9) {
    input.words[0] = 0;
    input.length = 1;
    return;
  }

  // Shift by 9 limbs
  var prev = input.words[9];
  output.words[output.length++] = prev & mask;

  for (var i = 10; i < input.length; i++) {
    var next = input.words[i];
    input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
    prev = next;
  }
  input.words[i - 10] = prev >>> 22;
  input.length -= 9;
};

K256.prototype.imulK = function imulK(num) {
  // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
  num.words[num.length] = 0;
  num.words[num.length + 1] = 0;
  num.length += 2;

  // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
  var hi;
  var lo = 0;
  for (var i = 0; i < num.length; i++) {
    var w = num.words[i];
    hi = w * 0x40;
    lo += w * 0x3d1;
    hi += (lo / 0x4000000) | 0;
    lo &= 0x3ffffff;

    num.words[i] = lo;

    lo = hi;
  }

  // Fast length reduction
  if (num.words[num.length - 1] === 0) {
    num.length--;
    if (num.words[num.length - 1] === 0)
      num.length--;
  }
  return num;
};

function P224() {
  MPrime.call(
    this,
    'p224',
    'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
}
inherits(P224, MPrime);

function P192() {
  MPrime.call(
    this,
    'p192',
    'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
}
inherits(P192, MPrime);

function P25519() {
  // 2 ^ 255 - 19
  MPrime.call(
    this,
    '25519',
    '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
}
inherits(P25519, MPrime);

P25519.prototype.imulK = function imulK(num) {
  // K = 0x13
  var carry = 0;
  for (var i = 0; i < num.length; i++) {
    var hi = num.words[i] * 0x13 + carry;
    var lo = hi & 0x3ffffff;
    hi >>>= 26;

    num.words[i] = lo;
    carry = hi;
  }
  if (carry !== 0)
    num.words[num.length++] = carry;
  return num;
};

// Exported mostly for testing purposes, use plain name instead
BN._prime = function prime(name) {
  // Cached version of prime
  if (primes[name])
    return primes[name];

  var prime;
  if (name === 'k256')
    prime = new K256();
  else if (name === 'p224')
    prime = new P224();
  else if (name === 'p192')
    prime = new P192();
  else if (name === 'p25519')
    prime = new P25519();
  else
    throw new Error('Unknown prime ' + name);
  primes[name] = prime;

  return prime;
};

//
// Base reduction engine
//
function Red(m) {
  if (typeof m === 'string') {
    var prime = BN._prime(m);
    this.m = prime.p;
    this.prime = prime;
  } else {
    this.m = m;
    this.prime = null;
  }
}

Red.prototype._verify1 = function _verify1(a) {
  assert(!a.sign, 'red works only with positives');
  assert(a.red, 'red works only with red numbers');
};

Red.prototype._verify2 = function _verify2(a, b) {
  assert(!a.sign && !b.sign, 'red works only with positives');
  assert(a.red && a.red === b.red,
         'red works only with red numbers');
};

Red.prototype.imod = function imod(a) {
  if (this.prime)
    return this.prime.ireduce(a)._forceRed(this);
  return a.mod(this.m)._forceRed(this);
};

Red.prototype.neg = function neg(a) {
  var r = a.clone();
  r.sign = !r.sign;
  return r.iadd(this.m)._forceRed(this);
};

Red.prototype.add = function add(a, b) {
  this._verify2(a, b);

  var res = a.add(b);
  if (res.cmp(this.m) >= 0)
    res.isub(this.m);
  return res._forceRed(this);
};

Red.prototype.iadd = function iadd(a, b) {
  this._verify2(a, b);

  var res = a.iadd(b);
  if (res.cmp(this.m) >= 0)
    res.isub(this.m);
  return res;
};

Red.prototype.sub = function sub(a, b) {
  this._verify2(a, b);

  var res = a.sub(b);
  if (res.cmpn(0) < 0)
    res.iadd(this.m);
  return res._forceRed(this);
};

Red.prototype.isub = function isub(a, b) {
  this._verify2(a, b);

  var res = a.isub(b);
  if (res.cmpn(0) < 0)
    res.iadd(this.m);
  return res;
};

Red.prototype.shl = function shl(a, num) {
  this._verify1(a);
  return this.imod(a.shln(num));
};

Red.prototype.imul = function imul(a, b) {
  this._verify2(a, b);
  return this.imod(a.imul(b));
};

Red.prototype.mul = function mul(a, b) {
  this._verify2(a, b);
  return this.imod(a.mul(b));
};

Red.prototype.isqr = function isqr(a) {
  return this.imul(a, a);
};

Red.prototype.sqr = function sqr(a) {
  return this.mul(a, a);
};

Red.prototype.sqrt = function sqrt(a) {
  if (a.cmpn(0) === 0)
    return a.clone();

  var mod3 = this.m.andln(3);
  assert(mod3 % 2 === 1);

  // Fast case
  if (mod3 === 3) {
    var pow = this.m.add(new BN(1)).ishrn(2);
    var r = this.pow(a, pow);
    return r;
  }

  // Tonelli-Shanks algorithm (Totally unoptimized and slow)
  //
  // Find Q and S, that Q * 2 ^ S = (P - 1)
  var q = this.m.subn(1);
  var s = 0;
  while (q.cmpn(0) !== 0 && q.andln(1) === 0) {
    s++;
    q.ishrn(1);
  }
  assert(q.cmpn(0) !== 0);

  var one = new BN(1).toRed(this);
  var nOne = one.redNeg();

  // Find quadratic non-residue
  // NOTE: Max is such because of generalized Riemann hypothesis.
  var lpow = this.m.subn(1).ishrn(1);
  var z = this.m.bitLength();
  z = new BN(2 * z * z).toRed(this);
  while (this.pow(z, lpow).cmp(nOne) !== 0)
    z.redIAdd(nOne);

  var c = this.pow(z, q);
  var r = this.pow(a, q.addn(1).ishrn(1));
  var t = this.pow(a, q);
  var m = s;
  while (t.cmp(one) !== 0) {
    var tmp = t;
    for (var i = 0; tmp.cmp(one) !== 0; i++)
      tmp = tmp.redSqr();
    assert(i < m);
    var b = this.pow(c, new BN(1).ishln(m - i - 1));

    r = r.redMul(b);
    c = b.redSqr();
    t = t.redMul(c);
    m = i;
  }

  return r;
};

Red.prototype.invm = function invm(a) {
  var inv = a._invmp(this.m);
  if (inv.sign) {
    inv.sign = false;
    return this.imod(inv).redNeg();
  } else {
    return this.imod(inv);
  }
};

Red.prototype.pow = function pow(a, num) {
  var w = [];

  if (num.cmpn(0) === 0)
    return new BN(1);

  var q = num.clone();

  while (q.cmpn(0) !== 0) {
    w.push(q.andln(1));
    q.ishrn(1);
  }

  // Skip leading zeroes
  var res = a;
  for (var i = 0; i < w.length; i++, res = this.sqr(res))
    if (w[i] !== 0)
      break;

  if (++i < w.length) {
    for (var q = this.sqr(res); i < w.length; i++, q = this.sqr(q)) {
      if (w[i] === 0)
        continue;
      res = this.mul(res, q);
    }
  }

  return res;
};

Red.prototype.convertTo = function convertTo(num) {
  var r = num.mod(this.m);
  if (r === num)
    return r.clone();
  else
    return r;
};

Red.prototype.convertFrom = function convertFrom(num) {
  var res = num.clone();
  res.red = null;
  return res;
};

//
// Montgomery method engine
//

BN.mont = function mont(num) {
  return new Mont(num);
};

function Mont(m) {
  Red.call(this, m);

  this.shift = this.m.bitLength();
  if (this.shift % 26 !== 0)
    this.shift += 26 - (this.shift % 26);
  this.r = new BN(1).ishln(this.shift);
  this.r2 = this.imod(this.r.sqr());
  this.rinv = this.r._invmp(this.m);

  this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
  this.minv.sign = true;
  this.minv = this.minv.mod(this.r);
}
inherits(Mont, Red);

Mont.prototype.convertTo = function convertTo(num) {
  return this.imod(num.shln(this.shift));
};

Mont.prototype.convertFrom = function convertFrom(num) {
  var r = this.imod(num.mul(this.rinv));
  r.red = null;
  return r;
};

Mont.prototype.imul = function imul(a, b) {
  if (a.cmpn(0) === 0 || b.cmpn(0) === 0) {
    a.words[0] = 0;
    a.length = 1;
    return a;
  }

  var t = a.imul(b);
  var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
  var u = t.isub(c).ishrn(this.shift);
  var res = u;
  if (u.cmp(this.m) >= 0)
    res = u.isub(this.m);
  else if (u.cmpn(0) < 0)
    res = u.iadd(this.m);

  return res._forceRed(this);
};

Mont.prototype.mul = function mul(a, b) {
  if (a.cmpn(0) === 0 || b.cmpn(0) === 0)
    return new BN(0)._forceRed(this);

  var t = a.mul(b);
  var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
  var u = t.isub(c).ishrn(this.shift);
  var res = u;
  if (u.cmp(this.m) >= 0)
    res = u.isub(this.m);
  else if (u.cmpn(0) < 0)
    res = u.iadd(this.m);

  return res._forceRed(this);
};

Mont.prototype.invm = function invm(a) {
  // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
  var res = this.imod(a._invmp(this.m).mul(this.r2));
  return res._forceRed(this);
};

})(typeof module === 'undefined' || module, this);

},{}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/constants/der.js":[function(require,module,exports){
var constants = require('../constants');

exports.tagClass = {
  0: 'universal',
  1: 'application',
  2: 'context',
  3: 'private'
};
exports.tagClassByName = constants._reverse(exports.tagClass);

exports.tag = {
  0x00: 'end',
  0x01: 'bool',
  0x02: 'int',
  0x03: 'bitstr',
  0x04: 'octstr',
  0x05: 'null_',
  0x06: 'objid',
  0x07: 'objDesc',
  0x08: 'external',
  0x09: 'real',
  0x0a: 'enum',
  0x0b: 'embed',
  0x0c: 'utf8str',
  0x0d: 'relativeOid',
  0x10: 'seq',
  0x11: 'set',
  0x12: 'numstr',
  0x13: 'printstr',
  0x14: 't61str',
  0x15: 'videostr',
  0x16: 'ia5str',
  0x17: 'utctime',
  0x18: 'gentime',
  0x19: 'graphstr',
  0x1a: 'iso646str',
  0x1b: 'genstr',
  0x1c: 'unistr',
  0x1d: 'charstr',
  0x1e: 'bmpstr'
};
exports.tagByName = constants._reverse(exports.tag);

},{"../constants":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/constants/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/constants/index.js":[function(require,module,exports){
var constants = exports;

// Helper
constants._reverse = function reverse(map) {
  var res = {};

  Object.keys(map).forEach(function(key) {
    // Convert key to integer if it is stringified
    if ((key | 0) == key)
      key = key | 0;

    var value = map[key];
    res[value] = key;
  });

  return res;
};

constants.der = require('./der');

},{"./der":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/constants/der.js"}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/decoders/der.js":[function(require,module,exports){
var inherits = require('util').inherits;

var asn1 = require('../asn1');
var base = asn1.base;
var bignum = asn1.bignum;

// Import DER constants
var der = asn1.constants.der;

function DERDecoder(entity) {
  this.enc = 'der';
  this.name = entity.name;
  this.entity = entity;

  // Construct base tree
  this.tree = new DERNode();
  this.tree._init(entity.body);
};
module.exports = DERDecoder;

DERDecoder.prototype.decode = function decode(data, options) {
  if (!(data instanceof base.DecoderBuffer))
    data = new base.DecoderBuffer(data, options);

  return this.tree._decode(data, options);
};

// Tree methods

function DERNode(parent) {
  base.Node.call(this, 'der', parent);
}
inherits(DERNode, base.Node);

DERNode.prototype._peekTag = function peekTag(buffer, tag, any) {
  if (buffer.isEmpty())
    return false;

  var state = buffer.save();
  var decodedTag = derDecodeTag(buffer, 'Failed to peek tag: "' + tag + '"');
  if (buffer.isError(decodedTag))
    return decodedTag;

  buffer.restore(state);

  return decodedTag.tag === tag || decodedTag.tagStr === tag || any;
};

DERNode.prototype._decodeTag = function decodeTag(buffer, tag, any) {
  var decodedTag = derDecodeTag(buffer,
                                'Failed to decode tag of "' + tag + '"');
  if (buffer.isError(decodedTag))
    return decodedTag;

  var len = derDecodeLen(buffer,
                         decodedTag.primitive,
                         'Failed to get length of "' + tag + '"');

  // Failure
  if (buffer.isError(len))
    return len;

  if (!any &&
      decodedTag.tag !== tag &&
      decodedTag.tagStr !== tag &&
      decodedTag.tagStr + 'of' !== tag) {
    return buffer.error('Failed to match tag: "' + tag + '"');
  }

  if (decodedTag.primitive || len !== null)
    return buffer.skip(len, 'Failed to match body of: "' + tag + '"');

  // Indefinite length... find END tag
  var state = buffer.save();
  var res = this._skipUntilEnd(
      buffer,
      'Failed to skip indefinite length body: "' + this.tag + '"');
  if (buffer.isError(res))
    return res;

  len = buffer.offset - state.offset;
  buffer.restore(state);
  return buffer.skip(len, 'Failed to match body of: "' + tag + '"');
};

DERNode.prototype._skipUntilEnd = function skipUntilEnd(buffer, fail) {
  while (true) {
    var tag = derDecodeTag(buffer, fail);
    if (buffer.isError(tag))
      return tag;
    var len = derDecodeLen(buffer, tag.primitive, fail);
    if (buffer.isError(len))
      return len;

    var res;
    if (tag.primitive || len !== null)
      res = buffer.skip(len)
    else
      res = this._skipUntilEnd(buffer, fail);

    // Failure
    if (buffer.isError(res))
      return res;

    if (tag.tagStr === 'end')
      break;
  }
};

DERNode.prototype._decodeList = function decodeList(buffer, tag, decoder) {
  var result = [];
  while (!buffer.isEmpty()) {
    var possibleEnd = this._peekTag(buffer, 'end');
    if (buffer.isError(possibleEnd))
      return possibleEnd;

    var res = decoder.decode(buffer, 'der');
    if (buffer.isError(res) && possibleEnd)
      break;
    result.push(res);
  }
  return result;
};

DERNode.prototype._decodeStr = function decodeStr(buffer, tag) {
  if (tag === 'octstr') {
    return buffer.raw();
  } else if (tag === 'bitstr') {
    var unused = buffer.readUInt8();
    if (buffer.isError(unused))
      return unused;

    return { unused: unused, data: buffer.raw() };
  } else if (tag === 'ia5str' || tag === 'utf8str') {
    return buffer.raw().toString();
  } else {
    return this.error('Decoding of string type: ' + tag + ' unsupported');
  }
};

DERNode.prototype._decodeObjid = function decodeObjid(buffer, values, relative) {
  var identifiers = [];
  var ident = 0;
  while (!buffer.isEmpty()) {
    var subident = buffer.readUInt8();
    ident <<= 7;
    ident |= subident & 0x7f;
    if ((subident & 0x80) === 0) {
      identifiers.push(ident);
      ident = 0;
    }
  }
  if (subident & 0x80)
    identifiers.push(ident);

  var first = (identifiers[0] / 40) | 0;
  var second = identifiers[0] % 40;

  if (relative)
    result = identifiers;
  else
    result = [first, second].concat(identifiers.slice(1));

  if (values)
    result = values[result.join(' ')];

  return result;
};

DERNode.prototype._decodeTime = function decodeTime(buffer, tag) {
  var str = buffer.raw().toString();
  if (tag === 'gentime') {
    var year = str.slice(0, 4) | 0;
    var mon = str.slice(4, 6) | 0;
    var day = str.slice(6, 8) | 0;
    var hour = str.slice(8, 10) | 0;
    var min = str.slice(10, 12) | 0;
    var sec = str.slice(12, 14) | 0;
  } else if (tag === 'utctime') {
    var year = str.slice(0, 2) | 0;
    var mon = str.slice(2, 4) | 0;
    var day = str.slice(4, 6) | 0;
    var hour = str.slice(6, 8) | 0;
    var min = str.slice(8, 10) | 0;
    var sec = str.slice(10, 12) | 0;
    if (year < 70)
      year = 2000 + year;
    else
      year = 1900 + year;
  } else {
    return this.error('Decoding ' + tag + ' time is not supported yet');
  }

  return Date.UTC(year, mon - 1, day, hour, min, sec, 0);
};

DERNode.prototype._decodeNull = function decodeNull(buffer) {
  return null;
};

DERNode.prototype._decodeBool = function decodeBool(buffer) {
  var res = buffer.readUInt8();
  if (buffer.isError(res))
    return res;
  else
    return res !== 0;
};

DERNode.prototype._decodeInt = function decodeInt(buffer, values) {
  // Bigint, return as it is (assume big endian)
  var raw = buffer.raw();
  var res = new bignum(raw);

  if (values)
    res = values[res.toString(10)] || res;

  return res;
};

DERNode.prototype._use = function use(entity, obj) {
  if (typeof entity === 'function')
    entity = entity(obj);
  return entity._getDecoder('der').tree;
};

// Utility methods

function derDecodeTag(buf, fail) {
  var tag = buf.readUInt8(fail);
  if (buf.isError(tag))
    return tag;

  var cls = der.tagClass[tag >> 6];
  var primitive = (tag & 0x20) === 0;

  // Multi-octet tag - load
  if ((tag & 0x1f) === 0x1f) {
    var oct = tag;
    tag = 0;
    while ((oct & 0x80) === 0x80) {
      oct = buf.readUInt8(fail);
      if (buf.isError(oct))
        return oct;

      tag <<= 7;
      tag |= oct & 0x7f;
    }
  } else {
    tag &= 0x1f;
  }
  var tagStr = der.tag[tag];

  return {
    cls: cls,
    primitive: primitive,
    tag: tag,
    tagStr: tagStr
  };
}

function derDecodeLen(buf, primitive, fail) {
  var len = buf.readUInt8(fail);
  if (buf.isError(len))
    return len;

  // Indefinite form
  if (!primitive && len === 0x80)
    return null;

  // Definite form
  if ((len & 0x80) === 0) {
    // Short form
    return len;
  }

  // Long form
  var num = len & 0x7f;
  if (num >= 4)
    return buf.error('length octect is too long');

  len = 0;
  for (var i = 0; i < num; i++) {
    len <<= 8;
    var j = buf.readUInt8(fail);
    if (buf.isError(j))
      return j;
    len |= j;
  }

  return len;
}

},{"../asn1":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/asn1.js","util":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/decoders/index.js":[function(require,module,exports){
var decoders = exports;

decoders.der = require('./der');
decoders.pem = require('./pem');

},{"./der":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/decoders/der.js","./pem":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/decoders/pem.js"}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/decoders/pem.js":[function(require,module,exports){
const inherits = require('util').inherits;
const Buffer = require('buffer').Buffer;

const asn1 = require('../asn1');
const DERDecoder = require('./der');

function PEMDecoder(entity) {
    DERDecoder.call(this, entity);
    this.enc = 'pem';
};
inherits(PEMDecoder, DERDecoder);
module.exports = PEMDecoder;

PEMDecoder.prototype.decode = function decode(data, options) {
    const lines = data.toString().split(/[\r\n]+/g);

    const label = options.label.toUpperCase();

    const re = /^-----(BEGIN|END) ([^-]+)-----$/;
    let start = -1;
    let end = -1;
    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(re);
        if (match === null)
            continue;

        if (match[2] !== label)
            continue;

        if (start === -1) {
            if (match[1] !== 'BEGIN')
                break;
            start = i;
        } else {
            if (match[1] !== 'END')
                break;
            end = i;
            break;
        }
    }
    if (start === -1 || end === -1)
        throw new Error('PEM section not found for: ' + label);

    const base64 = lines.slice(start + 1, end).join('');
    // Remove excessive symbols
    base64.replace(/[^a-z0-9\+\/=]+/gi, '');

    const input = Buffer.from(base64, 'base64');
    return DERDecoder.prototype.decode.call(this, input, options);
};

},{"../asn1":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/asn1.js","./der":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/decoders/der.js","buffer":false,"util":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/encoders/der.js":[function(require,module,exports){
(function (Buffer){(function (){
const inherits = require('util').inherits;
const asn1 = require('../asn1');
const base = asn1.base;
const bignum = asn1.bignum;

// Import DER constants
const der = asn1.constants.der;

function DEREncoder(entity) {
    this.enc = 'der';
    this.name = entity.name;
    this.entity = entity;

    // Construct base tree
    this.tree = new DERNode();
    this.tree._init(entity.body);
}
module.exports = DEREncoder;

DEREncoder.prototype.encode = function encode(data, reporter) {
    return this.tree._encode(data, reporter).join();
};

// Tree methods

function DERNode(parent) {
    base.Node.call(this, 'der', parent);
}

inherits(DERNode, base.Node);

DERNode.prototype._encodeComposite = function encodeComposite(tag, primitive, cls, content) {
    const encodedTag = encodeTag(tag, primitive, cls, this.reporter);

    // Short form
    if (content.length < 0x80) {
        const header = Buffer.alloc(2);
        header[0] = encodedTag;
        header[1] = content.length;
        return this._createEncoderBuffer([header, content]);
    }

    // Long form
    // Count octets required to store length
    let lenOctets = 1;
    for (let i = content.length; i >= 0x100; i >>= 8)
        lenOctets++;

    const header = Buffer.alloc(1 + 1 + lenOctets);
    header[0] = encodedTag;
    header[1] = 0x80 | lenOctets;

    for (let i = 1 + lenOctets, j = content.length; j > 0; i--, j >>= 8)
        header[i] = j & 0xff;

    return this._createEncoderBuffer([header, content]);
};

DERNode.prototype._encodeStr = function encodeStr(str, tag) {
    if (tag === 'octstr')
        return this._createEncoderBuffer(str);
    else if (tag === 'bitstr')
        return this._createEncoderBuffer([str.unused | 0, str.data]);
    else if (tag === 'ia5str' || tag === 'utf8str')
        return this._createEncoderBuffer(str);
    return this.reporter.error('Encoding of string type: ' + tag +
        ' unsupported');
};

DERNode.prototype._encodeObjid = function encodeObjid(id, values, relative) {
    if (typeof id === 'string') {
        if (!values)
            return this.reporter.error('string objid given, but no values map found');
        if (!values.hasOwnProperty(id))
            return this.reporter.error('objid not found in values map');
        id = values[id].split(/[\s\.]+/g);
        for (let i = 0; i < id.length; i++)
            id[i] |= 0;
    } else if (Array.isArray(id)) {
        id = id.slice();
        for (let i = 0; i < id.length; i++)
            id[i] |= 0;
    }

    if (!Array.isArray(id)) {
        return this.reporter.error('objid() should be either array or string, ' +
            'got: ' + JSON.stringify(id));
    }

    if (!relative) {
        if (id[1] >= 40)
            return this.reporter.error('Second objid identifier OOB');
        id.splice(0, 2, id[0] * 40 + id[1]);
    }

    // Count number of octets
    let size = 0;
    for (let i = 0; i < id.length; i++) {
        let ident = id[i];
        for (size++; ident >= 0x80; ident >>= 7)
            size++;
    }

    const objid = Buffer.alloc(size);
    let offset = objid.length - 1;
    for (let i = id.length - 1; i >= 0; i--) {
        let ident = id[i];
        objid[offset--] = ident & 0x7f;
        while ((ident >>= 7) > 0)
            objid[offset--] = 0x80 | (ident & 0x7f);
    }

    return this._createEncoderBuffer(objid);
};

function two(num) {
    if (num < 10)
        return '0' + num;
    else
        return num;
}

DERNode.prototype._encodeTime = function encodeTime(time, tag) {
    let str;
    const date = new Date(time);

    if (tag === 'gentime') {
        str = [
            two(date.getFullYear()),
            two(date.getUTCMonth() + 1),
            two(date.getUTCDate()),
            two(date.getUTCHours()),
            two(date.getUTCMinutes()),
            two(date.getUTCSeconds()),
            'Z'
        ].join('');
    } else if (tag === 'utctime') {
        str = [
            two(date.getFullYear() % 100),
            two(date.getUTCMonth() + 1),
            two(date.getUTCDate()),
            two(date.getUTCHours()),
            two(date.getUTCMinutes()),
            two(date.getUTCSeconds()),
            'Z'
        ].join('');
    } else {
        this.reporter.error('Encoding ' + tag + ' time is not supported yet');
    }

    return this._encodeStr(str, 'octstr');
};

DERNode.prototype._encodeNull = function encodeNull() {
    return this._createEncoderBuffer('');
};

DERNode.prototype._encodeInt = function encodeInt(num, values) {
    if (typeof num === 'string') {
        if (!values)
            return this.reporter.error('String int or enum given, but no values map');
        if (!values.hasOwnProperty(num)) {
            return this.reporter.error('Values map doesn\'t contain: ' +
                JSON.stringify(num));
        }
        num = values[num];
    }

    // Bignum, assume big endian
    if (typeof num !== 'number' && !Buffer.isBuffer(num)) {
        const numArray = num.toArray();
        if (num.sign === false && numArray[0] & 0x80) {
            numArray.unshift(0);
        }
        num = Buffer.from(numArray);
    }

    if (Buffer.isBuffer(num)) {
        let size = num.length;
        if (num.length === 0)
            size++;

        const out = Buffer.alloc(size);
        num.copy(out);
        if (num.length === 0)
            out[0] = 0
        return this._createEncoderBuffer(out);
    }

    if (num < 0x80)
        return this._createEncoderBuffer(num);

    if (num < 0x100)
        return this._createEncoderBuffer([0, num]);

    let size = 1;
    for (let i = num; i >= 0x100; i >>= 8)
        size++;

    const out = new Array(size);
    for (let i = out.length - 1; i >= 0; i--) {
        out[i] = num & 0xff;
        num >>= 8;
    }
    if (out[0] & 0x80) {
        out.unshift(0);
    }

    return this._createEncoderBuffer(Buffer.from(out));
};

DERNode.prototype._encodeBool = function encodeBool(value) {
    return this._createEncoderBuffer(value ? 0xff : 0);
};

DERNode.prototype._use = function use(entity, obj) {
    if (typeof entity === 'function')
        entity = entity(obj);
    return entity._getEncoder('der').tree;
};

DERNode.prototype._skipDefault = function skipDefault(dataBuffer, reporter, parent) {
    const state = this._baseState;
    let i;
    if (state['default'] === null)
        return false;

    const data = dataBuffer.join();
    if (state.defaultBuffer === undefined)
        state.defaultBuffer = this._encodeValue(state['default'], reporter, parent).join();

    if (data.length !== state.defaultBuffer.length)
        return false;

    for (i = 0; i < data.length; i++)
        if (data[i] !== state.defaultBuffer[i])
            return false;

    return true;
};

// Utility methods

function encodeTag(tag, primitive, cls, reporter) {
    let res;

    if (tag === 'seqof')
        tag = 'seq';
    else if (tag === 'setof')
        tag = 'set';

    if (der.tagByName.hasOwnProperty(tag))
        res = der.tagByName[tag];
    else if (typeof tag === 'number' && (tag | 0) === tag)
        res = tag;
    else
        return reporter.error('Unknown tag: ' + tag);

    if (res >= 0x1f)
        return reporter.error('Multi-octet tag encoding unsupported');

    if (!primitive)
        res |= 0x20;

    res |= (der.tagClassByName[cls || 'universal'] << 6);

    return res;
}

}).call(this)}).call(this,require("buffer").Buffer)

},{"../asn1":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/asn1.js","buffer":false,"util":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/encoders/index.js":[function(require,module,exports){
var encoders = exports;

encoders.der = require('./der');
encoders.pem = require('./pem');

},{"./der":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/encoders/der.js","./pem":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/encoders/pem.js"}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/encoders/pem.js":[function(require,module,exports){
var inherits = require('util').inherits;
var Buffer = require('buffer').Buffer;

var asn1 = require('../asn1');
var DEREncoder = require('./der');

function PEMEncoder(entity) {
  DEREncoder.call(this, entity);
  this.enc = 'pem';
};
inherits(PEMEncoder, DEREncoder);
module.exports = PEMEncoder;

PEMEncoder.prototype.encode = function encode(data, options) {
  var buf = DEREncoder.prototype.encode.call(this, data);

  var p = buf.toString('base64');
  var out = [ '-----BEGIN ' + options.label + '-----' ];
  for (var i = 0; i < p.length; i += 64)
    out.push(p.slice(i, i + 64));
  out.push('-----END ' + options.label + '-----');
  return out.join('\n');
};

},{"../asn1":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/asn1.js","./der":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/encoders/der.js","buffer":false,"util":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/keyEncoder.js":[function(require,module,exports){
(function (Buffer){(function (){
'use strict'

const asn1 = require('./asn1/asn1');
const BN = require('./asn1/bignum/bn');

const ECPrivateKeyASN = asn1.define('ECPrivateKey', function () {
    this.seq().obj(
        this.key('version').int(),
        this.key('privateKey').octstr(),
        this.key('parameters').explicit(0).objid().optional(),
        this.key('publicKey').explicit(1).bitstr().optional()
    )
})

const SubjectPublicKeyInfoASN = asn1.define('SubjectPublicKeyInfo', function () {
    this.seq().obj(
        this.key('algorithm').seq().obj(
            this.key("id").objid(),
            this.key("curve").objid()
        ),
        this.key('pub').bitstr()
    )
})

const curves = {
    secp256k1: {
        curveParameters: [1, 3, 132, 0, 10],
        privatePEMOptions: {label: 'EC PRIVATE KEY'},
        publicPEMOptions: {label: 'PUBLIC KEY'}
    }
}

function assert(val, msg) {
    if (!val) {
        throw new Error(msg || 'Assertion failed')
    }
}

function KeyEncoder(options) {
    if (typeof options === 'string') {
        assert(curves.hasOwnProperty(options), 'Unknown curve ' + options);
        options = curves[options]
    }
    this.options = options;
    this.algorithmID = [1, 2, 840, 10045, 2, 1]
}

KeyEncoder.ECPrivateKeyASN = ECPrivateKeyASN;
KeyEncoder.SubjectPublicKeyInfoASN = SubjectPublicKeyInfoASN;

KeyEncoder.prototype.privateKeyObject = function (rawPrivateKey, rawPublicKey) {
    const privateKeyObject = {
        version: new BN(1),
        privateKey: Buffer.from(rawPrivateKey, 'hex'),
        parameters: this.options.curveParameters,
        pemOptions: {label: "EC PRIVATE KEY"}
    };

    if (rawPublicKey) {
        privateKeyObject.publicKey = {
            unused: 0,
            data: Buffer.from(rawPublicKey, 'hex')
        }
    }

    return privateKeyObject
};

KeyEncoder.prototype.publicKeyObject = function (rawPublicKey) {
    return {
        algorithm: {
            id: this.algorithmID,
            curve: this.options.curveParameters
        },
        pub: {
            unused: 0,
            data: Buffer.from(rawPublicKey, 'hex')
        },
        pemOptions: {label: "PUBLIC KEY"}
    }
}

KeyEncoder.prototype.encodePrivate = function (privateKey, originalFormat, destinationFormat) {
    let privateKeyObject;

    /* Parse the incoming private key and convert it to a private key object */
    if (originalFormat === 'raw') {
        if (!typeof privateKey === 'string') {
            throw 'private key must be a string'
        }
        let privateKeyObject = this.options.curve.keyFromPrivate(privateKey, 'hex'),
            rawPublicKey = privateKeyObject.getPublic('hex')
        privateKeyObject = this.privateKeyObject(privateKey, rawPublicKey)
    } else if (originalFormat === 'der') {
        if (typeof privateKey === 'buffer') {
            // do nothing
        } else if (typeof privateKey === 'string') {
            privateKey = Buffer.from(privateKey, 'hex')
        } else {
            throw 'private key must be a buffer or a string'
        }
        privateKeyObject = ECPrivateKeyASN.decode(privateKey, 'der')
    } else if (originalFormat === 'pem') {
        if (!typeof privateKey === 'string') {
            throw 'private key must be a string'
        }
        privateKeyObject = ECPrivateKeyASN.decode(privateKey, 'pem', this.options.privatePEMOptions)
    } else {
        throw 'invalid private key format'
    }

    /* Export the private key object to the desired format */
    if (destinationFormat === 'raw') {
        return privateKeyObject.privateKey.toString('hex')
    } else if (destinationFormat === 'der') {
        return ECPrivateKeyASN.encode(privateKeyObject, 'der').toString('hex')
    } else if (destinationFormat === 'pem') {
        return ECPrivateKeyASN.encode(privateKeyObject, 'pem', this.options.privatePEMOptions)
    } else {
        throw 'invalid destination format for private key'
    }
}

KeyEncoder.prototype.encodePublic = function (publicKey, originalFormat, destinationFormat) {
    let publicKeyObject;

    /* Parse the incoming public key and convert it to a public key object */
    if (originalFormat === 'raw') {
        if (!typeof publicKey === 'string') {
            throw 'public key must be a string'
        }
        publicKeyObject = this.publicKeyObject(publicKey)
    } else if (originalFormat === 'der') {
        if (typeof publicKey === 'buffer') {
            // do nothing
        } else if (typeof publicKey === 'string') {
            publicKey = Buffer.from(publicKey, 'hex')
        } else {
            throw 'public key must be a buffer or a string'
        }
        publicKeyObject = SubjectPublicKeyInfoASN.decode(publicKey, 'der')
    } else if (originalFormat === 'pem') {
        if (!typeof publicKey === 'string') {
            throw 'public key must be a string'
        }
        publicKeyObject = SubjectPublicKeyInfoASN.decode(publicKey, 'pem', this.options.publicPEMOptions)
    } else {
        throw 'invalid public key format'
    }

    /* Export the private key object to the desired format */
    if (destinationFormat === 'raw') {
        return publicKeyObject.pub.data.toString('hex')
    } else if (destinationFormat === 'der') {
        return SubjectPublicKeyInfoASN.encode(publicKeyObject, 'der').toString('hex')
    } else if (destinationFormat === 'pem') {
        return SubjectPublicKeyInfoASN.encode(publicKeyObject, 'pem', this.options.publicPEMOptions)
    } else {
        throw 'invalid destination format for public key'
    }
}

module.exports = KeyEncoder;
}).call(this)}).call(this,require("buffer").Buffer)

},{"./asn1/asn1":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/asn1.js","./asn1/bignum/bn":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/asn1/bignum/bn.js","buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/DuplexStream.js":[function(require,module,exports){
const stream = require('stream');
const util = require('util');

const Duplex = stream.Duplex;

function DuplexStream(options) {
	if (!(this instanceof DuplexStream)) {
		return new DuplexStream(options);
	}
	Duplex.call(this, options);
}
util.inherits(DuplexStream, Duplex);

DuplexStream.prototype._write = function (chunk, enc, cb) {
	this.push(chunk);
	cb();
};


DuplexStream.prototype._read = function (n) {

};

module.exports = DuplexStream;
},{"stream":false,"util":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/base58.js":[function(require,module,exports){
(function (Buffer){(function (){
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BASE = ALPHABET.length;
const LEADER = ALPHABET.charAt(0);
const FACTOR = Math.log(BASE) / Math.log(256); // log(BASE) / log(256), rounded up
const iFACTOR = Math.log(256) / Math.log(BASE); // log(256) / log(BASE), rounded up

const BASE_MAP = Buffer.alloc(256);
for (let j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255
}
for (let i = 0; i < ALPHABET.length; i++) {
    let x = ALPHABET.charAt(i);
    let xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
        throw new TypeError(x + ' is ambiguous');
    }
    BASE_MAP[xc] = i;
}

function encode(source) {
    if (Array.isArray(source) || source instanceof Uint8Array || typeof source === "string") {
        source = Buffer.from(source);
    }
    if (!Buffer.isBuffer(source)) {
        throw new TypeError('Expected Buffer');
    }
    if (source.length === 0) {
        return '';
    }
    // Skip & count leading zeroes.
    let zeroes = 0;
    let length = 0;
    let pbegin = 0;
    const pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
        pbegin++;
        zeroes++;
    }
    // Allocate enough space in big-endian base58 representation.
    const size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
    const b58 = Buffer.alloc(size);
    // Process the bytes.
    while (pbegin !== pend) {
        let carry = source[pbegin];
        // Apply "b58 = b58 * 256 + ch".
        let i = 0;
        for (let it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
            carry += (256 * b58[it1]) >>> 0;
            b58[it1] = (carry % BASE) >>> 0;
            carry = (carry / BASE) >>> 0;
        }
        if (carry !== 0) {
            throw new Error('Non-zero carry');
        }
        length = i;
        pbegin++;
    }
    // Skip leading zeroes in base58 result.
    let it2 = size - length;
    while (it2 !== size && b58[it2] === 0) {
        it2++;
    }
    // Translate the result into a string.
    let str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
        str += ALPHABET.charAt(b58[it2]);
    }
    return str;
}

function decode(source) {
    if (typeof source !== 'string') {
        throw new TypeError('Expected String');
    }
    if (source.length === 0) {
        return Buffer.alloc(0);
    }
    let psz = 0;
    // Skip leading spaces.
    if (source[psz] === ' ') {
        return;
    }
    // Skip and count leading '1's.
    let zeroes = 0;
    let length = 0;
    while (source[psz] === LEADER) {
        zeroes++;
        psz++;
    }
    // Allocate enough space in big-endian base256 representation.
    const size = (((source.length - psz) * FACTOR) + 1) >>> 0; // log(58) / log(256), rounded up.
    const b256 = Buffer.alloc(size);
    // Process the characters.
    while (source[psz]) {
        // Decode character
        let carry = BASE_MAP[source.charCodeAt(psz)];
        // Invalid character
        if (carry === 255) {
            return;
        }
        let i = 0;
        for (let it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
            carry += (BASE * b256[it3]) >>> 0;
            b256[it3] = (carry % 256) >>> 0;
            carry = (carry / 256) >>> 0;
        }
        if (carry !== 0) {
            throw new Error('Non-zero carry');
        }
        length = i;
        psz++;
    }
    // Skip trailing spaces.
    if (source[psz] === ' ') {
        return;
    }
    // Skip leading zeroes in b256.
    let it4 = size - length;
    while (it4 !== size && b256[it4] === 0) {
        it4++;
    }
    const vch = Buffer.alloc(zeroes + (size - it4));
    vch.fill(0x00, 0, zeroes);
    let j = zeroes;
    while (it4 !== size) {
        vch[j++] = b256[it4++];
    }
    return vch;
}

module.exports = {
    encode,
    decode
};
}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/cryptoUtils.js":[function(require,module,exports){
(function (Buffer){(function (){
const crypto = require('crypto');
const base58 = require('./base58');

const keySizes = [128, 192, 256];
const authenticationModes = ["ocb", "ccm", "gcm"];

function encode(buffer) {
	return buffer.toString('base64')
		.replace(/\+/g, '')
		.replace(/\//g, '')
		.replace(/=+$/, '');
}

function createPskHash(data, encoding) {
	const pskHash = new PskHash();
	pskHash.update(data);
	return pskHash.digest(encoding);
}

function PskHash() {
	const sha512 = crypto.createHash('sha512');
	const sha256 = crypto.createHash('sha256');

	function update(data) {
		sha512.update(data);
	}

	function digest(encoding) {
		sha256.update(sha512.digest());
		return sha256.digest(encoding);
	}

	return {
		update,
		digest
	}
}


function generateSalt(inputData, saltLen) {
	const hash = crypto.createHash('sha512');
	hash.update(inputData);
	const digest = Buffer.from(hash.digest('hex'), 'binary');

	return digest.slice(0, saltLen);
}

function encryptionIsAuthenticated(algorithm) {
	for (const mode of authenticationModes) {
		if (algorithm.includes(mode)) {
			return true;
		}
	}

	return false;
}

function getKeyLength(algorithm) {
	for (const len of keySizes) {
		if (algorithm.includes(len.toString())) {
			return len / 8;
		}
	}

	throw new Error("Invalid encryption algorithm.");
}

function base58Encode(data) {
	return base58.encode(data);
}

function base58Decode(data) {
	return base58.decode(data);
}

module.exports = {
	createPskHash,
	encode,
	generateSalt,
	PskHash,
    base58Encode,
    base58Decode,
	getKeyLength,
	encryptionIsAuthenticated
};


}).call(this)}).call(this,require("buffer").Buffer)

},{"./base58":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/base58.js","buffer":false,"crypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/isStream.js":[function(require,module,exports){
const stream = require('stream');


function isStream (obj) {
	return obj instanceof stream.Stream || obj instanceof stream.Duplex;
}


function isReadable (obj) {
	return isStream(obj) && typeof obj._read === 'function' && typeof obj._readableState === 'object'
}


function isWritable (obj) {
	return isStream(obj) && typeof obj._write === 'function' && typeof obj._writableState === 'object'
}


function isDuplex (obj) {
	return isReadable(obj) && isWritable(obj)
}


module.exports            = isStream;
module.exports.isReadable = isReadable;
module.exports.isWritable = isWritable;
module.exports.isDuplex   = isDuplex;
},{"stream":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/signsensusDS/ssutil.js":[function(require,module,exports){
/*
 SignSens helper functions
 */
const crypto = require('crypto');

exports.wipeOutsidePayload = function wipeOutsidePayload(hashStringHexa, pos, size){
    var result;
    var sz = hashStringHexa.length;

    var end = (pos + size) % sz;

    if(pos < end){
        result = '0'.repeat(pos) +  hashStringHexa.substring(pos, end) + '0'.repeat(sz - end);
    }
    else {
        result = hashStringHexa.substring(0, end) + '0'.repeat(pos - end) + hashStringHexa.substring(pos, sz);
    }
    return result;
}



exports.extractPayload = function extractPayload(hashStringHexa, pos, size){
    var result;

    var sz = hashStringHexa.length;
    var end = (pos + size) % sz;

    if( pos < end){
        result = hashStringHexa.substring(pos, pos + size);
    } else{

        if(0 != end){
            result = hashStringHexa.substring(0, end)
        }  else {
            result = "";
        }
        result += hashStringHexa.substring(pos, sz);
    }
    return result;
}



exports.fillPayload = function fillPayload(payload, pos, size){
    var sz = 64;
    var result = "";

    var end = (pos + size) % sz;

    if( pos < end){
        result = '0'.repeat(pos) + payload + '0'.repeat(sz - end);
    } else{
        result = payload.substring(0,end);
        result += '0'.repeat(pos - end);
        result += payload.substring(end);
    }
    return result;
}



exports.generatePosHashXTimes = function generatePosHashXTimes(buffer, pos, size, count){ //generate positional hash
    var result  = buffer.toString("hex");

    /*if(pos != -1 )
        result[pos] = 0; */

    for(var i = 0; i < count; i++){
        var hash = crypto.createHash('sha256');
        result = exports.wipeOutsidePayload(result, pos, size);
        hash.update(result);
        result = hash.digest('hex');
    }
    return exports.wipeOutsidePayload(result, pos, size);
}

exports.hashStringArray = function (counter, arr, payloadSize){

    const hash = crypto.createHash('sha256');
    var result = counter.toString(16);

    for(var i = 0 ; i < 64; i++){
        result += exports.extractPayload(arr[i],i, payloadSize);
    }

    hash.update(result);
    var result = hash.digest('hex');
    return result;
}






function dumpMember(obj){
    var type = Array.isArray(obj) ? "array" : typeof obj;
    if(obj === null){
        return "null";
    }
    if(obj === undefined){
        return "undefined";
    }

    switch(type){
        case "number":
        case "string":return obj.toString(); break;
        case "object": return exports.dumpObjectForHashing(obj); break;
        case "boolean": return  obj? "true": "false"; break;
        case "array":
            var result = "";
            for(var i=0; i < obj.length; i++){
                result += exports.dumpObjectForHashing(obj[i]);
            }
            return result;
            break;
        default:
            throw new Error("Type " +  type + " cannot be cryptographically digested");
    }

}


exports.dumpObjectForHashing = function(obj){
    var result = "";

    if(obj === null){
        return "null";
    }
    if(obj === undefined){
        return "undefined";
    }

    var basicTypes = {
        "array"     : true,
        "number"    : true,
        "boolean"   : true,
        "string"    : true,
        "object"    : false
    }

    var type = Array.isArray(obj) ? "array" : typeof obj;
    if( basicTypes[type]){
        return dumpMember(obj);
    }

    var keys = Object.keys(obj);
    keys.sort();


    for(var i=0; i < keys.length; i++){
        result += dumpMember(keys[i]);
        result += dumpMember(obj[keys[i]]);
    }

    return result;
}


exports.hashValues  = function (values){
    const hash = crypto.createHash('sha256');
    var result = exports.dumpObjectForHashing(values);
    hash.update(result);
    return hash.digest('hex');
};

exports.getJSONFromSignature = function getJSONFromSignature(signature, size){
    var result = {
        proof:[]
    };
    var a = signature.split(":");
    result.agent        = a[0];
    result.counter      =  parseInt(a[1], "hex");
    result.nextPublic   =  a[2];

    var proof = a[3]


    if(proof.length/size != 64) {
        throw new Error("Invalid signature " + proof);
    }

    for(var i = 0; i < 64; i++){
        result.proof.push(exports.fillPayload(proof.substring(i * size,(i+1) * size ), i, size))
    }

    return result;
}

exports.createSignature = function (agent,counter, nextPublic, arr, size){
    var result = "";

    for(var i = 0; i < arr.length; i++){
        result += exports.extractPayload(arr[i], i , size);
    }

    return agent + ":" + counter + ":" + nextPublic + ":" + result;
}
},{"crypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/soundpubsub/lib/soundPubSub.js":[function(require,module,exports){
/*
Initial License: (c) Axiologic Research & Alboaie Sînică.
Contributors: Axiologic Research , PrivateSky project
Code License: LGPL or MIT.
*/


/**
 *   Usually an event could cause execution of other callback events . We say that is a level 1 event if is causeed by a level 0 event and so on
 *
 *      SoundPubSub provides intuitive results regarding to asynchronous calls of callbacks and computed values/expressions:
 *   we prevent immediate execution of event callbacks to ensure the intuitive final result is guaranteed as level 0 execution
 *   we guarantee that any callback function is "re-entrant"
 *   we are also trying to reduce the number of callback execution by looking in queues at new messages published by
 *   trying to compact those messages (removing duplicate messages, modifying messages, or adding in the history of another event ,etc)
 *
 *      Example of what can be wrong without non-sound asynchronous calls:
 *
 *  Step 0: Initial state:
 *   a = 0;
 *   b = 0;
 *
 *  Step 1: Initial operations:
 *   a = 1;
 *   b = -1;
 *
 *  // an observer reacts to changes in a and b and compute CORRECT like this:
 *   if( a + b == 0) {
 *       CORRECT = false;
 *       notify(...); // act or send a notification somewhere..
 *   } else {
 *      CORRECT = false;
 *   }
 *
 *    Notice that: CORRECT will be true in the end , but meantime, after a notification was sent and CORRECT was wrongly, temporarily false!
 *    soundPubSub guarantee that this does not happen because the syncronous call will before any observer (bot asignation on a and b)
 *
 *   More:
 *   you can use blockCallBacks and releaseCallBacks in a function that change a lot a collection or bindable objects and all
 *   the notifications will be sent compacted and properly
 */

// TODO: optimisation!? use a more efficient queue instead of arrays with push and shift!?
// TODO: see how big those queues can be in real applications
// for a few hundreds items, queues made from array should be enough
//*   Potential TODOs:
//    *     prevent any form of problem by calling callbacks in the expected order !?
//*     preventing infinite loops execution cause by events!?
//*
//*
// TODO: detect infinite loops (or very deep propagation) It is possible!?

const Queue = require('queue');

function SoundPubSub(){

	/**
	 * publish
	 *      Publish a message {Object} to a list of subscribers on a specific topic
	 *
	 * @params {String|Number} target,  {Object} message
	 * @return number of channel subscribers that will be notified
	 */
	this.publish = function(target, message){
		if(!invalidChannelName(target) && !invalidMessageType(message) && (typeof channelSubscribers[target] != 'undefined')){
			compactAndStore(target, message);
			setTimeout(dispatchNext, 0);
			return channelSubscribers[target].length;
		} else{
			return null;
		}
	};

	/**
	 * subscribe
	 *      Subscribe / add a {Function} callBack on a {String|Number}target channel subscribers list in order to receive
	 *      messages published if the conditions defined by {Function}waitForMore and {Function}filter are passed.
	 *
	 * @params {String|Number}target, {Function}callBack, {Function}waitForMore, {Function}filter
	 *
	 *          target      - channel name to subscribe
	 *          callback    - function to be called when a message was published on the channel
	 *          waitForMore - a intermediary function that will be called after a successfuly message delivery in order
	 *                          to decide if a new messages is expected...
	 *          filter      - a function that receives the message before invocation of callback function in order to allow
	 *                          relevant message before entering in normal callback flow
	 * @return
	 */
	this.subscribe = function(target, callBack, waitForMore, filter){
		if(!invalidChannelName(target) && !invalidFunction(callBack)){
			var subscriber = {"callBack":callBack, "waitForMore":waitForMore, "filter":filter};
			var arr = channelSubscribers[target];
			if(typeof arr == 'undefined'){
				arr = [];
				channelSubscribers[target] = arr;
			}
			arr.push(subscriber);
		}
	};

	/**
	 * unsubscribe
	 *      Unsubscribe/remove {Function} callBack from the list of subscribers of the {String|Number} target channel
	 *
	 * @params {String|Number} target, {Function} callBack, {Function} filter
	 *
	 *          target      - channel name to unsubscribe
	 *          callback    - reference of the original function that was used as subscribe
	 *          filter      - reference of the original filter function
	 * @return
	 */
	this.unsubscribe = function(target, callBack, filter){
		if(!invalidFunction(callBack)){
			var gotit = false;
			if(channelSubscribers[target]){
				for(var i = 0; i < channelSubscribers[target].length;i++){
					var subscriber =  channelSubscribers[target][i];
					if(subscriber.callBack === callBack && ( typeof filter === 'undefined' || subscriber.filter === filter )){
						gotit = true;
						subscriber.forDelete = true;
						subscriber.callBack = undefined;
						subscriber.filter = undefined;
					}
				}
			}
			if(!gotit){
				wprint("Unable to unsubscribe a callback that was not subscribed!");
			}
		}
	};

	/**
	 * blockCallBacks
	 *
	 * @params
	 * @return
	 */
	this.blockCallBacks = function(){
		level++;
	};

	/**
	 * releaseCallBacks
	 *
	 * @params
	 * @return
	 */
	this.releaseCallBacks = function(){
		level--;
		//hack/optimisation to not fill the stack in extreme cases (many events caused by loops in collections,etc)
		while(level === 0 && dispatchNext(true)){
			//nothing
		}

		while(level === 0 && callAfterAllEvents()){
            //nothing
		}
	};

	/**
	 * afterAllEvents
	 *
	 * @params {Function} callback
	 *
	 *          callback - function that needs to be invoked once all events are delivered
	 * @return
	 */
	this.afterAllEvents = function(callBack){
		if(!invalidFunction(callBack)){
			afterEventsCalls.push(callBack);
		}
		this.blockCallBacks();
		this.releaseCallBacks();
	};

	/**
	 * hasChannel
	 *
	 * @params {String|Number} channel
	 *
	 *          channel - name of the channel that need to be tested if present
	 * @return
	 */
	this.hasChannel = function(channel){
		return !invalidChannelName(channel) && (typeof channelSubscribers[channel] != 'undefined') ? true : false;
	};

	/**
	 * addChannel
	 *
	 * @params {String} channel
	 *
	 *          channel - name of a channel that needs to be created and added to soundpubsub repository
	 * @return
	 */
	this.addChannel = function(channel){
		if(!invalidChannelName(channel) && !this.hasChannel(channel)){
			channelSubscribers[channel] = [];
		}
	};

	/* ---------------------------------------- protected stuff ---------------------------------------- */
	var self = this;
	// map channelName (object local id) -> array with subscribers
	var channelSubscribers = {};

	// map channelName (object local id) -> queue with waiting messages
	var channelsStorage = {};

	// object
	var typeCompactor = {};

	// channel names
	var executionQueue = new Queue();
	var level = 0;



	/**
	 * registerCompactor
	 *
	 *       An compactor takes a newEvent and and oldEvent and return the one that survives (oldEvent if
	 *  it can compact the new one or the newEvent if can't be compacted)
	 *
	 * @params {String} type, {Function} callBack
	 *
	 *          type        - channel name to unsubscribe
	 *          callBack    - handler function for that specific event type
	 * @return
	 */
	this.registerCompactor = function(type, callBack) {
		if(!invalidFunction(callBack)){
			typeCompactor[type] = callBack;
		}
	};

	/**
	 * dispatchNext
	 *
	 * @param fromReleaseCallBacks: hack to prevent too many recursive calls on releaseCallBacks
	 * @return {Boolean}
	 */
	function dispatchNext(fromReleaseCallBacks){
		if(level > 0) {
			return false;
		}
		const channelName = executionQueue.front();
		if(typeof channelName != 'undefined'){
			self.blockCallBacks();
			try{
				let message;
				if(!channelsStorage[channelName].isEmpty()) {
					message = channelsStorage[channelName].front();
				}
				if(typeof message == 'undefined'){
					if(!channelsStorage[channelName].isEmpty()){
						wprint("Can't use as message in a pub/sub channel this object: " + message);
					}
					executionQueue.pop();
				} else {
					if(typeof message.__transmisionIndex == 'undefined'){
						message.__transmisionIndex = 0;
						for(var i = channelSubscribers[channelName].length-1; i >= 0 ; i--){
							var subscriber =  channelSubscribers[channelName][i];
							if(subscriber.forDelete === true){
								channelSubscribers[channelName].splice(i,1);
							}
						}
					} else{
						message.__transmisionIndex++;
					}
					//TODO: for immutable objects it will not work also, fix for shape models
					if(typeof message.__transmisionIndex == 'undefined'){
						wprint("Can't use as message in a pub/sub channel this object: " + message);
					}
					subscriber = channelSubscribers[channelName][message.__transmisionIndex];
					if(typeof subscriber == 'undefined'){
						delete message.__transmisionIndex;
						channelsStorage[channelName].pop();
					} else{
						if(subscriber.filter === null || typeof subscriber.filter === "undefined" || (!invalidFunction(subscriber.filter) && subscriber.filter(message))){
							if(!subscriber.forDelete){
								subscriber.callBack(message);
								if(subscriber.waitForMore && !invalidFunction(subscriber.waitForMore) && !subscriber.waitForMore(message)){
									subscriber.forDelete = true;
								}
							}
						}
					}
				}
			} catch(err){
				wprint("Event callback failed: "+ subscriber.callBack +"error: " + err.stack);
			}
			//
			if(fromReleaseCallBacks){
				level--;
			} else{
				self.releaseCallBacks();
			}
			return true;
		} else{
			return false;
		}
	}

	function compactAndStore(target, message){
		var gotCompacted = false;
		var arr = channelsStorage[target];
		if(typeof arr == 'undefined'){
			arr = new Queue();
			channelsStorage[target] = arr;
		}

		if(message && typeof message.type != 'undefined'){
			var typeCompactorCallBack = typeCompactor[message.type];

			if(typeof typeCompactorCallBack != 'undefined'){
				for(let channel of arr) {
					if(typeCompactorCallBack(message, channel) === channel) {
						if(typeof channel.__transmisionIndex == 'undefined') {
							gotCompacted = true;
							break;
						}
					}
				}
			}
		}

		if(!gotCompacted && message){
			arr.push(message);
			executionQueue.push(target);
		}
	}

	var afterEventsCalls = new Queue();
	function callAfterAllEvents (){
		if(!afterEventsCalls.isEmpty()){
			var callBack = afterEventsCalls.pop();
			//do not catch exceptions here..
			callBack();
		}
		return !afterEventsCalls.isEmpty();
	}

	function invalidChannelName(name){
		var result = false;
		if(!name || (typeof name != "string" && typeof name != "number")){
			result = true;
			wprint("Invalid channel name: " + name);
		}

		return result;
	}

	function invalidMessageType(message){
		var result = false;
		if(!message || typeof message != "object"){
			result = true;
			wprint("Invalid messages types: " + message);
		}
		return result;
	}

	function invalidFunction(callback){
		var result = false;
		if(!callback || typeof callback != "function"){
			result = true;
			wprint("Expected to be function but is: " + callback);
		}
		return result;
	}
}

exports.soundPubSub = new SoundPubSub();

},{"queue":"queue"}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Combos.js":[function(require,module,exports){
function product(args) {
    if(!args.length){
        return [ [] ];
    }
    var prod = product(args.slice(1)), r = [];
    args[0].forEach(function(x) {
        prod.forEach(function(p) {
            r.push([ x ].concat(p));
        });
    });
    return r;
}

function objectProduct(obj) {
    var keys = Object.keys(obj),
        values = keys.map(function(x) { return obj[x]; });

    return product(values).map(function(p) {
        var e = {};
        keys.forEach(function(k, n) { e[k] = p[n]; });
        return e;
    });
}

module.exports = objectProduct;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/OwM.js":[function(require,module,exports){
var meta = "meta";

function OwM(serialized){

    if(serialized){
        return OwM.prototype.convert(serialized);
    }

    Object.defineProperty(this, meta, {
        writable: false,
        enumerable: true,
        value: {}
    });

    Object.defineProperty(this, "setMeta", {
        writable: false,
        enumerable: false,
        configurable:false,
        value: function(prop, value){
            if(typeof prop == "object" && typeof value == "undefined"){
                for(var p in prop){
                    this[meta][p] = prop[p];
                }
                return prop;
            }
            this[meta][prop] = value;
            return value;
        }
    });

    Object.defineProperty(this, "getMeta", {
        writable: false,
        value: function(prop){
            return this[meta][prop];
        }
    });
}

function testOwMSerialization(obj){
    let res = false;

    if(obj){
        res = typeof obj[meta] != "undefined" && !(obj instanceof OwM);
    }

    return res;
}

OwM.prototype.convert = function(serialized){
    const owm = new OwM();

    for(var metaProp in serialized.meta){
        if(!testOwMSerialization(serialized[metaProp])) {
            owm.setMeta(metaProp, serialized.meta[metaProp]);
        }else{
            owm.setMeta(metaProp, OwM.prototype.convert(serialized.meta[metaProp]));
        }
    }

    for(var simpleProp in serialized){
        if(simpleProp === meta) {
            continue;
        }

        if(!testOwMSerialization(serialized[simpleProp])){
            owm[simpleProp] = serialized[simpleProp];
        }else{
            owm[simpleProp] = OwM.prototype.convert(serialized[simpleProp]);
        }
    }

    return owm;
};

OwM.prototype.getMetaFrom = function(obj, name){
    var res;
    if(!name){
        res = obj[meta];
    }else{
        res = obj[meta][name];
    }
    return res;
};

OwM.prototype.setMetaFor = function(obj, name, value){
    obj[meta][name] = value;
    return obj[meta][name];
};

module.exports = OwM;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Queue.js":[function(require,module,exports){
function QueueElement(content) {
	this.content = content;
	this.next = null;
}

function Queue() {
	this.head = null;
	this.tail = null;
	this.length = 0;
	this.push = function (value) {
		const newElement = new QueueElement(value);
		if (!this.head) {
			this.head = newElement;
			this.tail = newElement;
		} else {
			this.tail.next = newElement;
			this.tail = newElement;
		}
		this.length++;
	};

	this.pop = function () {
		if (!this.head) {
			return null;
		}
		const headCopy = this.head;
		this.head = this.head.next;
		this.length--;

		//fix???????
		if(this.length === 0){
            this.tail = null;
		}

		return headCopy.content;
	};

	this.front = function () {
		return this.head ? this.head.content : undefined;
	};

	this.isEmpty = function () {
		return this.head === null;
	};

	this[Symbol.iterator] = function* () {
		let head = this.head;
		while(head !== null) {
			yield head.content;
			head = head.next;
		}
	}.bind(this);
}

Queue.prototype.toString = function () {
	let stringifiedQueue = '';
	let iterator = this.head;
	while (iterator) {
		stringifiedQueue += `${JSON.stringify(iterator.content)} `;
		iterator = iterator.next;
	}
	return stringifiedQueue;
};

Queue.prototype.inspect = Queue.prototype.toString;

module.exports = Queue;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/SwarmPacker.js":[function(require,module,exports){
const HEADER_SIZE_RESEARVED = 4;

function SwarmPacker(){
}

function copyStringtoArrayBuffer(str, buffer){
    if(typeof str !== "string"){
        throw new Error("Wrong param type received");
    }
    for(var i = 0; i < str.length; i++) {
        buffer[i] = str.charCodeAt(i);
    }
    return buffer;
}

function copyFromBuffer(target, source){
    for(let i=0; i<source.length; i++){
        target[i] = source[i];
    }
    return target;
}

let serializers = {};

SwarmPacker.registerSerializer = function(name, implementation){
    if(serializers[name]){
        throw new Error("Serializer name already exists");
    }
    serializers[name] = implementation;
};

function getSerializer(name){
    return serializers[name];
}

SwarmPacker.getSerializer = getSerializer;

Object.defineProperty(SwarmPacker.prototype, "JSON", {value: "json"});
Object.defineProperty(SwarmPacker.prototype, "MSGPACK", {value: "msgpack"});

SwarmPacker.registerSerializer(SwarmPacker.prototype.JSON, {
    serialize: JSON.stringify,
    deserialize: (serialization)=>{
        if(typeof serialization !== "string"){
            serialization = String.fromCharCode.apply(null, serialization);
        }
        return JSON.parse(serialization);
    },
    getType: ()=>{
        return SwarmPacker.prototype.JSON;
    }
});

function registerMsgPackSerializer(){
    const mp = '@msgpack/msgpack';
    let msgpack;

    try{
        msgpack = require(mp);
        if (typeof msgpack === "undefined") {
            throw new Error("msgpack is unavailable.")
        }
    }catch(err){
        console.log("msgpack not available. If you need msgpack serialization include msgpack in one of your bundles");
        //preventing msgPack serializer being register if msgPack dep is not found.
        return;
    }

    SwarmPacker.registerSerializer(SwarmPacker.prototype.MSGPACK, {
        serialize: msgpack.encode,
        deserialize: msgpack.decode,
        getType: ()=>{
            return SwarmPacker.prototype.MSGPACK;
        }
    });
}

registerMsgPackSerializer();

SwarmPacker.pack = function(swarm, serializer){

    let jsonSerializer = getSerializer(SwarmPacker.prototype.JSON);
    if(typeof serializer === "undefined"){
        serializer = jsonSerializer;
    }

    let swarmSerialization = serializer.serialize(swarm);

    let header = {
        command: swarm.getMeta("command"),
        swarmId : swarm.getMeta("swarmId"),
        swarmTypeName: swarm.getMeta("swarmTypeName"),
        swarmTarget: swarm.getMeta("target"),
        serializationType: serializer.getType()
    };

    header = serializer.serialize(header);

    if(header.length >= Math.pow(2, 32)){
        throw new Error("Swarm serialization too big.");
    }

    //arraybuffer construction
    let size = HEADER_SIZE_RESEARVED + header.length + swarmSerialization.length;
    let pack = new ArrayBuffer(size);

    let sizeHeaderView = new DataView(pack, 0);
    sizeHeaderView.setUint32(0, header.length);

    let headerView = new Uint8Array(pack, HEADER_SIZE_RESEARVED);
    copyStringtoArrayBuffer(header, headerView);

    let serializationView = new Uint8Array(pack, HEADER_SIZE_RESEARVED+header.length);
    if(typeof swarmSerialization === "string"){
        copyStringtoArrayBuffer(swarmSerialization, serializationView);
    }else{
        copyFromBuffer(serializationView, swarmSerialization);
    }

    return pack;
};

SwarmPacker.unpack = function(pack){
    let jsonSerialiser = SwarmPacker.getSerializer(SwarmPacker.prototype.JSON);
    let headerSerialization = getHeaderSerializationFromPack(pack);
    let header = jsonSerialiser.deserialize(headerSerialization);

    let serializer = SwarmPacker.getSerializer(header.serializationType);
    let messageView = new Uint8Array(pack, HEADER_SIZE_RESEARVED+headerSerialization.length);

    let swarm = serializer.deserialize(messageView);
    return swarm;
};

function getHeaderSerializationFromPack(pack){
    let headerSize = new DataView(pack).getUint32(0);

    let headerView = new Uint8Array(pack, HEADER_SIZE_RESEARVED, headerSize);
    return headerView;
}

SwarmPacker.getHeader = function(pack){
    let jsonSerialiser = SwarmPacker.getSerializer(SwarmPacker.prototype.JSON);
    let header = jsonSerialiser.deserialize(getHeaderSerializationFromPack(pack));

    return header;
};
module.exports = SwarmPacker;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/TaskCounter.js":[function(require,module,exports){

function TaskCounter(finalCallback) {
	let results = [];
	let errors = [];

	let started = 0;

	function decrement(err, res) {
		if(err) {
			errors.push(err);
		}

		if(arguments.length > 2) {
			arguments[0] = undefined;
			res = arguments;
		}

		if(typeof res !== "undefined") {
			results.push(res);
		}

		if(--started <= 0) {
            return callCallback();
		}
	}

	function increment(amount = 1) {
		started += amount;
	}

	function callCallback() {
	    if(errors && errors.length === 0) {
	        errors = undefined;
        }

	    if(results && results.length === 0) {
	        results = undefined;
        }

        finalCallback(errors, results);
    }

	return {
		increment,
		decrement
	};
}

module.exports = TaskCounter;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/beesHealer.js":[function(require,module,exports){
const OwM = require("./OwM");

/*
    Prepare the state of a swarm to be serialised
*/

exports.asJSON = function(valueObj, phaseName, args, callback){

        let valueObject = valueObj.valueOf();
        let res = new OwM();
        res.publicVars          = valueObject.publicVars;
        res.privateVars         = valueObject.privateVars;

        res.setMeta("COMMAND_ARGS",        OwM.prototype.getMetaFrom(valueObject, "COMMAND_ARGS"));
        res.setMeta("SecurityParadigm",        OwM.prototype.getMetaFrom(valueObject, "SecurityParadigm"));
        res.setMeta("swarmTypeName", OwM.prototype.getMetaFrom(valueObject, "swarmTypeName"));
        res.setMeta("swarmId",       OwM.prototype.getMetaFrom(valueObject, "swarmId"));
        res.setMeta("target",        OwM.prototype.getMetaFrom(valueObject, "target"));
        res.setMeta("homeSecurityContext",        OwM.prototype.getMetaFrom(valueObject, "homeSecurityContext"));
        res.setMeta("requestId",        OwM.prototype.getMetaFrom(valueObject, "requestId"));


        if(!phaseName){
            res.setMeta("command", "stored");
        } else {
            res.setMeta("phaseName", phaseName);
            res.setMeta("phaseId", $$.uidGenerator.safe_uuid());
            res.setMeta("args", args);
            res.setMeta("command", OwM.prototype.getMetaFrom(valueObject, "command") || "executeSwarmPhase");
        }

        res.setMeta("waitStack", valueObject.meta.waitStack); //TODO: think if is not better to be deep cloned and not referenced!!!

        if(callback){
            return callback(null, res);
        }
        //console.log("asJSON:", res, valueObject);
        return res;
};

exports.jsonToNative = function(serialisedValues, result){

    for(let v in serialisedValues.publicVars){
        result.publicVars[v] = serialisedValues.publicVars[v];

    };
    for(let l in serialisedValues.privateVars){
        result.privateVars[l] = serialisedValues.privateVars[l];
    };

    for(let i in OwM.prototype.getMetaFrom(serialisedValues)){
        OwM.prototype.setMetaFor(result, i, OwM.prototype.getMetaFrom(serialisedValues, i));
    };

};
},{"./OwM":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/OwM.js"}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/path.js":[function(require,module,exports){
function replaceAll(str, search, replacement) {
    return str.split(search).join(replacement);
}

function resolvePath(pth) {
    let pathSegments = pth.split("/");
    let makeAbsolute = pathSegments[0] === "" ? true : false;
    for (let i = 0; i < pathSegments.length; i++) {
        let segment = pathSegments[i];
        if (segment === "..") {
            let j = 1;
            if (i > 0) {
                j = j + 1;
            }
            // else {
            //     makeAbsolute = true;
            // }
            pathSegments.splice(i + 1 - j, j);
            i = i - j;
        }
    }
    let res = pathSegments.join("/");
    if (makeAbsolute && res !== "") {
        res = __ensureIsAbsolute(res);
    }
    return res;
}

function normalize(pth) {
    if (typeof pth !== "string") {
        throw new TypeError();
    }
    pth = replaceAll(pth, "\\", "/");
    pth = replaceAll(pth, /[/]+/, "/");

    return resolvePath(pth);
}

function join(...args) {
    let pth = "";
    for (let i = 0; i < args.length; i++) {
        if (i !== 0 && args[i - 1] !== "") {
            pth += "/";
        }

        pth += args[i];
    }

    return normalize(pth);
}

function __ensureIsAbsolute(pth) {
    if (pth[0] !== "/") {
        pth = "/" + pth;
    }
    return pth;
}

function isAbsolute(pth) {
    pth = normalize(pth);
    //on windows ":" is used as separator after partition ID
    if (pth[0] !== "/" && pth[1] !== ":") {
        return false;
    }

    return true;
}

function ensureIsAbsolute(pth) {
    pth = normalize(pth);
    return __ensureIsAbsolute(pth);
}

function isSubpath(path, subPath) {
    path = normalize(path);
    subPath = normalize(subPath);
    let result = false;
    if (path.indexOf(subPath) === 0) {
        let char = path[subPath.length];
        if (char === "" || char === "/" || subPath === "/") {
            result = true;
        }
    }

    return result;
}

function dirname(path) {
    if (path === "/") {
        return path;
    }
    const pathSegments = path.split("/");
    pathSegments.pop();
    return ensureIsAbsolute(pathSegments.join("/"));
}

function basename(path) {
    if (path === "/") {
        return path;
    }
    return path.split("/").pop;
}

function relative(from, to) {
    from = normalize(from);
    to = normalize(to);

    const fromSegments = from.split("/");
    const toSegments = to.split("/");
    let splitIndex;
    for (let i = 0; i < fromSegments.length; i++) {
        if (fromSegments[i] !== toSegments[i]) {
            break;
        }
        splitIndex = i;
    }

    if (typeof splitIndex === "undefined") {
        throw Error(`The paths <${from}> and <${to}> have nothing in common`);
    }

    splitIndex++;
    let relativePath = [];
    for (let i = splitIndex; i < fromSegments.length; i++) {
        relativePath.push("..");
    }
    for (let i = splitIndex; i < toSegments.length; i++) {
        relativePath.push(toSegments[i]);
    }

    return relativePath.join("/");
}

function resolve(...pathArr) {
    function __resolvePathRecursively(currentPath) {
        let lastSegment = pathArr.pop();
        if (typeof currentPath === "undefined") {
            currentPath = lastSegment;
        } else {
            currentPath = join(lastSegment, currentPath);
        }
        if (isAbsolute(currentPath)) {
            return currentPath;
        }

        if (pathArr.length === 0) {
            let cwd;
            try {
                cwd = process.cwd();
            } catch (e) {
                cwd = "/";
            }

            return join(cwd, currentPath);
        }

        return __resolvePathRecursively(currentPath);
    }

    return __resolvePathRecursively();
}

function extname(path){
    path = resolvePath(path);
    let ext = path.match(/\.[0-9a-z]+$/i);
    if (Array.isArray(ext)) {
        ext = ext[0];
    } else {
        ext = "";
    }
    return ext;
}

module.exports = {
    normalize,
    join,
    isAbsolute,
    ensureIsAbsolute,
    isSubpath,
    dirname,
    basename,
    relative,
    resolve,
    extname
};

},{}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/pingpongFork.js":[function(require,module,exports){
const PING = "PING";
const PONG = "PONG";

module.exports.fork = function pingPongFork(modulePath, args, options){
    const child_process = require("child_process");
    const defaultStdio = ["inherit", "inherit", "inherit", "ipc"];

    if(!options){
        options = {stdio: defaultStdio};
    }else{
        if(typeof options.stdio === "undefined"){
            options.stdio = defaultStdio;
        }

        let stdio = options.stdio;
        if(stdio.length<3){
            for(let i=stdio.length; i<4; i++){
                stdio.push("inherit");
            }
            stdio.push("ipc");
        }
    }

    let child = child_process.fork(modulePath, args, options);

    child.on("message", (message)=>{
        if(message === PING){
            child.send(PONG);
        }
    });

    return child;
};

module.exports.enableLifeLine = function(timeout){

    if(typeof process.send === "undefined"){
        console.log("\"process.send\" not found. LifeLine mechanism disabled!");
        return;
    }

    let lastConfirmationTime;
    const interval = timeout || 2000;

    // this is needed because new Date().getTime() has reduced precision to mitigate timer based attacks
    // for more information see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime
    const roundingError = 101;

    function sendPing(){
        try {
            process.send(PING);
        } catch (e) {
            console.log('Parent is not available, shutting down');
            exit(1)
        }
    }

    process.on("message", function (message){
        if(message === PONG){
            lastConfirmationTime = new Date().getTime();
        }
    });

    function exit(code){
        setTimeout(()=>{
            process.exit(code);
        }, 0);
    }

    const exceptionEvents = ["SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException", "SIGTERM", "SIGHUP"];
    let killingSignal = false;
    for(let i=0; i<exceptionEvents.length; i++){
        process.on(exceptionEvents[i], (event, code)=>{
            killingSignal = true;
            clearInterval(timeoutInterval);
            console.log(`Caught event type [${exceptionEvents[i]}]. Shutting down...`, code, event);
            exit(code);
        });
    }

    const timeoutInterval = setInterval(function(){
        const currentTime = new Date().getTime();

        if(typeof lastConfirmationTime === "undefined" || currentTime - lastConfirmationTime < interval + roundingError && !killingSignal){
            sendPing();
        }else{
            console.log("Parent process did not answer. Shutting down...", process.argv, killingSignal);
            exit(1);
        }
    }, interval);
};
},{"child_process":false}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/pskconsole.js":[function(require,module,exports){
var commands = {};
var commands_help = {};

//global function addCommand
addCommand = function addCommand(verb, adverbe, funct, helpLine){
    var cmdId;
    if(!helpLine){
        helpLine = " ";
    } else {
        helpLine = " " + helpLine;
    }
    if(adverbe){
        cmdId = verb + " " +  adverbe;
        helpLine = verb + " " +  adverbe + helpLine;
    } else {
        cmdId = verb;
        helpLine = verb + helpLine;
    }
    commands[cmdId] = funct;
        commands_help[cmdId] = helpLine;
};

function doHelp(){
    console.log("List of commands:");
    for(var l in commands_help){
        console.log("\t", commands_help[l]);
    }
}

addCommand("-h", null, doHelp, "\t\t\t\t\t\t |just print the help");
addCommand("/?", null, doHelp, "\t\t\t\t\t\t |just print the help");
addCommand("help", null, doHelp, "\t\t\t\t\t\t |just print the help");


function runCommand(){
  var argv = Object.assign([], process.argv);
  var cmdId = null;
  var cmd = null;
  argv.shift();
  argv.shift();

  if(argv.length >=1){
      cmdId = argv[0];
      cmd = commands[cmdId];
      argv.shift();
  }


  if(!cmd && argv.length >=1){
      cmdId = cmdId + " " + argv[0];
      cmd = commands[cmdId];
      argv.shift();
  }

  if(!cmd){
    if(cmdId){
        console.log("Unknown command: ", cmdId);
    }
    cmd = doHelp;
  }

  cmd.apply(null,argv);

}

module.exports = {
    runCommand
};


},{}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/safe-uuid.js":[function(require,module,exports){

function encode(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '')
        .replace(/\//g, '')
        .replace(/=+$/, '');
};

function stampWithTime(buf, salt, msalt){
    if(!salt){
        salt = 1;
    }
    if(!msalt){
        msalt = 1;
    }
    var date = new Date;
    var ct = Math.floor(date.getTime() / salt);
    var counter = 0;
    while(ct > 0 ){
        //console.log("Counter", counter, ct);
        buf[counter*msalt] = Math.floor(ct % 256);
        ct = Math.floor(ct / 256);
        counter++;
    }
}

/*
    The uid contains around 256 bits of randomness and are unique at the level of seconds. This UUID should by cryptographically safe (can not be guessed)

    We generate a safe UID that is guaranteed unique (by usage of a PRNG to geneate 256 bits) and time stamping with the number of seconds at the moment when is generated
    This method should be safe to use at the level of very large distributed systems.
    The UUID is stamped with time (seconds): does it open a way to guess the UUID? It depends how safe is "crypto" PRNG, but it should be no problem...

 */

var generateUid = null;


exports.init = function(externalGenerator){
    generateUid = externalGenerator.generateUid;
    return module.exports;
};

exports.safe_uuid = function() {
    var buf = generateUid(32);
    stampWithTime(buf, 1000, 3);
    return encode(buf);
};



/*
    Try to generate a small UID that is unique against chance in the same millisecond second and in a specific context (eg in the same choreography execution)
    The id contains around 6*8 = 48  bits of randomness and are unique at the level of milliseconds
    This method is safe on a single computer but should be used with care otherwise
    This UUID is not cryptographically safe (can be guessed)
 */
exports.short_uuid = function(callback) {
    require('crypto').randomBytes(12, function (err, buf) {
        if (err) {
            callback(err);
            return;
        }
        stampWithTime(buf,1,2);
        callback(null, encode(buf));
    });
};
},{"crypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/uidGenerator.js":[function(require,module,exports){
(function (Buffer){(function (){
const crypto = require('crypto');
const Queue = require("./Queue");
var PSKBuffer = typeof $$ !== "undefined" && $$.PSKBuffer ? $$.PSKBuffer : Buffer;

function UidGenerator(minBuffers, buffersSize) {
    var buffers = new Queue();
    var lowLimit = .2;

    function fillBuffers(size) {
        //notifyObserver();
        const sz = size || minBuffers;
        if (buffers.length < Math.floor(minBuffers * lowLimit)) {
            for (var i = buffers.length; i < sz; i++) {
                generateOneBuffer(null);
            }
        }
    }

    fillBuffers();

    function generateOneBuffer(b) {
        if (!b) {
            b = PSKBuffer.alloc(0);
        }
        const sz = buffersSize - b.length;
        /*crypto.randomBytes(sz, function (err, res) {
            buffers.push(Buffer.concat([res, b]));
            notifyObserver();
        });*/
        buffers.push(PSKBuffer.concat([crypto.randomBytes(sz), b]));
        notifyObserver();
    }

    function extractN(n) {
        var sz = Math.floor(n / buffersSize);
        var ret = [];

        for (var i = 0; i < sz; i++) {
            ret.push(buffers.pop());
            setTimeout(generateOneBuffer, 1);
        }


        var remainder = n % buffersSize;
        if (remainder > 0) {
            var front = buffers.pop();
            ret.push(front.slice(0, remainder));
            //generateOneBuffer(front.slice(remainder));
            setTimeout(function () {
                generateOneBuffer(front.slice(remainder));
            }, 1);
        }

        //setTimeout(fillBuffers, 1);

        return Buffer.concat(ret);
    }

    var fillInProgress = false;

    this.generateUid = function (n) {
        var totalSize = buffers.length * buffersSize;
        if (n <= totalSize) {
            return extractN(n);
        } else {
            if (!fillInProgress) {
                fillInProgress = true;
                setTimeout(function () {
                    fillBuffers(Math.floor(minBuffers * 2.5));
                    fillInProgress = false;
                }, 1);
            }
            return crypto.randomBytes(n);
        }
    };

    var observer;
    this.registerObserver = function (obs) {
        if (observer) {
            console.error(new Error("One observer allowed!"));
        } else {
            if (typeof obs == "function") {
                observer = obs;
                //notifyObserver();
            }
        }
    };

    function notifyObserver() {
        if (observer) {
            var valueToReport = buffers.length * buffersSize;
            setTimeout(function () {
                observer(null, {"size": valueToReport});
            }, 10);
        }
    }
}

module.exports.createUidGenerator = function (minBuffers, bufferSize) {
    return new UidGenerator(minBuffers, bufferSize);
};

}).call(this)}).call(this,require("buffer").Buffer)

},{"./Queue":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Queue.js","buffer":false,"crypto":false}],"/home/travis/build/PrivateSky/privatesky/node_modules/is-buffer/index.js":[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],"bdns":[function(require,module,exports){
module.exports.create = () => {
    const BDNS = require("./lib/BDNS");
    return new BDNS()
};

},{"./lib/BDNS":"/home/travis/build/PrivateSky/privatesky/modules/bdns/lib/BDNS.js"}],"buffer-crc32":[function(require,module,exports){
var Buffer = require('buffer').Buffer;

var CRC_TABLE = [
  0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419,
  0x706af48f, 0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4,
  0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07,
  0x90bf1d91, 0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de,
  0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856,
  0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9,
  0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4,
  0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b,
  0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3,
  0x45df5c75, 0xdcd60dcf, 0xabd13d59, 0x26d930ac, 0x51de003a,
  0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599,
  0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
  0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190,
  0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f,
  0x9fbfe4a5, 0xe8b8d433, 0x7807c9a2, 0x0f00f934, 0x9609a88e,
  0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
  0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed,
  0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950,
  0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3,
  0xfbd44c65, 0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2,
  0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a,
  0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5,
  0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa, 0xbe0b1010,
  0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
  0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17,
  0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6,
  0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615,
  0x73dc1683, 0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8,
  0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1, 0xf00f9344,
  0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb,
  0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a,
  0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
  0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1,
  0xa6bc5767, 0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c,
  0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef,
  0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
  0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe,
  0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31,
  0x2cd99e8b, 0x5bdeae1d, 0x9b64c2b0, 0xec63f226, 0x756aa39c,
  0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713,
  0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b,
  0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242,
  0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1,
  0x18b74777, 0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c,
  0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45, 0xa00ae278,
  0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7,
  0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66,
  0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
  0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605,
  0xcdd70693, 0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8,
  0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b,
  0x2d02ef8d
];

if (typeof Int32Array !== 'undefined') {
  CRC_TABLE = new Int32Array(CRC_TABLE);
}

function newEmptyBuffer(length) {
  var buffer = new Buffer(length);
  buffer.fill(0x00);
  return buffer;
}

function ensureBuffer(input) {
  if (Buffer.isBuffer(input)) {
    return input;
  }

  var hasNewBufferAPI =
      typeof Buffer.alloc === "function" &&
      typeof Buffer.from === "function";

  if (typeof input === "number") {
    return hasNewBufferAPI ? Buffer.alloc(input) : newEmptyBuffer(input);
  }
  else if (typeof input === "string") {
    return hasNewBufferAPI ? Buffer.from(input) : new Buffer(input);
  }
  else {
    throw new Error("input must be buffer, number, or string, received " +
                    typeof input);
  }
}

function bufferizeInt(num) {
  var tmp = ensureBuffer(4);
  tmp.writeInt32BE(num, 0);
  return tmp;
}

function _crc32(buf, previous) {
  buf = ensureBuffer(buf);
  if (Buffer.isBuffer(previous)) {
    previous = previous.readUInt32BE(0);
  }
  var crc = ~~previous ^ -1;
  for (var n = 0; n < buf.length; n++) {
    crc = CRC_TABLE[(crc ^ buf[n]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1);
}

function crc32() {
  return bufferizeInt(_crc32.apply(null, arguments));
}
crc32.signed = function () {
  return _crc32.apply(null, arguments);
};
crc32.unsigned = function () {
  return _crc32.apply(null, arguments) >>> 0;
};

module.exports = crc32;

},{"buffer":false}],"callflow":[function(require,module,exports){
(function (global){(function (){
function initialise() {
    if($$.callflow){
        throw new Error("Callflow already initialized!");
    }

    function defaultErrorHandlingImplementation(err, res){
        //console.log(err.stack);
        if(err) throw err;
        return res;
    }

    $$.__intern = {
        mkArgs:function(args,pos){
            var argsArray = [];
            for(var i = pos; i < args.length; i++){
                argsArray.push(args[i]);
            }
            return argsArray;
        }
    };

    $$.defaultErrorHandlingImplementation = defaultErrorHandlingImplementation;

    var callflowModule = require("./lib/swarmDescription");
    $$.callflows        = callflowModule.createSwarmEngine("callflow");
    $$.callflow         = $$.callflows;
    $$.flow             = $$.callflows;
    $$.flows            = $$.callflows;


    $$.PSK_PubSub = require("soundpubsub").soundPubSub;

    $$.securityContext = null;
    $$.HRN_securityContext = "unnamedSecurityContext"; /*HRN: Human Readable Name */
    $$.libraryPrefix = "global";
    $$.libraries = {
        global:{

        }
    };

    $$.interceptor = require("./lib/InterceptorRegistry").createInterceptorRegistry();

    $$.loadLibrary = require("./lib/loadLibrary").loadLibrary;

    global.requireLibrary = function(name){
        //var absolutePath = path.resolve(  $$.__global.__loadLibraryRoot + name);
        return $$.loadLibrary(name,name);
    };

    require("./constants");


    $$.pathNormalize = function (pathToNormalize) {
        const path = require("path");
        pathToNormalize = path.normalize(pathToNormalize);

        return pathToNormalize.replace(/[\/\\]/g, path.sep);
    };

    // add interceptors

    const crypto = require('crypto');

    $$.interceptor.register('*', '*', 'before', function () {
        const swarmTypeName = this.getMetadata('swarmTypeName');
        const phaseName = this.getMetadata('phaseName');
        const swarmId = this.getMetadata('swarmId');
        const executionId = crypto.randomBytes(16).toString('hex');

        this.setMetadata('executionId', executionId);

        $$.event('swarm.call', {swarmTypeName, phaseName, swarmId});
    });
}

module.exports = {
    createSwarmEngine: require("./lib/swarmDescription").createSwarmEngine,
    createJoinPoint: require("./lib/parallelJoinPoint").createJoinPoint,
    createSerialJoinPoint: require("./lib/serialJoinPoint").createSerialJoinPoint,
    createStandardAPIsForSwarms: require("./lib/utilityFunctions/base").createForObject,
    initialise: initialise
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./constants":"/home/travis/build/PrivateSky/privatesky/modules/callflow/constants.js","./lib/InterceptorRegistry":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/InterceptorRegistry.js","./lib/loadLibrary":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/loadLibrary.js","./lib/parallelJoinPoint":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/parallelJoinPoint.js","./lib/serialJoinPoint":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/serialJoinPoint.js","./lib/swarmDescription":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/swarmDescription.js","./lib/utilityFunctions/base":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/utilityFunctions/base.js","crypto":false,"path":false,"soundpubsub":"soundpubsub"}],"dossier":[function(require,module,exports){
function envSetup(powerCord, seed, identity, callback){
    let cord_identity;
    try{
        const crypto = require("pskcrypto");
        cord_identity = crypto.pskHash(seed, "hex");
        $$.swarmEngine.plug(cord_identity, powerCord);
    }catch(err){
        return callback(err);
    }
    $$.interactions.startSwarmAs(cord_identity, "transactionHandler", "start", identity, "TooShortBlockChainWorkaroundDeleteThis", "add").onReturn(err => {
        if (err) {
            return callback(err);
        }

        const handler = {
            attachTo : $$.interactions.attachTo,
            startTransaction : function (transactionTypeName, methodName, ...args) {
                //todo: get identity from context somehow
                return $$.interactions.startSwarmAs(cord_identity, "transactionHandler", "start", identity, transactionTypeName, methodName, ...args);
            }
        };
        //todo implement a way to know when thread/worker/isolate is ready
        setTimeout(()=>{
            callback(undefined, handler);
        }, 100);
    });
}

module.exports.load = function(seed, identity, callback){
    const se = require("swarm-engine");
    if(typeof $$ === "undefined" || typeof $$.swarmEngine === "undefined"){
        se.initialise();
    }

    const envTypes = require("overwrite-require").constants;
    switch($$.environmentType){
        case envTypes.BROWSER_ENVIRONMENT_TYPE:
            const pc = new se.OuterWebWorkerPowerCord("path_to_boot_script", seed);
            return envSetup(pc, seed, identity, callback);
            break;
        case envTypes.NODEJS_ENVIRONMENT_TYPE:
            const pathName = "path";
            const path = require(pathName);
            const powerCord = new se.OuterThreadPowerCord(path.join(process.env.PSK_ROOT_INSTALATION_FOLDER, "psknode/bundles/threadBoot.js"), false, seed);
            return envSetup(powerCord, seed, identity, callback);
            break;
        case envTypes.SERVICE_WORKER_ENVIRONMENT_TYPE:
        case envTypes.ISOLATE_ENVIRONMENT_TYPE:
        case envTypes.THREAD_ENVIRONMENT_TYPE:
        default:
            return callback(new Error(`Dossier can not be loaded in <${$$.environmentType}> environment type for now!`));
    }
}

module.exports.RawDossier = require("./lib/RawDossier");
},{"./lib/RawDossier":"/home/travis/build/PrivateSky/privatesky/modules/dossier/lib/RawDossier.js","overwrite-require":"overwrite-require","pskcrypto":"pskcrypto","swarm-engine":false}],"dsu-wizard":[function(require,module,exports){
(function (__dirname){(function (){
function initWizard(server) {

	const URL_PREFIX = require("./constants").URL_PREFIX;
	const transactionManager = require("./TransactionManager");

	server.post(`${URL_PREFIX}/begin`, (req, res)=>{
		transactionManager.beginTransaction((err, transactionId)=>{
			if(err){
				res.statusCode = 500;
				return res.end();
			}
			res.write(transactionId);
			res.end();
		});
	});

	server.post(`${URL_PREFIX}/build/:transactionId`, (req, res)=>{
		transactionManager.closeTransaction(req.params.transactionId, (err, result)=>{
			if(err){
				res.statusCode = 500;
				return res.end();
			}
			res.write(result);
			res.end();
		});
	});

	const commands = require("./commands");
	Object.keys(commands).forEach((commandName)=>{
		commands[commandName](server);
	});

	server.use(`${URL_PREFIX}`, require("./utils").redirect);

	const pathName = "path";
	const path = require(pathName);
	if (!process.env.PSK_ROOT_INSTALATION_FOLDER) {
		process.env.PSK_ROOT_INSTALATION_FOLDER = require("path").resolve("." + __dirname + "/../..");
	}

	const VirtualMQ = require('psk-apihub');
	const httpWrapper = VirtualMQ.getHttpWrapper();
	const httpUtils = httpWrapper.httpUtils;
	setTimeout(()=>{
		server.use(`${URL_PREFIX}/*`, httpUtils.serveStaticFile(path.join(process.env.PSK_ROOT_INSTALATION_FOLDER, 'modules/dsu-wizard/web'), `${URL_PREFIX}/`));
	}, 1000);
}

module.exports = {
	initWizard,
	getTransactionManager : function(){
		return require("./TransactionManager");
	},
	getCommandRegistry: function(server){
		return require("./CommandRegistry").getRegistry(server);
	},
	getDummyCommand: function(){
		return require("./commands/dummyCommand");
	},
	utils: require("./utils")
}
}).call(this)}).call(this,"/modules/dsu-wizard")

},{"./CommandRegistry":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/CommandRegistry.js","./TransactionManager":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/TransactionManager.js","./commands":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/index.js","./commands/dummyCommand":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/commands/dummyCommand.js","./constants":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/constants.js","./utils":"/home/travis/build/PrivateSky/privatesky/modules/dsu-wizard/utils.js","path":false,"psk-apihub":"psk-apihub"}],"edfs-middleware":[function(require,module,exports){
module.exports.BrickStorageMiddleware = require("./lib/BrickStorageMiddleware");
module.exports.AnchoringMiddleware = require("./lib/AnchoringMiddleware");

},{"./lib/AnchoringMiddleware":"/home/travis/build/PrivateSky/privatesky/modules/edfs-middleware/lib/AnchoringMiddleware.js","./lib/BrickStorageMiddleware":"/home/travis/build/PrivateSky/privatesky/modules/edfs-middleware/lib/BrickStorageMiddleware.js"}],"key-ssi-resolver":[function(require,module,exports){
const KeySSIResolver = require('./lib/KeySSIResolver');
const constants = require('./lib/constants');
const DSUFactory = require("./lib/DSUFactoryRegistry");
const BootStrapingService = require("./lib/BootstrapingService");

/**
 * Create a new KeyDIDResolver instance and append it to
 * global object $$
 *
 * @param {object} options
 * @param {object} options.endpointsConfiguration
 * @param {Array<object>} options.endpointsConfiguration.brick
 * @param {Array<object>} options.endpointsConfiguration.alias
 * @param {string} options.dlDomain
 */
function initialize(options) {
    options = options || {};

    const BrickMapStrategyFactory = require("bar").BrickMapStrategyFactory;

    const bootstrapingService = new BootStrapingService(options);
    const brickMapStrategyFactory = new BrickMapStrategyFactory();
    const keySSIFactory = require('./lib/KeySSIs/KeySSIFactory');

    options.dsuFactory =  new DSUFactory({
        bootstrapingService,
        brickMapStrategyFactory,
        keySSIFactory
    });

    const keySSIResolver = new KeySSIResolver(options);

    return keySSIResolver;
}

module.exports = {
    initialize,
    constants,
    KeySSIFactory: require('./lib/KeySSIs/KeySSIFactory'),
    CryptoAlgorithmsRegistry: require('./lib/KeySSIs/CryptoAlgorithmsRegistry'),
    SSITypes: require("./lib/KeySSIs/SSITypes"),
    DSUFactory: require("./lib/DSUFactoryRegistry")
};

},{"./lib/BootstrapingService":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/BootstrapingService/index.js","./lib/DSUFactoryRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/index.js","./lib/KeySSIResolver":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIResolver.js","./lib/KeySSIs/CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","./lib/KeySSIs/KeySSIFactory":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIFactory.js","./lib/KeySSIs/SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./lib/constants":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/constants.js","bar":false}],"node-fd-slicer":[function(require,module,exports){
(function (Buffer,setImmediate){(function (){
var fs = require('fs');
var util = require('util');
var stream = require('stream');
var Readable = stream.Readable;
var Writable = stream.Writable;
var PassThrough = stream.PassThrough;
var Pend = require('./modules/node-pend');
var EventEmitter = require('events').EventEmitter;

exports.createFromBuffer = createFromBuffer;
exports.createFromFd = createFromFd;
exports.BufferSlicer = BufferSlicer;
exports.FdSlicer = FdSlicer;

util.inherits(FdSlicer, EventEmitter);
function FdSlicer(fd, options) {
  options = options || {};
  EventEmitter.call(this);

  this.fd = fd;
  this.pend = new Pend();
  this.pend.max = 1;
  this.refCount = 0;
  this.autoClose = !!options.autoClose;
}

FdSlicer.prototype.read = function(buffer, offset, length, position, callback) {
  var self = this;
  self.pend.go(function(cb) {
    fs.read(self.fd, buffer, offset, length, position, function(err, bytesRead, buffer) {
      cb();
      callback(err, bytesRead, buffer);
    });
  });
};

FdSlicer.prototype.write = function(buffer, offset, length, position, callback) {
  var self = this;
  self.pend.go(function(cb) {
    fs.write(self.fd, buffer, offset, length, position, function(err, written, buffer) {
      cb();
      callback(err, written, buffer);
    });
  });
};

FdSlicer.prototype.createReadStream = function(options) {
  return new ReadStream(this, options);
};

FdSlicer.prototype.createWriteStream = function(options) {
  return new WriteStream(this, options);
};

FdSlicer.prototype.ref = function() {
  this.refCount += 1;
};

FdSlicer.prototype.unref = function() {
  var self = this;
  self.refCount -= 1;

  if (self.refCount > 0) return;
  if (self.refCount < 0) throw new Error("invalid unref");

  if (self.autoClose) {
    fs.close(self.fd, onCloseDone);
  }

  function onCloseDone(err) {
    if (err) {
      self.emit('error', err);
    } else {
      self.emit('close');
    }
  }
};

util.inherits(ReadStream, Readable);
function ReadStream(context, options) {
  options = options || {};
  Readable.call(this, options);

  this.context = context;
  this.context.ref();

  this.start = options.start || 0;
  this.endOffset = options.end;
  this.pos = this.start;
  this.destroyed = false;
}

ReadStream.prototype._read = function(n) {
  var self = this;
  if (self.destroyed) return;

  var toRead = Math.min(self._readableState.highWaterMark, n);
  if (self.endOffset != null) {
    toRead = Math.min(toRead, self.endOffset - self.pos);
  }
  if (toRead <= 0) {
    self.destroyed = true;
    self.push(null);
    self.context.unref();
    return;
  }
  self.context.pend.go(function(cb) {
    if (self.destroyed) return cb();
    var buffer = new Buffer(toRead);
    fs.read(self.context.fd, buffer, 0, toRead, self.pos, function(err, bytesRead) {
      if (err) {
        self.destroy(err);
      } else if (bytesRead === 0) {
        self.destroyed = true;
        self.push(null);
        self.context.unref();
      } else {
        self.pos += bytesRead;
        self.push(buffer.slice(0, bytesRead));
      }
      cb();
    });
  });
};

ReadStream.prototype.destroy = function(err) {
  if (this.destroyed) return;
  err = err || new Error("stream destroyed");
  this.destroyed = true;
  this.emit('error', err);
  this.context.unref();
};

util.inherits(WriteStream, Writable);
function WriteStream(context, options) {
  options = options || {};
  Writable.call(this, options);

  this.context = context;
  this.context.ref();

  this.start = options.start || 0;
  this.endOffset = (options.end == null) ? Infinity : +options.end;
  this.bytesWritten = 0;
  this.pos = this.start;
  this.destroyed = false;

  this.on('finish', this.destroy.bind(this));
}

WriteStream.prototype._write = function(buffer, encoding, callback) {
  var self = this;
  if (self.destroyed) return;

  if (self.pos + buffer.length > self.endOffset) {
    var err = new Error("maximum file length exceeded");
    err.code = 'ETOOBIG';
    self.destroy();
    callback(err);
    return;
  }
  self.context.pend.go(function(cb) {
    if (self.destroyed) return cb();
    fs.write(self.context.fd, buffer, 0, buffer.length, self.pos, function(err, bytes) {
      if (err) {
        self.destroy();
        cb();
        callback(err);
      } else {
        self.bytesWritten += bytes;
        self.pos += bytes;
        self.emit('progress');
        cb();
        callback();
      }
    });
  });
};

WriteStream.prototype.destroy = function() {
  if (this.destroyed) return;
  this.destroyed = true;
  this.context.unref();
};

util.inherits(BufferSlicer, EventEmitter);
function BufferSlicer(buffer, options) {
  EventEmitter.call(this);

  options = options || {};
  this.refCount = 0;
  this.buffer = buffer;
  this.maxChunkSize = options.maxChunkSize || Number.MAX_SAFE_INTEGER;
}

BufferSlicer.prototype.read = function(buffer, offset, length, position, callback) {
  var end = position + length;
  var delta = end - this.buffer.length;
  var written = (delta > 0) ? delta : length;
  this.buffer.copy(buffer, offset, position, end);
  setImmediate(function() {
    callback(null, written);
  });
};

BufferSlicer.prototype.write = function(buffer, offset, length, position, callback) {
  buffer.copy(this.buffer, position, offset, offset + length);
  setImmediate(function() {
    callback(null, length, buffer);
  });
};

BufferSlicer.prototype.createReadStream = function(options) {
  options = options || {};
  var readStream = new PassThrough(options);
  readStream.destroyed = false;
  readStream.start = options.start || 0;
  readStream.endOffset = options.end;
  // by the time this function returns, we'll be done.
  readStream.pos = readStream.endOffset || this.buffer.length;

  // respect the maxChunkSize option to slice up the chunk into smaller pieces.
  var entireSlice = this.buffer.slice(readStream.start, readStream.pos);
  var offset = 0;
  while (true) {
    var nextOffset = offset + this.maxChunkSize;
    if (nextOffset >= entireSlice.length) {
      // last chunk
      if (offset < entireSlice.length) {
        readStream.write(entireSlice.slice(offset, entireSlice.length));
      }
      break;
    }
    readStream.write(entireSlice.slice(offset, nextOffset));
    offset = nextOffset;
  }

  readStream.end();
  readStream.destroy = function() {
    readStream.destroyed = true;
  };
  return readStream;
};

BufferSlicer.prototype.createWriteStream = function(options) {
  var bufferSlicer = this;
  options = options || {};
  var writeStream = new Writable(options);
  writeStream.start = options.start || 0;
  writeStream.endOffset = (options.end == null) ? this.buffer.length : +options.end;
  writeStream.bytesWritten = 0;
  writeStream.pos = writeStream.start;
  writeStream.destroyed = false;
  writeStream._write = function(buffer, encoding, callback) {
    if (writeStream.destroyed) return;

    var end = writeStream.pos + buffer.length;
    if (end > writeStream.endOffset) {
      var err = new Error("maximum file length exceeded");
      err.code = 'ETOOBIG';
      writeStream.destroyed = true;
      callback(err);
      return;
    }
    buffer.copy(bufferSlicer.buffer, writeStream.pos, 0, buffer.length);

    writeStream.bytesWritten += buffer.length;
    writeStream.pos = end;
    writeStream.emit('progress');
    callback();
  };
  writeStream.destroy = function() {
    writeStream.destroyed = true;
  };
  return writeStream;
};

BufferSlicer.prototype.ref = function() {
  this.refCount += 1;
};

BufferSlicer.prototype.unref = function() {
  this.refCount -= 1;

  if (this.refCount < 0) {
    throw new Error("invalid unref");
  }
};

function createFromBuffer(buffer, options) {
  return new BufferSlicer(buffer, options);
}

function createFromFd(fd, options) {
  return new FdSlicer(fd, options);
}

}).call(this)}).call(this,require("buffer").Buffer,require("timers").setImmediate)

},{"./modules/node-pend":"/home/travis/build/PrivateSky/privatesky/modules/node-fd-slicer/modules/node-pend/index.js","buffer":false,"events":false,"fs":false,"stream":false,"timers":false,"util":false}],"opendsu":[function(require,module,exports){
/*
html API space
*/

module.exports.loadApi = function(apiSpaceName){
    switch (apiSpaceName) {
        case "http":return require("./http"); break;
        case "crypto":return require("./crypto"); break;
        case "anchoring":return require("./anchoring"); break;
        case "bricking":return require("./bricking"); break;
        case "bdns":return require("./bdns"); break;
        case "dc":return require("./dc"); break;
        case "dt":return require("./dt"); break;
        case "keyssi":return require("./keyssi"); break;
        case "mq":return require("./mq"); break;
        case "notifications":return require("./notifications"); break;
        case "resolver":return require("./resolver"); break;
        case "sc":return require("./sc"); break;
        default: throw new Error("Unknown API space " + apiSpaceName);
    }
}

module.exports.constants = require("./moduleConstants.js");
},{"./anchoring":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/anchoring/index.js","./bdns":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/bdns/index.js","./bricking":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/bricking/index.js","./crypto":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/crypto/index.js","./dc":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/dc/index.js","./dt":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/dt/index.js","./http":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/http/index.js","./keyssi":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/keyssi/index.js","./moduleConstants.js":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/moduleConstants.js","./mq":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/mq/index.js","./notifications":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/notifications/index.js","./resolver":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/resolver/index.js","./sc":"/home/travis/build/PrivateSky/privatesky/modules/opendsu/sc/index.js"}],"overwrite-require":[function(require,module,exports){
(function (global){(function (){
/*
 require and $$.require are overwriting the node.js defaults in loading modules for increasing security, speed and making it work to the privatesky runtime build with browserify.
 The privatesky code for domains should work in node and browsers.
 */
function enableForEnvironment(envType){

    const moduleConstants = require("./moduleConstants");

    /**
     * Used to provide autocomplete for $$ variables
     * @classdesc Interface for $$ object
     *
     * @name $$
     * @class
     *
     */

    switch (envType) {
        case moduleConstants.BROWSER_ENVIRONMENT_TYPE :
            global = window;
            break;
        case moduleConstants.SERVICE_WORKER_ENVIRONMENT_TYPE:
            global = self;
            break;
    }

    if (typeof(global.$$) == "undefined") {
        /**
         * Used to provide autocomplete for $$ variables
         * @type {$$}
         */
        global.$$ = {};
    }

    if (typeof($$.__global) == "undefined") {
        $$.__global = {};
    }

    Object.defineProperty($$, "environmentType", {
        get: function(){
            return envType;
        },
        set: function (value) {
            throw Error("Environment type already set!");
        }
    });


    if (typeof($$.__global.requireLibrariesNames) == "undefined") {
        $$.__global.currentLibraryName = null;
        $$.__global.requireLibrariesNames = {};
    }


    if (typeof($$.__runtimeModules) == "undefined") {
        $$.__runtimeModules = {};
    }


    if (typeof(global.functionUndefined) == "undefined") {
        global.functionUndefined = function () {
            console.log("Called of an undefined function!!!!");
            throw new Error("Called of an undefined function");
        };
        if (typeof(global.webshimsRequire) == "undefined") {
            global.webshimsRequire = global.functionUndefined;
        }

        if (typeof(global.domainRequire) == "undefined") {
            global.domainRequire = global.functionUndefined;
        }

        if (typeof(global.pskruntimeRequire) == "undefined") {
            global.pskruntimeRequire = global.functionUndefined;
        }
    }

    const pastRequests = {};

    function preventRecursiveRequire(request) {
        if (pastRequests[request]) {
            const err = new Error("Preventing recursive require for " + request);
            err.type = "PSKIgnorableError";
            throw err;
        }

    }

    function disableRequire(request) {
        pastRequests[request] = true;
    }

    function enableRequire(request) {
        pastRequests[request] = false;
    }

    function requireFromCache(request) {
        const existingModule = $$.__runtimeModules[request];
        return existingModule;
    }

    function wrapStep(callbackName) {
        const callback = global[callbackName];

        if (callback === undefined) {
            return null;
        }

        if (callback === global.functionUndefined) {
            return null;
        }

        return function (request) {
            const result = callback(request);
            $$.__runtimeModules[request] = result;
            return result;
        }
    }


    function tryRequireSequence(originalRequire, request) {
        let arr;
        if (originalRequire) {
            arr = $$.__requireFunctionsChain.slice();
            arr.push(originalRequire);
        } else {
            arr = $$.__requireFunctionsChain;
        }

        preventRecursiveRequire(request);
        disableRequire(request);
        let result;
        const previousRequire = $$.__global.currentLibraryName;
        let previousRequireChanged = false;

        if (!previousRequire) {
            // console.log("Loading library for require", request);
            $$.__global.currentLibraryName = request;

            if (typeof $$.__global.requireLibrariesNames[request] == "undefined") {
                $$.__global.requireLibrariesNames[request] = {};
                //$$.__global.requireLibrariesDescriptions[request]   = {};
            }
            previousRequireChanged = true;
        }
        for (let i = 0; i < arr.length; i++) {
            const func = arr[i];
            try {

                if (func === global.functionUndefined) continue;
                result = func(request);

                if (result) {
                    break;
                }

            } catch (err) {
                if (err.type !== "PSKIgnorableError") {
                    //$$.err("Require encountered an error while loading ", request, "\nCause:\n", err.stack);
                }
            }
        }

        if (!result) {
            throw Error(`Failed to load module ${request}`);
        }

        enableRequire(request);
        if (previousRequireChanged) {
            //console.log("End loading library for require", request, $$.__global.requireLibrariesNames[request]);
            $$.__global.currentLibraryName = null;
        }
        return result;
    }

    function makeBrowserRequire(){
        console.log("Defining global require in browser");


        global.require = function (request) {

            ///*[requireFromCache, wrapStep(webshimsRequire), , wrapStep(pskruntimeRequire), wrapStep(domainRequire)*]
            return tryRequireSequence(null, request);
        }
    }

    function makeIsolateRequire(){
        // require should be provided when code is loaded in browserify
        const bundleRequire = require;

        $$.requireBundle('sandboxBase');
        // this should be set up by sandbox prior to
        const sandboxRequire = global.require;
        const cryptoModuleName = 'crypto';
        global.crypto = require(cryptoModuleName);

        function newLoader(request) {
            // console.log("newLoader:", request);
            //preventRecursiveRequire(request);
            const self = this;

            // console.log('trying to load ', request);

            function tryBundleRequire(...args) {
                //return $$.__originalRequire.apply(self,args);
                //return Module._load.apply(self,args)
                let res;
                try {
                    res = sandboxRequire.apply(self, args);
                } catch (err) {
                    if (err.code === "MODULE_NOT_FOUND") {
                        const p = path.join(process.cwd(), request);
                        res = sandboxRequire.apply(self, [p]);
                        request = p;
                    } else {
                        throw err;
                    }
                }
                return res;
            }

            let res;


            res = tryRequireSequence(tryBundleRequire, request);


            return res;
        }

        global.require = newLoader;
    }

    function makeNodeJSRequire(){
        const pathModuleName = 'path';
        const path = require(pathModuleName);
        const cryptoModuleName = 'crypto';
        const utilModuleName = 'util';
        $$.__runtimeModules["crypto"] = require(cryptoModuleName);
        $$.__runtimeModules["util"] = require(utilModuleName);

        const moduleModuleName = 'module';
        const Module = require(moduleModuleName);
        $$.__runtimeModules["module"] = Module;

        console.log("Redefining require for node");

        $$.__originalRequire = Module._load;
        const moduleOriginalRequire = Module.prototype.require;

        function newLoader(request) {
            // console.log("newLoader:", request);
            //preventRecursiveRequire(request);
            const self = this;

            function originalRequire(...args) {
                //return $$.__originalRequire.apply(self,args);
                //return Module._load.apply(self,args)
                let res;
                try {
                    res = moduleOriginalRequire.apply(self, args);
                } catch (err) {
                    if (err.code === "MODULE_NOT_FOUND") {
                        let pathOrName = request;
                        if(pathOrName.startsWith('/') || pathOrName.startsWith('./') || pathOrName.startsWith('../')){
                            pathOrName = path.join(process.cwd(), request);
                        }
                        res = moduleOriginalRequire.call(self, pathOrName);
                        request = pathOrName;
                    } else {
                        throw err;
                    }
                }
                return res;
            }

            function currentFolderRequire(request) {
                return
            }

            //[requireFromCache, wrapStep(pskruntimeRequire), wrapStep(domainRequire), originalRequire]
            return tryRequireSequence(originalRequire, request);
        }

        Module.prototype.require = newLoader;
        return newLoader;
    }

    require("./standardGlobalSymbols.js");

    if (typeof($$.require) == "undefined") {

        $$.__requireList = ["webshimsRequire"];
        $$.__requireFunctionsChain = [];

        $$.requireBundle = function (name) {
            name += "Require";
            $$.__requireList.push(name);
            const arr = [requireFromCache];
            $$.__requireList.forEach(function (item) {
                const callback = wrapStep(item);
                if (callback) {
                    arr.push(callback);
                }
            });

            $$.__requireFunctionsChain = arr;
        };

        $$.requireBundle("init");

        switch ($$.environmentType) {
            case moduleConstants.BROWSER_ENVIRONMENT_TYPE:
                makeBrowserRequire();
                $$.require = require;
                break;
            case moduleConstants.SERVICE_WORKER_ENVIRONMENT_TYPE:
                makeBrowserRequire();
                $$.require = require;
                break;
            case moduleConstants.ISOLATE_ENVIRONMENT_TYPE:
                makeIsolateRequire();
                $$.require = require;
                break;
            default:
               $$.require = makeNodeJSRequire();
        }

    }
};



module.exports = {
    enableForEnvironment,
    constants: require("./moduleConstants")
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/overwrite-require/moduleConstants.js","./standardGlobalSymbols.js":"/home/travis/build/PrivateSky/privatesky/modules/overwrite-require/standardGlobalSymbols.js"}],"psk-apihub":[function(require,module,exports){
const httpWrapper = require('./libs/http-wrapper');
const Server = httpWrapper.Server;
const TokenBucket = require('./libs/TokenBucket');
const START_TOKENS = 6000000;

function HttpServer({ listeningPort, rootFolder, sslConfig }, callback) {
	if (typeof $$.flows === "undefined") {
		require('callflow').initialise();
	}
	//next require lines are only for browserify build purpose
	// Remove mock
	require('./components/bricks');
	require('./components/anchoring');
	require('./components/channelManager');
	require('./components/fileManager');
	require('./components/bricksLedger');
	require('./components/bricksFabric');
	require('./components/staticServer');
	require('./components/mqManager');
	require('./components/keySsiNotifications');
	//end

	const port = listeningPort || 8080;
	const tokenBucket = new TokenBucket(START_TOKENS, 1, 10);

	const conf =  require('./config').getConfig();
	const server = new Server(sslConfig);
	server.rootFolder = rootFolder;

	checkPortInUse(port, sslConfig, (err, status) => {
		if (status === true) {
			throw Error(`Port ${port} is used by another server.`);
		}

		server.listen(port, conf.host, (err) => {
			if (err) {
				console.log(err);
				if (callback) {
					callback(err);
				}
			}
		});
	});

	server.on('listening', bindFinished);
	server.on('error', bindErrorHandler);

	function checkPortInUse(port, sslConfig, callback) {
		let commType = 'http';
		if (typeof sslConfig !== 'undefined') {
			commType += 's';
		}

		console.log(`Checking if port ${port} is available. Please wait...`);

		require(commType).request({ port }, (res) => {
			callback(undefined, true);
		}).on('error', (err) => {
			callback(undefined, false);
		});
	}

	function bindErrorHandler(error) {
		if (error.code === 'EADDRINUSE') {
			server.close();
			if (callback) {
				return callback(error);
			}
			throw error;
		}
	}

	function bindFinished(err) {
		if (err) {
			console.log(err);
			if (callback) {
				callback(err);
			}
			return;
		}

		registerEndpoints(callback);
	}

	function registerEndpoints(callback) {
		server.use(function (req, res, next) {
			res.setHeader('Access-Control-Allow-Origin', req.headers.origin || req.headers.host);
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
			res.setHeader('Access-Control-Allow-Headers', `Content-Type, Content-Length, X-Content-Length, Access-Control-Allow-Origin, ${conf.endpointsConfig.virtualMQ.signatureHeaderName}`);
			res.setHeader('Access-Control-Allow-Credentials', true);
			next();
		});

		if (conf.preventRateLimit !== true) {
			server.use(function (req, res, next) {
				const ip = res.socket.remoteAddress;
				tokenBucket.takeToken(ip, tokenBucket.COST_MEDIUM, function (err, remainedTokens) {
					res.setHeader('X-RateLimit-Limit', tokenBucket.getLimitByCost(tokenBucket.COST_MEDIUM));
					res.setHeader('X-RateLimit-Remaining', tokenBucket.getRemainingTokenByCost(remainedTokens, tokenBucket.COST_MEDIUM));

					if (err) {
						if (err === TokenBucket.ERROR_LIMIT_EXCEEDED) {
							res.statusCode = 429;
						} else {
							res.statusCode = 500;
						}

						res.end();
						return;
					}

					next();
				});
			});
		} else {
			console.log('Rate limit mechanism disabled!');
		}

		server.options('/*', function (req, res) {
			const headers = {};
			// IE8 does not allow domains to be specified, just the *
			headers['Access-Control-Allow-Origin'] = req.headers.origin;
			// headers['Access-Control-Allow-Origin'] = '*';
			headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
			headers['Access-Control-Allow-Credentials'] = true;
			headers['Access-Control-Max-Age'] = '3600'; //one hour
			headers['Access-Control-Allow-Headers'] = `Content-Type, Content-Length, X-Content-Length, Access-Control-Allow-Origin, User-Agent, ${conf.endpointsConfig.virtualMQ.signatureHeaderName}}`;
			res.writeHead(200, headers);
			res.end();
		});

		function addMiddlewares() {
			const middlewareList = conf.activeEndpoints;
			const path = require("swarmutils").path;
			middlewareList.forEach(middleware => {
				const middlewareConfigName = Object.keys(conf.endpointsConfig).find(endpointName => endpointName === middleware);
				const middlewareConfig = conf.endpointsConfig[middlewareConfigName];
				let middlewarePath;
				if (middlewareConfigName) {
					middlewarePath = middlewareConfig.module;
					//console.log(middlewareConfig, middlewarePath);
					//console.log(conf.defaultEndpoints);
					if (middlewarePath.startsWith('.') && conf.defaultEndpoints.indexOf(middleware) === -1) {
						middlewarePath = path.join(process.env.PSK_ROOT_INSTALATION_FOLDER, middlewarePath);
					}
					console.log(`Preparing to register middleware from path ${middlewarePath}`);
					let middlewareImplementation = require(middlewarePath);
					if (typeof middlewareConfig.function !== 'undefined') {
						middlewareImplementation[middlewareConfig.function](server);
					} else {
						middlewareImplementation(server);
					}
				}
			})

		}

		addMiddlewares();
		setTimeout(function () {
			//allow other endpoints registration before registering fallback handler
			server.use(function (req, res) {
				res.statusCode = 404;
				res.end();
			});
			if (callback) {
				return callback();
			}
		}, 100);
	}
	return server;
}

module.exports.createInstance = function (port, folder, sslConfig, callback) {
	if (typeof sslConfig === 'function') {
		callback = sslConfig;
		sslConfig = undefined;
	}

	return new HttpServer({ listeningPort: port, rootFolder: folder, sslConfig }, callback);
};

module.exports.getVMQRequestFactory = function (virtualMQAddress, zeroMQAddress) {
	const VMQRequestFactory = require('./components/vmq/requestFactory');

	return new VMQRequestFactory(virtualMQAddress, zeroMQAddress);
};

module.exports.getHttpWrapper = function () {
	return require('./libs/http-wrapper');
};

module.exports.getServerConfig = function () {
	const config = require('./config');

	return config.getConfig();
};

},{"./components/anchoring":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/anchoring/index.js","./components/bricks":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricks/index.js","./components/bricksFabric":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksFabric/index.js","./components/bricksLedger":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/bricksLedger/index.js","./components/channelManager":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/channelManager/index.js","./components/fileManager":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/fileManager/index.js","./components/keySsiNotifications":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/keySsiNotifications/index.js","./components/mqManager":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/mqManager/index.js","./components/staticServer":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/staticServer/index.js","./components/vmq/requestFactory":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/components/vmq/requestFactory.js","./config":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/config/index.js","./libs/TokenBucket":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/TokenBucket.js","./libs/http-wrapper":"/home/travis/build/PrivateSky/privatesky/modules/psk-apihub/libs/http-wrapper/src/index.js","callflow":"callflow","swarmutils":"swarmutils"}],"psk-cache":[function(require,module,exports){
const Cache = require("./lib/Cache")
let cacheInstance;

module.exports = {

    /**
     * Create a new cache instance
     *
     * @param {object} options
     * @param {Number} options.maxLevels Number of storage levels. Defaults to 3
     * @param {Number} options.limit Number of max items the cache can store per level.
     *                               Defaults to 1000
     * @return {Cache}
     */
    factory: function (options) {
        return new Cache(options);
    },

    /**
     * Get a reference to a singleton cache instance
     *
     * @param {object} options
     * @param {Number} options.maxLevels Number of storage levels. Defaults to 3
     * @param {Number} options.limit Number of max items the cache can store per level.
     *                               Defaults to 1000
     * @return {Cache}
     */
    getDefaultInstance: function (options) {
        if (!cacheInstance) {
            cacheInstance = new Cache(options);
        }

        return cacheInstance;
    }
};

},{"./lib/Cache":"/home/travis/build/PrivateSky/privatesky/modules/psk-cache/lib/Cache.js"}],"psk-http-client":[function(require,module,exports){
//to look nice the requireModule on Node
require("./lib/psk-abstract-client");
const or = require('overwrite-require');
if ($$.environmentType === or.constants.BROWSER_ENVIRONMENT_TYPE) {
	require("./lib/psk-browser-client");
} else {
	require("./lib/psk-node-client");
}
},{"./lib/psk-abstract-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-abstract-client.js","./lib/psk-browser-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-browser-client.js","./lib/psk-node-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-node-client.js","overwrite-require":"overwrite-require"}],"psk-security-context":[function(require,module,exports){
const RawCSBSecurityContext = require("./lib/RawCSBSecurityContext");
const RootCSBSecurityContext = require("./lib/RootCSBSecurityContext");
const SecurityContext = require("./lib/SecurityContext");
const EncryptedSecret = require("./lib/EncryptedSecret");
const PSKSignature = require("./lib/PSKSignature");

module.exports.createSecurityContext = (securityContextType, ...args) => {
    switch (securityContextType) {
        case "RootCSBSecurityContext":
            return new RootCSBSecurityContext(...args);
        case "RawCSBSecurityContext":
            return new RawCSBSecurityContext(...args);
        default:
            return new SecurityContext(...args);
    }
};

module.exports.createEncryptedSecret = (serializedEncryptedSecret) => {
    return new EncryptedSecret(serializedEncryptedSecret);
};


module.exports.createPSKSignature = (serializedPSKSignature) => {
    return new PSKSignature(serializedPSKSignature);
};

},{"./lib/EncryptedSecret":"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/EncryptedSecret.js","./lib/PSKSignature":"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/PSKSignature.js","./lib/RawCSBSecurityContext":"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/RawCSBSecurityContext.js","./lib/RootCSBSecurityContext":"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/RootCSBSecurityContext.js","./lib/SecurityContext":"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/SecurityContext.js"}],"pskcrypto":[function(require,module,exports){
const PskCrypto = require("./lib/PskCrypto");
const ssutil = require("./signsensusDS/ssutil");

module.exports = PskCrypto;

module.exports.hashValues = ssutil.hashValues;

module.exports.DuplexStream = require("./lib/utils/DuplexStream");

module.exports.isStream = require("./lib/utils/isStream");
},{"./lib/PskCrypto":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/PskCrypto.js","./lib/utils/DuplexStream":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/DuplexStream.js","./lib/utils/isStream":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/isStream.js","./signsensusDS/ssutil":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/signsensusDS/ssutil.js"}],"queue":[function(require,module,exports){
function QueueElement(content) {
	this.content = content;
	this.next = null;
}

function Queue() {
	this.head = null;
	this.tail = null;
	this.length = 0;
	this.push = function (value) {
		const newElement = new QueueElement(value);
		if (!this.head) {
			this.head = newElement;
			this.tail = newElement;
		} else {
			this.tail.next = newElement;
			this.tail = newElement;
		}
		this.length++;
	};

	this.pop = function () {
		if (!this.head) {
			return null;
		}
		const headCopy = this.head;
		this.head = this.head.next;
		this.length--;

		//fix???????
		if(this.length === 0){
            this.tail = null;
		}

		return headCopy.content;
	};

	this.front = function () {
		return this.head ? this.head.content : undefined;
	};

	this.isEmpty = function () {
		return this.head === null;
	};

	this[Symbol.iterator] = function* () {
		let head = this.head;
		while(head !== null) {
			yield head.content;
			head = head.next;
		}
	}.bind(this);
}

Queue.prototype.toString = function () {
	let stringifiedQueue = '';
	let iterator = this.head;
	while (iterator) {
		stringifiedQueue += `${JSON.stringify(iterator.content)} `;
		iterator = iterator.next;
	}
	return stringifiedQueue;
};

Queue.prototype.inspect = Queue.prototype.toString;

module.exports = Queue;

},{}],"soundpubsub":[function(require,module,exports){
module.exports = {
					soundPubSub: require("./lib/soundPubSub").soundPubSub
};
},{"./lib/soundPubSub":"/home/travis/build/PrivateSky/privatesky/modules/soundpubsub/lib/soundPubSub.js"}],"swarmutils":[function(require,module,exports){
(function (global,Buffer){(function (){
module.exports.OwM = require("./lib/OwM");
module.exports.beesHealer = require("./lib/beesHealer");

const uidGenerator = require("./lib/uidGenerator").createUidGenerator(200, 32);

module.exports.safe_uuid = require("./lib/safe-uuid").init(uidGenerator);

module.exports.Queue = require("./lib/Queue");
module.exports.combos = require("./lib/Combos");

module.exports.uidGenerator = uidGenerator;
module.exports.generateUid = uidGenerator.generateUid;
module.exports.TaskCounter = require("./lib/TaskCounter");
module.exports.SwarmPacker = require("./lib/SwarmPacker");
module.exports.path = require("./lib/path");
module.exports.createPskConsole = function () {
  return require('./lib/pskconsole');
};

module.exports.pingPongFork = require('./lib/pingpongFork');


if(typeof global.$$ == "undefined"){
  global.$$ = {};
}

if(typeof global.$$.uidGenerator == "undefined"){
    $$.uidGenerator = module.exports.safe_uuid;
}

module.exports.convertToBuffer = function(uint8array){
    const newBuffer = new Buffer(uint8array.byteLength);
    let currentPos = 0;
    const arrBuf = uint8array;
    const partialDataView = new DataView(arrBuf);
    for (let i = 0; i < arrBuf.byteLength; i++) {
        newBuffer.writeUInt8(partialDataView.getUint8(i), currentPos);
        currentPos += 1;
    }
    return newBuffer;
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)

},{"./lib/Combos":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Combos.js","./lib/OwM":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/OwM.js","./lib/Queue":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Queue.js","./lib/SwarmPacker":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/SwarmPacker.js","./lib/TaskCounter":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/TaskCounter.js","./lib/beesHealer":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/beesHealer.js","./lib/path":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/path.js","./lib/pingpongFork":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/pingpongFork.js","./lib/pskconsole":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/pskconsole.js","./lib/safe-uuid":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/safe-uuid.js","./lib/uidGenerator":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/uidGenerator.js","buffer":false}],"zmq_adapter":[function(require,module,exports){
(function (Buffer){(function (){
const defaultForwardAddress = process.env.vmq_zeromq_forward_address || "tcp://127.0.0.1:5001";
const defaultSubAddress = process.env.vmq_zeromq_sub_address || "tcp://127.0.0.1:5000";
const defaultPubAddress = process.env.vmq_zeromq_pub_address || "tcp://127.0.0.1:5001";

const zeroMQModuleName = "zeromq";
let zmq;

try{
    zmq = require(zeroMQModuleName);
}catch(err){
    console.log("zeroMQ not available at this moment.");
}

function registerKiller(children){
    const events = ["SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException", "SIGTERM", "SIGHUP"];

    events.forEach(function(event){
        process.on(event, function(...args){
            children.forEach(function(child){
                console.log("Something bad happened.", event, ...args);
                try{
                    child.close();
                }catch(err){
                    //..
                    console.log(err);
                }
            });
        });
    });
}

function ZeromqForwarder(bindAddress){

    let socket = zmq.socket("pub");
    let initialized = false;

    function connect(){
        socket.monitor();
        socket.connect(bindAddress);

        socket.on("connect",(fd)=>{
            console.log(`[Forwarder] connected on ${bindAddress}`);
            initialized = true;
            sendBuffered();
        });
    }

    connect();

    registerKiller([socket]);

    const Queue = require("swarmutils").Queue;
    let buffered = new Queue();

    let sendBuffered = ()=>{
        while(buffered.length>0){
            this.send(...buffered.pop());
        }
    };

    this.send = function(channel, ...args){
        if(initialized){
            //console.log("[Forwarder] Putting message on socket", args);
            socket.send([channel, ...args], undefined, (...args)=>{
                //console.log("[Forwarder] message sent");
            });
        }else{
            //console.log("[Forwarder] Saving it for later");
            buffered.push([channel, ...args]);
        }
    }
}

function ZeromqProxyNode(subAddress, pubAddress, signatureChecker){

    const publishersNode = zmq.createSocket('xsub');
    const subscribersNode = zmq.createSocket('xpub');

    // By default xpub only signals new subscriptions
    // Settings it to verbose = 1 , will signal on every new subscribe
    // uncomment next lines if messages are lost
    subscribersNode.setsockopt(zmq.ZMQ_XPUB_VERBOSE, 1);

    publishersNode.on('message', deliverMessage);

    function deliverMessage(channel, message){
        //console.log(`[Proxy] - Received message on channel ${channel.toString()}`);
        let ch = channelTranslationDictionary[channel.toString()];
        if(ch){
            //console.log("[Proxy] - Sending message on channel", ch);
            subscribersNode.send([Buffer.from(ch), message]);
        }else{
            //console.log(`[Proxy] - message dropped!`);
        }
        //subscribersNode.send([channel, message]);
    }

    let channelTranslationDictionary = {};

    subscribersNode.on('message', manageSubscriptions);

    function manageSubscriptions(subscription){
        //console.log("[Proxy] - manage message", subscription.toString());

        let message = subscription.toString();
        let type = subscription[0];
        message = message.substr(1);

        //console.log(`[Proxy] - Trying to send ${type==1?"subscribe":"unsubscribe"} type of message`);

        if(typeof signatureChecker === "undefined"){
            //console.log("[Proxy] - No signature checker defined then transparent proxy...", subscription);
            publishersNode.send(subscription);
            return;
        }

        try{
            //console.log("[Proxy] - let's deserialize and start analize");
            let deserializedData = JSON.parse(message);
            //TODO: check deserializedData.signature
            //console.log("[Proxy] - Start checking message signature");
            signatureChecker(deserializedData.channelName, deserializedData.signature, (err, res)=>{
                if(err){
                    //...
                    //console.log("Err", err);
                }else{
                    let newSub = Buffer.alloc(deserializedData.channelName.length+1);
                    let ch = Buffer.from(deserializedData.channelName);
                    if(type===1){
                        newSub.write("01", 0, 1, "hex");
                    }else{
                        newSub.write("00", 0, 1, "hex");
                    }

                    ch.copy(newSub, 1);
                    //console.log("[Proxy] - sending subscription", /*"\n\t\t", subscription.toString('hex'), "\n\t\t", newSub.toString('hex'),*/ newSub);
                    channelTranslationDictionary[deserializedData.channelName] = message;
                    publishersNode.send(newSub);
                    return;
                }
            });
        }catch(err){
            if(message.toString()!==""){
                //console.log("Something went wrong. Subscription will not be made.", err);
            }
        }
    }

    try{
        publishersNode.bindSync(pubAddress);
        subscribersNode.bindSync(subAddress);
        console.log(`\nStarting ZeroMQ proxy on [subs:${subAddress}] [pubs:${pubAddress}]\n`);
    }catch(err){
        console.log("Caught error on binding", err);
        throw new Error("No zeromq!!!");
    }

    registerKiller([publishersNode, subscribersNode]);
}

function ZeromqConsumer(bindAddress, monitorFunction){

    let socket = zmq.socket("sub");

    if(typeof monitorFunction === "function"){
        let events = ["connect", "connect_delay", "connect_retry", "listen", "bind_error", "accept", "accept_error", "close", "close_error", "disconnect"];
        socket.monitor();
        events.forEach((eventType)=>{
            socket.on(eventType, (...args)=>{
                monitorFunction(eventType, ...args);
            });
        });
    }

    function connect(callback){
        socket.connect(bindAddress);
        socket.on("connect", callback);
    }

    let subscriptions = {};
    let connected = false;

    this.subscribe = function(channelName, signature, callback){
        let subscription = JSON.stringify({channelName, signature:signature});
        if(!subscriptions[subscription]){
            subscriptions[subscription] = [];
        }

        subscriptions[subscription].push(callback);

        if(!connected){
            connect(()=>{
                connected = true;
                for(var subscription in subscriptions){
                    socket.subscribe(subscription);
                }
            });
        }else{
            socket.subscribe(subscription);
        }
    };

    this.close = function(){
        socket.close();
    };

    socket.on("message", (channel, receivedMessage)=>{
        let callbacks = subscriptions[channel];
        if(!callbacks || callbacks.length === 0){
            return console.log(`No subscriptions found for channel ${channel}. Message dropped!`);
        }
        for(let i = 0; i<callbacks.length; i++){
            let cb = callbacks[i];
            cb(channel, receivedMessage);
        }
    });
}

let instance;
function getForwarderInstance(address){
    if(!instance){
        address = address || defaultForwardAddress;
        instance = new ZeromqForwarder(address);
    }
    return instance;
}

function createZeromqProxyNode(subAddress, pubAddress, signatureChecker){
    subAddress = subAddress || defaultSubAddress;
    pubAddress = pubAddress || defaultPubAddress;
    return new ZeromqProxyNode(subAddress, pubAddress, signatureChecker);
}

function createZeromqConsumer(bindAddress, monitorFunction){
    return new ZeromqConsumer(bindAddress, monitorFunction);
}

function testIfAvailable(){
    return typeof zmq !== "undefined";
}

module.exports = {
    getForwarderInstance,
    createZeromqConsumer,
    createZeromqProxyNode,
    testIfAvailable,
    registerKiller
};
}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":false,"swarmutils":"swarmutils"}]},{},["/home/travis/build/PrivateSky/privatesky/builds/tmp/pskWebServer.js"])