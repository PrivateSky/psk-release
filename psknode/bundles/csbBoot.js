csbBootRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/travis/build/PrivateSky/privatesky/builds/tmp/csbBoot.js":[function(require,module,exports){
const or = require('overwrite-require');
or.enableForEnvironment(or.constants.NODEJS_ENVIRONMENT_TYPE);

require("./csbBoot_intermediar");
},{"./csbBoot_intermediar":"/home/travis/build/PrivateSky/privatesky/builds/tmp/csbBoot_intermediar.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/builds/tmp/csbBoot_intermediar.js":[function(require,module,exports){
(function (global){
global.csbBootLoadModules = function(){ 

	if(typeof $$.__runtimeModules["overwrite-require"] === "undefined"){
		$$.__runtimeModules["overwrite-require"] = require("overwrite-require");
	}

	if(typeof $$.__runtimeModules["edfs"] === "undefined"){
		$$.__runtimeModules["edfs"] = require("edfs");
	}

	if(typeof $$.__runtimeModules["psk-cache"] === "undefined"){
		$$.__runtimeModules["psk-cache"] = require("psk-cache");
	}

	if(typeof $$.__runtimeModules["dossier"] === "undefined"){
		$$.__runtimeModules["dossier"] = require("dossier");
	}
};
if (false) {
	csbBootLoadModules();
}
global.csbBootRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("csbBoot");
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"dossier":"dossier","edfs":"edfs","overwrite-require":"overwrite-require","psk-cache":"psk-cache"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/FetchBrickTransportStrategy.js":[function(require,module,exports){
(function (Buffer){

function FetchBrickTransportStrategy(initialConfig) {
    const url = initialConfig;
    this.send = (name, data, callback) => {

        fetch(url + "/EDFS/"+name, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            body: data
        }).then(function(response) {
            if(response.status>=400){
                return callback(new Error(`An error occurred ${response.statusText}`))
            }
            return response.json().catch((err) => {
                // This happens when the response is empty
                return {};
            });
        }).then(function(data) {
            callback(null, data)
        }).catch(error=>{
            callback(error);
        });

    };

    this.get = (name, callback) => {
        fetch(url + "/EDFS/"+name,{
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/octet-stream'
            },
        }).then(response=>{
            if(response.status>=400){
                return callback(new Error(`An error occurred ${response.statusText}`))
            }
            return response.arrayBuffer();
        }).then(arrayBuffer=>{
                let buffer = new Buffer(arrayBuffer.byteLength);
                let view = new Uint8Array(arrayBuffer);
                for (let i = 0; i < buffer.length; ++i) {
                    buffer[i] = view[i];
                }

            callback(null, buffer);
        }).catch(error=>{
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
            if(response.status>=400){
                return callback(new Error(`An error occurred ${response.statusText}`))
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
            if(response.status>=400){
                return callback(new Error(`An error occurred ${response.statusText}`))
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

    this.createRawDossier = () => {
        return new RawDossier(endpoint, undefined, cache);
    };

    this.createBar = () => {
        return barModule.createArchive(createArchiveConfig());
    };

    this.bootRawDossier = (seed, callback) => {
        const rawDossier = new RawDossier(endpoint, seed, cache);
        rawDossier.start(err => callback(err, rawDossier));
    };

    this.loadRawDossier = (seed) => {
        return new RawDossier(endpoint, seed, cache);
    };

    this.loadBar = (seed) => {
        return barModule.createArchive(createArchiveConfig(seed));
    };

    this.clone = (seed, callback) => {
        const edfsBrickStorage = require("edfs-brick-storage").create(endpoint);
        const bar = this.loadBar(seed);
        bar.clone(edfsBrickStorage, true, callback);
    };

    this.createWallet = (templateSeed, password, overwrite, callback) => {
        if (typeof overwrite === "function") {
            callback = overwrite;
            overwrite = false;
        }
        const wallet = this.createRawDossier();
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
                let rawDossier = this.loadRawDossier(seed);

                if (!rawDossier) {
                    return callback(new Error("RawDossier is not available"));
                }
                return callback(undefined, rawDossier);

            });
        } else {

            let rawDossier = this.loadRawDossier(walletSeed);

            if (!rawDossier) {
                return callback(new Error("RawDossier is not available"));
            }


            if (typeof password !== "undefined" && password !== null) {
                require("../seedCage").putSeed(walletSeed, password, overwrite, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    callback(undefined, rawDossier);
                });
            } else {
                return callback(undefined, rawDossier);
            }
        }
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

},{"../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/edfs/moduleConstants.js","../seedCage":"/home/travis/build/PrivateSky/privatesky/modules/edfs/seedCage/index.js","./RawDossier":"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/RawDossier.js","bar":false,"bar-fs-adapter":false,"edfs-brick-storage":false,"swarmutils":false}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/Manifest.js":[function(require,module,exports){
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
            return callback(undefined, edfs.loadRawDossier(seed));
        }

        callback(undefined, edfs.loadBar(seed));
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


},{"swarmutils":false}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/RawDossier.js":[function(require,module,exports){
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

},{"./Manifest":"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/Manifest.js","bar":false,"bar-fs-adapter":false,"blockchain":false,"edfs-brick-storage":false,"swarmutils":false}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/moduleConstants.js":[function(require,module,exports){
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
},{"pskcrypto":false,"swarm-engine":false}],"edfs":[function(require,module,exports){
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

},{"./lib/Cache":"/home/travis/build/PrivateSky/privatesky/modules/psk-cache/lib/Cache.js"}]},{},["/home/travis/build/PrivateSky/privatesky/builds/tmp/csbBoot.js"])