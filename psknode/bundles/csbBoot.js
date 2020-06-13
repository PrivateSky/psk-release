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

	if(typeof $$.__runtimeModules["psk-key-did-resolver"] === "undefined"){
		$$.__runtimeModules["psk-key-did-resolver"] = require("psk-key-did-resolver");
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

},{"dossier":"dossier","edfs":"edfs","overwrite-require":"overwrite-require","psk-cache":"psk-cache","psk-key-did-resolver":"psk-key-did-resolver"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/FetchBrickTransportStrategy.js":[function(require,module,exports){
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
        fetch(url + "/anchoring/getVersions/" + alias, {
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
        fetch(url + '/anchoring/attachHashToAlias/' + name, {
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
    };

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
            } catch (e) {
                return callback(e);
            }
            callback(undefined, brickDigest);
        });
    };

    this.get = (name, callback) => {
        $$.remote.doHttpGet(endpoint + "/EDFS/" + name, callback);
    };

    this.getMultipleBricks = (brickHashes, callback) => {
        let query = "?";
        brickHashes.forEach(brickHash => {
            query += "hashes=" + brickHash + "&";
        });
        $$.remote.doHttpGet(endpoint + "/EDFS/downloadMultipleBricks" + query, callback);
    };

    this.getHashForAlias = (alias, callback) => {
        $$.remote.doHttpGet(endpoint + "/anchoring/getVersions/" + alias, (err, hashesList) => {
            if (err) {
                return callback(err)
            }

            callback(undefined, JSON.parse(hashesList.toString()))
        });
    };

    this.attachHashToAlias = (alias, name, callback) => {
        $$.remote.doHttpPost(endpoint + "/anchoring/attachHashToAlias/" + name, alias, callback);
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
        archiveConfigurator.setBufferSize(1000000);
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
        let mountedDossiers = [];
        for (let mountPoint in manifest.mounts) {
            if (pskPath.isSubpath(mountPoint, path)) {
                let mountPath = mountPoint.substring(path.length);
                if (mountPath[0] === "/") {
                    mountPath = mountPath.substring(1);
                }
                mountedDossiers.push({
                    path: mountPath,
                    identifier: manifest.mounts[mountPoint]
                });
            }
        }

        const mountPaths = mountedDossiers.map(mountedDossier => mountedDossier.path);
        mountedDossiers = mountedDossiers.filter((mountedDossier, index) => {
            return mountPaths.indexOf(mountedDossier.path) === index;
        });

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
                            let mountPaths = mounts.map(mount => mount.path);
                            let folders = mountPaths.filter(mountPath =>  mountPath.split('/').length >= 2);
                            folders = folders.map(mountPath => mountPath.split('/').shift());
                            let mountedDossiers = mountPaths.filter(mountPath => mountPath.split('/').length === 1);
                            mountedDossiers = mountedDossiers.map(mountPath => mountPath.split('/').shift());
                            if (options.withFileTypes) {
                                entries.mounts = mountedDossiers;
                                entries.folders = Array.from(new Set([...entries.folders, ...folders]));
                                entries.mounts = entries.mounts.filter(mount => entries.folders.indexOf(mount) === -1);
                                return callback(undefined, entries);
                            }
                            entries.files = Array.from(new Set([...entries.files, ...mounts, ...folders]));
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
        archiveConfigurator.setBufferSize(1000000);
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

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/BarMapStrategyMixin.js":[function(require,module,exports){
'use strict';

const BarMapStrategyMixin = {
    barMapController: null,
    anchoringEventListener: null,
    conflictResolutionFunction: null,
    decisionFunction: null,
    signingFunction: null,
    cache: null,
    lastHash: null,
    validator: null,

    initialize: function (options) {
        if (typeof options.anchoringEventListener === 'function') {
            this.setAnchoringEventListener(options.anchoringEventListener);
        }

        if (typeof options.decisionFn === 'function') {
            this.setDecisionFunction(options.decisionFn);
        }

        if (typeof options.conflictResolutionFn === 'function') {
            this.setConflictResolutionFunction(options.conflictResolutionFn);
        }

        if (typeof options.signingFn === 'function') {
            this.setSigningFunction(options.signingFn);
        }
    },

    /**
     * @param {BarMapController} controller
     */
    setBarMapController: function (controller) {
        this.barMapController = controller;
    },

    /**
     * @param {callback} callback
     */
    setConflictResolutionFunction: function (fn) {
        this.conflictResolutionFunction = fn;
    },

    /**
     * 
     * @param {callback} listener 
     */
    setAnchoringEventListener: function (listener) {
        this.anchoringEventListener = listener;
    },

    /**
     * @param {callback} fn 
     */
    setSigningFunction: function (fn) {
        this.signingFunction = fn;
    },

    /**
     * @param {callback} fn 
     */
    setDecisionFunction: function (fn) {
        this.decisionFunction = fn;
    },

    /**
     * @param {object} validator 
     */
    setValidator: function (validator) {
        this.validator = validator;
    },

    /**
     * @param {psk-cache.Cache} cache 
     */
    setCache: function (cache) {
        this.cache = cache;
    },

    /**
     * @param {string} key 
     * @return {boolean}
     */
    hasInCache: function (key) {
        if (!this.cache) {
            return false;
        }

        return this.cache.has(key);
    },

    /**
     * @param {string} key 
     * @return {*}
     */
    getFromCache: function (key) {
        if (!this.cache) {
            return;
        }

        return this.cache.get(key);
    },

    /**
     * @param {string} key 
     * @param {*} value 
     */
    storeInCache: function (key, value) {
        if (!this.cache) {
            return;
        }

        this.cache.set(key, value)
    },

    /**
     * 
     * @param {BarMap} barMap 
     * @param {callback} callback 
     */
    ifChangesShouldBeAnchored: function (barMap, callback) {
        if (typeof this.decisionFunction !== 'function') {
            return callback(undefined, true);
        }

        this.decisionFunction(barMap, callback);
    },

    /**
     * @return {string|null}
     */
    getLastHash: function () {
        return this.lastHash;
    },

    afterBarMapAnchoring: function (diff, diffHash, callback) {
        throw new Error('Unimplemented');
    },

    load: function (alias, callback) {
        throw new Error('Unimplemented');
    },

    /**
     * @param {callback} defaultListener
     * @return {callback}
     */
    getAnchoringEventListener: function (defaultListener) {
        let anchoringEventListener = this.anchoringEventListener;
        if (typeof anchoringEventListener !== 'function') {
            anchoringEventListener = defaultListener;
        }

        return anchoringEventListener;
    }
}

module.exports = BarMapStrategyMixin;
},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/DiffStrategy.js":[function(require,module,exports){
'use strict';

const BarMapDiff = require('bar').BarMapDiff;
const BarMapStrategyMixin = require('./BarMapStrategyMixin');

/**
 * @param {object} options
 * @param {callback} options.decisionFn Callback which will decide when to effectively anchor changes
 *                                                              If empty, the changes will be anchored after each operation
 * @param {callback} options.conflictResolutionFn Callback which will handle anchoring conflicts
 *                                                              The default strategy is to reload the BarMap and then apply the new changes
 * @param {callback} options.anchoringCb A callback which is called when the strategy anchors the changes
 * @param {callback} options.signingFn  A function which will sign the new alias
 * @param {callback} callback
 */
