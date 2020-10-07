blockchainRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/travis/build/PrivateSky/privatesky/builds/tmp/blockchain_intermediar.js":[function(require,module,exports){
(function (global){
global.blockchainLoadModules = function(){ 

	if(typeof $$.__runtimeModules["blockchain"] === "undefined"){
		$$.__runtimeModules["blockchain"] = require("blockchain");
	}
};
if (false) {
	blockchainLoadModules();
}
global.blockchainRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("blockchain");
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"blockchain":"blockchain"}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/OBFTImplementation.js":[function(require,module,exports){
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

},{"./transactionsUtil":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/transactionsUtil.js","fs":false,"pskcrypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/PulseUtil.js":[function(require,module,exports){
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

},{"pskcrypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/blockchainSwarmTypes/asset_swarm_template.js":[function(require,module,exports){
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
},{"./pskdb":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/index.js","./strategies/consensusAlgortims/consensusAlgoritmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/consensusAlgortims/consensusAlgoritmsRegistry.js","./strategies/historyStorages/historyStoragesRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/historyStorages/historyStoragesRegistry.js","./strategies/networkCommunication/networkCommunicationStrategiesRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/networkCommunication/networkCommunicationStrategiesRegistry.js","./strategies/signatureProvidersRegistry/signatureProvidersRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/signatureProvidersRegistry/signatureProvidersRegistry.js","./strategies/votingStrategies/votingStrategiesRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/votingStrategies/votingStrategiesRegistry.js","./strategies/worldStateCaches/worldStateCacheRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/worldStateCaches/worldStateCacheRegistry.js","pskcrypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/Blockchain.js":[function(require,module,exports){
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
},{"../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleConstants.js","../moduleExports":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleExports.js","./securityParadigms/securityParadigmRegistry":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/securityParadigms/securityParadigmRegistry.js","swarmutils":false}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/pskdb/index.js":[function(require,module,exports){
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

},{"../OBFT/transactionsUtil":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/OBFT/transactionsUtil.js","fs":false,"pskcrypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/blockchain/strategies/consensusAlgortims/consensusAlgoritmsRegistry.js":[function(require,module,exports){
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

},{"../../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleConstants.js","fs":false,"timers":false}],"blockchain":[function(require,module,exports){
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


},{"./blockchainSwarmTypes/asset_swarm_template":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/blockchainSwarmTypes/asset_swarm_template.js","./blockchainSwarmTypes/transaction_swarm_template":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/blockchainSwarmTypes/transaction_swarm_template.js","./moduleExports":"/home/travis/build/PrivateSky/privatesky/modules/blockchain/moduleExports.js","callflow":false}]},{},["/home/travis/build/PrivateSky/privatesky/builds/tmp/blockchain_intermediar.js"])