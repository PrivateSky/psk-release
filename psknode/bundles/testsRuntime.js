testsRuntimeRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/travis/build/PrivateSky/privatesky/builds/tmp/testsRuntime.js":[function(require,module,exports){
const or = require('overwrite-require');
or.enableForEnvironment(or.constants.NODEJS_ENVIRONMENT_TYPE);
require("./testsRuntime_intermediar");
require("double-check");
},{"./testsRuntime_intermediar":"/home/travis/build/PrivateSky/privatesky/builds/tmp/testsRuntime_intermediar.js","double-check":"double-check","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/builds/tmp/testsRuntime_intermediar.js":[function(require,module,exports){
(function (global){
global.testsRuntimeLoadModules = function(){ 

	if(typeof $$.__runtimeModules["overwrite-require"] === "undefined"){
		$$.__runtimeModules["overwrite-require"] = require("overwrite-require");
	}

	if(typeof $$.__runtimeModules["pskcrypto"] === "undefined"){
		$$.__runtimeModules["pskcrypto"] = require("pskcrypto");
	}

	if(typeof $$.__runtimeModules["psk-cache"] === "undefined"){
		$$.__runtimeModules["psk-cache"] = require("psk-cache");
	}

	if(typeof $$.__runtimeModules["edfs"] === "undefined"){
		$$.__runtimeModules["edfs"] = require("edfs");
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

	if(typeof $$.__runtimeModules["soundpubsub"] === "undefined"){
		$$.__runtimeModules["soundpubsub"] = require("soundpubsub");
	}

	if(typeof $$.__runtimeModules["dossier"] === "undefined"){
		$$.__runtimeModules["dossier"] = require("dossier");
	}

	if(typeof $$.__runtimeModules["swarm-engine"] === "undefined"){
		$$.__runtimeModules["swarm-engine"] = require("swarm-engine");
	}
};
if (false) {
	testsRuntimeLoadModules();
}
global.testsRuntimeRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("testsRuntime");
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"blockchain":"blockchain","dossier":"dossier","double-check":"double-check","edfs":"edfs","overwrite-require":"overwrite-require","psk-cache":"psk-cache","pskcrypto":"pskcrypto","soundpubsub":"soundpubsub","swarm-engine":"swarm-engine","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/OBFTImplementation.js":[function(require,module,exports){
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
        barMapDigest: "string",
        readList: "array", //encrypted seeds with public keys
        writeList: "array", //agentIds
    },
    init: function (mountPoint, barMapDigest) {
        this.mountPoint = mountPoint;
        this.barMapDigest = barMapDigest;
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
    addBarAnchor: function (mountPoint, barMapDigest) {
        this.transaction.createAsset("BarAnchor", "init", mountPoint, barMapDigest);
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
(function (setImmediate){
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
}).call(this,require("timers").setImmediate)

},{"../../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleConstants.js","fs":false,"timers":false}],"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/runner.js":[function(require,module,exports){
(function (Buffer,__dirname){
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

}).call(this,{"isBuffer":require("../../../node_modules/is-buffer/index.js")},"/modules/double-check/lib")

},{"../../../node_modules/is-buffer/index.js":"/home/travis/build/PrivateSky/privatesky/node_modules/is-buffer/index.js","./utils/glob-to-regexp":"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/utils/glob-to-regexp.js","child_process":false,"fs":false,"path":false}],"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardAsserts.js":[function(require,module,exports){
(function (global){
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

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
},{}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/FetchBrickTransportStrategy.js":[function(require,module,exports){
(function (Buffer){
function FetchBrickTransportStrategy(initialConfig) {
	const url = initialConfig;
	this.send = (name, data, callback) => {

		fetch(url + "/EDFS/" + name, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/octet-stream'
			},
			body: data
		}).then(function (response) {
			if (response.status >= 400) {
				throw new Error(`An error occurred ${response.statusText}`);
			}
			return response.json().catch((err) => {
				// This happens when the response is empty
				return {};
			});
		}).then(function (data) {
			callback(null, data)
		}).catch(error => {
			callback(error);
		});

	};

	this.get = (name, callback) => {
		fetch(url + "/EDFS/" + name, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/octet-stream'
			},
		}).then(response => {
			if (response.status >= 400) {
				throw new Error(`An error occurred ${response.statusText}`);
			}
			return response.arrayBuffer();
		}).then(arrayBuffer => {
			let buffer = new Buffer(arrayBuffer.byteLength);
			let view = new Uint8Array(arrayBuffer);
			for (let i = 0; i < buffer.length; ++i) {
				buffer[i] = view[i];
			}

			callback(null, buffer);
		}).catch(error => {
			callback(error);
		});
	};

	this.getHashForAlias = (alias, callback) => {
		fetch(url + "/EDFS/getVersions/" + alias, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/octet-stream'
			},
		}).then(response => {
			if (response.status >= 400) {
				throw new Error(`An error occurred ${response.statusText}`);
			}
			return response.json().then(data => {
				callback(null, data);
			}).catch(error => {
				callback(error);
			})
		});
	};

	this.attachHashToAlias = (alias, name, callback) => {
		fetch(url + '/EDFS/attachHashToAlias/' + name, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/octet-stream'
			},
			body: alias
		}).then(response => {
			if (response.status >= 400) {
				throw new Error(`An error occurred ${response.statusText}`);
			}
			return response.json().catch((err) => {
				// This happens when the response is empty
				return {};
			});
		}).then(data => {
			callback(null, data);
		}).catch(error => {
			callback(error);
		})
	}

	this.getLocator = () => {
		return url;
	};
}

//TODO:why we use this?
FetchBrickTransportStrategy.prototype.FETCH_BRICK_TRANSPORT_STRATEGY = "FETCH_BRICK_TRANSPORT_STRATEGY";
FetchBrickTransportStrategy.prototype.canHandleEndpoint = (endpoint) => {
	return endpoint.indexOf("http:") === 0 || endpoint.indexOf("https:") === 0;
};


module.exports = FetchBrickTransportStrategy;

}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/HTTPBrickTransportStrategy.js":[function(require,module,exports){

function HTTPBrickTransportStrategy(endpoint) {
    require("psk-http-client");

    this.send = (name, data, callback) => {
        $$.remote.doHttpPost(endpoint + "/EDFS/" + name, data, (err, brickDigest) => {
            if (err) {
                return callback(err);
            }

            try {
                brickDigest = JSON.parse(brickDigest);
            } catch (e) {}
            callback(undefined, brickDigest);
        });
    };

    this.get = (name, callback) => {
        $$.remote.doHttpGet(endpoint + "/EDFS/" + name, callback);
    };

    this.getHashForAlias = (alias, callback) => {
        $$.remote.doHttpGet(endpoint + "/EDFS/getVersions/" + alias, (err, hashesList) => {
            if(err) {
                return callback(err)
            }

            callback(undefined, JSON.parse(hashesList.toString()))
        });
    };

    this.attachHashToAlias = (alias, name, callback) => {
        $$.remote.doHttpPost(endpoint + "/EDFS/attachHashToAlias/" + name, alias, callback);
    };

    this.getLocator = () => {
        return endpoint;
    };
}

HTTPBrickTransportStrategy.prototype.canHandleEndpoint = (endpoint) => {
    return endpoint.indexOf("http:") === 0 || endpoint.indexOf("https:") === 0;
};

module.exports = HTTPBrickTransportStrategy;

},{"psk-http-client":false}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/brickTransportStrategiesRegistry.js":[function(require,module,exports){
(function (Buffer){
function BrickTransportStrategiesRegistry() {
    const strategies = {};

    this.remove = (transportStrategyName) => {
        strategies[transportStrategyName] = undefined;
    };

    this.add = (transportStrategyName, strategy) => {
        if (typeof strategy.prototype.canHandleEndpoint === "function") {
            strategies[transportStrategyName] = strategy;
        } else {
            throw Error("Missing function from strategy prototype");
        }
    };

    this.get = (endpoint) => {
        if (typeof endpoint !== "string" || endpoint.length === 0) {
            throw Error(`Invalid endpoint ${endpoint}, ${typeof endpoint} ${Buffer.isBuffer(endpoint)}`);
        }

        const strategyName = getStrategyNameFromEndpoint(endpoint);
        if (!strategyName) {
            throw Error(`No strategy available to handle endpoint ${endpoint}`);
        }

        return new strategies[strategyName](endpoint);
    };

    this.has = (transportStrategyName) => {
        return strategies.hasOwnProperty(transportStrategyName);
    };

    function getStrategyNameFromEndpoint(endpoint) {
        for(let key in strategies){
            if (strategies[key] && strategies[key].prototype.canHandleEndpoint(endpoint)) {
                return key;
            }
        }
    }
}

if (!$$.brickTransportStrategiesRegistry) {
    $$.brickTransportStrategiesRegistry = new BrickTransportStrategiesRegistry();
}
}).call(this,{"isBuffer":require("../../../node_modules/is-buffer/index.js")})

},{"../../../node_modules/is-buffer/index.js":"/home/travis/build/PrivateSky/privatesky/node_modules/is-buffer/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/EDFS.js":[function(require,module,exports){
function EDFS(endpoint, options) {
    options = options || {};

    const RawDossier = require("./RawDossier");
    const barModule = require("bar");
    const fsAdapter = require("bar-fs-adapter");
    const constants = require('../moduleConstants');
    const pskPath = require("swarmutils").path;
    const cache = options.cache;

    this.createRawDossier = (callback) => {
        const dossier = new RawDossier(endpoint, undefined, cache);
        dossier.load(err => callback(err, dossier));
    };

    this.createBar = (callback) => {
        const bar = barModule.createArchive(createArchiveConfig());
        bar.load(err => callback(err, bar));
    };

    this.bootRawDossier = (seed, callback) => {
        const rawDossier = new RawDossier(endpoint, seed, cache);
        rawDossier.load((err) => {
            if (err) {
                return callback(err);
            }

            rawDossier.start(err => callback(err, rawDossier));
        })
    };

    this.loadRawDossier = (seed, callback) => {
        const dossier = new RawDossier(endpoint, seed, cache);
        dossier.load((err) => {
            if (err) {
                return callback(err);
            }

            callback(undefined, dossier);
        });
    };

    this.loadBar = (seed, callback) => {
        const bar = barModule.createArchive(createArchiveConfig(seed));
        bar.load((err) => {
            if (err) {
                return callback(err);
            }

            callback(undefined, bar);
        });
    };

    this.clone = (seed, callback) => {
        const edfsBrickStorage = require("edfs-brick-storage").create(endpoint);
        this.loadBar(seed, (err, bar) => {
            if (err) {
                return callback(err);
            }
            bar.clone(edfsBrickStorage, true, callback);
        })
    };

    this.createWallet = (templateSeed, password, overwrite, callback) => {
        if (typeof overwrite === "function") {
            callback = overwrite;
            overwrite = false;
        }
        this.createRawDossier((err, wallet) => {
            if (err) {
                return callback(err);
            }

            wallet.mount(pskPath.ensureIsAbsolute(pskPath.join(constants.CSB.CODE_FOLDER, constants.CSB.CONSTITUTION_FOLDER)), templateSeed, (err => {
                if (err) {
                    return callback(err);
                }

                const seed = wallet.getSeed();
                if (typeof password !== "undefined") {
                    require("../seedCage").putSeed(seed, password, overwrite, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        callback(undefined, seed.toString());
                    });
                } else {
                    callback(undefined, seed.toString());
                }
            }));
        })
    };

    this.loadWallet = function (walletSeed, password, overwrite, callback) {
        if (typeof overwrite === "function") {
            callback = overwrite;
            overwrite = password;
            password = walletSeed;
            walletSeed = undefined;
        }
        if (typeof walletSeed === "undefined") {
            require("../seedCage").getSeed(password, (err, seed) => {
                if (err) {
                    return callback(err);
                }
                this.loadRawDossier(seed, (err, dossier) => {
                    if (err) {
                        return callback(err);
                    }
                    return callback(undefined, dossier);
                });
            });
            return;
        }

        this.loadRawDossier(walletSeed, (err, dossier) => {
            if (err) {
                return callback(err);
            }

            if (typeof password !== "undefined" && password !== null) {
                require("../seedCage").putSeed(walletSeed, password, overwrite, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    callback(undefined, dossier);
                });
            } else {
                return callback(undefined, dossier);
            }
        });
    };

//------------------------------------------------ internal methods -------------------------------------------------
    function createArchiveConfig(seed) {
        const ArchiveConfigurator = barModule.ArchiveConfigurator;
        ArchiveConfigurator.prototype.registerFsAdapter("FsAdapter", fsAdapter.createFsAdapter);
        ArchiveConfigurator.prototype.registerStorageProvider("EDFSBrickStorage", require("edfs-brick-storage").create);
        const archiveConfigurator = new ArchiveConfigurator();
        archiveConfigurator.setFsAdapter("FsAdapter");
        archiveConfigurator.setStorageProvider("EDFSBrickStorage", endpoint);
        archiveConfigurator.setBufferSize(65535);
        archiveConfigurator.setEncryptionAlgorithm("aes-256-gcm");
        archiveConfigurator.setCache(cache);

        if (seed) {
            archiveConfigurator.setSeed(seed);
        } else {
            archiveConfigurator.setSeedEndpoint(endpoint);
        }

        return archiveConfigurator;
    }
}

module.exports = EDFS;

},{"../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/edfs/moduleConstants.js","../seedCage":"/home/travis/build/PrivateSky/privatesky/modules/edfs/seedCage/index.js","./RawDossier":"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/RawDossier.js","bar":false,"bar-fs-adapter":false,"edfs-brick-storage":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/Manifest.js":[function(require,module,exports){
const MANIFEST_PATH = "/manifest";

function Manifest(archive, callback) {
    const pskPath = require("swarmutils").path;
    let manifest;
    let temporary = {};
    let manifestHandler = {};


    manifestHandler.mount = function (path, archiveIdentifier, options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = {persist: true};
        }

        if (typeof options === "undefined") {
            options = {persist: true};
        }
        // if (/\W-_/.test(name) === true) {
        //     return callback(Error("Invalid mount name"));
        // }

        for (let mountingPoint in manifest.mounts) {
            if (pskPath.isSubpath(path, mountingPoint) || pskPath.isSubpath(path, mountingPoint)) {
                return callback(Error(`Mount not allowed. Already exist a mount for ${mountingPoint}`));
            }
        }

        manifest.mounts[path] = archiveIdentifier;
        if (options.persist === true) {
            return persist(callback);
        } else {
            temporary[path] = true;
        }

        callback(undefined);
    };

    manifestHandler.unmount = function (path, callback) {
        if (typeof manifest.mounts[path] === "undefined") {
            return callback(Error(`No mount found at path ${path}`));
        }

        delete manifest.mounts[path];

        if (temporary[path]) {
            delete temporary[path];
        } else {
            persist(callback);
        }
    };

    manifestHandler.getArchiveIdentifier = function (path, callback) {
        if (typeof manifest.mounts[path] === "undefined") {
            return callback(Error(`No mount found at path ${path}`));
        }

        callback(undefined, manifest.mounts[path]);
    };

    manifestHandler.getArchiveForPath = function (path, callback) {
        for (let mountingPoint in manifest.mounts) {
            if (mountingPoint === path) {
                return getArchive(manifest.mounts[mountingPoint], (err, archive) => {
                    if (err) {
                        return callback(err);
                    }

                    return callback(undefined, {prefixPath: mountingPoint, relativePath: "/", archive: archive});
                });
            }

            if (pskPath.isSubpath(path, mountingPoint)) {
                return getArchive(manifest.mounts[mountingPoint], true,(err, archive) => {
                    if (err) {
                        return callback(err);
                    }

                    let remaining = path.substring(mountingPoint.length);
                    remaining = pskPath.ensureIsAbsolute(remaining);
                    return archive.getArchiveForPath(remaining, function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        result.prefixPath = pskPath.join(mountingPoint, result.prefixPath);
                        callback(undefined, result);
                    });
                });
            }
        }

        callback(undefined, {prefixPath: "/", relativePath: path, archive: archive});
    };

    manifestHandler.getMountedDossiers = function (path, callback) {
        const mountedDossiers = [];
        for (let mountPoint in manifest.mounts) {
            if (pskPath.isSubpath(mountPoint, path)) {
                let mountPath = mountPoint.substring(path.length);
                if (mountPath[0] === "/") {
                    mountPath = mountPath.substring(1);
                }
                mountedDossiers.push({
                    path: mountPath.split("/").shift(),
                    identifier: manifest.mounts[mountPoint]
                });
            }
        }

        callback(undefined, mountedDossiers);
    };

    function getArchive(seed, asDossier, callback) {
        if (typeof asDossier === "function") {
            callback = asDossier;
            asDossier = false;
        }
        let edfsModuleName = "edfs";
        let EDFS = require(edfsModuleName);
        EDFS.attachWithSeed(seed, function (err, edfs) {
            if (err) {
                return callback(err);
            }

            if (asDossier) {
                return edfs.loadRawDossier(seed, (err, dossier) => {
                    if (err) {
                        return callback(err);
                    }
                    callback(undefined, dossier);
                })
            }

            edfs.loadBar(seed, (err, bar) => {
                if (err) {
                    return callback(err);
                }

                callback(undefined, bar);
            })
        });
    }

    function persist(callback) {
        archive.writeFile(MANIFEST_PATH, JSON.stringify(manifest), callback);
    }

    function init(callback) {
        archive.readFile(MANIFEST_PATH, (err, manifestContent) => {
            if (err) {
                manifest = {mounts: {}};
            } else {
                try {
                    manifest = JSON.parse(manifestContent.toString());
                } catch (e) {
                    return callback(e);
                }
            }

            callback(undefined, manifestHandler);
        });
    }

    init(callback);
}