function DiffStrategy(options) {
    options = options || {};
    Object.assign(this, BarMapStrategyMixin);

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////

    /**
     * 
     * @param {Array<BarMapDiff} barMapDiffs 
     * @param {callback} callback 
     */
    const createBarMapFromDiffs = (barMapDiffs, callback) => {
        const barMap = this.barMapController.createNewBarMap();
        try {
            for (const barMapDiff of barMapDiffs) {
                barMap.applyDiff(barMapDiff);
            }
        } catch (e) {
            return callback(e);
        }

        callback(undefined, barMap);
    }

    /**
     * @param {Array<string>} hashes 
     * @return {string}
     */
    const createBricksCacheKey = (hashes) => {
        return hashes.join(':');
    };

    /**
     * @param {Array<Brick>} bricks
     * @return {Array<BarMapDiff}
     */
    const createDiffsFromBricks = (bricks) => {
        const diffs = [];
        for (const brick of bricks) {
            const barMap = this.barMapController.createNewBarMap(brick);
            diffs.push(barMap);
        }

        return diffs;
    }

    /**
     * Get the list of BarMapDiffs either from cache
     * or from Brick storage
     * 
     * @param {Array<string>} hashes 
     * @param {callback} callback 
     */
    const getBarMapDiffs = (hashes, callback) => {
        const cacheKey = createBricksCacheKey(hashes);
        if (this.hasInCache(cacheKey)) {
            const barMapDiffs = this.getFromCache(cacheKey);
            return callback(undefined, barMapDiffs);
        }

        this.barMapController.getMultipleBricks(hashes, (err, bricks) => {
            if (err) {
                return callback(err);
            }

            if (hashes.length !== bricks.length) {
                return callback(new Error('Invalid data received'));
            }

            const barMapDiffs = createDiffsFromBricks(bricks);
            this.storeInCache(cacheKey, barMapDiffs);
            callback(undefined, barMapDiffs);
        });
    }

    /**
     * Assemble a final BarMap from several BarMapDiffs
     * after validating the history
     *
     * @param {Array<string>} hashes
     * @param {callback} callback
     */
    const assembleBarMap = (hashes, callback) => {
        this.lastHash = hashes[hashes.length - 1];
        getBarMapDiffs(hashes, (err, barMapDiffs) => {
            if (err) {
                return callback(err);
            }

            this.validator.validate('barMapHistory', barMapDiffs, (err) => {
                if (err) {
                    return callback(err);
                }

                createBarMapFromDiffs(barMapDiffs, callback);
            });
        })
    }


    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////

    this.load = (alias, callback) => {
        this.barMapController.getAliasVersions(alias, (err, versionHashes) => {
            if (err) {
                return callback(err);
            }

            if (!versionHashes.length) {
                return callback(new Error(`No data found for alias <${alias}>`));
            }

            assembleBarMap(versionHashes, callback);
        })
    }


    /**
     * Compact a list of BarMapDiff objects
     * into a single BarMapDiff object
     * 
     * @param {Array<BarMapDiff} diffsList
     * @return {BarMapDiff}
     */
    this.compactDiffs = (diffsList) => {
        const barMap = diffsList.shift();

        while (diffsList.length) {
            const barMapDiff = diffsList.shift();

            barMap.applyDiff(barMapDiff);
        }

        return barMap;
    }

    /**
     * Merge the `diff` object into the current valid
     * BarMap object
     * 
     * @param {BarMapDiff} diff
     * @param {string} diffHash
     * @param {callback} callback
     */
    this.afterBarMapAnchoring = (diff, diffHash, callback) => {
        const validBarMap = this.barMapController.getValidBarMap();
        try {
            validBarMap.applyDiff(diff);
        } catch (e) {
            return callback(e);
        }
        this.lastHash = diffHash;
        callback(undefined, diffHash);
    }

    /**
     * Call the `conflictResolutionFn` if it exists
     * @param {object} conflictInfo
     * @param {BarMap} conflictInfo.barMap The up to date valid BarMap
     * @param {Array<BarMapDiff} conflictInfo.pendingAnchoringDiffs A list of BarMapDiff that were requested for anchoring or failed to anchor
     * @param {Array<BarMapDiff} conflictInfo.newDiffs A list of BarMapDiff objects that haven't been scheduled for anchoring
     * @param {callback} callback
     */
    this.handleConflict = (conflictInfo, callback) => {
        if (typeof this.conflictResolutionFn !== 'function') {
            return callback(conflictInfo.error);
        }

        this.conflictResolutionFn(this.barMapController, {
            validBarMap: conflictInfo.barMap,
            pendingAnchoringDiffs: conflictInfo.pendingAnchoringDiffs,
            newDiffs: conflictInfo.newDiffs,
            error: conflictInfo.error
        }, callback);
    }

    /**
     * Try and fix an anchoring conflict
     * 
     * Merge any "pending anchoring" BarMapDiff objects in a clone
     * of the valid barMap. If merging fails, call the 'conflictResolutionFn'
     * in order to fix the conflict. If merging succeeds, update the "dirtyBarMap"
     * 
     * @param {BarMap} barMap The up to date valid BarMap
     * @param {Array<BarMapDiff} pendingAnchoringDiffs A list of BarMapDiff that were requested for anchoring or failed to anchor
     * @param {Array<BarMapDiff} newDiffs A list of BarMapDiff objects that haven't been scheduled for anchoring
     * @param {callback} callback
     */
    this.reconcile = (barMap, pendingAnchoringDiffs, newDiffs, callback) => {
        // Try and apply the changes on a barMap copy
        const barMapCopy = barMap.clone();

        try {
            for (let i = 0; i < pendingAnchoringDiffs; i++) {
                barMapCopy.applyDiff(pendingAnchoringDiffs[i]);
            }
        } catch (e) {
            return this.handleConflict({
                barMap,
                pendingAnchoringDiffs,
                newDiffs,
                error: e
            }, callback);
        }

        this.barMapController.setDirtyBarMap(barMapCopy);
        callback();
    }

    this.initialize(options);
}

