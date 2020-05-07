domainBootRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/travis/build/PrivateSky/privatesky/builds/tmp/domainBoot.js":[function(require,module,exports){
const or = require('overwrite-require');
or.enableForEnvironment(or.constants.NODEJS_ENVIRONMENT_TYPE);

require("./domainBoot_intermediar");
},{"./domainBoot_intermediar":"/home/travis/build/PrivateSky/privatesky/builds/tmp/domainBoot_intermediar.js","overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/builds/tmp/domainBoot_intermediar.js":[function(require,module,exports){
(function (global){
global.domainBootLoadModules = function(){ 

	if(typeof $$.__runtimeModules["overwrite-require"] === "undefined"){
		$$.__runtimeModules["overwrite-require"] = require("overwrite-require");
	}

	if(typeof $$.__runtimeModules["psklogger"] === "undefined"){
		$$.__runtimeModules["psklogger"] = require("psklogger");
	}

	if(typeof $$.__runtimeModules["psk-cache"] === "undefined"){
		$$.__runtimeModules["psk-cache"] = require("psk-cache");
	}

	if(typeof $$.__runtimeModules["zmq_adapter"] === "undefined"){
		$$.__runtimeModules["zmq_adapter"] = require("zmq_adapter");
	}

	if(typeof $$.__runtimeModules["psk-security-context"] === "undefined"){
		$$.__runtimeModules["psk-security-context"] = require("psk-security-context");
	}

	if(typeof $$.__runtimeModules["bar"] === "undefined"){
		$$.__runtimeModules["bar"] = require("bar");
	}

	if(typeof $$.__runtimeModules["psk-http-client"] === "undefined"){
		$$.__runtimeModules["psk-http-client"] = require("psk-http-client");
	}

	if(typeof $$.__runtimeModules["edfs"] === "undefined"){
		$$.__runtimeModules["edfs"] = require("edfs");
	}

	if(typeof $$.__runtimeModules["edfs-middleware"] === "undefined"){
		$$.__runtimeModules["edfs-middleware"] = require("edfs-middleware");
	}

	if(typeof $$.__runtimeModules["edfs-brick-storage"] === "undefined"){
		$$.__runtimeModules["edfs-brick-storage"] = require("edfs-brick-storage");
	}

	if(typeof $$.__runtimeModules["bar-fs-adapter"] === "undefined"){
		$$.__runtimeModules["bar-fs-adapter"] = require("bar-fs-adapter");
	}

	if(typeof $$.__runtimeModules["adler32"] === "undefined"){
		$$.__runtimeModules["adler32"] = require("adler32");
	}

	if(typeof $$.__runtimeModules["pskcrypto"] === "undefined"){
		$$.__runtimeModules["pskcrypto"] = require("pskcrypto");
	}

	if(typeof $$.__runtimeModules["swarmutils"] === "undefined"){
		$$.__runtimeModules["swarmutils"] = require("swarmutils");
	}

	if(typeof $$.__runtimeModules["boot-script"] === "undefined"){
		$$.__runtimeModules["boot-script"] = require("swarm-engine/bootScripts/domainBootScript");
	}
};
if (true) {
	domainBootLoadModules();
}
global.domainBootRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("domainBoot");
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"adler32":"adler32","bar":"bar","bar-fs-adapter":"bar-fs-adapter","edfs":"edfs","edfs-brick-storage":"edfs-brick-storage","edfs-middleware":"edfs-middleware","overwrite-require":"overwrite-require","psk-cache":"psk-cache","psk-http-client":"psk-http-client","psk-security-context":"psk-security-context","pskcrypto":"pskcrypto","psklogger":"psklogger","swarm-engine/bootScripts/domainBootScript":"swarm-engine/bootScripts/domainBootScript","swarmutils":"swarmutils","zmq_adapter":"zmq_adapter"}],"/home/travis/build/PrivateSky/privatesky/modules/adler32/lib/Hash.js":[function(require,module,exports){
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

function Archive(archiveConfigurator) {

    const archiveFsAdapter = archiveConfigurator.getFsAdapter();
    const storageProvider = archiveConfigurator.getStorageProvider();
    const cache = archiveConfigurator.getCache();

    let cachedSEED;
    let barMap;
    let cachedMapDigest;
    let validator;

    this.getMapDigest = () => {
        if (cachedMapDigest) {
            return cachedMapDigest;
        }

        cachedMapDigest = archiveConfigurator.getMapDigest();
        return cachedMapDigest;
    };

    this.setSeed = (seed) => {
        cachedSEED = seed;
        archiveConfigurator.setSeed(Buffer.from(seed));
    };

    this.getSeed = () => {
        if (cachedSEED) {
            return cachedSEED;
        }

        cachedSEED = archiveConfigurator.getSeed().toString();
        return cachedSEED;
    };

    this.getFileHash = (barPath, callback) => {
        barPath = pskPth.normalize(barPath);
        loadBarMapThenExecute(() => {
            callback(undefined, __computeFileHash(barPath).toString("hex"));
        }, callback)
    };

    this.getFolderHash = (barPath, callback) => {
        barPath = pskPth.normalize(barPath);
        loadBarMapThenExecute(() => {
            const fileList = barMap.getFileList(barPath);
            if (fileList.length === 1) {
                return callback(undefined, __computeFileHash(pskPth.join(barPath, fileList[0]).toString("hex")));
            }
            fileList.sort();

            let xor = __computeFileHash(pskPth.join(barPath, fileList[0]));
            for (let i = 0; i < fileList.length - 1; i++) {
                xor = crypto.xorBuffers(xor, __computeFileHash(pskPth.join(barPath, fileList[i + 1])));
            }

            callback(undefined, crypto.pskHash(xor, "hex"));
        }, callback);
    };

    this.writeFile = (barPath, data, options, callback) => {
        if (typeof options === "function") {
            callback = options;
            options = {};
            options.encrypt = true;
        }
        barPath = pskPth.normalize(barPath);

        loadBarMapThenExecute(__addData, callback);

        function __addData() {
            archiveConfigurator.setIsEncrypted(options.encrypt);
            const bufferSize = archiveConfigurator.getBufferSize();

            if (typeof data === "string") {
                data = Buffer.from(data);
            }


            if (Buffer.isBuffer(data)) {
                let bricks;
                try {
                    bricks = createBricksFromBuffer(data, bufferSize);
                } catch (e) {
                    return callback(e);
                }
                return updateBar(barPath, bricks, callback);
            }

            if (isStream.isReadable(data)) {
                return createBricksFromStream(data, bufferSize, (err, bricks) => {
                    if (err) {
                        return callback(err);
                    }

                    updateBar(barPath, bricks, callback);
                });
            }

            return callback(Error(`Type of data is ${typeof data}. Expected Buffer or Stream.Readable`));
        }
    };

    this.readFile = (barPath, callback) => {
        barPath = pskPth.normalize(barPath);
        loadBarMapThenExecute(__readFile, callback);

        function __readFile() {
            let fileData = Buffer.alloc(0);
            let brickIds;
            try {
                brickIds = barMap.getHashList(barPath);
            } catch (err) {
                return callback(err);
            }

            getFileRecursively(0, callback);

            function getFileRecursively(brickIndex, callback) {
                const brickId = brickIds[brickIndex];
                getBrickData(brickId, (err, data) => {
                    if (err) {
                        return callback(err);
                    }

                    fileData = Buffer.concat([fileData, data]);
                    ++brickIndex;

                    if (brickIndex < brickIds.length) {
                        getFileRecursively(brickIndex, callback);
                    } else {
                        callback(undefined, fileData);
                    }

                });
            }
        }
    };

    this.createReadStream = (barPath, callback) => {
        barPath = pskPth.normalize(barPath);
        loadBarMapThenExecute(__prepareStream, callback);

        function __prepareStream() {
            let brickIndex = 0;
            let brickIds;

            try {
                brickIds = barMap.getHashList(barPath);
            } catch (err) {
                return callback(err);
            }

            const readableStream = new stream.Readable({
                read(size) {
                    if (brickIndex < brickIds.length) {
                        this.readBrickData(brickIndex++);
                    }
                }
            });

            // Get a brick and push it into the stream
            readableStream.readBrickData = function (brickIndex) {
                const brickId = brickIds[brickIndex];
                getBrickData(brickId, (err, data) => {
                    if (err) {
                        this.destroy(err);
                        return;
                    }

                    this.push(data);

                    if (brickIndex >= (brickIds.length - 1)) {
                        this.push(null);
                    }
                });
            };

            callback(null, readableStream);
        }
    };

    this.addFile = (fsFilePath, barPath, options, callback) => {
        if (typeof options === "function") {
            callback = options;
            options = {};
            options.encrypt = true;
        }

        barPath = pskPth.normalize(barPath);

        loadBarMapThenExecute(__addFile, callback);

        function __addFile() {
            createBricks(fsFilePath, barPath, archiveConfigurator.getBufferSize(), options.encrypt, (err) => {
                if (err) {
                    return callback(err);
                }

                barMap.setConfig(archiveConfigurator);
                if (archiveConfigurator.getMapEncryptionKey()) {
                    barMap.setEncryptionKey(archiveConfigurator.getMapEncryptionKey());
                }

                storageProvider.putBarMap(barMap, callback);
            });
        }
    };

    this.addFiles = (arrWithFilePaths, barPath, options, callback) => {
        if (typeof options === "function") {
            callback = options;
            options = {};
            options.encrypt = true;
        }

        barPath = pskPth.normalize(barPath);

        let arr = arrWithFilePaths.slice();

        loadBarMapThenExecute(() => {
            recAdd()
        }, callback);

        function recAdd() {
            if (arr.length > 0) {
                let filePath = arr.pop();
                let fileName = path.basename(filePath);

                createBricks(filePath, pskPth.join(barPath, fileName), archiveConfigurator.getBufferSize(), options.encrypt, (err) => {
                    if (err) {
                        return callback(err);
                    }

                    recAdd();
                });
            } else {
                barMap.setConfig(archiveConfigurator);
                if (archiveConfigurator.getMapEncryptionKey()) {
                    barMap.setEncryptionKey(archiveConfigurator.getMapEncryptionKey());
                }
                storageProvider.putBarMap(barMap, callback);
            }
        }
    };

    this.extractFile = (fsFilePath, barPath, callback) => {
        if (typeof barPath === "function") {
            callback = barPath;
            barPath = pskPth.normalize(fsFilePath);
        }


        loadBarMapThenExecute(__extractFile, callback);

        function __extractFile() {
            const brickIds = barMap.getHashList(barPath);
            getFileRecursively(0, callback);

            function getFileRecursively(brickIndex, callback) {
                const brickId = brickIds[brickIndex];
                getBrickData(brickId, (err, data) => {
                    if (err) {
                        return callback(err);
                    }

                    archiveFsAdapter.appendBlockToFile(fsFilePath, data, (err) => {
                        if (err) {
                            return callback(err);
                        }

                        ++brickIndex;
                        if (brickIndex < brickIds.length) {
                            getFileRecursively(brickIndex, callback);
                        } else {
                            callback();
                        }
                    });
                })
            }
        }
    };

    this.appendToFile = (filePath, data, callback) => {

        loadBarMapThenExecute(__appendToFile, callback);

        function __appendToFile() {
            filePath = path.normalize(filePath);

            if (typeof data === "string") {
                data = Buffer.from(data);
            }
            if (Buffer.isBuffer(data)) {
                const dataBrick = new Brick(data);
                storageProvider.putBrick(dataBrick, (err) => {
                    if (err) {
                        return callback(err);
                    }

                    barMap.add(filePath, dataBrick);
                    putBarMap(callback);
                });
                return;
            }

            if (isStream.isReadable(data)) {
                data.on('error', (err) => {
                    return callback(err);
                }).on('data', (chunk) => {
                    const dataBrick = new Brick(chunk);
                    barMap.add(filePath, dataBrick);
                    storageProvider.putBrick(dataBrick, (err) => {
                        if (err) {
                            return callback(err);
                        }
                    });
                }).on("end", () => {
                    putBarMap(callback);
                });
                return;
            }
            callback(new Error("Invalid type of parameter data"));
        }
    };


    this.replaceFile = (fileName, stream, callback) => {
        if (typeof stream !== 'object') {
            return callback(new Error('Wrong stream!'));
        }

        loadBarMapThenExecute(__replaceFile, callback);

        function __replaceFile() {
            fileName = path.normalize(fileName);
            stream.on('error', () => {
                return callback(new Error("File does not exist!"));
            }).on('open', () => {
                storageProvider.deleteFile(fileName, (err) => {
                    if (err) {
                        return callback(err);
                    }

                    barMap.emptyList(fileName);
                });
            }).on('data', (chunk) => {
                let tempBrick = new Brick(chunk);
                barMap.add(fileName, tempBrick);
                storageProvider.putBrick(tempBrick, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    putBarMap(callback);
                });
            });
        }
    };

    this.addFolder = (fsFolderPath, barPath, options, callback) => {
        if (typeof options === "function") {
            callback = options;
            options = {};
            options.encrypt = true;
        }
        barPath = pskPth.normalize(barPath);
        const filesIterator = archiveFsAdapter.getFilesIterator(fsFolderPath);

        loadBarMapThenExecute(__addFolder, callback);

        function __addFolder() {

            filesIterator.next(readFileCb);

            function readFileCb(err, file, rootFsPath) {
                if (err) {
                    return callback(err);
                }

                if (typeof file !== "undefined") {
                    createBricks(path.join(rootFsPath, file), pskPth.join(barPath, file), archiveConfigurator.getBufferSize(), options.encrypt, (err) => {
                        if (err) {
                            return callback(err);
                        }

                        filesIterator.next(readFileCb);
                    });
                } else {
                    storageProvider.putBarMap(barMap, (err, mapDigest) => {
                        if (err) {
                            return callback(err);
                        }

                        archiveConfigurator.setMapDigest(mapDigest);
                        callback(undefined, mapDigest);
                    });
                }
            }
        }
    };


    this.extractFolder = (fsFolderPath, barPath, callback) => {
        if (typeof barPath === "function") {
            callback = barPath;
            barPath = pskPth.normalize(fsFolderPath);
        }

        loadBarMapThenExecute(() => {
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
        }, callback);
    };

    this.store = (callback) => {
        storageProvider.putBarMap(barMap, callback);
    };

    this.delete = (barPath, callback) => {
        loadBarMapThenExecute(() => {
            barMap.delete(barPath);
            callback();
        }, callback);
    };

    this.listFiles = (folderBarPath, recursive, callback) => {
        if (typeof recursive === "function") {
            callback = recursive;
            recursive = true;
        } else if (typeof folderBarPath === "function") {
            callback = folderBarPath;
            recursive = true;
            folderBarPath = "/";
        }


        loadBarMapThenExecute(() => {
            let fileList;
            try {
                fileList = barMap.getFileList(folderBarPath, recursive);
            } catch (e) {
                return callback(e);
            }

            callback(undefined, fileList);
        }, callback);
    };

    this.listFolders = (folderBarPath, recursive, callback) => {
        if (typeof recursive === "function") {
            callback = recursive;
            recursive = true;
        }

        loadBarMapThenExecute(() => {
            callback(undefined, barMap.getFolderList(folderBarPath, recursive));
        }, callback);
    };

    this.clone = (targetStorage, preserveKeys = true, callback) => {
        targetStorage.getBarMap((err, targetBarMap) => {
            if (err) {
                return callback(err);
            }

            loadBarMapThenExecute(__cloneBricks, callback);

            function __cloneBricks() {
                const fileList = barMap.getFileList("/");

                __getFilesRecursively(fileList, 0, (err) => {
                    if (err) {
                        return callback(err);
                    }

                    cachedSEED = archiveConfigurator.getSeed();
                    archiveConfigurator.generateSeed();
                    targetBarMap.setEncryptionKey(archiveConfigurator.getMapEncryptionKey());
                    targetBarMap.setConfig(archiveConfigurator);
                    targetStorage.putBarMap(targetBarMap, err => callback(err, archiveConfigurator.getSeed()));
                });
            }

            function __getFilesRecursively(fileList, fileIndex, callback) {
                const filePath = fileList[fileIndex];
                __getBricksRecursively(filePath, barMap.getHashList(filePath), 0, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    ++fileIndex;
                    if (fileIndex === fileList.length) {
                        return callback();
                    }

                    __getFilesRecursively(fileList, fileIndex, callback);
                });
            }

            function __getBricksRecursively(filePath, brickList, brickIndex, callback) {
                storageProvider.getBrick(brickList[brickIndex], (err, brick) => {
                    if (err) {
                        return callback(err);
                    }

                    if (barMap.getTransformParameters(brickList[brickIndex])) {
                        brick.setTransformParameters(barMap.getTransformParameters(brickList[brickIndex]));
                    }
                    __addBrickToTarget(brick, callback);
                });

                function __addBrickToTarget(brick, callback) {
                    brick.setConfig(archiveConfigurator);
                    if (!preserveKeys) {
                        brick.createNewTransform();
                    }

                    ++brickIndex;
                    targetBarMap.add(filePath, brick);
                    targetStorage.putBrick(brick, (err) => {
                        if (err) {
                            return callback(err);
                        }

                        if (brickIndex === brickList.length) {
                            return callback();
                        }

                        __getBricksRecursively(filePath, brickList, brickIndex, callback);
                    });
                }
            }
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

    //------------------------------------------- internal methods -----------------------------------------------------

    function __computeFileHash(fileBarPath) {
        const hashList = barMap.getHashList(fileBarPath);
        const PskHash = crypto.PskHash;
        const pskHash = new PskHash();
        hashList.forEach(hash => {
            pskHash.update(hash);
        });

        return pskHash.digest();
    }

    function putBarMap(callback) {
        if (typeof archiveConfigurator.getMapDigest() !== "undefined") {
            storageProvider.deleteFile(archiveConfigurator.getMapDigest(), (err) => {
                if (err) {
                    return callback(err);
                }

                __putBarMap(callback);
            });
            return;
        }
        __putBarMap(callback);
    }

    function __putBarMap(callback) {
        storageProvider.putBarMap(barMap, (err, newMapDigest) => {
            if (err) {
                return callback(err);
            }

            archiveConfigurator.setMapDigest(newMapDigest);
            callback(undefined, archiveConfigurator.getMapDigest());
        });
    }

    function createBricks(fsFilePath, barPath, blockSize, areEncrypted, callback) {
        if (typeof areEncrypted === "function") {
            callback = areEncrypted;
            areEncrypted = true;
        }
        archiveFsAdapter.getFileSize(fsFilePath, (err, fileSize) => {
            if (err) {
                return callback(err);
            }

            let noBlocks = Math.floor(fileSize / blockSize);
            if (fileSize % blockSize > 0) {
                ++noBlocks;
            }

            if (!barMap.isEmpty(barPath)) {
                barMap.emptyList(barPath);
            }
            __createBricksRecursively(0, callback);

            function __createBricksRecursively(blockIndex, callback) {
                archiveFsAdapter.readBlockFromFile(fsFilePath, blockIndex * blockSize, (blockIndex + 1) * blockSize - 1, (err, blockData) => {
                    if (err) {
                        return callback(err);
                    }

                    archiveConfigurator.setIsEncrypted(areEncrypted);
                    const brick = new Brick(archiveConfigurator);
                    brick.setRawData(blockData);
                    barMap.add(barPath, brick);
                    storageProvider.putBrick(brick, (err) => {
                        if (err) {
                            return callback(err);
                        }

                        ++blockIndex;
                        if (blockIndex < noBlocks) {
                            __createBricksRecursively(blockIndex, callback);
                        } else {
                            callback();
                        }
                    });
                });
            }
        });
    }

    /**
     * Create bricks from a Buffer
     * @param {Buffer} buffer
     * @param {number} blockSize
     * @return {Array<Brick>}
     */
    function createBricksFromBuffer(buffer, blockSize) {
        let noBlocks = Math.floor(buffer.length / blockSize);
        if ((buffer.length % blockSize) > 0) {
            ++noBlocks;
        }

        const bricks = [];
        for (let blockIndex = 0; blockIndex < noBlocks; blockIndex++) {
            const blockData = buffer.slice(blockIndex * blockSize, (blockIndex + 1) * blockSize);

            const brick = new Brick(archiveConfigurator);
            brick.setRawData(blockData);
            bricks.push(brick);
        }

        return bricks;
    }

    /**
     * Create bricks from a Stream
     * @param {stream.Readable} stream
     * @param {number} blockSize
     * @param {callback|undefined} callback
     */
    function createBricksFromStream(stream, blockSize, callback) {
        let bricks = [];
        stream.on('data', (chunk) => {
            if (typeof chunk === 'string') {
                chunk = Buffer.from(chunk);
            }

            let chunkBricks = createBricksFromBuffer(chunk, chunk.length);
            bricks = bricks.concat(chunkBricks);
        });
        stream.on('error', (err) => {
            callback(err);
        });
        stream.on('end', () => {
            callback(undefined, bricks);
        });
    }

    /**
     * @param {string} barPath
     * @param {Array<Brick} bricks
     * @param {callback} callback
     */
    function updateBar(barPath, bricks, callback) {
        if (!barMap.isEmpty(barPath)) {
            barMap.emptyList(barPath);
        }

        for (let brick of bricks) {
            barMap.add(barPath, brick);
        }

        function __saveBricks(bricks, callback) {
            const brick = bricks.shift();

            if (!brick) {
                return storageProvider.putBarMap(barMap, callback);
            }

            storageProvider.putBrick(brick, (err) => {
                if (err) {
                    return callback(err);
                };

                __saveBricks(bricks, callback);
            })
        }

        if (!validator || typeof validator.writeRule !== 'function') {
            return __saveBricks(bricks, callback);
        }

        validator.writeRule.call(this, barMap, barPath, bricks, (err) => {
            if (err) {
                return callback(err);
            }

            __saveBricks(bricks, callback);
        });
    }

    /**
     * @param {*} key
     * @return {Boolean}
     */
    function hasInCache(key) {
        if (!cache) {
            return false;
        }

        return cache.has(key);
    }

    /**
     * @param {*} key
     * @param {*} value
     */
    function storeInCache(key, value) {
        if (!cache) {
            return;
        }

        cache.set(key, value);
    }

    /**
     * Try and get brick data from cache
     * Fallback to storage provide if not found in cache
     *
     * @param {string} hash
     * @param {callback} callback
     */
    function getBrickData(hash, callback) {
        if (!hasInCache(hash)) {
            return storageProvider.getBrick(hash, (err, brick) => {
                if (err) {
                    return callback(err);
                }

                brick.setConfig(archiveConfigurator);
                brick.setTransformParameters(barMap.getTransformParameters(hash));
                const data = brick.getRawData();
                storeInCache(hash, data);
                callback(undefined, data);
            });
        }

        const data = cache.get(hash);
        callback(undefined, data);
    }

    function loadBarMapThenExecute(functionToBeExecuted, callback) {
        const digest = archiveConfigurator.getMapDigest();
        if (!digest || !hasInCache(digest)) {
            return storageProvider.getBarMap(digest, (err, map) => {
                if (err) {
                    return callback(err);
                }

                if (archiveConfigurator.getMapEncryptionKey()) {
                    map.setEncryptionKey(archiveConfigurator.getMapEncryptionKey());
                }

                if (!map.getConfig()) {
                    map.setConfig(archiveConfigurator);
                }

                map.load();
                barMap = map;
                if (digest) {
                    storeInCache(digest, barMap);
                }
                storageProvider.setBarMap(barMap);
                functionToBeExecuted();
            });
        }

        const map = cache.get(digest);
        barMap = map;
        storageProvider.setBarMap(barMap);
        functionToBeExecuted();
    }
}

module.exports = Archive;

}).call(this,require("buffer").Buffer)

},{"../utils/isStream":"/home/travis/build/PrivateSky/privatesky/modules/bar/utils/isStream.js","./Brick":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js","adler32":"adler32","buffer":false,"pskcrypto":"pskcrypto","stream":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/ArchiveConfigurator.js":[function(require,module,exports){
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

    this.setMapDigest = (mapDigest) => {
        config.mapDigest = mapDigest;
    };

    this.getMapDigest = () => {
        return config.mapDigest;
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
        this.setMapDigest(key);
    };

    this.getSeedKey = () => {
        loadSeed();
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
        this.setMapDigest(config.seed.getKey());
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
        if (config.seed.getKey()) {
            self.setMapDigest(config.seed.getKey());
        }
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

},{"./Seed":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Seed.js"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js":[function(require,module,exports){
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
        const seedId = config.getSeedKey();
        if (seedId) {
            return seedId;
        }
        return config.getMapDigest();
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

},{"./transforms/BrickTransformFactory":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/BrickTransformFactory.js","adler32":"adler32","pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FileBarMap.js":[function(require,module,exports){
(function (Buffer){
const Brick = require("./Brick");
const util = require("../utils/utilities");
const pathModule = "path";
const path = require(pathModule);

function FileBarMap(header) {
    header = header || {};

    let brickOffset = util.getBarMapOffsetSize();
    let archiveConfig;
    let encryptionKey;

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

},{"../utils/utilities":"/home/travis/build/PrivateSky/privatesky/modules/bar/utils/utilities.js","./Brick":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js","buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FileBrickStorage.js":[function(require,module,exports){
(function (Buffer){
const BarMap = require("./FileBarMap");
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

},{"../utils/AsyncDispatcher":"/home/travis/build/PrivateSky/privatesky/modules/bar/utils/AsyncDispatcher.js","../utils/utilities":"/home/travis/build/PrivateSky/privatesky/modules/bar/utils/utilities.js","./Brick":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js","./FileBarMap":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FileBarMap.js","buffer":false,"fs":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FolderBarMap.js":[function(require,module,exports){
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

function FolderBarMap(header) {
    header = header || {};
    const pskPath = require("swarmutils").path;
    let archiveConfig;
    let encryptionKey;

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
            if (splitPath.length === 0) {
                const brickObj = {
                    checkSum: brick.getAdler32(),
                    hash: brick.getHash()
                };

                const encKey = brick.getTransformParameters() ? brick.getTransformParameters().key : undefined;
                if (encKey) {
                    brickObj.key = encKey;
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

        if (barPath === "/") {
            header = {};
        } else {
            const pathSegments = barPath.split("/");
            if (pathSegments[0] === "") {
                pathSegments.shift();
            }
            __removeRecursively(header, pathSegments);
        }

        function __removeRecursively(folderObj, splitPath) {
            const folderName = splitPath.shift();
            if (folderObj[folderName]) {
                if (splitPath.length === 0) {
                    folderObj[folderName] = undefined;
                } else {
                    __removeRecursively(folderObj[folderName], splitPath);
                }
            }
        }
    };

    this.getHashList = (filePath) => {
        filePath = pskPath.normalize(filePath);
        if (filePath === "") {
            throw Error("Invalid path.");
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
                        throw Error("Invalid path");
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
        return getFilesFromPath(header, folderBarPath, recursive);


        function getFilesFromPath(folderObj, barPath, recursive){
            let files = [];
            if (barPath === "/") {
                __getAllFiles(header, barPath);

                return files;
            } else {
                const pathSegments = barPath.split("/");
                __getFilesFromPath(header, pathSegments);

                return files;
            }

            function __getFilesFromPath(folderObj, pathSegments) {
                let folderName = pathSegments.shift();
                if (folderName === "") {
                    folderName = pathSegments.shift();
                }
                if (folderObj[folderName]) {
                    if (pathSegments.length === 0) {
                        Object.keys(folderObj[folderName]).forEach(file => {
                            if (Array.isArray(folderObj[folderName][file])) {
                                files.push(file);
                            }
                        });
                    } else {
                        if (recursive === true) {
                            __getFilesFromPath(folderObj[folderName], pathSegments);
                        }
                    }
                } else {
                    throw Error(`Invalid path ${folderBarPath}`);
                }
            }

            function __getAllFiles(folderObj, relativePath) {
                Object.keys(folderObj).forEach(folderName => {
                    if (folderObj[folderName]) {
                        let newPath = pskPath.join(relativePath, folderName);

                        if (Array.isArray(folderObj[folderName])) {
                            files.push(newPath);
                        } else {
                            if (recursive === true) {
                                __getAllFiles(folderObj[folderName], newPath);
                            }
                        }
                    }
                });
            }
        }
    };

    this.getFolderList = (barPath, recursive) => {
        barPath = pskPath.normalize(barPath);
        let folders = [];
        if (barPath === "/") {
            __getAllFolders(header, barPath, recursive);
            return folders;
        } else {
            const pathSegments = barPath.split("/");
            __getFoldersFromPath(header, pathSegments, "/", recursive);
            return folders;
        }

        function __getAllFolders(folderObj, relativePath, recursive) {
            Object.keys(folderObj).forEach(folderName => {
                if (typeof folderObj[folderName] === "object" && !Array.isArray(folderObj[folderName])) {
                    const newPath = pskPath.join(relativePath, folderName);
                    folders.push(newPath);
                    if (recursive === true) {
                        __getAllFolders(folderObj[folderName], newPath);
                    }
                }
            });
        }

        function __getFoldersFromPath(folderObj, pathSegments, relativePath, recursive) {
            let folderName = pathSegments.shift();
            if (folderName === "") {
                folderName = pathSegments.shift();
            }
            if (folderObj[folderName]) {
                const newFolderPath = pskPath.join(relativePath, folderName);
                if (pathSegments.length === 0) {
                    folders.push(newFolderPath);
                    Object.keys(folderObj[folderName]).forEach(fileName => {
                        if (typeof folderObj[folderName][fileName] === "object" && !Array.isArray(folderObj[folderName][fileName])) {
                            const newFilePath = pskPath.join(relativePath, fileName);
                            folders.push(newFilePath);
                            if (recursive === true) {
                                __getFoldersFromPath(folderObj[folderName][fileName], pathSegments, newFilePath, recursive);
                            }
                        }
                    });
                } else {
                    __getFoldersFromPath(folderObj[folderName], pathSegments, newFolderPath, recursive);
                }
            }
        }
    };

    this.getTransformParameters = (brickId) => {
        this.load();
        if (!brickId) {
            return encryptionKey ? {key: encryptionKey} : undefined;
        }
        let bricks = [];
        const files = this.getFileList("/", true);
        files.forEach(file => {
            bricks = bricks.concat(getBricksForFile(file));
        });

        const brickObj = bricks.find(brick => {
            return brick.hash === brickId;
        });

        const addTransformData = {};
        if (brickObj.key) {
            addTransformData.key = Buffer.from(brickObj.key);
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

    function getBricksForFile(filePath) {
        filePath = pskPath.normalize(filePath);
        const splitPath = filePath.split("/");
        return __getBricksForFileRecursively(header, splitPath);


        function __getBricksForFileRecursively(folderObj, splitPath) {
            let folderName = splitPath.shift();
            if (folderName === "") {
                folderName = splitPath.shift();
            }
            if (folderObj[folderName]) {
                if (splitPath.length === 0) {
                    if (Array.isArray(folderObj[folderName])) {
                        return folderObj[folderName];
                    } else {
                        throw Error("Invalid path");
                    }
                } else {
                    return __getBricksForFileRecursively(folderObj[folderName], splitPath);
                }
            } else {
                throw Error("Invalid path");
            }
        }
    }
}

module.exports = FolderBarMap;

}).call(this,require("buffer").Buffer)

},{"./Brick":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js","buffer":false,"swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FolderBrickStorage.js":[function(require,module,exports){
const fs = require("fs");
const path = require("path");
const BarMap = require("./FolderBarMap");
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
},{"./Brick":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js","./FolderBarMap":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FolderBarMap.js","fs":false,"path":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Seed.js":[function(require,module,exports){
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

},{"buffer":false}],"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/transforms/BrickTransform.js":[function(require,module,exports){
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
},{"fs":false}],"/home/travis/build/PrivateSky/privatesky/modules/edfs-brick-storage/EDFSBrickStorage.js":[function(require,module,exports){
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
                    return callback(err);
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


},{"bar":"bar"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs-middleware/flows/BricksManager.js":[function(require,module,exports){
const pathModule = "path";
const path = require(pathModule);
const fsModule = "fs";
const fs = require(fsModule);
const osModule = "os";
const endOfLine = require(osModule).EOL;
const crypto = require("pskcrypto");
const folderNameSize = process.env.FOLDER_NAME_SIZE || 5;
const FILE_SEPARATOR = '-';
let brickStorageFolder;

$$.flow.describe("BricksManager", {
    init: function (rootFolder) {
        rootFolder = path.resolve(rootFolder);
        brickStorageFolder = rootFolder;
        this.__ensureFolderStructure(rootFolder);
    },
    write: function (fileName, readFileStream, callback) {
        if (!this.__verifyFileName(fileName, callback)) {
            return;
        }

        if (!readFileStream || !readFileStream.pipe || typeof readFileStream.pipe !== "function") {
            callback(new Error("Something wrong happened"));
            return;
        }

        const folderName = path.join(brickStorageFolder, fileName.substr(0, folderNameSize));

        this.__ensureFolderStructure(folderName, (err) => {
            if (err) {
                return callback(err);
            }

            this.__writeFile(readFileStream, folderName, fileName, callback);
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
    addAlias: function (fileHash, readStream, callback) {
        if (!this.__verifyFileName(fileHash, callback)) {
            return;
        }

        this.__streamToString(readStream, (err, alias) => {
            if (err) {
                return callback(err);
            }
            if (!alias) {
                return callback(new Error("No alias was provided"));
            }

            const filePath = path.join(brickStorageFolder, alias);
            this.__verifyFileExistence(filePath, (err) => {
                if (err) {
                    fs.writeFile(filePath, fileHash + endOfLine, callback);
                } else {
                    fs.appendFile(filePath, fileHash + endOfLine, callback);
                }
            });

        });
    },
    readVersions: function (alias, callback) {
        const filePath = path.join(brickStorageFolder, alias);
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
        try{
            fs.mkdirSync(folder, {recursive: true});
        }catch(err){
            if(callback){
                callback(err);
            }else{
                throw err;
            }
        }
        if(callback){
            callback();
        }
    },
    __writeFile: function (readStream, folderPath, fileName, callback) {
        const PskHash = crypto.PskHash;
        const hash = new PskHash();
        const filePath = path.join(folderPath, fileName);
        fs.access(filePath, (err) => {
            if (err) {
                readStream.on('data', (data) => {
                    hash.update(data);
                });

                const writeStream = fs.createWriteStream(filePath, {mode: 0o444});

                writeStream.on("finish", () => {
                    callback(undefined, hash.digest("hex"));
                });

                writeStream.on("error", (err) => {
                    writeStream.close();
                    callback(err);
                });

                readStream.pipe(writeStream);
            } else {
                callback();

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

},{"pskcrypto":"pskcrypto"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs-middleware/lib/EDFSMiddleware.js":[function(require,module,exports){
const bricks_storage_folder = "brick-storage";
const URL_PREFIX = "/EDFS";

function EDFSMiddleware(server) {
    const path = require("path");
    require("../flows/BricksManager");

    let storageFolder = path.join(server.rootFolder, bricks_storage_folder);
    if(typeof process.env.EDFS_BRICK_STORAGE_FOLDER !== "undefined"){
        storageFolder = process.env.EDFS_BRICK_STORAGE_FOLDER;
    }

    $$.flow.start("BricksManager").init(storageFolder);
    console.log("Bricks Storage location", storageFolder);

    server.use(`${URL_PREFIX}/*`, function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, X-Content-Length');
        next();
    });

    server.post(`${URL_PREFIX}/:fileId`, (req, res) => {
        $$.flow.start("BricksManager").write(req.params.fileId, req, (err, result) => {
            res.statusCode = 201;
            if (err) {
                res.statusCode = 500;

                if (err.code === 'EACCES') {
                    res.statusCode = 409;
                }
            }
            res.end(JSON.stringify(result));
        });
    });

    server.get(`${URL_PREFIX}/:fileId`, (req, res) => {
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
    });

    server.post(`${URL_PREFIX}/attachHashToAlias/:fileId`, (req, res) => {
        $$.flow.start("BricksManager").addAlias(req.params.fileId, req, (err, result) => {
            res.statusCode = 201;
            if (err) {
                res.statusCode = 500;

                if (err.code === 'EACCES') {
                    res.statusCode = 409;
                }
            }
            res.end();
        });
    });

    server.get(`${URL_PREFIX}/getVersions/:alias`, (req, res) => {
        $$.flow.start("BricksManager").readVersions(req.params.alias, (err, fileHashes) => {
            res.statusCode = 200;
            if (err) {
                console.error(err);
                res.statusCode = 404;
            }
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify(fileHashes));
        });
    });
}

module.exports = EDFSMiddleware;

},{"../flows/BricksManager":"/home/travis/build/PrivateSky/privatesky/modules/edfs-middleware/flows/BricksManager.js","path":false}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/brickTransportStrategies/FetchBrickTransportStrategy.js":[function(require,module,exports){
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
        wallet.mount("/" + constants.CSB.CODE_FOLDER, constants.CSB.CONSTITUTION_FOLDER, templateSeed, (err => {
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

},{"../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/edfs/moduleConstants.js","../seedCage":"/home/travis/build/PrivateSky/privatesky/modules/edfs/seedCage/index.js","./RawDossier":"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/RawDossier.js","bar":"bar","bar-fs-adapter":"bar-fs-adapter","edfs-brick-storage":"edfs-brick-storage"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/lib/RawDossier.js":[function(require,module,exports){
function RawDossier(endpoint, seed, cache) {
    const barModule = require("bar");
    const constants = require("../moduleConstants").CSB;
    const swarmutils = require("swarmutils");
    const TaskCounter = swarmutils.TaskCounter;
    const bar = createBar(seed);

    this.getSeed = () => {
        return bar.getSeed();
    };

    this.start = (callback) => {
        createBlockchain(bar).start(callback);
    };

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
            const splitPath = barPath.split("/");
            const folderName = splitPath.pop();
            barPath = splitPath.join("/");
            loadBarForPath(barPath, (err, dossierContext) => {
                if (err) {
                    return callback(err);
                }

                dossierContext.archive.addFolder(fsFolderPath, dossierContext.relativePath + "/" + folderName, options, callback);
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
            const splitPath = barPath.split("/");
            const fileName = splitPath.pop();
            barPath = splitPath.join("/");
            loadBarForPath(barPath, (err, dossierContext) => {
                if (err) {
                    return callback(err);
                }

                dossierContext.archive.addFile(fsFilePath, dossierContext.relativePath + "/" + fileName, options, callback);
            });
        }
    };

    this.readFile = (fileBarPath, callback) => {
        loadBarForPath(fileBarPath, (err, dossierContext) => {
            if (err) {
                return callback(err);
            }

            dossierContext.archive.readFile(dossierContext.relativePath, callback);
        });
    };

    this.createReadStream = (fileBarPath, callback) => {
        loadBarForPath(fileBarPath, (err, dossierContext) => {
            if (err) {
                return callback(err);
            }

            dossierContext.archive.createReadStream(dossierContext.relativePath, callback);
        });
    };

    this.extractFolder = (fsFolderPath, barPath, callback) => {
        loadBarForPath(barPath, (err, dossierContext) => {
            if (err) {
                return callback(err);
            }

            dossierContext.archive.extractFolder(fsFolderPath, dossierContext.relativePath, callback);
        });
    };

    this.extractFile = (fsFilePath, barPath, callback) => {
        loadBarForPath(barPath, (err, dossierContext) => {
            if (err) {
                return callback(err);
            }

            dossierContext.archive.extractFile(fsFilePath, dossierContext.relativePath, callback);
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
        if (path.split("/").includes(constants.MANIFEST_FILE)) {
            return callback(Error("Trying to overwrite the manifest file. This is not allowed"));
        }
        if (options.ignoreMounts === true) {
            bar.writeFile(path, data, options, callback);
        } else {
            const splitPath = path.split("/");
            const fileName = splitPath.pop();
            path = splitPath.join("/");
            loadBarForPath(path, (err, dossierContext) => {
                if (err) {
                    return callback(err);
                }
                if (dossierContext.readonly === true) {
                    return callback(Error("Tried to write in a readonly mounted RawDossier"));
                }

                dossierContext.archive.writeFile(dossierContext.relativePath + "/" + fileName, data, options, callback);
            });
        }
    };

    this.delete = (barPath, callback) => {
        bar.delete(barPath, callback);
    };

    this.listFiles = (path, callback) => {
        loadBarForPath(path, (err, dossierContext) => {
            if (err) {
                return callback(err);
            }

            dossierContext.archive.listFiles(dossierContext.relativePath, (err, files) => {
                if (err) {
                    return callback(err);
                }

                if (path !== "/" && path !== "" && typeof path !== "function") {
                    files = files.map(file => {
                        if (file[0] === "/") {
                            file = file.slice(1);
                        }

                        return file;
                    })
                }

                callback(undefined, files);
            });
        });
    };

    this.listFolders = (path, callback) => {
        loadBarForPath(path, (err, dossierContext) => {
            if (err) {
                return callback(err);
            }

            dossierContext.archive.listFolders(dossierContext.relativePath, (err, folders) => {
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
        loadBarForPath(folderPath, (err, dossierContext) => {
            if (err) {
                return callback(err);
            }

            const taskCounter = new TaskCounter((errors, results) => {
                let entries;
                if (options.withFileTypes === true) {
                    entries = {};
                    results.forEach(res=> {
                        let entryType = Object.keys(res)[0];
                        entries[entryType] = res[entryType];
                    })
                }else{
                    entries = [];
                    results.forEach(res => {
                        entries = entries.concat(Object.values(res)[0])
                    });
                }


                callback(undefined, entries);
            });

            taskCounter.increment(3);
            dossierContext.archive.listFolders(dossierContext.relativePath, false, (err, folders) => {
                if (err) {
                    taskCounter.decrement(undefined, {folders:[]});
                    return;
                }

                folders = folders.map(folder => {
                    if (folder[0] === "/") {
                        return folder.slice(1);
                    }

                    return folder;
                });
                taskCounter.decrement(undefined, {folders: folders});
            });

            dossierContext.archive.listFiles(dossierContext.relativePath, false, (err, files) => {
                if (err) {
                    taskCounter.decrement(undefined, {files: []});
                    return;
                }

                files = files.map(file => {
                    if (file[0] === "/") {
                        return file.slice(1);
                    }

                    return file;
                });
                taskCounter.decrement(undefined, {files: files});
            });

            this.listMountedDossiers("/", (err, mountedDossiers) => {
                if (err) {
                    taskCounter.decrement(undefined, {mounts: []});
                    return;
                }

                const mountPaths = mountedDossiers.map(dossier => {
                    const pathSegments = dossier.path.split("/");
                    if (pathSegments[0] === "") {
                        pathSegments.shift();
                    }
                    if (pathSegments.length > 0) {
                        return pathSegments[0];
                    }
                });

                taskCounter.decrement(undefined, {mounts: mountPaths});
            });
        });
    };

    this.mount = (path, name, archiveIdentifier, readonly, callback) => {
        if (typeof readonly === "function") {
            callback = readonly;
            readonly = false;
        }
        if (/\W-_/.test(name) === true) {
            return callback(Error("Invalid mount name"));
        }

        bar.listFiles(path, (err, files) => {
            if (!err && files.length > 0) {
                return callback(Error("Tried to mount in a non-empty folder"));
            }

            bar.readFile(constants.MANIFEST_FILE, (err, data) => {
                let manifest;
                if (err) {
                    manifest = {};
                    manifest.mounts = [];
                }

                if (data) {
                    manifest = JSON.parse(data.toString());
                    const existingMount = manifest.mounts.find(el => el.localPath === path && el.mountName === name);
                    if (existingMount) {
                        return callback(Error(`A mount point at path ${path} with the name ${name} already exists.`));
                    }
                }

                const mount = {};
                mount.localPath = path;
                mount.mountName = name;
                mount.archiveIdentifier = archiveIdentifier;
                mount.readonly = readonly;
                manifest.mounts.push(mount);

                bar.writeFile(constants.MANIFEST_FILE, JSON.stringify(manifest), {encrypt: true}, callback);
            });
        });
    };

    this.unmount = (path, name, callback) => {
        bar.readFile(constants.MANIFEST_FILE, (err, data) => {
            if (err) {
                return callback(err);
            }

            if (data.length === 0) {
                return callback(Error("Nothing to unmount"));
            }

            const manifest = JSON.parse(data.toString());
            const index = manifest.mounts.findIndex(el => el.localPath === path);
            if (index >= 0) {
                manifest.mounts.splice(index, 1);
            } else {
                return callback(Error(`No mount point exists at path ${path}`));
            }

            bar.writeFile(constants.MANIFEST_FILE, JSON.stringify(manifest), callback);
        });
    };

    this.listMountedDossiers = (path, callback) => {
        loadBarForPath(path, (err, dossierContext) => {
            if (err) {
                return callback(err);
            }

            dossierContext.archive.readFile(constants.MANIFEST_FILE, (err, manifestContent) => {
                if (err) {
                    return callback(err);
                }

                let manifest;
                try {
                    manifest = JSON.parse(manifestContent.toString());
                } catch (e) {
                    return callback(e);
                }

                const matchingMounts = [];
                manifest.mounts.forEach(mount => {
                    let sep = mount.localPath === "/" ? "" : "/";
                    let pth = mount.localPath + sep + mount.mountName;

                    if (pth.startsWith(dossierContext.relativePath)) {
                        if (path !== "/" && path !== "" && typeof path !== "function" && pth[0] === "/") {
                            pth = pth.slice(1);
                        }

                        matchingMounts.push({path: pth, dossierReference: mount.archiveIdentifier});
                    }
                });
                callback(undefined, matchingMounts);
            });
        });
    };


    /**
     * @param {object} validator
     * @param {callback} validator.writeRule Writes validator
     * @param {callback} validator.readRule Reads validator
     */
    this.setValidator = (validator) => {
        bar.setValidator(validator);
    }

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

    function loadBarForPath(path, callback) {
        if (typeof path === "function") {
            callback = path;
            path = "/";
        }

        __loadBarForPathRecursively(bar, "", path, false, callback);

        function __loadBarForPathRecursively(archive, prefixPath, relativePath, readonly, callback) {
            if (relativePath === "" || relativePath === "/") {
                return callback(undefined, {archive, prefixPath, readonly, relativePath});
            }

            archive.listFiles((err, files) => {
                if (err) {
                    return callback(err);
                }

                if (files.length === 0) {
                    __searchInManifest();
                } else {
                    let barPath = files.find(file => {
                        return file.includes(relativePath) || relativePath.includes(file);
                    });

                    if (barPath) {
                        return callback(undefined, {archive, prefixPath, readonly, relativePath});
                    } else {
                        __searchInManifest();
                    }

                }

                function __searchInManifest() {
                    let pathRest = [];
                    let splitPath = relativePath.split("/");
                    if (splitPath[0] === "") {
                        splitPath[0] = "/";
                    }

                    archive.readFile("/" + constants.MANIFEST_FILE, (err, manifestContent) => {
                        if (err) {
                            return callback(err);
                        }

                        const manifest = JSON.parse(manifestContent.toString());
                        pathRest.unshift(splitPath.pop());
                        if (splitPath.length === 0) {
                            return callback(undefined, {archive, prefixPath, readonly, relativePath});
                        }

                        while (splitPath.length > 0) {
                            let localPath;
                            if (splitPath[0] === "/") {
                                while (splitPath[0] === "/") {
                                    splitPath.shift();
                                }
                                localPath = "/" + splitPath.join("/");
                                splitPath.unshift("/");
                            } else {
                                localPath = splitPath.join("/");
                            }

                            for (let mount of manifest.mounts) {
                                const name = pathRest[0];
                                if (mount.localPath === localPath && mount.mountName === name) {
                                    pathRest.shift();

                                    let newPath;
                                    if (prefixPath.endsWith("/") || prefixPath === "") {
                                        newPath = prefixPath + localPath + "/" + name;
                                    } else {
                                        newPath = prefixPath + "/" + localPath + "/" + name;
                                    }
                                    const internalArchive = createBar(mount.archiveIdentifier);
                                    let remainingPath = pathRest.join("/");
                                    if (remainingPath[0] !== "/") {
                                        //when navigate into an archive we need to ensure that the remainingPath starts with /
                                        remainingPath = "/" + remainingPath;
                                    }
                                    return __loadBarForPathRecursively(internalArchive, newPath, remainingPath, mount.readonly, callback);
                                }
                            }

                            pathRest.unshift(splitPath.pop());
                            if (splitPath.length === 0) {
                                return callback(Error(`Path ${path} could not be found.`));
                            }
                        }
                    });
                }
            });
        }
    }
}

module.exports = RawDossier;

},{"../moduleConstants":"/home/travis/build/PrivateSky/privatesky/modules/edfs/moduleConstants.js","bar":"bar","bar-fs-adapter":"bar-fs-adapter","blockchain":false,"edfs-brick-storage":"edfs-brick-storage","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/edfs/moduleConstants.js":[function(require,module,exports){
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

},{"psklogger":"psklogger"}],"/home/travis/build/PrivateSky/privatesky/modules/psk-cache/lib/Cache.js":[function(require,module,exports){
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

},{"./Agent":"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/Agent.js","./EncryptedSecret":"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/EncryptedSecret.js","./PSKSignature":"/home/travis/build/PrivateSky/privatesky/modules/psk-security-context/lib/PSKSignature.js","pskcrypto":"pskcrypto","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/PskCrypto.js":[function(require,module,exports){
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
},{"crypto":false}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/GenericLoggerClient.js":[function(require,module,exports){
const LogFactory = require('./LogFactory');

/**
 *
 * @param {TransportInterface} messagePublisher
 * @constructor
 */
function GenericLoggerClient(messagePublisher) {
    /**
     * This is to be used to send normal logs. They will be published in a subchannel of the "logs" channel.
     * It is easier to trace only user and platform logs if they are separated in this channel
     *
     * @param {{code: Number, name: string}} logLevel
     * @param {Object} meta
     * @param {Array<any>} messages
     *
     * @return {{level, meta, time, msTime, messages}}
     */
    function log(logLevel, meta, messages) {
        const log = LogFactory.createLog(logLevel, meta, messages);

        const logChannel = `logs.${logLevel.name}`;
        messagePublisher.send(logChannel, log);

        return log;
    }


    /**
     * This is to be used for sending custom events when messages don't happen in the normal flow of the platform
     * or they shouldn't interfere with the tracing of logs
     * For example, sending statistics about a node or a sandbox is happening periodically and not as a result of
     * users' running code, therefore this should not be merged with logs
     *
     * @param {string} channel
     * @param {Object} meta
     * @param {Array<any>} messages
     * @return {{meta, messages, time}}
     */
    function event(channel, meta, messages) {
        const event = LogFactory.createEvent(meta, messages);

        const logChannel = `events.${channel}`;
        messagePublisher.send(logChannel, event);

        return event;
    }

    function publish(channel, message) {
        messagePublisher.send(channel, message);

        return message;
    }

    this.event  = event;
    this.log    = log;
    this.publish = publish;
}

module.exports = GenericLoggerClient;

},{"./LogFactory":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/LogFactory.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/LogFactory.js":[function(require,module,exports){
function getTime() {
    const envTypes = require("overwrite-require").constants;
    switch($$.environmentType) {
        case envTypes.NODEJS_ENVIRONMENT_TYPE:
            const perf_hooksModule = 'perf_hooks';
            const {performance} = require(perf_hooksModule);
            return performance.now() + performance.timeOrigin;
        default:
            return Date.now();
    }
}

function createLog(logLevel, meta, messages) {
    return {
        level: logLevel,
        messages: messages,
        meta: meta,
        time: getTime()
    }
}

function createEvent(meta, messages) {
    return {
        messages,
        meta,
        time: getTime()
    };
}

module.exports = {
    createLog,
    createEvent
};

},{"overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/LoggerClient.js":[function(require,module,exports){
const GenericLoggerClient = require('./GenericLoggerClient');
const LogLevel = require('../utils/LogLevel');
const LoggerInterface = require('./LoggerInterface');

/**
 *
 * @param {TransportInterface} messagePublisher
 * @implements LoggerInterface
 * @constructor
 */
function LoggerClient(messagePublisher) {
    LoggerInterface.call(this);

    const genericLoggerClient = new GenericLoggerClient(messagePublisher);


    /************* PUBLIC METHODS *************/

    public_methods = ["debug", "error", "info", "log", "warn"];

    function exposePublicMethod(target, methodName){
        let handler = function (meta = {}, ...params) {
            const logLevel = _getLogLevel(LogLevel.debug);
            return genericLoggerClient.log(logLevel, meta, params);
        };
        Object.defineProperty(handler, "name", {value: methodName});
        target[methodName] = handler;
    }

    let self = this;
    public_methods.forEach(function(methodName){
        exposePublicMethod(self, methodName);
    });

    function event(channel, meta = {}, ...params) {
        return genericLoggerClient.event(channel, meta, ...params);
    }
    
    function redirect(channel, logObject) {
        return genericLoggerClient.publish(channel, logObject)
    }


    /************* PRIVATE METHODS *************/

    function _getLogLevel(levelCode) {
        return {
            code: levelCode,
            name: LogLevel[levelCode]
        };
    }


    /************* EXPORTS *************/
    this.event    = event;
    this.redirect = redirect;
}

module.exports = LoggerClient;

},{"../utils/LogLevel":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/LogLevel.js","./GenericLoggerClient":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/GenericLoggerClient.js","./LoggerInterface":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/LoggerInterface.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/LoggerInterface.js":[function(require,module,exports){
/**
 * @interface
 */
function LoggerInterface() {
    function genericMethod(channel, logObject) {
        throw new Error('Not implemented');
    }

    this.debug    = genericMethod;
    this.error    = genericMethod;
    this.event    = genericMethod;
    this.info     = genericMethod;
    this.log      = genericMethod;
    this.redirect = genericMethod;
    this.warn     = genericMethod;
}

module.exports = LoggerInterface;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/index.js":[function(require,module,exports){
const GenericLoggerClient = require('./GenericLoggerClient');
const LogFactory          = require('./LogFactory');
const LoggerClient        = require('./LoggerClient');
const LoggerInterface     = require('./LoggerInterface');


module.exports = {
    GenericLoggerClient,
    LogFactory,
    LoggerClient,
    LoggerInterface
};

},{"./GenericLoggerClient":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/GenericLoggerClient.js","./LogFactory":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/LogFactory.js","./LoggerClient":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/LoggerClient.js","./LoggerInterface":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/LoggerInterface.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessagePublisher/MessagePublisher.js":[function(require,module,exports){
const TransportInterface = require('./TransportInterface');
const utils = require('../utils');
const zeroMQModuleName = "zeromq";
const zeroMQ = require(zeroMQModuleName);


/**
 * Creates a ZeroMQ Publisher Socket and connects to the specified address for a ZeroMQ Subscriber
 * @param {string!} address - Base address including protocol and port (ex: tcp://127.0.0.1:8080)
 * @implements TransportInterface
 * @constructor
 */
function MessagePublisher(address) {
    TransportInterface.call(this);

    const zmqSocket = zeroMQ.createSocket('pub');

    // uncomment next line if messages are lost
    // zmqSocket.setsockopt(zeroMQ.ZMQ_SNDHWM, 0);
    const socket = new utils.BufferedSocket(zmqSocket, utils.SocketType.connectable);


    /************* PUBLIC METHODS *************/

    /**
     *
     * @param {string} channel
     * @param {Object} logObject
     */
    this.send = function (channel, logObject) {
        try {
            const serializedLog = JSON.stringify(logObject);

            socket.send([channel, serializedLog]);
        } catch (e) {
            process.stderr.write('Error while sending or serializing message');
        }
    };


    /************* MONITOR SOCKET *************/

    zmqSocket.connect(address);
}

module.exports = MessagePublisher;

},{"../utils":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/index.js","./TransportInterface":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessagePublisher/TransportInterface.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessagePublisher/MessagePublisherForSandbox.js":[function(require,module,exports){
(function (global){
const TransportInterface = require('./TransportInterface');

/**
 * This assumes it is executed inside a sandbox and that exists an object "logger" on "global" with a method "send".
 * Sandboxes can't connect directly to ZeroMQ therefore this just relays the message outside the sandbox.
 *
 * @implements TransportInterface
 * @constructor
 */
function MessagePublisherForSandbox() {

    TransportInterface.call(this);

    /************* PUBLIC METHODS *************/

    /**
     *
     * @param {string} channel
     * @param {Object} logObject
     */
    this.send = function (channel, logObject) {
        try {
            global.logger.send([channel, logObject]);
        } catch (e) {
            console.error('Error while sending or serializing message from sandbox', e);
        }
    };

}

module.exports = MessagePublisherForSandbox;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./TransportInterface":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessagePublisher/TransportInterface.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessagePublisher/TransportInterface.js":[function(require,module,exports){
/**
 *
 * @interface
 */
function TransportInterface() {
    this.send = function (channel, logObject) {
        throw new Error('Not implemented');
    }
}

module.exports = TransportInterface;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessagePublisher/index.js":[function(require,module,exports){
const TransportInterface = require('./TransportInterface');
const MessagePublisher = require('./MessagePublisher');
const MessagePublisherForSandbox = require('./MessagePublisherForSandbox');

module.exports = {
    TransportInterface,
    MessagePublisher,
    MessagePublisherForSandbox
};

},{"./MessagePublisher":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessagePublisher/MessagePublisher.js","./MessagePublisherForSandbox":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessagePublisher/MessagePublisherForSandbox.js","./TransportInterface":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessagePublisher/TransportInterface.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessageSubscriber/MessageSubscriber.js":[function(require,module,exports){
const zeroMQModuleName = "zeromq";
const zeroMQ = require(zeroMQModuleName);

/**
 * Creates a ZeroMQ Subscriber that listens for provided topics on the specified address for a publisher
 * @param {string!} address - Base address including protocol and port (ex: tcp://127.0.0.1:8080)
 * @param {Array<string>|function?} subscriptions - a list of subscription topics, if missing it will subscribe to everything
 * @param {function!} onMessageCallback
 * @constructor
 */
function MessageSubscriber(address, subscriptions, onMessageCallback) {
    const zmqSocket = zeroMQ.createSocket('sub');

    // uncomment next line if messages are lost
    // zmqSocket.setsockopt(zeroMQ.ZMQ_RCVHWM, 0);

    if(arguments.length === 2 && typeof subscriptions === 'function') {
        onMessageCallback = subscriptions;
        subscriptions = [''];
    }

    subscriptions.forEach(subscription => zmqSocket.subscribe(subscription));

    zmqSocket.connect(address);

    zmqSocket.on('message', onMessageCallback);

    const events = ["SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException", "SIGTERM", "SIGHUP"];

    events.forEach(event => {
        process.on(event, () => {
            zmqSocket.close();
        });
    });
}

module.exports = MessageSubscriber;

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessageSubscriber/index.js":[function(require,module,exports){
const MessageSubscriber = require('./MessageSubscriber');

module.exports = {MessageSubscriber};

},{"./MessageSubscriber":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessageSubscriber/MessageSubscriber.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/PSKLoggerClient/GenericPSKLogger.js":[function(require,module,exports){
(function (global){
const LoggerClientModule = require('../LoggerClient');

const LoggerClient = LoggerClientModule.LoggerClient;
const LoggerInterface = LoggerClientModule.LoggerInterface;


/**
 *
 * @param messagePublisher
 * @implements LoggerInterface
 * @constructor
 */
function GenericPSKLogger(messagePublisher) {
    LoggerInterface.call(this);

    const logger = new LoggerClient(messagePublisher);

    function debug(...params) {
        const meta = prepareMeta();
        return logger.debug(meta, ...params);
    }

    function error(...params) {
        const meta = prepareMeta();
        return logger.error(meta, ...params);
    }

    function info(...params) {
        const meta = prepareMeta();
        return logger.info(meta, ...params);
    }

    function log(...params) {
        const meta = prepareMeta();
        return logger.log(meta, ...params);
    }

    function warn(...params) {
        const meta = prepareMeta();
        return logger.warn(meta, ...params);
    }

    function event(event, ...params) {
        const meta = prepareMeta();
        return logger.event(event, meta, params);
    }
    
    function redirect(logType, logObject) {
        const logMeta = logObject.meta;
        const meta = prepareMeta();
        
        Object.assign(meta, logMeta);

        logObject.meta = meta;

        return logger.redirect(logType, logObject);
    }

    function prepareMeta() {
        if (global.$$.getEnvironmentData) {
            return global.$$.getEnvironmentData();
        }
        
        return {};
    }


    this.debug    = debug;
    this.error    = error;
    this.event    = event;
    this.info     = info;
    this.log      = log;
    this.redirect = redirect;
    this.warn     = warn;

}

module.exports = GenericPSKLogger;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../LoggerClient":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/LoggerClient/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/PSKLoggerClient/index.js":[function(require,module,exports){
const Configurator     = require('../utils/Configurator');
const GenericPSKLogger = require('./GenericPSKLogger');

function getLogger() {
    let messagePublisher;

    if (process.env.context === 'sandbox') {
        const MessagePublisher = require('../MessagePublisher').MessagePublisherForSandbox;
        messagePublisher = new MessagePublisher();
    } else {
        const config = Configurator.getConfig();
        const MessagePublisher = require('../MessagePublisher').MessagePublisher;
        messagePublisher = new MessagePublisher(config.addressForPublishers);
    }

    return new GenericPSKLogger(messagePublisher);
}

module.exports = {
    getLogger
};

},{"../MessagePublisher":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessagePublisher/index.js","../utils/Configurator":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/Configurator.js","./GenericPSKLogger":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/PSKLoggerClient/GenericPSKLogger.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/PubSubProxy/PubSubProxy.js":[function(require,module,exports){
const zeroMQModuleName = "zeromq";
const zeroMQ = require(zeroMQModuleName);
const utils = require('../utils');

/**
 * Proxy between publishers and subscribers to avoid star topology communication
 * Subscribers should connect first otherwise no subscription request will be sent to publishers and therefore they
 * won't even send the messages to the proxy. This is because the filtering is done on the publisher for tcp or ipc,
 * view http://zguide.zeromq.org/page:all#Getting-the-Message-Out for more info
 * @param {string!} addressForPublishers - Base address including protocol and port (ex: tcp://127.0.0.1:8080)
 * @param {string!} addressForSubscribers - Base address including protocol and port (ex: tcp://127.0.0.1:8080)
 * @constructor
 */
function PubSubProxy({addressForPublishers, addressForSubscribers}) {
    const frontend = zeroMQ.createSocket('xsub');
    const backend = zeroMQ.createSocket('xpub');
    const bufferedBackend = new utils.BufferedSocket(backend, utils.SocketType.bindable);

    // By default xpub only signals new subscriptions
    // Settings it to verbose = 1 , will signal on every new subscribe
    // uncomment next lines if messages are lost
    // backend.setsockopt(zeroMQ.ZMQ_XPUB_VERBOSE, 1);
    // backend.setsockopt(zeroMQ.ZMQ_SNDHWM, 0);
    // backend.setsockopt(zeroMQ.ZMQ_RCVHWM, 0);
    // frontend.setsockopt(zeroMQ.ZMQ_RCVHWM, 0);
    // frontend.setsockopt(zeroMQ.ZMQ_SNDHWM, 0);

    // When we receive data on frontend, it means someone is publishing
    frontend.on('message', (...args) => {
        // We just relay it to the backend, so subscribers can receive it
        bufferedBackend.send(args);
    });

    // When backend receives a message, it's subscribe requests
    backend.on('message', (data) => {
        // We send it to frontend, so it knows to what channels to listen to
        frontend.send(data);
    });

    /************* MONITOR SOCKET *************/

    frontend.bindSync(addressForPublishers);
    backend.bindSync(addressForSubscribers);

    const events = ["SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException", "SIGTERM", "SIGHUP"];

    events.forEach(event => {
        process.on(event, () => {
            frontend.close();
            backend.close();
        });
    });
}

module.exports = PubSubProxy;

},{"../utils":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/index.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/PubSubProxy/index.js":[function(require,module,exports){
const PubSubProxy = require('./PubSubProxy');

module.exports = {PubSubProxy};

},{"./PubSubProxy":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/PubSubProxy/PubSubProxy.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/BufferedSocket.js":[function(require,module,exports){
const SocketType = require('./SocketType');

/**
 * Wrapper for ZeroMQ socket that tries to prevent 'slow joiner', meaning it buffers the first messages until the
 * connection is established, otherwise the first messages would be lost
 * @param {Socket} socket - instance of ZeroMQ Socket
 * @param {SocketType<number>} type - used to determine if should listen for 'connect' or 'accept' event
 * @param {Number?} maxSize = 1000 - Max size for the internal buffer, if 0 the buffer is infinite but can cause memory leak
 * @constructor
 */
function BufferedSocket(socket, type, maxSize = 10000) {
    if(maxSize < 0) {
        maxSize = 1000;
    }

    let messageQueue = [];
    let isConnected = false;
    let currentBufferSize = 0;

    socket.monitor();
    const event = _getEventForType(type);

    socket.on(event, () => {
        isConnected = true;
        _flushQueue();
    });

    /************* PUBLIC METHODS *************/

    function send(message) {
        if (!isConnected) {
            if (maxSize !== 0 && currentBufferSize < maxSize) {
                currentBufferSize += 1;
                messageQueue.push(message);
            }
        } else {
            socket.send(message);
        }
    }

    /************* PRIVATE METHODS *************/

    function _flushQueue() {
        for (const message of messageQueue) {
            socket.send(message);
        }

        messageQueue = [];
        currentBufferSize = 0;
    }

    function _getEventForType(type) {
        if (type === SocketType.connectable) {
            return 'connect';
        } else if (type === SocketType.bindable) {
            return 'accept';
        }
    }

    /************* EXPORTS *************/

    this.send = send;
}


module.exports = BufferedSocket;

},{"./SocketType":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/SocketType.js"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/Configurator.js":[function(require,module,exports){
const config = {
    addressForPublishers: process.env.PSK_PUBLISH_LOGS_ADDR || 'tcp://127.0.0.1:7000',
    addressForSubscribers: process.env.PSK_SUBSCRIBE_FOR_LOGS_ADDR || 'tcp://127.0.0.1:7001',
    addressToCollector: process.env.PSK_COLLECTOR_ADDR || 'tcp://127.0.0.1:5558'
};

module.exports = {
    getConfig () {
        return Object.freeze(config);
    }
};

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/EnvironmentDataProvider.js":[function(require,module,exports){
(function (global){
function getEnvironmentData () {
    const or = require("overwrite-require");
    let data = {origin: $$.environmentType};

    switch ($$.environmentType){
        case or.NODEJS_ENVIRONMENT_TYPE:
            const pathModule = "path";
            const path = require(pathModule);
            const osModule = "os";
            const os = require(osModule);
            const platform = os.platform();

            const processPath = process.argv[1];
            const processStartFile = path.basename(processPath);

            data.processStartFile = processStartFile;
            data.platform = platform;
            break;
        case or.BROWSER_ENVIRONMENT_TYPE:
            //todo: maybe we need some details here?
            break;
        default:
            break;
    }
    return data;
}

function getEnvironmentDataForDomain() {
    const osModule = "os";
    const os = require(osModule);
    const platform = os.platform();

    return {
        origin: 'domain',
        domain: process.env.PRIVATESKY_DOMAIN_NAME,
        platform: platform
    };
}

function getEnvironmentDataForAgent() {
    const osModule = "os";
    const os = require(osModule);
    const platform = os.platform();
    const envTypes = require("overwrite-require").constants;

    let data = {origin: "agent"};
    switch($$.environmentType){
        case envTypes.THREAD_ENVIRONMENT_TYPE:
            data.domain = process.env.PRIVATESKY_DOMAIN_NAME;
            data.agent = process.env.PRIVATESKY_AGENT_NAME;
            data.platform = platform;
            break;
        default:
            break;
    }
    return data;
}

let handler;

if(process.env.hasOwnProperty('PRIVATESKY_AGENT_NAME')) {
    handler = getEnvironmentDataForAgent;
} else if(process.env.hasOwnProperty('PRIVATESKY_DOMAIN_NAME')) {
    handler = getEnvironmentDataForDomain;
} else {
    handler = getEnvironmentData;
}

if(typeof global.$$.getEnvironmentData === "undefined"){
    global.$$.getEnvironmentData = handler;
}else{
    console.log("EnvironmentData handler already set.");
}

//no need to export anything directly
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"overwrite-require":"overwrite-require"}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/LogLevel.js":[function(require,module,exports){
const LogLevel = {};

LogLevel[LogLevel["error"] = 0] = "error";
LogLevel[LogLevel["warn"]  = 1] = "warn";
LogLevel[LogLevel["info"]  = 2] = "info";
LogLevel[LogLevel["debug"] = 3] = "debug";
LogLevel[LogLevel["log"]   = 4] = "log";

module.exports = Object.freeze(LogLevel);

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/SocketType.js":[function(require,module,exports){
const SocketType = {};
SocketType[SocketType["connectable"] = 0] = "connectable"; // if .connect is called on socket
SocketType[SocketType["bindable"] = 1] = "bindable"; // if .bind is called on socket

module.exports = Object.freeze(SocketType);

},{}],"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/index.js":[function(require,module,exports){
const Configurator            = require('./Configurator');
const EnvironmentDataProvider = require('./EnvironmentDataProvider');
const LogLevel                = require('./LogLevel');
const BufferedSocket          = require('./BufferedSocket');
const SocketType              = require('./SocketType');

module.exports = {
    Configurator,
    EnvironmentDataProvider,
    LogLevel,
    BufferedSocket,
    SocketType
};

},{"./BufferedSocket":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/BufferedSocket.js","./Configurator":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/Configurator.js","./EnvironmentDataProvider":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/EnvironmentDataProvider.js","./LogLevel":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/LogLevel.js","./SocketType":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/SocketType.js"}],"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/BootEngine.js":[function(require,module,exports){
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

		let fileList = await listFiles(pskPath.join(EDFS.constants.CSB.CODE_FOLDER, EDFS.constants.CSB.CONSTITUTION_FOLDER));

		fileList = bundles.filter(bundle => fileList.includes(bundle))
			.map(bundle => pskPath.join(EDFS.constants.CSB.CODE_FOLDER, EDFS.constants.CSB.CONSTITUTION_FOLDER, bundle));

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
			this.rawDossier = edfs.loadRawDossier(seed);
			try{
                await evalBundles(runtimeBundles);
            }catch(err)
            {
                console.log(err);
            }
			await initializeSwarmEngine();
			if (typeof constitutionBundles !== "undefined") {
				try{
					await evalBundles(constitutionBundles, true);
				}catch(err)
				{
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

},{"edfs":"edfs","swarmutils":"swarmutils"}],"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Combos.js":[function(require,module,exports){
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
        pth += "/" + args[i];
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

module.exports = {
    normalize,
    join,
    isAbsolute,
    ensureIsAbsolute
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
    const BarMap = require("./lib/FolderBarMap");
    return new BarMap(header);
};

module.exports.Seed = require('./lib/Seed');
module.exports.createFolderBrickStorage = createFolderBrickStorage;
module.exports.createFileBrickStorage = createFileBrickStorage;

},{"./lib/Archive":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Archive.js","./lib/ArchiveConfigurator":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/ArchiveConfigurator.js","./lib/Brick":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Brick.js","./lib/FileBrickStorage":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FileBrickStorage.js","./lib/FolderBarMap":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FolderBarMap.js","./lib/FolderBrickStorage":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/FolderBrickStorage.js","./lib/Seed":"/home/travis/build/PrivateSky/privatesky/modules/bar/lib/Seed.js"}],"edfs-brick-storage":[function(require,module,exports){
module.exports.create = (endpoint) => {
    const EDFSBrickStorage = require("./EDFSBrickStorage");
    return new EDFSBrickStorage(endpoint)
};

},{"./EDFSBrickStorage":"/home/travis/build/PrivateSky/privatesky/modules/edfs-brick-storage/EDFSBrickStorage.js"}],"edfs-middleware":[function(require,module,exports){
module.exports = require("./lib/EDFSMiddleware");



},{"./lib/EDFSMiddleware":"/home/travis/build/PrivateSky/privatesky/modules/edfs-middleware/lib/EDFSMiddleware.js"}],"edfs":[function(require,module,exports){
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
},{"./lib/PskCrypto":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/PskCrypto.js","./lib/utils/DuplexStream":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/DuplexStream.js","./lib/utils/isStream":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/lib/utils/isStream.js","./signsensusDS/ssutil":"/home/travis/build/PrivateSky/privatesky/modules/pskcrypto/signsensusDS/ssutil.js"}],"psklogger":[function(require,module,exports){
const PSKLogger = require('./src/PSKLoggerClient/index');
const EnvironmentDataProvider = require('./src/utils').EnvironmentDataProvider;
const envTypes = require("overwrite-require").constants;

/**
 * @return {string|*}
 */
function getContextForMeta(meta) {
    const contexts = {
        node: (meta) => `node:${meta.context}`,
        domain: (meta) =>`domain:${meta.domain}`,
        agent: (meta) => `domain:${meta.domain}:agent:${meta.agent}`,
        sandbox: () => `sandbox`
    };

    if (contexts.hasOwnProperty(meta.origin)) {
        return contexts[meta.origin](meta);
    } else {
        return '';
    }
}

switch ($$.environmentType) {
    case envTypes.NODEJS_ENVIRONMENT_TYPE:
    case envTypes.THREAD_ENVIRONMENT_TYPE:
        module.exports.MessagePublisherModule = require('./src/MessagePublisher');
        module.exports.MessageSubscriberModule = require('./src/MessageSubscriber');
        module.exports.PubSubProxyModule = require('./src/PubSubProxy');
        break;
    default:
        //nothing to do here for now;
}
module.exports.PSKLogger = PSKLogger;
},{"./src/MessagePublisher":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessagePublisher/index.js","./src/MessageSubscriber":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/MessageSubscriber/index.js","./src/PSKLoggerClient/index":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/PSKLoggerClient/index.js","./src/PubSubProxy":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/PubSubProxy/index.js","./src/utils":"/home/travis/build/PrivateSky/privatesky/modules/psklogger/src/utils/index.js","overwrite-require":"overwrite-require"}],"swarm-engine/bootScripts/domainBootScript":[function(require,module,exports){
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
    const bar = self.edfs.loadBar(self.seed);
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
                const rawDossier = self.edfs.loadRawDossier(self.seed);
                rawDossier.readFile(pskPath.join(EDFS.constants.CSB.CODE_FOLDER, EDFS.constants.CSB.CONSTITUTION_FOLDER , "threadBoot.js"), (err, fileContents) => {
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
        })
    });
}

boot();
},{"./BootEngine":"/home/travis/build/PrivateSky/privatesky/modules/swarm-engine/bootScripts/BootEngine.js","dossier":false,"edfs":"edfs","path":false,"soundpubsub":false,"swarm-engine":false,"swarmutils":"swarmutils"}],"swarmutils":[function(require,module,exports){
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

},{"./lib/Combos":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Combos.js","./lib/OwM":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/OwM.js","./lib/Queue":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/Queue.js","./lib/SwarmPacker":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/SwarmPacker.js","./lib/TaskCounter":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/TaskCounter.js","./lib/beesHealer":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/beesHealer.js","./lib/path":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/path.js","./lib/pingpongFork":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/pingpongFork.js","./lib/pskconsole":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/pskconsole.js","./lib/safe-uuid":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/safe-uuid.js","./lib/uidGenerator":"/home/travis/build/PrivateSky/privatesky/modules/swarmutils/lib/uidGenerator.js"}],"zmq_adapter":[function(require,module,exports){
(function (Buffer){
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
}).call(this,require("buffer").Buffer)

},{"buffer":false,"swarmutils":"swarmutils"}]},{},["/home/travis/build/PrivateSky/privatesky/builds/tmp/domainBoot.js"])