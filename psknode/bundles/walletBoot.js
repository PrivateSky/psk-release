walletBootRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/travis/build/PrivateSky/privatesky/builds/tmp/walletBoot.js":[function(require,module,exports){
const or = require('overwrite-require');
or.enableForEnvironment(or.constants.NODEJS_ENVIRONMENT_TYPE);

require("./walletBoot_intermediar");
},{"./walletBoot_intermediar":"/home/travis/build/PrivateSky/privatesky/builds/tmp/walletBoot_intermediar.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/builds/tmp/walletBoot_intermediar.js":[function(require,module,exports){
(function (global){
global.walletBootLoadModules = function(){ 

	if(typeof $$.__runtimeModules["overwrite-require"] === "undefined"){
		$$.__runtimeModules["overwrite-require"] = require("overwrite-require");
	}

	if(typeof $$.__runtimeModules["syndicate"] === "undefined"){
		$$.__runtimeModules["syndicate"] = require("syndicate");
	}

	if(typeof $$.__runtimeModules["edfs"] === "undefined"){
		$$.__runtimeModules["edfs"] = require("edfs");
	}

	if(typeof $$.__runtimeModules["dossier"] === "undefined"){
		$$.__runtimeModules["dossier"] = require("dossier");
	}

	if(typeof $$.__runtimeModules["swarm-engine"] === "undefined"){
		$$.__runtimeModules["swarm-engine"] = require("swarm-engine");
	}

	if(typeof $$.__runtimeModules["callflow"] === "undefined"){
		$$.__runtimeModules["callflow"] = require("callflow");
	}

	if(typeof $$.__runtimeModules["pskcrypto"] === "undefined"){
		$$.__runtimeModules["pskcrypto"] = require("pskcrypto");
	}

	if(typeof $$.__runtimeModules["swarmutils"] === "undefined"){
		$$.__runtimeModules["swarmutils"] = require("swarmutils");
	}

	if(typeof $$.__runtimeModules["bar"] === "undefined"){
		$$.__runtimeModules["bar"] = require("bar");
	}

	if(typeof $$.__runtimeModules["psk-cache"] === "undefined"){
		$$.__runtimeModules["psk-cache"] = require("psk-cache");
	}

	if(typeof $$.__runtimeModules["psk-http-client"] === "undefined"){
		$$.__runtimeModules["psk-http-client"] = require("psk-http-client");
	}

	if(typeof $$.__runtimeModules["bar-fs-adapter"] === "undefined"){
		$$.__runtimeModules["bar-fs-adapter"] = require("bar-fs-adapter");
	}

	if(typeof $$.__runtimeModules["edfs-brick-storage"] === "undefined"){
		$$.__runtimeModules["edfs-brick-storage"] = require("edfs-brick-storage");
	}

	if(typeof $$.__runtimeModules["psk-key-did-resolver"] === "undefined"){
		$$.__runtimeModules["psk-key-did-resolver"] = require("psk-key-did-resolver");
	}

	if(typeof $$.__runtimeModules["adler32"] === "undefined"){
		$$.__runtimeModules["adler32"] = require("adler32");
	}

	if(typeof $$.__runtimeModules["boot-script"] === "undefined"){
		$$.__runtimeModules["boot-script"] = require("pskwallet/index.js");
	}
};
if (true) {
	walletBootLoadModules();
}
global.walletBootRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("walletBoot");
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"adler32":"adler32","bar":"bar","bar-fs-adapter":"bar-fs-adapter","callflow":"callflow","dossier":"dossier","edfs":"edfs","edfs-brick-storage":"edfs-brick-storage","overwrite-require":"overwrite-require","psk-cache":"psk-cache","psk-http-client":"psk-http-client","psk-key-did-resolver":"psk-key-did-resolver","pskcrypto":"pskcrypto","pskwallet/index.js":"pskwallet/index.js","swarm-engine":"swarm-engine","swarmutils":"swarmutils","syndicate":"syndicate"}],"/home/travis/build/PrivateSky/privatesky/modules/adler32/lib/Hash.js":[function(require,module,exports){
(function (Buffer){
"use strict";

var util = require('util');
var Transform = require('stream').Transform;
var crypto = require('crypto');
var algorithm = require('./algorithm');

// Provides a node.js Hash style interface for _sum32: http://nodejs.org/api/crypto.html#crypto_class_hash
var Hash = module.exports = function Hash(options)
{
	if (!(this instanceof Hash))
		return new Hash(options);

	Transform.call(this, options);

	this._sum = 1;
};

util.inherits(Hash, Transform);

Hash.prototype.update = function(data, encoding)
{
	if (this._done)
		throw new TypeError('HashUpdate fail');

	encoding = encoding || crypto.DEFAULT_ENCODING;

	if (!(data instanceof Buffer)) {
		data = new Buffer(''+data, encoding === 'buffer' ? 'binary' : encoding);
	}

	this._sum = algorithm.sum(data, this._sum);

	return this;
};

Hash.prototype.digest = function(encoding)
{
	if (this._done)
		throw new Error('Not initialized');
	
	this._done = true;

	var buf = new Buffer(4);
	buf.writeUInt32BE(this._sum, 0);

	encoding = encoding || crypto.DEFAULT_ENCODING;

	if (encoding === 'buffer')
		return buf;
	else
		return buf.toString(encoding);
};

Hash.prototype._transform = function(chunk, encoding, callback)
{
	this.update(chunk, encoding);
	callback();
};

Hash.prototype._flush = function(callback)
{
	var encoding = this._readableState.encoding || 'buffer';
	this.push(this.digest(encoding), encoding);
	callback();
};
}).call(this,require("buffer").Buffer)

},{"./algorithm":"/home/travis/build/PrivateSky/privatesky/modules/adler32/lib/algorithm.js","buffer":false,"crypto":false,"stream":false,"util":false}],"/home/travis/build/PrivateSky/privatesky/modules/adler32/lib/algorithm.js":[function(require,module,exports){
"use strict";

/**
 * Largest prime smaller than 2^16 (65536)
 */
var BASE = 65521;

/**
 * Largest value n such that 255n(n+1)/2 + (n+1)(BASE-1) <= 2^32-1
 *
 * NMAX is just how often modulo needs to be taken of the two checksum word halves to prevent overflowing a 32 bit
 * integer. This is an optimization. We "could" take the modulo after each byte, and it must be taken before each
 * digest.
 */
var NMAX = 5552;

exports.sum = function(buf, sum)
{
	if (sum == null)
		sum = 1;

	var a = sum & 0xFFFF,
		b = (sum >>> 16) & 0xFFFF,
		i = 0,
		max = buf.length,
		n, value;

	while (i < max)
	{
		n = Math.min(NMAX, max - i);

		do
		{
			a += buf[i++]<<0;
			b += a;
		}
		while (--n);

		a %= BASE;
		b %= BASE;
	}

	return ((b << 16) | a) >>> 0;
};

exports.roll = function(sum, length, oldByte, newByte)
{
	var a = sum & 0xFFFF,
		b = (sum >>> 16) & 0xFFFF;

	if (newByte != null)
	{
		a = (a - oldByte + newByte + BASE) % BASE;
		b = (b - ((length * oldByte) % BASE) + a - 1 + BASE) % BASE;
	}
	else
	{
		a = (a - oldByte + BASE) % BASE;
		b = (b - ((length * oldByte) % BASE) - 1 + BASE) % BASE;
	}

	return ((b << 16) | a) >>> 0;
};
},{}],"/home/travis/build/PrivateSky/privatesky/modules/adler32/lib/register.js":[function(require,module,exports){
"use strict";

module.exports = function()
{
	var crypto = require('crypto');
	var Hash = require('./Hash');

	// Silently abort if the adler32 algorithm is already supported by the
	// crypto module.
	if (crypto.getHashes().indexOf('adler32') != -1)
		return;

	crypto.getHashes = function()
	{
		return this().concat(['adler32']);
	}
	.bind(crypto.getHashes.bind(crypto));

	crypto.createHash = function(algorithm)
	{
		if (algorithm === 'adler32')
			return new Hash();
		else
			return this(algorithm);
	}
	.bind(crypto.createHash.bind(this));
};
},{"./Hash":"/home/travis/build/PrivateSky/privatesky/modules/adler32/lib/Hash.js","crypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar-fs-adapter/lib/FsAdapter.js":[function(require,module,exports){
(function (Buffer){
const fsModule = "fs";
const fs = require(fsModule);
const pathModule = "path";
const path = require(pathModule);
const PathAsyncIterator = require('./PathAsyncIterator');

function FsAdapter() {

    this.getFileSize = function (filePath, callback) {
        fs.stat(filePath, (err, stats) => {
            if (err) {
                return callback(err);
            }

            callback(undefined, stats.size);
        });
    };

    this.readBlockFromFile = function (filePath, blockStart, blockEnd, callback) {
        const readStream = fs.createReadStream(filePath, {
            start: blockStart,
            end: blockEnd
        });

        let data = Buffer.alloc(0);

        readStream.on("data", (chunk) => {
            data = Buffer.concat([data, chunk]);
        });

        readStream.on("error", (err) => {
            callback(err);
        });

        readStream.on("end", () => {
            callback(undefined, data);
        });
    };

    this.getFilesIterator = function (inputPath) {
        return new PathAsyncIterator(inputPath);
    };

    this.appendBlockToFile = function (filePath, data, callback) {
        fs.access(filePath, (err) => {
            if (err) {
                fs.mkdir(path.dirname(filePath), {recursive: true}, (err) => {
                    if (err && err.code !== "EEXIST") {
                        return callback(err);
                    }

                    fs.appendFile(filePath, data, callback);
                });
            } else {
                fs.appendFile(filePath, data, callback);
            }
        });
    };
}

module.exports = FsAdapter;
}).call(this,require("buffer").Buffer)

},{"./PathAsyncIterator":"/home/travis/build/PrivateSky/privatesky/modules/bar-fs-adapter/lib/PathAsyncIterator.js","buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar-fs-adapter/lib/PathAsyncIterator.js":[function(require,module,exports){
const fsModule = "fs";
const fs = require(fsModule);
const pathModule = "path";
const path = require(pathModule);
const TaskCounter = require("swarmutils").TaskCounter;


function PathAsyncIterator(inputPath) {
    inputPath = path.normalize(inputPath);
    let removablePathLen;
    const fileList = [];
    const folderList = [];
    let isFirstCall = true;
    let pathIsFolder;

    this.next = function (callback) {
        if (isFirstCall === true) {
            isDir(inputPath, (err, status) => {
                if (err) {
                    return callback(err);
                }

                isFirstCall = false;
                pathIsFolder = status;
                if (status === true) {
                    if(!inputPath.endsWith(path.sep)) {
                        inputPath += path.sep;
                    }

                    removablePathLen = inputPath.length;
                    folderList.push(inputPath);
                    getNextFileFromFolder(callback);
                } else {
                    const fileName = path.basename(inputPath);
                    const fileParentFolder = path.dirname(inputPath);
                    callback(undefined, fileName, fileParentFolder);
                }
            });
        } else if (pathIsFolder) {
            getNextFileFromFolder(callback);
        } else {
            callback();
        }
    };

    function walkFolder(folderPath, callback) {
        const taskCounter = new TaskCounter((errors, results) => {
            if (fileList.length > 0) {
                const fileName = fileList.shift();
                return callback(undefined, fileName, inputPath);
            }

            if (folderList.length > 0) {
                const folderName = folderList.shift();
                return walkFolder(folderName, callback);
            }

            return callback();
        });

        fs.readdir(folderPath, (err, files) => {
            if (err) {
                return callback(err);
            }

            if (files.length === 0 && folderList.length === 0) {
                return callback();
            }

            if (files.length === 0) {
                walkFolder(folderList.shift(), callback);
            }
            taskCounter.increment(files.length);

            files.forEach(file => {
                let filePath = path.join(folderPath, file);
                isDir(filePath, (err, status) => {
                    if (err) {
                        return callback(err);
                    }

                    if (status) {
                        folderList.push(filePath);
                    } else {
                        fileList.push(filePath.substring(removablePathLen));
                    }

                    taskCounter.decrement();
                });
            });
        });
    }

    function isDir(filePath, callback) {
        fs.stat(filePath, (err, stats) => {
            if (err) {
                return callback(err);
            }

            return callback(undefined, stats.isDirectory());
        });
    }

    function getNextFileFromFolder(callback) {
        if (fileList.length === 0 && folderList.length === 0) {
            return callback();
        }

        if (fileList.length > 0) {
            const fileName = fileList.shift();
            return callback(undefined, fileName, inputPath);
        }


        walkFolder(folderList.shift(), (err, file) => {
            if (err) {
                return callback(err);
            }

            callback(undefined, file, inputPath);
        });
    }
}

module.exports = PathAsyncIterator;
},{"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Archive.js":[function(require,module,exports){
(function (Buffer){
const Brick = require('./Brick');
const pathModule = "path";
const path = require(pathModule);
const isStream = require("../utils/isStream");
const stream = require('stream');
const swarmutils = require("swarmutils");
const TaskCounter = swarmutils.TaskCounter;
const pskPth = swarmutils.path;
const crypto = require('pskcrypto');
const adler32 = require('adler32');
const BrickStorageService = require('./BrickStorageService').Service;

/**
 * @param {ArchiveConfigurator} archiveConfigurator
 */
function Archive(archiveConfigurator) {
    let cachedSEED;
    let barMap;
    let cachedMapDigest;
    let validator;

    const brickStorageService = buildBrickStorageServiceInstance();

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////

    /**
     * Create and configura the BrickStorageService
     *
     * @return {BrickStorageService}
     */
    function buildBrickStorageServiceInstance() {
        const instance = new BrickStorageService({
            cache: archiveConfigurator.getCache(),
            bufferSize: archiveConfigurator.getBufferSize(),
            storageProvider: archiveConfigurator.getStorageProvider(),

            brickFactoryCallback: () => {
                return new Brick(archiveConfigurator);
            },

            barMapConfiguratorCallback: (barMap) => {
                if (archiveConfigurator.getMapEncryptionKey()) {
                    barMap.setEncryptionKey(archiveConfigurator.getMapEncryptionKey());
                }

                if (!barMap.getConfig()) {
                    barMap.setConfig(archiveConfigurator);
                }

                barMap.load();
                return barMap;
            },

            brickDataExtractorCallback: (brickMeta, brick) => {
                brick.setConfig(archiveConfigurator);
                const transformParameters = barMap.getTransformParameters(brickMeta);
                brick.setTransformParameters(transformParameters);

                return brick.getRawData();
            },

            fsAdapter: archiveConfigurator.getFsAdapter()
        });

        return instance;
    }

    /**
     * @param {string} fileBarPath
     * @return {string}
     */
    function computeFileHash(fileBarPath) {
        const hashList = barMap.getBricksMeta(fileBarPath).map(brickMeta => brickMeta.hash);
        const PskHash = crypto.PskHash;
        const pskHash = new PskHash();
        hashList.forEach(hash => {
            pskHash.update(hash);
        });

        return pskHash.digest();
    }

    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////

    /**
     * @param {callback} callback
     */
    this.load = (callback) => {
        const barMapHash = archiveConfigurator.getBarMapId();
        brickStorageService.getBarMap(barMapHash, (err, map) => {
            if (err) {
                return callback(err);
            }

            barMap = map;
            callback();
        })
    };

    /**
     * @return {string}
     */
    this.getMapDigest = () => {
        if (cachedMapDigest) {
            return cachedMapDigest;
        }

        cachedMapDigest = archiveConfigurator.getBarMapId();
        return cachedMapDigest;
    };

    /**
     * @param {string} seed
     */
    this.setSeed = (seed) => {
        cachedSEED = seed;
        archiveConfigurator.setSeed(Buffer.from(seed));
    };

    /**
     * @return {string}
     */
    this.getSeed = () => {
        if (cachedSEED) {
            return cachedSEED;
        }

        cachedSEED = archiveConfigurator.getSeed().toString();
        return cachedSEED;
    };

    /**
     * @param {string} barPath
     * @param {callback} callback
     * @return {string}
     */
    this.getFileHash = (barPath, callback) => {
        barPath = pskPth.normalize(barPath);
        const hash = computeFileHash(barPath).toString("hex");
        callback(undefined, hash);
        return hash;
    };

    /**
     * @param {string} barPath
     * @param {callback} callback
     * @return {string}
     */
    this.getFolderHash = (barPath, callback) => {
        barPath = pskPth.normalize(barPath);
        const fileList = barMap.getFileList(barPath);
        if (fileList.length === 1) {
            const hash = computeFileHash(pskPth.join(barPath, fileList[0]).toString("hex"));
            callback(undefined, hash);
            return hash;
        }
        fileList.sort();

        let xor = computeFileHash(pskPth.join(barPath, fileList[0]));
        for (let i = 0; i < fileList.length - 1; i++) {
            xor = crypto.xorBuffers(xor, computeFileHash(pskPth.join(barPath, fileList[i + 1])));
        }

        const hash = crypto.pskHash(xor, "hex");
        callback(undefined, hash);
        return hash;
    };

    /**
     * @param {string} barPath
     * @param {string|Buffer|stream.ReadableStream} data
     * @param {object} options
     * @param {callback} callback
     */
    this.writeFile = (barPath, data, options, callback) => {
        if (typeof options === "function") {
            callback = options;
            options = {};
            options.encrypt = true;
        }
        barPath = pskPth.normalize(barPath);

        archiveConfigurator.setIsEncrypted(options.encrypt);

        brickStorageService.ingestData(data, (err, result) => {
            if (err) {
                return callback(err);
            }

            barMap.addFileEntry(barPath, result);
            this.saveBarMap(callback);
        });
    };

    /**
     * @param {string} barPath
     * @param {callback} callback
     */
    this.readFile = (barPath, callback) => {
        barPath = pskPth.normalize(barPath);

        let bricksMeta;

        try {
            bricksMeta = barMap.getBricksMeta(barPath);
        } catch (err) {
            return callback(err);
        }

        brickStorageService.createBufferFromBricks(bricksMeta, (err, buffer) => {
            if (err) {
                return callback(err);
            }

            callback(undefined, buffer);
        });
    };

    /**
     * @param {string} barPath
     * @param {callback} callback
     */
    this.createReadStream = (barPath, callback) => {
        barPath = pskPth.normalize(barPath);

        let bricksMeta;
        try {
            bricksMeta = barMap.getBricksMeta(barPath);
        } catch (err) {
            return callback(err);
        }

        brickStorageService.createStreamFromBricks(bricksMeta, (err, stream) => {
            if (err) {
                return callback(err);
            }

            callback(undefined, stream);
        });
    };

    /**
     * @param {string} fsFilePath
     * @param {string} barPath
     * @param {object} options
     * @param {callback} callback
     */
    this.addFile = (fsFilePath, barPath, options, callback) => {
        if (typeof options === "function") {
            callback = options;
            options = {};
            options.encrypt = true;
        }

        barPath = pskPth.normalize(barPath);
        archiveConfigurator.setIsEncrypted(options.encrypt);

        brickStorageService.ingestFile(fsFilePath, (err, result) => {
            if (err) {
                return callback(err);
            }

            barMap.addFileEntry(barPath, result);
            this.saveBarMap(callback);
        })
    };

    /**
     * @param {string} files
     * @param {string} barPath
     * @param {object} options
     * @param {callback} callback
     */
    this.addFiles = (files, barPath, options, callback) => {
        if (typeof options === "function") {
            callback = options;
            options = {};
            options.encrypt = true;
        }

        barPath = pskPth.normalize(barPath);
        archiveConfigurator.setIsEncrypted(options.encrypt);

        const filesArray = files.slice();

        brickStorageService.ingestFiles(filesArray, (err, result) => {
            if (err) {
                return callback(err);
            }

            for (const filePath in result) {
                const bricks = result[filePath];
                barMap.addFileEntry(pskPth.join(barPath, filePath), bricks);
            }

            this.saveBarMap(callback);
        });
    };

    /**
     * @param {string} fsFilePath
     * @param {string} barPath
     * @param {callback} callback
     */
    this.extractFile = (fsFilePath, barPath, callback) => {
        if (typeof barPath === "function") {
            callback = barPath;
            barPath = pskPth.normalize(fsFilePath);
        }

        let bricksMeta;

        try {
            bricksMeta = barMap.getBricksMeta(barPath);
        } catch (err) {
            return callback(err);
        }


        brickStorageService.createFileFromBricks(fsFilePath, bricksMeta, callback);
    };

    /**
     * @param {string} barPath
     * @param {string|Buffer|stream.ReadableStream} data
     * @param {callback} callback
     */
    this.appendToFile = (barPath, data, callback) => {
        barPath = pskPth.normalize(barPath);

        brickStorageService.ingestData(data, (err, result) => {
            if (err) {
                return callback(err);
            }

            barMap.appendBricksToEntry(barPath, result);
            this.saveBarMap(callback);
        })
    };

    /**
     * @param {string} fsFolderPath
     * @param {string} barPath
     * @param {object} options
     * @param {callback} callback
     */
    this.addFolder = (fsFolderPath, barPath, options, callback) => {
        if (typeof options === "function") {
            callback = options;
            options = {};
            options.encrypt = true;
        }
        barPath = pskPth.normalize(barPath);
        archiveConfigurator.setIsEncrypted(options.encrypt);

        brickStorageService.ingestFolder(fsFolderPath, (err, result) => {
            if (err) {
                return callback(err);
            }


            for (const filePath in result) {
                const bricks = result[filePath];
                barMap.addFileEntry(pskPth.join(barPath, filePath), bricks);
            }

            this.saveBarMap(callback);
        });
    };

    /**
     * @param {string} fsFolderPath
     * @param {string} barPath
     * @param {callback} callback
     */
    this.extractFolder = (fsFolderPath, barPath, callback) => {
        if (typeof barPath === "function") {
            callback = barPath;
            barPath = pskPth.normalize(fsFolderPath);
        }

        const filePaths = barMap.getFileList(barPath);
        const taskCounter = new TaskCounter(() => {
            callback();
        });
        taskCounter.increment(filePaths.length);
        filePaths.forEach(filePath => {
            let actualPath;
            if (fsFolderPath) {
                if (fsFolderPath.includes(filePath)) {
                    actualPath = fsFolderPath;
                } else {
                    actualPath = path.join(fsFolderPath, filePath);
                }
            } else {
                actualPath = filePath;
            }

            this.extractFile(actualPath, filePath, (err) => {
                if (err) {
                    return callback(err);
                }

                taskCounter.decrement();
            });
        });
    };

    /**
     * @param {callback} callback
     */
    this.saveBarMap = (callback) => {
        brickStorageService.putBarMap(barMap, callback);
    };


    /**
     * @param {string} barPath
     * @param {callback} callback
     */
    this.delete = (barPath, callback) => {
        barMap.delete(barPath);
        callback();
    };

    /**
     * @param {string} folderBarPath
     * @param {object} options
     * @param {callback} callback
     */
    this.listFiles = (folderBarPath, options, callback) => {
        if (typeof options === "function") {
            callback = options;
            options = {recursive:true};
        } else if (typeof folderBarPath === "function") {
            callback = folderBarPath;
            options = {recursive: true};
            folderBarPath = "/";
        }

        let fileList;
        try {
            fileList = barMap.getFileList(folderBarPath, options.recursive);
        } catch (e) {
            return callback(e);
        }

        callback(undefined, fileList);
    };

    /**
     * @param {string} folderBarPath
     * @param {boolean} recursive
     * @param {callback} callback
     */
    this.listFolders = (folderBarPath, recursive, callback) => {
        if (typeof recursive === "function") {
            callback = recursive;
            recursive = true;
        }

        callback(undefined, barMap.getFolderList(folderBarPath, recursive));
    };

    /**
     * @param {EDFSBrickStorage} targetStorage
     * @param {boolean} preserveKeys
     * @param {callback} callback
     */
    this.clone = (targetStorage, preserveKeys = true, callback) => {
        targetStorage.getBarMap((err, targetBarMap) => {
            if (err) {
                return callback(err);
            }


            const fileList = barMap.getFileList("/");
            const bricksList = {};
            for (const filepath of fileList) {
                bricksList[filepath] = barMap.getBricksMeta(filepath);
            }

            brickStorageService.copyBricks(bricksList, {
                dstStorage: targetStorage,
                beforeCopyCallback: (brickId, brick) => {
                    const transformParameters = barMap.getTransformParameters(brickId);
                    if (transformParameters) {
                        brick.setTransformParameters(transformParameters);
                    }

                    brick.setConfig(archiveConfigurator);
                    if (!preserveKeys) {
                        brick.createNewTransform();
                    }

                    return brick;
                }
            }, (err, result) => {
                if (err) {
                    return callback(err);
                }

                for (const filepath in result) {
                    const bricks = result[filepath];
                    targetBarMap.addFileEntry(filepath, bricks);
                }

                cachedSEED = archiveConfigurator.getSeed();
                archiveConfigurator.generateSeed();
                targetBarMap.setEncryptionKey(archiveConfigurator.getMapEncryptionKey());
                targetBarMap.setConfig(archiveConfigurator);

                targetStorage.putBarMap(targetBarMap, err => callback(err, archiveConfigurator.getSeed()));
            });
        });
    };

    /**
     * @param {object} _validator
     * @param {callback} _validator.writeRule Writes validator
     * @param {callback} _validator.readRule Reads validator
     */
    this.setValidator = (_validator) => {
        validator = _validator;
    };
}

module.exports = Archive;

}).call(this,require("buffer").Buffer)

},{"../utils/isStream":"/home/travis/build/PrivateSky/privatesky/modules/bar/utils/isStream.js","./Brick":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js","./BrickStorageService":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/BrickStorageService/index.js","adler32":"adler32","buffer":false,"pskcrypto":"pskcrypto","stream":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/ArchiveConfigurator.js":[function(require,module,exports){
const storageProviders = {};
const fsAdapters = {};
const Seed = require("./Seed");

function ArchiveConfigurator() {
    const config = {};
    let cache;

    let self = this;
    this.setBufferSize = (bufferSize) => {
        if (bufferSize < 65535) {
            throw Error(`Brick size should be equal to or greater than 65535. The provided brick size is ${bufferSize}`);
        }
        config.bufferSize = bufferSize;
    };

    this.getBufferSize = () => {
        return config.bufferSize;
    };

    this.setIsEncrypted = (flag) => {
        config.isEncrypted = flag;
    };

    this.getIsEncrypted = () => {
        return config.isEncrypted;
    };

    this.setStorageProvider = (storageProviderName, ...args) => {
        if (!storageProviders[storageProviderName]) {
            throw new Error(storageProviderName + " is not registered! Did you forget to register it?");
        }
        config.storageProvider = storageProviders[storageProviderName](...args);
    };

    this.getStorageProvider = () => {
        return config.storageProvider;
    };

    this.setFsAdapter = (fsAdapterName, ...args) => {
        config.fsAdapter = fsAdapters[fsAdapterName](...args);
    };

    this.getFsAdapter = () => {
        return config.fsAdapter;
    };

    this.getBarMapId = () => {
        if (config.seed) {
            return config.seed.getKey();
        }
    };

    this.setEncryptionAlgorithm = (algorithm) => {
        if (!config.encryption) {
            config.encryption = {};
        }

        config.encryption.algorithm = algorithm;
    };

    this.getEncryptionAlgorithm = () => {
        if (!config.encryption) {
            return;
        }
        return config.encryption.algorithm;
    };

    this.setEncryptionOptions = (options) => {
        if (!config.encryption) {
            config.encryption = {};
        }

        config.encryption.encOptions = options;
    };

    this.getEncryptionOptions = () => {
        if (!config.encryption) {
            return;
        }
        return config.encryption.encOptions;
    };

    this.setCompressionAlgorithm = (algorithm) => {
        if (!config.compression) {
            config.compression = {};
        }

        config.compression.algorithm = algorithm;
    };

    this.getCompressionAlgorithm = () => {
        if (!config.compression) {
            return;
        }

        return config.compression.algorithm;

    };

    this.setCompressionOptions = (options) => {
        if (!config.compression) {
            config.compression = {};
        }

        config.compression.options = options;
    };

    this.getCompressionOptions = () => {
        if (!config.compression) {
            return;
        }
        return config.compression.options;
    };

    this.setAuthTagLength = (authTagLength = 16) => {
        const encOptions = this.getEncryptionOptions();
        if (!encOptions) {
            config.encryption.encOptions = {};
        }

        config.encryption.encOptions.authTagLength = authTagLength;
    };

    this.getAuthTagLength = () => {
        if (!config.encryption || !config.encryption.encOptions) {
            return;
        }

        return config.encryption.encOptions.authTagLength;
    };

    this.setSeedEndpoint = (endpoint) => {
        config.seedEndpoint = endpoint;
    };

    this.setSeedKey = (key) => {
        config.seed.setKey(key);
    };

    this.getSeedKey = () => {
        if (config.seed) {
            return config.seed.getKey();
        }
    };

    this.setSeed = (compactSeed) => {
        config.seed = new Seed(compactSeed);
        const endpoint = config.seed.getEndpoint();
        if (endpoint) {
            this.setStorageProvider("EDFSBrickStorage", endpoint);
        }
    };

    this.getSeed = () => {
        loadSeed();
        if (config.seed) {
            return config.seed.getCompactForm();
        }
    };

    this.getMapEncryptionKey = () => {
        loadSeed();
        if (!config.seed) {
            return;
        }

        if (!config.encryption) {
            return;
        }

        return config.seed.getEncryptionKey(config.encryption.algorithm);
    };

    this.generateSeed = () => {
        if (!config.seedEndpoint && config.seed) {
            config.seedEndpoint = config.seed.getEndpoint();
        }
        config.seed = new Seed(undefined, config.seedEndpoint);
    };

    this.setCache = (cacheInstance) => {
        cache = cacheInstance;
    };

    this.getCache = () => {
        return cache;
    };

    //--------------------------
    function loadSeed() {
        if (!config.seed) {
            config.seed = new Seed(undefined, config.seedEndpoint);
        }
    }
}

ArchiveConfigurator.prototype.registerStorageProvider = (storageProviderName, factory) => {
    storageProviders[storageProviderName] = factory;
};

ArchiveConfigurator.prototype.registerFsAdapter = (fsAdapterName, factory) => {
    fsAdapters[fsAdapterName] = factory;
};

module.exports = ArchiveConfigurator;

},{"./Seed":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Seed.js"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/BarMap.js":[function(require,module,exports){
(function (Buffer){
const Brick = require("./Brick");
const pathModule = "path";
let path;
try {
    path = require(pathModule);
} catch (err) {
} finally {
    if (typeof path === "undefined") {
        path = {sep: "/"};
    }
}

function BarMap(header) {
    header = header || {};
    const pskPath = require("swarmutils").path;
    let archiveConfig;
    let encryptionKey;

    this.addFileEntry = (path, bricks) => {
        if (!this.isEmpty(path)) {
            this.emptyList(path);
        }

        this.appendBricksToEntry(path, bricks);
    };

    this.appendBricksToEntry = (path, bricks) => {
        for (const data of bricks) {
            this.add(path, data);
        }
    }

    this.add = (filePath, brick) => {
        filePath = pskPath.normalize(filePath);
        if (filePath === "") {
            throw Error("Invalid path");
        }
        this.load();
        const pathSegments = filePath.split("/");
        __addFileRecursively(header, pathSegments, brick);

        function __addFileRecursively(barMapObj, splitPath, brick) {
            let fileName = splitPath.shift();
            if (fileName === "") {
                fileName = splitPath.shift();
            }

            if (!splitPath.length) {
                let checkSum;
                let hash;
                let key;

                if (brick instanceof Brick) {
                    checkSum = brick.getAdler32();
                    hash = brick.getHash();
                    key = brick.getTransformParameters() ? brick.getTransformParameters().key : undefined;
                } else {
                    checkSum = brick.checkSum;
                    hash = brick.hash;
                    key = brick.encryptionKey;
                }


                const brickObj = {
                    checkSum,
                    hash,
                };

                if (key) {
                    brickObj.key = key;
                }

                if (!barMapObj[fileName]) {
                    barMapObj[fileName] = [];
                }

                barMapObj[fileName].push(brickObj);
            } else {
                if (!barMapObj[fileName]) {
                    barMapObj[fileName] = {};
                }
                __addFileRecursively(barMapObj[fileName], splitPath, brick);
            }
        }
    };

    this.isInHeader = (filePath) => {
        return header[filePath] !== undefined;
    };

    this.removeBrick = (filePath, brickHash) => {
        let indexToRemove = header[filePath].findIndex(brickObj => brickObj.hash === brickHash);
        header[filePath].splice(indexToRemove, 1);
    };

    this.delete = (barPath) => {
        barPath = pskPath.normalize(barPath);

        function deletePath(targetObj, path) {
            if (path === "") {
                header = {};
            } else {
                delete targetObj[path];
            }
        }

        const pathSegments = barPath.split("/");
        let path = pathSegments.pop();
        deletePath(navigate(pathSegments.join("/")), path);
    };

    this.getBricksMeta = (filePath) => {
        const pathSegments = filePath.split("/");
        const fileName = pathSegments.pop();
        let fileBricks = navigate(pathSegments.join("/"));
        fileBricks = fileBricks[fileName];
        if (typeof fileBricks === "undefined") {
            throw Error(`Path <${filePath}> not found`);
        }
        if (!Array.isArray(fileBricks) && typeof fileBricks === "object") {
            throw Error(`Path <${filePath}> is a folder`);
        }

        return fileBricks;
    };

    this.getHashList = (filePath) => {
        filePath = pskPath.normalize(filePath);
        if (filePath === "") {
            throw Error(`Invalid path ${filePath}.`);
        }
        this.load();
        const pathSegments = filePath.split("/");

        return __getHashListRecursively(header, pathSegments);

        function __getHashListRecursively(barMapObj, pathSegments) {
            let folderName = pathSegments.shift();
            if (folderName === "") {
                folderName = pathSegments.shift();
            }
            if (barMapObj[folderName]) {
                if (pathSegments.length === 0) {
                    return barMapObj[folderName].map(brickObj => brickObj.hash);
                } else {
                    return __getHashListRecursively(barMapObj[folderName], pathSegments);
                }
            } else {
                throw Error(`Invalid path ${filePath}`);
            }
        }
    };

    this.getCheckSumList = (filePath) => {
        this.load();
        return header[filePath].map(brickObj => brickObj.checkSum);
    };

    this.isEmpty = (filePath) => {
        filePath = pskPath.normalize(filePath);
        this.load();

        if (filePath === "/") {
            return Object.keys(header).length === 0;
        } else {
            const pathSegments = filePath.split("/");
            return __checkIsEmptyRecursively(header, pathSegments);
        }

        function __checkIsEmptyRecursively(folderObj, pathSegments) {
            if (Object.keys(folderObj).length === 0) {
                return true;
            }

            let folderName = pathSegments.shift();
            if (folderName === "") {
                folderName = pathSegments.shift();
            }

            if (folderObj[folderName]) {
                if (pathSegments.length === 0) {
                    if (Array.isArray(folderObj[folderName])) {
                        return folderObj[folderName].length === 0;
                    } else {
                        return Object.keys(folderObj[folderName]).length === 0;
                    }
                } else {
                    return __checkIsEmptyRecursively(folderObj[folderName], pathSegments);
                }
            } else {
                return true;
            }
        }
    };

    this.emptyList = (filePath) => {
        filePath = pskPath.normalize(filePath);
        this.load();

        const pathSegments = filePath.split("/");
        __emptyListRecursively(header, pathSegments);

        function __emptyListRecursively(folderObj, pathSegments) {
            let folderName = pathSegments.shift();
            if (folderName === "") {
                folderName = pathSegments.shift();
            }

            if (folderObj[folderName]) {
                if (pathSegments.length === 0) {
                    if (Array.isArray(folderObj[folderName])) {
                        folderObj[folderName] = []
                    } else {
                        throw Error(`Invalid path ${filePath}`);
                    }
                } else {
                    __emptyListRecursively(folderObj[folderName], pathSegments);
                }
            }
        }
    };


    this.toBrick = () => {
        this.load();
        archiveConfig.setIsEncrypted(true);
        const brick = new Brick(archiveConfig);
        if (encryptionKey) {
            brick.setTransformParameters({key: encryptionKey});
        }
        brick.setRawData(Buffer.from(JSON.stringify(header)));
        return brick;
    };


    this.getFileList = (folderBarPath, recursive) => {
        if (typeof recursive === "undefined") {
            recursive = true;
        }
        folderBarPath = pskPath.normalize(folderBarPath);
        this.load();
        let files = [];

        function printFiles(targetObj, currentPath) {
            for (let prop in targetObj) {
                if (Array.isArray(targetObj[prop])) {
                    let filePath = pskPath.join(currentPath, prop);
                    files.push(filePath);
                } else {
                    if (typeof targetObj[prop] === "object") {
                        if (recursive === true) {
                            printFiles(targetObj[prop], pskPath.join(currentPath, prop));
                        }
                    } else {
                        throw Error("BarMap corrupted.");
                    }
                }
            }
        }

        printFiles(navigate(folderBarPath), "");
        return files;
    };

    function navigate(toPath) {
        let target = header;
        let segments = toPath.split("/");
        for (let i in segments) {
            let segment = segments[i];
            if (segment !== "") {
                if (typeof target[segment] !== "undefined") {
                    if (!Array.isArray(target[segment]) && typeof target[segment] === "object") {
                        target = target[segment];
                    } else {
                        if (Array.isArray(target[segment]) && i < segments.length) {
                            throw Error(`Path ${toPath} is not valid!`);
                        }
                    }
                } else {
                    return undefined;
                }
            }
        }

        return target;
    }

    this.getFolderList = (barPath, recursive) => {
        let folders = [];

        function printFolders(targetObj, currentPath) {
            for (let prop in targetObj) {
                if (typeof targetObj[prop] === "object" && !Array.isArray(targetObj[prop])) {
                    folders.push(pskPath.join(currentPath, prop));
                    if (recursive === true) {
                        printFolders(targetObj[prop], pskPath.join(currentPath, prop));
                    }
                } else {
                    if (!Array.isArray(targetObj[prop])) {
                        throw Error("BarMap corrupted.");
                    }
                }
            }
        }

        printFolders(navigate(barPath), "");
        return folders;
    };

    this.getTransformParameters = (brickMeta) => {
        this.load();
        if (typeof brickMeta === "undefined") {
            return encryptionKey ? {key: encryptionKey} : undefined;
        }

        const addTransformData = {};
        if (brickMeta.key) {
            addTransformData.key = Buffer.from(brickMeta.key);
        }

        return addTransformData;
    };

    this.load = () => {
        if (header instanceof Brick) {
            header.setConfig(archiveConfig);
            header.setTransformParameters({key: encryptionKey});
            header = JSON.parse(header.getRawData().toString());
        } else {
            if (Buffer.isBuffer(header)) {
                header = header.toString();
            }

            if (typeof header === "string") {
                header = JSON.parse(header);
            }
        }
    };

    this.setConfig = (config) => {
        archiveConfig = config;
    };

    this.getConfig = () => {
        return archiveConfig;
    };

    this.setEncryptionKey = (encKey) => {
        encryptionKey = encKey;
    };

    this.removeFile = (filePath) => {
        this.load();
        delete header[filePath];
    };
}

module.exports = BarMap;

}).call(this,require("buffer").Buffer)

},{"./Brick":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js","buffer":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js":[function(require,module,exports){
const crypto = require('pskcrypto');
const BrickTransformFactory = require("./transforms/BrickTransformFactory");
const transformFactory = new BrickTransformFactory();
const adler32 = require('adler32');

function Brick(config) {
    let rawData;
    let transformedData;
    let hash;
    let transformParameters;
    let transform = transformFactory.createBrickTransform(config);

    this.setConfig = (newConfig) => {
        config = newConfig;
        if (transform) {
            transform.setConfig(newConfig);
        } else {
            transform = transformFactory.createBrickTransform(config);
        }
    };

    this.createNewTransform = () => {
        transform = transformFactory.createBrickTransform(config);
        transformParameters = undefined;
        transformData();
    };

    this.getHash = () => {
        if (!hash) {
            hash = crypto.pskHash(this.getTransformedData()).toString("hex");
        }

        return hash;
    };

    this.getKey = () => {
        return config.getSeedKey();
    };

    this.setKey = (key) => {
        config.setSeedKey(key);
    };

    this.getSeed = () => {
        return config.getSeed().toString();
    };
    this.getAdler32 = () => {
        return adler32.sum(this.getTransformedData());
    };

    this.setRawData = function (data) {
        rawData = data;
        if (!transform) {
            transformedData = rawData;
        }
    };

    this.getRawData = () => {
        if (rawData) {
            return rawData;
        }

        if (transformedData) {
            if (!transform) {
                return transformedData;
            }

            rawData = transform.applyInverseTransform(transformedData, transformParameters);
            if (rawData) {
                return rawData;
            }

            return transformedData;
        }

        throw new Error("The brick does not contain any data.");
    };

    this.setTransformedData = (data) => {
        transformedData = data;
    };

    this.getTransformedData = () => {
        if (!transformedData) {
            transformData();
        }

        if (transformedData) {
            return transformedData;
        }

        if (rawData) {
            return rawData;
        }

        throw new Error("The brick does not contain any data.");
    };

    this.getTransformParameters = () => {
        if (!transformedData) {
            transformData();
        }
        return transformParameters;
    };

    this.setTransformParameters = (newTransformParams) => {
        if (!newTransformParams) {
            return;
        }

        if (!transformParameters) {
            transformParameters = newTransformParams;
            return;
        }

        Object.keys(newTransformParams).forEach(key => {
            transformParameters[key] = newTransformParams[key];
        });
    };

    this.getRawSize = () => {
        return rawData.length;
    };

    this.getTransformedSize = () => {
        if (!transformedData) {
            return rawData.length;
        }

        return transformedData.length;
    };

    this.getSummary = () => {
        let encryptionKey;
        const transformParameters = this.getTransformParameters();

        if (transformParameters) {
            encryptionKey = transformParameters.key;
        }

        return {
            hash: this.getHash(),
            checkSum: this.getAdler32(),
            encryptionKey
        };
    }

//----------------------------------------------- internal methods -----------------------------------------------------
    function transformData() {
        if (!transform) {
            throw new Error("transform undefined");
        }

        if (rawData) {
            transformedData = transform.applyDirectTransform(rawData, transformParameters);
            if (!transformedData) {
                transformedData = rawData;
            }
        }

        transformParameters = transform.getTransformParameters();
    }

}

module.exports = Brick;

},{"./transforms/BrickTransformFactory":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/BrickTransformFactory.js","adler32":"adler32","pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/BrickStorageService/Service.js":[function(require,module,exports){
(function (Buffer){
'use strict'

const pathModule = "path";
const path = require(pathModule);

const isStream = require("../../utils/isStream");
const stream = require('stream');

/**
 * Brick storage layer
 * Wrapper over EDFSBrickStorage
 *
 * @param {object} options
 * @param {Cache} options.cache
 * @param {number} options.bufferSize
 * @param {EDFSBrickStorage} options.storageProvider
 * @param {callback} options.brickFactoryCallback
 * @param {FSAdapter} options.fsAdapter
 * @param {callback} options.brickDataExtractorCallback
 * @param {callback} options.barMapConfiguratorCallback
 */
function Service(options) {
    options = options || {};

    this.cache = options.cache;
    this.bufferSize = parseInt(options.bufferSize, 10);
    this.storageProvider = options.storageProvider;
    this.brickFactoryCallback = options.brickFactoryCallback;
    this.fsAdapter = options.fsAdapter;
    this.brickDataExtractorCallback = options.brickDataExtractorCallback;
    this.barMapConfiguratorCallback = options.barMapConfiguratorCallback;

    if (isNaN(this.bufferSize) || this.bufferSize < 1) {
        throw new Error('Buffer size is required');
    }

    if (!this.storageProvider) {
        throw new Error('Storage provider is required');
    }

    if (typeof this.brickFactoryCallback !== 'function') {
        throw new Error('A brick factory callback is required');
    }

    if (!this.fsAdapter) {
        throw new Error('A file system adapter is required');
    }

    if (typeof this.brickDataExtractorCallback !== 'function') {
        throw new Error('A Brick data extractor callback is required');
    }

    if (typeof this.barMapConfiguratorCallback !== 'function') {
        throw new Error('A BarMap configurator callback is required');
    }

    /**
     * @param {*} key
     * @return {Boolean}
     */
    const hasInCache = (key) => {
        if (!this.cache) {
            return false;
        }

        return this.cache.has(key);
    }

    /**
     * @param {*} key
     * @param {*} value
     */
    const storeInCache = (key, value) => {
        if (!this.cache) {
            return;
        }

        this.cache.set(key, value);
    }

    /**
     * Creates writable stream to a EDFSBrickStorage instance
     *
     * @param {EDFSBrickStorage} storageProvider
     * @param {callback} beforeCopyCallback
     * @return {stream.Writable}
     */
    const createBricksWritableStream = (storageProvider, beforeCopyCallback) => {
        return ((storageProvider, beforeCopyCallback) => {

            const writableStream = new stream.Writable({
                write(brickContainer, encoding, callback) {
                    let { brick, brickMeta } = brickContainer;
                    if (typeof beforeCopyCallback === 'function') {
                        brick = beforeCopyCallback(brickMeta, brick);
                    }

                    storageProvider.putBrick(brick, (err, digest) => {
                        if (err) {
                            return callback(err);
                        }

                        const brickSummary = brick.getSummary();
                        brickSummary.digest = digest;
                        this.bricksSummary.push(brickSummary);

                        callback();
                    })
                },
                objectMode: true
            });

            writableStream.bricksSummary = [];
            return writableStream;

        })(storageProvider, beforeCopyCallback);
    }

    /**
     * Create a readable stream of Brick objects
     * retrieved from EDFSBrickStorage
     *
     * @param {Array<object>} bricksMeta
     * @return {stream.Readable}
     */
    const createBricksReadableStream = (bricksMeta) => {
        return ((bricksMeta) => {

            let brickIndex = 0;

            const readableStream = new stream.Readable({
                read(size) {
                    if (!bricksMeta.length) {
                        return this.push(null);
                    }
                    if (brickIndex < bricksMeta.length) {
                        this.getBrick(brickIndex++);
                    }
                },
                objectMode: true
            });

            // Get a brick and push it into the stream
            const self = this;
            readableStream.getBrick = function (brickIndex) {
                const brickMeta = bricksMeta[brickIndex];
                self.storageProvider.getBrick(brickMeta.hash, (err, brick) => {
                    if (err) {
                        this.destroy(err);
                        return;
                    }

                    this.push({
                        brickMeta,
                        brick
                    });

                    if (brickIndex >= (bricksMeta.length - 1)) {
                        this.push(null);
                    }
                });
            };

            return readableStream;

        })(bricksMeta);
    }

    /**
     * Retrieves a Brick from storage and converts
     * it into a Buffer
     *
     * @param {object} brickMeta
     * @param {callback} callback
     */
    const getBrickAsBuffer = (brickMeta, callback) => {
        if (hasInCache(brickMeta.hash)) {
            const data = this.cache.get(brickMeta.hash);
            return callback(undefined, data);
        }

        this.storageProvider.getBrick(brickMeta.hash, (err, brick) => {
            if (err) {
                return callback(err);
            }

            const data = this.brickDataExtractorCallback(brickMeta, brick);
            storeInCache(brickMeta.hash, data);
            callback(undefined, data);
        });
    };

    /**
     * Counts the number of blocks in a file
     *
     * @param {string} filePath
     * @param {callback} callback
     */
    const getFileBlocksCount = (filePath, callback) => {
        this.fsAdapter.getFileSize(filePath, (err, size) => {
            if (err) {
                return callback(err);
            }

            let blocksCount = Math.floor(size / this.bufferSize);
            if (size % this.bufferSize > 0) {
                ++blocksCount;
            }

            callback(undefined, blocksCount);
        })
    };

    /**
     * Creates a Brick from a Buffer
     * and saves it into brick storage
     *
     * @param {Buffer} data
     * @param {callback} callback
     */
    const convertDataBlockToBrick = (data, callback) => {
        const brick = this.brickFactoryCallback();
        brick.setRawData(data);

        this.storageProvider.putBrick(brick, (err, digest) => {
            if (err) {
                return callback(err);
            }

            const brickSummary = brick.getSummary();
            brickSummary.digest = digest;

            return callback(undefined, brickSummary);
        });

    };

    /**
     * Recursively breaks a buffer into Brick objects and
     * stores them into storage
     *
     * @param {Array<object>} resultContainer
     * @param {Buffer} buffer
     * @param {number} blockIndex
     * @param {number} blockSize
     * @param {callback} callback
     */
    const convertBufferToBricks = (resultContainer, buffer, blockIndex, blockSize, callback) => {
        let blocksCount = Math.floor(buffer.length / blockSize);
        if ((buffer.length % blockSize) > 0) {
            ++blocksCount;
        }

        const blockData = buffer.slice(blockIndex * blockSize, (blockIndex + 1) * blockSize);

        convertDataBlockToBrick(blockData, (err, result) => {
            if (err) {
                return callback(err);
            }

            resultContainer.push(result);
            ++blockIndex;

            if (blockIndex < blocksCount) {
                return convertBufferToBricks(resultContainer, buffer, blockIndex, blockSize, callback);
            }

            return callback();
        });
    };

    /**
     * Copy the contents of a file into brick storage
     *
     * @param {Array<object>} resultContainer
     * @param {string} filePath
     * @param {number} blockIndex
     * @param {number} blocksCount
     * @param {callback} callback
     */
    const convertFileToBricks = (resultContainer, filePath, blockIndex, blocksCount, callback) => {
        if (typeof blocksCount === 'function') {
            callback = blocksCount;
            blocksCount = blockIndex;
            blockIndex = 0;
        }

        const blockOffset = blockIndex * this.bufferSize;
        const blockEndOffset = (blockIndex + 1) * this.bufferSize - 1;
        this.fsAdapter.readBlockFromFile(filePath, blockOffset, blockEndOffset, (err, data) => {
            if (err) {
                return callback(err);
            }

            convertDataBlockToBrick(data, (err, result) => {
                if (err) {
                    return callback(err);
                }

                resultContainer.push(result);
                ++blockIndex;

                if (blockIndex < blocksCount) {
                    return convertFileToBricks(resultContainer, filePath, blockIndex, blocksCount, callback);
                }

                return callback();
            })
        })
    };

    /**
     * Stores a Buffer as Bricks into brick storage
     *
     * @param {Buffer} buffer
     * @param {number|callback} bufferSize
     * @param {callback|undefined} callback
     */
    this.ingestBuffer = (buffer, bufferSize, callback) => {
        if (typeof bufferSize === 'function') {
            callback = bufferSize;
            bufferSize = this.bufferSize;
        }
        const bricksSummary = [];

        convertBufferToBricks(bricksSummary, buffer, 0, bufferSize, (err) => {
            if (err) {
                return callback(err);
            }

            callback(undefined, bricksSummary);
        });
    };

    /**
     * Reads a stream of data into multiple Brick objects
     * stored in brick storage
     *
     * @param {stream.Readable} stream
     * @param {callback}
     */
    this.ingestStream = (stream, callback) => {
        let bricksSummary = [];
        stream.on('data', (chunk) => {
            if (typeof chunk === 'string') {
                chunk = Buffer.from(chunk);
            }

            stream.pause();
            this.ingestBuffer(chunk, chunk.length, (err, summary) => {
                if (err) {
                    stream.destroy(err);
                    return;
                }
                bricksSummary = bricksSummary.concat(summary);
                stream.resume();
            });
        });
        stream.on('error', (err) => {
            callback(err);
        });
        stream.on('end', () => {
            callback(undefined, bricksSummary);
        })
    };

    /**
     * @param {string|Buffer|stream.Readable} data
     * @param {callback} callback
     */
    this.ingestData = (data, callback) => {
        if (typeof data === 'string') {
            data = Buffer.from(data);
        }

        if (!Buffer.isBuffer(data) && !isStream.isReadable(data)) {
            return callback(Error(`Type of data is ${typeof data}. Expected Buffer or Stream.Readable`));
        }

        if (Buffer.isBuffer(data)) {
            return this.ingestBuffer(data, callback);
        }

        return this.ingestStream(data, callback);
    };

    /**
     * Copy the contents of a file into brick storage
     *
     * @param {string} filePath
     * @param {callback} callback
     */
    this.ingestFile = (filePath, callback) => {
        const bricksSummary = [];

        getFileBlocksCount(filePath, (err, blocksCount) => {
            if (err) {
                return callback(err);
            }

            convertFileToBricks(bricksSummary, filePath, blocksCount, (err, result) => {
                if (err) {
                    return callback(err);
                }

                callback(undefined, bricksSummary);
            });
        });
    };

    /**
     * Copy the contents of multiple files into brick storage
     *
     * @param {Array<string>} filePath
     * @param {callback} callback
     */
    this.ingestFiles = (files, callback) => {
        const bricksSummary = {};

        const ingestFilesRecursive = (files, callback) => {
            if (!files.length) {
                return callback(undefined, bricksSummary);
            }

            const filePath = files.pop();
            const filename = path.basename(filePath);

            this.ingestFile(filePath, (err, result) => {
                if (err) {
                    return callback(err);
                }

                bricksSummary[filename] = result;

                ingestFilesRecursive(files, callback);
            });
        };

        ingestFilesRecursive(files, callback);
    };

    /**
     * Copy the contents of folder into brick storage
     *
     * @param {string} folderPath
     * @param {callback} callback
     */
    this.ingestFolder = (folderPath, callback) => {
        const bricksSummary = {};
        const filesIterator = this.fsAdapter.getFilesIterator(folderPath);

        const iteratorHandler = (err, filename, dirname) => {
            if (err) {
                return callback(err);
            }

            if (typeof filename === 'undefined') {
                return callback(undefined, bricksSummary);
            }

            const filePath = path.join(dirname, filename);
            this.ingestFile(filePath, (err, result) => {
                if (err) {
                    return callback(err);
                }

                bricksSummary[filename] = result;
                filesIterator.next(iteratorHandler);
            });
        };

        filesIterator.next(iteratorHandler);
    };

    /**
     * Retrieve all the Bricks identified by `bricksMeta`
     * from storage and create a Buffer using their data
     *
     * @param {Array<object>} bricksMeta
     * @param {callback} callback
     */
    this.createBufferFromBricks = (bricksMeta, callback) => {
        let buffer = Buffer.alloc(0);

        const getBricksAsBufferRecursive = (index, callback) => {
            const brickMeta = bricksMeta[index];

            getBrickAsBuffer(brickMeta, (err, data) => {
                if (err) {
                    return callback(err);
                }

                buffer = Buffer.concat([buffer, data]);
                ++index;

                if (index < bricksMeta.length) {
                    return getBricksAsBufferRecursive(index, callback);
                }

                callback(undefined, buffer);
            });
        };

        getBricksAsBufferRecursive(0, callback);
    }

    /**
     * Retrieve all the Bricks identified by `bricksMeta`
     * from storage and create a readable stream
     * from their data
     *
     * @param {Array<object>} bricksMeta
     * @param {callback} callback
     */
    this.createStreamFromBricks = (bricksMeta, callback) => {
        let brickIndex = 0;

        const readableStream = new stream.Readable({
            read(size) {
                if (!bricksMeta.length) {
                    return this.push(null);
                }

                if (brickIndex < bricksMeta.length) {
                    this.readBrickData(brickIndex++);
                }
            }
        });

        // Get a brick and push it into the stream
        readableStream.readBrickData = function (brickIndex) {
            const brickMeta = bricksMeta[brickIndex];
            getBrickAsBuffer(brickMeta, (err, data) => {
                if (err) {
                    this.destroy(err);
                    return;
                }

                this.push(data);

                if (brickIndex >= (bricksMeta.length - 1)) {
                    this.push(null);
                }
            });
        };

        callback(undefined, readableStream);
    }

    /**
     * Retrieve all the Bricks identified by `bricksMeta`
     * and store their data into a file
     *
     * @param {string} filePath
     * @param {Array<object>} bricksMeta
     * @param {callback} callback
     */
    this.createFileFromBricks = (filePath, bricksMeta, callback) => {
        const getBricksAsBufferRecursive = (index, callback) => {
            const brickMeta = bricksMeta[index];

            getBrickAsBuffer(brickMeta, (err, data) => {
                if (err) {
                    return callback(err);
                }

                this.fsAdapter.appendBlockToFile(filePath, data, (err) => {
                    if (err) {
                        return callback(err);
                    }

                    ++index;

                    if (index < bricksMeta.length) {
                        return getBricksAsBufferRecursive(index, callback);
                    }

                    callback();
                });
            });
        };

        getBricksAsBufferRecursive(0, callback);
    }

    /**
     * Copy all the Bricks identified by `bricksList`
     * into another storage provider
     *
     * @param {object} bricksList
     * @param {object} options
     * @param {FSAdapter} options.dstStorage
     * @param {callback} options.beforeCopyCallback
     * @param {callback} callback
     */
    this.copyBricks = (bricksList, options, callback) => {
        const bricksSetKeys = Object.keys(bricksList);
        const newBricksSetKeys = {};

        const copyBricksRecursive = (callback) => {
            if (!bricksSetKeys.length) {
                return callback();
            }

            const setKey = bricksSetKeys.shift();
            const bricksMeta = bricksList[setKey];

            const srcStream = createBricksReadableStream(bricksMeta);
            const dstStream = createBricksWritableStream(options.dstStorage, options.beforeCopyCallback);

            srcStream.on('error', (err) => {
                callback(err);
                dstStream.destroy(err);
            });

            dstStream.on('finish', () => {
                newBricksSetKeys[setKey] = dstStream.bricksSummary;
                dstStream.destroy();
                copyBricksRecursive(callback);
            });

            srcStream.pipe(dstStream);
        };

        copyBricksRecursive((err) => {
            if (err) {
                return callback(err);
            }

            callback(undefined, newBricksSetKeys);
        });
    };

    /**
     * @param {string} hash
     * @param {callback} callback
     */
    this.getBarMap = (hash, callback) => {
        if (hash && hasInCache(hash)) {
            const map = this.cache.get(hash);
            this.storageProvider.setBarMap(map);
            return callback(undefined, map);
        }

        this.storageProvider.getBarMap(hash, (err, map) => {
            if (err) {
                return callback(err);
            }

            map = this.barMapConfiguratorCallback(map);

            if (hash) {
                storeInCache(hash, map);
            }

            this.storageProvider.setBarMap(map);
            callback(undefined, map);
        })
    }

    /**
     * @param {BarMap} barMap
     * @param {callback} callback
     */
    this.putBarMap = (barMap, callback) => {
        this.storageProvider.putBarMap(barMap, callback);
    }
}

module.exports = Service;

}).call(this,require("buffer").Buffer)

},{"../../utils/isStream":"/home/travis/build/PrivateSky/privatesky/modules/bar/utils/isStream.js","buffer":false,"stream":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/BrickStorageService/index.js":[function(require,module,exports){
'use strict'

module.exports = {
    Service: require('./Service')
};

},{"./Service":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/BrickStorageService/Service.js"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FileBrickStorage.js":[function(require,module,exports){
(function (Buffer){
const BarMap = require("./obsolete/FileBarMap");
const util = require("../utils/utilities");
const fs = require("fs");
const Brick = require("./Brick");
const AsyncDispatcher = require("../utils/AsyncDispatcher");

function FileBrickStorage(filePath) {

    let isFirstBrick = true;
    let map;
    let mapOffset;

    this.setBarMap = (barMap) => {
        map = barMap;
    };

    this.putBrick = (brick, callback) => {
        if (isFirstBrick) {
            isFirstBrick = false;
            const writeStream = fs.createWriteStream(filePath, {start: util.getBarMapOffsetSize()});
            writeStream.on("error", (err) => {
                return callback(err);
            });

            writeStream.write(brick.getTransformedData(), callback);
        } else {
            fs.appendFile(filePath, brick.getTransformedData(), callback);
        }
    };

    this.getBrick = (brickId, callback) => {
        this.getBarMap((err, barMap) => {
            if (err) {
                return callback(err);
            }
            let brickOffsets = [];
            const fileList = barMap.getFileList();
            fileList.forEach(file => {
                brickOffsets = brickOffsets.concat(barMap.getHashList(file));
            });

            const brickIndex = brickOffsets.findIndex(el => {
                return el === brickId;
            });

            let nextBrickId = brickOffsets[brickIndex + 1];
            if (!nextBrickId) {
                nextBrickId = Number(mapOffset);
            }

            readBrick(brickId, nextBrickId, callback);
        });

    };

    this.deleteFile = (fileName, callback) => {
        this.getBarMap((err, barMap) => {
            if (err) {
                return callback(err);
            }

            barMap.removeFile(fileName);
            this.putBarMap(barMap, callback);
        });
    };


    this.putBarMap = (barMap, callback) => {
        map = barMap;
        readBarMapOffset((err, offset) => {
            if(offset) {
                offset = Number(offset);
                fs.truncate(filePath, offset, (err) => {
                    if (err) {
                        return callback(err);
                    }

                    __writeBarMap(offset);
                });
            }else{
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        return callback(err);
                    }

                    const barMapOffset = stats.size;

                    const bufferBarMapOffset = Buffer.alloc(util.getBarMapOffsetSize());
                    bufferBarMapOffset.writeBigUInt64LE(BigInt(barMapOffset));
                    mapOffset = barMapOffset;
                    const offsetWriteStream = fs.createWriteStream(filePath, {flags: "r+", start: 0});

                    offsetWriteStream.on("error", (err) => {
                        return callback(err);
                    });

                    offsetWriteStream.write(bufferBarMapOffset, (err) => {
                        if (err) {
                            return callback(err);
                        }

                        __writeBarMap(barMapOffset);
                    });
                });
            }
        });

        function __writeBarMap(offset) {
            const mapWriteStream = fs.createWriteStream(filePath, {flags: "r+", start: offset});
            mapWriteStream.on("error", (err) => {
                return callback(err);
            });

            const mapBrick = barMap.toBrick();
            mapBrick.setTransformParameters(barMap.getTransformParameters());
            mapWriteStream.write(mapBrick.getTransformedData(), callback);
        }

    };

    this.getBarMap = (mapDigest, callback) => {
        if (typeof mapDigest === "function") {
            callback = mapDigest;
        }

        if (map) {
            return callback(undefined, map);
        }

        readBarMap((err, barMap) => {
            if (err) {
                return callback(err);
            }

            map = barMap;
            callback(undefined, barMap);
        });
    };

    //------------------------------------------ Internal functions ---------------------------------------------------

    function readBarMapOffset(callback) {
        const readStream = fs.createReadStream(filePath, {start: 0, end: util.getBarMapOffsetSize() - 1});

        const buffer = Buffer.alloc(util.getBarMapOffsetSize());
        let offsetBuffer = 0;

        readStream.on("data", (chunk) => {
            chunk.copy(buffer, offsetBuffer);
            offsetBuffer += chunk.length;
        });

        readStream.on("end", () => {
            callback(undefined, buffer.readBigUInt64LE());
        });

        readStream.on("error", (err) => {
            return callback(err);
        });
    }

    function readBarMap(callback) {
        readBarMapOffset((err, barMapOffset) => {
            if (err) {
                if (err.code === "ENOENT") {
                    return callback(undefined, new BarMap());
                }

                return callback(err)
            }

            mapOffset = barMapOffset;
            const readStream = fs.createReadStream(filePath, {start: Number(barMapOffset)});
            let barMapData = Buffer.alloc(0);

            readStream.on("data", (chunk) => {
                barMapData = Buffer.concat([barMapData, chunk]);
            });

            readStream.on("error", (err) => {
                return callback(err);
            });

            readStream.on("end", () => {
                const mapBrick = new Brick();
                mapBrick.setTransformedData(barMapData);
                callback(undefined, new BarMap(mapBrick));
            });
        });
    }

    function readBrick(brickOffsetStart, brickOffsetEnd, callback) {
        const readStream = fs.createReadStream(filePath, {start: brickOffsetStart, end: brickOffsetEnd - 1});
        let brickData = Buffer.alloc(0);

        readStream.on("data", (chunk) => {
            brickData = Buffer.concat([brickData, chunk]);
        });

        readStream.on("error", (err) => {
            return callback(err);
        });

        readStream.on("end", () => {
            const brick = new Brick();
            brick.setTransformedData(brickData);
            callback(undefined, brick);
        });
    }
}

module.exports = {
    createFileBrickStorage(filePath) {
        return new FileBrickStorage(filePath);
    }
};

}).call(this,require("buffer").Buffer)

},{"../utils/AsyncDispatcher":"/home/travis/build/PrivateSky/privatesky/modules/bar/utils/AsyncDispatcher.js","../utils/utilities":"/home/travis/build/PrivateSky/privatesky/modules/bar/utils/utilities.js","./Brick":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js","./obsolete/FileBarMap":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/obsolete/FileBarMap.js","buffer":false,"fs":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FolderBrickStorage.js":[function(require,module,exports){
const fs = require("fs");
const path = require("path");
const BarMap = require("./BarMap");
const Brick = require("./Brick");

function FolderBrickStorage(location) {
    let map;

    this.setBarMap = (barMap) => {
        map = barMap;
    };

    this.putBrick = (brick, callback) => {
        const writeStream = fs.createWriteStream(path.join(location, brick.getHash()));
        writeStream.write(brick.getTransformedData(), (...args) => {
            writeStream.end();
            callback(...args);
        });
    };

    this.getBrick = (brickHash, callback) => {
        fs.readFile(path.join(location, brickHash), (err, brickData) => {
            if (err) {
                return callback(err);
            }

            const brick = new Brick();
            brick.setTransformedData(brickData);
            callback(err, brick);
        });
    };

    this.deleteFile = (filePath, callback) => {
        this.getBarMap((err, barMap) => {
            if (err) {
                return callback(err);
            }

            fs.unlink(path.join(location, barMap.toBrick().getHash()), (err) => {
                if (err) {
                    return callback(err);
                }

                barMap.removeFile(filePath);
                this.putBarMap(barMap, callback);
            });
        });
    };

    this.putBarMap = (barMap, callback) => {
        map = barMap;
        const barMapBrick = barMap.toBrick();
        barMapBrick.setTransformParameters(barMap.getTransformParameters());
       
        let brickId = barMapBrick.getKey();
        if (!brickId) {
            brickId = barMapBrick.getHash();
        }

        barMapBrick.setKey(brickId);
        const writeStream = fs.createWriteStream(path.join(location, brickId));
        writeStream.write(barMapBrick.getTransformedData(), (err) => {
            writeStream.end();
            callback(err, barMapBrick.getSeed());
        });
    };

    this.getBarMap = (mapDigest, callback) => {
        if (typeof mapDigest === "function") {
            callback = mapDigest;
            mapDigest = undefined;
        }

        if (map) {
            return callback(undefined, map);
        }

        if (typeof mapDigest === "undefined") {
            return callback(undefined, new BarMap());
        }

        this.getBrick(mapDigest, (err, mapBrick) => {
            if (err) {
                return callback(err);
            }

            const barMap = new BarMap(mapBrick);
            map = barMap;
            callback(undefined, barMap);
        });
    }
}

module.exports = {
    createFolderBrickStorage(location) {
        return new FolderBrickStorage(location);
    }
};

},{"./BarMap":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/BarMap.js","./Brick":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js","fs":false,"path":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Seed.js":[function(require,module,exports){
(function (Buffer){
const crypto = require("pskcrypto");
const base58 = require("./base58");

function Seed(compactSeed, endpoint, key) {
    let seed;
    const keyLen = 32;
    init();

    this.getCompactForm = () => {
        if (!seed) {
            throw Error("Cannot return seed");
        }

        return generateCompactForm(seed);
    };

    this.getEndpoint = () => {
        if (!seed) {
            throw Error("Cannot retrieve endpoint");
        }

        return seed.endpoint;
    };

    this.getAnchorURL = () => {
        if (!seed.key) {
            return;
        }
        return seed.endpoint + "/" + crypto.pskHash(seed.key, "hex");
    };

    this.getKey = () => {
        return crypto.pskHash(seed.key, "hex");
    };
    this.setKey = (key) => {
        seed.key = key;
    };

    this.getEncryptionKey = (algorithm) => {
        return crypto.deriveKey(algorithm, generateCompactForm(seed));
    };

    //--------------------------------------- internal methods --------------------------------------------
    function init() {
        if (!compactSeed) {
            seed = create();
        } else {
            seed = load(compactSeed);
        }
    }

    function create() {
        const localSeed = {};
        localSeed.key = key;
        if (!key) {
            //Bugfix: randomBytes in browser returns an Uint8Array object that has a wrong constructor and prototype
            //that is why we create a new instance of Buffer/Uint8Array based on the result of randomBytes
            localSeed.key = Buffer.from(crypto.randomBytes(keyLen));
            //TODO: why don't we use ID Generator from swarmutils?
        }

        if (endpoint) {
            localSeed.endpoint = endpoint;
        } else {
            throw Error("The SEED could not be created because an endpoint was not provided.")
        }

        return localSeed;
    }

    function generateCompactForm(expandedSeed) {
        if (typeof expandedSeed === "string") {
            return expandedSeed;
        }

        if (!expandedSeed.key) {
            throw Error("The seed does not contain an id");
        }
        let compactSeed = expandedSeed.key.toString("hex");
        if (expandedSeed.endpoint) {
            compactSeed += '|' + expandedSeed.endpoint.toString();
        }

        return base58.encode(compactSeed);
    }

    function load(compactFormSeed) {
        if (typeof compactFormSeed === "undefined") {
            throw new Error(`Expected type string or Buffer. Received undefined`);
        }

        if (typeof compactFormSeed !== "string") {
            if (typeof compactFormSeed === "object" && !Buffer.isBuffer(compactFormSeed)) {
                compactFormSeed = Buffer.from(compactFormSeed);
            }

            compactFormSeed = compactFormSeed.toString();
        }

        const localSeed = {};
        const splitCompactSeed = base58.decode(compactFormSeed).toString().split('|');
        localSeed.key = Buffer.from(splitCompactSeed[0], "hex");

        if (splitCompactSeed[1] && splitCompactSeed[1].length > 0) {
            localSeed.endpoint = splitCompactSeed[1];
        } else {
            throw new Error('Cannot find endpoint in compact seed');
        }

        return localSeed;
    }
}

module.exports = Seed;


}).call(this,require("buffer").Buffer)

},{"./base58":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/base58.js","buffer":false,"pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/base58.js":[function(require,module,exports){
(function (Buffer){
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
}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/obsolete/FileBarMap.js":[function(require,module,exports){
(function (Buffer){
const Brick = require("../Brick");
const util = require("../../utils/utilities");
const pathModule = "path";
const path = require(pathModule);

function FileBarMap(header) {
    header = header || {};

    let brickOffset = util.getBarMapOffsetSize();
    let archiveConfig;
    let encryptionKey;

    this.addFileEntry = (path, bricks) => {
        this.appendBricksToEntry(path, bricks);
    };

    this.appendBricksToEntry = (path, bricks) => {
        for (const data of bricks) {
            this.add(path, data);
        }
    }

    this.add = (filePath, brick) => {
        filePath = filePath.split(path.sep).join(path.posix.sep);
        this.load();
        if (typeof header[filePath] === "undefined") {
            header[filePath] = [];
        }

        const brickObj = {
            checkSum: brick.getAdler32(),
            offset: brickOffset,
            hash: brick.getHash()
        };

        const encKey = brick.getTransformParameters() ? brick.getTransformParameters().key : undefined;
        if (encKey) {
            brickObj.key = encKey;
        }

        header[filePath].push(brickObj);
        brickOffset += brick.getTransformedSize();
    };

    this.getHashList = (filePath) => {
        this.load();
        return header[filePath].map(brickObj => brickObj.offset);
    };

    this.getFileList = (folderBarPath) => {
        this.load();
        if (!folderBarPath) {
            return Object.keys(header);
        }
        return Object.keys(header).filter(fileName => fileName.includes(folderBarPath));
    };

    this.getDictionaryObject = () => {
        let objectDict = {};
        Object.keys(header).forEach((fileName) => {
            let brickObjects = header[fileName];
            for (let j = 0; j < brickObjects.length; j++) {
                if (typeof objectDict[brickObjects[j]['checkSum']] === 'undefined') {
                    objectDict[brickObjects[j]['checkSum']] = [];
                }
                objectDict[brickObjects[j]['checkSum']].push(brickObjects[j]['hash']);
            }
        });
        return objectDict;
    };

    this.getTransformParameters = (brickId) => {
        if (!brickId) {
            return encryptionKey ? {key: encryptionKey} : {};
        }

        this.load();
        let bricks = [];
        const files = this.getFileList();

        files.forEach(filePath => {
            bricks = bricks.concat(header[filePath]);
        });

        const brickObj = bricks.find(brick => {
            return brick.offset === brickId;
        });

        const addTransformData = {};
        if (brickObj.key) {
            addTransformData.key = Buffer.from(brickObj.key);
        }

        return addTransformData;
    };

    this.toBrick = () => {
        this.load();
        const brick = new Brick(archiveConfig);
        brick.setTransformParameters({key: encryptionKey});
        brick.setRawData(Buffer.from(JSON.stringify(header)));
        return brick;
    };

    this.load = () => {
        if (header instanceof Brick) {
            header.setConfig(archiveConfig);
            if (encryptionKey) {
                header.setTransformParameters({key: encryptionKey});
            }
            header = JSON.parse(header.getRawData().toString());
        }
    };

    this.setConfig = (config) => {
        archiveConfig = config;
    };

    this.getConfig = () => {
        return archiveConfig;
    };

    this.setEncryptionKey = (encKey) => {
        encryptionKey = encKey;
    };

    this.removeFile = (filePath) => {
        this.load();
        delete header[filePath];
    };
}

module.exports = FileBarMap;

}).call(this,require("buffer").Buffer)

},{"../../utils/utilities":"/home/travis/build/PrivateSky/privatesky/modules/bar/utils/utilities.js","../Brick":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js","buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/BrickTransform.js":[function(require,module,exports){
(function (Buffer){
function BrickTransform(transformGenerator) {
    let directTransform;
    let inverseTransform;

    this.getTransformParameters = () => {
        return directTransform ? directTransform.transformParameters : undefined;
    };

    this.applyDirectTransform = (data, transformParameters) => {
        if (!directTransform) {
            directTransform = transformGenerator.createDirectTransform(transformParameters);
        }

        if (!directTransform) {
            return undefined;
        }

        let transformedData = directTransform.transform(data);

        if(directTransform.transformParameters){
            if (directTransform.transformParameters.iv) {
                transformedData = Buffer.concat([transformedData, directTransform.transformParameters.iv]);
            }

            if (directTransform.transformParameters.aad) {
                transformedData = Buffer.concat([transformedData, directTransform.transformParameters.aad]);
            }

            if (directTransform.transformParameters.tag) {
                transformedData = Buffer.concat([transformedData, directTransform.transformParameters.tag]);
            }
        }

        return transformedData;
    };

    this.applyInverseTransform = (data, transformParameters) => {
        const inverseTransformParams = transformGenerator.getInverseTransformParameters(data);
        if(inverseTransformParams.params) {
            Object.keys(inverseTransformParams.params).forEach(param => transformParameters[param] = inverseTransformParams.params[param]);
        }

        if (!inverseTransform) {
            inverseTransform = transformGenerator.createInverseTransform(transformParameters);
        }

        return inverseTransform ? inverseTransform.transform(inverseTransformParams.data) : undefined;
    };
}

module.exports = BrickTransform;


}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/BrickTransformFactory.js":[function(require,module,exports){
const CompressionGenerator = require("./CompressionGenerator");
const EncryptionGenerator= require("./EncryptionGenerator");
const CompressionEncryptionGenerator = require("./CompressionEncryptionGenerator");
const BrickTransform = require("./BrickTransform");

function BrickTransformFactory() {
    this.createBrickTransform = function (config) {
        if (!config) {
            return;
        }

        const encryption = config.getEncryptionAlgorithm();
        const compression = config.getCompressionAlgorithm();

        let generator;
        if (!encryption && !compression) {
            return;
        }

        if (compression) {
            if (encryption) {
                generator = new CompressionEncryptionGenerator(config);
            } else {
                generator = new CompressionGenerator(config);
            }
        }else{
            generator = new EncryptionGenerator(config);
        }

        return new BrickTransform(generator);
    }
}

module.exports = BrickTransformFactory;


},{"./BrickTransform":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/BrickTransform.js","./CompressionEncryptionGenerator":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/CompressionEncryptionGenerator.js","./CompressionGenerator":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/CompressionGenerator.js","./EncryptionGenerator":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/EncryptionGenerator.js"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/CompressionEncryptionGenerator.js":[function(require,module,exports){
const CompressionGenerator = require("./CompressionGenerator");
const EncryptionGenerator = require("./EncryptionGenerator");

function CompressionEncryptionGenerator(config) {
    let compressionGenerator = new CompressionGenerator(config);
    let encryptionGenerator = new EncryptionGenerator(config);

    this.getInverseTransformParameters = (transformedData) => {
        return encryptionGenerator.getInverseTransformParameters(transformedData);
    };

    this.createDirectTransform = (transformParameters) => {
        const compression = compressionGenerator.createDirectTransform();
        const encryption = encryptionGenerator.createDirectTransform(transformParameters);
        const compressionEncryption = {};
        Object.keys(encryption).forEach(key => {
            compressionEncryption[key] = encryption[key]
        });

        compressionEncryption.transform = (data) => {
            return encryption.transform(compression.transform(data));
        };

        return compressionEncryption;
    };

    this.createInverseTransform = (transformParameters) => {
        const decompression = compressionGenerator.createInverseTransform();
        const decryption = encryptionGenerator.createInverseTransform(transformParameters);
        const compressionEncryption = {};
        Object.keys(decompression).forEach(key => {
            compressionEncryption[key] = decompression[key]
        });
        compressionEncryption.transform = (data) => {
            return decompression.transform(decryption.transform(data));
        };

        return compressionEncryption;
    };
}

module.exports = CompressionEncryptionGenerator;
},{"./CompressionGenerator":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/CompressionGenerator.js","./EncryptionGenerator":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/EncryptionGenerator.js"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/CompressionGenerator.js":[function(require,module,exports){
const zlib = require("zlib");

function CompressionGenerator(config) {

    this.getInverseTransformParameters = (transformedData) => {
        return {data: transformedData};
    };

    this.createDirectTransform = () => {
        return getCompression(true);
    };

    this.createInverseTransform = () => {
        return getCompression(false);
    };

    function getCompression(isCompression) {
        const algorithm = config.getCompressionAlgorithm();
        switch (algorithm) {
            case "gzip":
                return __createCompress(zlib.gzipSync, zlib.gunzipSync, isCompression);
            case "br":
                return __createCompress(zlib.brotliCompressSync, zlib.brotliDecompressSync, isCompression);
            case "deflate":
                return __createCompress(zlib.deflateSync, zlib.inflateSync, isCompression);
            case "deflateRaw":
                return __createCompress(zlib.deflateRawSync, zlib.inflateRawSync, isCompression);
            default:
                return;
        }
    }

    function __createCompress(compress, decompress, isCompression) {
        const options = config.getCompressionOptions();
        if (!isCompression) {
            return {
                transform(data) {
                    return decompress(data, options);
                }
            }
        }

        return {
            transform(data) {
                return compress(data, options);
            }
        }
    }
}

module.exports = CompressionGenerator;


},{"zlib":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/EncryptionGenerator.js":[function(require,module,exports){
const crypto = require("pskcrypto");

function EncryptionGenerator(config) {
    let key;
    const pskEncryption = crypto.createPskEncryption(config.getEncryptionAlgorithm());
    this.setConfig = (newConfig) => {
        config = newConfig;
    };

    this.getInverseTransformParameters = (transformedData) => {
        let decryptionParameters = pskEncryption.getDecryptionParameters(transformedData);
        const data = decryptionParameters.data;
        delete decryptionParameters.data;
        return {
            data: data,
            params: decryptionParameters
        };
    };

    this.createDirectTransform = (transformParameters) => {
        return getEncryption(transformParameters);
    };

    this.createInverseTransform = (transformParameters) => {
        return getDecryption(transformParameters);
    };

    //--------------------------------------- internal methods ------------------------------------------------------
    function getEncryption(transformParameters) {
        const algorithm = config.getEncryptionAlgorithm();
        if (!algorithm) {
            return;
        }

        if (config.getIsEncrypted() === false) {
            return;
        }

        const encOptions = config.getEncryptionOptions();
        if (transformParameters && transformParameters.key) {
            key = transformParameters.key;
        } else {
            key = pskEncryption.generateEncryptionKey(algorithm);
        }


        const ret = {
            transform(data) {
                const encData = pskEncryption.encrypt(data, key, encOptions);
                ret.transformParameters = pskEncryption.getEncryptionParameters();
                return encData;
            }
        };

        return ret;
    }


    function getDecryption(transformConfig) {
        const algorithm = config.getEncryptionAlgorithm();
        if (!algorithm) {
            return;
        }

        if (config.getIsEncrypted() === false) {
            return;
        }

        const encOptions = config.getEncryptionOptions();
        let authTagLength = 0;
        if (!config.getEncryptionOptions() || !config.getAuthTagLength()) {
            authTagLength = 16;
        } else {
            authTagLength = config.getAuthTagLength();
        }

        return {
            transform(data) {
                return pskEncryption.decrypt(data, transformConfig.key, authTagLength, encOptions);
            }
        }
    }

}

module.exports = EncryptionGenerator;
},{"pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/utils/AsyncDispatcher.js":[function(require,module,exports){

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
},{}],"/home/travis/build/PrivateSky/privatesky/modules/bar/utils/isStream.js":[function(require,module,exports){
function isStream(stream){
    return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
}

function isWritable(stream) {
    return isStream(stream) &&
        stream.writable !== false &&
        typeof stream._write === 'function' &&
        typeof stream._writableState === 'object';

}

function isReadable(stream) {
    return isStream(stream) &&
        stream.readable !== false &&
        typeof stream._read === 'function' &&
        typeof stream._readableState === 'object';
}

function isDuplex(stream){
    return isWritable(stream) &&
        isReadable(stream);
}

module.exports = {
    isStream,
    isReadable,
    isWritable,
    isDuplex
};

},{}],"/home/travis/build/PrivateSky/privatesky/modules/bar/utils/utilities.js":[function(require,module,exports){
const fs = require('fs');
const OFFSET_SIZE = 8;

function getBarMapOffsetSize() {
    return OFFSET_SIZE;
}

function ensureFileDoesNotExist(filePath, callback) {
    fs.access(filePath, (err) => {
        if (!err) {
            fs.unlink(filePath, callback);
        } else {
            return callback();
        }
    });
}

module.exports = {getBarMapOffsetSize, ensureFileDoesNotExist};
},{"fs":false}],"/home/travis/build/PrivateSky/privatesky/modules/callflow/constants.js":[function(require,module,exports){
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
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

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
(function (global){
/*
 Initial License: (c) Axiologic Research & Alboaie Sînică.
 Contributors: Axiologic Research , PrivateSky project
 Code License: LGPL or MIT.
 */

var util = require("util");
var fs = require("fs");
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


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

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
},{"./base":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/utilityFunctions/base.js"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs-brick-storage/EDFSBrickStorage.js":[function(require,module,exports){
function EDFSBrickStorage(endpoint) {

    const bar = require("bar");
    const brickTransportStrategy = $$.brickTransportStrategiesRegistry.get(endpoint);
    let map;

    this.setBarMap = function (barMap) {
        map = barMap;
    };

    this.putBrick = function (brick, callback) {
        brickTransportStrategy.send(brick.getHash(), brick.getTransformedData(), callback);
    };

    this.getBrick = function (brickHash, callback) {

        brickTransportStrategy.get(brickHash, (err, brickData) => {
            if (err) {
                return callback(err);
            }

            const brick = bar.createBrick();
            brick.setTransformedData(brickData);

            if (brickHash !== brick.getHash()) {
                return callback(Error("The received data is invalid"));
            }
            callback(undefined, brick);
        });
    };

    const BRICK_MAX_SIZE_IN_BYTES = 4;
    this.getMultipleBricks = function (brickHashes, callback) {
        brickTransportStrategy.getMultipleBricks(brickHashes, (err, bricksData) => {
            if (err) {
                return callback(err);
            }
            let bricks = [];

            function parseResponse(response) {
                if (response.length > 0) {
                    let brickSizeBuffer = response.slice(0, BRICK_MAX_SIZE_IN_BYTES);
                    let brickSize = brickSizeBuffer.readUInt32BE();
                    let brickData = response.slice(BRICK_MAX_SIZE_IN_BYTES, brickSize + BRICK_MAX_SIZE_IN_BYTES);
                    const brick = bar.createBrick();
                    brick.setTransformedData(brickData);
                    bricks.push(brick);
                    response = response.slice(brickSize + BRICK_MAX_SIZE_IN_BYTES);
                    return parseResponse(response);
                }
            }

            parseResponse(bricksData);
            callback(undefined, bricks);
        });


    };

    this.deleteBrick = function (brickHash, callback) {
        throw new Error("Not implemented");
    };

    this.putBarMap = function (barMap, callback) {
        map = barMap;
        const barMapBrick = barMap.toBrick();
        barMapBrick.setTransformParameters(barMap.getTransformParameters());

        let brickId = barMapBrick.getKey();
        if (!brickId) {
            brickId = barMapBrick.getHash();
            barMapBrick.setKey(brickId);
        }

        brickTransportStrategy.getHashForAlias(brickId, (err, hashesList) => {
            if (err) {
                return callback(err);
            }

            if (hashesList.length === 0) {
                __sendBarMapBrick();
            } else {
                const barMapHash = hashesList[hashesList.length - 1];
                if (barMapHash !== barMapBrick.getHash()) {
                    __sendBarMapBrick();
                } else {
                    callback();
                }
            }

            function __sendBarMapBrick() {
                brickTransportStrategy.attachHashToAlias(brickId, barMapBrick.getHash(), (err) => {
                    if (err) {
                        return callback(err);
                    }

                    brickTransportStrategy.send(barMapBrick.getHash(), barMapBrick.getTransformedData(), callback);
                });
            }
        });
    };

    this.getBarMap = function (mapDigest, callback) {
        if (typeof mapDigest === "function") {
            callback = mapDigest;
            mapDigest = undefined;
        }

        if (map) {
            return callback(undefined, map);
        }

        if (typeof mapDigest === "undefined") {
            return callback(undefined, bar.createBarMap());
        }

        brickTransportStrategy.getHashForAlias(mapDigest, (err, hashesList) => {
            if (err) {
                return callback(err);
            }

            let barMapId;
            if (hashesList.length === 0) {
                barMapId = mapDigest;
            } else {
                barMapId = hashesList[hashesList.length - 1];
            }
            brickTransportStrategy.get(barMapId, (err, barMapData) => {
                if (err) {
                    return callback(undefined, bar.createBarMap());
                }

                const mapBrick = bar.createBrick();
                mapBrick.setTransformedData(barMapData);
                if (barMapId !== mapBrick.getHash()) {
                    return callback(Error("Invalid data received"));
                }
                map = bar.createBarMap(mapBrick);
                callback(undefined, map);
            });
        });
    };
}

module.exports = EDFSBrickStorage;


},{"bar":"bar"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/FetchBrickTransportStrategy.js":[function(require,module,exports){
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

},{"psk-http-client":"psk-http-client"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/brickTransportStrategiesRegistry.js":[function(require,module,exports){
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

},{"../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/edfs/moduleConstants.js","../seedCage":"/home/travis/build/PrivateSky/privatesky/modules/edfs/seedCage/index.js","./RawDossier":"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/RawDossier.js","bar":"bar","bar-fs-adapter":"bar-fs-adapter","edfs-brick-storage":"edfs-brick-storage","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/Manifest.js":[function(require,module,exports){
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

},{"./Manifest":"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/Manifest.js","bar":"bar","bar-fs-adapter":"bar-fs-adapter","blockchain":false,"edfs-brick-storage":"edfs-brick-storage","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/moduleConstants.js":[function(require,module,exports){
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

},{"./psk-abstract-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-abstract-client.js","buffer":false,"http":false,"https":false,"url":false}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/BarMapStrategyMixin.js":[function(require,module,exports){
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
},{"./BarMapStrategyMixin":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/BarMapStrategyMixin.js","bar":"bar"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/Factory.js":[function(require,module,exports){
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

},{"edfs":"edfs","edfs-brick-storage":"edfs-brick-storage"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BootstrapingService/Protocol/index.js":[function(require,module,exports){
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
},{"./CryptoAlgorithmsSchemeVersioning":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/CryptoAlgorithmsSchemeVersioning.js","pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDUrl.js":[function(require,module,exports){
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

},{"../constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/constants.js","./DIDMixin":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDMixin.js","./DIDUrl":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDUrl.js","./ZKDID":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/ZKDID.js","buffer":false,"pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/ZKDID.js":[function(require,module,exports){
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

},{"./DIDMixin":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDMixin.js","./DIDUrl":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDUrl.js","buffer":false,"pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/BarFactory.js":[function(require,module,exports){
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

},{"../constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/constants.js","bar":"bar","bar-fs-adapter":"bar-fs-adapter","psk-cache":"psk-cache"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/Factory.js":[function(require,module,exports){
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
},{"pskcrypto":"pskcrypto","swarm-engine":"swarm-engine"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DSUFactory/NodeDossierFactory.js":[function(require,module,exports){
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

},{}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/PskCrypto.js":[function(require,module,exports){
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
},{"crypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/cmds/bar.js":[function(require,module,exports){
const utils = require("../utils/utils");

function listFiles(alseed, folderPath) {
    if (arguments.length === 0) {
        throw Error("Expected at least one argument. Received zero");
    }
    if (arguments.length === 1) {
        folderPath = alseed;
        utils.loadWallet(undefined, (err, wallet) => {
            if (err) {
                throw err;
            }

            wallet.listFiles(folderPath, (err, files) => {
                if (err) {
                    throw err;
                }

                console.log("Files:", files);
            });
        });
    } else {
        if (utils.isAlias(alseed)) {
            utils.loadArchiveWithAlias(alseed, (err, rawDossier) => {
                if (err) {
                    throw err;
                }

                rawDossier.listFiles(folderPath, (err, fileList) => {
                    if (err) {
                        throw err;
                    }

                    console.log("Files:", fileList);
                    process.exit(0);
                });
            });
        } else {
            utils.getEDFS(alseed, (err, edfs) => {
                if (err) {
                    throw err;
                }

                edfs.loadRawDossier(alseed, (err, rawDossier) => {
                    if (err) {
                        throw err;
                    }

                    rawDossier.listFiles(folderPath, (err, fileList) => {
                        if (err) {
                            throw err;
                        }

                    console.log("Files:", fileList);
                });
                });
            });
        }
    }
}

function getApp(alseed, barPath, fsFolderPath) {
    if (arguments.length < 3) {
        throw Error(`Expected 3 arguments. Received ${arguments.length}`);
    }
    if (utils.isAlias(alseed)) {
        utils.loadArchiveWithAlias(alseed, (err, rawDossier) => {
            if (err) {
                throw err;
            }

            rawDossier.extractFolder(fsFolderPath, barPath, (err) => {
                if (err) {
                    throw err;
                }

                console.log("Extracted folder.");
                process.exit(0);
            });
        });
    } else {
        utils.getEDFS(alseed, (err, edfs) => {
            if (err) {
                throw err;
            }

            edfs.loadRawDossier(alseed, (err, rawDossier) => {
                if (err) {
                    throw err;
                }

                rawDossier.extractFolder(fsFolderPath, barPath, (err) => {
                    if (err) {
                        throw err;
                    }

                    console.log("Extracted folder.");
                });
            });
        });
    }
}

function extractFile(alseed, barPath, fsFilePath) {
    if (arguments.length < 3) {
        throw Error(`Expected 3 arguments. Received ${arguments.length}`);
    }
    if (utils.isAlias(alseed)) {
        utils.loadArchiveWithAlias(alseed, (err, rawDossier) => {
            if (err) {
                throw err;
            }

            rawDossier.extractFile(fsFilePath, barPath, (err) => {
                if (err) {
                    throw err;
                }

                console.log("Extracted file.");
                process.exit(0);
            });
        });
    } else {
        utils.getEDFS(alseed, (err, edfs) => {
            if (err) {
                throw err;
            }

            edfs.loadRawDossier(alseed, (err, rawDossier) => {
                if (err) {
                    throw err;
                }

                rawDossier.extractFile(fsFilePath, barPath, (err) => {
                    if (err) {
                        throw err;
                    }

                    console.log("Extracted file.");
                });
            });
        });
    }
}

addCommand("list", "files", listFiles, " <archiveSeed>/<alias> <folderPath> \t\t\t\t |prints the list of all files stored at path <folderPath> inside the archive whose SEED is <archiveSeed>. If an alias is specified then the CSB's SEED is searched from the wallet.");
addCommand("get", "app", getApp, " <archiveSeed>/<alias> <archivePath> <fsFolderPath> \t\t |extracts the folder stored at <archivePath> inside the archive whose SEED is <archiveSeed> and writes all the extracted file on disk at path <fsFolderPath>");
addCommand("extract", "file", extractFile, " <archiveSeed>/<alias> <archivePath> <fsFilePath> \t\t |extracts the folder stored at <archivePath> inside the archive whose SEED is <archiveSeed> and writes all the extracted file on disk at path <fsFilePath>");


},{"../utils/utils":"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/utils/utils.js"}],"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/cmds/dossier.js":[function(require,module,exports){
const utils = require("../utils/utils");
const AGENT_IDENTITY = require("../utils/utils").getOwnIdentity();
const pth = "path";
const path = require(pth);
const EDFS = require("edfs");
function createTemplateDossier(domainName, constitutionPath) {
    const edfs = utils.getInitializedEDFS();
    edfs.createBar((err, archive) => {
        if (err) {
            throw err;
        }
        archive.load((err) => {
            if (err) {
                throw err;
            }

            archive.addFolder(path.resolve(constitutionPath), "/", (err) => {
                if (err) {
                    throw err;
                }

                archive.writeFile(EDFS.constants.CSB.DOMAIN_IDENTITY_FILE, domainName, () => {
                    if (err) {
                        throw err;
                    }
                    console.log("The dossier was created. Its SEED is the following.");
                    console.log("SEED", archive.getSeed());
                });
            });
        });
    });
}
function createDossier(domainName, constitutionPath, noSave) {
    if (noSave === "nosave") {
        createTemplateDossier(domainName, constitutionPath);
    } else {
        getPassword((err, password) => {
            if (err) {
                throw err;
            }
            EDFS.attachWithPassword(password, (err, edfs) => {
                if (err) {
                    console.error("Invalid password");
                    return;
                }

                edfs.loadWallet(undefined, password, true, (err, wallet) => {
                    if (err) {
                        throw err;
                    }

                    const dossier = require("dossier");
                    dossier.load(wallet.getSeed(), AGENT_IDENTITY, (err, csb) => {
                        if (err) {
                            console.error(err);
                            process.exit(1);
                        }

                        csb.startTransaction("StandardCSBTransactions", "domainLookup", domainName).onReturn((err, domain) => {
                            if (err) {
                                console.log(err);
                                process.exit(1);
                            }
                            if (domain) {
                                console.log(`Domain ${domainName} already exists!`);
                                process.exit(1);
                            }
                            edfs.createBar((err, archive) => {
                                if (err) {
                                    throw err;
                                }

                                archive.load((err) => {
                                    if (err) {
                                        throw err;
                                    }

                                    archive.addFolder(path.resolve(constitutionPath), "/", (err, mapDigest) => {
                                        if (err) {
                                            throw err;
                                        }

                                        csb.startTransaction("StandardCSBTransactions", "addFileAnchor", domainName, "csb", archive.getSeed()).onReturn((err, res) => {
                                            if (err) {
                                                console.error(err);
                                                process.exit(1);
                                            }

                                            console.log("The CSB was created and a reference to it has been added to the wallet.");
                                            console.log("Its SEED is:", archive.getSeed());
                                            process.exit(0);
                                        });

                                    });
                                })
                            });
                        });
                    });
                });
            });
        });
    }
}

function setApp(alseed, appPath) {
    if (!alseed) {
        throw new Error('Missing first argument, the archive seed or alais');
    }

    if (!appPath) {
        throw new Error('Missing the second argument, the app path');
    }

    const EDFS = require("edfs");
    if (utils.isAlias(alseed)) {
        utils.loadArchiveWithAlias(alseed, (err, bar) => {
            if (err) {
                throw err;
            }

            bar.addFolder(appPath, EDFS.constants.CSB.APP_FOLDER, (err) => {
                if (err) {
                    throw err;
                }

                console.log('All done');
            })
        });
    } else {
        utils.getEDFS(alseed, (err, edfs) => {
            if (err) {
                throw err;
            }

            edfs.loadBar(alseed, (err, bar) => {
                if (err) {
                    throw err;
                }

                bar.addFolder(appPath, EDFS.constants.CSB.APP_FOLDER, (err) => {
                    if (err) {
                        throw err;
                    }

                    console.log('All done');
                })
            });
        });
    }
}

function mount(alseed, path, archiveIdentifier) {
    if (arguments.length < 2) {
        throw Error(`Insufficient arguments. Expected at least 3. Received ${arguments.length}`);
    }
    if (arguments.length === 2) {
        archiveIdentifier = path;
        path = alseed;
        alseed = undefined;
        utils.loadWallet((err, wallet) => {
            if (err) {
                throw err;
            }

            wallet.mount(path, archiveIdentifier, (err) => {
                if (err) {
                    throw err;
                }

                console.log("Successfully mounted");
            });
        });
    } else {
        if (utils.isAlias(alseed)) {
            utils.loadArchiveWithAlias(alseed, (err, rawDossier) => {
                if (err) {
                    throw err;
                }

                rawDossier.mount(path, archiveIdentifier, (err) => {
                    if (err) {
                        throw err;
                    }

                    console.log("Successfully mounted.");
                    process.exit(0);
                });
            });
        } else {
            utils.getEDFS(alseed, (err, edfs) => {
                if (err) {
                    throw err;
                }

                edfs.loadRawDossier(alseed, (err, rawDossier) => {
                    rawDossier.mount(path, archiveIdentifier, (err) => {
                        if (err) {
                            throw err;
                        }

                        console.log("Successfully mounted.");
                    });
                });
            });
        }
    }
}

function unmount(alseed, path) {
    if (arguments.length < 1) {
        throw Error(`Insufficient arguments. Expected at least 2. Received ${arguments.length}`);
    }
    if (arguments.length === 2) {
        path = alseed;
        alseed = undefined;
        utils.loadWallet((err, wallet) => {
            if (err) {
                throw err;
            }

            wallet.unmount(path, (err) => {
                if (err) {
                    throw err;
                }

                console.log("Successfully unmounted");
            });
        });
    } else {
        if (utils.isAlias(alseed)) {
            utils.loadArchiveWithAlias(alseed, (err, rawDossier) => {
                if (err) {
                    throw err;
                }

                rawDossier.unmount(path, (err) => {
                    if (err) {
                        throw err;
                    }

                    console.log("Successfully unmounted.");
                    process.exit(0);
                });
            });
        } else {
            utils.getEDFS(alseed, (err, edfs) => {
                if (err) {
                    throw err;
                }

                edfs.loadRawDossier(alseed, (err, rawDossier) => {
                    if (err) {
                        throw err;
                    }
                    rawDossier.unmount(path, (err) => {
                        if (err) {
                            throw err;
                        }

                        console.log("Successfully unmounted.");
                    });
                });
            });
        }
    }
}

function listMounts(alseed, path) {
    if (arguments.length < 1) {
        throw Error(`Insufficient arguments. Expected at least 1. Received ${arguments.length}`);
    }
    if (arguments.length === 1) {
        path = alseed;
        alseed = undefined;
        utils.loadWallet((err, wallet) => {
            if (err) {
                throw err;
            }

            wallet.listMountedDossiers(path, (err, mounts) => {
                if (err) {
                    throw err;
                }

                console.log(mounts);
            });
        });
    } else {
        if (utils.isAlias(alseed)) {
            utils.loadArchiveWithAlias(alseed, (err, rawDossier) => {
                if (err) {
                    throw err;
                }

                rawDossier.listMountedDossiers(path, (err, mounts) => {
                    if (err) {
                        throw err;
                    }

                    console.log(mounts);
                    process.exit(0);
                });
            });
        } else {
            utils.getEDFS(alseed, (err, edfs) => {
                if (err) {
                    throw err;
                }

                edfs.loadRawDossier(alseed, (err, rawDossier) => {
                    if (err) {
                        throw err;
                    }

                    rawDossier.listMountedDossiers(path, (err, mounts) => {
                        if (err) {
                            throw err;
                        }

                        console.log(mounts);
                    });
                });
            });
        }
    }
}

addCommand("create", "dossier", createDossier, "<domainName> <constitutionPath> <nosave>\t\t\t\t |creates an archive containing constitutions folder <constitutionPath> for Domain <domainName>");
addCommand("set", "app", setApp, " <seed>/<alias> <folderPath> \t\t\t\t\t |add an app to an existing archive");
addCommand("mount", null, mount, "<seed>/<alias> <path> <archiveIdentifier> <> \t\t\t\t |Mounts the dossier having the seed <seed> at <path>");
addCommand("unmount", null, unmount, "<seed>/<alias> <path> \t\t\t\t |Unmounts the dossier mounted at <path>");
addCommand("list", "mounts", listMounts, "<seed>/<alias> <path>\t\t\t\t |Lists the seeds of all dossiers mounted at <path>");

},{"../utils/utils":"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/utils/utils.js","dossier":"dossier","edfs":"edfs"}],"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/cmds/index.js":[function(require,module,exports){
require("./wallet");
require("./bar");
require("./dossier");

},{"./bar":"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/cmds/bar.js","./dossier":"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/cmds/dossier.js","./wallet":"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/cmds/wallet.js"}],"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/cmds/wallet.js":[function(require,module,exports){
const consoleUtils = require("../utils/consoleUtils");
const utils = require("../utils/utils");

function createWallet(templateSeed) {
    if (!templateSeed) {
        throw Error("No template seed received.")
    }
    const Seed = require("bar").Seed;
    try {
        new Seed(templateSeed);
    } catch (e) {
        throw Error("Invalid template seed");
    }

    const EDFS = require("edfs");
    EDFS.checkForSeedCage(err => {
        const edfs = utils.getInitializedEDFS();
        if (!err) {
            consoleUtils.getFeedback("A wallet already exists. Do you want to create a new one?(y/n)", (err, ans) => {
                if (err) {
                    throw err;
                }

                if (ans[0] === "y") {
                    __createWallet(edfs, true);
                }
            });
        } else {
            __createWallet(edfs, false);
        }
    });

    function __createWallet(edfs, overwrite) {
        consoleUtils.insertPassword({validationFunction: utils.validatePassword}, (err, password) => {
            if (err) {
                console.log(`Caught error: ${err.message}`);
                process.exit(1);
            }

            consoleUtils.insertPassword({
                prompt: "Confirm password:",
                validationFunction: utils.validatePassword
            }, (err, newPassword) => {
                if (err) {
                    console.log(`Caught error: ${err.message}`);
                    process.exit(1);
                }

                if (password !== newPassword) {
                    console.log("The passwords do not coincide. Try again.");
                    __createWallet(edfs, overwrite);
                } else {
                    edfs.createWallet(templateSeed, password, overwrite, (err, seed) => {
                        if (err) {
                            throw err;
                        }

                        console.log("Wallet with SEED was created. Please save the SEED:", seed);
                    });
                }
            });
        });
    }
}


function restore(seed) {
    if (!seed) {
        throw Error("No seed received.")
    }
    const EDFS = require("edfs");
    let edfs;
    EDFS.attachWithSeed(seed, (err, edfs) => {
        if (err) {
            throw err;
        }__saveSeed();

        function __saveSeed() {
            consoleUtils.insertPassword({validationFunction: utils.validatePassword}, (err, password) => {
                if (err) {
                    console.log(`Caught error: ${err.message}`);
                    process.exit(1);
                }

                consoleUtils.insertPassword({
                    prompt: "Confirm password:",
                    validationFunction: utils.validatePassword
                }, (err, newPassword) => {
                    if (err) {
                        console.log(`Caught error: ${err.message}`);
                        process.exit(1);
                    }

                    if (password !== newPassword) {
                        console.log("The passwords do not coincide. Try again.");
                        __saveSeed();
                    } else {
                        edfs.loadWallet(seed, password, true, (err, wallet) => {
                            if (err) {
                                throw err;
                            }

                            console.log("Wallet was restored");
                        });
                    }
                });
            });
        }
    });
}

function changePassword() {
    utils.loadWallet((err, wallet) => {
        if (err) {
            throw err;
        }

        consoleUtils.insertPassword({prompt: "Insert a new password:", validationFunction: utils.validatePassword}, (err, password) => {
            if (err) {
                throw err;
            }

            utils.getEDFS(wallet.getSeed(), (err, edfs) => {
                if (err) {
                    throw err;
                }

                edfs.loadWallet(wallet.getSeed(), password, true, (err) => {
                    if (err) {
                        throw err;
                    }

                    console.log("The password has been changed.");
                });
            });
        });
    });
}


addCommand("create", "wallet", createWallet, "<templateSeed> \t\t\t\t\t\t |creates a clone of the CSB whose SEED is <templateSeed>");
addCommand("restore", null, restore, "<seed> \t\t\t\t |Checks the seed is valid and allows the selection of a password");
addCommand("change", "password", changePassword, "\t\t\t\t |Asks for the password and then allows for the selection of a new password");


},{"../utils/consoleUtils":"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/utils/consoleUtils.js","../utils/utils":"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/utils/utils.js","bar":"bar","edfs":"edfs"}],"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/utils/consoleUtils.js":[function(require,module,exports){
const rl = "readline";
const readline = require(rl);
const getPassword = require("./getPassword").readPassword;

const NO_TRIES = 3;
const DEFAULT_PROMPT = "Insert password:";

function insertPassword(options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    }

    if (!callback) {
        throw new Error("Misuse of function, reason: No callback given.");
    }

    options.prompt = options.prompt || DEFAULT_PROMPT;

    if (typeof options.noTries === "undefined") {
        options.noTries = NO_TRIES;
    }

    if (options.noTries === 0) {
        return callback(new Error(`You have inserted an invalid password ${NO_TRIES} times`));
    } else {
        getPassword(options.prompt,  (err, password)=> {
            if (options.validationFunction) {
                options.validationFunction(password, (err, status) => {
                    if (err) {
                        return callback(err);
                    }

                    if (!status) {
                        if (options.noTries !== 1) {
                            console.log("Validation failed. Maybe you have inserted an invalid character.");
                            console.log("Try again");
                        }
                        options.noTries--;
                        insertPassword(options, callback);
                    }else {
                        callback(undefined, password);
                    }
                });
            } else {
                return callback(undefined, password);
            }
        });
    }
}

function getFeedback(question, callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(question, (answer) => {
        rl.close();
        callback(null, answer);
    });
}


module.exports = {
    insertPassword,
    getFeedback,
};
},{"./getPassword":"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/utils/getPassword.js"}],"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/utils/getPassword.js":[function(require,module,exports){
exports.readPassword = function (prompt, callback) {
    const stdin = process.stdin;
    const stdout = process.stdout;

    if (prompt) {
        stdout.write(prompt);
    }

    stdin.resume();
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    let password = "";

    function escaping(...args) {
        stdin.removeListener("data", readingInput);
        stdin.pause();
        callback(...args);
    }

    function readingInput(data) {
        switch (data) {
            case "\x03":
                stdin.removeListener("data", readingInput);
                stdin.setRawMode(false);
                stdin.pause();
                break;
            case "\x0A":
            case "\x0D":
            case "\x04":
                stdout.write('\n');
                stdin.setRawMode(false);
                stdin.pause();
                escaping(false, password);
                break;
            case "\x08":
            case "\x7f":
                password = password.slice(0, password.length - 1);
                stdout.clearLine();
                stdout.cursorTo(0);
                stdout.write(prompt);
                for (let i = 0; i < password.length; i++) {
                    stdout.write("*");
                }
                break;
            default:
                let str = "";
                for (let i = 0; i < data.length; i++) {
                    str += "*";
                }
                stdout.write(str);
                password += data;
        }
    }

    stdin.on('data', readingInput);
};
},{}],"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/utils/utils.js":[function(require,module,exports){
(function (global){
const consoleUtils = require("./consoleUtils");

function getEndpoint() {
    let endpoint = process.env.EDFS_ENDPOINT;
    if (typeof endpoint === "undefined") {
        console.log("Using default endpoint. To configure set ENV['EDFS_ENDPOINT']");
        endpoint = "http://localhost:8080";
    }
    return endpoint;
}

function getInitializedEDFS() {
    const EDFS = require("edfs");
    const endpoint = getEndpoint();
    return EDFS.attachToEndpoint(endpoint);
}

function validatePassword(password, callback) {
    if (typeof password === "undefined" || password.length < 4) {
        return callback(undefined, false)
    }

    if (/[\x00-\x03]|[\x05-\x07]/.test(password)) {
        return callback(undefined, false);
    }

    return callback(undefined, true);
}

function checkPassword(password, callback) {
    if (typeof password === "undefined" || password.length < 4) {
        return callback(undefined, false)
    }

    if (/[\x00-\x03]|[\x05-\x07]/.test(password)) {
        return callback(undefined, false);
    }

    const EDFS = require("edfs");
    EDFS.attachWithPassword(password, (err) => {
        if (err) {
            return callback(undefined, false);
        }

        callback(undefined, true);
    });
}

function getEDFS(seed, callback) {
    const EDFS = require("edfs");
    if (typeof seed === "function") {
        callback = seed;
        seed = undefined;
    }

    if (typeof seed === "undefined") {
        getPassword((err, password) => {
            if (err) {
                console.log("Error when loading EDFs");
                return callback(err);
            }

            EDFS.attachWithPassword(password, callback);
        });

    } else {
        EDFS.attachWithSeed(seed, callback);
    }
}

function loadWallet(walletSeed, callback) {
    if (typeof walletSeed === "function") {
        callback = walletSeed;
        walletSeed = undefined;
    }
    getEDFS(walletSeed, (err, edfs) => {
        if (err) {
            return callback(err);
        }

        getPassword((err, password) => {
            if (err) {
                return callback(err);
            }

            edfs.loadWallet(walletSeed, password, true, (err, wallet) => {
                if (err) {
                    return callback(err);
                }

                callback(undefined, wallet);
            });
        });
    });
}

function loadArchiveWithAlias(alias, callback) {
    loadWallet(undefined, (err, wallet) => {
        if (err) {
            return callback(err);
        }

        const dossier = require("dossier");
        dossier.load(wallet.getSeed(), getOwnIdentity(), (err, csb) => {
            if (err) {
                return callback(err);
            }

            csb.startTransaction("StandardCSBTransactions", "getSeed", alias).onReturn((err, seed) => {
                if (err) {
                    return callback(err);
                }

                getEDFS(seed, (err, edfs) => {
                    if (err) {
                        return callback(err);
                    }

                    edfs.loadRawDossier(seed, (err, rawDossier) => {
                        if (err) {
                            return callback(err);
                        }
                        callback(undefined, rawDossier);
                    })
                });
            });
        });
    });
}

function isAlias(str) {
    const Seed = require("bar").Seed;
    try {
        new Seed(str)
    } catch (e) {
        return true;
    }

    return false;
}

function getOwnIdentity() {
    return "pskwallet-identity";
}

let lastPassword;
let timeStamp;
const PASSWORD_LIFETIME = 5000;
global.getPassword = function (callback) {
    const currentTimestamp = new Date().getTime();
    if (!lastPassword || (currentTimestamp - timeStamp) > PASSWORD_LIFETIME) {
        consoleUtils.insertPassword({validationFunction: checkPassword}, (err, password) => {
            if (err) {
                return callback(err);
            }

            lastPassword = password;
            timeStamp = new Date().getTime();
            callback(undefined, password);
        });
    } else {
        callback(undefined, lastPassword);
    }
};

module.exports = {
    getInitializedEDFS,
    validatePassword,
    isAlias,
    loadWallet,
    getEDFS,
    getOwnIdentity,
    loadArchiveWithAlias,
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./consoleUtils":"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/utils/consoleUtils.js","bar":"bar","dossier":"dossier","edfs":"edfs"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/SwarmEngine.js":[function(require,module,exports){
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

},{"./BootEngine.js":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/BootEngine.js","callflow":"callflow","edfs":"edfs","swarm-engine":"swarm-engine"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/domainBootScript.js":[function(require,module,exports){
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

},{"./BootEngine":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/BootEngine.js","dossier":"dossier","edfs":"edfs","path":false,"soundpubsub":false,"swarm-engine":"swarm-engine","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/index.js":[function(require,module,exports){
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

},{"./InteractionSpace":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/interactions/InteractionSpace.js","callflow":"callflow"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/interactions/interaction_template.js":[function(require,module,exports){
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

},{"callflow":"callflow"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/InnerIsolatePowerCord.js":[function(require,module,exports){
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

},{"../bootScripts":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/index.js","syndicate":"syndicate"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/OuterThreadPowerCord.js":[function(require,module,exports){
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

},{"syndicate":"syndicate"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/RemoteChannelPairPowerCord.js":[function(require,module,exports){
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

},{"../../psk-http-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/index.js","buffer":false,"psk-webserver":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/powerCords/browser/SSAppPowerCord.js":[function(require,module,exports){
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
},{"./swarm_template-se":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/swarms/swarm_template-se.js","callflow":"callflow"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/swarms/swarm_template-se.js":[function(require,module,exports){
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
},{"callflow":"callflow","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Combos.js":[function(require,module,exports){
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

},{"./Queue":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Queue.js","buffer":false,"crypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/AbstractPool.js":[function(require,module,exports){
(function (setImmediate){
const {assert} = require('./utils');
const util = require('util');
const {EventEmitter} = require('events');

const PoolEvents = {
    RELEASED_WORKER: 'releasedWorker'
};

/** @param {PoolConfig&PoolConfigStorage} options */
function AbstractPool(options) {
    EventEmitter.call(this);

    let pool = [];
    let currentPoolSize = 0;

    /** @returns {Worker|null} */
    this.getAvailableWorker = function () {
        // find first free worker
        const freeWorkerIndex = pool.findIndex(el => !el.isWorking);

        let worker = null;

        // if no free worker is available, try creating one
        if (freeWorkerIndex === -1) {
            _createNewWorker();
            return null;
        } else {
            worker = pool[freeWorkerIndex];
        }

        if (worker === null) {
            return null;
        }

        // if free worker exists, set its state to working
        worker.isWorking = true;
        return worker.workerInstance;
    };

    /** @param {Worker} worker */
    this.returnWorker = function (worker) {
        // find worker that matches one in the pool
        const freeWorkerIndex = pool.findIndex(el => el.workerInstance === worker);

        if (freeWorkerIndex === -1) {
            console.error('Tried to return a worker that is not owned by the pool');
            return;
        }

        // if worker is found, set its state to not working
        pool[freeWorkerIndex].isWorking = false;
        this.emit(PoolEvents.RELEASED_WORKER);
    };

    /** @param {Worker} worker */
    this.removeWorker = function (worker) {
        const localPoolSize = pool.length;

        pool = pool.filter(poolWorker => poolWorker.workerInstance !== worker); // keep elements that are not equal to worker
        currentPoolSize = pool.length;

        assert(currentPoolSize === localPoolSize - 1, {ifFails: `Tried returning a worker that could not be found`});
    };

    this.createNewWorker = function () {
        throw new Error('Not implemented! Overwrite this in subclass.');
    };

    const _createNewWorker = () => {
        // using currentPoolSize instead of pool.length because the creation of workers can be asynchronous
        // and the pool will increase only after the worker is creating, this can cause a situation where
        // more workers are created than the maximumNumberOfWorkers
        if (currentPoolSize >= options.maximumNumberOfWorkers) {
            return;
        }

        currentPoolSize += 1;

        this.createNewWorker((err, newWorker) => {
            if (err) {
                currentPoolSize -= 1;
                console.error('Error creating a new worker', err);
                return;
            }

            const workerObj = {
                isWorking: false,
                workerInstance: newWorker
            };

            pool.push(workerObj);

            // createNewWorker can be synchronous (even though it uses a callback),
            // in that case it will cause scheduling problems if not delayed
            setImmediate(() => {
                this.emit(PoolEvents.RELEASED_WORKER);
            });
        });
    };

}

AbstractPool.prototype.events = PoolEvents;
util.inherits(AbstractPool, EventEmitter);


module.exports = AbstractPool;

}).call(this,require("timers").setImmediate)

},{"./utils":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/utils.js","events":false,"timers":false,"util":false}],"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/Pool-Isolates.js":[function(require,module,exports){
const AbstractPool = require('./AbstractPool');
const util = require('util');
/**
 * @param {PoolConfig&PoolConfigStorage} options
 * @param workerCreateHelper
 * @mixes AbstractPool
 */
function PoolIsolates(options, workerCreateHelper) {
    AbstractPool.call(this, options);

    this.createNewWorker = function (callback) {
        const workerOptions = options.workerOptions;

        const getIsolatesWorker = options.bootScript;

        getIsolatesWorker(workerOptions)
            .then((newWorker) => {

                if (typeof workerCreateHelper === "function") {
                    workerCreateHelper(newWorker);
                }

                callback(undefined, newWorker)
            })
            .catch(err => {
                callback(err);
            });
    };

}

util.inherits(PoolIsolates, AbstractPool);

module.exports = PoolIsolates;

},{"./AbstractPool":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/AbstractPool.js","util":false}],"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/Pool-Threads.js":[function(require,module,exports){
const AbstractPool = require('./AbstractPool');
const util = require('util');

/**
 * @param {PoolConfig&PoolConfigStorage} options
 * @param {function} workerCreateHelper
 * @mixes AbstractPool
 */
function PoolThreads(options, workerCreateHelper) {
    AbstractPool.call(this, options);

    this.createNewWorker = function (callback) {
        const worker_threads ='worker_threads';
        const {Worker} = require(worker_threads);

        const newWorker = new Worker(options.bootScript, options.workerOptions);

        if (typeof workerCreateHelper === "function") {
            workerCreateHelper(newWorker);
        }

        const callbackWrapper = (...args) => {
            removeListeners();
            callback(...args);
        };

        function onMessage(msg) {
            if(msg !== 'ready') {
                callbackWrapper(new Error('Build script did not respond accordingly, it might be incompatible with current version'));
                return;
            }

            callbackWrapper(undefined, newWorker);
        }

        function removeListeners() {
            newWorker.removeListener('message', onMessage);
            newWorker.removeListener('error', callbackWrapper);
            newWorker.removeListener('exit', callbackWrapper);
        }

        newWorker.on('message', onMessage);
        newWorker.on('error', callbackWrapper);
        newWorker.on('exit', callbackWrapper);
    };

}

util.inherits(PoolThreads, AbstractPool);

module.exports = PoolThreads;

},{"./AbstractPool":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/AbstractPool.js","util":false}],"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/Pool-Web-Workers.js":[function(require,module,exports){
const AbstractPool = require('./AbstractPool');
const util = require('util');

/**
 * @param {PoolConfig&PoolConfigStorage} options
 * @param {function} workerCreateHelper
 * @mixes AbstractPool
 */
function PoolWebWorkers(options, workerCreateHelper) {
    AbstractPool.call(this, options);

    this.createNewWorker = function (callback) {

        const envTypes = require("overwrite-require").constants;
        if($$.environmentType !== envTypes.BROWSER_ENVIRONMENT_TYPE){
            return callback(new Error(`Web Worker is not available into current environment type <${$$.environmentType}>`));
        }

        const newWorker = new Worker(options.bootScript, options.workerOptions);

        if (typeof workerCreateHelper === "function") {
            workerCreateHelper(newWorker);
        }

        const callbackWrapper = (...args) => {
            removeListeners();
            callback(...args);
        };

        function onMessage(msg) {
            if(msg !== 'ready') {
                callbackWrapper(new Error('Build script did not respond accordingly, it might be incompatible with current version'));
                return;
            }

            callbackWrapper(undefined, newWorker);
        }

        function removeListeners() {
            newWorker.removeListener('message', onMessage);
            newWorker.removeListener('error', callbackWrapper);
            newWorker.removeListener('exit', callbackWrapper);
        }

        newWorker.on('message', onMessage);
        newWorker.on('error', callbackWrapper);
        newWorker.on('exit', callbackWrapper);
    };

}

util.inherits(PoolWebWorkers, AbstractPool);

module.exports = PoolWebWorkers;

},{"./AbstractPool":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/AbstractPool.js","overwrite-require":"overwrite-require","util":false}],"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/PoolConfig.js":[function(require,module,exports){
const os = require('os');
const util = require('util');
const WorkerStrategies = require('./WorkerStrategies');

function PoolConfigStorage() {
    this.bootScript = ``;
    this.maximumNumberOfWorkers = os.cpus().length;
    this.workerStrategy = WorkerStrategies.THREADS;
    this.workerOptions = {
        eval: false
    };
}

/**
 * This just provides validation for properties on config
 * Substituting this class to PoolConfigStorage should behave exactly the same effect if the config is valid
 * @constructor
 */
function PoolConfig() {
    const storage = new PoolConfigStorage();

    return {
        get bootScript() {
            return storage.bootScript;
        },
        set bootScript(value) {
            storage.bootScript = value;
        },

        get maximumNumberOfWorkers() {
            return storage.maximumNumberOfWorkers;
        },
        set maximumNumberOfWorkers(value) {
            if (!Number.isFinite(value)) {
                throw new TypeError(`Attribute maximumNumberOfWorkers should be a finite number, got ${typeof value}`);
            }

            if (value <= 0) {
                throw new RangeError(`Attribute maximumNumberOfWorkers should have a value bigger than 0, got ${value}`);
            }

            storage.maximumNumberOfWorkers = value;
        },

        get workerStrategy() {
            return storage.workerStrategy
        },
        set workerStrategy(value) {
            if (!Object.values(WorkerStrategies).includes(value)) {
                throw new TypeError(`Value ${value} not allowed for workerStrategy attribute`);
            }

            storage.workerStrategy = value;
        },

        get workerOptions() {
            return storage.workerOptions;
        },
        set workerOptions(value) {
            storage.workerOptions = value;
        },

        toJSON: function () {
            return JSON.stringify(storage);
        },
        [Symbol.toStringTag]: function () {
            return storage.toString()
        },
        [util.inspect.custom]: function () {
            return util.inspect(storage, {colors: true});
        }
    }
}

/**
 * This utility merges a new config to a default one. It is easier to use if you want to overwrite only a subset
 * of properties of the config.
 * @returns {PoolConfig&PoolConfigStorage}
 */
PoolConfig.createByOverwritingDefaults = function (config = {}, options = {allowNewKeys: true, allowUndefined: true}) {
    const defaultConfig = new PoolConfig();

    Object.keys(config).forEach(key => {

        if (!options.allowNewKeys && !defaultConfig.hasOwnProperty(key)) {
            throw new Error(`Tried overwriting property ${key} that does not exist on PoolConfig. ` +
                `If this is intentional, set in options argument "allowNewKeys" to true'`);
        }

        if (!options.allowUndefined && typeof config[key] === 'undefined') {
            throw new Error(`Tried setting value of ${key} to undefined. ` +
                'If this is intentional, set in options argument "allowUndefined" to true');
        }

        defaultConfig[key] = config[key];
    });

    return defaultConfig;
};

module.exports = PoolConfig;
},{"./WorkerStrategies":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/WorkerStrategies.js","os":false,"util":false}],"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/QueueShim.js":[function(require,module,exports){
function Queue() {
    const backingStorage = [];

    Object.defineProperty(this, 'length', {
        get() {
            return backingStorage.length
        },
        set(value) {
            backingStorage.length = value;
        }
    });

    Object.defineProperty(this, 'head', {
        get: () => {
            if (backingStorage.length > 0) {
                return backingStorage[0];
            }

            return null;
        }
    });

    Object.defineProperty(this, 'tail', {
        get: () => {
            const length = backingStorage.length;
            if (length > 0) {
                return backingStorage[length - 1];
            }

            return null;
        }
    });


    this.push = (value) => {
        backingStorage.push(value);
    };

    this.pop = () => {
        return backingStorage.shift();
    };

    this.front = function () {
        return this.head;
    };

    this.isEmpty = function () {
        return backingStorage.length === 0;
    };

    this[Symbol.iterator] = backingStorage[Symbol.iterator];

    this.toString = backingStorage.toString;
    this[Symbol.for('nodejs.util.inspect.custom')] = function() {
        return JSON.stringify(backingStorage);
    }

}

module.exports = Queue;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/WorkerPool.js":[function(require,module,exports){

/** @param pool {AbstractPool} */
function WorkerPool(pool) {
    const {assert} = require('./utils');
    let Queue;

    try {
        Queue = require('swarmutils').Queue;
    } catch (e) {
        Queue = require('./QueueShim.js');
    }

    const PoolEvents = pool.events;
    const taskQueue = new Queue();

    this.addTask = function (task, callback) {
        const taskAccepted = this.runTaskImmediately(task, callback);

        if (!taskAccepted) {
            taskQueue.push({task, callback});
            return false;
        }

        return true;
    };

    /**
     * Tries to run task if a worker is available, if it is not it will simply discard the task
     * @returns {boolean} - True if the task was given to a worker, false if no worker was available for this task
     */
    this.runTaskImmediately = function (task, callback) {
        const worker = pool.getAvailableWorker();

        if (!worker) {
            return false;
        }

        addWorkerListeners(worker, callback);

        worker.postMessage(task);
        return true;
    };

    pool.on(PoolEvents.RELEASED_WORKER, () => {
        if (taskQueue.isEmpty()) {
            return;
        }

        const taskSize = taskQueue.length;
        const nextTask = taskQueue.front();

        const taskWasAcceptedByAWorker = this.runTaskImmediately(nextTask.task, nextTask.callback);

        if (taskWasAcceptedByAWorker) {
            taskQueue.pop();
            const newTaskSize = taskQueue.length;
            assert(newTaskSize === taskSize - 1, {ifFails: `The task queue size did not decrease, expected to be ${taskSize - 1} but is ${newTaskSize}`})
        } else {
            const newTaskSize = taskQueue.length;
            assert(newTaskSize === taskSize, {ifFails: `The task queue size modified when it shouldn't, expected to be equal but got pair (old: ${taskSize}, new: ${newTaskSize})`});
            // events are propagates synchronously as mentioned in documentation (https://nodejs.org/api/events.html#events_asynchronous_vs_synchronous)
            // one reason why this can happen is if the worker is not properly marked as "not working"
            // another one is that the queue contains a worker that is free but can't accept tasks (it might have been terminated)
            console.error(`This should never happen and it's most likely a bug`);
        }
    });

    /**
     * @param {Worker} worker
     * @param {function} callbackForListeners
     */
    function addWorkerListeners(worker, callbackForListeners) {

        function callbackWrapper(...args) {
            removeListeners();
            if(args[0] instanceof Error) {
                pool.removeWorker(worker);
            } else {
                pool.returnWorker(worker);
            }
            callbackForListeners(...args);
        }

        function onMessage(...args) {
            if (args[0] instanceof Error) {
                callbackWrapper(...args);
            } else {
                callbackWrapper(undefined, ...args);
            }
        }

        function onError(err) {
            callbackWrapper(err);
        }

        function onExit(code) {
            if (code !== 0) {
                callbackWrapper(new Error(`Worker exited unexpectedly with code ${code}`));
            }
        }

        worker.once('message', onMessage);
        worker.once('error', onError);
        worker.once('exit', onExit);

        function removeListeners() {
            worker.removeListener('message', onMessage);
            worker.removeListener('error', onError);
            worker.removeListener('exit', onExit);
        }
    }

}

module.exports = WorkerPool;

},{"./QueueShim.js":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/QueueShim.js","./utils":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/utils.js","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/WorkerStrategies.js":[function(require,module,exports){
const WorkerStrategies = {
    THREADS: 'threads',
    ISOLATES: 'isolates',
    WEB_WORKERS: 'web-workers'
};

module.exports = Object.freeze(WorkerStrategies);

},{}],"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/utils.js":[function(require,module,exports){
function assert(condition, {ifFails}) {
    if (condition === false) {
        console.error(ifFails);
    }
}

module.exports = {
    assert
};

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

},{}],"adler32":[function(require,module,exports){

"use strict";

var algorithm = require('./lib/algorithm');
var Hash = require('./lib/Hash');
var register = require('./lib/register');

exports.sum = algorithm.sum.bind(algorithm);
exports.roll = algorithm.roll.bind(algorithm);
exports.Hash = Hash;
exports.register = register;

},{"./lib/Hash":"/home/travis/build/PrivateSky/privatesky/modules/adler32/lib/Hash.js","./lib/algorithm":"/home/travis/build/PrivateSky/privatesky/modules/adler32/lib/algorithm.js","./lib/register":"/home/travis/build/PrivateSky/privatesky/modules/adler32/lib/register.js"}],"bar-fs-adapter":[function(require,module,exports){
module.exports.createFsAdapter = () => {
    const FsAdapter = require("./lib/FsAdapter");
    return new FsAdapter();
};
},{"./lib/FsAdapter":"/home/travis/build/PrivateSky/privatesky/modules/bar-fs-adapter/lib/FsAdapter.js"}],"bar":[function(require,module,exports){

const ArchiveConfigurator = require("./lib/ArchiveConfigurator");
const createFolderBrickStorage = require("./lib/FolderBrickStorage").createFolderBrickStorage;
const createFileBrickStorage = require("./lib/FileBrickStorage").createFileBrickStorage;

ArchiveConfigurator.prototype.registerStorageProvider("FolderBrickStorage", createFolderBrickStorage);
ArchiveConfigurator.prototype.registerStorageProvider("FileBrickStorage", createFileBrickStorage);

module.exports.ArchiveConfigurator = ArchiveConfigurator;
module.exports.createBrick = (config) => {
    const Brick = require("./lib/Brick");
    return new Brick(config);
};

module.exports.createArchive = (archiveConfigurator) => {
    const Archive = require("./lib/Archive");
    return new Archive(archiveConfigurator);
};
module.exports.createArchiveConfigurator = () => {
    return new ArchiveConfigurator();
};

module.exports.createBarMap = (header) => {
    const BarMap = require("./lib/BarMap");
    return new BarMap(header);
};

module.exports.Seed = require('./lib/Seed');
module.exports.createFolderBrickStorage = createFolderBrickStorage;
module.exports.createFileBrickStorage = createFileBrickStorage;

},{"./lib/Archive":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Archive.js","./lib/ArchiveConfigurator":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/ArchiveConfigurator.js","./lib/BarMap":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/BarMap.js","./lib/Brick":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js","./lib/FileBrickStorage":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FileBrickStorage.js","./lib/FolderBrickStorage":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FolderBrickStorage.js","./lib/Seed":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Seed.js"}],"callflow":[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./constants":"/home/travis/build/PrivateSky/privatesky/modules/callflow/constants.js","./lib/InterceptorRegistry":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/InterceptorRegistry.js","./lib/loadLibrary":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/loadLibrary.js","./lib/parallelJoinPoint":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/parallelJoinPoint.js","./lib/serialJoinPoint":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/serialJoinPoint.js","./lib/swarmDescription":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/swarmDescription.js","./lib/utilityFunctions/base":"/home/travis/build/PrivateSky/privatesky/modules/callflow/lib/utilityFunctions/base.js","crypto":false,"path":false,"soundpubsub":false}],"dossier":[function(require,module,exports){
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
},{"overwrite-require":"overwrite-require","pskcrypto":"pskcrypto","swarm-engine":"swarm-engine"}],"edfs-brick-storage":[function(require,module,exports){
module.exports.create = (endpoint) => {
    const EDFSBrickStorage = require("./EDFSBrickStorage");
    return new EDFSBrickStorage(endpoint)
};

},{"./EDFSBrickStorage":"/home/travis/build/PrivateSky/privatesky/modules/edfs-brick-storage/EDFSBrickStorage.js"}],"edfs":[function(require,module,exports){
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

},{"./brickTransportStrategies/FetchBrickTransportStrategy":"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/FetchBrickTransportStrategy.js","./brickTransportStrategies/HTTPBrickTransportStrategy":"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/HTTPBrickTransportStrategy.js","./brickTransportStrategies/brickTransportStrategiesRegistry":"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/brickTransportStrategiesRegistry.js","./lib/EDFS":"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/EDFS.js","./moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/edfs/moduleConstants.js","./seedCage":"/home/travis/build/PrivateSky/privatesky/modules/edfs/seedCage/index.js","bar":"bar","overwrite-require":"overwrite-require","psk-cache":"psk-cache"}],"overwrite-require":[function(require,module,exports){
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

},{"./lib/Cache":"/home/travis/build/PrivateSky/privatesky/modules/psk-cache/lib/Cache.js"}],"psk-http-client":[function(require,module,exports){
//to look nice the requireModule on Node
require("./lib/psk-abstract-client");
const or = require('overwrite-require');
if ($$.environmentType === or.constants.BROWSER_ENVIRONMENT_TYPE) {
	require("./lib/psk-browser-client");
} else {
	require("./lib/psk-node-client");
}
},{"./lib/psk-abstract-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-abstract-client.js","./lib/psk-browser-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-browser-client.js","./lib/psk-node-client":"/home/travis/build/PrivateSky/privatesky/modules/psk-http-client/lib/psk-node-client.js","overwrite-require":"overwrite-require"}],"psk-key-did-resolver":[function(require,module,exports){
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

},{"./lib/BarMapStrategy/BarMapStrategyMixin":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/BarMapStrategyMixin.js","./lib/BarMapStrategy/Factory":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BarMapStrategy/Factory.js","./lib/BootstrapingService":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/BootstrapingService/index.js","./lib/DID/DIDMixin":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/DID/DIDMixin.js","./lib/KeyDIDResolver":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/KeyDIDResolver.js","./lib/constants":"/home/travis/build/PrivateSky/privatesky/modules/psk-key-did-resolver/lib/constants.js"}],"pskcrypto":[function(require,module,exports){
const PskCrypto = require("./lib/PskCrypto");
const ssutil = require("./signsensusDS/ssutil");

module.exports = PskCrypto;

module.exports.hashValues = ssutil.hashValues;

module.exports.DuplexStream = require("./lib/utils/DuplexStream");

module.exports.isStream = require("./lib/utils/isStream");
},{"./lib/PskCrypto":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/PskCrypto.js","./lib/utils/DuplexStream":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/DuplexStream.js","./lib/utils/isStream":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/isStream.js","./signsensusDS/ssutil":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/signsensusDS/ssutil.js"}],"pskwallet/index.js":[function(require,module,exports){
(function (__dirname){
const pskConsole = require('swarmutils').createPskConsole();
const pathModule = "path";
const path = require(pathModule);
process.env.PSK_ROOT_INSTALATION_FOLDER = path.resolve("." + __dirname + "/../..");
require("./cmds");
pskConsole.runCommand();

}).call(this,"/modules/pskwallet")

},{"./cmds":"/home/travis/build/PrivateSky/privatesky/modules/pskwallet/cmds/index.js","swarmutils":"swarmutils"}],"swarm-engine":[function(require,module,exports){
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

},{"./lib/Combos":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Combos.js","./lib/OwM":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/OwM.js","./lib/Queue":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Queue.js","./lib/SwarmPacker":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/SwarmPacker.js","./lib/TaskCounter":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/TaskCounter.js","./lib/beesHealer":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/beesHealer.js","./lib/path":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/path.js","./lib/pingpongFork":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/pingpongFork.js","./lib/pskconsole":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/pskconsole.js","./lib/safe-uuid":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/safe-uuid.js","./lib/uidGenerator":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/uidGenerator.js"}],"syndicate":[function(require,module,exports){
const PoolConfig = require('./lib/PoolConfig');
const WorkerPool = require('./lib/WorkerPool');
const WorkerStrategies = require('./lib/WorkerStrategies');

let registry = {};
function registerWorkerStrategy(strategyName, constructor){
    registry[strategyName] = constructor;
}

function getWorkerStrategy(strategyName){
    return registry[strategyName];
}

/**
 * @throws if config is invalid, if config tries to set properties to undefined or add new properties (check PoolConfig to see solutions)
 * @throws if providing a working dir that does not exist, the directory should be created externally
 * @throws if trying to use a strategy that does not exist
 */
function createWorkerPool(poolConfig, workerCreateHelper) {
    const newPoolConfig = PoolConfig.createByOverwritingDefaults(poolConfig);
    /*
    TODO: why do we need to check this here? :-??

    const fs = require('fs');
    const path = require('path');
    if (newPoolConfig.workerOptions && newPoolConfig.workerOptions.cwd && !fs.existsSync(newPoolConfig.workerOptions.cwd)) {
        throw new Error(`The provided working directory does not exists ${config.workingDir}`);
    }*/

    let workerStrategy = getWorkerStrategy(newPoolConfig.workerStrategy);
    if(typeof workerStrategy === "undefined"){
        throw new TypeError(`Could not find a implementation for worker strategy "${newPoolConfig.workerStrategy}"`);
    }

    let concretePool = new workerStrategy(newPoolConfig, workerCreateHelper);

    return new WorkerPool(concretePool);
}

const PoolIsolates = require('./lib/Pool-Isolates');
registerWorkerStrategy(WorkerStrategies.ISOLATES, PoolIsolates);

const PoolThreads = require('./lib/Pool-Threads');
registerWorkerStrategy(WorkerStrategies.THREADS, PoolThreads);

const PoolWebWorkers = require('./lib/Pool-Web-Workers');
registerWorkerStrategy(WorkerStrategies.WEB_WORKERS, PoolWebWorkers);

module.exports = {
    createWorkerPool,
    PoolConfig,
    WorkerStrategies,
    registerWorkerStrategy
};

},{"./lib/Pool-Isolates":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/Pool-Isolates.js","./lib/Pool-Threads":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/Pool-Threads.js","./lib/Pool-Web-Workers":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/Pool-Web-Workers.js","./lib/PoolConfig":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/PoolConfig.js","./lib/WorkerPool":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/WorkerPool.js","./lib/WorkerStrategies":"/home/travis/build/PrivateSky/privatesky/modules/syndicate/lib/WorkerStrategies.js"}]},{},["/home/travis/build/PrivateSky/privatesky/builds/tmp/walletBoot.js"])