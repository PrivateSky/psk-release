testsRuntimeRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/travis/build/PrivateSky/privatesky/builds/tmp/testsRuntime.js":[function(require,module,exports){
const or = require('overwrite-require');
or.enableForEnvironment(or.constants.NODEJS_ENVIRONMENT_TYPE);
require("./testsRuntime_intermediar");
require("double-check");
},{"./testsRuntime_intermediar":"/home/travis/build/PrivateSky/privatesky/builds/tmp/testsRuntime_intermediar.js","double-check":"double-check","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/builds/tmp/testsRuntime_intermediar.js":[function(require,module,exports){
(function (global){(function (){
global.testsRuntimeLoadModules = function(){ 

	if(typeof $$.__runtimeModules["overwrite-require"] === "undefined"){
		$$.__runtimeModules["overwrite-require"] = require("overwrite-require");
	}

	if(typeof $$.__runtimeModules["opendsu"] === "undefined"){
		$$.__runtimeModules["opendsu"] = require("opendsu");
	}

	if(typeof $$.__runtimeModules["pskcrypto"] === "undefined"){
		$$.__runtimeModules["pskcrypto"] = require("pskcrypto");
	}

	if(typeof $$.__runtimeModules["psk-cache"] === "undefined"){
		$$.__runtimeModules["psk-cache"] = require("psk-cache");
	}

	if(typeof $$.__runtimeModules["double-check"] === "undefined"){
		$$.__runtimeModules["double-check"] = require("double-check");
	}

	if(typeof $$.__runtimeModules["blockchain"] === "undefined"){
		$$.__runtimeModules["blockchain"] = require("blockchain");
	}

	if(typeof $$.__runtimeModules["swarmutils"] === "undefined"){
		$$.__runtimeModules["swarmutils"] = require("swarmutils");
	}

	if(typeof $$.__runtimeModules["queue"] === "undefined"){
		$$.__runtimeModules["queue"] = require("queue");
	}

	if(typeof $$.__runtimeModules["soundpubsub"] === "undefined"){
		$$.__runtimeModules["soundpubsub"] = require("soundpubsub");
	}

	if(typeof $$.__runtimeModules["dossier"] === "undefined"){
		$$.__runtimeModules["dossier"] = require("dossier");
	}

	if(typeof $$.__runtimeModules["swarm-engine"] === "undefined"){
		$$.__runtimeModules["swarm-engine"] = require("swarm-engine");
	}

	if(typeof $$.__runtimeModules["bdns"] === "undefined"){
		$$.__runtimeModules["bdns"] = require("bdns");
	}

	if(typeof $$.__runtimeModules["key-ssi-resolver"] === "undefined"){
		$$.__runtimeModules["key-ssi-resolver"] = require("key-ssi-resolver");
	}

	if(typeof $$.__runtimeModules["buffer-crc32"] === "undefined"){
		$$.__runtimeModules["buffer-crc32"] = require("buffer-crc32");
	}
};
if (false) {
	testsRuntimeLoadModules();
}
global.testsRuntimeRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("testsRuntime");
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"bdns":"bdns","blockchain":"blockchain","buffer-crc32":"buffer-crc32","dossier":"dossier","double-check":"double-check","key-ssi-resolver":"key-ssi-resolver","opendsu":"opendsu","overwrite-require":"overwrite-require","psk-cache":"psk-cache","pskcrypto":"pskcrypto","queue":"queue","soundpubsub":"soundpubsub","swarm-engine":"swarm-engine","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/bdns/lib/BDNS.js":[function(require,module,exports){
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
},{"overwrite-require":"overwrite-require","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/OBFTImplementation.js":[function(require,module,exports){
let pskcrypto = require("pskcrypto");
let fs = require("fs");

let consUtil = require("./transactionsUtil");



let detailedDebug = false;




let OBFTPSwarm = $$.flow.describe("OBFTProcess", {
    start: function (delegatedAgentName, communicationOutlet, pdsAdapter, pulsePeriodicity, latency, votingBox) {

        this.lset = {}; // digest -> transaction - localy generated set of transactions (`createTransactionFromSwarm` stores each transaction; `beat` resets `lset`)
        /*this.dset = {}; // digest -> transaction - remotely delivered set of transactions that will be next participate in consensus
        this.pset = {}; // digest -> transaction - consensus pending set */

        this.CP = 0;
        this.CI = undefined;
        this.LAST = 0;
        this.TOP = this.LAST+2*latency;
        this.NEXT = this.TOP+latency;
        this.NTOP = this.TOP+2*latency;

        this.pulsesHistory = new PulseHistory();

        this.vsd = pdsAdapter.getHashLatestBlock();


        this.currentBlock = 0;
        this.nodeName               = delegatedAgentName;
        this.communicationOutlet    = communicationOutlet;
        this.pds                    = pdsAdapter;
        this.PP                     = pulsePeriodicity;
        this.LATENCY                = latency;
        this.votingBox              = votingBox;
        this.explictPhase           = "default"; /* default, boot, late, broken*/

        this.bootNode();
    },
    /*
    * @param {transaction}
    */
    receiveTransaction:function(t){
        this.lset[t.digest] = t;
    },
    /*
     * @param {}
    */
    sendPulse: function () {
        switch(this.explictPhase){
            case "boot": break;
            case "late": break;
            case "ntop": this.sendAtNTOP(); break;
            case "broken":this.whenBroken_HumanInterventionIsRequired(); break
            default:
                if(this.CP <= this.TOP) this.sendUntilTOP(); else
                if(this.CP < this.NEXT) this.sendUntilNEXT(); else
                if(this.CP == this.NEXT) this.sendAtNEXT(); else
                if(this.CP < this.NTOP) this.sendUntilNTOP(); else
                if(this.CP == this.NTOP) this.sendAtNTOP(); else
                    console.log("Should not happen");
        }
        setTimeout(this.sendPulse, this.PP);   //self invocation of the phase
    },
    /*
     * @param {}
    */
    sendUntilTOP: function () {
        communicationOutlet.newPulse()
    },
    /*
     * @param {}
    */
    sendUntilNEXT: function () {

    },
    /*
     * @param {}
    */
    sendAtNEXT: function () {

    },
    /*
     * @param {}
    */
    sendUntilNTOP: function () {

    },
    /*
     * @param {}
    */
    sendAtNTOP: function () {

    },
    /*
     * @param {}
    */
    whenSlowNode: function () {

    },
    /*
     * @param {}
    */
    whenSlowNetwork: function () {

    },
    /*
     * @param {}
    */
    whenBroken_HumanInterventionIsRequired: function () {

    },
    /*
     * @param {pulse}
    */
    receivePulse:function(pulse){

    },
    /*
     * @param {}
    */
    bootNode: function () {
        this.explictPhase = "BOOT";
    },
     /*
     * @param {Pulse} pulse e.g. new Pulse(this.nodeName, this.currentPulse, ......)
     */
    recordPulse: function (pulse) {
    },
    /*
         * @param {}
        */
    requestMissingPulse: function () {

    }
});


/**
 * @param {String} delegatedAgentName e.g. 'Node 0', or 'agent_007'
 * @param {Object} communicationOutlet e.g. object to be used in phase `beat` of the returned "pulseSwarm" flow
 *  - it should have a property: `broadcastPulse`: function(from, pulse) {...}
 *      - {String} `from` e.g. `delegatedAgentName`
 *      - {Pulse} `pulse` (see 'transactionsUtil.js')
 * @param {InMemoryPDS} pdsAdapter e.g. require("pskdb/lib/InMemoryPDS").newPDS(null);
 * @param {Number} pulsePeriodicity e.g. 300
 * 
 * @returns {SwarmDescription} A new instance of "pulseSwarm" flow, with phase `start` already running
 */
exports.createConsensusManager = function (delegatedAgentName, communicationOutlet, pdsAdapter, pulsePeriodicity, votingBox) {
    let instance = pulseSwarm();
    instance.start(delegatedAgentName, communicationOutlet, pdsAdapter, pulsePeriodicity, votingBox);
    return instance;
}

},{"./transactionsUtil":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/transactionsUtil.js","fs":false,"pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/PulseUtil.js":[function(require,module,exports){
function PulseUtil(signer, currentPulseNumber, block, newTransactions, vsd, top, last) {
    this.signer         = signer;               //a.k.a. delegatedAgentName
    this.currentPulse   = currentPulseNumber;
    this.lset           = newTransactions;      //digest -> transaction
    this.ptBlock        = block;                //array of digests
    this.vsd            = vsd;
    this.top            = top;                  // a.k.a. topPulseConsensus
    this.last           = last;                 // a.k.a. lastPulseAchievedConsensus
}


module.exports.createPulse = function (signer, CP, CI, lset, top, last) {
    return new PulseUtil(signer, CP, CI, lset, vsd, top, last);
}


function PulseHistory(){

}

module.exports.createPulseHistory = function () {
    return new PulseHistory();
}
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/transactionsUtil.js":[function(require,module,exports){
/*
consensus helper functions when working with transactions
*/

let  pskcrypto = require("pskcrypto");


module.exports.orderCRTransactions = function (pset) { //order in place the pset array
    var arr = [];
    for (let d in pset) {
        arr.push(pset[d]);
    }

    arr.sort(function (t1, t2) {
        if (t1.transactionPulse < t2.transactionPulse) return -1;
        if (t1.transactionPulse > t2.transactionPulse) return 1;
        if (t1.second < t2.second) return -1;
        if (t1.second > t2.second) return 1;
        if (t1.nanosecod < t2.nanosecod) return -1;
        if (t1.nanosecod > t2.nanosecod) return 1;
        if (t1.digest < t2.digest) return -1;
        if (t1.digest > t2.digest) return 1;
        return 0; //only for identical transactions...
    })
    return arr;
}

},{"pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/blockchainSwarmTypes/asset_swarm_template.js":[function(require,module,exports){
var CNST = require("../moduleConstants");

exports.createForObject = function(valueObject, thisObject, localId){
	var callflowModule = require("callflow");
	var ret = callflowModule.createStandardAPIsForSwarms(valueObject, thisObject, localId);

	ret.swarm           = null;
	ret.onReturn        = null;
	ret.onResult        = null;
	ret.asyncReturn     = null;
	ret.return          = null;
	ret.home            = null;

	ret.autoInit        = function(blockchain){
		if(!blockchain) {
			$$.warn("Initialisation asset outside of a blockchain context");
			return;
		}
		let sp = thisObject.getMetadata(CNST.SECURITY_PARADIGM);
		thisObject.securityParadigm = blockchain.getSPRegistry().getSecurityParadigm(thisObject);
		if(sp == undefined){
			let ctor = valueObject.myFunctions[CNST.CTOR];
			if(ctor){
				ctor.apply(thisObject);
			}
		}
	};

	ret.getSwarmId = function(){
		return 	thisObject.getMetadata(CNST.SWARMID);
	};

	ret.getSwarmType = function(){
		return 	thisObject.getMetadata(CNST.SWARMTYPE);
	};

	ret.__reinit = function(blockchain){
		ret.autoInit(blockchain);
	};

	ret.asJSON = function(){
		return thisObject.getInnerValue().publicVars;
	};

	return ret;
};
},{"../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleConstants.js","callflow":false}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/blockchainSwarmTypes/transaction_swarm_template.js":[function(require,module,exports){
let CNST = require("../moduleConstants");

exports.createForObject = function(valueObject, thisObject, localId){
	let callflowModule = require("callflow");

	let _blockchain = undefined;
	let ret = callflowModule.createStandardAPIsForSwarms(valueObject, thisObject, localId);
	ret.swarm           = null;
	ret.onReturn        = null;
	ret.onResult        = null;
	ret.asyncReturn     = null;
	ret.autoInit        = function(blockchain){
		_blockchain = blockchain;
		thisObject.transaction = blockchain.beginTransaction(thisObject);
	};

	ret.commit = function () {
		_blockchain.commit(thisObject.transaction, (error, status) => {
			thisObject.transaction.getSwarm().notify({eventType: "commit", error, status});
		});
	};

	ret.onCommit = function (callback) {
		thisObject.observe((event) => {
			callback(event.error, event.status);
		}, undefined, (event)=>{
			return event.eventType === "commit";
		});
	};

	ret.onReturn = function (callback) {
		thisObject.observe((event) => {
			callback(event.error, event.result);
		}, undefined, (event)=>{
			return event.eventType === "return";
		});
	};

	ret.return = function(error, result){
		thisObject.notify({eventType: "return", error, result});
	};

	ret.home = ret.return;

	return ret;
};
},{"../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleConstants.js","callflow":false}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/ACLScope.js":[function(require,module,exports){

$$.asset.describe("ACLScope", {
    public:{
        concern:"string:key",
        db:"json"
    },
    init:function(concern){
        this.concern = concern;
    },
    addResourceParent : function(resourceId, parentId){

    },
    addZoneParent : function(zoneId, parentId){

    },
    grant :function(agentId,  resourceId){

    },
    allow :function(agentId,  resourceId){
        return true;
    }
});
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/Agent.js":[function(require,module,exports){

$$.asset.describe("Agent", {
    public:{
        alias:"string:key",
        publicKey:"string"
    },
    init:function(alias, value){
        this.alias      = alias;
        this.publicKey  = value;
    },
    update:function(value){
        this.publicKey = value;
    },
    addAgent: function () {
        throw new Error('Not Implemented');
    },
    listAgent: function () {
        throw new Error('Not Implemented');

    },
    removeAgent: function () {
        throw new Error('Not Implemented');

    }
});
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/Backup.js":[function(require,module,exports){

$$.asset.describe("Backup", {
    public:{
        id:  "string",
        url: "string"
    },

    init:function(id, url){
        this.id = id;
        this.url = url;
    }
});

},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/BarAnchor.js":[function(require,module,exports){
$$.asset.describe("BarAnchor", {
    public: {
        alias: "string",
        mountPoint: "string",
        brickMapDigest: "string",
        readList: "array", //encrypted seeds with public keys
        writeList: "array", //agentIds
    },
    init: function (mountPoint, brickMapDigest) {
        this.mountPoint = mountPoint;
        this.brickMapDigest = brickMapDigest;
    },
    updateReadList: function (encryptedSeed) {
        if (!this.readList) {
            this.readList = [];
        }
        this.readList.push(encryptedSeed);
    },
    updateWriteList: function (agentId) {
        if (!this.writeList) {
            this.writeList = [];
        }

        this.writeList.push(agentId);
    }
});
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/CSBMeta.js":[function(require,module,exports){

$$.asset.describe("CSBMeta", {
	public:{
		isMaster:"string",
		alias:"string:key",
		description: "string",
		creationDate: "string",
		updatedDate : "string",
		id: "string",
		icon: "string"
	},
	init:function(id){
		this.alias = "meta";
		this.id = id;
	},

	setIsMaster: function (isMaster) {
		this.isMaster = isMaster;
	}

});

},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/DomainConfig.js":[function(require,module,exports){

$$.asset.describe("DomainConfig", {
    public:{
        alias:"string:key",
        blockChainStorageFolderName:"",
        addresses: "map",
        communicationInterfaces: "map",
        workerStrategy: "string"
    },
    init:function(alias){
        this.alias = alias;
        this.addresses = {};
        this.communicationInterfaces = {};
        this.workerStrategy = 'threads';
    },
    updateDomainAddress:function(replicationAgent, address){
        if(!this.addresses){
            this.addresses = {};
        }
        this.addresses[replicationAgent] = address;
    },
    removeDomainAddress:function(replicationAgent){
        this.addresses[replicationAgent] = undefined;
        delete this.addresses[replicationAgent];
    },
    setBlockChainStorageFolderName: function(storageFolderName){
        this.blockChainStorageFolderName = storageFolderName;
    },
    getBlockChainStorageFolderName: function() {
        return this.blockChainStorageFolderName;
    },
    addCommunicationInterface(alias, virtualMQEndpoint, zeroMQEndpoint) {
        if (!this.communicationInterfaces) {
            this.communicationInterfaces = {};
        }
        this.communicationInterfaces[alias] = {virtualMQ: virtualMQEndpoint, zeroMQ: zeroMQEndpoint};
    },
    setWorkerStrategy: function(workerStrategy) {
        this.workerStrategy = workerStrategy;
    }
});
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/DomainReference.js":[function(require,module,exports){

$$.asset.describe("DomainReference", {
    public:{
        role:"string:index",
        alias:"string:key",
        constitution:"string",
        workspace:"string"
    },
    init:function(role, alias){
        this.role = role;
        this.alias = alias;
    },
    setConstitution:function(pathOrUrlOrCSB){
        this.constitution = pathOrUrlOrCSB;
    },
    getConstitution:function(){
        return this.constitution;
    },
    setWorkspace:function(path){
        this.workspace = path;
    },
    getWorkspace:function(){
        return this.workspace;
    }
});
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/FileAnchor.js":[function(require,module,exports){
$$.asset.describe("FileAnchor", {
    public: {
        alias: "string",
        type: "string",
        seed: "string",
        digest: "string", //csb digest after file addition
        readList: "array", //encrypted seeds with public keys
        writeList: "array", //agentIds
    },
    init: function (alias, type, seed, digest) {
        this.alias = alias;
        this.type = type;
        this.seed = seed;
        this.digest = digest;
    }
});


},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/Key.js":[function(require,module,exports){

$$.asset.describe("key", {
    public:{
        alias:"string"
    },
    init:function(alias, value){
        this.alias = alias;
        this.value = value;
    },
    update:function(value){
        this.value = value;
    }
});
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/index.js":[function(require,module,exports){
module.exports = $$.library(function(){
    require("./DomainReference");
    require("./DomainConfig");
    require("./Agent");
    require("./Backup");
    require("./ACLScope");
    require("./Key");
    require("../transactions/transactions");
    require("./BarAnchor");
    require("./FileAnchor");
    require('./CSBMeta');
});
},{"../transactions/transactions":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/transactions.js","./ACLScope":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/ACLScope.js","./Agent":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/Agent.js","./Backup":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/Backup.js","./BarAnchor":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/BarAnchor.js","./CSBMeta":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/CSBMeta.js","./DomainConfig":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/DomainConfig.js","./DomainReference":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/DomainReference.js","./FileAnchor":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/FileAnchor.js","./Key":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/Key.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/swarms/index.js":[function(require,module,exports){
if($$.swarms){
    $$.swarms.describe("transactionHandler", {
        start: function (identity, transactionName, methodName, ...args) {
            let transaction = $$.blockchain.startTransactionAs(identity, transactionName, methodName, ...args);
            transaction.onReturn((err, result) => {
                this.return(err, result);
            });
        }
    });
}

},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/agentTransaction.js":[function(require,module,exports){
const sharedPhases = require('./sharedPhases');

$$.transaction.describe("Agents", {
    add: function (alias, publicKey) {
        let agent = $$.blockchain.lookup("Agent", alias);
        if(!agent){
            agent = $$.asset.start("Agent", "init", alias, publicKey);
        }else{
            $$.exception(`Agent with ${alias} already exists!`);
        }

        this.transaction.add(agent);
        this.onCommit(()=>{
            this.return(undefined, agent.asJSON());
        });
        this.commit();
    },
    getAgents: sharedPhases.getAllAssetsFactory('global.Agent')
});

},{"./sharedPhases":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/sharedPhases.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/domainConfigTransaction.js":[function(require,module,exports){
const sharedPhases = require('./sharedPhases');

$$.transaction.describe("DomainConfigTransaction", {
    add: function (alias, communicationInterfaces, workerStrategy) {
        let domain = this.transaction.lookup("DomainConfig", alias);

        if(!domain){
            domain = this.transaction.createAsset("DomainConfig", "init", alias);
        }else{
            $$.exception(`Domain with ${alias} already exists!`);
        }

        if(typeof communicationInterfaces !== "undefined"){
            Object.keys(communicationInterfaces).forEach(commAlias => {
                const {virtualMQ, zeroMQ} = communicationInterfaces[commAlias];
                domain.addCommunicationInterface(commAlias, virtualMQ, zeroMQ);
            });
        }

        if(workerStrategy) {
            domain.setWorkerStrategy(workerStrategy);
        }

        this.transaction.add(domain);
        this.onCommit(()=>{
            this.return(undefined, domain.asJSON());
        });
        this.commit();
    },
    getDomainDetails: sharedPhases.getAssetFactory('global.DomainConfig'),
    getDomains: sharedPhases.getAllAssetsFactory('global.DomainConfig')
});

},{"./sharedPhases":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/sharedPhases.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/domainTransaction.js":[function(require,module,exports){
const sharedPhases = require('./sharedPhases');

$$.transaction.describe("Domain", {
    add: function (alias, role, workspace, constitution) {
        let domain = this.transaction.lookup("DomainReference", alias);

        if(!domain){
            domain = this.transaction.createAsset("DomainReference", "init", role, alias);
        }else{
            $$.exception(`Domain with ${alias} already exists!`);
        }

        if(typeof workspace !== "undefined"){
            domain.setWorkspace(workspace);
        }

        if(typeof constitution !== "undefined"){
            domain.setConstitution(constitution);
        }

        this.transaction.add(domain);
        this.onCommit(()=>{
            this.return(undefined, domain.asJSON());
        });
        this.commit();
    },
    connectDomainLocally: function(alias, localInterface){
        let domain = this.transaction.lookup("DomainReference", alias);
        domain.addLocalInterface('local', localInterface);

        this.transaction.add(domain);
        this.onCommit(()=>{
            this.return(undefined, domain.asJSON());
        });
        this.commit();
    },
    setWorkspaceForDomain: function(alias, workspace){
        let domain = this.transaction.lookup("DomainReference", alias);
        domain.setWorkspace(workspace);

        this.transaction.add(domain);
        this.onCommit(()=>{
            this.return(undefined, domain.asJSON());
        });
        this.commit();
    },
    setConstitutionForDomain: function(alias, constitution){
        let domain = this.transaction.lookup("DomainReference", alias);
        domain.setConstitution(constitution);

        this.transaction.add(domain);
        this.onCommit(()=>{
            this.return(undefined, domain.asJSON());
        });
        this.commit();
    },
    getDomainDetails:function(alias){
        let domain = this.transaction.lookup("DomainReference", alias);
        return domain.toJson();
    },
    connectDomainToRemote(domainName, alias, remoteEndPoint){
        let domain = this.transaction.lookup("DomainReference", domainName);
        domain.addRemoteInterface(alias, remoteEndPoint);

        this.transaction.add(domain);
        this.onCommit(()=>{
            this.return(undefined, domain.asJSON());
        });
        this.commit();
    },
    setWorkerStrategy: function (alias, workerStrategy) {
        const domainReference =  this.transaction.lookup("DomainReference", alias);
        if(!domainReference) {
            $$.exception(`Domain with alias ${alias} does not exist!`);
        }

        domainReference.setWorkerStrategy(workerStrategy);

        this.transaction.add(domainReference);
        this.onCommit(()=>{
            this.return(undefined, domainReference.asJSON());
        });
        this.commit();
    },
    setMaximumNumberOfWorkers: function (alias, maximumNumberOfWorkers) {
        const domainReference =  this.transaction.lookup("DomainReference", alias);
        if(!domainReference) {
            $$.exception(`Domain with alias ${alias} does not exist!`);
        }

        domainReference.setMaximumNumberOfWorkers(maximumNumberOfWorkers);

        this.transaction.add(domainReference);
        this.onCommit(()=>{
            this.return(undefined, domainReference.asJSON());
        });
        this.commit();
    },
    getDomainDetails: sharedPhases.getAssetFactory('global.DomainReference'),
    getDomains: sharedPhases.getAllAssetsFactory('global.DomainReference')
});

},{"./sharedPhases":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/sharedPhases.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/firstTransactionWorkaroundDeleteThis.js":[function(require,module,exports){
/**
 * FIXME
 * The first block in the blockchain is 0.
 * When creating a CSB, if only one transaction is committed (only one block written) then only the block 0
 * will be written and blocks/index will have the value 0
 * When loading again the CSB, the CSB's blockchain will replay transaction from pulse 0 until 0, currentPulse
 * remaining 0. When creating a new transaction, it will have pulse 0 again and the block 0 will be overwritten.
 *
 * This transaction's purpose is to always start the blockchain with at least one transaction so it will hopefully
 * write at least two blocks in the beginning
 */
$$.transaction.describe("TooShortBlockChainWorkaroundDeleteThis", {
    add: function () {
        this.onCommit(()=>{
            this.return();
        });
        this.commit();
    }
});
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/index.js":[function(require,module,exports){
require('./domainTransaction');
require('./agentTransaction');
require('./standardCSBTransactions');
require('./domainConfigTransaction');
require('./firstTransactionWorkaroundDeleteThis');
},{"./agentTransaction":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/agentTransaction.js","./domainConfigTransaction":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/domainConfigTransaction.js","./domainTransaction":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/domainTransaction.js","./firstTransactionWorkaroundDeleteThis":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/firstTransactionWorkaroundDeleteThis.js","./standardCSBTransactions":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/standardCSBTransactions.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/sharedPhases.js":[function(require,module,exports){
module.exports = {
    getAssetFactory: function(assetType) {
        return function(alias) {
            const transaction = $$.blockchain.beginTransaction({});
            const domainReferenceSwarm = transaction.lookup(assetType, alias);

            if(!domainReferenceSwarm) {
                this.return(new Error(`Could not find swarm named "${assetType}"`));
                return;
            }

            this.return(undefined, domainReferenceSwarm.asJSON());
        }
    },
    getAllAssetsFactory: function(assetType) {
        return function() {
            const transaction = $$.blockchain.beginTransaction({});
            const domains = transaction.loadAssets(assetType) || [];

            this.return(undefined, domains.map(domain => domain.asJSON()));
        };
    }
};
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/standardCSBTransactions.js":[function(require,module,exports){
$$.transaction.describe("StandardCSBTransactions", {
    addBarAnchor: function (mountPoint, brickMapDigest) {
        this.transaction.createAsset("BarAnchor", "init", mountPoint, brickMapDigest);
        this.commit();
    },

    addFileAnchor: function (alias, type, seed, digest) {
        try{
            let fileAnchor = this.transaction.createAsset("FileAnchor", "init", alias, type, seed, digest);

            this.onCommit(() => {
                this.return(undefined, fileAnchor.asJSON());
            });

            this.commit();

        }catch(e) {
            this.return(e.message);
        }
    },

    domainLookup: function(alias){
        try{
            let fileAnchor = this.transaction.lookup("FileAnchor", alias);
            this.return(undefined, fileAnchor ? fileAnchor.asJSON() : "");
        }catch(err){
            this.return(err.message);
        }
    },
    updateFileDigest: function (alias, digest) {
        const file = this.transaction.lookup("FileAnchor", alias);
        file.digest = digest;
        this.transaction.add(file);
        this.transaction.commit();
    },
    getSeed: function (alias) {
        try {
            const anchor = this.transaction.lookup("FileAnchor", alias);
            this.return(undefined, anchor.seed);
        } catch (e) {
            this.return(e.message);
        }
    }
});
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/transactions.js":[function(require,module,exports){
$$.transaction.describe("transactions", {
    updateKey: function (key, value) {
        var transaction = $$.blockchain.beginTransaction(this);
        var key = transction.lookup("Key", key);
        var keyPermissions = transaction.lookup("ACLScope", "KeysConcern");
        if (keyPermissions.allow(this.agentId, key)) {
            key.update(value);
            transaction.add(key);
            $$.blockchain.commit(transaction);
        } else {
            this.securityError("Agent " + this.agentId + " denied to change key " + key);
        }
    },
    addChild: function (alias) {
        var transaction = $$.blockchain.beginTransaction();
        var reference = $$.contract.start("DomainReference", "init", "child", alias);
        transaction.add(reference);
        $$.blockchain.commit(transaction);
    },
    addParent: function (value) {
        var reference = $$.contract.start("DomainReference", "init", "child", alias);
        this.transaction.save(reference);
        $$.blockchain.persist(this.transaction);
    },
    addAgent: function (alias, publicKey) {
        var reference = $$.contract.start("Agent", "init", alias, publicKey);
        this.transaction.save(reference);
        $$.blockchain.persist(this.transaction);
    },
    updateAgent: function (alias, publicKey) {
        let agent = this.transaction.lookup("Agent", alias);
        agent.update(publicKey);
        this.transaction.save(agent);
        $$.blockchain.persist(this.transaction);
    }
});


$$.newTransaction = function(transactionFlow,ctor,...args){
    var transaction = $$.swarm.start( transactionFlow);
    transaction.meta("agentId", $$.currentAgentId);
    transaction.meta("command", "runEveryWhere")
    transaction.meta("ctor", ctor);
    transaction.meta("args", args);
    transaction.sign();
    //$$.blockchain.sendForConsent(transaction);
    //temporary until consent layer is activated
    transaction[ctor].apply(transaction,args);
}

/*
usages:
    $$.newTransaction("domain.transactions", "updateKey", "key", "value")

 */

},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleConstants.js":[function(require,module,exports){
module.exports = {
    ALIAS:"alias",
    ALIASES : '/aliases',
    SECURITY_PARADIGM:"SecurityParadigm",
    RESTRICTED:"Restricted",
    CONSTITUTIONAL:"Constitutional",
    PREDICATIVE:"Predicative",
    CTOR:"ctor",
    COMMAND_ARGS:"COMMAND_ARGS",
    SIGNING_AGENT:"SIGNING_AGENT",
    INTIALISATION_CONTEXT:"intialisationContext",
    SWARMID:"swarmId",
    SWARMTYPE:"swarmTypeName"
};
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleExports.js":[function(require,module,exports){
module.exports = {
    createBlockchain:function(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, loadDefaultConstitution, forcedBoot){
        return require("./pskdb").startDefaultDB(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, loadDefaultConstitution, forcedBoot);
    },
    createABlockchain:function(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, loadDefaultConstitution, forcedBoot){
        return require("./pskdb").startDB(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, loadDefaultConstitution, forcedBoot);
    },
    createHistoryStorage:function(storageType,...args){
        return require("./strategies/historyStorages/historyStoragesRegistry").createStorage(storageType,...args);
    },
    createWorldStateCache:function(storageType,...args){
        return require("./strategies/worldStateCaches/worldStateCacheRegistry").createCache(storageType,...args);
    },
    createConsensusAlgorithm:function(name,...args){
        return require("./strategies/consensusAlgortims/consensusAlgoritmsRegistry").createAlgorithm(name,...args);
    },
    createCRTransaction:function (swarmType, command, input, output, currentPulse) {
        /*
            class for Command or Result transactions
        */
        function CRTransaction(swarmType, command, input, output, currentPulse) {
            var pskcrypto = require("pskcrypto");

            this.swarmType = swarmType;

            if(input && output){
                this.input      = input;
                this.output     = output;
            }
            this.command      = command;

            let arr = process.hrtime();
            this.second     = arr[0];
            this.nanosecod  = arr[1];
            this.transactionPulse = currentPulse;
            this.digest     = pskcrypto.hashValues(this);
        }

        return new CRTransaction(swarmType, command, input, output, currentPulse);
    },
    createBlock:function (blockset, pulse, previous) {
        let pskcrypt = require("pskcrypto");
        var block = {blockset, pulse, previous};
        block.hash = pskcrypt.hashValues(block);
        return block;
    },
    createSignatureProvider:function(name,...args){
        return require("./strategies/signatureProvidersRegistry/signatureProvidersRegistry").createSignatureProvider(name,...args);
    },
    createNetworkCommunicationStrategy:function(name,...args){
        return require("./strategies/networkCommunication/networkCommunicationStrategiesRegistry").createNetworkAdapter(name,...args);
    },
    createVotingStrategy:function(name,...args){
        return require("./strategies/votingStrategies/votingStrategiesRegistry").createVotingStrategy(name,...args);
    }
}
},{"./pskdb":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/index.js","./strategies/consensusAlgortims/consensusAlgoritmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/consensusAlgortims/consensusAlgoritmsRegistry.js","./strategies/historyStorages/historyStoragesRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/historyStoragesRegistry.js","./strategies/networkCommunication/networkCommunicationStrategiesRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/networkCommunication/networkCommunicationStrategiesRegistry.js","./strategies/signatureProvidersRegistry/signatureProvidersRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/signatureProvidersRegistry/signatureProvidersRegistry.js","./strategies/votingStrategies/votingStrategiesRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/votingStrategies/votingStrategiesRegistry.js","./strategies/worldStateCaches/worldStateCacheRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/worldStateCaches/worldStateCacheRegistry.js","pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/Blockchain.js":[function(require,module,exports){
const bm = require('../moduleExports');
const beesHealer = require("swarmutils").beesHealer;
var CNST = require("../moduleConstants");

function AliasIndex(assetType, pdsHandler, worldStateCache) {
    this.create = function (alias, uid) {
        const assetAliases = this.getAliases();

        if (typeof assetAliases[alias] !== "undefined") {
            $$.exception(`Alias ${alias} for assets of type ${assetType} already exists`);
        }

        assetAliases[alias] = uid;

        worldStateCache.writeKey(assetType + CNST.ALIASES, J(assetAliases));
    };

    this.getUid = function (alias) {
        const assetAliases = this.getAliases();
        //console.log("assetAliases", assetAliases);
        return assetAliases[alias];
    };

    this.getAliases = function () {
        let aliases = worldStateCache.readKey(assetType + CNST.ALIASES);
        return aliases ? JSON.parse(aliases) : {};
    }
}

function createLoadAssets(blockchain, pdsHandler, worldStateCache) {
    return function (assetType) {
        assetType = $$.fixSwarmName(assetType);
        const assets = [];

        const aliasIndex = new AliasIndex(assetType, pdsHandler, worldStateCache);
        Object.keys(aliasIndex.getAliases()).forEach(alias => {
            assets.push(blockchain.lookup(assetType, alias));
        });

        return assets;
    };
}

function createLookup(blockchain, pdsHandler, SPRegistry, worldStateCache) {
    function hasAliases(spaceName) {
        let ret = !!worldStateCache.readKey(spaceName + CNST.ALIASES);
        return ret;
    }

    return function (assetType, aid) { // aid == alias or id

        let localUid = aid;
        assetType = $$.fixSwarmName(assetType);

        if (hasAliases(assetType)) {
            const aliasIndex = new AliasIndex(assetType, pdsHandler, worldStateCache);
            localUid = aliasIndex.getUid(aid) || aid;
        }

        const value = pdsHandler.readKey(assetType + '/' + localUid, true);

        if (!value) {
            $$.log("Lookup fail, asset not found: ", assetType, " with alias", aid, value);
            //pdsHandler.dump();
            //return $$.asset.start(assetType);
            return null;
        } else {
            const asset = $$.asset.continue(assetType, JSON.parse(value));
            asset.__reinit(blockchain);
            return asset;
        }
    };
}

function Blockchain(pskdb, consensusAlgorithm, worldStateCache, signatureProvider) {
    let spr = require("./securityParadigms/securityParadigmRegistry").getRegistry(this);
    let self = this;

    consensusAlgorithm.setPSKDB(pskdb);

    this.beginTransaction = function (transactionSwarm, handler) {
        if (!transactionSwarm) {
            $$.exception("Can't begin a transaction outside of a swarm instance from transactions namespace");
        }
        if (!handler) {
            handler = pskdb.getHandler();
        }
        return new Transaction(self, handler, transactionSwarm, worldStateCache, spr);
    };


    this.start = function (reportBootingFinishedCallback) {
        pskdb.initialise(function (err, res) {
            reportBootingFinishedCallback(err, self);
        });
    };


    this.lookup = function (assetType, aid) {
        let newLookup = createLookup(self, pskdb.getHandler(), spr, worldStateCache);
        return newLookup(assetType, aid);
    };

    this.loadAssets = createLoadAssets(self, pskdb.getHandler(), worldStateCache);

    this.getSPRegistry = function () {
        return spr;
    };

    this.signAs = function (agentId, msg) {
        return signatureProvider.signAs(agentId, msg);
    };

    this.verifySignature = function (msg, signatures) {
        return signatureProvider.verify(msg, signatures);
    };


    this.registerSecurityParadigm = function (SPName, apiName, factory) {
        return spr.register(SPName, apiName, factory);
    };


    this.startCommandAs = function (agentId, transactionSwarmType, ...args) {
        let t = bm.createCRTransaction(transactionSwarmType, args, null, null, consensusAlgorithm.getCurrentPulse());
        t.signatures = [this.signAs(agentId, t.digest)];
        consensusAlgorithm.commit(t);
    };

    this.startTransactionAs = function (agentId, transactionSwarmType, ...args) {
        let swarm = $$.transaction.startWithContext(self, transactionSwarmType, ...args);
        swarm.setMetadata(CNST.COMMAND_ARGS, args);
        swarm.setMetadata(CNST.SIGNING_AGENT, agentId);
        return swarm;
        //console.log(swarm);
    };

    this.commit = function (transaction, callback) {
        let swarm = transaction.getSwarm();
        let handler = transaction.getHandler();
        const diff = handler.computeSwarmTransactionDiff(swarm);
        //console.log("Diff is", diff.output);
        const t = bm.createCRTransaction(swarm.getMetadata("swarmTypeName"), swarm.getMetadata(CNST.COMMAND_ARGS), diff.input, diff.output, consensusAlgorithm.getCurrentPulse());
        t.signatures = [self.signAs(swarm.getMetadata(CNST.SIGNING_AGENT), t.digest)];
        consensusAlgorithm.commit(t, callback);
    };

    this.onceAllCommitted = pskdb.onceAllCommitted;

    this.dump = function () {
        pskdb.getHandler().dump();
    };
}

function Transaction(blockchain, pdsHandler, transactionSwarm, worldStateCache, spr) {

    let self = this;

    this.getSwarm = function () {
        return transactionSwarm;
    };

    this.getHandler = function () {
        return pdsHandler;
    };

    this.add = function (asset) {
        const swarmTypeName = asset.getMetadata('swarmTypeName');
        const swarmId = asset.getMetadata('swarmId');

        const aliasIndex = new AliasIndex(swarmTypeName, pdsHandler, worldStateCache);
        if (asset.alias && aliasIndex.getUid(asset.alias) !== swarmId) {
            aliasIndex.create(asset.alias, swarmId);
        }


        const serializedSwarm = beesHealer.asJSON(asset, null, null);
        pdsHandler.writeKey(swarmTypeName + '/' + swarmId, J(serializedSwarm));
    };

    this.lookup = createLookup(blockchain, pdsHandler, spr, worldStateCache);

    this.loadAssets = createLoadAssets(blockchain, pdsHandler, worldStateCache);

    this.createAsset = function (swarmTypeName, ctor, ...args) {
        let asset = $$.assets.startWithContext(blockchain, swarmTypeName, ctor, ...args);
        this.add(asset);
        return asset;
    };

    this.reviveAsset = function (assetValue) {
        let asset = $$.assets.continue(assetValue);
        asset.__reinit(self);
        return asset;
    };


    this.commit = function () {
        blockchain.commit(self);
    };
}

module.exports = Blockchain;
},{"../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleConstants.js","../moduleExports":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleExports.js","./securityParadigms/securityParadigmRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/securityParadigms/securityParadigmRegistry.js","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/index.js":[function(require,module,exports){
const Blockchain = require('./Blockchain');

module.exports = {
    startDB: function (worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, loadDefaultConstitution) {
        if(loadDefaultConstitution){
            require('../defaultConstitution/assets/index');
            require('../defaultConstitution/swarms/index');
            require('../defaultConstitution/transactions/index');
        }
        let pds = require('./pskdb').newPSKDB(worldStateCache, historyStorage);
        consensusAlgorithm.pskdb = pds;
        let blockchain = new Blockchain(pds, consensusAlgorithm, worldStateCache, signatureProvider);
        pds.blockchain = blockchain;
        return blockchain;
    },
    startDefaultDB: function (worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, loadDefaultConstitution, forceReboot) {
        if ($$.blockchain && !forceReboot) {
            $$.exception('$$.blockchain is already defined. Throwing an exception!');
        }
        if(!worldStateCache || !historyStorage || !consensusAlgorithm || !signatureProvider){
            console.error("Initialisation failed with arguments:", worldStateCache, historyStorage, consensusAlgorithm, signatureProvider);
            $$.exception('$$.blockchain initialisation failed! Throwing an exception!');
        }
        $$.blockchain = this.startDB(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, loadDefaultConstitution);
        return $$.blockchain;
    }
};

},{"../defaultConstitution/assets/index":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/assets/index.js","../defaultConstitution/swarms/index":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/swarms/index.js","../defaultConstitution/transactions/index":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/defaultConstitution/transactions/index.js","./Blockchain":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/Blockchain.js","./pskdb":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/pskdb.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/pskdb.js":[function(require,module,exports){
let CNST = require("../moduleConstants");
let cutil = require("../OBFT/transactionsUtil");
// let bm = require("../moduleExports");

//var ssutil  = require("pskcrypto");


function KeyValueDBWithVersions(worldStateCache) { //main storage
    let cset = {};  // contains all keys
    let keyVersions = {};  //will store versions
    let self = this;

    this.dump = function () {
        //console.log("Main Storage", {keyVersions,cset})
        worldStateCache.dump();
    };

    this.readKey = function (keyName, mandatoryToExist) {
        if (keyVersions.hasOwnProperty(keyName)) {
            return cset[keyName];
        }
        if (mandatoryToExist) {
            keyVersions[keyName] = 0;
        }
        return undefined;
    };

    this.writeKey = function (keyName, value, newVersion) {

        if (keyVersions.hasOwnProperty(keyName)) {
            if (!newVersion) {
                keyVersions[keyName]++;
            } else {
                keyVersions[keyName] = newVersion;
            }
        } else {
            keyVersions[keyName] = 0;
        }
        cset[keyName] = value;
    };

    this.version = function (keyName) {
        if (keyVersions.hasOwnProperty(keyName)) {
            return keyVersions[keyName];
        }
        return undefined;
    };

    this.getInternalValues = function (currentPulse) {
        return {
            cset,
            versions: keyVersions,
            currentPulse
        }
    }
}

function DBTransactionHandler(parentStorage) {
    let readSetVersions = {}; //version of a key when read first time
    let writeSet = {};  //contains only keys modified in handlers

    this.dump = function () {
        console.log("DBTransactionHandler:", {readSetVersions, writeSet});
        parentStorage.dump();
    };

    this.readKey = function (keyName, mandatoryToExist) {
        function internalReadKey() {
            if (readSetVersions.hasOwnProperty(keyName)) {
                return writeSet[keyName];
            }
            let version = parentStorage.version(keyName);
            if (version != undefined) {
                readSetVersions[keyName] = version;
            }
            return parentStorage.readKey(keyName);
        }

        let result = internalReadKey();
        //writeSet[keyName] = result;

        /*
        if(mandatoryToExist){
            console.debug("Looking for ", keyName, " Version:", parentStorage.version(keyName), "Result:", result);
        }
        if(!result && mandatoryToExist){
            console.error("Found nothing for", keyName, "Key Version:", parentStorage.version(keyName));
            this.dump();
            $$.exception("Mandatory key not found:" + keyName);
        }*/
        return result;
    };

    this.writeKey = function (keyName, value) {
        this.readKey(keyName);         //save read version
        writeSet[keyName] = value;
    };

    this.computeSwarmTransactionDiff = function () {
        return {
            input: readSetVersions,
            output: writeSet
        };
    };
}


function PSKDB(worldStateCache, historyStorage) {
    this.blockchain = undefined;
    let mainStorage = new KeyValueDBWithVersions(worldStateCache);
    let self = this;

    let currentPulse = 0;
    let hashOfLatestCommittedBlock = "Genesis Block";

    this.getHandler = function () { // the single way of working with pskdb
        let tempStorage = new DBTransactionHandler(mainStorage);
        return tempStorage;
    };

    this.getCurrentPulse = function () {
        return currentPulse;
    };

    this.setCurrentPulse = function (cp) {
        currentPulse = cp;
    };

    this.getPreviousHash = function () {
        return hashOfLatestCommittedBlock;
    };

    this.initialise = function (reportResultCallback) {
        let gotLatestBlock_done = false;
        let gotState_done = false;
        let lbn = 0;
        let state = 0;
        let cp = 0;

        function loadNextBlock() {
            if (cp > lbn) {
                if (lbn != 0) {
                    currentPulse = cp;
                }
                reportResultCallback(null, lbn);
            } else {
                historyStorage.loadSpecificBlock(cp, function (err, block) {
                    if (block) {
                        self.commitBlock(block, true, (err) => {
                            if(err) {
                                reportResultCallback(err);
                                return;
                            }
                            cp = block.pulse;

                            cp++;
                            loadNextBlock();
                        });
                    } else {
                        cp++;
                        loadNextBlock();
                    }
                })
            }
        }

        function loadMissingBlocksFromHistory() {
            if (gotState_done && gotLatestBlock_done) {
                if (state && state.pulse) {
                    cp = state.pulse;
                }
                console.log("Reloading from cache at pulse ", cp, "and rebuilding state until pulse", lbn);
                if (state.pulse) {
                    mainStorage.initialiseInternalValue(state);
                }
                loadNextBlock();
            }
        }

        function gotLatestBlock(err, val) {
            gotLatestBlock_done = true;
            if (!err) {
                lbn = val;
            }
            loadMissingBlocksFromHistory();
        }

        function gotState(err, val) {
            gotState_done = true;

            if (!err) {
                state = val;
            }
            if (state.latestBlockHash) {
                hashOfLatestCommittedBlock = state.latestBlockHash;
            }
            loadMissingBlocksFromHistory();
        }

        worldStateCache.getState(gotState);
        historyStorage.getLatestBlockNumber(gotLatestBlock);
    };


    this.commitBlock = function (block, doNotSaveHistory, callback) {
        incrementCommitsNumber();
        let blockSet = block.blockset;
        currentPulse = block.pulse;

        let verificationKeySpace = new VerificationKeySpaceHandler(mainStorage, worldStateCache, this.blockchain);

        verificationKeySpace.commit(blockSet);

        hashOfLatestCommittedBlock = block.hash;
        if (!doNotSaveHistory) {
            historyStorage.appendBlock(block, false, (err) => {
                if (err) {
                    return callback(err);
                }

                __updateState();
            });
        } else {
            __updateState()
        }

        function __updateState() {
            let internalValues = mainStorage.getInternalValues(currentPulse);
            internalValues.latestBlockHash = block.hash;
            worldStateCache.updateState(internalValues, (...args) => {
                callback(...args);
                decrementCommitsNumber();
            });
        }
    };

    this.computePTBlock = function (nextBlockSet) {
        let tempStorage = new VerificationKeySpaceHandler(mainStorage, worldStateCache, this.blockchain);
        return tempStorage.computePTBlock(nextBlockSet);
    };

    const notifyCommittedCallbacks = [];
    let commitsInProgress = 0;
    this.onceAllCommitted = function (callback) {
        notifyCommittedCallbacks.push(callback);
    };

    function incrementCommitsNumber() {
        commitsInProgress += 1;
    }

    function decrementCommitsNumber() {
        commitsInProgress -= 1;

        if(commitsInProgress === 0) {
            notifyCommitted();
        }
    }

    function notifyCommitted() {
        for (const callback of notifyCommittedCallbacks) {
            callback();
        }

        notifyCommittedCallbacks.splice(0, notifyCommittedCallbacks.length);
    }

    /* Verification Space Digest is now the hash of the latest commited block*/
    this.getHashLatestBlock = historyStorage.getHashLatestBlock;
}

let lec = require("./securityParadigms/localExecutionCache");

/* play the role of DBTransactionHandler (readKey, writeKey) while also doing transaction validation*/
function VerificationKeySpaceHandler(parentStorage, worldStateCache, blockchain) {
    let readSetVersions = {}; //version of a key when read first time
    let writeSetVersions = {}; //increment version with each writeKey
    let writeSet = {};  //contains only keys modified in handlers
    let self = this;

    let aliases = {};

    this.dump = function () {
        console.log("VerificationKeySpaceHandler:", {readSetVersions, writeSetVersions, writeSet});
        parentStorage.dump();
    };


    this.readKey = function (keyName) {
        if (writeSetVersions.hasOwnProperty(keyName)) {
            return writeSet[keyName];
        }
        readSetVersions[keyName] = parentStorage.version(keyName);
        return parentStorage.readKey(keyName);
    };

    this.saveAlias = function (assetType, alias, swarmId) {
        aliases[swarmId] = {assetType, alias};
    };

    this.writeKey = function (keyName, value) {
        this.readKey(keyName);         //save read version
        if (!writeSetVersions.hasOwnProperty(keyName)) {
            writeSetVersions[keyName] = readSetVersions[keyName];
        }
        writeSetVersions[keyName]++;
        writeSet[keyName] = value;
    };

    this.version = function (keyName) {
        if (writeSetVersions.hasOwnProperty(keyName)) {
            return writeSetVersions[keyName];
        }
        return parentStorage.version(keyName);
    };

    function applyTransaction(t, willBeCommited) {
        let ret = true;
        lec.ensureEventTransaction(t);
        for (let k in t.input) {
            let transactionVersion = t.input[k];
            if (transactionVersion == undefined) {
                transactionVersion = 0;
            }
            let currentVersion = self.version(k);
            if (currentVersion == undefined || currentVersion == null) {
                currentVersion = 0;
            }
            if (transactionVersion != currentVersion) {
                //console.log(k, transactionVersion , currentVersion);
                //ret = "Failed to apply in transactionVersion != currentVersion (" + transactionVersion + "!="+ currentVersion + ")";
                return false;
            }
        }

        //TODO: potential double spending bug if a transaction was replaced
        if (!lec.verifyTransaction(t, self, willBeCommited, blockchain)) {
            return false;
        }

        for (let k in t.output) {
            self.writeKey(k, t.output[k]);
        }

        /* who has this responsability?
        if(willBeCommited){
            lec.removeFromCacheAtCommit(t);
        }*/
        return ret;
    }

    this.computePTBlock = function (nextBlockSet) {   //make a transactions block from nextBlockSet by removing invalid transactions from the key versions point of view
        let validBlock = [];
        let orderedByTime = cutil.orderCRTransactions(nextBlockSet);
        let i = 0;

        while (i < orderedByTime.length) {
            let t = orderedByTime[i];
            if (applyTransaction(t)) {
                validBlock.push(t.digest);
            }
            i++;
        }


        return validBlock;
    };

    this.commit = function (blockSet, reportDropping) {
        let i = 0;
        let orderedByTime = cutil.orderCRTransactions(blockSet);

        while (i < orderedByTime.length) {
            let t = orderedByTime[i];
            if (applyTransaction(t, true) && reportDropping) {
                $$.log("Dropping transaction", t);
            }

            i++;
        }

        for (let v in writeSetVersions) {
            parentStorage.writeKey(v, writeSet[v], writeSetVersions[v]);
        }

        worldStateCache.updateAliases(aliases);
    }
}


exports.newPSKDB = function (worldStateCache, historyStorage) {
    return new PSKDB(worldStateCache, historyStorage);
};
},{"../OBFT/transactionsUtil":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/transactionsUtil.js","../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleConstants.js","./securityParadigms/localExecutionCache":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/securityParadigms/localExecutionCache.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/securityParadigms/localExecutionCache.js":[function(require,module,exports){
let CNST=require("../../moduleConstants");
let cache = {};

let alreadyVerified = {

};

function sandBoxedExecution(cet){
    let transactionType = cet.swarmType;
    $$.transactions.start("")
}

module.exports = {
    ensureEventTransaction:function(cetransaction){
        return cetransaction;
    },
    verifyTransaction:function(t, handler, forceDeepVerification, blockchain){

        //todo: to be removed later; modification done in the same time with the mod in pskdb
        return true;

        let old_assets = {};
        let new_assets = {};
        let fastCheck = true;

        if(!forceDeepVerification){
            let t = cache[t.digest];
            if(typeof t != undefined) return true;
        }

        for(let k in t.output){
            new_assets[k] = {};
            old_assets[k] = {};

            let  old_value = handler.readKey(k);
            let  new_value = t.output[k];

            let assetValue = JSON.parse(new_value);

            let asset = $$.assets.continue(assetValue);
            asset.__reinit(blockchain);

            new_assets[k][asset.getSwarmId()] = asset;
            handler.saveAlias(asset.getSwarmType(), asset.alias, asset.getSwarmId());

            if(old_value !== undefined){
                /* undefined for new asset (did not exist before current transaction)*/
                let assetValue = JSON.parse(old_value);
                let asset = $$.assets.continue(assetValue);
                asset.__reinit(blockchain);
                if(asset.securityParadigm.mainParadigm == CNST.CONSTITUTIONAL){
                    fastCheck = false;
                }
                old_assets[k][asset.getSwarmId()] = asset;;
            }
            //else ... force constitutional checks?
        }

        return true; //TODO: implement proper checks

        if(fastCheck){
            //check the signatures or other rules specified in security paradigms
        } else {
            //execute transaction again and see if the results are identical
        }
        cache[t.digest] = t;
        return true;
    },
    removeFromCacheAtCommit:function(t){
        delete alreadyVerified[t.digest];
        delete cache[t.digest];
    }
};

},{"../../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleConstants.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/securityParadigms/securityParadigmRegistry.js":[function(require,module,exports){

var CNST = require("../../moduleConstants");

function ConstitutionalSPFactory(){
     this.constitutional = function(spm, optionalTransactionName){
         spm.mainParadigm = CNST.CONSTITUTIONAL;
         if(optionalTransactionName){
             spm.data[CNST.CONSTITUTIONAL] = optionalTransactionName;
             $$.notImplemented("optionalTransactionName is not properly implemented yet")
         }
         //spm.addSecurityParadigm(CNST.CONSTITUTIONAL ,optionalTransactionName);
     }

    /* we do not instantiate SPs... but anyway it behaves as some sort of factory in an virtual way of instantiation*/
    this.checkInsideTransactionValidation = function(transaction, asset){

    }
}

function PredicativeSPFactory(){
    let predicates = {};
    this.addPredicate = function(spm, predicateName, predicateDefinition){
        predicates[predicateName] = predicateDefinition;
        spm.mainParadigm = CNST.PREDICATIVE;
        spm.data[CNST.PREDICATIVE] = predicateName;
    }
    /* not allowed for now... maybe in future*/
    this.registerPredicate = function(predicateName, predicateFunction){

    }

    /* */
    this.checkInsideTransactionValidation = function(transaction, asset){

    }
}

function RestrictedSPFactory(){
    this.allow = function(spm, agentId){
        spm.mainParadigm = CNST.RESTRICTED;
        if(!spm.data[CNST.RESTRICTED]) {
            spm.data[CNST.RESTRICTED] = [agentId];
        } else {
            spm.data[CNST.RESTRICTED].push(agentId);
        }
    }

    this.checkInsideTransactionValidation = function(transaction, asset){

    }

}


function mkApi(sp, APIName, factory){
    return function(...args){
        return factory[APIName](sp, ...args);
    }
}

function SecurityParadigmMetadata(assetInstance,metaData, apiNames, allFactories){
    if(metaData != undefined){
        for(let v in metaData){
            this[v] =  metaData[v];
        }
    } else {
        this.mainParadigm = CNST.RESTRICTED;
        this.data = {};
    }

    //could be refined to add better restrictions
    for(let v in apiNames){
        this[apiNames[v]] = mkApi(this, apiNames[v], allFactories[v]);
    }
    assetInstance.setMetadata("SecurityParadigm", this);
}


function Registry(blockchain){
    let allFactories = {};
    let apiNames = {};
    let self = this;
    this.register = function (SPName, apiName, factory) {
        allFactories[SPName]         = factory;
        apiNames[SPName]    = apiName;
    }

    this.getSecurityParadigm = function(assetInstance){
        let  metaData = assetInstance.getMetadata(CNST.SECURITY_PARADIGM);
        return new SecurityParadigmMetadata(assetInstance, metaData, apiNames, allFactories);
    }

    self.register(CNST.CONSTITUTIONAL ,"constitutional", new ConstitutionalSPFactory());
    self.register(CNST.RESTRICTED,"allow", new RestrictedSPFactory());
    self.register(CNST.PREDICATIVE ,"addPredicate", new PredicativeSPFactory());

    this.validateTransaction = function(currentLayer, transaction){

    }
}

module.exports = {
    getRegistry: function () {
        /* normally should be called only once, made it more open for tests only...*/
        return new Registry();
    }
}
},{"../../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleConstants.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/signsensus/SignSensusImplementation.js":[function(require,module,exports){
let pskcrypto = require("pskcrypto");
let fs = require("fs");

let consUtil = require("../OBFT/transactionsUtil");

let detailedDebug = false;


let pulseSwarm = $$.flow.describe("pulseSwarm", {
    start: function (delegatedAgentName, communicationOutlet, pdsAdapter, pulsePeriodicity, votingBox) {

        this.lset = {}; // digest -> transaction - localy generated set of transactions (`createTransactionFromSwarm` stores each transaction; `beat` resets `lset`)
        this.dset = {}; // digest -> transaction - remotely delivered set of transactions that will be next participate in consensus
        this.pset = {}; // digest -> transaction - consensus pending set

        this.currentPulse = 0;
        this.topPulseConsensus = 0;
        this.lastPulseAchievedConsensus = 0;

        this.pulsesHistory = {};

        this.vsd = pdsAdapter.getHashLatestBlock();


        this.commitCounter = 0;                 // total  number of transactions that got commited

        this.nodeName               = delegatedAgentName;
        this.communicationOutlet    = communicationOutlet;
        this.pdsAdapter             = pdsAdapter;
        this.pulsePeriodicity       = pulsePeriodicity;
        this.votingBox              = votingBox;

        this.beat();
    },

    beat: function () {
        let ptBlock = null;
        let nextConsensusPulse = this.topPulseConsensus + 1;
        let majoritarianVSD = "none";

        while (nextConsensusPulse <= this.currentPulse) {
            ptBlock = consUtil.detectMajoritarianPTBlock(nextConsensusPulse, this.pulsesHistory, this.votingBox);
            majoritarianVSD = consUtil.detectMajoritarianVSD(nextConsensusPulse, this.pulsesHistory, this.votingBox);

            if (ptBlock != "none" && this.vsd == majoritarianVSD) {
                if (!this.hasAllTransactions(ptBlock)) {
                    this.print("Unknown transactions detected...")
                    break;
                }
                //console.log(this.nodeName, ptBlock.length,this.vsd, majoritarianVSD, nextConsensusPulse);
                if (ptBlock.length /*&& this.hasAllTransactions(ptBlock)*/) {
                    this.pset = consUtil.setsConcat(this.pset, this.dset);
                    this.dset = {};
                    let resultSet = consUtil.makeSetFromBlock(this.pset, ptBlock);

                    this.commitCounter += ptBlock.length;
                    //this.print("\t\tBlock [" + this.dumpPtBlock(ptBlock) + "] at pulse " + nextConsensusPulse + " and VSD " +  this.vsd.slice(0,8));

                    this.pdsAdapter.commit(resultSet);
                    let topDigest = ptBlock[ptBlock.length - 1];
                    this.topPulseConsensus = this.pset[topDigest].transactionPulse;
                    consUtil.setsRemovePtBlockAndPastTransactions(this.pset, ptBlock, this.topPulseConsensus); //cleanings
                    let oldVsd = this.vsd;
                    this.vsd = this.pdsAdapter.getVSD();

                    this.lastPulseAchievedConsensus = nextConsensusPulse;   //safer than `this.currentPulse`!?
                    //this.topPulseConsensus = nextConsensusPulse;

                    this.print("\t\t consensus at pulse " + nextConsensusPulse + " and VSD " + oldVsd.slice(0, 8));
                } else {
                    this.pset = consUtil.setsConcat(this.pset, this.dset);
                    this.dset = {};
                    this.lastPulseAchievedConsensus = nextConsensusPulse;   //safer than `this.currentPulse`!?
                    this.topPulseConsensus = nextConsensusPulse;
                    //this.print("\t\tEmpty " + " at: " + nextConsensusPulse );
                    //console.log("\t\tmajoritarian ", majoritarianVSD.slice(0,8) , nextConsensusPulse);
                }
                break; //exit WHILE

            } //end if (ptBlock != "none" && this.vsd == majoritarianVSD)

            nextConsensusPulse++;
        } //end while


        //daca nu a reusit,ar trebui sa vada daca nu exista un alt last majoritar
        ptBlock = this.pdsAdapter.computePTBlock(this.pset);

        let newPulse = consUtil.createPulse(
            this.nodeName,                          //==> Pulse.signer
            this.currentPulse,
            ptBlock,
            this.lset,
            this.vsd,
            this.topPulseConsensus,
            this.lastPulseAchievedConsensus);

        //console.log("\t\tPulse", this.nodeName, this.vsd.slice(0,8) );
        //this.print("Pulse" );
        this.recordPulse(newPulse);

        let self = this;
        self.communicationOutlet.broadcastPulse(newPulse);
        
        this.lset = {};
        this.currentPulse++;

        setTimeout(this.beat, this.pulsePeriodicity);   //self invocation of phase `beat`
    },
    hasAllTransactions: function (ptBlock) {
        for (let i = 0; i < ptBlock.length; i++) {
            let item = ptBlock[i];
            if (!this.pset.hasOwnProperty(item)) {
                //TODO: ask for the missing transaction
                return false;
            }
        }
        return true;
    },
    receiveTransaction: function (t) {
        this.lset[t.digest] = t;
        return t;
    },
    /**
     *
     * @param {Pulse} pulse e.g. new Pulse(this.nodeName, this.currentPulse, ......)
     */
    recordPulse: function (pulse) {
        let from = pulse.signer;

        if (!pulse.ptBlock) {
            pulse.ptBlock = [];
        }
        //pulse.blockDigest = pskcrypto.hashValues(pulse.ptBlock);
        //pulse.blockDigest = pulse.ptBlock.blockDigest;

        if (!this.pulsesHistory[pulse.currentPulse]) {
            this.pulsesHistory[pulse.currentPulse] = {};
        }
        this.pulsesHistory[pulse.currentPulse][from] = pulse;

        if(pulse.currentPulse >= this.topPulseConsensus) {
            if (pulse.currentPulse <= this.lastPulseAchievedConsensus) {
                for (let d in pulse.lset) {
                    this.pset[d] = pulse.lset[d];// could still be important for consensus
                }
            } else {
                for (let d in pulse.lset) {
                    this.dset[d] = pulse.lset[d];
                }
            }
        }
        //TODO: ask for pulses that others received but we failed to receive
    },

    dumpPtBlock: function (ptBlock) {
        return ptBlock.map(function (item) {
            return item.slice(0, 8);
        }).join(" ");
    },
    dump: function () {
        // this.print("Final");
    },
    print: function (str) {
        if (!detailedDebug) {
            if (str === "Pulse") return;
        }

        if (!str) {
            str = "State "
        }

        function countSet(set) {
            let l = 0;
            for (let v in set) l++;
            return l;
        }

        console.log(this.nodeName, " | ", str, " | ",
            "currentPulse:", this.currentPulse, "top:", this.topPulseConsensus, "LPAC:", this.lastPulseAchievedConsensus, "VSD:", this.vsd.slice(0, 8),
            " | ", countSet(this.pset), countSet(this.dset), countSet(this.lset),
            " | ", this.commitCounter / GLOBAL_MAX_TRANSACTION_TIME, " tranzactii pe secunda. Total tranzactii comise:", this.commitCounter);

    },
    printState: function () {
        console.log(this.nodeName, ",", this.currentPulse, ",", this.vsd);
    },
    printPset: function () {
        function sortedDigests(set) {
            let res = [];
            for (let d in set) {
                res.push(d);
            }
            return pskcrypto.hashValues(res.sort());
        }
        function appendToCSV(filename, arr) {
            const reducer = (accumulator, currentValue) => accumulator + " , " + currentValue;
            let str = arr.reduce(reducer, "") + "\n";
            fs.appendFileSync(filename, str);
        }

        let arr = [
            this.nodeName,
            this.currentPulse,
            this.topPulseConsensus,
            this.lastPulseAchievedConsensus,
            sortedDigests(this.pset),
            sortedDigests(this.dset),
            sortedDigests(this.lset),
            this.vsd
        ];
        appendToCSV("data.csv", arr);
        // console.log(this.nodeName,",",this.currentPulse,",",Object.keys(this.pset).length);
    }
});


/**
 * @param {String} delegatedAgentName e.g. 'Node 0', or 'agent_007'
 * @param {Object} communicationOutlet e.g. object to be used in phase `beat` of the returned "pulseSwarm" flow
 *  - it should have a property: `broadcastPulse`: function(from, pulse) {...}
 *      - {String} `from` e.g. `delegatedAgentName`
 *      - {Pulse} `pulse` (see 'transactionsUtil.js')
 * @param {InMemoryPDS} pdsAdapter e.g. require("pskdb/lib/InMemoryPDS").newPDS(null);
 * @param {Number} pulsePeriodicity e.g. 300
 * 
 * @returns {SwarmDescription} A new instance of "pulseSwarm" flow, with phase `start` already running
 */
exports.createConsensusManager = function (delegatedAgentName, communicationOutlet, pdsAdapter, pulsePeriodicity, votingBox) {
    let instance = pulseSwarm();
    instance.start(delegatedAgentName, communicationOutlet, pdsAdapter, pulsePeriodicity, votingBox);
    return instance;
}

},{"../OBFT/transactionsUtil":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/transactionsUtil.js","fs":false,"pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/consensusAlgortims/consensusAlgoritmsRegistry.js":[function(require,module,exports){
var mod = require("../../moduleExports");

function DirectCommitAlgorithm() {
    let pskdb = null;
    this.setPSKDB = function (_pskdb) {
        pskdb = _pskdb;
    };
    this.commit = function (transaction, callback) {
        const set = {};
        let cp = this.pskdb.getCurrentPulse();
        set[transaction.digest] = transaction;
        this.pskdb.commitBlock(mod.createBlock(set, cp, this.pskdb.getPreviousHash()), false, callback);

        cp++;
        this.pskdb.setCurrentPulse(cp);
    };

    this.getCurrentPulse = function () {
        return this.pskdb.getCurrentPulse();
    }
}


function SignSensusAlgoritm(nodeName, networkImplementation, pulsePeriodicity, votingBox) {
    let pskdb = null;
    let algorithm = null;
    this.setPSKDB = function (_pskdb) {
        pskdb = _pskdb;
        algorithm = require("../../signsensus/SignSensusImplementation").createConsensusManager(nodeName, networkImplementation, pskdb, pulsePeriodicity, votingBox);
        this.recordPulse = algorithm.recordPulse;
        console.log("Setting pskdb for algorithm")
    };

    this.commit = function (transaction) {
        algorithm.sendLocalTransactionToConsensus(transaction);
    };

    this.getCurrentPulse = function () {
        return algorithm.currentPulse;
    }
}


function OBFTAlgoritm(nodeName, networkImplementation, pulsePeriodicity, latency, votingBox) {
    let pskdb = null;
    let algorithm = null;
    this.setPSKDB = function (_pskdb) {
        pskdb = _pskdb;
        algorithm = require("../../OBFT/OBFTImplementation").createConsensusManager(nodeName, networkImplementation, pskdb, pulsePeriodicity, latency, votingBox);
        this.recordPulse = algorithm.recordPulse;
        console.log("Setting pskdb for algorithm")
    };

    this.commit = function (transaction) {
        algorithm.sendLocalTransactionToConsensus(transaction);
    };

    this.getCurrentPulse = function () {
        return algorithm.currentPulse;
    }
}

module.exports = {
    createAlgorithm: function (name, ...args) {
        switch (name) {
            case "direct":
                return new DirectCommitAlgorithm(...args);
            case "SignSensus":
                return new SignSensusAlgoritm(...args);
            case "OBFT":
                return new OBFTAlgoritm(...args);
            default:
                $$.exception("Unknown consensus algortihm  " + name);
        }
    }
};
},{"../../OBFT/OBFTImplementation":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/OBFTImplementation.js","../../moduleExports":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleExports.js","../../signsensus/SignSensusImplementation":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/signsensus/SignSensusImplementation.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/BarHistoryStorage.js":[function(require,module,exports){
const LatestHashTracker = require("./LatestHashTracker");

function BarHistoryStorage(archive) {
    const blocksPath = "blocks";
    let lht = new LatestHashTracker();

    this.getHashLatestBlock = lht.getHashLatestBlock;
    let latestPulse = -1;

    this.appendBlock = function (block, announceFlag, callback) {
        archive.writeFile(blocksPath + "/" + block.pulse, JSON.stringify(block, null, 1), (err) => {
            if (err) {
                return callback(err);
            }

            if (block.pulse > latestPulse) {
                latestPulse = block.pulse;

                archive.writeFile(blocksPath + "/index", latestPulse.toString(), (err) => {
                    if (err) {
                        return callback(err);
                    }

                    lht.update(block.pulse, block);
                    callback();
                });
            } else {
                callback();
            }
        });
    };

    this.getLatestBlockNumber = function (callback) {
        let maxBlockNumber = 0;
        archive.readFile(blocksPath + "/index", (err, res) => {
            if (err) {
                return callback(err);
            }

            maxBlockNumber = parseInt(res.toString());

            callback(undefined, maxBlockNumber);
        });
    };

    this.loadSpecificBlock = function (blockNumber, callback) {
        archive.readFile(blocksPath + "/" + blockNumber.toString(), (err, res) => {
            if (err) {
                return callback(err);
            }

            try {
                res = JSON.parse(res.toString());
                lht.update(res.pulse, res);
            } catch (e) {
                callback(e);
                return;
            }

            callback(null, res);
        });
    };

    ////////////////////////
    let observer;
    //send to callback all blocks newer then fromVSD
    this.observeNewBlocks = function (fromVSD, callback) {
        observer = callback;
    }
}

module.exports = BarHistoryStorage;
},{"./LatestHashTracker":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/LatestHashTracker.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/FsHistoryStorage.js":[function(require,module,exports){
const LatestHashTracker = require("./LatestHashTracker");

function FsHistoryStorage(folder) {
    const blocksPath = folder + "/blocks";
    let lht = new LatestHashTracker();
    this.getHashLatestBlock = lht.getHashLatestBlock;

    let fs = require("fs");
    let latestPulse = -1;

    this.appendBlock = function (block, announceFlag, callback) {
        ensureBlocksPathExist((err) => {
            if (err) {
                return callback(err);
            }

            fs.writeFile(blocksPath + "/" + block.pulse, JSON.stringify(block, null, 1), (err) => {
                if (err) {
                    return callback(err);
                }

                if(block.pulse > latestPulse) {
                    latestPulse = block.pulse;

                    fs.writeFile(blocksPath + "/index", latestPulse.toString(), (err) => {
                        if (err) {
                            return callback(err);
                        }

                        lht.update(block.pulse, block);
                        callback();

                    });
                } else {
                    callback();
                }
            });
        });
    };

    this.getLatestBlockNumber = function (callback) {
        ensureBlocksPathExist((err) => {
            if (err) {
                return callback(err);
            }

            fs.readFile(blocksPath + "/index", function (err, res) {
                let maxBlockNumber = 0;
                if (err) {
                    callback(err);
                } else {
                    maxBlockNumber = parseInt(res);
                    callback(null, maxBlockNumber);
                }
            });
        });
    };

    this.loadSpecificBlock = function (blockNumber, callback) {
        ensureBlocksPathExist((err) => {
            if (err) {
                return callback(err);
            }

            fs.readFile(blocksPath + "/" + blockNumber, 'utf8', function (err, res) {
                if (err) {
                    callback(err, null);
                } else {
                    try {
                        res = JSON.parse(res);
                        lht.update(res.pulse, res);
                    } catch (e) {
                        console.log('could not parse', e, res);
                        callback(e);
                        return;
                    }

                    callback(null, res);
                }
            });
        });
    };

    ////////////////////////
    let observer;
    //send to callback all blocks newer then fromVSD
    this.observeNewBlocks = function (fromVSD, callback) {
        observer = callback;
    };

    //------------------------------------------- internal methods ----------------------------------------------------
    function ensureBlocksPathExist(callback) {
        fs.access(blocksPath, (err) => {
            if (err) {
                fs.mkdir(blocksPath, {recursive: true}, callback);
            }else{
                callback();
            }
        });
    }
}

module.exports = FsHistoryStorage;

},{"./LatestHashTracker":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/LatestHashTracker.js","fs":false}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/LatestHashTracker.js":[function(require,module,exports){
function LatestHashTracker() {
    let hlb = "none";
    let maxBlockNumber = 0;

    this.update = function (blockNumber, block) {
        if (blockNumber > maxBlockNumber) {
            hlb = block.blockDigest;
        }
    };

    this.getHashLatestBlock = function () {
        return hlb;
    }
}

module.exports = LatestHashTracker;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/MemoryHistoryStorage.js":[function(require,module,exports){
const LatestHashTracker = require("./LatestHashTracker");

function MemoryHistoryStorage() {
    let blocks = [];
    let lht = new LatestHashTracker();
    this.getHashLatestBlock = lht.getHashLatestBlock;

    this.appendBlock = function (block, announceFlag, callback) {
        blocks.push(block);
        lht.update(blocks.length, block);
        callback(null, block);

    };

    this.getLatestBlockNumber = function (callback) {
        callback(null, blocks.length);
    };

    this.loadSpecificBlock = function (blockNumber, callback) {
        let block = blocks[blockNumber];
        lht.update(blockNumber, block);
        callback(null, blocks[blockNumber]);
    }
}

module.exports = MemoryHistoryStorage;
},{"./LatestHashTracker":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/LatestHashTracker.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/historyStoragesRegistry.js":[function(require,module,exports){
const FsHistoryStorage = require("./FsHistoryStorage");
const MemoryHistoryStorage = require("./MemoryHistoryStorage");
const BarHistoryStorage = require("./BarHistoryStorage");

module.exports = {
    createStorage: function (storageType, ...args) {
        switch (storageType) {
            case "fs":
                return new FsHistoryStorage(...args);
            case "bar":
                return new BarHistoryStorage(...args);
            case "memory":
                return new MemoryHistoryStorage(...args);
            default:
                $$.exception("Unknown blockchain storage " + storageType);
        }
    }
};
},{"./BarHistoryStorage":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/BarHistoryStorage.js","./FsHistoryStorage":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/FsHistoryStorage.js","./MemoryHistoryStorage":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/MemoryHistoryStorage.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/networkCommunication/networkCommunicationStrategiesRegistry.js":[function(require,module,exports){
const mc = require("../../moduleConstants");
let pulseUtil = require("../../OBFT/PulseUtil");


function IPCNetworkSimulator(){
    this.broadcastPulse = function(pulse){
        process.send(pulse);
    }

    this.newPulse = function(){
        let p = pulseUtil.createPulse()
        process.send(pulse);
    }

    this.listen = function(callback){
        process.on('message', function(msg){
            callback(null, msg);
        })
    }
}

/*
var com = {
    broadcastPulse: function(from, pulse){
        nodes.forEach( function(n){
            if(n.nodeName != from) {
                setTimeout(function(){
                    n.recordPulse(from, pulse);
                }, cutil.getRandomInt(cfg.NETWORK_DELAY));
            } else {
                if(pulse.currentPulse > 2 * maxPulse){
                    afterFinish[from] = true;
                }
            }
        });


        if(Object.keys(afterFinish).length >= cfg.MAX_NODES){
            console.log(Object.keys(afterFinish).length , cfg.MAX_NODES);
            setTimeout(terminate, 1);
        }
    }
} */



function VirtualMQAdapter(){

}

module.exports = {
    createNetworkAdapter: function (strategyType, ...args) {
        switch (strategyType) {
            case "ipc":
                return new IPCNetworkSimulator(...args);
            case "virtualmq":
                return new VirtualMQAdapter(...args);
            default:
                $$.error("Unknown communication strategy  " + strategyType);
        }
    }
}
},{"../../OBFT/PulseUtil":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/PulseUtil.js","../../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleConstants.js"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/signatureProvidersRegistry/signatureProvidersRegistry.js":[function(require,module,exports){
function PermissiveSignatureProvider(){
    /*
    return a signature of message ms for agent agentId
     */
    this.signAs = function(agentId, msg){
        return "Signature from agent "+agentId + " should be here!";
    }

    this.verify = function(msg, signatures){
        return true;
    };
}


module.exports = {
    createSignatureProvider: function (signProvType,...args) {
        switch (signProvType) {
            case "permissive":
                return new PermissiveSignatureProvider(...args);
            case "blockchain":
            default:
                $$.exception("Signature Provider" + signProvType + " not implemented");
        }
    }
}

},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/votingStrategies/votingStrategiesRegistry.js":[function(require,module,exports){

function SimpleMajoritarianStrategy(shareHoldersCounter){
    this.refreshShares = function(){

    }
    this.vote = function (previousValue, agent) {
        if (!previousValue) {
            previousValue = 0;
        }
        return previousValue + 1;
    }

    this.isMajoritarian = function (value) {
        //console.log(value , Math.floor(shareHoldersCounter/2) + 1);
        return value >= Math.floor(shareHoldersCounter / 2) + 1;
    }
}


function BlockchainShareHoldersMajority(){
    let shares = {}
    this.refreshShares = function(){

    }

    this.vote = function (previousValue, agent) {
        if (!previousValue) {
            previousValue = 0;
        }
        return previousValue + shares[agent];
    }

    this.isMajoritarian = function (value) {
        return value > 0.50;
    }
}

module.exports = {
    createVotingStrategy: function (strategyType, ...args) {
        switch (strategyType) {
            case "democratic":
                return new SimpleMajoritarianStrategy(...args);
            case "shareholders":
                return new BlockchainShareHoldersMajority(...args);
            default:
                $$.error("Unknown voting strategy  " + strategyType);
        }
    }
}
},{}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/worldStateCaches/worldStateCacheRegistry.js":[function(require,module,exports){
(function (setImmediate){(function (){
const mc = require("../../moduleConstants");

function StorageContainer(){
    this.pskdb = {};
    this.keys = {};
    this.pulse = 0;
    let self = this;
    let latestState = {

    };

    this.readKey = function(key){
        return self.keys[key];
    };

    this.writeKey = function(key, value){
        self.keys[key] = value;
    };

    function updateAlias(assetType, alias,swarmId){
        let keyName = assetType + mc.ALIASES;
        let value = self.readKey(keyName);
        if(value === undefined){
            value = {};
            value[alias] = swarmId;
        } else {
            value = JSON.parse(value);
            value[alias] = swarmId;
        }
        self.writeKey(keyName,JSON.stringify(value));
    }

    this.updateAliases = function(aliases){
        for(let swarmId in aliases){
            updateAlias(aliases[swarmId].assetType, aliases[swarmId].alias, swarmId);
        }
    }
}

function BarCache(archive) {
    let storage = new StorageContainer();
    this.readKey = storage.readKey;
    this.writeKey = storage.writeKey;
    this.updateAliases = storage.updateAliases;

    //just in case the folder got to use as storage does not exist

    const worldStateCachePath = "/worldStateCache";

    this.getState = function (callback) {
        archive.readFile(worldStateCachePath,  function (err, res) {
            let objRes = {};
            if (err) {
                callback(err, objRes);
                console.log("Initialisating empty blockchain state");
            } else {
                objRes = JSON.parse(res);
                storage.pskdb = objRes.pskdb;
                storage.keys  = objRes.keys;
                storage.pulse  = objRes.pulse;
                callback(null, storage.pskdb);
            }
        });
    };

    this.updateState = function (internalValues, callback) {
        storage.pskdb = internalValues;
        archive.writeFile(worldStateCachePath, JSON.stringify(storage, null, 1), callback);
    };

    this.dump = function(){
        console.log("EDFSCache:", storage);
    }

}

function MemoryCache() {
    let storage = new StorageContainer();
    this.readKey = storage.readKey;
    this.writeKey = storage.writeKey;
    this.updateAliases = storage.updateAliases;

    this.getState = function (callback) { //err, valuesFromCache
        callback(null, storage.pskdb);
    };

    this.updateState = function (internalValues, callback) {
        //console.info("Commiting state in memory cache "/*, internalValues*/)
        storage.pskdb = internalValues;
        storage.pulse = internalValues.pulse;
        setImmediate(() => {
            callback(null, storage.pskdb);
        });
    };

    this.dump = function(){
        console.log("MemoryCache:", storage);
    }
}

function LocalWSCache(folder) {
    let storage = new StorageContainer();
    this.readKey = storage.readKey;
    this.writeKey = storage.writeKey;
    this.updateAliases = storage.updateAliases;

    //just in case the folder got to use as storage does not exist
    require("fs").mkdirSync(folder, {recursive: true});

    const worldStateCachePath = folder + "/worldStateCache";
    let fs = require("fs");

    this.getState = function (callback) {
        fs.readFile(worldStateCachePath, 'utf8', function (err, res) {
            let objRes = {};
            if (err) {
                callback(err, objRes);
                console.log("Initialisating empty blockchain state");
            } else {
                objRes = JSON.parse(res);
                storage.pskdb = objRes.pskdb;
                storage.keys  = objRes.keys;
                storage.pulse  = objRes.pulse;
                callback(null, storage.pskdb);
            }
        });
    };

    this.updateState = function (internalValues, callback) {
        storage.pskdb = internalValues;
        fs.writeFile(worldStateCachePath, JSON.stringify(storage, null, 1), callback);
    };

    this.dump = function(){
        console.log("LocalWSCache:", storage);
    }

}


module.exports = {
    createCache: function (cacheType, ...args) {
        switch (cacheType) {
            case "fs":
                return new LocalWSCache(...args);
            case "bar":
                return new BarCache(...args);
            case "memory":
                return new MemoryCache(...args);
            default:
                $$.exception("Unknown blockchain cache " + cacheType);
        }
    }
};
}).call(this)}).call(this,require("timers").setImmediate)

},{"../../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleConstants.js","fs":false,"timers":false}],"/home/travis/build/PrivateSky/privatesky/modules/dossier/lib/RawDossier.js":[function(require,module,exports){
function RawDossier(bar) {
    Object.assign(this, bar);
}

module.exports = RawDossier;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/runner.js":[function(require,module,exports){
(function (Buffer,__dirname){(function (){
const fs = require("fs");
const path = require("path");
const forker = require('child_process');

const configuration_file_name = "double-check.json";

let globToRegExp =  require("./utils/glob-to-regexp");

const TAG = "[TEST_RUNNER]";
const MAX_WORKERS = process.env['DOUBLE_CHECK_POOL_SIZE'] || 10;
const RUNNER_VERBOSE = process.env['DOUBLE_CHECK_RUNNER_VERBOSE'] || true;

const WORKER_PROCESS_STATES = {
    READY: 'ready',
    RUNNING: 'running',
    FINISHED: 'finished'
};

function TestRunner(){

    // Session object
    function initializeSession() {
        return {
            testCount: 0,
            currentTestIndex: 0,
            processedTestCount: 0,
            workers: {
                running: 0,
                terminated: 0
            }
        };
    }

    let defaultConfig = {
        fileExt: ".js",                         // test file supported by extension
        matchDirs: ["*"],
        testDirs: process.cwd(),                // path to the root tests location
        ignore: [".git"],
        reports: {
            basePath: process.cwd(),            // path where the reports will be saved
            prefix: "Report-",                  // prefix for report files, filename pattern: [prefix]-{timestamp}{ext}
            ext: ".txt"                         // report file extension
        }
    };

    // Template structure for test reports.
    let reportFileStructure = {
        count: 0,
        suites: new Set(),
        passed: new Set(),
        failed: new Set()
    };

    let config;

    function init(cfg){

        // no matter how and when runner is exiting first of all do a report print
        let process_exit = process.exit;
        process.exit = (...args)=>{
            process.exit = process_exit;
            doReports(()=>{
                process.exit(...args);
            });
        };

        process.on("SIGINT", process.exit);
        //--------------------------------------------------------------------------------------

        config = extend(defaultConfig, cfg);
        debug("Starting config", config);

        //the testTree holds the tree of directories and files descovered
        this.testTree = {};
        //sorted list of all test files discovered
        this.testList = [];

        this.session = initializeSession();

        // create reports directory if not exist
        if (!fs.existsSync(config.reports.basePath)){
            fs.mkdirSync(config.reports.basePath);
        }
    }

    function getDefaultNodeStructure() {
        return  {
            __meta: {
                conf: null,
                parent: null,
                isDirectory: false
            },
            data: {
                name: null,
                path: null,
            },
            result: {
                state: WORKER_PROCESS_STATES.READY, // ready | running | terminated | timeout
                pass: null,
                executionTime: 0,
                runs: 0,
                asserts: [],
                messages: []
            },
            items: null
        };
    }

    function discoverTestFiles(dir, parentConf) {
        dir = path.resolve(dir);
        const stat = fs.statSync(dir);
        if(!stat.isDirectory()){
            throw new Error(dir + " is not a directory!");
        }

        let currentConf = parentConf;

        let currentNode = getDefaultNodeStructure();
        currentNode.__meta.parent = path.dirname(dir);
        currentNode.__meta.isDirectory = true;

        let files = fs.readdirSync(dir);
        // first look for conf file
        if(files.indexOf(configuration_file_name) !== -1) {
            let fd = path.join(dir, configuration_file_name);
            let conf = readConf(fd);
            if(conf) {
                currentNode.__meta.conf = conf;
                currentConf = extend(currentConf, conf);
                //currentConf = conf;
            }
        }

        currentNode.data.name = path.basename(dir);
        currentNode.data.path = dir;
        currentNode.items = [];

        for(let i = 0, len = files.length; i < len; i++) {
            let item = files[i];

            let fd = path.join(dir, item);
            let stat = fs.statSync(fd);
            let isDir = stat.isDirectory();
            let isTestDir = validateAsTestDir(fd);

            if(isDir && !isTestDir) {
                continue; // ignore dirs that does not follow the naming rule for test dirs
            }

            if(!isDir && item.match(configuration_file_name)){
                continue; // already processed
            }

            // exclude files based on glob patterns
            if(currentConf) {
                // currentConf['ignore'] - array of regExp
                if(currentConf['ignore']) {
                    const isMatch = isAnyMatch(currentConf['ignore'], item);
                    if(isMatch) {continue;}
                }
            }

            let childNode = getDefaultNodeStructure();
            childNode.__meta.conf = {};
            childNode.__meta.isDirectory = isDir;
            childNode.__meta.parent = path.dirname(fd);

            if (isDir) {
                let tempChildNode = discoverTestFiles(fd, currentConf);
                childNode = Object.assign(childNode, tempChildNode);
                currentNode.items.push(childNode);
            }
            else if(path.extname(fd) ===  config.fileExt){
                childNode.__meta.conf.runs = currentConf['runs'] || 1;
                childNode.__meta.conf.silent = currentConf['silent'];

                childNode.data.name = item;
                childNode.data.path = fd;
                reportFileStructure.suites.add(childNode.__meta.parent);
                currentNode.items.push(childNode);
            }
        }

        return currentNode;
    }

    function readConf(confPath) {
        var config = {};
        try{
            config = require(confPath);
        } catch(error) {
            console.error(error);
        }

        return config;
    }

    function validateAsTestDir(dir) {
        if(!config || !config.matchDirs) {
            throw new Error(`matchDirs is not defined on config ${JSON.stringify(config)} does not exist!`);
        }

       let isTestDir = isAnyMatch(config.matchDirs, dir);

        return isTestDir;
    }

    function isAnyMatch(globExpArray, str) {
        const hasMatch = function(globExp) {
            const regex = globToRegExp(globExp);
            return regex.test(str);
        };

        return globExpArray.some(hasMatch);
    }

    let launchTests = () => {

        this.session.testCount = this.testList.length;

        console.log(`Start launching tests (${this.session.testCount})...`);

        reportFileStructure.startDate = new Date().getTime();
        reportFileStructure.count = this.session.testCount;
        if(this.session.testCount > 0) {
            setInterval(scheduleWork, 100);
        } else {
            doReports();
        }
    };

    let scheduleWork = () => {
        //launching tests for each workers available
        while(this.session.workers.running < MAX_WORKERS && this.session.currentTestIndex < this.session.testCount){
            let test = this.testList[this.session.currentTestIndex];
            launchTest(test);
        }
    };

    let launchTest = (test) => {
        this.session.workers.running++;

        test.result.state = WORKER_PROCESS_STATES.RUNNING;

        let env = process.env;

        const cwd = test.__meta.parent;
        console.log("Executing", test.data.path);
        let worker = forker.fork(test.data.path, [], {
                'cwd': cwd,
                'env': env,
                stdio: ["inherit", "pipe", 'pipe', 'ipc'],
                silent: false
            });

        worker.on("exit", onExitEventHandlerWrapper(test));
        worker.on("message", onMessageEventHandlerWrapper(test));
        worker.on("error", onErrorEventHandlerWrapper(test));
        worker.stderr.on("data", messageCaughtOnStdErr(test));

        debug(`Launching test ${test.data.name}, on worker pid[${worker.pid}] `);
        console.log(`Progress: ${this.session.currentTestIndex+1} of ${this.session.testCount}`);

        this.session.currentTestIndex++;

        worker.stdout.on('data', function (dataBuffer) {
            let content = dataBuffer.toString('utf8');
            if (test.__meta.conf.silent) {
                console.log(content);
            }
            test.result.messages.push(content);
        }.bind(this));


        var self = this;

        function onMessageEventHandlerWrapper(test) {
            return function (log) {
                if (log.type === 'assert') {
                    test.result.asserts.push(log);
                } else {
                    test.result.messages.push(log);
                }
            };
        }

        function onExitEventHandlerWrapper(test) {
            return function (code, signal) {
                //clearTimeout(worker.timerVar);
                debug(`Test ${test.data.name} exit with code ${code}, signal ${signal} `);

                test.result.state = WORKER_PROCESS_STATES.FINISHED;
                self.session.processedTestCount++;
                if (code === 0 && test.result.pass === null) {
                    test.result.pass = true;
                    reportFileStructure.passed.add(test);
                } else {
                    test.result.pass = false;
                    reportFileStructure.failed.add(test);
                    test.result.messages.push("Process finished with errors!",
                        `Exit code: ${code} Signal: ${signal}`);
                }

                self.session.workers.running--;
                self.session.workers.terminated++;

                //scheduleWork();
                checkWorkersStatus();
            };
        }

        // this handler can be triggered when:
        // 1. The process could not be spawned, or
        // 2. The process could not be killed, or
        // 3. Sending a message to the child process failed.
        // IMPORTANT: The 'exit' event may or may not fire after an error has occurred!
        function onErrorEventHandlerWrapper(test) {
            return function (error) {
                if(Buffer.isBuffer(error)){
                    error = error.toString();
                }
                debug(`Worker ${worker.pid} - error event.`, test.data.name);
                //debug(error);

                test.result.pass = false;
                test.result.messages.push(error);

                reportFileStructure.failed.add(test);
                self.session.workers.running--;
                self.session.workers.terminated++;
            };
        }

        function messageCaughtOnStdErr(test) {
            return function (error) {
                if(Buffer.isBuffer(error)){
                    error = error.toString();
                }
                //debug(`Worker ${worker.pid} - error event.`, test.data.name);
                //debug(error);

                test.result.pass = false;
                test.result.messages.push(error);

                reportFileStructure.failed.add(test);
            };
        }
    };

    let checkWorkersStatus = ()=>{
        let remaining = this.session.testCount - this.session.processedTestCount;
        if(this.session.workers.running === 0 && remaining === 0) {
            doReports();
        }else{
            console.log(`Testing still in progress... ${this.session.workers.running} workers busy and ${remaining} tests are waiting to finish.`);
        }
    };

    let reportsAllReadyPrinted = false;
    let doReports = (cb) => {
        if(reportsAllReadyPrinted){
            if(cb){
                cb();
            }
           return;
        }
        reportsAllReadyPrinted = true;
        //doing reports :D
        //on console and html report please!
        reportFileStructure.endDate = new Date().getTime();
        reportFileStructure.runned = this.session.processedTestCount;

        doConsoleReport();

        doHTMLReport((err, res)=>{
            if(cb){
                cb(err, res);
            }
            this.callback(err, this.session);
        });
    };

    let doConsoleReport = () =>{
        console.log("\n\nResults\n==========================");
        console.log(`Finish running ${this.session.processedTestCount} tests from a total of ${this.session.testCount}.`);
        console.log(`\x1b[31m ${reportFileStructure.failed.size} \x1b[0mfailed tests and \x1b[32m ${reportFileStructure.passed.size} \x1b[0mpassed tests.`);

        this.session.failed = reportFileStructure.failed.size;
        this.session.passed = reportFileStructure.passed.size;
        const sortedTestResults = [...reportFileStructure.failed, ...reportFileStructure.passed];
        const greenCheckbox = '\x1b[32m \u2714 \x1b[0m';
        const redCross = '\x1b[31m \u274C \x1b[0m';

        console.log("==========================\nSummary:");
        for (const test of sortedTestResults) {
            const passed = test.result.pass;

            console.log(` ${passed ? greenCheckbox : redCross} ${test.data.name}`);
            if(!passed){
                console.log(`\t at (${test.data.path}:1:1)`);
            }
        }
        console.log("==========================");
    };

    let doHTMLReport = (cb) => {
        var folderName = path.resolve(__dirname);
        fs.readFile(path.join(folderName,'/utils/report.html'), 'utf8', (err, res) => {
            if (err) {
                debug("An error occurred while reading the html report template file. HTML report can't be generated for now.");
                if(cb){
                    cb();
                }
                return;
            }
            let destination = path.join(process.cwd(), "testReport.html");
            let summary = JSON.parse(JSON.stringify(reportFileStructure));
            summary.failed = Array.from(reportFileStructure.failed);
            summary.passed = Array.from(reportFileStructure.passed);
            summary.suites = Array.from(reportFileStructure.suites);

            let content = res.replace("</html>", `<script>\nprint(${JSON.stringify(summary)});\n</script>\n</html>`);
            fs.writeFile(destination, content, 'utf8', (err) => {
                if (err) {
                    debug('An error occurred while writing the html report file, with the following error: ' + JSON.stringify(err));
                    throw err;
                }

                debug(`Finished writing HTML Report to file://${destination}`);
                if(cb){
                    cb();
                }
            });
        });
    };

    function debug(...args){
        if(!RUNNER_VERBOSE){
            return;
        }

        console.log(...args);
    }

    function extend(first, second) {
        for (const key in second) {
            if (!first.hasOwnProperty(key)) {
                first[key] = second[key];
            } else {
                let val = second[key];
                if(typeof first[key] === 'object') {
                    val = extend(first[key], second[key]);
                }
                first[key] = val;
            }
        }

        return first;
    }

    function testTreeToList(rootNode) {
        var testList = [];

        traverse(rootNode);

        function traverse(node) {
            if(!node.__meta.isDirectory || !node.items) {
                return;
            }

            for(let i = 0, len = node.items.length; i < len; i++) {
                const item = node.items[i];
                if(item.__meta.isDirectory) {
                    traverse(item);
                } else {
                    testList.push(item);
                }
            }
        }

        return testList;
    }

    /**
     * Main entry point. It will start the flow runner flow.
     * @param cfg {Object} - object containing settings such as conf file name, test dir.
     * @param callback {Function} - handler(error, result) invoked when an error occurred or the runner has completed all jobs.
     */
    this.start = function(cfg, callback){

        this.callback = function(err, result) {
            if(err) {
                debug("Sending error to the callback", err);
            }

            if(callback) {
                return callback(err, result);
            }
        };

        init.call(this, cfg);

        console.log("Start discovering tests ...");
        let testTree = [];
        if(Array.isArray(config.testDirs)){
            for(let i=0; i<config.testDirs.length; i++){
                testTree = testTree.concat(discoverTestFiles(config.testDirs[i], config));
            }
        }else{
            testTree = discoverTestFiles(config.testDirs, config);
        }

        this.testList = [];
        for(let i=0; i<testTree.length; i++){
            this.testList = this.testList.concat(testTreeToList(testTree[i]));
        }

        launchTests();
    }
}

exports.init = function(sf) {
    sf.testRunner = new TestRunner();
}

}).call(this)}).call(this,{"isBuffer":require("../../../node_modules/is-buffer/index.js")},"/modules/double-check/lib")

},{"../../../node_modules/is-buffer/index.js":"/home/travis/build/PrivateSky/privatesky/node_modules/is-buffer/index.js","./utils/glob-to-regexp":"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/utils/glob-to-regexp.js","child_process":false,"fs":false,"path":false}],"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardAsserts.js":[function(require,module,exports){
(function (global){(function (){
module.exports.init = function (sf, logger) {
    /**
     * Registering handler for failed asserts. The handler is doing logging and is throwing an error.
     * @param explanation {String} - failing reason message.
     */
    let __failWasAlreadyGenerated = false;
    let __assetsCounter = 0;
    let beginWasCalled = false;


    if(typeof global.timeoutUntilBegin === "undefined"){
        global.timeoutUntilBegin = setTimeout(function () {
            if (!beginWasCalled) {
                sf.assert.begin("asset.begin was not called, the exit time for the test is automatically set to 2 seconds. asset.callback can increase this time");
            }
        }, 1000);
    }else{
        console.trace("DoubleCheck was evaluated atleast 2 times! Maybe it was required from disk instead of bundles.");
    }



    /**
     * Registering assert for printing a message and asynchronously printing all logs from logger.dumpWhys.
     * @param message {String} - message to be recorded
     * @param cleanFunctions {Function} - cleaning function
     * @param timeout {Number} - number of milliseconds for the timeout check. Default to 500ms.
     */
    sf.assert.addCheck('forceFailedTest', function (message, err) {
        console.error("Test should fail because:", message, err);
        __failWasAlreadyGenerated = true;
    });

    /**
     * Registering assert for printing a message and asynchronously printing all logs from logger.dumpWhys.
     * @param message {String} - message to be recorded
     * @param cleanFunctions {Function} - cleaning function
     * @param timeout {Number} - number of milliseconds for the timeout check. Default to 500ms.
     */
    sf.assert.addCheck('begin', function (message, cleanFunctions, timeout) {
        //logger.recordAssert(message);
        beginWasCalled = true;
        console.log(message);
        sf.assert.end(cleanFunctions, timeout, true);
    });


    function recordFail(...args) { //record fail only once
        if (!__failWasAlreadyGenerated) {
            __failWasAlreadyGenerated = true;
            logger.recordAssert(...args);
        }
    }

    function delayEnd(message, milliseconds) {
        if (!beginWasCalled) {
            clearTimeout(timeoutUntilBegin);
            sf.assert.begin(message, null, milliseconds);
        } else {
            //console.log('Begin was called before the delay could be applied')
        }
    }

    /**
     * Registering assert for evaluating a value to null. If check fails, the assertFail is invoked.
     * @param explanation {String} - failing reason message in case the assert fails
     */
    sf.exceptions.register('assertFail', function (explanation) {
        const message = "Assert or invariant has failed " + (explanation ? explanation : "");
        const err = new Error(message);
        err.isFailedAssert = true;
        recordFail('[Fail] ' + message, err, true);
        throw err;
    });

    /**
     * Registering assert for equality. If check fails, the assertFail is invoked.
     * @param v1 {String|Number|Object} - first value
     * @param v1 {String|Number|Object} - second value
     * @param explanation {String} - failing reason message in case the assert fails.
     */
    sf.assert.addCheck('equal', function (v1, v2, explanation) {
        if (v1 !== v2) {
            if (!explanation) {
                explanation = "Assertion failed: [" + v1 + " !== " + v2 + "]";
            }
            sf.exceptions.assertFail(explanation);
        }
    });

    /**
     * Registering assert for inequality. If check fails, the assertFail is invoked.
     * @param v1 {String|Number|Object} - first value
     * @param v1 {String|Number|Object} - second value
     * @param explanation {String} - failing reason message in case the assert fails
     */
    sf.assert.addCheck('notEqual', function (v1, v2, explanation) {
        if (v1 === v2) {
            if (!explanation) {
                explanation = " [" + v1 + " == " + v2 + "]";
            }
            sf.exceptions.assertFail(explanation);
        }
    });

    /**
     * Registering assert for evaluating an expression to true. If check fails, the assertFail is invoked.
     * @param b {Boolean} - result of an expression
     * @param explanation {String} - failing reason message in case the assert fails
     */
    sf.assert.addCheck('true', function (b, explanation) {
        if (!b) {
            if (!explanation) {
                explanation = " expression is false but is expected to be true";
            }
            sf.exceptions.assertFail(explanation);
        }
    });

    /**
     * Registering assert for evaluating an expression to false. If check fails, the assertFail is invoked.
     * @param b {Boolean} - result of an expression
     * @param explanation {String} - failing reason message in case the assert fails
     */
    sf.assert.addCheck('false', function (b, explanation) {
        if (b) {
            if (!explanation) {
                explanation = " expression is true but is expected to be false";
            }
            sf.exceptions.assertFail(explanation);
        }
    });

    /**
     * Registering assert for evaluating a value to null. If check fails, the assertFail is invoked.
     * @param b {Boolean} - result of an expression
     * @param explanation {String} - failing reason message in case the assert fails
     */
    sf.assert.addCheck('isNull', function (v1, explanation) {
        if (v1 !== null) {
            sf.exceptions.assertFail(explanation);
        }
    });

    /**
     * Registering assert for evaluating a value to be not null. If check fails, the assertFail is invoked.
     * @param b {Boolean} - result of an expression
     * @param explanation {String} - failing reason message in case the assert fails
     */
    sf.assert.addCheck('notNull', function (v1, explanation) {
        if (v1 === null && typeof v1 === "object") {
            sf.exceptions.assertFail(explanation);
        }
    });

    /**
     * Checks if all properties of the second object are own properties of the first object.
     * @param firstObj {Object} - first object
     * @param secondObj{Object} - second object
     * @returns {boolean} - returns true, if the check has passed or false otherwise.
     */
    function objectHasFields(firstObj, secondObj) {
        for (let field in secondObj) {
            if (firstObj.hasOwnProperty(field)) {
                if (firstObj[field] !== secondObj[field]) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }

    function objectsAreEqual(firstObj, secondObj) {
        let areEqual = true;
        if (firstObj !== secondObj) {
            if (typeof firstObj !== typeof secondObj) {
                areEqual = false;
            } else if (Array.isArray(firstObj) && Array.isArray(secondObj)) {
                firstObj.sort();
                secondObj.sort();
                if (firstObj.length !== secondObj.length) {
                    areEqual = false;
                } else {
                    for (let i = 0; i < firstObj.length; ++i) {
                        if (!objectsAreEqual(firstObj[i], secondObj[i])) {
                            areEqual = false;
                            break;
                        }
                    }
                }
            } else if ((typeof firstObj === 'function' && typeof secondObj === 'function') ||
                (firstObj instanceof Date && secondObj instanceof Date) ||
                (firstObj instanceof RegExp && secondObj instanceof RegExp) ||
                (firstObj instanceof String && secondObj instanceof String) ||
                (firstObj instanceof Number && secondObj instanceof Number)) {
                areEqual = firstObj.toString() === secondObj.toString();
            } else if (typeof firstObj === 'object' && typeof secondObj === 'object') {
                areEqual = objectHasFields(firstObj, secondObj);
                // isNaN(undefined) returns true
            } else if (isNaN(firstObj) && isNaN(secondObj) && typeof firstObj === 'number' && typeof secondObj === 'number') {
                areEqual = true;
            } else {
                areEqual = false;
            }
        }

        return areEqual;
    }

    /**
     * Registering assert for evaluating if all properties of the second object are own properties of the first object.
     * If check fails, the assertFail is invoked.
     * @param firstObj {Object} - first object
     * @param secondObj{Object} - second object
     * @param explanation {String} - failing reason message in case the assert fails
     */
    sf.assert.addCheck("objectHasFields", function (firstObj, secondObj, explanation) {
        if (!objectHasFields(firstObj, secondObj)) {
            sf.exceptions.assertFail(explanation);
        }
    });

    /**
     * Registering assert for evaluating if all element from the second array are present in the first array.
     * Deep comparison between the elements of the array is used.
     * If check fails, the assertFail is invoked.
     * @param firstArray {Array}- first array
     * @param secondArray {Array} - second array
     * @param explanation {String} - failing reason message in case the assert fails
     */
    sf.assert.addCheck("arraysMatch", function (firstArray, secondArray, explanation) {
        if (firstArray.length !== secondArray.length) {
            sf.exceptions.assertFail(explanation);
        } else {
            const result = objectsAreEqual(firstArray, secondArray);
            // const arraysDontMatch = secondArray.every(element => firstArray.indexOf(element) !== -1);
            // let arraysDontMatch = secondArray.some(function (expectedElement) {
            //     let found = firstArray.some(function(resultElement){
            //         return objectHasFields(resultElement,expectedElement);
            //     });
            //     return found === false;
            // });

            if (!result) {
                sf.exceptions.assertFail(explanation);
            }
        }
    });

    // added mainly for test purposes, better test frameworks like mocha could be much better

    /**
     * Registering assert for checking if a function is failing.
     * If the function is throwing an exception, the test is passed or failed otherwise.
     * @param testName {String} - test name or description
     * @param func {Function} - function to be invoked
     */
    sf.assert.addCheck('fail', function (testName, func) {
        try {
            func();
            recordFail("[Fail] " + testName);
        } catch (err) {
            logger.recordAssert("[Pass] " + testName);
        }
    });

    /**
     * Registering assert for checking if a function is executed with no exceptions.
     * If the function is not throwing any exception, the test is passed or failed otherwise.
     * @param testName {String} - test name or description
     * @param func {Function} - function to be invoked
     */
    sf.assert.addCheck('pass', function (testName, func) {
        try {
            func();
            logger.recordAssert("[Pass] " + testName);
        } catch (err) {
            recordFail("[Fail] " + testName, err.stack);
        }
    });

    /**
     * Alias for the pass assert.
     */
    sf.assert.alias('test', 'pass');

    /**
     * Registering assert for checking if a callback function is executed before timeout is reached without any exceptions.
     * If the function is throwing any exception or the timeout is reached, the test is failed or passed otherwise.
     * @param testName {String} - test name or description
     * @param func {Function} - function to be invoked
     * @param timeout {Number} - number of milliseconds for the timeout check. Default to 500ms.
     */
    sf.assert.addCheck('callback', function (testName, func, timeout) {

        if (!func || typeof func != "function") {
            throw new Error("Wrong usage of assert.callback!");
        }

        if (!timeout) {
            timeout = 500;
        }

        __assetsCounter++;

        let passed = false;

        function callback() {
            __assetsCounter--;
            if (!passed) {
                passed = true;
                logger.recordAssert("[Pass] " + testName);
                successTest();
            } else {
                recordFail("[Fail (multiple calls)] " + testName);
            }

            if(__assetsCounter === 0){
                //small tweak to eliminate potential not necessary timeout until the test end
                sf.assert.end(undefined, 0, true);
            }
        }

        setTimeout(successTest, timeout);
        delayEnd(testName, timeout + 100);

        try {
            func(callback);
        } catch (err) {
            recordFail("[Fail] " + testName, err, true);
        }

        function successTest(force) {
            if (!passed) {
                logger.recordAssert("[Fail Timeout] " + testName);
            }
        }


    });

    /**
     * Registering assert for checking if an array of callback functions are executed in a waterfall manner,
     * before timeout is reached without any exceptions.
     * If any of the functions is throwing any exception or the timeout is reached, the test is failed or passed otherwise.
     * @param testName {String} - test name or description
     * @param func {Function} - function to be invoked
     * @param timeout {Number} - number of milliseconds for the timeout check. Default to 500ms.
     */
    sf.assert.addCheck('steps', function (testName, arr, timeout) {
        if (!timeout) {
            timeout = 500;
        }

        let currentStep = 0;
        let passed = false;

        function next() {
            if (currentStep === arr.length) {
                passed = true;
                logger.recordAssert("[Pass] " + testName);
                return;
            }

            const func = arr[currentStep];
            currentStep++;
            try {
                func(next);
            } catch (err) {
                recordFail("[Fail] " + testName + " [at step " + currentStep + "]", err);
            }
        }

        function successTest(force) {
            if (!passed) {
                recordFail("[Fail Timeout] " + testName + " [at step " + currentStep + "]");
            }
        }

        setTimeout(successTest, timeout);
        // delayEnd(testName, timeout + 100);
        next();
    });

    /**
     * Alias for the steps assert.
     */
    sf.assert.alias('waterfall', 'steps');


    let cleaningArray = [];
    /**
     * Registering a cleaning function
     * @param func {Function} - function to be invoked
     */
    sf.assert.addCheck('addCleaningFunction', function (func) {
        cleaningArray.push(func);
    });

    /**
     * Registering a cleaning function
     * @param func {Function} - function to be invoked
     */
    sf.assert.addCheck('disableCleanings', function (func) {
        cleaningArray = [];
    });

    sf.assert.addCheck('hashesAreEqual', function (hash1, hash2) {
        if (!Array.isArray(hash1) && !Array.isArray(hash2)) {
            return hash1 === hash2;
        }

        if (!Array.isArray(hash1) || !Array.isArray(hash2)) {
            return false;
        }

        hash1.sort();
        hash2.sort();
        for (let i in hash1) {
            if (hash1[i] !== hash2[i]) {
                return false;
            }
        }

        return true;
    });

    /**
     * Registering assert for asynchronously printing all execution summary from logger.dumpWhys.
     * @param message {String} - message to be recorded
     * @param timeout {Number} - number of milliseconds for the timeout check. Default to 500ms.
     */
    sf.assert.addCheck('end', function (cleaningFunction, timeout, silence) {
        if (!timeout) {
            timeout = 1000;
        }

        function handler() {
            if (logger.dumpWhys) {
                logger.dumpWhys().forEach(function (c) {
                    const executionSummary = c.getExecutionSummary();
                    console.log(JSON.stringify(executionSummary, null, 4));
                });
            }

            if (!silence) {
                console.log("Forcing exit after", timeout, "ms");
            }

            setTimeout(function () {
                if (__failWasAlreadyGenerated || __assetsCounter != 0) {
                    process.exit(1);
                } else {
                    process.exit(0);
                }
            }, 1000);

            cleaningArray.map(function (func) {
                func();
            });
            if (cleaningFunction) {
                cleaningFunction();
            }
        }

        setTimeout(handler, timeout);
    });


};
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardChecks.js":[function(require,module,exports){
/*
    checks are like asserts but are intended to be used in production code to help debugging and signaling wrong behaviours

 */

exports.init = function(sf){
    sf.exceptions.register('checkFail', function(explanation, err){
        var stack;
        if(err){
            stack = err.stack;
        }
        console.log("Check failed ", explanation, stack);
    });

    sf.check.addCheck('equal', function(v1 , v2, explanation){

        if(v1 !== v2){
            if(!explanation){
                explanation =  " ["+ v1 + " != " + v2 + "]";
            }

            sf.exceptions.checkFail(explanation);
        }
    });


    sf.check.addCheck('true', function(b, explanation){
        if(!b){
            if(!explanation){
                explanation =  " expression is false but is expected to be true";
            }

            sf.exceptions.checkFail(explanation);
        }
    });


    sf.check.addCheck('false', function(b, explanation){
        if(b){
            if(!explanation){
                explanation =  " expression is true but is expected to be false";
            }

            sf.exceptions.checkFail(explanation);
        }
    });

    sf.check.addCheck('notequal', function(v1 , v2, explanation){
        if(v1 == v2){
            if(!explanation){
                explanation =  " ["+ v1 + " == " + v2 + "]";
            }
            sf.exceptions.checkFail(explanation);
        }
    });


    /*
        added mainly for test purposes, better test frameworks like mocha could be much better :)
    */
    sf.check.addCheck('fail', function(testName ,func){
        try{
            func();
            console.log("[Fail] " + testName );
        } catch(err){
            console.log("[Pass] " + testName );
        }
    });


    sf.check.addCheck('pass', function(testName ,func){
        try{
            func();
            console.log("[Pass] " + testName );
        } catch(err){
            console.log("[Fail] " + testName  ,  err.stack);
        }
    });


    sf.check.alias('test','pass');


    sf.check.addCheck('callback', function(testName ,func, timeout){
        if(!timeout){
            timeout = 500;
        }
        var passed = false;
        function callback(){
            if(!passed){
                passed = true;
                console.log("[Pass] " + testName );
                SuccessTest();
            } else {
                console.log("[Fail (multiple calls)] " + testName );
            }
        }
        try{
            func(callback);
        } catch(err){
            console.log("[Fail] " + testName  ,  err.stack);
        }

        function SuccessTest(force){
            if(!passed){
                console.log("[Fail Timeout] " + testName );
            }
        }

        setTimeout(SuccessTest, timeout);
    });


    sf.check.addCheck('steps', function(testName , arr, timeout){
        var  currentStep = 0;
        var passed = false;
        if(!timeout){
            timeout = 500;
        }

        function next(){
            if(currentStep === arr.length){
                passed = true;
                console.log("[Pass] " + testName );
                return ;
            }
            var func = arr[currentStep];
            currentStep++;
            try{
                func(next);
            } catch(err){
                console.log("[Fail] " + testName  ,"\n\t" , err.stack + "\n\t" , " [at step ", currentStep + "]");
            }
        }

        function SuccessTest(force){
            if(!passed){
                console.log("[Fail Timeout] " + testName + "\n\t" , " [at step ", currentStep+ "]");
            }
        }

        setTimeout(SuccessTest, timeout);
        next();
    });

    sf.check.alias('waterfall','steps');
    sf.check.alias('notEqual','notequal');

    sf.check.addCheck('end', function(timeOut, silence){
        if(!timeOut){
            timeOut = 1000;
        }

        setTimeout(function(){
            if(!silence){
                console.log("Forcing exit after", timeOut, "ms");
            }
            process.exit(0);
        }, timeOut);
    });


    sf.check.addCheck('begin', function(message, timeOut){
        console.log(message);
        sf.check.end(timeOut, true);
    });


};
},{}],"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardExceptions.js":[function(require,module,exports){
exports.init = function(sf){
    /**
     * Registering unknown exception handler.
     */
    sf.exceptions.register('unknown', function(explanation){
        explanation = explanation || "";
        const message = "Unknown exception" + explanation;
        throw(message);
    });

    /**
     * Registering resend exception handler.
     */
    sf.exceptions.register('resend', function(exceptions){
        throw(exceptions);
    });

    /**
     * Registering notImplemented exception handler.
     */
    sf.exceptions.register('notImplemented', function(explanation){
        explanation = explanation || "";
        const message = "notImplemented exception" + explanation;
        throw(message);
    });

    /**
     * Registering security exception handler.
     */
    sf.exceptions.register('security', function(explanation){
        explanation = explanation || "";
        const message = "security exception" + explanation;
        throw(message);
    });

    /**
     * Registering duplicateDependency exception handler.
     */
    sf.exceptions.register('duplicateDependency', function(variable){
        variable = variable || "";
        const message = "duplicateDependency exception" + variable;
        throw(message);
    });
};
},{}],"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardLogs.js":[function(require,module,exports){
const LOG_LEVELS = {
    HARD_ERROR: 0,  // system level critical error: hardError
    ERROR: 1,  // potentially causing user's data loosing error: error
    ASSERT_FAIL: 1,  // an assert fails
    LOG_ERROR: 2,  // minor annoyance, recoverable error:   logError
    UX_ERROR: 3,  // user experience causing issues error:  uxError
    WARN: 4,  // warning,possible isues but somehow unclear behaviour: warn
    INFO: 5,  // store general info about the system working: info
    DEBUG: 6,  // system level debug: debug
    LOCAL_DEBUG: 7,  // local node/service debug: ldebug
    USER_DEBUG: 8,  // user level debug; udebug
    DEV_DEBUG: 9,  // development time debug: ddebug
    WHYS: 10, // whyLog for code reasoning
    TEST_RESULT: 11, // testResult to log running tests
};

exports.init = function (sf) {

    /**
     * Records log messages from various use cases.
     * @param record {String} - log message.
     */
    sf.logger.record = function (record) {
        const triggerStrings = ["pskruntime", "double-check", "psklogger", "standardGlobalSymbols"];
        let displayOnConsole = true;
        if (process.send) {
            process.send(record);
            displayOnConsole = false;
        }

        function removeLines(str, nb) {
            function removeLine(str,  force) {
                let pos = str.indexOf("\n");
                let willBeRemoved = str.slice(0, pos);
                if (!force) {
                    let foundMatch = false;
                    for(let i=0; i< triggerStrings.length;i++){
                        let item = triggerStrings[i];
                        if (willBeRemoved.indexOf(item) != -1) {
                            foundMatch = true;
                        }
                    }
                    if (!foundMatch) {
                        throw foundMatch;
                    }
                }
                return str.slice(pos + 1, str.length);
            }

            let ret = str;
            for (let v = 0; v < nb; v++) {
                try {
                    ret = removeLine(ret, v==0);
                } catch (err) {
                    // nothing... exit for
                }
            }
            return "Stack:\n"+ret;
        }

        if (displayOnConsole) {
            //const prettyLog = JSON.stringify(record, null, 2);
            //console.log(prettyLog);
            console.log(record.message);
            if (record.stack) {
                var pos = record.stack.indexOf("\n");
                var message = record.stack.slice(0, pos);
                if(record.level<=LOG_LEVELS.ERROR){
                    console.error(message);
                    console.error(removeLines(record.stack, 3));
                } else {
                    console.log(message);
                    console.log(removeLines(record.stack, 3));
                }
            }
        }
    };

    /**
     * Adding case for logging system level critical errors.
     */
    sf.logger.addCase('hardError', function (message, exception, args, pos, data) {
        sf.logger.record(createDebugRecord(LOG_LEVELS.HARD_ERROR, 'systemError', message, exception, true, args, pos, data));
    }, [
        {
            'message': 'explanation'
        }
    ]);

    /**
     * Adding case for logging potentially causing user's data loosing errors.
     */
    sf.logger.addCase('error', function (message, exception, args, pos, data) {
        sf.logger.record(createDebugRecord(LOG_LEVELS.ERROR, 'error', message, exception, true, args, pos, data));
    }, [
        {
            'message': 'explanation'
        },
        {
            'exception': 'exception'
        }
    ]);

    /**
     * Adding case for logging minor annoyance, recoverable errors.
     */
    sf.logger.addCase('logError', function (message, exception, args, pos, data) {
        sf.logger.record(createDebugRecord(LOG_LEVELS.LOG_ERROR, 'logError', message, exception, true, args, pos, data));
    }, [
        {
            'message': 'explanation'
        },
        {
            'exception': 'exception'
        }
    ]);

    /**
     * Adding case for logging user experience causing issues errors.
     */
    sf.logger.addCase('uxError', function (message) {
        sf.logger.record(createDebugRecord(LOG_LEVELS.UX_ERROR, 'uxError', message, null, false));
    }, [
        {
            'message': 'explanation'
        }
    ]);

    /**
     * Adding case for logging throttling messages.
     */
    sf.logger.addCase('throttling', function (message) {
        sf.logger.record(createDebugRecord(LOG_LEVELS.WARN, 'throttling', message, null, false));
    }, [
        {
            'message': 'explanation'
        }
    ]);

    /**
     * Adding case for logging warning, possible issues, but somehow unclear behaviours.
     */
    sf.logger.addCase('warning', function (message) {
        sf.logger.record(createDebugRecord(LOG_LEVELS.WARN, 'warning', message, null, false, arguments, 0));
    }, [
        {
            'message': 'explanation'
        }
    ]);

    sf.logger.alias('warn', 'warning');

    /**
     * Adding case for logging general info about the system working.
     */
    sf.logger.addCase('info', function (message) {
        sf.logger.record(createDebugRecord(LOG_LEVELS.INFO, 'info', message, null, false, arguments, 0));
    }, [
        {
            'message': 'explanation'
        }
    ]);

    /**
     * Adding case for logging system level debug messages.
     */
    sf.logger.addCase('debug', function (message) {
        sf.logger.record(createDebugRecord(LOG_LEVELS.DEBUG, 'debug', message, null, false, arguments, 0));
    }, [
        {
            'message': 'explanation'
        }
    ]);


    /**
     * Adding case for logging local node/service debug messages.
     */
    sf.logger.addCase('ldebug', function (message) {
        sf.logger.record(createDebugRecord(LOG_LEVELS.LOCAL_DEBUG, 'ldebug', message, null, false, arguments, 0));
    }, [
        {
            'message': 'explanation'
        }
    ]);

    /**
     * Adding case for logging user level debug messages.
     */
    sf.logger.addCase('udebug', function (message) {
        sf.logger.record(createDebugRecord(LOG_LEVELS.USER_DEBUG, 'udebug', message, null, false, arguments, 0));
    }, [
        {
            'message': 'explanation'
        }
    ]);

    /**
     * Adding case for logging development debug messages.
     */
    sf.logger.addCase('devel', function (message) {
        sf.logger.record(createDebugRecord(LOG_LEVELS.DEV_DEBUG, 'devel', message, null, false, arguments, 0));
    }, [
        {
            'message': 'explanation'
        }
    ]);

    /**
     * Adding case for logging "whys" reasoning messages.
     */
    sf.logger.addCase("logWhy", function (logOnlyCurrentWhyContext) {
        sf.logger.record(createDebugRecord(LOG_LEVELS.WHYS, 'logwhy', undefined, undefined, undefined, undefined, undefined, undefined, logOnlyCurrentWhyContext));
    });

    /**
     * Adding case for logging asserts messages to running tests.
     */
    sf.logger.addCase("recordAssert", function (message, error, showStack) {
        if(error || showStack){
            sf.logger.record(createDebugRecord(LOG_LEVELS.ASSERT_FAIL, 'assert', message, error, showStack));
        } else {
            sf.logger.record(createDebugRecord(LOG_LEVELS.TEST_RESULT, 'assert', message, error, showStack));
        }
    });

    /**
     * Generic method to create structured debug records based on the log level.
     * @param level {Number} - number from 1-11, used to identify the level of attention that a log entry should get from operations point of view
     * @param type {String} - identifier name for log type
     * @param message {String} - description of the debug record
     * @param exception {String} - exception details if any
     * @param saveStack {Boolean} - if set to true, the exception call stack will be added to the debug record
     * @param args {Array} - arguments of the caller function
     * @param pos {Number} - position
     * @param data {String|Number|Array|Object} - payload information
     * @param logOnlyCurrentWhyContext - if whys is enabled, only the current context will be logged
     * @returns Debug record model {Object} with the following fields:
     * [required]: level: *, type: *, timestamp: number, message: *, data: * and
     * [optional]: stack: *, exception: *, args: *, whyLog: *
     */
    function createDebugRecord(level, type, message, exception, saveStack, args, pos, data, logOnlyCurrentWhyContext) {

        var ret = {
            level: level,
            type: type,
            timestamp: (new Date()).getTime(),
            message: message
        };

        if(data){
            ret.data = data;
        }

        if (saveStack) {
            var stack = '';
            if (exception) {
                stack = exception.stack;
            } else {
                stack = (new Error()).stack;
            }
            ret.stack = stack;
        }

        if (exception) {
            ret.exception = exception.message;
        }

        if (args) {
            ret.args = JSON.parse(JSON.stringify(args));
        }

        if (process.env.RUN_WITH_WHYS) {
            var why = require('whys');
            if (logOnlyCurrentWhyContext) {
                ret['whyLog'] = why.getGlobalCurrentContext().getExecutionSummary();
            } else {
                ret['whyLog'] = why.getAllContexts().map(function (context) {
                    return context.getExecutionSummary();
                });
            }
        }
        return ret;
    }

}
;


},{"whys":false}],"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/utils/glob-to-regexp.js":[function(require,module,exports){

// globToRegExp turns a UNIX glob expression into a RegEx expression.
//  Supports all simple glob patterns. Examples: *.ext, /foo/*, ../../path, ^foo.*
// - single character matching, matching ranges of characters etc. group matching are no supported
// - flags are not supported
var globToRegExp = function (globExp) {
    if (typeof globExp !== 'string') {
        throw new TypeError('Glob Expression must be a string!');
    }

    var regExp = "";

    for (let i = 0, len = globExp.length; i < len; i++) {
        let c = globExp[i];

        switch (c) {
            case "/":
            case "$":
            case "^":
            case "+":
            case ".":
            case "(":
            case ")":
            case "=":
            case "!":
            case "|":
                regExp += "\\" + c;
                break;

            case "*":
                // treat any number of "*" as one
                while(globExp[i + 1] === "*") {
                    i++;
                }
                regExp += ".*";
                break;

            default:
                regExp += c;
        }
    }

    // set the regular expression with ^ & $
    regExp = "^" + regExp + "$";

    return new RegExp(regExp);
};

module.exports = globToRegExp;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/double-check/utils/AsyncDispatcher.js":[function(require,module,exports){

function AsyncDispatcher(finalCallback) {
	let results = [];
	let errors = [];

	let started = 0;

	function markOneAsFinished(err, res) {
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

	function dispatchEmpty(amount = 1) {
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
		dispatchEmpty,
		markOneAsFinished
	};
}

module.exports = AsyncDispatcher;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/BootstrapingService/RequestsChain.js":[function(require,module,exports){
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
},{"./BrowserSSICage":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/ssiCage/BrowserSSICage.js","./NodeSSICage":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/ssiCage/NodeSSICage.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/opendsu/anchoring/index.js":[function(require,module,exports){
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

},{"psklogger":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-cache/lib/Cache.js":[function(require,module,exports){
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

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/index.js":[function(require,module,exports){
//to look nice the requireModule on Node
require("./lib/psk-abstract-client");
const or = require('overwrite-require');
if ($$.environmentType === or.constants.BROWSER_ENVIRONMENT_TYPE) {
	require("./lib/psk-browser-client");
} else {
	require("./lib/psk-node-client");
}
},{"./lib/psk-abstract-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-abstract-client.js","./lib/psk-browser-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-browser-client.js","./lib/psk-node-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-node-client.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-abstract-client.js":[function(require,module,exports){
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

},{"./psk-abstract-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-abstract-client.js","buffer":false,"http":false,"https":false,"url":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/ECKeyGenerator.js":[function(require,module,exports){
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

},{"queue":"queue"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/SwarmEngine.js":[function(require,module,exports){
function SwarmEngine(identity) {
    let myOwnIdentity = identity || SwarmEngine.prototype.ANONYMOUS_IDENTITY;

    const protectedFunctions = {};

    const SwarmPacker = require("swarmutils").SwarmPacker;
    //serializationType used when starting a swarm from this SwarmEngine instance
    let serializationType = SwarmPacker.prototype.JSON;

    const swarmInstancesCache = new Map();
    const powerCordCollection = new Map();

    this.updateIdentity = function (identify) {
        if (myOwnIdentity === SwarmEngine.prototype.ANONYMOUS_IDENTITY) {
            console.log("Updating my identity with", identify);
            myOwnIdentity = identify;
        } else {
            $$.err(`Trying to changing identity from "${myOwnIdentity}" to "${identify}"`);
        }
    };

    this.setSerializationType = function (type) {
        if (typeof SwarmPacker.getSerializer(type) !== "undefined") {
            serializationType = type;
        } else {
            $$.throw(`Unknown serialization type "${type}"`);
        }
    };

    this.plug = function (identity, powerCordImpl) {
        makePluggable(powerCordImpl);
        powerCordImpl.plug(identity, relay);

        powerCordCollection.set(identity, powerCordImpl);
    };

    this.unplug = function (identity) {
        const powerCord = powerCordCollection.get(identity);

        if (!powerCord) {
            //silent fail
            return;
        }

        powerCord.unplug();
        powerCordCollection.delete(identity);
    };

    function relay(swarmSerialization, ignoreMyIdentity) {
        try {

            const swarmutils = require('swarmutils');

            const OwM = swarmutils.OwM;
            const SwarmPacker = swarmutils.SwarmPacker;

            const swarmHeader = SwarmPacker.getHeader(swarmSerialization);
            const swarmTargetIdentity = swarmHeader.swarmTarget;

            if(typeof ignoreMyIdentity === "undefined" || !ignoreMyIdentity){
                if (myOwnIdentity === swarmTargetIdentity || myOwnIdentity === "*") {
                    const deserializedSwarm = OwM.prototype.convert(SwarmPacker.unpack(swarmSerialization));
                    protectedFunctions.execute_swarm(deserializedSwarm);
                    return;
                }
            }

            const targetPowerCord = powerCordCollection.get(swarmTargetIdentity) || powerCordCollection.get(SwarmEngine.prototype.WILD_CARD_IDENTITY);

            if (targetPowerCord) {
                //console.log(myOwnIdentity, "calling powercord", swarmTargetIdentity);
                targetPowerCord.sendSwarm(swarmSerialization);
                return;
            } else {
                $$.err(`Bad Swarm Engine configuration. No PowerCord for identity "${swarmTargetIdentity}" found.`);
            }
        } catch (superError) {
            console.log(superError);
        }
    }

    function getPowerCord(identity) {
        const powerCord = powerCordCollection.get(identity);

        if (!powerCord) {
            //should improve the search of powerCord based on * and self :D

            $$.throw(`No powerCord found for the identity "${identity}"`);
        }

        return powerCord;
    }

    /* ???
    swarmCommunicationStrategy.enableSwarmExecution(function(swarm){

    }); */

    function serialize(swarm) {
        const beesHealer = require("swarmutils").beesHealer;
        const simpleJson = beesHealer.asJSON(swarm, swarm.meta.phaseName, swarm.meta.args);
        const serializer = SwarmPacker.getSerializer(swarm.meta.serializationType || serializationType);
        return SwarmPacker.pack(simpleJson, serializer);
    }

    function createBaseSwarm(swarmTypeName) {
        const swarmutils = require('swarmutils');
        const OwM = swarmutils.OwM;

        const swarm = new OwM();
        swarm.setMeta("swarmId", $$.uidGenerator.safe_uuid());
        swarm.setMeta("requestId", swarm.getMeta("swarmId"));
        swarm.setMeta("swarmTypeName", swarmTypeName);
        swarm.setMeta(SwarmEngine.META_SECURITY_HOME_CONTEXT, myOwnIdentity);

        return swarm;
    }

    function cleanSwarmWaiter(swarmSerialisation) { // TODO: add better mechanisms to prevent memory leaks
        let swarmId = swarmSerialisation.meta.swarmId;
        let watcher = swarmInstancesCache[swarmId];

        if (!watcher) {
            $$.warn("Invalid swarm received: " + swarmId);
            return;
        }

        let args = swarmSerialisation.meta.args;
        args.push(swarmSerialisation);

        watcher.callback.apply(null, args);
        if (!watcher.keepAliveCheck()) {
            delete swarmInstancesCache[swarmId];
        }
    }

    protectedFunctions.startSwarmAs = function (identity, swarmTypeName, phaseName, ...args) {
        const swarm = createBaseSwarm(swarmTypeName);
        swarm.setMeta($$.swarmEngine.META_SECURITY_HOME_CONTEXT, myOwnIdentity);

        protectedFunctions.sendSwarm(swarm, SwarmEngine.EXECUTE_PHASE_COMMAND, identity, phaseName, args);
        return swarm;
    };

    protectedFunctions.sendSwarm = function (swarmAsVO, command, identity, phaseName, args) {

        swarmAsVO.setMeta("phaseName", phaseName);
        swarmAsVO.setMeta("target", identity);
        swarmAsVO.setMeta("command", command);
        swarmAsVO.setMeta("args", args);

        relay(serialize(swarmAsVO), true);
    };

    protectedFunctions.waitForSwarm = function (callback, swarm, keepAliveCheck) {

        function doLogic() {
            let swarmId = swarm.getInnerValue().meta.swarmId;
            let watcher = swarmInstancesCache.get(swarmId);
            if (!watcher) {
                watcher = {
                    swarm: swarm,
                    callback: callback,
                    keepAliveCheck: keepAliveCheck
                };
                swarmInstancesCache.set(swarmId, watcher);
            }
        }

        function filter() {
            return swarm.getInnerValue().meta.swarmId;
        }

        //$$.uidGenerator.wait_for_condition(condition,doLogic);
        swarm.observe(doLogic, null, filter);
    };

    protectedFunctions.execute_swarm = function (swarmOwM) {

        const swarmCommand = swarmOwM.getMeta('command');

        //console.log("Switching on command ", swarmCommand);
        switch (swarmCommand) {
            case SwarmEngine.prototype.EXECUTE_PHASE_COMMAND:
                let swarmId = swarmOwM.getMeta('swarmId');
                let swarmType = swarmOwM.getMeta('swarmTypeName');
                let instance = swarmInstancesCache.get(swarmId);

                let swarm;

                if (instance) {
                    swarm = instance.swarm;
                    swarm.actualize(swarmOwM);

                } else {
                    if (typeof $$.blockchain !== "undefined") {
                        swarm = $$.swarm.startWithContext($$.blockchain, swarmType);
                    } else {
                        swarm = $$.swarm.start(swarmType);
                    }

                    if (!swarm) {
                        throw new Error(`Unknown swarm with type <${swarmType}>. Check if this swarm is defined in the domain constitution!`);
                    } else {
                        swarm.actualize(swarmOwM);
                    }

                    /*swarm = $$.swarm.start(swarmType, swarmSerialisation);*/
                }
                swarm.runPhase(swarmOwM.meta.phaseName, swarmOwM.meta.args);
                break;
            case SwarmEngine.prototype.EXECUTE_INTERACT_PHASE_COMMAND:
                is.dispatch(swarmOwM);
                break;
            case SwarmEngine.prototype.RETURN_PHASE_COMMAND:
                is.dispatch(swarmOwM);
                break;
            default:
                $$.err(`Unrecognized swarm command ${swarmCommand}`);
        }
    };

    protectedFunctions.acknowledge = function(method, swarmId, swarmName, swarmPhase, cb){
        powerCordCollection.forEach((powerCord, identity)=>{
            if(typeof powerCord[method] === "function"){
                powerCord[method].call(powerCord, swarmId, swarmName, swarmPhase, cb);
            }
        });
    };

    require("./swarms")(protectedFunctions);
    const is = require("./interactions")(protectedFunctions);
}

Object.defineProperty(SwarmEngine.prototype, "EXECUTE_PHASE_COMMAND", {value: "executeSwarmPhase"});
Object.defineProperty(SwarmEngine.prototype, "EXECUTE_INTERACT_PHASE_COMMAND", {value: "executeInteractPhase"});
Object.defineProperty(SwarmEngine.prototype, "RETURN_PHASE_COMMAND", {value: "__return__"});

Object.defineProperty(SwarmEngine.prototype, "META_RETURN_CONTEXT", {value: "returnContext"});
Object.defineProperty(SwarmEngine.prototype, "META_SECURITY_HOME_CONTEXT", {value: "homeSecurityContext"});
Object.defineProperty(SwarmEngine.prototype, "META_WAITSTACK", {value: "waitStack"});

Object.defineProperty(SwarmEngine.prototype, "ANONYMOUS_IDENTITY", {value: "anonymous"});
Object.defineProperty(SwarmEngine.prototype, "SELF_IDENTITY", {value: "self"});
Object.defineProperty(SwarmEngine.prototype, "WILD_CARD_IDENTITY", {value: "*"});

function makePluggable(powerCord) {
    powerCord.plug = function (identity, powerTransfer) {
        powerCord.transfer = powerTransfer;
        powerCord.identity = identity;
    };

    powerCord.unplug = function () {
        powerCord.transfer = null;
    };

    Object.defineProperty(powerCord, "identity", {
        set: (value) => {
            if(typeof powerCord.__identity === "undefined"){
                powerCord.__identity = value;
            }
            return true;
        }, get: () => {
            return powerCord.__identity;
        }
    });

    return powerCord;
}

module.exports = SwarmEngine;

},{"./interactions":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/interactions/index.js","./swarms":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/swarms/index.js","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/BootEngine.js":[function(require,module,exports){
function BootEngine(getKeySSI, initializeSwarmEngine, runtimeBundles, constitutionBundles) {

	if (typeof getKeySSI !== "function") {
		throw new Error("getSeed missing or not a function");
	}
	getKeySSI = promisify(getKeySSI);

	if (typeof initializeSwarmEngine !== "function") {
		throw new Error("initializeSwarmEngine missing or not a function");
	}
	initializeSwarmEngine = promisify(initializeSwarmEngine);

	if (typeof runtimeBundles !== "undefined" && !Array.isArray(runtimeBundles)) {
		throw new Error("runtimeBundles is not array");
	}

	if (typeof constitutionBundles !== "undefined" && !Array.isArray(constitutionBundles)) {
		throw new Error("constitutionBundles is not array");
	}

	const openDSU = require('opendsu');
	const resolver = openDSU.loadApi('resolver');
	const pskPath = require("swarmutils").path;

	const evalBundles = async (bundles, ignore) => {
		const listFiles = promisify(this.rawDossier.listFiles);
		const readFile = promisify(this.rawDossier.readFile);

		let fileList = await listFiles(openDSU.constants.CONSTITUTION_FOLDER);
		fileList = bundles.filter(bundle => fileList.includes(bundle) || fileList.includes(`/${bundle}`))
			.map(bundle => pskPath.join(openDSU.constants.CONSTITUTION_FOLDER, bundle));

		if (fileList.length !== bundles.length) {
			const message = `Some bundles missing. Expected to have ${JSON.stringify(bundles)} but got only ${JSON.stringify(fileList)}`;
			if (!ignore) {
				throw new Error(message);
			} else {
				console.log(message);
			}
		}


		for (let i = 0; i < fileList.length; i++) {
			var fileContent = await readFile(fileList[i]);
			eval(fileContent.toString());
		}
	};

	this.boot = function (callback) {
		const __boot = async () => {
            const keySSI = await getKeySSI();
            const loadRawDossier = promisify(resolver.loadDSU);
            try {
                this.rawDossier = await loadRawDossier(keySSI);
            } catch (err) {
                console.log(err);
            }

            try {
                await evalBundles(runtimeBundles);
            } catch(err) {
            	if(err.type !== "PSKIgnorableError"){
					console.log(err);
				}
            }
            await initializeSwarmEngine();
            if (typeof constitutionBundles !== "undefined") {
                try {
                    await evalBundles(constitutionBundles, true);
                } catch(err) {
                    console.log(err);
                }
            }
		};

		__boot()
			.then(() => callback(undefined, this.rawDossier))
			.catch(callback);
	};
}

function promisify(fn) {
	return function (...args) {
		return new Promise((resolve, reject) => {
			fn(...args, (err, ...res) => {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					resolve(...res);
				}
			});
		});
	}
}

module.exports = BootEngine;

},{"opendsu":"opendsu","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/IsolateBootScript.js":[function(require,module,exports){

async function getIsolatesWorker({workerData: {constitutions}, externalApi}) {
    const swarmUtils = require('swarmutils');
    const beesHealer = swarmUtils.beesHealer;
    const OwM = swarmUtils.OwM;
    const SwarmPacker = swarmUtils.SwarmPacker;
    const pskIsolatesModuleName = "pskisolates";
    const IsolatedVM = require(pskIsolatesModuleName);
    const {EventEmitter} = require('events');

    const config = IsolatedVM.IsolateConfig.defaultConfig;
    config.logger = {
        send([logChannel, logObject]) {
            $$.redirectLog(logChannel, logObject)
        }
    };

    const fs = require('fs');

    constitutions = constitutions.map(constitution => fs.readFileSync(constitution, 'utf8'));

    const isolate = await IsolatedVM.getDefaultIsolate({
        shimsBundle: constitutions[0],
        browserifyBundles: constitutions.slice(1),
        config: config,
        externalApi: externalApi
    });

    class IsolatesWrapper extends EventEmitter {
        postMessage(packedSwarm) {
            const swarm = SwarmPacker.unpack(packedSwarm);

            const phaseName = OwM.prototype.getMetaFrom(swarm, 'phaseName');
            const args = OwM.prototype.getMetaFrom(swarm, 'args');
            const serializedSwarm = beesHealer.asJSON(swarm, phaseName, args);
            const stringifiedSwarm = JSON.stringify(serializedSwarm);

            isolate.run(`
                if(typeof global.identitySet === "undefined"){
                    global.identitySet = true;
                  
				    $$.swarmEngine.updateIdentity(getIdentity.applySync(undefined, []));
				}
            `).then(() => {
                const powerCordRef = isolate.context.global.getSync('powerCord');
                const transferFnRef = powerCordRef.getSync('transfer');
                const swarmAsRef = new isolate.ivm.ExternalCopy(new Uint8Array(packedSwarm)).copyInto();
                // console.log(transferFnRef, swarmAsRef);

                transferFnRef.applyIgnored(powerCordRef.derefInto(), [swarmAsRef]);
            }).catch((err) => {
                this.emit('error', err);
            });

        }
    }

    const isolatesWrapper = new IsolatesWrapper();
    isolatesWrapper.globalSetSync = isolate.globalSetSync;

    isolate.globalSetSync('returnSwarm', (err, swarm) => {
        try {
            isolatesWrapper.emit('message', swarm);
        } catch (e) {
            console.log('Caught error', e);
        }
    });

    await isolate.run(`
            const se = require("swarm-engine");
            global.powerCord = new se.InnerIsolatePowerCord();
            $$.swarmEngine.plug($$.swarmEngine.WILD_CARD_IDENTITY, global.powerCord);
		`);

    //TODO: this might cause a memory leak
    setInterval(async () => {
        const rawIsolate = isolate.rawIsolate;
        const cpuTime = rawIsolate.cpuTime;
        const wallTime = rawIsolate.wallTime;

        const heapStatistics = await rawIsolate.getHeapStatistics();
        const activeCPUTime = (cpuTime[0] + cpuTime[1] / 1e9) * 1000;
        const totalCPUTime = (wallTime[0] + wallTime[1] / 1e9) * 1000;
        const idleCPUTime = totalCPUTime - activeCPUTime;
        $$.event('sandbox.metrics', {heapStatistics, activeCPUTime, totalCPUTime, idleCPUTime});

    }, 10 * 1000); // 10 seconds


    return isolatesWrapper;
}

module.exports = getIsolatesWorker;

},{"events":false,"fs":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/ThreadWorkerBootScript.js":[function(require,module,exports){
function boot() {
    const worker_threads ='worker_threads';
    const {parentPort, workerData} = require(worker_threads);

    process.on("uncaughtException", (err) => {
        console.error('unchaughtException inside worker', err);
        setTimeout(() => {
            process.exit(1);
        }, 100);
    });

    function getKeySSI(callback){
        let err;
        if (!workerData.hasOwnProperty('constitutionSeed') || typeof workerData.constitutionSeed !== "string") {
            err = new Error(`Missing or wrong type of constitutionSeed in worker data configuration: ${JSON.stringify(workerData)}`);
            if(!callback){
                throw err;
            }
        }
        if(callback){
            return callback(err, workerData.constitutionSeed);
        }
        return workerData.constitutionSeed;
    }

    const openDSU = require("opendsu");
    const resolver = openDSU.loadApi("resolver");
    function initializeSwarmEngine(callback){
        require('callflow').initialise();
        const swarmEngine = require('swarm-engine');

        swarmEngine.initialise(process.env.IDENTITY);
        const powerCord = new swarmEngine.InnerThreadPowerCord();

        $$.swarmEngine.plug($$.swarmEngine.WILD_CARD_IDENTITY, powerCord);

        parentPort.on('message', (packedSwarm) => {
            powerCord.transfer(packedSwarm);
        });

        resolver.loadDSU(workerData.constitutionSeed, (err, rawDossier) => {
            if (err) {
                $$.throwError(err);
            }

            rawDossier.start((err) =>{
                if(err){
                    $$.throwError(err);
                }
                callback(undefined);
            });
        });
    }

    const BootEngine = require("./BootEngine.js");

    const booter = new BootEngine(getKeySSI, initializeSwarmEngine, ["pskruntime.js", "blockchain.js"], ["domain.js"]);

    booter.boot((err) => {
        if(err){
            throw err;
        }
        parentPort.postMessage('ready');
    });
}

boot();
//module.exports = boot.toString();

},{"./BootEngine.js":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/BootEngine.js","callflow":false,"opendsu":"opendsu","swarm-engine":"swarm-engine"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/domainBootScript.js":[function(require,module,exports){
const path = require('path');
//enabling life line to parent process
require(path.join(process.env.PSK_ROOT_INSTALATION_FOLDER, "psknode/core/utils/pingpongFork.js")).enableLifeLine();

const keySSI = process.env.PSK_DOMAIN_KEY_SSI;
//preventing children to access the env parameter
process.env.PSK_DOMAIN_KEY_SSI = undefined;

if (process.argv.length > 3) {
    process.env.PRIVATESKY_DOMAIN_NAME = process.argv[2];
} else {
    process.env.PRIVATESKY_DOMAIN_NAME = "AnonymousDomain" + process.pid;
}

process.env.PRIVATESKY_TMP = path.resolve(process.env.PRIVATESKY_TMP || "../tmp");
process.env.DOMAIN_WORKSPACE = path.resolve(process.env.PRIVATESKY_TMP, "domainsWorkspace", process.env.PRIVATESKY_DOMAIN_NAME);

const config = JSON.parse(process.env.config);

if (typeof config.constitution !== "undefined" && config.constitution !== "undefined") {
    process.env.PRIVATESKY_DOMAIN_CONSTITUTION = config.constitution;
}

if (typeof config.workspace !== "undefined" && config.workspace !== "undefined") {
    process.env.DOMAIN_WORKSPACE = config.workspace;
}

function boot() {
    const BootEngine = require("./BootEngine");

    const bootter = new BootEngine(getKeySSI, initializeSwarmEngine, ["pskruntime.js", "pskWebServer.js", "openDSU.js"], ["blockchain.js"]);
    bootter.boot(function (err, archive) {
        if (err) {
            console.log(err);
            return;
        }
        try {
            plugPowerCords();
        } catch (err) {
            console.log("Caught an error will finishing booting process", err);
        }
    })
}

function getKeySSI(callback) {
    callback(undefined, self.keySSI);
}

let self = {keySSI};

function initializeSwarmEngine(callback) {
    const openDSU = require("opendsu");
    const resolver = openDSU.loadApi("resolver");
    resolver.loadDSU(self.keySSI, (err, bar) => {
        if (err) {
            return callback(err);
        }

        bar.readFile(openDSU.constants.DOMAIN_IDENTITY_FILE, (err, content) => {
            if (err) {
                return callback(err);
            }
            self.domainName = content.toString();
            $$.log(`Domain ${self.domainName} is booting...`);

            $$.PSK_PubSub = require("soundpubsub").soundPubSub;
            const se = require("swarm-engine");
            se.initialise(self.domainName);

            callback();
        });
    });
}

function plugPowerCords() {
    const dossier = require("dossier");
    dossier.load(self.keySSI, "DomainIdentity", function (err, dossierHandler) {
        if (err) {
            throw err;
        }

        dossierHandler.startTransaction("DomainConfigTransaction", "getDomains").onReturn(function (err, domainConfigs) {
            if (err) {
                throw  err;
            }

            const se = require("swarm-engine");
            if (domainConfigs.length === 0) {
                console.log("No domain configuration found in CSB. Boot process will stop here...");
                return;
            }
            self.domainConf = domainConfigs[0];

            for (const alias in self.domainConf.communicationInterfaces) {
                if (self.domainConf.communicationInterfaces.hasOwnProperty(alias)) {
                    let remoteUrls = self.domainConf.communicationInterfaces[alias];
                    let powerCordToDomain = new se.SmartRemoteChannelPowerCord([remoteUrls.virtualMQ + "/"], self.domainConf.alias, remoteUrls.zeroMQ);
                    $$.swarmEngine.plug("*", powerCordToDomain);
                }
            }

            dossierHandler.startTransaction("Agents", "getAgents").onReturn(function (err, agents) {
                if (err) {
                    throw err;
                }

                if (agents.length === 0) {
                    agents.push({alias: 'system'});
                }

                const openDSU = require("opendsu");
                const resolver = openDSU.loadApi("resolver");
                const pskPath = require("swarmutils").path;
                resolver.loadDSU(self.keySSI, (err, rawDossier) => {
                    if (err) {
                        throw err;
                    }

                    rawDossier.readFile(pskPath.join(openDSU.constants.CONSTITUTION_FOLDER , "threadBoot.js"), (err, fileContents) => {
                        if (err) {
                            throw err;
                        }

                        agents.forEach(agent => {
                            const agentPC = new se.OuterThreadPowerCord(fileContents.toString(), true, keySSI);
                            $$.swarmEngine.plug(`${self.domainConf.alias}/agent/${agent.alias}`, agentPC);
                        });

                        $$.event('status.domains.boot', {name: self.domainConf.alias});
                        console.log("Domain boot successfully");
                    });
                });
            });
        })
    });
}

boot();

},{"./BootEngine":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/BootEngine.js","dossier":"dossier","opendsu":"opendsu","path":false,"soundpubsub":"soundpubsub","swarm-engine":"swarm-engine","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/index.js":[function(require,module,exports){
module.exports = {
    getIsolatesBootScript: function() {
        return require('./IsolateBootScript');
    },
    getThreadBootScript: function() {
        return `(${require("./ThreadWorkerBootScript")})()`;
    },
    executeDomainBootScript: function() {
        return require('./domainBootScript');
    }
};
},{"./IsolateBootScript":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/IsolateBootScript.js","./ThreadWorkerBootScript":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/ThreadWorkerBootScript.js","./domainBootScript":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/domainBootScript.js"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/interactions/InteractionSpace.js":[function(require,module,exports){
function InteractionSpace(swarmEngineApi) {
    const listeners = {};
    const interactionTemplate = require('./interaction_template').getTemplateHandler(swarmEngineApi);

    function createThis(swarm) {
        const thisObj = interactionTemplate.createForObject(swarm);
        //todo: implement a proxy for public and private vars...
        return thisObj;
    }

    this.dispatch = function (swarm) {
        const {swarmId, swarmTypeName, phaseName, args} = swarm.meta;

        const genericKey = `*/${swarmTypeName}/${phaseName}`;
        const particularKey = `${swarmId}/${swarmTypeName}/${phaseName}`;

        const handlers = listeners[particularKey] || listeners[genericKey] || [];

        handlers.forEach(fn => {
            fn.call(createThis(swarm), ...args);
        });

        if (phaseName === $$.swarmEngine.RETURN_PHASE_COMMAND) {
            delete listeners[particularKey];
        }

        if (handlers.length === 0) {
            console.log(`No implementation for phase "${phaseName}" was found`);
        }
    };

    this.on = function (swarmId, swarmTypeName, phaseName, handler) {
        const key = `${swarmId}/${swarmTypeName}/${phaseName}`;
        if (typeof listeners[key] === "undefined") {
            listeners[key] = [];
        }
        listeners[key].push(handler);
        swarmEngineApi.acknowledge("on", swarmId, swarmTypeName, phaseName, handler);
    };

    this.off = function (swarmId = '*', swarmTypeName = '*', phaseName = '*', handler) {

        function escapeIfStar(str) {
            return str.replace("*", "\\*")
        }

        swarmId = escapeIfStar(swarmId);
        swarmTypeName = escapeIfStar(swarmTypeName);
        phaseName = escapeIfStar(phaseName);

        const regexString = `(${swarmId})\\/(${swarmTypeName})\\/(${phaseName})`;
        const reg = new RegExp(regexString);

        const keys = Object.keys(listeners);
        keys.forEach(key => {
            if (key.match(reg)) {
                const handlers = listeners[key];

                if (!handler) {
                    listeners[key] = [];
                } else {
                    listeners[key] = handlers.filter(fn => fn !== handler);
                }
            }
        });
        swarmEngineApi.acknowledge("off", swarmId, swarmTypeName, phaseName, handler);
    };
}

module.exports = InteractionSpace;

},{"./interaction_template":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/interactions/interaction_template.js"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/interactions/index.js":[function(require,module,exports){
module.exports = function (swarmEngineApi) {
    let cm = require("callflow");
    const InteractionSpace = require("./InteractionSpace");
    const is = new InteractionSpace(swarmEngineApi);

    $$.interactions = {};
    //cm.createSwarmEngine("interaction", require("./interaction_template"));
    $$.interaction = $$.interactions;

    $$.interactions.attachTo = function (swarmTypeName, interactionDescription) {
        Object.keys(interactionDescription).forEach(phaseName => {
            is.on('*', swarmTypeName, phaseName, interactionDescription[phaseName]);
        });
    };

    $$.interactions.startSwarmAs = function (identity, swarmTypeName, phaseName, ...args) {
        const swarm = swarmEngineApi.startSwarmAs(identity, swarmTypeName, phaseName, ...args);
        let swarmId = swarm.getMeta('swarmId');

        return {
            on: function (interactionDescription) {
                Object.keys(interactionDescription).forEach(phaseName => {
                    is.on(swarmId, swarmTypeName, phaseName, interactionDescription[phaseName]);
                });

                return this;
            },
            off: function (interactionDescription) {
                is.off(interactionDescription);

                return this;
            },
            onReturn: function (callback) {
                is.on(swarmId, swarmTypeName, $$.swarmEngine.RETURN_PHASE_COMMAND, callback);

                return this;
            }
        }
    };

    return is;
};

},{"./InteractionSpace":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/interactions/InteractionSpace.js","callflow":false}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/interactions/interaction_template.js":[function(require,module,exports){
exports.getTemplateHandler = function (swarmEngineApi) {

    return {
        createForObject: function (valueObject, thisObject, localId) {
            let cm = require("callflow");

            let swarmFunction = function (destinationContext, phaseName, ...args) {
                //make the execution at level 0  (after all pending events) and wait to have a swarmId
                ret.observe(function () {
                    swarmEngineApi.sendSwarm(valueObject, $$.swarmEngine.EXECUTE_PHASE_COMMAND, destinationContext, phaseName, args);
                }, null, null);
                ret.notify();
                return thisObject;
            };

            function off() {
                const swarmId = valueObject.getMeta('swarmId');
                const swarmTypeName = valueObject.getMeta('swarmTypeName');

                swarmEngineApi.off(swarmId, swarmTypeName);
            }


            let ret = cm.createStandardAPIsForSwarms(valueObject, thisObject, localId);

            ret.swarm = swarmFunction;
            ret.swarmAs = swarmFunction;
            ret.off = off;

            delete ret.home;
            delete ret.onReturn;
            delete ret.onResult;

            delete ret.asyncReturn;
            delete ret.return;

            delete ret.autoInit;

            return ret;
        }
    }
};

},{"callflow":false}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/InnerIsolatePowerCord.js":[function(require,module,exports){
(function (global){(function (){
function InnerIsolatePowerCord() {

    let setterTransfer;

    function transfer(...args) {

        args = args.map(arg => {
            if(arg.buffer) {
                // transforming UInt8Array to ArrayBuffer
                arg = arg.buffer;
            }

            return arg;
        });

        return setterTransfer(...args);
    }

    Object.defineProperty(this, "transfer", {
        set: (fn) => {
            setterTransfer = fn;
        }, get: () => {
            return setterTransfer ? transfer : undefined;
        }
    });

    this.sendSwarm = function (swarmSerialization) {
        try{
            if(swarmSerialization instanceof ArrayBuffer) {
                swarmSerialization = global.createCopyIntoExternalCopy(new Uint8Array(swarmSerialization));
            }

            returnSwarm.apply(undefined, [null, swarmSerialization])
                .catch((err) => {
                    console.log(err);
                })
        }catch(err){
           console.log(err);
        }

    };

}

module.exports = InnerIsolatePowerCord;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/InnerThreadPowerCord.js":[function(require,module,exports){
function InnerThreadPowerCord() {
    const worker_threads = 'worker_threads';
    const {parentPort} = require(worker_threads);

    this.sendSwarm = function (swarmSerialization) {
        parentPort.postMessage(swarmSerialization);
    };

}

module.exports = InnerThreadPowerCord;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/OuterIsolatePowerCord.js":[function(require,module,exports){
function OuterIsolatePowerCord(energySource, numberOfWires = 1, apis) { // seed or array of constitution bundle paths
    const syndicate = require('syndicate');
    const bootScripts = require('../bootScripts');
    const pskIsolatesModuleName = "pskisolates";
    const pskisolates = require(pskIsolatesModuleName);
    let pool = null;


    function connectToEnergy() {
        const WorkerStrategies = syndicate.WorkerStrategies;

        if(!apis) {
            apis = {};
        }

        if(typeof apis.require === "undefined"){
            apis.require = function(name) {
                console.log('Creating proxy for', name);
                return pskisolates.createDeepReference(require(name));
            };
        }

        const config = {
            bootScript: bootScripts.getIsolatesBootScript(),
            maximumNumberOfWorkers: numberOfWires,
            workerStrategy: WorkerStrategies.ISOLATES,
            workerOptions: {
                workerData: {
                    constitutions: energySource
                },
                externalApi: apis
            }
        };

        pool = syndicate.createWorkerPool(config, (isolate) => {

            isolate.globalSetSync("getIdentity", () => {
                return superThis.identity;
            });
        });

    }

    let superThis = this;
    connectToEnergy();


    this.sendSwarm = function (swarmSerialization) {
        pool.addTask(swarmSerialization, (err, msg) => {
            if (err instanceof Error) {
                throw err;
            }

            this.transfer(msg.buffer || msg);
        });
    };

}

module.exports = OuterIsolatePowerCord;

},{"../bootScripts":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/index.js","syndicate":false}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/OuterThreadPowerCord.js":[function(require,module,exports){
function OuterThreadPowerCord(threadBootScript, evaluate= false, energySourceSeed, numberOfWires = 1) { // seed or array of constitution bundle paths
    const syndicate = require('syndicate');
    let pool = null;
    let self = this;

    function connectToEnergy() {
        const config = {
            maximumNumberOfWorkers: numberOfWires,
            workerStrategy: syndicate.WorkerStrategies.THREADS,
            bootScript: threadBootScript,
            workerOptions: {
                // cwd: process.env.DOMAIN_WORKSPACE,
                eval: evaluate,
                env: {
                    IDENTITY: self.identity
                },
                workerData: {
                    constitutionSeed: energySourceSeed
                }
            }
        };

        pool = syndicate.createWorkerPool(config);

    }

    this.sendSwarm = function (swarmSerialization) {
        pool.addTask(swarmSerialization, (err, msg) => {
            if (err instanceof Error) {
                throw err;
            }

            this.transfer(msg.buffer || msg);
        });
    };

    return new Proxy(this, {
        set(target, p, value, receiver) {
            target[p] = value;
            if(p === 'identity') {
                connectToEnergy();
            }
        }
    })
}

module.exports = OuterThreadPowerCord;

},{"syndicate":false}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/RemoteChannelPairPowerCord.js":[function(require,module,exports){
const outbound = "outbound";
const inbound = "inbound";

function RemoteChannelPairPowerCord(host, channelName, receivingHost, receivingChannelName){

    receivingHost = receivingHost || host;
    receivingChannelName = receivingChannelName || generateChannelName();

    function setup(){
        //injecting necessary http methods
        require("../../psk-http-client");

        //this should be a channel that exists... we don't try to create
        $$.remote.registerHttpChannelClient(outbound, host, channelName, {autoCreate: false});
        $$.remote[outbound].setSenderMode();

        //maybe instead of receivingChannelName we sould use our identity? :-??
        $$.remote.registerHttpChannelClient(inbound, receivingHost, receivingChannelName, {autoCreate: true});
        $$.remote[inbound].setReceiverMode();

        $$.remote[inbound].on("*", "*", "*", function (err, swarmSerialization){
            const swarmUtils = require("swarmutils");
            const SwarmPacker = swarmUtils.SwarmPacker;
            let header = SwarmPacker.getHeader(swarmSerialization);
            if(header.swarmTarget === $$.remote[inbound].getReceiveAddress() && startedSwarms[header.swarmId] === true){
                //it is a swarm that we started
                let message = swarmUtils.OwM.prototype.convert(SwarmPacker.unpack(swarmSerialization));
                //we set the correct target
                message.setMeta("target", identityOfOurSwarmEngineInstance);
                //... and transfer to our swarm engine instance
                self.transfer(SwarmPacker.pack(message, SwarmPacker.getSerializer(header.serializationType)));
            }else{
                self.transfer(swarmSerialization);
            }
        });
    }

    let identityOfOurSwarmEngineInstance;
    let startedSwarms = {};
    const self = this;
    this.sendSwarm = function (swarmSerialization) {
        const swarmUtils = require("swarmutils");
        const SwarmPacker = swarmUtils.SwarmPacker;
        let header = SwarmPacker.getHeader(swarmSerialization);
        let message = swarmUtils.OwM.prototype.convert(SwarmPacker.unpack(swarmSerialization));

        if(typeof message.publicVars === "undefined"){
            startedSwarms[message.getMeta("swarmId")] = true;

            //it is the start of swarm...
            if(typeof identityOfOurSwarmEngineInstance === "undefined"){
                identityOfOurSwarmEngineInstance = message.getMeta("homeSecurityContext");
            }
            //we change homeSecurityContext with a url in order to get back the swarm when is done.
            message.setMeta("homeSecurityContext", $$.remote[inbound].getReceiveAddress());
            //send the updated version of it
            $$.remote[outbound].sendSwarm(SwarmPacker.pack(message, SwarmPacker.getSerializer(header.serializationType)));
        }else{
            //the swarm was not started from our pair swarm engine so we just send it
            $$.remote[outbound].sendSwarm(swarmSerialization);
        }
    };

    function generateChannelName(){
        return Math.random().toString(36).substr(2, 9);
    }

    return new Proxy(this, {
        set(target, p, value, receiver) {
            target[p] = value;
            if(p === 'identity') {
                setup();
            }
        }
    });
}

module.exports = RemoteChannelPairPowerCord;
},{"../../psk-http-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/index.js","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/RemoteChannelPowerCord.js":[function(require,module,exports){
const inbound = "inbound";

function RemoteChannelPowerCord(receivingHost, receivingChannelName){

    receivingHost = receivingHost || host;
    receivingChannelName = receivingChannelName || generateChannelName();

    let setup = ()=>{
        //injecting necessary http methods
        require("../../psk-http-client");

        //maybe instead of receivingChannelName we sould use our identity? :-??
        $$.remote.registerHttpChannelClient(inbound, receivingHost, receivingChannelName, {autoCreate: true});
        $$.remote[inbound].setReceiverMode();

        this.on("*", "*", "*", (err, result)=>{
            if(!err){
                console.log("We got a swarm for channel");
                this.transfer(result);
            }else{
                console.log("Got an error from our channel", err);
            }
        });
    };

    this.on = function(swarmId, swarmName, swarmPhase, callback){
        $$.remote[inbound].on(swarmId, swarmName, swarmPhase, callback);
    };

    this.off = function(swarmId, swarmName, swarmPhase, callback){

    };

    this.sendSwarm = function (swarmSerialization) {
        const SwarmPacker = require("swarmutils").SwarmPacker;
        let header = SwarmPacker.getHeader(swarmSerialization);
        let target = header.swarmTarget;
        console.log("Sending swarm to", target);
        //test if target is an url... else complain
        if(true){
            $$.remote.doHttpPost(target, swarmSerialization, (err, res)=>{

            });
        }else{

        }
    };

    function generateChannelName(){
        return Math.random().toString(36).substr(2, 9);
    }

    return new Proxy(this, {
        set(target, p, value, receiver) {
            target[p] = value;
            if(p === 'identity') {
                setup();
            }
        }
    });
}

module.exports = RemoteChannelPowerCord;
},{"../../psk-http-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/index.js","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/SmartRemoteChannelPowerCord.js":[function(require,module,exports){
(function (Buffer){(function (){
const inbound = "inbound";

function SmartRemoteChannelPowerCord(communicationAddrs, receivingChannelName, zeroMQAddress) {

    //here are stored, for later use, fav hosts for different identities
    const favoriteHosts = {};
    let receivingHost = Array.isArray(communicationAddrs) && communicationAddrs.length > 0 ? communicationAddrs[0] : "http://127.0.0.1";
    receivingChannelName = receivingChannelName || generateChannelName();

    function testIfZeroMQAvailable(suplimentaryCondition){
        let available = true;
        let zmqModule;
        try{
            let zmqName = "zeromq";
            zmqModule = require(zmqName);
        }catch(err){
            console.log("Zeromq not available at this moment.");
        }
        available = typeof zmqModule !== "undefined";
        if(typeof suplimentaryCondition !== "undefined"){
            available = available && suplimentaryCondition;
        }
        return available;
    }

    let setup = () => {
        //injecting necessary http methods
        require("../../psk-http-client");

        const opts = {autoCreate: true, enableForward: testIfZeroMQAvailable(typeof zeroMQAddress !== "undefined"), publicSignature: "none"};

        console.log(`\n[***] Using channel "${receivingChannelName}" on "${receivingHost}".\n`);
        //maybe instead of receivingChannelName we sould use our identity? :-??
        $$.remote.registerHttpChannelClient(inbound, receivingHost, receivingChannelName, opts);
        $$.remote[inbound].setReceiverMode();

        function toArrayBuffer(buffer) {
            const ab = new ArrayBuffer(buffer.length);
            const view = new Uint8Array(ab);
            for (let i = 0; i < buffer.length; ++i) {
                view[i] = buffer[i];
            }
            return ab;
        }


        if (testIfZeroMQAvailable(typeof zeroMQAddress !== "undefined")) {
            //let's connect to zmq
            const reqFactory = require("psk-apihub").getVMQRequestFactory(receivingHost, zeroMQAddress);
            reqFactory.receiveMessageFromZMQ($$.remote.base64Encode(receivingChannelName), opts.publicSignature, (...args) => {
                console.log("zeromq connection established");
            }, (channelName, swarmSerialization) => {
                console.log("Look", channelName, swarmSerialization);
                handlerSwarmSerialization(swarmSerialization);
            });
        } else {
            $$.remote[inbound].on("*", "*", "*", (err, swarmSerialization) => {
                if (err) {
                    console.log("Got an error from our channel", err);
                    return;
                }

                if(Buffer && Buffer.isBuffer(swarmSerialization)){
                    swarmSerialization = toArrayBuffer(swarmSerialization);
                }

                handlerSwarmSerialization(swarmSerialization);
            });
        }
    };

    /* this.on = function(swarmId, swarmName, swarmPhase, callback){
         $$.remote[inbound].on(swarmId, swarmName, swarmPhase, callback);
     };

     this.off = function(swarmId, swarmName, swarmPhase, callback){

     };*/

    function getMetaFromIdentity(identity){
        const vRegex = /([a-zA-Z0-9]*|.)*\/agent\/([a-zA-Z0-9]+(\/)*)+/g;

        if(!identity.match(vRegex)){
            throw new Error("Invalid format. (Eg. domain[.subdomain]*/agent/[organisation/]*agentId)");
        }

        const separatorKeyword = "/agent/";
        let domain;
        let agentIdentity;

        const splitPoint = identity.indexOf(separatorKeyword);
        if(splitPoint !== -1){
            domain = identity.slice(0, splitPoint);
            agentIdentity = identity.slice(splitPoint+separatorKeyword.length);
        }

        return {domain, agentIdentity};
    }

    function handlerSwarmSerialization(swarmSerialization) {
        const swarmUtils = require("swarmutils");
        const SwarmPacker = swarmUtils.SwarmPacker;
        let header = SwarmPacker.getHeader(swarmSerialization);
        if (header.swarmTarget === $$.remote[inbound].getReceiveAddress() && startedSwarms[header.swarmId] === true) {
            //it is a swarm that we started
            let message = swarmUtils.OwM.prototype.convert(SwarmPacker.unpack(swarmSerialization));
            //we set the correct target
            message.setMeta("target", identityOfOurSwarmEngineInstance);
            //... and transfer to our swarm engine instance
            self.transfer(SwarmPacker.pack(message, SwarmPacker.getSerializer(header.serializationType)));
        } else {
            self.transfer(swarmSerialization);
        }
    }

    let identityOfOurSwarmEngineInstance;
    let startedSwarms = {};
    const self = this;
    this.sendSwarm = function (swarmSerialization) {
        const swarmUtils = require("swarmutils");
        const SwarmPacker = swarmUtils.SwarmPacker;
        let header = SwarmPacker.getHeader(swarmSerialization);
        let message = swarmUtils.OwM.prototype.convert(SwarmPacker.unpack(swarmSerialization));

        if (typeof message.publicVars === "undefined") {
            startedSwarms[message.getMeta("swarmId")] = true;

            //it is the start of swarm...
            if (typeof identityOfOurSwarmEngineInstance === "undefined") {
                identityOfOurSwarmEngineInstance = message.getMeta("homeSecurityContext");
            }
            //we change homeSecurityContext with a url in order to get back the swarm when is done.
            message.setMeta("homeSecurityContext", $$.remote[inbound].getReceiveAddress());

            swarmSerialization = SwarmPacker.pack(message, SwarmPacker.getSerializer(header.serializationType));
        }

        let target = header.swarmTarget;
        console.log("Sending swarm to", target);
        const urlRegex = new RegExp(/^(www|http:|https:)+[^\s]+[\w]/);

        if (urlRegex.test(target)) {
            $$.remote.doHttpPost(target, swarmSerialization, (err, res) => {
                if (err) {
                    console.log(err);
                }
            });
        } else {
            deliverSwarmToRemoteChannel(target, swarmSerialization, 0);
        }
    };

    function deliverSwarmToRemoteChannel(target, swarmSerialization, remoteIndex) {
        let identityMeta;
        try{
            identityMeta = getMetaFromIdentity(target);
        }catch(err){
            //identityMeta = {};
            console.log(err);
        }

        if (remoteIndex >= communicationAddrs.length) {
            //end of the line
            console.log(`Unable to deliver swarm to target "${target}" on any of the remote addresses provided.`);
            return;
        }
        const currentAddr = communicationAddrs[remoteIndex];
        //if we don't have a fav host for target then lets start discovery process...
        const remoteChannelAddr = favoriteHosts[identityMeta.domain] || [currentAddr, "send-message/", $$.remote.base64Encode(identityMeta.domain) + "/"].join("");

        $$.remote.doHttpPost(remoteChannelAddr, swarmSerialization, (err, res) => {
            if (err) {
                setTimeout(() => {
                    deliverSwarmToRemoteChannel(target, swarmSerialization, ++remoteIndex);
                }, 10);
            } else {
                //success: found fav host for target
                favoriteHosts[identityMeta.domain] = remoteChannelAddr;
                console.log("Found our fav", remoteChannelAddr, "for target", target);
            }
        });
    }

    function generateChannelName() {
        return Math.random().toString(36).substr(2, 9);
    }

    return new Proxy(this, {
        set(target, p, value, receiver) {
            target[p] = value;
            if (p === 'identity') {
                setup();
            }
            return true;
        }
    });
}

module.exports = SmartRemoteChannelPowerCord;

}).call(this)}).call(this,require("buffer").Buffer)

},{"../../psk-http-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/index.js","buffer":false,"psk-apihub":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/browser/SSAppPowerCord.js":[function(require,module,exports){
/*
	This type of PowerCord can be used from outer and inner SSApp in order to facilitate the SWARM communication
	@param reference can be the parent (SSApp or wallet environment) or the iframe in which the SSApp gets loaded
*/
function SSAppPowerCord(reference){

	this.sendSwarm = function (swarmSerialization){
		//console.log("Sending swarm using", reference);
		reference.postMessage(swarmSerialization, "*");
	};

	let receivedMessageHandler  = (event)=>{
		console.log("SSAppPowerCord caught event", event);
		/*if(event.source !== reference){
			console.log("Not my message to handle");
			return;
		}
		console.log("Message received from ssapp", event.source);
		*/
		let swarmSerialization = event.data;
		this.transfer(swarmSerialization);
	};

	let setupConnection = () => {
		if(typeof window.powerCordHandler === "undefined"){
			//console.log("SSAPP PC listener set up");
			window.powerCordHandler = receivedMessageHandler;
			window.addEventListener("message", window.powerCordHandler);
		}else{
			//console.log("SSAPP handler already set.");
		}
	};

	return new Proxy(this, {
		set(target, p, value, receiver) {
			target[p] = value;
			if(p === 'identity') {
				setupConnection();
			}
			return true;
		}
	});
}

module.exports = SSAppPowerCord;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/swarms/index.js":[function(require,module,exports){
module.exports = function(swarmEngineApi){
    const cm = require("callflow");
    const swarmUtils = require("./swarm_template-se");

    $$.swarms           = cm.createSwarmEngine("swarm", swarmUtils.getTemplateHandler(swarmEngineApi));
    $$.swarm            = $$.swarms;

    $$.swarms.startAs = function(identity, swarmName, ctor, ...params){
        swarmEngineApi.startSwarmAs(identity, swarmName, ctor, ...params);
    };
};
},{"./swarm_template-se":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/swarms/swarm_template-se.js","callflow":false}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/swarms/swarm_template-se.js":[function(require,module,exports){
exports.getTemplateHandler = function (swarmEngine) {
    let cm = require("callflow");

    let beesHealer = require("swarmutils").beesHealer;
    return {
        createForObject: function (valueObject, thisObject, localId) {

            function messageIdentityFilter(valueObject) {
                return valueObject.meta.swarmId;
            }

            let swarmFunction = function (destinationContext, phaseName, ...args) {
                //make the execution at level 0  (after all pending events) and wait to have a swarmId
                ret.observe(function () {
                    swarmEngine.sendSwarm(valueObject, $$.swarmEngine.EXECUTE_PHASE_COMMAND, destinationContext, phaseName, args);
                }, null, null);
                ret.notify();
                return thisObject;
            };

            let asyncReturn = function (err, result) {

                let destinationContext = valueObject.meta[$$.swarmEngine.META_SECURITY_HOME_CONTEXT];
                if (!destinationContext && valueObject.meta[$$.swarmEngine.META_WAITSTACK]) {
                    destinationContext = valueObject.meta[$$.swarmEngine.META_WAITSTACK].pop();
                }
                if (!destinationContext) {
                    destinationContext = valueObject.meta[$$.swarmEngine.META_SECURITY_HOME_CONTEXT];
                }

                const {OwM} = require("swarmutils");
                const swarmClone = OwM.prototype.convert(JSON.parse(JSON.stringify(valueObject)));

                swarmEngine.sendSwarm(swarmClone, $$.swarmEngine.RETURN_PHASE_COMMAND, destinationContext, $$.swarmEngine.RETURN_PHASE_COMMAND, [err, result]);
            };

            function interact(phaseName, ...args) {
                const {OwM} = require("swarmutils");
                const swarmClone = OwM.prototype.convert(JSON.parse(JSON.stringify(valueObject)));
                let destinationContext = valueObject.meta[$$.swarmEngine.META_SECURITY_HOME_CONTEXT];

                swarmEngine.sendSwarm(swarmClone, $$.swarmEngine.EXECUTE_INTERACT_PHASE_COMMAND, destinationContext, phaseName, args);
            }

            function home(err, result) {
                let homeContext = valueObject.meta[$$.swarmEngine.META_SECURITY_HOME_CONTEXT];
                swarmEngine.sendSwarm(valueObject, $$.swarmEngine.RETURN_PHASE_COMMAND, homeContext, $$.swarmEngine.RETURN_PHASE_COMMAND, [err, result]);
            }

            function waitResults(callback, keepAliveCheck, swarm) {
                if (!swarm) {
                    swarm = this;
                }
                if (!keepAliveCheck) {
                    keepAliveCheck = function () {
                        return false;
                    }
                }
                var inner = swarm.getInnerValue();
                if (!inner.meta[$$.swarmEngine.META_WAITSTACK]) {
                    inner.meta[$$.swarmEngine.META_WAITSTACK] = [];
                    inner.meta[$$.swarmEngine.META_WAITSTACK].push($$.HRN_securityContext)
                }
                swarmEngine.waitForSwarm(callback, swarm, keepAliveCheck);
            }


            let ret = cm.createStandardAPIsForSwarms(valueObject, thisObject, localId);

            ret.interact        = interact;
            ret.swarm           = swarmFunction;
            ret.home            = home;
            ret.onReturn        = waitResults;
            ret.onResult        = waitResults;
            ret.asyncReturn     = asyncReturn;
            ret.return          = asyncReturn;

            ret.autoInit = function (someContext) {

            };

            return ret;
        }
    }
};
},{"callflow":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Combos.js":[function(require,module,exports){
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

},{"./lib/BDNS":"/home/travis/build/PrivateSky/privatesky/modules/bdns/lib/BDNS.js"}],"blockchain":[function(require,module,exports){
___DISABLE_OBSOLETE_ZIP_ARCHIVER_WAIT_FOR_BARS = true;
//require("../../../psknode/bundles/pskruntime.js");
var callflowModule = require("callflow");
let assetUtils = require("./blockchainSwarmTypes/asset_swarm_template");
let transactionUtils = require("./blockchainSwarmTypes/transaction_swarm_template");
$$.assets           = callflowModule.createSwarmEngine("asset", assetUtils);
$$.asset            = $$.assets;
$$.transactions     = callflowModule.createSwarmEngine("transaction", transactionUtils);
$$.transaction      = $$.transactions;

module.exports = require('./moduleExports');


},{"./blockchainSwarmTypes/asset_swarm_template":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/blockchainSwarmTypes/asset_swarm_template.js","./blockchainSwarmTypes/transaction_swarm_template":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/blockchainSwarmTypes/transaction_swarm_template.js","./moduleExports":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleExports.js","callflow":false}],"buffer-crc32":[function(require,module,exports){
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

},{"buffer":false}],"dossier":[function(require,module,exports){
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
},{"./lib/RawDossier":"/home/travis/build/PrivateSky/privatesky/modules/dossier/lib/RawDossier.js","overwrite-require":"overwrite-require","pskcrypto":"pskcrypto","swarm-engine":"swarm-engine"}],"double-check":[function(require,module,exports){
/**
 * Generic function used to registers methods such as asserts, logging, etc. on the current context.
 * @param name {String)} - name of the method (use case) to be registered.
 * @param func {Function} - handler to be invoked.
 * @param paramsDescription {Object} - parameters descriptions
 * @param after {Function} - callback function to be called after the function has been executed.
 */
function addUseCase(name, func, paramsDescription, after) {
    var newFunc = func;
    if (typeof after === "function") {
        newFunc = function () {
            const args = Array.from(arguments);
            func.apply(this, args);
            after();
        };
    }

    // some properties should not be overridden
    const protectedProperties = ['addCheck', 'addCase', 'register'];
    if (protectedProperties.indexOf(name) === -1) {
        this[name] = newFunc;
    } else {
        throw new Error('Cant overwrite ' + name);
    }

    if (paramsDescription) {
        this.params[name] = paramsDescription;
    }
}

/**
 * Creates an alias to an existing function.
 * @param name1 {String} - New function name.
 * @param name2 {String} - Existing function name.
 */
function alias(name1, name2) {
    this[name1] = this[name2];
}

/**
 * Singleton for adding various functions for use cases regarding logging.
 * @constructor
 */
function LogsCore() {
    this.params = {};
}

/**
 * Singleton for adding your various functions for asserts.
 * @constructor
 */
function AssertCore() {
    this.params = {};
}

/**
 * Singleton for adding your various functions for checks.
 * @constructor
 */
function CheckCore() {
    this.params = {};
}

/**
 * Singleton for adding your various functions for generating exceptions.
 * @constructor
 */
function ExceptionsCore() {
    this.params = {};
}

/**
 * Singleton for adding your various functions for running tests.
 * @constructor
 */
function TestRunnerCore() {
}

LogsCore.prototype.addCase = addUseCase;
AssertCore.prototype.addCheck = addUseCase;
CheckCore.prototype.addCheck = addUseCase;
ExceptionsCore.prototype.register = addUseCase;

LogsCore.prototype.alias = alias;
AssertCore.prototype.alias = alias;
CheckCore.prototype.alias = alias;
ExceptionsCore.prototype.alias = alias;

// Create modules
var assertObj = new AssertCore();
var checkObj = new CheckCore();
var exceptionsObj = new ExceptionsCore();
var loggerObj = new LogsCore();
var testRunnerObj = new TestRunnerCore();

// Export modules
exports.assert = assertObj;
exports.check = checkObj;
exports.exceptions = exceptionsObj;
exports.logger = loggerObj;
exports.testRunner = testRunnerObj;

// Initialise modules
require("./standardAsserts.js").init(exports, loggerObj);
require("./standardLogs.js").init(exports);
require("./standardExceptions.js").init(exports);
require("./standardChecks.js").init(exports);
require("./runner.js").init(exports);

// Global Uncaught Exception handler.
if (process.on) {
    process.on('uncaughtException', function (err) {
        if (typeof err.isFailedAssert == "undefined") {
            exports.logger.record({
                level: 0,
                message: "double-check has intercepted an uncaught exception",
                stack: err.stack
            });
            exports.assert.forceFailedTest("Uncaught Exception!", err);
        }
    });
}


const fs = require('fs');
const crypto = require('crypto');
const AsyncDispatcher = require('../utils/AsyncDispatcher');
const path = require('path');

function ensureFolderHierarchy(folders, callback) {
    const asyncDispatcher = new AsyncDispatcher(() => {
        callback();
    });

    if (folders.length === 0) {
        return callback();
    }

    asyncDispatcher.dispatchEmpty(folders.length);
    folders.forEach(folder => {
        fs.access(folder, (err) => {
            if (err) {
                fs.mkdir(folder, {recursive: true}, (err) => {
                    if (err) {
                        return callback(err);
                    }

                    asyncDispatcher.markOneAsFinished();
                });
            } else {
                asyncDispatcher.markOneAsFinished();
            }
        });
    });

}

function ensureFilesExist(folders, files, text, callback) {
    if (!Array.isArray(folders)) {
        folders = [folders];
    }

    if (!Array.isArray(files)) {
        files = [files];
    }

    ensureFolderHierarchy(folders, (err) => {
        if (err) {
            return callback(err);
        }

        if (files.length === 0) {
            return callback();
        }

        files.forEach((file, i) => {
            const stream = fs.createWriteStream(file);
            stream.write(text[i]);
            if (i === files.length - 1) {
                return callback();
            }
        });
    });
}


function computeFileHash(filePath, callback) {
    const readStream = fs.createReadStream(filePath);
    const hash = crypto.createHash("sha256");
    readStream.on("data", (data) => {
        hash.update(data);
    });

    readStream.on("close", () => {
        callback(undefined, hash.digest("hex"));
    });
}

function computeFoldersHashes(folders, callback) {
    if (!Array.isArray(folders)) {
        folders = [folders];
    }

    if (folders.length === 0) {
        return callback();
    }

    let hashes = [];
    const asyncDispatcher = new AsyncDispatcher(() => {
        callback(undefined, hashes);
    });

    asyncDispatcher.dispatchEmpty(folders.length);
    folders.forEach(folder => {
        __computeHashRecursively(folder, hashes, (err, hashList) => {
            if (err) {
                return callback(err);
            }

            hashes = hashes.concat(hashList);
            asyncDispatcher.markOneAsFinished();
        });
    });
}

function __computeHashRecursively(folderPath, hashes = [], callback) {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return callback(err);
        }

        if (files.length === 0) {
            return callback(undefined, hashes);
        }

        const asyncDispatcher = new AsyncDispatcher(() => {
            callback(undefined, hashes);
        });

        asyncDispatcher.dispatchEmpty(files.length);
        files.forEach(file => {
            const tempPath = path.join(folderPath, file);
            fs.stat(tempPath, (err, stats) => {
                if (err) {
                    return callback(err);
                }

                if (stats.isFile()) {
                    computeFileHash(tempPath, (err, fileHash) => {
                        if (err) {
                            return callback(err);
                        }

                        hashes.push(fileHash);
                        asyncDispatcher.markOneAsFinished();
                    });
                } else {
                    __computeHashRecursively(tempPath, hashes, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        asyncDispatcher.markOneAsFinished();
                    });
                }
            });
        });
    });
}

function deleteFolderRecursive(folderPath) {
    fs.rmdirSync(folderPath, {recursive: true, maxRetries: 10});
}

function deleteFoldersSync(folders) {
    if (!Array.isArray(folders)) {
        folders = [folders];
    }

    if (folders.length === 0) {
        return;
    }

    folders.forEach(folder => {
        deleteFolderRecursive(folder);
    });
}

function createTestFolder(prefix, cllback) {
    const os = require("os");
    fs.mkdtemp(path.join(os.tmpdir(), prefix), function (err, res) {
        const cleanFolder = function () {
            deleteFolderRecursive(res);
        };
        exports.assert.addCleaningFunction(cleanFolder);
        cllback(err, res);
    });
}

Object.assign(module.exports, {
    deleteFolderRecursive,
    createTestFolder,
    computeFoldersHashes,
    computeFileHash,
    ensureFilesExist,
    deleteFoldersSync
});

},{"../utils/AsyncDispatcher":"/home/travis/build/PrivateSky/privatesky/modules/double-check/utils/AsyncDispatcher.js","./runner.js":"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/runner.js","./standardAsserts.js":"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardAsserts.js","./standardChecks.js":"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardChecks.js","./standardExceptions.js":"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardExceptions.js","./standardLogs.js":"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardLogs.js","crypto":false,"fs":false,"os":false,"path":false}],"key-ssi-resolver":[function(require,module,exports){
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

},{"./lib/BootstrapingService":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/BootstrapingService/index.js","./lib/DSUFactoryRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/index.js","./lib/KeySSIResolver":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIResolver.js","./lib/KeySSIs/CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","./lib/KeySSIs/KeySSIFactory":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIFactory.js","./lib/KeySSIs/SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./lib/constants":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/constants.js","bar":false}],"opendsu":[function(require,module,exports){
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

},{"./moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/overwrite-require/moduleConstants.js","./standardGlobalSymbols.js":"/home/travis/build/PrivateSky/privatesky/modules/overwrite-require/standardGlobalSymbols.js"}],"psk-cache":[function(require,module,exports){
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

},{"./lib/Cache":"/home/travis/build/PrivateSky/privatesky/modules/psk-cache/lib/Cache.js"}],"pskcrypto":[function(require,module,exports){
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
},{"./lib/soundPubSub":"/home/travis/build/PrivateSky/privatesky/modules/soundpubsub/lib/soundPubSub.js"}],"swarm-engine":[function(require,module,exports){
module.exports = {
    initialise:function(...args){
        if(typeof $$.swarmEngine === "undefined"){
            const SwarmEngine = require('./SwarmEngine');
            $$.swarmEngine = new SwarmEngine(...args);
        }else{
            $$.throw("Swarm engine already initialized!");
        }
    },
    OuterIsolatePowerCord: require("./powerCords/OuterIsolatePowerCord"),
    InnerIsolatePowerCord: require("./powerCords/InnerIsolatePowerCord"),
    OuterThreadPowerCord: require("./powerCords/OuterThreadPowerCord"),
    InnerThreadPowerCord: require("./powerCords/InnerThreadPowerCord"),
    RemoteChannelPairPowerCord: require("./powerCords/RemoteChannelPairPowerCord"),
    RemoteChannelPowerCord: require("./powerCords/RemoteChannelPowerCord"),
    SmartRemoteChannelPowerCord:require("./powerCords/SmartRemoteChannelPowerCord"),
    BootScripts: require('./bootScripts')
};

const or = require("overwrite-require");
const browserContexts = [or.constants.BROWSER_ENVIRONMENT_TYPE, or.constants.SERVICE_WORKER_ENVIRONMENT_TYPE];
if (browserContexts.indexOf($$.environmentType) !== -1) {
    module.exports.SSAppPowerCord = require("./powerCords/browser/SSAppPowerCord");
    /*module.exports.IframePowerCord = require("./powerCords/browser/IframePowerCord");
    module.exports.HostPowerCord = require("./powerCords/browser/HostPowerCord");
    module.exports.ServiceWorkerPC = require("./powerCords/browser/ServiceWorkerPC");

    module.exports.OuterWebWorkerPowerCord = require("./powerCords/browser/OuterWebWorkerPowerCord");
    module.exports.InnerWebWorkerPowerCord = require("./powerCords/browser/InnerWebWorkerPowerCord");*/
}

},{"./SwarmEngine":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/SwarmEngine.js","./bootScripts":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/index.js","./powerCords/InnerIsolatePowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/InnerIsolatePowerCord.js","./powerCords/InnerThreadPowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/InnerThreadPowerCord.js","./powerCords/OuterIsolatePowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/OuterIsolatePowerCord.js","./powerCords/OuterThreadPowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/OuterThreadPowerCord.js","./powerCords/RemoteChannelPairPowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/RemoteChannelPairPowerCord.js","./powerCords/RemoteChannelPowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/RemoteChannelPowerCord.js","./powerCords/SmartRemoteChannelPowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/SmartRemoteChannelPowerCord.js","./powerCords/browser/SSAppPowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/browser/SSAppPowerCord.js","overwrite-require":"overwrite-require"}],"swarmutils":[function(require,module,exports){
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

},{"./lib/Combos":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Combos.js","./lib/OwM":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/OwM.js","./lib/Queue":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Queue.js","./lib/SwarmPacker":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/SwarmPacker.js","./lib/TaskCounter":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/TaskCounter.js","./lib/beesHealer":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/beesHealer.js","./lib/path":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/path.js","./lib/pingpongFork":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/pingpongFork.js","./lib/pskconsole":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/pskconsole.js","./lib/safe-uuid":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/safe-uuid.js","./lib/uidGenerator":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/uidGenerator.js","buffer":false}]},{},["/home/travis/build/PrivateSky/privatesky/builds/tmp/testsRuntime.js"])