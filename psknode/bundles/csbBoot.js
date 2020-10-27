csbBootRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/travis/build/PrivateSky/privatesky/builds/tmp/csbBoot.js":[function(require,module,exports){
const or = require('overwrite-require');
or.enableForEnvironment(or.constants.NODEJS_ENVIRONMENT_TYPE);

require("./csbBoot_intermediar");
},{"./csbBoot_intermediar":"/home/travis/build/PrivateSky/privatesky/builds/tmp/csbBoot_intermediar.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/builds/tmp/csbBoot_intermediar.js":[function(require,module,exports){
(function (global){(function (){
global.csbBootLoadModules = function(){ 

	if(typeof $$.__runtimeModules["overwrite-require"] === "undefined"){
		$$.__runtimeModules["overwrite-require"] = require("overwrite-require");
	}

	if(typeof $$.__runtimeModules["psk-cache"] === "undefined"){
		$$.__runtimeModules["psk-cache"] = require("psk-cache");
	}

	if(typeof $$.__runtimeModules["dossier"] === "undefined"){
		$$.__runtimeModules["dossier"] = require("dossier");
	}

	if(typeof $$.__runtimeModules["key-ssi-resolver"] === "undefined"){
		$$.__runtimeModules["key-ssi-resolver"] = require("key-ssi-resolver");
	}
};
if (false) {
	csbBootLoadModules();
}
global.csbBootRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("csbBoot");
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"dossier":"dossier","key-ssi-resolver":"key-ssi-resolver","overwrite-require":"overwrite-require","psk-cache":"psk-cache"}],"/home/travis/build/PrivateSky/privatesky/modules/dossier/lib/RawDossier.js":[function(require,module,exports){
function RawDossier(bar) {
    Object.assign(this, bar);
}

module.exports = RawDossier;

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

},{"./RequestsChain":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/BootstrapingService/RequestsChain.js","opendsu":false}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/ConstDSUFactory.js":[function(require,module,exports){
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

},{"../../../../node_modules/is-buffer/index.js":"/home/travis/build/PrivateSky/privatesky/node_modules/is-buffer/index.js","./SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","pskcrypto":false,"swarmutils":false}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/DSURepresentationNames.js":[function(require,module,exports){
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
},{"./CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","./DSURepresentationNames":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/DSURepresentationNames.js","./KeySSIFactory":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIFactory.js","pskcrypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/OtherKeySSIs/HashLinkSSI.js":[function(require,module,exports){
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
},{"./BrowserSSICage":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/ssiCage/BrowserSSICage.js","./NodeSSICage":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/ssiCage/NodeSSICage.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/overwrite-require/moduleConstants.js":[function(require,module,exports){
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

},{}],"/home/travis/build/PrivateSky/privatesky/node_modules/is-buffer/index.js":[function(require,module,exports){
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

},{}],"dossier":[function(require,module,exports){
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
},{"./lib/RawDossier":"/home/travis/build/PrivateSky/privatesky/modules/dossier/lib/RawDossier.js","overwrite-require":"overwrite-require","pskcrypto":false,"swarm-engine":false}],"key-ssi-resolver":[function(require,module,exports){
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

},{"./lib/BootstrapingService":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/BootstrapingService/index.js","./lib/DSUFactoryRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/DSUFactoryRegistry/index.js","./lib/KeySSIResolver":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIResolver.js","./lib/KeySSIs/CryptoAlgorithmsRegistry":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/CryptoAlgorithmsRegistry.js","./lib/KeySSIs/KeySSIFactory":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/KeySSIFactory.js","./lib/KeySSIs/SSITypes":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/KeySSIs/SSITypes.js","./lib/constants":"/home/travis/build/PrivateSky/privatesky/modules/key-ssi-resolver/lib/constants.js","bar":false}],"overwrite-require":[function(require,module,exports){
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

},{"./lib/Cache":"/home/travis/build/PrivateSky/privatesky/modules/psk-cache/lib/Cache.js"}]},{},["/home/travis/build/PrivateSky/privatesky/builds/tmp/csbBoot.js"])