module.exports.getManifest = function getManifest(archive, callback) {
    Manifest(archive, callback);
};


},{"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/RawDossier.js":[function(require,module,exports){
function RawDossier(endpoint, seed, cache) {
    const barModule = require("bar");
    const Manifest = require("./Manifest");
    const pskPath = require("swarmutils").path;
    let manifestHandler;
    const bar = createBar(seed);

    this.getSeed = () => {
        return bar.getSeed();
    };

    this.start = (callback) => {
        createBlockchain(bar).start(callback);
    };

    this.load = (callback) => {
        bar.load(callback);
    };

    function getManifest(callback) {
        if (typeof manifestHandler === "undefined") {
            Manifest.getManifest(bar, (err, handler) => {
                if (err) {
                    return callback(err);
                }

                manifestHandler = handler;
                return callback(undefined, manifestHandler);
            });
        } else {
            return callback(undefined, manifestHandler);
        }
    }

    this.addFolder = (fsFolderPath, barPath, options, callback) => {
        const defaultOpts = {encrypt: true, ignoreMounts: true};
        if (typeof options === "function") {
            callback = options;
            options = {};
        }

        Object.assign(defaultOpts, options);
        options = defaultOpts;

        if (options.ignoreMounts === true) {
            bar.addFolder(fsFolderPath, barPath, options, callback);
        } else {
            this.getArchiveForPath(barPath, (err, result) => {
                if (err) {
                    return callback(err);
                }

                result.archive.addFolder(fsFolderPath, result.relativePath, options, callback);
            });
        }
    };

    this.addFile = (fsFilePath, barPath, options, callback) => {
        const defaultOpts = {encrypt: true, ignoreMounts: true};
        if (typeof options === "function") {
            callback = options;
            options = {};
        }

        Object.assign(defaultOpts, options);
        options = defaultOpts;

        if (options.ignoreMounts === true) {
            bar.addFile(fsFilePath, barPath, options, (err, barMapDigest) => callback(err, barMapDigest));
        } else {
            this.getArchiveForPath(barPath, (err, result) => {
                if (err) {
                    return callback(err);
                }

                result.archive.addFile(fsFilePath, result.relativePath, options, callback);
            });
        }
    };

    this.readFile = (fileBarPath, callback) => {
        this.getArchiveForPath(fileBarPath, (err, result) => {
            if (err) {
                return callback(err);
            }

            result.archive.readFile(result.relativePath, callback);
        });
    };

    this.createReadStream = (fileBarPath, callback) => {
        this.getArchiveForPath(fileBarPath, (err, result) => {
            if (err) {
                return callback(err);
            }

            result.archive.createReadStream(result.relativePath, callback);
        });
    };

    this.extractFolder = (fsFolderPath, barPath, callback) => {
        this.getArchiveForPath(barPath, (err, result) => {
            if (err) {
                return callback(err);
            }

            result.archive.extractFolder(fsFolderPath, result.relativePath, callback);
        });
    };

    this.extractFile = (fsFilePath, barPath, callback) => {
        this.getArchiveForPath(barPath, (err, result) => {
            if (err) {
                return callback(err);
            }

            result.archive.extractFile(fsFilePath, result.relativePath, callback);
        });
    };

    this.writeFile = (path, data, options, callback) => {
        const defaultOpts = {encrypt: true, ignoreMounts: true};
        if (typeof options === "function") {
            callback = options;
            options = {};
        }

        Object.assign(defaultOpts, options);
        options = defaultOpts;

        // if (path.split("/").includes(constants.MANIFEST_FILE)) {
        //     return callback(Error("Trying to overwrite the manifest file. This is not allowed"));
        // }


        if (options.ignoreMounts === true) {
            bar.writeFile(path, data, options, callback);
        } else {
            this.getArchiveForPath(path, (err, dossierContext) => {
                if (err) {
                    return callback(err);
                }
                if (dossierContext.readonly === true) {
                    return callback(Error("Tried to write in a readonly mounted RawDossier"));
                }

                dossierContext.archive.writeFile(dossierContext.relativePath, data, options, callback);
            });
        }
    };

    this.delete = (barPath, callback) => {
        bar.delete(barPath, callback);
    };

    this.listFiles = (path, options, callback) => {
        if (typeof options === "function") {
            callback = options;
            options = {recursive: true};
        }
        this.getArchiveForPath(path, (err, result) => {
            if (err) {
                return callback(err);
            }

            result.archive.listFiles(result.relativePath, options, (err, files) => {
                if (err) {
                    return callback(err);
                }

                callback(undefined, files);
            });
        });
    };

    this.listFolders = (path, callback) => {
        this.getArchiveForPath(path, (err, result) => {
            if (err) {
                return callback(err);
            }

            result.archive.listFolders(result.relativePath, (err, folders) => {
                if (err) {
                    return callback(err);
                }

                callback(undefined, folders);
            });
        });
    };

    this.readDir = (folderPath, options, callback) => {
        if (typeof options === "function") {
            callback = options;
            options = {
                withFileTypes: false
            };
        }

        const entries = {};
        this.getArchiveForPath(folderPath, (err, result) => {
            if (err) {
                return callback(err);
            }

            result.archive.listFiles(result.relativePath, {recursive: false}, (err, files) => {
                if (err) {
                    return callback(err);
                }

                entries.files = files;

                result.archive.listFolders(result.relativePath, {recursive: false}, (err, folders) => {
                    if (err) {
                        return callback(err);
                    }

                    if (options.withFileTypes) {
                        entries.folders = folders;
                    } else {
                        entries.files = [...entries.files, ...folders];
                    }
                    if (result.archive === bar) {
                        getManifest(listMounts);
                    } else {
                        Manifest.getManifest(result.archive, listMounts);
                    }

                    function listMounts(err, handler) {
                        if (err) {
                            return callback(err);
                        }

                        handler.getMountedDossiers(result.relativePath, (err, mounts) => {
                            if (err) {
                                return callback(err);
                            }
                            if (options.withFileTypes) {
                                entries.mounts = mounts.map(mount => mount.path);
                                entries.mounts = entries.mounts.filter(mount => entries.folders.indexOf(mount) === -1);
                                return callback(undefined, entries);
                            }
                            entries.files = [...entries.files, ...mounts];
                            return callback(undefined, entries.files);
                        });
                    }
                });
            });
        });
    };


    this.mount = (path, archiveIdentifier, options, callback) => {
        if (typeof options === "function") {
            callback = options;
            options = undefined;
        }

        bar.listFiles(path, (err, files) => {
            if (!err && files.length > 0) {
                return callback(Error("Tried to mount in a non-empty folder"));
            }
            getManifest((err, manifestHandler) => {
                if (err) {
                    return callback(err);
                }

                manifestHandler.mount(path, archiveIdentifier, options, callback);
            });
        });
    };

    this.unmount = (path, callback) => {
        getManifest((err, manifestHandler) => {
            if (err) {
                return callback(err);
            }

            manifestHandler.unmount(path, callback);
        });
    };

    this.listMountedDossiers = (path, callback) => {
        this.getArchiveForPath(path, (err, result) => {
            if (err) {
                return callback(err);
            }

            if (result.archive === bar) {
                getManifest(listMounts);
            } else {
                Manifest.getManifest(result.archive, listMounts);
            }

            function listMounts(err, handler) {
                if (err) {
                    return callback(err);
                }

                handler.getMountedDossiers(result.relativePath, callback);
            }
        });
    };


    this.getArchiveForPath = function (path, callback) {
        getManifest((err, handler) => {
            if (err) {
                return callback(err);
            }

            handler.getArchiveForPath(path, callback);
        });
    };


    /**
     * @param {object} validator
     * @param {callback} validator.writeRule Writes validator
     * @param {callback} validator.readRule Reads validator
     */
    this.setValidator = (validator) => {
        bar.setValidator(validator);
    };

    //------------------------------------------------- internal functions ---------------------------------------------
    function createBlockchain(bar) {
        const blockchainModule = require("blockchain");
        const worldStateCache = blockchainModule.createWorldStateCache("bar", bar);
        const historyStorage = blockchainModule.createHistoryStorage("bar", bar);
        const consensusAlgorithm = blockchainModule.createConsensusAlgorithm("direct");
        const signatureProvider = blockchainModule.createSignatureProvider("permissive");
        return blockchainModule.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, true);
    }

    function createBar(localSeed) {
        const createEDFSBrickStorage = require("edfs-brick-storage").create;
        const createFsAdapter = require("bar-fs-adapter").createFsAdapter;

        const ArchiveConfigurator = barModule.ArchiveConfigurator;
        ArchiveConfigurator.prototype.registerStorageProvider("EDFSBrickStorage", createEDFSBrickStorage);
        ArchiveConfigurator.prototype.registerFsAdapter("FsAdapter", createFsAdapter);

        const archiveConfigurator = new ArchiveConfigurator();
        archiveConfigurator.setFsAdapter("FsAdapter");

        archiveConfigurator.setEncryptionAlgorithm("aes-256-gcm");
        archiveConfigurator.setBufferSize(65535);
        if (!localSeed) {
            archiveConfigurator.setStorageProvider("EDFSBrickStorage", endpoint);
            archiveConfigurator.setSeedEndpoint(endpoint);
        } else {
            archiveConfigurator.setSeed(localSeed);
        }
        archiveConfigurator.setCache(cache);

        return barModule.createArchive(archiveConfigurator);
    }
}

module.exports = RawDossier;

},{"./Manifest":"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/Manifest.js","bar":false,"bar-fs-adapter":false,"blockchain":"blockchain","edfs-brick-storage":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/moduleConstants.js":[function(require,module,exports){
const HTTPBrickTransportStrategy = require("./brickTransportStrategies/HTTPBrickTransportStrategy");
HTTPBrickTransportStrategy.prototype.HTTP_BRICK_TRANSPORT_STRATEGY = "HTTP_BRICK_TRANSPORT_STRATEGY";

module.exports = {
    CSB: {
        CODE_FOLDER: "code",
        CONSTITUTION_FOLDER: 'constitution',
        BLOCKCHAIN_FOLDER: 'blockchain',
        APP_FOLDER: 'app',
        DOMAIN_IDENTITY_FILE: 'domain_identity',
        ASSETS_FOLDER: "assets",
        TRANSACTIONS_FOLDER: "transactions",
        APPS_FOLDER: "apps",
        DATA_FOLDER: "data",
        MANIFEST_FILE: "manifest"
    }
};

},{"./brickTransportStrategies/HTTPBrickTransportStrategy":"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/HTTPBrickTransportStrategy.js"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/seedCage/BrowserSeedCage.js":[function(require,module,exports){
(function (Buffer){
const pskcrypto = "pskcrypto";
const crypto = require(pskcrypto);
const storageLocation = "seedCage";
const algorithm = "aes-256-cfb";

/**
 * local storage can't handle properly binary data
 *  https://stackoverflow.com/questions/52419694/how-to-store-uint8array-in-the-browser-with-localstorage-using-javascript
 * @param pin
 * @param callback
 * @returns {*}
 */
function getSeed(pin, callback) {
    let encryptedSeed;
    let seed;
    try {
        encryptedSeed = localStorage.getItem(storageLocation);
        if (encryptedSeed === null || typeof encryptedSeed !== "string" || encryptedSeed.length === 0) {
            return callback(new Error("SeedCage is empty or data was altered"));
        }

        const retrievedEncryptedArr = JSON.parse(encryptedSeed);
        encryptedSeed = new Uint8Array(retrievedEncryptedArr);
        const pskEncryption = crypto.createPskEncryption(algorithm);
        const encKey = crypto.deriveKey(algorithm, pin);
        seed = pskEncryption.decrypt(encryptedSeed, encKey).toString();
    } catch (e) {
        return callback(e);
    }
    callback(undefined, seed);
}

function putSeed(seed, pin, overwrite = false, callback) {
    let encSeed;

    if (typeof overwrite === "function") {
        callback(Error("TODO: api signature updated!"));
    }
    try {
        if (typeof seed === "string") {
            seed = Buffer.from(seed);
        }
        if (typeof seed === "object" && !Buffer.isBuffer(seed)) {
            seed = Buffer.from(seed);
        }

        const pskEncryption = crypto.createPskEncryption(algorithm);
        const encKey = crypto.deriveKey(algorithm, pin);
        encSeed = pskEncryption.encrypt(seed, encKey);
        const encParameters = pskEncryption.getEncryptionParameters();
        encSeed = Buffer.concat([encSeed, encParameters.iv]);
        if (encParameters.aad) {
            encSeed = Buffer.concat([encSeed, encParameters.aad]);
        }

        if (encParameters.tag) {
            encSeed = Buffer.concat([encSeed, encParameters.tag]);
        }

        const encryptedArray =  Array.from(encSeed);
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
    callback(new Error("SeedCage does not exists"));
}

module.exports = {
    check,
    putSeed,
    getSeed
};

}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/seedCage/NodeSeedCage.js":[function(require,module,exports){
(function (Buffer){
const pth = "path";
const path = require(pth);
const os = "os";
const fileSystem = "fs";
const fs = require(fileSystem);
const pskcrypto = "pskcrypto";
const crypto = require(pskcrypto);


const storageLocation = process.env.SEED_CAGE_LOCATION || require(os).homedir();
const storageFileName = ".seedCage";
const seedCagePath = path.join(storageLocation, storageFileName);
const algorithm = "aes-256-cfb";

function getSeed(password, callback) {
    fs.readFile(seedCagePath, (err, encryptedSeed) => {
        if (err) {
            return callback(err);
        }

        let seed;
        try {
            const pskEncryption = crypto.createPskEncryption(algorithm);
            const encKey = crypto.deriveKey(algorithm, password);
            seed = pskEncryption.decrypt(encryptedSeed, encKey).toString();
        } catch (e) {
            return callback(e);
        }

        callback(undefined, seed);
    });
}

function putSeed(seed, password, overwrite = false, callback) {
    fs.mkdir(storageLocation, {recursive: true}, (err) => {
        if (err) {
            return callback(err);
        }

        fs.stat(seedCagePath, (err, stats) => {
            if (!err && stats.size > 0) {
                if (overwrite) {
                    __encryptSeed();
                } else {
                    return callback(Error("Attempted to overwrite existing SEED."));
                }
            } else {
                __encryptSeed();
            }

            function __encryptSeed() {
                let encSeed;
                try {
                    if (typeof seed === "string") {
                        seed = Buffer.from(seed);
                    }

                    if (typeof seed === "object" && !Buffer.isBuffer(seed)) {
                        seed = Buffer.from(seed);
                    }


                    const pskEncryption = crypto.createPskEncryption(algorithm);
                    const encKey = crypto.deriveKey(algorithm, password);
                    encSeed = pskEncryption.encrypt(seed, encKey);
                    const encParameters = pskEncryption.getEncryptionParameters();
                    encSeed = Buffer.concat([encSeed, encParameters.iv]);
                    if (encParameters.aad) {
                        encSeed = Buffer.concat([encSeed, encParameters.aad]);
                    }

                    if (encParameters.tag) {
                        encSeed = Buffer.concat([encSeed, encParameters.tag]);
                    }
                } catch (e) {
                    return callback(e);
                }

                console.log("To be removed later", seed.toString());
                fs.writeFile(seedCagePath, encSeed, callback);
            }
        });
    });
}

function check(callback) {
    fs.access(seedCagePath, callback);
}

module.exports = {
    check,
    putSeed,
    getSeed
};

}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/seedCage/index.js":[function(require,module,exports){
const or = require("overwrite-require");
switch ($$.environmentType) {
    case or.constants.THREAD_ENVIRONMENT_TYPE:
    case or.constants.NODEJS_ENVIRONMENT_TYPE:
        module.exports = require("./NodeSeedCage");
        break;
    case or.constants.BROWSER_ENVIRONMENT_TYPE:
        module.exports = require("./BrowserSeedCage");
        break;
    case or.constants.SERVICE_WORKER_ENVIRONMENT_TYPE:
    case or.constants.ISOLATE_ENVIRONMENT_TYPE:
    default:
        throw new Error("No implementation of SeedCage for this env type.");
}
},{"./BrowserSeedCage":"/home/travis/build/PrivateSky/privatesky/modules/edfs/seedCage/BrowserSeedCage.js","./NodeSeedCage":"/home/travis/build/PrivateSky/privatesky/modules/edfs/seedCage/NodeSeedCage.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/overwrite-require/moduleConstants.js":[function(require,module,exports){
module.exports = {
  BROWSER_ENVIRONMENT_TYPE: 'browser',
  SERVICE_WORKER_ENVIRONMENT_TYPE: 'service-worker',
  ISOLATE_ENVIRONMENT_TYPE: 'isolate',
  THREAD_ENVIRONMENT_TYPE: 'thread',
  NODEJS_ENVIRONMENT_TYPE: 'nodejs'
};

},{}],"/home/travis/build/PrivateSky/privatesky/modules/overwrite-require/standardGlobalSymbols.js":[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

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

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-browser-client.js":[function(require,module,exports){
(function (Buffer){
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

}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-node-client.js":[function(require,module,exports){
(function (Buffer){
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
					return callback(err);
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

}).call(this,require("buffer").Buffer)

},{"./psk-abstract-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-abstract-client.js","buffer":false,"http":false,"https":false,"url":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/PskCrypto.js":[function(require,module,exports){
(function (Buffer){
function PskCrypto() {
    const crypto = require('crypto');
    const utils = require("./utils/cryptoUtils");
    const PskEncryption = require("./PskEncryption");
    const or = require('overwrite-require');

    this.createPskEncryption = (algorithm) => {
        return new PskEncryption(algorithm);
    };

    this.sign = function (privateKey, digest) {
        if (typeof digest === "string") {
            digest = Buffer.from(digest, "hex");
        }

        return crypto.createSign("sha256").update(digest).sign(privateKey);
    };

    this.verify = function (publicKey, signature, digest) {
        if (typeof digest === "string") {
            digest = Buffer.from(digest, "hex");
        }

        if (typeof signature === "string") {
            signature = Buffer.from(signature, "hex");
        }
        return crypto.createVerify("sha256").update(digest).verify(publicKey, signature);
    };

    this.generateKeyPair = (callback) => {
        crypto.generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            }
        }, callback);
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

    this.deriveKey = function deriveKey(algorithm, password) {
        const keylen = utils.getKeyLength(algorithm);
        const salt = utils.generateSalt(password, 32);
        return crypto.pbkdf2Sync(password, salt, 1000, keylen, 'sha256');
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



}).call(this,require("buffer").Buffer)

},{"./PskEncryption":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/PskEncryption.js","./utils/cryptoUtils":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/cryptoUtils.js","buffer":false,"crypto":false,"overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/PskEncryption.js":[function(require,module,exports){
(function (Buffer){
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

        const encData = Buffer.concat([cipher.update(plainData), cipher.final()]);
        if (encryptionIsAuthenticated) {
            tag = cipher.getAuthTag();
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

    this.getEncryptionParameters = () => {
        if (!iv) {
            return;
        }

        return {iv, aad, key, tag};
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
}).call(this,require("buffer").Buffer)

},{"./utils/cryptoUtils":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/cryptoUtils.js","buffer":false,"crypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/DuplexStream.js":[function(require,module,exports){
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
},{"stream":false,"util":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/cryptoUtils.js":[function(require,module,exports){
(function (Buffer){
const crypto = require('crypto');

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

module.exports = {
	createPskHash,
	encode,
	generateSalt,
	PskHash,
	getKeyLength,
	encryptionIsAuthenticated
};


}).call(this,require("buffer").Buffer)

},{"buffer":false,"crypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/isStream.js":[function(require,module,exports){
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

const Queue = require('swarmutils').Queue;

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
},{"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/SwarmEngine.js":[function(require,module,exports){
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
        }, get: () => {
            return powerCord.__identity;
        }
    });

    return powerCord;
}

module.exports = SwarmEngine;
},{"./interactions":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/interactions/index.js","./swarms":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/swarms/index.js","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/BootEngine.js":[function(require,module,exports){
function BootEngine(getSeed, getEDFS, initializeSwarmEngine, runtimeBundles, constitutionBundles) {

	if (typeof getSeed !== "function") {
		throw new Error("getSeed missing or not a function");
	}
	getSeed = promisify(getSeed);

	if (typeof getEDFS !== "function") {
		throw new Error("getEDFS missing or not a function");
	}
	getEDFS = promisify(getEDFS);

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

	const EDFS = require('edfs');
	let edfs;
	const pskPath = require("swarmutils").path;

	const evalBundles = async (bundles, ignore) => {
		const listFiles = promisify(this.rawDossier.listFiles);
		const readFile = promisify(this.rawDossier.readFile);

		let fileList = await listFiles(pskPath.join("/", EDFS.constants.CSB.CODE_FOLDER, EDFS.constants.CSB.CONSTITUTION_FOLDER));
		fileList = bundles.filter(bundle => fileList.includes(bundle) || fileList.includes(`/${bundle}`))
			.map(bundle => pskPath.join("/", EDFS.constants.CSB.CODE_FOLDER, EDFS.constants.CSB.CONSTITUTION_FOLDER, bundle));

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
            const seed = await getSeed();
            edfs = await getEDFS();

            const loadRawDossier = promisify(edfs.loadRawDossier);
            try {
                this.rawDossier = await loadRawDossier(seed);
            } catch (err) {
                console.log(err);
            }

            try {
                await evalBundles(runtimeBundles);
            } catch(err) {
                console.log(err);
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
					reject(err);
				} else {
					resolve(...res);
				}
			});
		});
	}
}

module.exports = BootEngine;

},{"edfs":"edfs","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/IsolateBootScript.js":[function(require,module,exports){

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

    function getSeed(callback){
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

    let edfs;
    function getEDFS(callback){
        const EDFS = require("edfs");
        EDFS.attachWithSeed(getSeed(), (err, edfsInst) => {
            if (err) {
                return callback(err);
            }

            edfs = edfsInst;
            callback(null, edfs);
        });
    }

    function initializeSwarmEngine(callback){
        require('callflow').initialise();
        const swarmEngine = require('swarm-engine');

        swarmEngine.initialise(process.env.IDENTITY);
        const powerCord = new swarmEngine.InnerThreadPowerCord();

        $$.swarmEngine.plug($$.swarmEngine.WILD_CARD_IDENTITY, powerCord);

        parentPort.on('message', (packedSwarm) => {
            powerCord.transfer(packedSwarm);
        });

        edfs.bootRawDossier(workerData.constitutionSeed, (err, csbhandler) =>{
            if(err){
                $$.throwError(err);
            }
            callback();
        });
    }

    const BootEngine = require("./BootEngine.js");

    const booter = new BootEngine(getSeed, getEDFS, initializeSwarmEngine, ["pskruntime.js", "blockchain.js"], ["domain.js"]);

    booter.boot((err) => {
        if(err){
            throw err;
        }
        parentPort.postMessage('ready');
    });
}

boot();
//module.exports = boot.toString();

},{"./BootEngine.js":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/BootEngine.js","callflow":false,"edfs":"edfs","swarm-engine":"swarm-engine"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/domainBootScript.js":[function(require,module,exports){
const path = require('path');
//enabling life line to parent process
require(path.join(process.env.PSK_ROOT_INSTALATION_FOLDER, "psknode/core/utils/pingpongFork.js")).enableLifeLine();

const seed = process.env.PSK_DOMAIN_SEED;
//preventing children to access the env parameter
process.env.PSK_DOMAIN_SEED = undefined;

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

    const bootter = new BootEngine(getSeed, getEDFS, initializeSwarmEngine, ["pskruntime.js", "pskWebServer.js", "edfsBar.js"], ["blockchain.js"]);
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

function getSeed(callback) {
    callback(undefined, self.seed);
}

let self = {seed};

function getEDFS(callback) {
    let EDFS = require("edfs");
    EDFS.attachWithSeed(seed, (err, edfsInst) => {
        if (err) {
            return callback(err);
        }

        self.edfs = edfsInst;
        callback(undefined, self.edfs);
    });
}

function initializeSwarmEngine(callback) {
    const EDFS = require("edfs");
    self.edfs.loadBar(self.seed, (err, bar) => {
        if (err) {
            return callback(err);
        }

        bar.readFile(EDFS.constants.CSB.DOMAIN_IDENTITY_FILE, (err, content) => {
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
    dossier.load(self.seed, "DomainIdentity", function (err, dossierHandler) {
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

                const EDFS = require("edfs");
                const pskPath = require("swarmutils").path;
                self.edfs.loadRawDossier(self.seed, (err, rawDossier) => {
                    if (err) {
                        throw err;
                    }

                    rawDossier.readFile(pskPath.join("/", EDFS.constants.CSB.CODE_FOLDER, EDFS.constants.CSB.CONSTITUTION_FOLDER , "threadBoot.js"), (err, fileContents) => {
                        if (err) {
                            throw err;
                        }

                        agents.forEach(agent => {
                            const agentPC = new se.OuterThreadPowerCord(fileContents.toString(), true, seed);
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

},{"./BootEngine":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/BootEngine.js","dossier":"dossier","edfs":"edfs","path":false,"soundpubsub":"soundpubsub","swarm-engine":"swarm-engine","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/index.js":[function(require,module,exports){
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
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

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
(function (Buffer){
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
            const reqFactory = require("psk-webserver").getVMQRequestFactory(receivingHost, zeroMQAddress);
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

}).call(this,require("buffer").Buffer)

},{"../../psk-http-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/index.js","buffer":false,"psk-webserver":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/browser/HostPowerCord.js":[function(require,module,exports){
function HostPowerCord(parent){

    this.sendSwarm = function (swarmSerialization){
        parent.postMessage(swarmSerialization, "*");
    };

    let receivedMessageHandler  = (event)=>{
        console.log("Message received in iframe",event);
        let swarmSerialization = event.data;
        this.transfer(swarmSerialization);
    };

    let subscribe = () => {
        if(!window.iframePCMessageHandler){
            window.iframePCMessageHandler = receivedMessageHandler;
            window.addEventListener("message",receivedMessageHandler)
        }
    };


    return new Proxy(this, {
        set(target, p, value, receiver) {
            target[p] = value;
            if(p === 'identity') {
                subscribe.call(target);
            }
        }
    });
}


module.exports = HostPowerCord;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/browser/IframePowerCord.js":[function(require,module,exports){
function IframePowerCord(iframe){

    let iframeSrc = iframe.src;

    this.sendSwarm = function (swarmSerialization){
        const SwarmPacker = require("swarmutils").SwarmPacker;

        try {
           SwarmPacker.getHeader(swarmSerialization);
        }
        catch (e) {
            console.error("Could not deserialize swarm");
        }

        if(iframe && iframe.contentWindow){
            iframe.contentWindow.postMessage(swarmSerialization, iframe.src);
        }
        else{
            //TODO: check if the iframe/psk-app should be loaded again
            console.error(`Iframe is no longer available. ${iframeSrc}`);
        }

    };

    let receivedMessageHandler  = (event)=>{

        if (event.source !== window) {
            console.log("Message received in parent", event);
            this.transfer(event.data);
        }

    };

    let subscribe = () => {

        // if(this.identity && this.identity!=="*"){
        // }
        // else{
        //     //TODO: you should use a power cord capable of handling * identities.
        //     console.error("Cannot handle identity '*'. You should use a power cord capable of handling '*' identities.")
        // }

        if(!window.iframePCMessageHandler){
            window.iframePCMessageHandler = receivedMessageHandler;
            window.addEventListener("message",receivedMessageHandler)
        }
    };

    return new Proxy(this, {
        set(target, p, value, receiver) {
            target[p] = value;
            if(p === 'identity') {
                subscribe.call(target);
            }
        }
    });
}

module.exports = IframePowerCord;
},{"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/browser/ServiceWorkerPC.js":[function(require,module,exports){
const UtilFunctions = require("../../utils/utilFunctions");
function ServiceWorkerPC() {
    const channelsManager = require("../../utils/SWChannelsManager").getChannelsManager();
    const SwarmPacker = require("swarmutils").SwarmPacker;
    const server = require("ssapp-middleware").getMiddleware();

    this.sendSwarm = function (swarmSerialization) {
        let header;

        try {
            header = SwarmPacker.getHeader(swarmSerialization);
        } catch (e) {
            console.error("Could not deserialize swarm");
        }

        //TODO
        //verifica header.target pt urmatoarele cazuri:
        // -- daca targetul este un regex de forma domain/agent/agentName atunci trebuie trimis mesajul cu ajutorul lui channelsManager pe canalul Base64(numeDomeniu)
        // -- daca targetul este un regex de forma http/https atunci trebuie verificat daca domeniul fake-uit de service worker coincide cu domeniul din url.
        //          Daca coincid atunci se trimite folosind channelsManagerul local daca nu coincide atunci se face un request http(s) (fetch)
        // -- default ???? - posibil sa fie nevoie sa intoarcem tot in swarm engine... NU SUNT SIGUR!!!

        if(UtilFunctions.isUrl(header.swarmTarget)){
            if (!UtilFunctions.isInMyHosts(header.swarmTarget, server.requestedHosts)) {
                fetch(header.swarmTarget,
                    {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/octet-stream'
                        },
                        redirect: 'follow', // manual, *follow, error
                        referrerPolicy: 'no-referrer', // no-referrer, *client
                        body: swarmSerialization
                    }).then(response => {

                    //TODO
                    //check status codes
                    if (!response.ok) {
                        console.error(`An error occurred:  ${response.status} - ${response.statusText}`);
                    }

                }).catch((err)=>{
                    //TODO
                    //handle error
                    console.log(err);
                });
                return;
            }
        }

        let channelName = UtilFunctions.getChannelName(header.swarmTarget);
        channelsManager.sendMessage(channelName, swarmSerialization, function () {
            //TODO
            //what now?
            console.log("done");
        });
    };

    let receiveSwarmSerialization = (err, message) => {
        if (err) {
            console.log(err);
            if (err.code >= 400 && err.code < 500) {
                return;
            }
        } else {
            //we facilitate the transfer of swarmSerialization to $$.swarmEngine
            this.transfer(message);
        }
        //we need tp subscribe again in order to be called when a new message arrive
        //because no matter why error or message channelManager will remove as from the subs list
        setTimeout(subscribe, 0);
    };

    let subscribe = () => {
        //TODO
        //verifica this.identity pt urmatoarele cazuri:
        // -- daca targetul este un regex de forma domain/agent/agentName atunci trebuie trimis mesajul cu ajutorul lui channelsManager pe canalul Base64(numeDomeniu)
        // -- default ???? - posibil sa fie nevoie sa intoarcem tot in swarm engine... NU SUNT SIGUR!!!


        //let channelName = ""; //based on this.identity when need to extract the domainName from regex domainName/agent/agentname
        let channelName = this.identity.split("/")[0];//temporary test
        channelsManager.receiveMessage(btoa(channelName), receiveSwarmSerialization);
    }

    return new Proxy(this, {
        set(target, p, value, receiver) {
            target[p] = value;
            if (p === 'identity') {
                //when we get our identity
                //setup means first call of subscribe
                subscribe.call(target);
            }
        }
    });
}

module.exports = ServiceWorkerPC;

},{"../../utils/SWChannelsManager":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/utils/SWChannelsManager.js","../../utils/utilFunctions":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/utils/utilFunctions.js","ssapp-middleware":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/swarms/index.js":[function(require,module,exports){
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
},{"callflow":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/utils/SWChannelsManager.js":[function(require,module,exports){
let Queue = require("swarmutils").Queue;
const maxQueueSize = 100;
const TOKEN_PLACEHOLDER = "WEB_TOKEN_PLACEHOLDER";
const queues = {};
const subscribers = {};


function _getSubscribersList(channelName) {
    if (typeof subscribers[channelName] === "undefined") {
        subscribers[channelName] = [];
    }

    return subscribers[channelName];
}

function _getQueue(name) {
    if (typeof queues[name] === "undefined") {
        queues[name] = new Queue();
    }

    return queues[name];
}

function _deliverMessage(subscribers, message) {
    let dispatched = false;
    try {
        while (subscribers.length > 0) {
            let subscriberCallback = subscribers.pop();
            if (!dispatched) {
                subscriberCallback(undefined, message);
                dispatched = true;
            } else {
                let e = new Error("Already dispatched");
                e.code = 403;
                subscriberCallback(e);
            }
        }
    } catch (err) {
        //... some subscribers could have a timeout connection
        if (subscribers.length > 0) {
            _deliverMessage(subscribers, message);
        }
    }

    return dispatched;
}

function createChannel(channelName, callback) {
    if (typeof queues[channelName] !== "undefined") {
        let e = new Error("Channel exists!");
        e.code = 409;
        return callback(e);
    }

    queues[channelName] = new Queue();
    callback(undefined, TOKEN_PLACEHOLDER);
}

const plugs = {};
function sendMessage(channelName, message, callback) {

    let header;
    try{
        const SwarmPacker = require("swarmutils").SwarmPacker;
        header = SwarmPacker.getHeader(message);
    }catch(error){
        let e = new Error("SwarmPacker could not deserialize message");
        e.code = 400;
        callback(e);
    }

    if(typeof plugs[header.swarmTarget] === "undefined"){
        //we need to do this in order to ensure that we have a handler for every fake/real channel that we create
        let PC = require("../powerCords/browser/ServiceWorkerPC");
        plugs[header.swarmTarget] =  new PC();
        $$.swarmEngine.plug(header.swarmTarget, plugs[header.swarmTarget]);
    }

    let queue = _getQueue(channelName);
    let subscribers = _getSubscribersList(channelName);
    let dispatched = false;
    if (queue.isEmpty()) {
        dispatched = _deliverMessage(subscribers, message);
    }

    if (!dispatched) {
        if (queue.length < maxQueueSize) {
            queue.push(message);
            return callback(undefined);

        } else {
            //queue is full
            let e = new Error("Queue is full");
            e.code = 429;
            return callback(e);
        }

    }
    callback(undefined);

}

function receiveMessage(channelName, callback) {
    console.log(`Trying to receive message from channel "${channelName}"`);
    let queue = _getQueue(channelName);
    let message = queue.pop();

    if (!message) {
        _getSubscribersList(channelName).push(callback);
    } else {
        callback(undefined, message);
    }

}

function SWChannelsManager() {

        this.createChannel = createChannel;
        this.sendMessage = sendMessage;
        this.receiveMessage = receiveMessage;
        this.forwardMessage = function (channel, enable, callback) {
            let e = new Error("Unsupported feature");
            e.code = 403;
            callback(e);
        };
        console.log("ChannelsManager initialised!");
}

let channelManagerInstance = new SWChannelsManager();

module.exports.getChannelsManager = function(){
    return channelManagerInstance;
}

},{"../powerCords/browser/ServiceWorkerPC":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/browser/ServiceWorkerPC.js","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/utils/utilFunctions.js":[function(require,module,exports){
const urlReg = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?([a-z0-9]+([\-.]{1}[a-z0-9]+)*\.[a-z]{2,5}|localhost)(:[0-9]{1,5})?(\/.*)?$/gi;
const domainReg = /^([0-9a-zA-Z]*)\/agent\/([0-9a-zA-Z]*)$/gi;
const httpUrlRegex = new RegExp(urlReg);
const domainRegex =  new RegExp(domainReg);


function prepareMessage(req, callback){
    const contentType = req.headers['content-type'];
    if (contentType === 'application/octet-stream') {
        const contentLength = Number.parseInt(req.headers['Content-Length'], 10);

        if(Number.isNaN(contentLength)){
            let e = new Error("Length Required");
            e.code = 411;
            return callback(e);
        }
        else{
            callback(undefined,req.body);
        }

    } else {
        let e = new Error("Wrong message format received!");
        e.code = 500;
        callback(e);
    }
}

function isUrl(url){
    return url.match(httpUrlRegex);
}

function isInMyHosts(swarmTarget, hosts) {
    let url = new URL(swarmTarget);
    let arrayHosts = Array.from(hosts);
    for(let i = 0; i<arrayHosts.length; i++){
        if (url.host === arrayHosts[i]) {
            return true;
        }
    }

    return false;
}

function getChannelName(swarmTarget){

    let channelName;
    //check against domain/agent/agentName;

    if(swarmTarget.match(domainRegex)){
        let regGroups = domainRegex.exec(swarmTarget);
        channelName = btoa(regGroups[2]);
        return channelName;
    }

    //check against urls;
    if (swarmTarget.match(httpUrlRegex)) {

        if (swarmTarget[swarmTarget.length - 1] === "/") {
            swarmTarget = swarmTarget.slice(0, -1);
        }

        let urlFragments = swarmTarget.split("/");
        channelName = urlFragments[urlFragments.length - 1];
    }

    return channelName;
}

function handleOptionsRequest(req,res, next){

    const headers = {};
    // IE8 does not allow domains to be specified, just the *
    headers["Access-Control-Allow-Origin"] = req.headers.origin;
    // headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = true;
    headers["Access-Control-Max-Age"] = '3600'; //one hour
    headers["Access-Control-Allow-Headers"] = `Content-Type, Content-Length, Access-Control-Allow-Origin, User-Agent, ${signatureHeaderName}`;
    res.set(headers);
    res.status(200);
    res.end();
}

module.exports = {prepareMessage, getChannelName, isUrl, isInMyHosts, handleOptionsRequest};

},{}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Combos.js":[function(require,module,exports){
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

function resolve(pth) {
    let pathSegments = pth.split("/");
    let makeAbsolute = pathSegments[0] === "" ? true : false;
    for (let i = 0; i < pathSegments.length; i++) {
        let segment = pathSegments[i];
        if (segment === "..") {
            let j = 1;
            if (i > 0) {
                j = j + 1;
            } else {
                makeAbsolute = true;
            }
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

    return resolve(pth);
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
    if (pth[0] !== "/") {
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

module.exports = {
    normalize,
    join,
    isAbsolute,
    ensureIsAbsolute,
    isSubpath,
    dirname,
    basename,
    relative
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
(function (Buffer){
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

}).call(this,require("buffer").Buffer)

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

},{}],"blockchain":[function(require,module,exports){
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


},{"./blockchainSwarmTypes/asset_swarm_template":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/blockchainSwarmTypes/asset_swarm_template.js","./blockchainSwarmTypes/transaction_swarm_template":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/blockchainSwarmTypes/transaction_swarm_template.js","./moduleExports":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleExports.js","callflow":false}],"dossier":[function(require,module,exports){
const se = require("swarm-engine");
if(typeof $$ === "undefined" || typeof $$.swarmEngine === "undefined"){
    se.initialise();
}

module.exports.load = function(seed, identity, callback){
    const pathName = "path";
    const path = require(pathName);
    const powerCord = new se.OuterThreadPowerCord(path.join(process.env.PSK_ROOT_INSTALATION_FOLDER, "psknode/bundles/threadBoot.js"), false, seed);

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
        //todo implement a way to know when thread is ready
        setTimeout(()=>{
            callback(undefined, handler);
        }, 100);
    });
};
},{"pskcrypto":"pskcrypto","swarm-engine":"swarm-engine"}],"double-check":[function(require,module,exports){
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

},{"../utils/AsyncDispatcher":"/home/travis/build/PrivateSky/privatesky/modules/double-check/utils/AsyncDispatcher.js","./runner.js":"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/runner.js","./standardAsserts.js":"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardAsserts.js","./standardChecks.js":"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardChecks.js","./standardExceptions.js":"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardExceptions.js","./standardLogs.js":"/home/travis/build/PrivateSky/privatesky/modules/double-check/lib/standardLogs.js","crypto":false,"fs":false,"os":false,"path":false}],"edfs":[function(require,module,exports){
require("./brickTransportStrategies/brickTransportStrategiesRegistry");
const constants = require("./moduleConstants");

const or = require("overwrite-require");
const browserContexts = [or.constants.SERVICE_WORKER_ENVIRONMENT_TYPE];
const cache = require('psk-cache').factory();

if (browserContexts.indexOf($$.environmentType) !== -1) {
    $$.brickTransportStrategiesRegistry.add("http", require("./brickTransportStrategies/FetchBrickTransportStrategy"));
} else {
    $$.brickTransportStrategiesRegistry.add("http", require("./brickTransportStrategies/HTTPBrickTransportStrategy"));
}

module.exports = {
    attachToEndpoint(endpoint) {
        const EDFS = require("./lib/EDFS");
        return new EDFS(endpoint, {
            cache
        });
    },
    attachWithSeed(compactSeed, callback) {
        const SEED = require("bar").Seed;
        let seed;
        try {
            seed = new SEED(compactSeed);
        } catch (err) {
            return callback(err);
        }

        callback(undefined, this.attachToEndpoint(seed.getEndpoint()));
    },
    attachWithPassword(password, callback) {
        require("./seedCage").getSeed(password, (err, seed) => {
            if (err) {
                return callback(err);
            }

            this.attachWithSeed(seed, callback);
        });
    },
    checkForSeedCage(callback) {
        require("./seedCage").check(callback);
    },
    constants: constants
};

},{"./brickTransportStrategies/FetchBrickTransportStrategy":"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/FetchBrickTransportStrategy.js","./brickTransportStrategies/HTTPBrickTransportStrategy":"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/HTTPBrickTransportStrategy.js","./brickTransportStrategies/brickTransportStrategiesRegistry":"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/brickTransportStrategiesRegistry.js","./lib/EDFS":"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/EDFS.js","./moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/edfs/moduleConstants.js","./seedCage":"/home/travis/build/PrivateSky/privatesky/modules/edfs/seedCage/index.js","bar":false,"overwrite-require":"overwrite-require","psk-cache":"psk-cache"}],"overwrite-require":[function(require,module,exports){
(function (global){
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
            $$.log("Failed to load module ", request, result);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

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
},{"./lib/PskCrypto":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/PskCrypto.js","./lib/utils/DuplexStream":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/DuplexStream.js","./lib/utils/isStream":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/isStream.js","./signsensusDS/ssutil":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/signsensusDS/ssutil.js"}],"soundpubsub":[function(require,module,exports){
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
    module.exports.IframePowerCord = require("./powerCords/browser/IframePowerCord");
    module.exports.HostPowerCord = require("./powerCords/browser/HostPowerCord");
    module.exports.ServiceWorkerPC = require("./powerCords/browser/ServiceWorkerPC");
}

},{"./SwarmEngine":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/SwarmEngine.js","./bootScripts":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/index.js","./powerCords/InnerIsolatePowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/InnerIsolatePowerCord.js","./powerCords/InnerThreadPowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/InnerThreadPowerCord.js","./powerCords/OuterIsolatePowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/OuterIsolatePowerCord.js","./powerCords/OuterThreadPowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/OuterThreadPowerCord.js","./powerCords/RemoteChannelPairPowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/RemoteChannelPairPowerCord.js","./powerCords/RemoteChannelPowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/RemoteChannelPowerCord.js","./powerCords/SmartRemoteChannelPowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/SmartRemoteChannelPowerCord.js","./powerCords/browser/HostPowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/browser/HostPowerCord.js","./powerCords/browser/IframePowerCord":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/browser/IframePowerCord.js","./powerCords/browser/ServiceWorkerPC":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/browser/ServiceWorkerPC.js","overwrite-require":"overwrite-require"}],"swarmutils":[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./lib/Combos":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Combos.js","./lib/OwM":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/OwM.js","./lib/Queue":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Queue.js","./lib/SwarmPacker":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/SwarmPacker.js","./lib/TaskCounter":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/TaskCounter.js","./lib/beesHealer":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/beesHealer.js","./lib/path":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/path.js","./lib/pingpongFork":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/pingpongFork.js","./lib/pskconsole":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/pskconsole.js","./lib/safe-uuid":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/safe-uuid.js","./lib/uidGenerator":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/uidGenerator.js"}]},{},["/home/travis/build/PrivateSky/privatesky/builds/tmp/testsRuntime.js"])