module.exports = DiffStrategy;
},{"./BarMapStrategyMixin":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/BarMapStrategyMixin.js","bar":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/Factory.js":[function(require,module,exports){
'use strict';

const constants = require('../constants');
const DiffStrategy = require('./DiffStrategy');

/**
 * @param {object} options
 */
function Factory(options) {
    options = options || {};

    const factories = {};

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////

    const initialize = () => {
        const builtinStrategies = constants.builtinBarMapStrategies;
        this.registerStrategy(builtinStrategies.DIFF, this.createDiffStrategy);
    }

    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {string} strategyName
     * @param {object} factory
     */
    this.registerStrategy = (strategyName, factory) => {
        factories[strategyName] = factory;
    }

    /**
     * @param {string} strategyName
     * @param {object} options
     * @return {BarMapStrategyMixin}
     */
    this.create = (strategyName, options) => {
        const factory = factories[strategyName];
        options = options || {};
        return factory(options);
    }

    /**
     * @param {object} options
     * @return {DiffStrategy}
     */
    this.createDiffStrategy = (options) => {
        return new DiffStrategy(options);
    }

    initialize();
}

module.exports = Factory;

},{"../constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/constants.js","./DiffStrategy":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/DiffStrategy.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/index.js":[function(require,module,exports){
'use strict';

module.exports = {
    Factory: require('./Factory')
}

},{"./Factory":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/Factory.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BootstrapingService/Protocol/EDFS.js":[function(require,module,exports){
'use strict';

require('edfs');
const EDFSBrickStorage = require('edfs-brick-storage');

function EDFS(options) {
    options = options || {};

    this.endpoint = options.endpoint;

    if (!this.endpoint) {
        throw new Error('EDFS endpoint is required');
    }

    this.edfsDriver = EDFSBrickStorage.create(this.endpoint);


    this.getBrick = (domain, hash, callback) => {
        this.edfsDriver.getBrick(hash, (err, result) => {
            if (err) {
                return callback(err);
            }

            return callback(undefined, result);
        });
    }

    this.getMultipleBricks = (domain, hashes, callback) => {
        this.edfsDriver.getMultipleBricks(hashes, (err, result) => {
            if (err) {
                return callback(err);
            }

            return callback(undefined, result);
        })
    }

    this.putBrick = (domain, brick, callback) => {
        this.edfsDriver.putBrick(brick, (err, result) => {
            if (err) {
                return callback(err);
            }

            return callback(undefined, result);
        });
    }

    this.updateAlias = (alias, value, lastValue, callback) => {
        this.edfsDriver.attachHashToAlias(alias, value, lastValue, (err) => {
            if (err) {
                return callback(err);
            }

            return callback();
        });
    }

    this.getAliasVersions = (alias, callback) => {
        this.edfsDriver.getHashForAlias(alias, (err, result) => {
            if (err) {
                return callback(err);
            }

            return callback(undefined, result);
        });
    }
}

module.exports = EDFS;

},{"edfs":"edfs","edfs-brick-storage":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BootstrapingService/Protocol/index.js":[function(require,module,exports){
'use strict';

const protocols = {
    'EDFS': require('./EDFS')
}

function isValid(protocolName) {
    return Object.keys(protocols).indexOf(protocolName) !== -1;
}

function factory(name, config) {
    config = config || {};
    const ProtocolConstructor = protocols[name];
    return new ProtocolConstructor(config);
}

module.exports = {
    isValid,
    factory
};

},{"./EDFS":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BootstrapingService/Protocol/EDFS.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BootstrapingService/RequestsChain.js":[function(require,module,exports){
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
};

module.exports = RequestsChain;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BootstrapingService/Service.js":[function(require,module,exports){
'use strict';

const Protocol = require('./Protocol');
const RequestsChain = require('./RequestsChain');

function Service(options) {
    options = options || {};

    const brickEndpoints = [];
    const aliasEndpoints = [];

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////
    const initialize = () => {
        if (Array.isArray(options.brickEndpoints)) {
            for (const endpointConfig of options.brickEndpoints) {
                const { endpoint, protocol } = endpointConfig;
                this.addBrickStorageEndpoint(endpoint, protocol);
            }
        }

        if (Array.isArray(options.aliasEndpoints)) {
            for (const endpointConfig of options.aliasEndpoints) {
                const { endpoint, protocol } = endpointConfig;
                this.addAliasingEndpoint(endpoint, protocol);
            }
        }
    };

    /**
     * @param {Array<object>} pool
     * @param {string} endpoint
     * @param {string} name
     */
    const createProtocol = (pool, endpoint, name) => {
        if (!Protocol.isValid(name)) {
            throw new Error(`Invalid protocol: ${name}`);
        }

        const protocol = Protocol.factory(name, {
            endpoint: endpoint
        })

        pool.push({
            endpoint,
            protocol
        });
    }

    /**
     * @param {Array<object>} pool
     * @param {string} favEndpoint
     */
    const getEndpointsSortedByFav = (pool, favEndpoint) => {
        pool.sort((a, b) => {
            if (a.endpoint === favEndpoint) {
                return -1;
            }

            return 0;
        });

        return pool;
    };

    /**
     * @param {string} method
     * @param {Array<object>} endpointsPool
     * @param {string} favEndpoint
     * @param {...} args
     * @return {RequestChain}
     */
    const createRequestsChain = (method, endpointsPool, favEndpoint, ...args) => {
        const requestsChain = new RequestsChain();

        if (favEndpoint) {
            endpointsPool = getEndpointsSortedByFav(endpointsPool, favEndpoint);
        }
        for (const endpointConfig of endpointsPool) {
            const protocol = endpointConfig.protocol;
            requestsChain.add(protocol, method, args);
        }

        return requestsChain;
    };

    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////
    this.addBrickStorageEndpoint = (endpoint, protocolName) => {
        createProtocol(brickEndpoints, endpoint, protocolName);
    }

    this.addAliasingEndpoint = (endpoint, protocolName) => {
        createProtocol(aliasEndpoints, endpoint, protocolName);
    }

    this.getBrick = (favEndpoint, dlDomain, hash, callback) => {
        const requestsChain = createRequestsChain('getBrick', brickEndpoints, favEndpoint, dlDomain, hash);
        requestsChain.execute(callback);
    }

    this.getMultipleBricks = (favEndpoint, dlDomain, hashes, callback) => {
        const requestsChain = createRequestsChain('getMultipleBricks', brickEndpoints, favEndpoint, dlDomain, hashes);
        requestsChain.execute(callback);
    }

    this.putBrick = (favEndpoint, dlDomain, brick, callback) => {
        const requestsChain = createRequestsChain('putBrick', brickEndpoints, favEndpoint, dlDomain, brick);
        requestsChain.execute(callback);
    }

    this.getAliasVersions = (favEndpoint, alias, callback) => {
        const requestsChain = createRequestsChain('getAliasVersions', aliasEndpoints, favEndpoint, alias);
        requestsChain.execute(callback);
    }

    this.updateAlias = (favEndpoint, alias, value, lastValue, callback) => {
        const requestsChain = createRequestsChain('updateAlias', aliasEndpoints, favEndpoint, alias, value, lastValue);
        requestsChain.execute(callback);
    }
    initialize();
}

module.exports = Service;

},{"./Protocol":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BootstrapingService/Protocol/index.js","./RequestsChain":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BootstrapingService/RequestsChain.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BootstrapingService/index.js":[function(require,module,exports){
'use strict';

const Service = require('./Service');

module.exports = {
    Service
};


},{"./Service":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BootstrapingService/Service.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/CryptoAlgorithmsSchemeVersioning.js":[function(require,module,exports){
'use strict';

const CryptoAlgorithmsSchemeVersioning = {
    '1': {
        'hash': 'pskhash',
        'encryption': 'aes-256-gcm',
        'signature': 'pskhash'
    }
}

module.exports = CryptoAlgorithmsSchemeVersioning;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDMixin.js":[function(require,module,exports){
'use strict';

const crypto = require("pskcrypto");
const CryptoAlgorithmsSchemeVersioning = require('./CryptoAlgorithmsSchemeVersioning');

const DIDMixin = {
    url: null,
    KEY_LENGTH: 32,
    options: null,
    dlDomain: null,
    key: null,
    favouriteEndpoint: null,
    version: null,
    hashAlgorithm: null,
    encryptionAlgorithm: null,
    signatureAlgorithm: null,

    /**
     * @param {string|object} url
     * @param {object|undefined} options
     * @param {string} options.version
     * @param {string} options.dlDomain
     * @param {string} options.favouriteEndpoint
     */
    initialize: function (url, options) {
        if (typeof url === 'object') {
            options = url;
            url = undefined;
        }

        this.url = url;
        this.options = options || {};
        this.dlDomain = this.options.dlDomain;
        this.key = this.options.key;
        this.favouriteEndpoint = this.options.favouriteEndpoint;
        this.version = this.options.version;
    },

    /**
     * Choose and set cryptography algorithms
     * based on DID version
     *
     * @throws Error
     */
    setupCryptoAlgorithmsScheme: function () {
        const algorithms = CryptoAlgorithmsSchemeVersioning[this.version];

        if (typeof algorithms !== 'object') {
            throw new Error(`Unable to find crypto algorithms scheme based on version: ${this.version}`);
        }

        this.setEncryptionAlgorithm(algorithms.encryption);
        this.setHashAlgorithm(algorithms.hash);
        this.setSignatureAlgorithm(algorithms.signature);
    },

    /**
     * @return {string}
     */
    getAnchorAlias: function () {
        throw new Error('Unimplemented');
    },

    /**
     * @return {string}
     */
    getDLDomain: function () {
        return this.dlDomain;
    },

    /**
     * @return {string}
     */
    getFavouriteEndpoint: function () {
        return this.favouriteEndpoint;
    },

    /**
     * @return {Buffer}
     */
    getKey: function () {
        return this.key;
    },

    /**
     * @return {string}
     */
    getKeyHash: function () {
        const key = this.getKey();
        let keyHash;

        if (key) {
            keyHash = crypto.pskHash(key, 'hex');
        }

        return keyHash;
    },

    /**
     * @return {string}
     */
    toUrl: function () {
        throw new Error('Unimplemented');
    },

    /**
     * @return {string}
     * @throws Error
     */
    getHashAlgorithm: function () {
        if (!this.hashAlgorithm) {
            this.setupCryptoAlgorithmsScheme();
        }
        return this.hashAlgorithm;
    },

    /**
     * @return {string}
     * @throws Error
     */
    getEncryptionAlgorithm: function () {
        if (!this.encryptionAlgorithm) {
            this.setupCryptoAlgorithmsScheme();
        }
        return this.encryptionAlgorithm;
    },

    /**
     * @return {string}
     * @throws Error
     */
    getSignatureAlgorithm: function () {
        if (!this.encryptionAlgorithm) {
            this.setupCryptoAlgorithmsScheme();
        }
        return this.signatureAlgorithm;
    },

    /**
     * @param {string} alg
     */
    setHashAlgorithm: function (alg) {
        this.hashAlgorithm = alg;
    },

    /**
     * @param {string} alg
     */
    setEncryptionAlgorithm: function (alg) {
        this.encryptionAlgorithm = alg;
    },

    /**
     * @param {string} alg
     */
    setSignatureAlgorithm: function (alg) {
        this.signatureAlgorithm = alg;
    }
}

module.exports = DIDMixin;
},{"./CryptoAlgorithmsSchemeVersioning":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/CryptoAlgorithmsSchemeVersioning.js","pskcrypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDUrl.js":[function(require,module,exports){
'use strict';

/**
 * @param {string|object} url
 * @param {object|undefined} options
 * @param {string} options.dlDomain
 * @param {string} options.favouriteEndpoint
 */
function DIDUrl(url, options) {
    if (typeof url === 'object') {
        options = url;
        url = undefined;
    }

    if (typeof url === 'undefined' && typeof options === 'undefined') {
        throw new Error('An url or options object is required');
    }
    options = options || {};

    this.prefix = options.prefix || 'kdid';
    this.type = null;
    this.segments = [];
    this.hashFragment = null;
    this.validator = options.validator;

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////

    /**
     * Validate state
     * @param {object} validator
     * @param {string} validator.prefix Expected prefix
     * @param {string} validator.type Expected type
     * @param {callback} validator.segments Callback that validates the did segments
     * @throws Error
     */
    const validate = (validator) => {
        if (validator.prefix) {
            if (this.prefix !== validator.prefix) {
                throw new Error(`Invalid did. Expected: ${validator.prefix}`);
            }
        }

        if (validator.type) {
            if (this.type !== validator.type) {
                throw new Error(`Invalid type. Expected: ${validator.type} `);
            }
        }

        if (typeof validator.segments === 'function') {
            if (!validator.segments(this.segments)) {
                throw new Error('Invalid did segments');
            }
        }

    }

    /**
     * @param {string} url
     */
    const parseUrl = (url) => {
        let segments = url.split('#');
        if (segments.length > 1) {
            this.hashFragment = segments.slice(1).join('#');
        }

        segments = segments.shift().split(':');

        const prefix = segments.shift();
        if (prefix !== this.prefix) {
            throw new Error('Not a valid did');
        }

        const type = segments.shift();
        if (!type) {
            throw new Error('Invalid did type');
        }

        this.type = type;

        if (!segments.length) {
            throw new Error('Incomplete did');
        }

        this.segments = segments;
    }

    if (typeof url === 'string') {
        parseUrl(url);
        if (typeof options.validator === 'object') {
            validate(options.validator);
        }
    } else {
        this.type = options.type;
        this.segments = Array.isArray(options.segments) ? options.segments.slice() : [];
        this.hashFragment = options.hashFragment;
    }

    /**
     * @return {Array}
     */
    this.getSegments = () => {
        return this.segments.slice();
    }

    /**
     * @return {string}
     */
    this.getHashFragment = () => {
        return this.hashFragment;
    }

    /**
     * @return {string}
     */
    this.getType = () => {
        return this.type;
    }

    /**
     * @return {string}
     */
    this.toString = () => {
        let url = `${this.prefix}:${this.type}:${this.segments.join(':')}`;

        if (this.hashFragment) {
            url += `#${this.hashFragment}`;
        }

        return url;
    };
}

module.exports = DIDUrl;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/Factory.js":[function(require,module,exports){
'use strict';

const constants = require('../constants');
const DID_VERSION = constants.DID_VERSION;
const didTypes = constants.didTypes;

const DIDUrl = require('./DIDUrl');
const SecretDID = require('./SecretDID');
const ZKDID = require('./ZKDID');

/**
 * @param {object} options
 */
function Factory(options) {
    options = options || {};

    const didVersion = options.version || DID_VERSION
    const urlToTypeMapping = {
        'sa': didTypes.SECRET,
        'alias': didTypes.ZK
    }
    const factories = {};

    const initialize = () => {
        factories[didTypes.SECRET] = createSecretDID;
        factories[didTypes.ZK] = createZKDID;
    };

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {string} url
     * @return {string|undefined}
     */
    const detectTypeFromURL = (url) => {
        let didUrl;
        try {
            didUrl = new DIDUrl(url);
        } catch (e) {
            return;
        }

        const typeIdentifier = didUrl.getType();
        return urlToTypeMapping[typeIdentifier];
    };

    /**
     * @param {string} type
     * @return {function}
     */
    const isValidType = (type) => {
        return typeof factories[type] === 'function';
    }

    /**
     * @param {string} url
     * @param {object} options
     * @param {string} options.key
     * @param {string} options.dlDomain
     * @param {string} options.favouriteEndpoint
     * @return {BaseDID}
     */
    const createSecretDID = (url, options) => {
        options.didFactory = this;
        return new SecretDID(url, options);
    }

    /**
     * @param {string} url
     * @param {object} options
     * @param {string} options.dlDomain
     * @param {string} options.favouriteEndpoint
     * @return {BaseDID}
     */
    const createZKDID = (url, options) => {
        return new ZKDID(url, options);
    }

    initialize();

    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {string} url
     * @param {string} type
     * @param {object} options Parameter required when creating a new DID
     * @param {string} options.key
     * @param {string} options.dlDomain
     * @param {string} options.favouriteEndpoint
     * @return {BaseDID}
     */
    this.create = (url, type, options) => {
        if (typeof type === 'object') {
            options = type;
            type = url;
            url = undefined;
        }

        if (url && typeof type === 'undefined' && typeof options === 'undefined') {
            type = detectTypeFromURL(url);

            if (!type) {
                throw new Error('Invalid URL. Are you trying to create a new DID? Make sure you pass the options object');
            }
        }

        if (!isValidType(type)) {
            throw new Error('Invalid DID type');
        }

        const factoryMethod = factories[type];
        options = options || {};
        if (typeof options.version === 'undefined') {
            options.version = didVersion;
        }

        return factoryMethod(url, options);
    }
}

module.exports = Factory;

},{"../constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/constants.js","./DIDUrl":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDUrl.js","./SecretDID":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/SecretDID.js","./ZKDID":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/ZKDID.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/SecretDID.js":[function(require,module,exports){
(function (Buffer){
'use strict';
const crypto = require("pskcrypto");

const DIDUrl = require('./DIDUrl');
const ZKDID = require('./ZKDID');
const DIDMixin = require('./DIDMixin');

const didTypes = require('../constants').didTypes;

/**
 * @param {string|object} url
 * @param {object|undefined} options
 * @param {string} options.key
 * @param {string} options.dlDomain
 * @param {string} options.favouriteEndpoint
 * @param {string} options.version
 */
function SecretDID(url, options) {
    Object.assign(this, DIDMixin);
    this.initialize(url, options);

    this.key = this.options.key;
    this.zkdid = null;
    this.didFactory = options.didFactory;

    if (!this.didFactory) {
        throw new Error('A DID Factory is required');
    }

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////
    /**
     * Restore DID data from url
     *
     * @param {string} url
     */
    const restoreFromUrl = (url) => {
        const didUrl = new DIDUrl(url, {
            validator: {
                prefix: 'kdid',
                type: 'sa',
                segments: (segments) => {
                    if (segments.length !== 3) {
                        return false;
                    }

                    if (!segments[0].length || !segments[1].length || !segments[2].length) {
                        return false;
                    }

                    return true;
                }
            }
        });

        const segments = didUrl.getSegments();
        this.version = segments.shift();
        this.dlDomain = segments.shift();
        this.key = crypto.pskBase58Decode(segments.pop());
        this.favouriteEndpoint = didUrl.getHashFragment();
    }

    /**
     * @return {Buffer}
     */
    const generateKey = () => {
        const key = Buffer.from(crypto.randomBytes(this.KEY_LENGTH));
        return key;
    }

    /**
     * Initialize the DID state
     */
    const initialize = () => {
        if (this.url) {
            restoreFromUrl(this.url);
            return;
        }
        if (!this.key) {
            this.key = generateKey();
        }

        if (!this.dlDomain) {
            throw new Error('Missing the DLDomain');
        }
    }

    initialize();

    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////
    /**
     * @return {string}
     */
    this.getAnchorAlias = () => {
        const zkdid = this.getZKDID();
        return zkdid.getAnchorAlias();
    }

    /**
     * @return {ZKDID}
     */
    this.getZKDID = () => {
        if (!this.zkdid) {
            this.zkdid = this.didFactory.create(didTypes.ZK, {
                dlDomain: this.dlDomain,
                version: this.version,
                secret: this.key.toString('hex'),
                favouriteEndpoint: this.favouriteEndpoint
            });
        }
        return this.zkdid;
    }

    /**
     * @param {boolean} includeHashFragment
     * @return {string}
     */
    this.toUrl = (includeHashFragment) => {
        includeHashFragment = (typeof includeHashFragment === 'undefined') ? true : includeHashFragment;
        const urlParts = {
            type: 'sa',
            segments: [
                this.version,
                this.dlDomain,
                crypto.pskBase58Encode(this.key)
            ],
        }
        if (includeHashFragment) {
            urlParts.hashFragment = this.favouriteEndpoint;
        }

        const didUrl = new DIDUrl(urlParts);
        return didUrl.toString();
    }
}

module.exports = SecretDID;
}).call(this,require("buffer").Buffer)

},{"../constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/constants.js","./DIDMixin":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDMixin.js","./DIDUrl":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDUrl.js","./ZKDID":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/ZKDID.js","buffer":false,"pskcrypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/ZKDID.js":[function(require,module,exports){
(function (Buffer){
'use strict';
const crypto = require("pskcrypto");

const DIDUrl = require('./DIDUrl');
const DIDMixin = require('./DIDMixin');

/**
 * @param {string|object} url
 * @param {object|undefined} options
 * @param {string} options.secret
 * @param {string} options.dlDomain
 * @param {string} options.favouriteEndpoint
 */
function ZKDID(url, options) {
    Object.assign(this, DIDMixin);
    this.initialize(url, options);

    this.secret = this.options.secret;
    this.alias = this.options.alias;
    this.signature = null;

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {string} url
     */
    const restoreFromUrl = (url) => {
        const didUrl = new DIDUrl(url, {
            validator: {
                prefix: 'kdid',
                type: 'alias',
                segments: (segments) => {
                    if (segments.length !== 3) {
                        return false;
                    }

                    if (!segments[0].length || !segments[1].length || !segments[2].length) {
                        return false;
                    }

                    return true;
                }
            }
        });

        const segments = didUrl.getSegments();
        this.version = segments.shift();
        this.dlDomain = segments.shift();
        let aliasSegments = crypto.pskBase58Decode(segments.pop()).toString();
        aliasSegments = aliasSegments.split('-');
        if (aliasSegments.length !== 2) {
            throw new Error('Invalid alias');
        }

        this.alias = aliasSegments.shift();
        this.signature = aliasSegments.pop();
        this.favouriteEndpoint = didUrl.getHashFragment();
    }

    /**
     * @return {string}
     */
    const generateAlias = () => {
        if (!this.secret) {
            this.secret = Buffer.from(crypto.randomBytes(this.KEY_LENGTH));
        }

        const alias = crypto.pskHash(crypto.pskHash(this.secret), 'hex');
        return alias;
    }

    /**
     * @return {string}
     */
    const generateSignature = () => {
        if (!this.secret) {
            throw new Error('Missing did secret. Is the alias generated?');
        }

        const signature = crypto.pskHash(crypto.pskHash(this.secret) + crypto.pskHash(this.secret), 'hex')
        return signature;
    }

    /**
     * Initialize the DID state
     */
    const initialize = () => {
        if (this.url) {
            restoreFromUrl(this.url);
            return;
        }
        if (!this.alias) {
            this.alias = generateAlias();
            this.signature = generateSignature();
        }

        if (!this.dlDomain) {
            throw new Error('Missing the DLDomain');
        }
    }

    initialize();
    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////
    /**
     * @return {string}
     */
    this.getAnchorAlias = () => {
        return this.alias;
    }

    /**
     * @return {string}
     */
    this.getSignature = () => {
        return this.signature;
    }

    /**
     * @throws Error
     */
    this.getKey = () => {
        throw new Error('Unimplemented! TODO: Get key from Security Context');
    }

    /**
     * @return {string}
     */
    this.toUrl = () => {
        const urlParts = {
            type: 'alias',
            segments: [
                this.version,
                this.dlDomain,
                crypto.pskBase58Encode(`${this.alias}-${this.signature}`)
            ],
            hashFragment: this.favouriteEndpoint
        };

        const didUrl = new DIDUrl(urlParts);
        return didUrl.toString();
    }
}

module.exports = ZKDID;

}).call(this,require("buffer").Buffer)

},{"./DIDMixin":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDMixin.js","./DIDUrl":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDUrl.js","buffer":false,"pskcrypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/BarFactory.js":[function(require,module,exports){
'use strict';

const barModule = require('bar');
const fsAdapter = require('bar-fs-adapter');
const cache = require('psk-cache').factory();

const constants = require('../constants');
const didTypes = constants.didTypes;
const DEFAULT_BAR_MAP_STRATEGY = constants.DEFAULT_BAR_MAP_STRATEGY;

/**
 * @param {object} options
 * @param {BootstrapingService} options.bootstrapingService
 * @param {string} options.dlDomain
 * @param {DIDFactory} options.didFactory
 * @param {BarMapStrategyFactory} options.barMapStrategyFactory
 */
function BarFactory(options) {
    options = options || {};
    this.bootstrapingService = options.bootstrapingService;
    this.dlDomain = options.dlDomain;
    this.didFactory = options.didFactory;
    this.barMapStrategyFactory = options.barMapStrategyFactory;

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {BaseDID} did
     * @param {object} options
     * @return {Archive}
     */
    const createInstance = (did, options) => {
        const ArchiveConfigurator = barModule.ArchiveConfigurator;
        ArchiveConfigurator.prototype.registerFsAdapter("FsAdapter", fsAdapter.createFsAdapter);
        const archiveConfigurator = new ArchiveConfigurator();
        archiveConfigurator.setCache(cache);
        archiveConfigurator.setFsAdapter("FsAdapter");
        archiveConfigurator.setBufferSize(65535);
        archiveConfigurator.setEncryptionAlgorithm("aes-256-gcm");
        archiveConfigurator.setDID(did);
        archiveConfigurator.setBootstrapingService(this.bootstrapingService);

        let barMapStrategyName = options.barMapStrategy;
        let anchoringOptions = options.anchoringOptions;
        if (!barMapStrategyName) {
            barMapStrategyName = DEFAULT_BAR_MAP_STRATEGY;
        }
        const barMapStrategy = createBarMapStrategy(barMapStrategyName, anchoringOptions);

        archiveConfigurator.setBarMapStrategy(barMapStrategy);

        if (options.validationRules) {
            archiveConfigurator.setValidationRules(options.validationRules);
        }

        const bar = barModule.createArchive(archiveConfigurator);
        return bar;
    }

    /**
     * @return {object}
     */
    const createBarMapStrategy = (name, options) => {
        const strategy = this.barMapStrategyFactory.create(name, options);
        return strategy;
    }

    /**
     * @param {object} options
     * @return {SecretDID}
     */
    const createDID = (options) => {
        return this.didFactory.create(didTypes.SECRET, {
            dlDomain: this.dlDomain,
            favouriteEndpoint: options.favouriteEndpoint
        });
    }

    /**
     * @param {string} did
     * @return {BaseDID}
     */
    const restoreDID = (did) => {
        return this.didFactory.create(did);
    }

    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {object} options
     * @param {string} options.favouriteEndpoint
     * @param {string} options.barMapStrategy 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BarMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules 
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BarMap
     * @param {callback} callback
     */
    this.create = (options, callback) => {
        options = options || {};
        let did;

        try {
            did = createDID(options);
        } catch (e) {
            return callback(e);
        }

        const bar = createInstance(did, options);
        bar.init((err) => {
            if (err) {
                return callback(err);
            }

            return callback(undefined, bar);
        });
    }

    /**
     * @param {string} did
     * @param {object} options
     * @param {string} options.barMapStrategy 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BarMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules 
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BarMap
     * @param {callback} callback
     */
    this.load = (did, options, callback) => {
        options = options || {};
        let didInstance;

        try {
            didInstance = restoreDID(did);
        } catch (e) {
            return callback(e);
        }

        const bar = createInstance(didInstance, options);
        bar.load((err) => {
            if (err) {
                return callback(err);
            }

            return callback(undefined, bar);
        })
    }
}

module.exports = BarFactory;

},{"../constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/constants.js","bar":false,"bar-fs-adapter":false,"psk-cache":"psk-cache"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/Factory.js":[function(require,module,exports){
'use strict';

const BarFactory = require('./BarFactory');
const RawDossierFactory = require('./RawDossierFactory');
const constants = require('../constants');

/**
 * @param {object} options
 * @param {BootstrapingService} options.bootstrapingService
 * @param {string} options.dlDomain
 * @param {DIDFactory} options.didFactory
 * @param {BarMapStrategyFactory} options.barMapStrategyFactory
 */
function Factory(options) {
    options = options || {};

    const bootstrapingService = options.bootstrapingService;
    const dlDomain = options.dlDomain;
    const didFactory = options.didFactory;
    const barMapStrategyFactory = options.barMapStrategyFactory
    const factories = {};

    if (!bootstrapingService) {
        throw new Error('BootstrapingService is required');
    }

    if (!dlDomain) {
        throw new Error('DLDomain is required');
    }

    if (!didFactory) {
        throw new Error('A DID factory is required');
    }

    if (!barMapStrategyFactory) {
        throw new Error('A BarMapStratregy factory is required');
    }

    /**
     * Initialize the factory state
     */
    const initialize = () => {
        const builtinDSURepr = constants.builtinDSURepr;

        const barFactory = new BarFactory({
            bootstrapingService,
            dlDomain,
            didFactory,
            barMapStrategyFactory
        });

        const rawDossierFactory = new RawDossierFactory({
            barFactory
        });

        this.registerRepresentation(builtinDSURepr.BAR, barFactory);
        this.registerRepresentation(builtinDSURepr.RAW_DOSSIER, rawDossierFactory);

        const WebDossierFactory = require("./WebDossierFactory");
        const webDossierFactory = new WebDossierFactory({});
        this.registerRepresentation(builtinDSURepr.WEB_DOSSIER, webDossierFactory);

        const NodeDossierFactory = require("./NodeDossierFactory");
        const nodeDossierFactory = new NodeDossierFactory({});
        this.registerRepresentation(builtinDSURepr.NODE_DOSSIER, nodeDossierFactory);
    }

    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {string} representation
     * @return {boolean}
     */
    this.isValidRepresentation = (representation) => {
        return typeof factories[representation] !== 'undefined';
    };

    /**
     * @param {string} representation
     * @param {object} factory
     */
    this.registerRepresentation = (representation, factory) => {
        factories[representation] = factory;
    }

    /**
     * @param {string} representation
     * @param {object} dsuConfiguration
     * @param {string} dsuConfiguration.favouriteEndpoint
     * @param {string} dsuConfiguration.barMapStrategyFactory 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} dsuConfiguration.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} dsuConfiguration.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} dsuConfiguration.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BarMap and then apply the new changes
     * @param {callback} dsuConfiguration.anchoringOptions.anchoringCb A callback which is called when the strategy anchors the changes
     * @param {callback} dsuConfiguration.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} dsuConfiguration.validationRules 
     * @param {object} dsuConfiguration.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BarMap
     * @param {callback} callback
     */
    this.create = (representation, dsuConfiguration, callback) => {
        const factory = factories[representation];
        factory.create(dsuConfiguration, callback);
    }

    /**
     * @param {string} did
     * @param {string} representation
     * @param {object} dsuConfiguration
     * @param {string} dsuConfiguration.barMapStrategyFactory 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} dsuConfiguration.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} dsuConfiguration.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} dsuConfiguration.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BarMap and then apply the new changes
     * @param {callback} dsuConfiguration.anchoringOptions.anchoringCb A callback which is called when the strategy anchors the changes
     * @param {callback} dsuConfiguration.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} dsuConfiguration.validationRules 
     * @param {object} dsuConfiguration.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BarMap
     * @param {callback} callback
     */
    this.load = (did, representation, dsuConfiguration, callback) => {
        const factory = factories[representation];
        return factory.load(did, dsuConfiguration, callback);
    }

    initialize();
}

module.exports = Factory;

},{"../constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/constants.js","./BarFactory":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/BarFactory.js","./NodeDossierFactory":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/NodeDossierFactory.js","./RawDossierFactory":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/RawDossierFactory.js","./WebDossierFactory":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/WebDossierFactory.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/InteractionBase.js":[function(require,module,exports){
function InteractionBase(){
	const se = require("swarm-engine");
	if(typeof $$ === "undefined" || typeof $$.swarmEngine === "undefined"){
		se.initialise();
	}

	this.createHandler = function(keyDID, powerCord, callback){
		let identity = "anonymousIdentity"; // this should be get from securityContext

		let cord_identity;
		try{
			const crypto = require("pskcrypto");
			cord_identity = crypto.pskHash(keyDID, "hex");
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

}
module.exports = new InteractionBase();
},{"pskcrypto":false,"swarm-engine":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/NodeDossierFactory.js":[function(require,module,exports){
'use strict';

/**
 * @param {object} options
 * @param {BootstrapingService} options.bootstrapingService
 * @param {string} options.dlDomain
 * @param {DIDFactory} options.didFactory
 * @param {BarMapStrategyFactory} options.barMapStrategyFactory
 */
function NodeDossierFactory(options) {
    options = options || {};
    this.didFactory = options.didFactory;

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////
    /**
     * @param {string} did
     * @return {BaseDID}
     */
    const restoreDID = (did) => {
        return this.didFactory.create(did);
    }

    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {object} options
     * @param {callback} callback
     */
    this.create = (options, callback) => {
        return callback(new Error("Wrong usage of create function. NodeDossier representation is just for loading and interacting purpose."));
    }

    /**
     * @param {string} did
     * @param {object} options
     * @param {callback} callback
     */
    this.load = (did, options, callback) => {

        const envTypes = require("overwrite-require").constants;
        if($$.environmentType !== envTypes.NODEJS_ENVIRONMENT_TYPE){
            return callback(new Error(`NodeDossier representation should be used only in NodeJS. Current environment type is <${$$.environmentType}>`));
        }

        options = options || {};
        let didInstance;

        try {
            didInstance = restoreDID(did);
        } catch (e) {
            return callback(e);
        }

        const pathName = "path";
        const path = require(pathName);
        const powerCord = new se.OuterThreadPowerCord(path.join(process.env.PSK_ROOT_INSTALATION_FOLDER, "psknode/bundles/threadBoot.js"), false, seed);
        let InteractionBase = require("./InteractionBase");
        InteractionBase.createHandler(did, powerCord, callback);
    }
}

module.exports = NodeDossierFactory;

},{"./InteractionBase":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/InteractionBase.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/RawDossierFactory.js":[function(require,module,exports){
'use strict';

const RawDossier = require('edfs').RawDossier;

/**
 * @param {object} options
 * @param {BarFactory} options.barFactory
 */
function RawDossierFactory(options) {
    options = options || {};
    this.barFactory = options.barFactory;

    /**
     * @param {object} options
     * @param {string} options.favouriteEndpoint
     * @param {string} options.barMapStrategy 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BarMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules 
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BarMap
     * @param {callback} callback
     */
    this.create = (options, callback) => {
        this.barFactory.create(options, (err, bar) => {
            if (err) {
                return callback(err);
            }

            const rawDossier = new RawDossier(bar);
            callback(undefined, rawDossier);
        })

    };

    /**
     * @param {string} did
     * @param {object} options
     * @param {string} options.barMapStrategy 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn Callback which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BarMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules 
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BarMap
     * @param {callback} callback
     */
    this.load = (did, options, callback) => {
        this.barFactory.load(did, options, (err, bar) => {
            if (err) {
                return callback(err);
            }

            const rawDossier = new RawDossier(bar);
            callback(undefined, rawDossier);
        })

    };
}

module.exports = RawDossierFactory;

},{"edfs":"edfs"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/WebDossierFactory.js":[function(require,module,exports){
'use strict';

/**
 * @param {object} options
 * @param {BootstrapingService} options.bootstrapingService
 * @param {string} options.dlDomain
 * @param {DIDFactory} options.didFactory
 * @param {BarMapStrategyFactory} options.barMapStrategyFactory
 */
function WebDossierFactory(options) {
    options = options || {};
    this.didFactory = options.didFactory;

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////
    /**
     * @param {string} did
     * @return {BaseDID}
     */
    const restoreDID = (did) => {
        return this.didFactory.create(did);
    }

    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {object} options
     * @param {callback} callback
     */
    this.create = (options, callback) => {
        return callback(new Error("Wrong usage of create function. WebDossier representation is just for loading and interacting purpose."));
    }

    /**
     * @param {string} did
     * @param {object} options
     * @param {callback} callback
     */
    this.load = (did, options, callback) => {

        const envTypes = require("overwrite-require").constants;
        if($$.environmentType !== envTypes.BROWSER_ENVIRONMENT_TYPE){
            return callback(new Error(`WebDossier representation should be used only in browser. Current environment type is <${$$.environmentType}>`));
        }

        options = options || {};
        let didInstance;

        try {
            didInstance = restoreDID(did);
        } catch (e) {
            return callback(e);
        }

        let InteractionBase = require("./InteractionBase");
        const pc = new se.OuterWebWorkerPowerCord("path_to_boot_script", seed);
        InteractionBase.createHandler(did, pc, callback);
    }
}

module.exports = WebDossierFactory;

},{"./InteractionBase":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/InteractionBase.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/index.js":[function(require,module,exports){
module.exports = {
    Factory: require('./Factory')
};

},{"./Factory":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/Factory.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/KeyDIDResolver.js":[function(require,module,exports){
'use strict';

const constants = require('./constants');
const DSUFactory = require('./DSUFactory').Factory;
const DIDFactory = require('./DID/Factory');
const BarMapStrategyFactory = require('./BarMapStrategy').Factory;

/**
 * @param {string} options.dlDomain
 * @param {BoostrapingService} options.bootstrapingService
 * @param {BarMapStrategyFactory} options.barMapStrategyFactory
 * @param {DSUFactory} options.dsuFactory
 */
function KeyDIDResolver(options) {
    options = options || {};

    const bootstrapingService = options.bootstrapingService;
    const dlDomain = options.dlDomain || constants.DEFAULT_DOMAIN;

    if (!bootstrapingService) {
        throw new Error('BootstrapingService is required');
    }

    if (!dlDomain) {
        throw new Error('DLDomain is required');
    }

    const barMapStrategyFactory = options.barMapStrategyFactory || new BarMapStrategyFactory();

    const dsuFactory = options.dsuFactory || new DSUFactory({
        bootstrapingService,
        dlDomain,
        barMapStrategyFactory: barMapStrategyFactory,
        didFactory: new DIDFactory
    });


    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {string} dsuRepresentation
     * @param {object} options
     * @param {string} options.favouriteEndpoint
     * @param {string} options.barMapStrategy 'Diff' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn A function which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn A function which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BarMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules 
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BarMap
     * @param {callback} callback
     */
    this.createDSU = (dsuRepresentation, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        if (!dsuFactory.isValidRepresentation(dsuRepresentation)) {
            return callback(new Error(`Invalid DSU representation: ${dsuRepresentation}`));
        }

        dsuFactory.create(dsuRepresentation, options, callback);
    };

    /**
     * @param {string} did
     * @param {string} dsuRepresentation
     * @param {object} options
     * @param {string} options.barMapStrategy 'Diff', 'Versioned' or any strategy registered with the factory
     * @param {object} options.anchoringOptions Anchoring options to pass to bar map strategy
     * @param {callback} options.anchoringOptions.decisionFn A function which will decide when to effectively anchor changes
     *                                                              If empty, the changes will be anchored after each operation
     * @param {callback} options.anchoringOptions.conflictResolutionFn Callback which will handle anchoring conflicts
     *                                                              The default strategy is to reload the BarMap and then apply the new changes
     * @param {callback} options.anchoringOptions.anchoringEventListener An event listener which is called when the strategy anchors the changes
     * @param {callback} options.anchoringOptions.signingFn  A function which will sign the new alias
     * @param {object} options.validationRules 
     * @param {object} options.validationRules.preWrite An object capable of validating operations done in the "preWrite" stage of the BarMap
     * @param {callback} callback
     */
    this.loadDSU = (did, dsuRepresentation, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        if (!dsuFactory.isValidRepresentation(dsuRepresentation)) {
            return callback(new Error(`Invalid DSU representation: ${dsuRepresentation}`));
        }

        dsuFactory.load(did, dsuRepresentation, options, callback);
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
     * @return {BarMapStrategyFactory}
     */
    this.getBarMapStrategyFactory = () => {
        return barMapStrategyFactory;
    }
}

module.exports = KeyDIDResolver;

},{"./BarMapStrategy":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/index.js","./DID/Factory":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/Factory.js","./DSUFactory":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/index.js","./constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/constants.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/constants.js":[function(require,module,exports){
'use strict';

module.exports = {
    DEFAULT_DOMAIN: 'localDomain',
    DID_VERSION: '1',
    didTypes: {
        SECRET: 'SecretDID',
        ZK: 'ZKDID'
    },
    builtinDSURepr: {
        BAR: 'Bar',
        RAW_DOSSIER: 'RawDossier',
        WEB_DOSSIER: 'WebDossier',
        NODE_DOSSIER: 'NodeDossier',
    },
    DEFAULT_BAR_MAP_STRATEGY: 'Diff',
    builtinBarMapStrategies: {
        DIFF: 'Diff'
    }
}

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
},{"overwrite-require":"overwrite-require","pskcrypto":false,"swarm-engine":false}],"edfs":[function(require,module,exports){
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

},{"./lib/Cache":"/home/travis/build/PrivateSky/privatesky/modules/psk-cache/lib/Cache.js"}],"psk-key-did-resolver":[function(require,module,exports){
'use strict';

const KeyDIDResolver = require('./lib/KeyDIDResolver');
const BootstrapingService = require('./lib/BootstrapingService').Service;
const constants = require('./lib/constants');

/**
 * Create a new KeyDIDResolver instance
 * @param {object} options
 * @param {object} options.endpointsConfiguration
 * @param {Array<object>} options.endpointsConfiguration.brickEndpoints
 * @param {Array<object>} options.endpointsConfiguration.aliasEndpoints
 */
function factory(options) {
    options = options || {};
    const bootstrapingService = new BootstrapingService(options.endpointsConfiguration);

    const keyDidResolver = new KeyDIDResolver({
        bootstrapingService,
        dlDomain: options.dlDomain
    });

    return keyDidResolver;
}

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
    $$.keyDidResolver = factory(options);
    $$.dsuFactory = $$.keyDidResolver.getDSUFactory();
    $$.bootstrapingService = $$.keyDidResolver.getBootstrapingService();
    $$.barMapStrategyFactory = $$.keyDidResolver.getBarMapStrategyFactory();
}

module.exports = {
    initialize,
    constants,
    DIDMixin: require('./lib/DID/DIDMixin'),
    BarMapStrategyMixin: require('./lib/BarMapStrategy/BarMapStrategyMixin'),
    // TODO: exposed for compatibility reasons. Remove it after switching completely to psk-key-did-resolver
    BarMapStrategyFactory: require('./lib/BarMapStrategy/Factory')
};

},{"./lib/BarMapStrategy/BarMapStrategyMixin":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/BarMapStrategyMixin.js","./lib/BarMapStrategy/Factory":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/Factory.js","./lib/BootstrapingService":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BootstrapingService/index.js","./lib/DID/DIDMixin":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDMixin.js","./lib/KeyDIDResolver":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/KeyDIDResolver.js","./lib/constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/constants.js"}]},{},["/home/travis/build/PrivateSky/privatesky/builds/tmp/csbBoot.js"])