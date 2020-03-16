launcherBootRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/opt/working_dir/privatesky/builds/tmp/launcherBoot.js":[function(require,module,exports){
const or = require('overwrite-require');
or.enableForEnvironment(or.constants.NODEJS_ENVIRONMENT_TYPE);

require("./launcherBoot_intermediar");
},{"./launcherBoot_intermediar":"/opt/working_dir/privatesky/builds/tmp/launcherBoot_intermediar.js","overwrite-require":"overwrite-require"}],"/opt/working_dir/privatesky/builds/tmp/launcherBoot_intermediar.js":[function(require,module,exports){
(function (global){
global.launcherBootLoadModules = function(){ 

	if(typeof $$.__runtimeModules["overwrite-require"] === "undefined"){
		$$.__runtimeModules["overwrite-require"] = require("overwrite-require");
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

	if(typeof $$.__runtimeModules["syndicate"] === "undefined"){
		$$.__runtimeModules["syndicate"] = require("syndicate");
	}

	if(typeof $$.__runtimeModules["boot-script"] === "undefined"){
		$$.__runtimeModules["boot-script"] = require("swarm-engine/bootScripts/launcherBootScript");
	}
}
if (true) {
	launcherBootLoadModules();
}; 
global.launcherBootRequire = require;
if (typeof $$ !== "undefined") {            
    $$.requireBundle("launcherBoot");
    };
    
    
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"adler32":"adler32","bar":"bar","bar-fs-adapter":"bar-fs-adapter","edfs":"edfs","edfs-brick-storage":"edfs-brick-storage","edfs-middleware":"edfs-middleware","overwrite-require":"overwrite-require","psk-http-client":"psk-http-client","psk-security-context":"psk-security-context","pskcrypto":"pskcrypto","swarm-engine/bootScripts/launcherBootScript":"swarm-engine/bootScripts/launcherBootScript","swarmutils":"swarmutils","syndicate":"syndicate","zmq_adapter":"zmq_adapter"}],"/opt/working_dir/privatesky/modules/adler32/lib/Hash.js":[function(require,module,exports){
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

},{"./algorithm":"/opt/working_dir/privatesky/modules/adler32/lib/algorithm.js","buffer":false,"crypto":false,"stream":false,"util":false}],"/opt/working_dir/privatesky/modules/adler32/lib/algorithm.js":[function(require,module,exports){
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
},{}],"/opt/working_dir/privatesky/modules/adler32/lib/register.js":[function(require,module,exports){
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
},{"./Hash":"/opt/working_dir/privatesky/modules/adler32/lib/Hash.js","crypto":false}],"/opt/working_dir/privatesky/modules/bar-fs-adapter/lib/FsAdapter.js":[function(require,module,exports){
(function (Buffer){
const fsModule = "fs";
const fs = require(fsModule);
const pathModule = "path";
const path = require(pathModule);
const PathAsyncIterator = require('./PathAsyncIterator');

function FsAdapter() {

    let pathAsyncIterator;

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

    this.getFilesIterator = function(inputPath) {
        return new PathAsyncIterator(inputPath);
    };

    this.getNextFile = function (inputPath, restart, callback) {
        if(typeof restart === "function") {
            callback = restart;
            restart = false;
        }

        if(restart === true) {
            pathAsyncIterator = new PathAsyncIterator(inputPath);
        }

        pathAsyncIterator = pathAsyncIterator || new PathAsyncIterator(inputPath);
        pathAsyncIterator.next(callback);
    };

    this.appendBlockToFile = function (filePath, data, callback) {
        const pth = constructPath(filePath);
        if (pth !== '') {
            fs.mkdir(pth, {recursive: true}, (err) => {
                if (err && err.code !== "EEXIST") {
                    return callback(err);
                }

                fs.appendFile(filePath, data, callback);
            });
        } else {
            fs.appendFile(filePath, data, callback);
        }
    };

    this.writeBlockToFile = function (filePath, data, position, length, callback) {
        const folderPath = path.dirname(filePath);
        fs.access(folderPath, (err) => {
            if (err) {
                fs.mkdir(folderPath, {recursive: true}, (err) => {
                    if (err) {
                        return callback(err);
                    }

                    __writeBlock();
                });
            } else {
                __writeBlock();
            }
        });

        function __writeBlock() {
            const writeStream = fs.createWriteStream(filePath, {flags: "a+", start: position});

            writeStream.on("error", (err) => {
                return callback(err);
            });

            writeStream.write(data, callback);
        }
    };

    function constructPath(filePath) {
        let slices = filePath.split(path.sep);
        slices.pop();
        return slices.join(path.sep);
    }

}

module.exports = FsAdapter;
}).call(this,require("buffer").Buffer)

},{"./PathAsyncIterator":"/opt/working_dir/privatesky/modules/bar-fs-adapter/lib/PathAsyncIterator.js","buffer":false}],"/opt/working_dir/privatesky/modules/bar-fs-adapter/lib/PathAsyncIterator.js":[function(require,module,exports){
const fsModule = "fs";
const fs = require(fsModule);
const pathModule = "path";
const path = require(pathModule);
const TaskCounter = require("swarmutils").TaskCounter;


function PathAsyncIterator(inputPath) {
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
},{"swarmutils":"swarmutils"}],"/opt/working_dir/privatesky/modules/bar/lib/Archive.js":[function(require,module,exports){
(function (Buffer){
const Brick = require('./Brick');
const pathModule = "path";
const path = require(pathModule);
const isStream = require("../utils/isStream");
const TaskCounter = require("swarmutils").TaskCounter;
const crypto = require('pskcrypto');
const adler32 = require('adler32');

function Archive(archiveConfigurator) {

    const archiveFsAdapter = archiveConfigurator.getFsAdapter();
    const storageProvider = archiveConfigurator.getStorageProvider();
    let cachedSEED;
    let barMap;
    let cachedMapDigest;

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

    this.getFileHash = (fileBarPath, callback) => {
        loadBarMapThenExecute(() => {
            callback(undefined, __computeFileHash(fileBarPath).toString("hex"));
        }, callback)
    };

    this.getFolderHash = (folderBarPath, callback) => {
        loadBarMapThenExecute(() => {
            const fileList = barMap.getFileList(folderBarPath);
            let xor;
            for (let i = 0; i < fileList.length - 1; i++) {
                xor = crypto.xorBuffers(__computeFileHash(fileList[i]), __computeFileHash(fileList[i + 1]));
            }

            callback(undefined, crypto.pskHash(xor, "hex"));
        }, callback);
    };

    this.update = (fsPath, callback) => {
        let blocksPositions = {};
        let checksSumMap = barMap.getDictionaryObject();
        let fileNameHashes = __setFromHashList();
        let fileState = {};
        loadBarMapThenExecute(__update, callback);

        /**
         * in this function, i do a directory traversal and process every file that i find, looking for blocks that already exists in our archive
         * @private
         */

        function __setFromHashList() {
            let folderHashList = {};
            barMap.getFileList().forEach((file) => {
                folderHashList[file.slice(file.indexOf('/'))] = new Set(barMap.getHashList(file));
            });
            return folderHashList;
        }

        function __readDirectoryRecursively(folderPath, sign, callback) {
            archiveFsAdapter.getNextFile(folderPath, sign, __readFileChk);

            function __readFileChk(err, file) {
                if (err) {
                    return callback(err);
                }

                if (typeof file === 'undefined') {
                    return callback(undefined, blocksPositions, fileNameHashes);
                }

                const goodPath = path.posix.normalize(path.join(path.dirname(folderPath), file).split(path.sep).join(path.posix.sep));
                archiveFsAdapter.getFileSize(goodPath, (err, size) => {
                    if (err) {
                        return callback(err);
                    }
                    __readBlock(goodPath, goodPath.slice(goodPath.indexOf('/')), size, 0, archiveConfigurator.getBufferSize(), undefined, undefined, barMap.isInHeader(goodPath), (err) => {
                        if (err) {
                            return callback(err);
                        }
                        __readDirectoryRecursively(folderPath, false, callback);
                    });
                });

            }

            function __readBlock(file, cutFile, fileSize, index, blockSize, currentBlockCheckSum, firstByte, alreadyInBarMap, callback) {
                if (index >= fileSize) {
                    if (blocksPositions[file] === undefined) {
                        blocksPositions[file] = [];
                    }
                    blocksPositions[file].push({start: fileSize, end: fileSize});
                    return callback();
                }
                archiveFsAdapter.readBlockFromFile(file, index, index + blockSize - 1, (err, data) => {
                    if (err) {
                        return callback(err);
                    }
                    if (currentBlockCheckSum === undefined) {
                        currentBlockCheckSum = adler32.sum(data);
                    } else {
                        currentBlockCheckSum = adler32.roll(currentBlockCheckSum, blockSize, firstByte, data[blockSize - 1]);
                    }
                    let matchFound = false;
                    if (checksSumMap[currentBlockCheckSum] !== undefined) {
                        let hardDigest = crypto.pskHash(data).toString('hex');
                        for (let k = 0; k < checksSumMap[currentBlockCheckSum].length; k++) {
                            if (checksSumMap[currentBlockCheckSum][k] === hardDigest) {
                                if (blocksPositions[file] === undefined) {
                                    blocksPositions[file] = [];
                                }
                                blocksPositions[file].push({start: index, end: index + blockSize});
                                // if(alreadyInBarMap === false){
                                //     let tempBrick = new Brick();
                                //     tempBrick.setTransformedData(data);
                                // }
                                fileState[file] = alreadyInBarMap;
                                if (typeof fileNameHashes[cutFile] !== 'undefined') {
                                    fileNameHashes[cutFile].delete(hardDigest);
                                }
                                matchFound = true;
                                break;
                            }
                        }
                    }
                    if (matchFound === false) {
                        __readBlock(file, cutFile, fileSize, index + 1, blockSize, currentBlockCheckSum, data[0], alreadyInBarMap, callback);
                    } else {
                        __readBlock(file, cutFile, fileSize, index + blockSize, blockSize, undefined, undefined, alreadyInBarMap, callback);
                    }
                });
            }

        }

        function iterateThroughOffsets(fileName, goodPath, precedence, iteratorIndex, filePositions, callback) {
            if (iteratorIndex >= filePositions.length) {
                return callback();
            }
            let positionObj = filePositions[iteratorIndex];
            if (positionObj === undefined) {
                return callback();
            }
            if (positionObj.start > precedence) {
                archiveFsAdapter.readBlockFromFile(goodPath, precedence, positionObj.end - 1, (err, blockData) => {
                    if (err) {
                        return callback(err);
                    }
                    let bufferSize = archiveConfigurator.getBufferSize();
                    for (let index = 0; index < blockData.length; index += bufferSize) {
                        let brick = new Brick();
                        brick.setTransformedData(blockData.slice(index, index + bufferSize));
                        barMap.add(fileName, brick);
                        storageProvider.putBrick(brick, (err) => {
                            if (err) {
                                return callback(err);
                            }
                            if (index + bufferSize >= blockData.length) {
                                iterateThroughOffsets(fileName, goodPath, positionObj.end, iteratorIndex + 1, filePositions, callback);
                            }
                        });
                    }
                });
            } else {
                if (fileState[goodPath] === false) {
                    archiveFsAdapter.readBlockFromFile(goodPath, positionObj.start, positionObj.end - 1, (err, blockData) => {
                        if (err) {
                            return callback(err);
                        }
                        let brick = new Brick();
                        brick.setTransformedData(blockData);
                        barMap.add(fileName, brick);
                        iterateThroughOffsets(fileName, goodPath, positionObj.end, iteratorIndex + 1, filePositions, callback);
                    });
                } else {
                    iterateThroughOffsets(fileName, goodPath, positionObj.end, iteratorIndex + 1, filePositions, callback);
                }
            }
        }

        function __addBricks(positions, callback) {
            let precedence;
            const taskCounter = new TaskCounter((errs, results) => {
                return callback();
            });
            taskCounter.increment(Object.keys(positions).length);
            Object.keys(positions).forEach((fileName) => {
                precedence = 0;
                let goodPath = path.posix.normalize(fileName.split(path.sep).join(path.posix.sep));

                iterateThroughOffsets(fileName, goodPath, precedence, 0, positions[fileName], (err) => {
                    if (err) {
                        return callback(err);
                    }
                    taskCounter.decrement(undefined, fileName);
                });
            });
        }

        function __deleteBricks(deletions) {
            //de adaugat, barMap.removeBrick(filePath,brickHash);
            Object.keys(deletions).forEach((fileName) => {
                deletions[fileName].forEach((brickHash) => {
                    barMap.removeBrick(fileName, brickHash);
                });
            });
        }

        function __update() {
            __readDirectoryRecursively(fsPath, true, (err, positions, deletions) => {
                if (err) {
                    return callback(err);
                }
                __addBricks(positions, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    __deleteBricks(deletions);
                    storageProvider.putBarMap(barMap, callback);
                });
            });
        }
    };

    this.writeFile = (fileBarPath, data, callback) => {
        loadBarMapThenExecute(__addData, callback);

        function __addData() {
            const brick = new Brick(archiveConfigurator);
            if (typeof data === "string") {
                data = Buffer.from(data);
            }

            if (!Buffer.isBuffer(data)) {
                return callback(Error(`Type of data is ${typeof data}. Expected Buffer.`));
            }

            brick.setRawData(data);
            barMap.emptyList(fileBarPath);
            barMap.add(fileBarPath, brick);
            storageProvider.putBrick(brick, (err) => {
                if (err) {
                    return callback(err);
                }

                storageProvider.putBarMap(barMap, (err, digest) => {
                    if (err) {
                        return callback(err);
                    }

                    callback(undefined, digest);
                });
            });
        }
    };

    this.readFile = (barPath, callback) => {
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
                storageProvider.getBrick(brickId, (err, brick) => {
                    if (err) {
                        return callback(err);
                    }

                    brick.setConfig(archiveConfigurator);
                    brick.setTransformParameters(barMap.getTransformParameters(brickId));
                    fileData = Buffer.concat([fileData, brick.getRawData()]);
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

    this.addFile = (fsFilePath, barPath, callback) => {
        if (typeof barPath === "function") {
            callback = barPath;
            barPath = fsFilePath;
        }
        loadBarMapThenExecute(__addFile, callback);

        function __addFile() {
            createBricks(fsFilePath, barPath, archiveConfigurator.getBufferSize(), (err) => {
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

    /* TODO: do not create multiple BARMaps... */
    this.addFiles = (arrWithFilePaths, barPath, callback) => {
        let arr = arrWithFilePaths.slice();
        let self = this;
        function recAdd(){
            if(arr.length){
                let filePath = arr.pop();

                let fileName = path.basename(filePath) ;
                self.addFile(filePath, barPath + "/" + fileName, function(err, res){
                    if(err){
                     callback(err);
                    } else{
                        recAdd();
                    }
                });
            } else {
                callback(null, true);
            }
        }
        recAdd();
    };

    this.extractFile = (fsFilePath, barPath, callback) => {
        if (typeof barPath === "function") {
            callback = barPath;
            barPath = fsFilePath;
        }


        loadBarMapThenExecute(__extractFile, callback);

        function __extractFile() {
            const brickIds = barMap.getHashList(barPath);
            getFileRecursively(0, callback);

            function getFileRecursively(brickIndex, callback) {
                const brickId = brickIds[brickIndex];
                storageProvider.getBrick(brickId, (err, brick) => {
                    if (err) {
                        return callback(err);
                    }

                    brick.setConfig(archiveConfigurator);
                    brick.setTransformParameters(barMap.getTransformParameters(brickId));
                    archiveFsAdapter.appendBlockToFile(fsFilePath, brick.getRawData(), (err) => {
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
                });
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

    this.deleteFile = (filePath, callback) => {
        loadBarMapThenExecute(() => {
            storageProvider.deleteFile(filePath, callback);
        }, callback);
    };

    this.addFolder = (fsFolderPath, barPath, callback) => {
        if (typeof barPath === "function") {
            callback = barPath;
            barPath = fsFolderPath;
        }
        const filesIterator = archiveFsAdapter.getFilesIterator(fsFolderPath);

        loadBarMapThenExecute(__addFolder, callback);

        function __addFolder() {

            filesIterator.next(readFileCb);

            function readFileCb(err, file, rootFsPath) {
                if (err) {
                    return callback(err);
                }

                if (typeof file !== "undefined") {
                    const normalizedFilePath = file.split(path.sep).join("/");
                    createBricks(path.join(rootFsPath, file), barPath + "/" + normalizedFilePath, archiveConfigurator.getBufferSize(), (err) => {
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
        if (typeof fsFolderPath === "function") {
            callback = fsFolderPath;
            fsFolderPath = undefined;
        }
        if (typeof barPath === "function") {
            callback = barPath;
            barPath = undefined;
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

    this.listFiles = (folderBarPath, callback) => {
        if (typeof folderBarPath === "function") {
            callback = folderBarPath;
            folderBarPath = undefined;
        }
        loadBarMapThenExecute(() => {
            callback(undefined, barMap.getFileList(folderBarPath));
        }, callback);
    };

    this.clone = (targetStorage, preserveKeys = true, callback) => {
        targetStorage.getBarMap((err, targetBarMap) => {
            if (err) {
                return callback(err);
            }

            loadBarMapThenExecute(__cloneBricks, callback);

            function __cloneBricks() {
                const fileList = barMap.getFileList();

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

    function createBricks(fsFilePath, barPath, blockSize, callback) {

        archiveFsAdapter.getFileSize(fsFilePath, (err, fileSize) => {
            if (err) {
                return callback(err);
            }

            let noBlocks = Math.floor(fileSize / blockSize);
            if (fileSize % blockSize > 0) {
                ++noBlocks;
            }

            //todo: check if emptyList is called ok in this place.
            // the scenario: adding a new file at an existing barPath should overwrite the initial content found there.

            barMap.emptyList(barPath);
            __createBricksRecursively(0, callback);

            function __createBricksRecursively(blockIndex, callback) {
                archiveFsAdapter.readBlockFromFile(fsFilePath, blockIndex * blockSize, (blockIndex + 1) * blockSize - 1, (err, blockData) => {
                    if (err) {
                        return callback(err);
                    }

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

    function loadBarMapThenExecute(functionToBeExecuted, callback) {
        storageProvider.getBarMap(archiveConfigurator.getMapDigest(), (err, map) => {
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
            storageProvider.setBarMap(barMap);
            functionToBeExecuted();
        });
    }
}

module.exports = Archive;

}).call(this,require("buffer").Buffer)

},{"../utils/isStream":"/opt/working_dir/privatesky/modules/bar/utils/isStream.js","./Brick":"/opt/working_dir/privatesky/modules/bar/lib/Brick.js","adler32":"adler32","buffer":false,"pskcrypto":"pskcrypto","swarmutils":"swarmutils"}],"/opt/working_dir/privatesky/modules/bar/lib/ArchiveConfigurator.js":[function(require,module,exports){
const storageProviders = {};
const fsAdapters = {};
const Seed = require("./Seed");

function ArchiveConfigurator() {
    const config = {};

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

    this.setSeedId = (id) => {
        config.seed.setId(id);
        this.setMapDigest(id);
    };

    this.getSeedId = () => {
        loadSeed();
        if (config.seed) {
            return config.seed.getId();
        }
    };

    this.setSeed = (compactSeed) => {
        config.seed = new Seed(compactSeed);
        const endpoint = config.seed.getEndpoint();
        if (endpoint) {
            this.setStorageProvider("EDFSBrickStorage", endpoint);
        }
        this.setMapDigest(config.seed.getId());
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
        config.seed = new Seed(undefined, undefined, config.seedEndpoint, !!config.encryption);
        if (config.seed.getId()) {
            self.setMapDigest(config.seed.getId());
        }
    };

    //--------------------------
    function loadSeed() {
        if (!config.seed) {
            config.seed = new Seed(undefined, undefined, config.seedEndpoint, !!config.encryption);
            if (config.seed.getId()) {
                self.setMapDigest(config.seed.getId());
            }
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
},{"./Seed":"/opt/working_dir/privatesky/modules/bar/lib/Seed.js"}],"/opt/working_dir/privatesky/modules/bar/lib/Brick.js":[function(require,module,exports){
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

    this.setConfig = (newConfig)=> {
        config = newConfig;
        if (transform) {
            transform.setConfig(newConfig);
        }else{
            transform = transformFactory.createBrickTransform(config);
        }
    };

    this.createNewTransform = ()=> {
        transform = transformFactory.createBrickTransform(config);
        transformParameters = undefined;
        transformData();
    };

    this.getHash = ()=> {
        if (!hash) {
            hash = crypto.pskHash(this.getTransformedData()).toString("hex");
        }

        return hash;
    };

    this.getId = () => {
        const seedId = config.getSeedId();
        if (seedId) {
            return seedId;
        }
        return config.getMapDigest();
    };

    this.setId = (id) => {
        config.setSeedId(id);
    };

    this.getSeed = () => {
        return config.getSeed().toString();
    };
    this.getAdler32 = ()=> {
        return adler32.sum(this.getTransformedData());
    };

    this.setRawData = function (data) {
        rawData = data;
        if (!transform) {
            transformedData = rawData;
        }
    };

    this.getRawData = ()=> {
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

    this.setTransformedData = (data)=> {
        transformedData = data;
    };

    this.getTransformedData = ()=> {
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

    this.getTransformParameters = ()=> {
        if (!transformedData) {
            transformData();
        }
        return transformParameters;
    };

    this.setTransformParameters =  (newTransformParams) =>{
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

    this.getRawSize = ()=> {
        return rawData.length;
    };

    this.getTransformedSize = ()=> {
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

},{"./transforms/BrickTransformFactory":"/opt/working_dir/privatesky/modules/bar/lib/transforms/BrickTransformFactory.js","adler32":"adler32","pskcrypto":"pskcrypto"}],"/opt/working_dir/privatesky/modules/bar/lib/FileBarMap.js":[function(require,module,exports){
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

},{"../utils/utilities":"/opt/working_dir/privatesky/modules/bar/utils/utilities.js","./Brick":"/opt/working_dir/privatesky/modules/bar/lib/Brick.js","buffer":false}],"/opt/working_dir/privatesky/modules/bar/lib/FileBrickStorage.js":[function(require,module,exports){
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

},{"../utils/AsyncDispatcher":"/opt/working_dir/privatesky/modules/bar/utils/AsyncDispatcher.js","../utils/utilities":"/opt/working_dir/privatesky/modules/bar/utils/utilities.js","./Brick":"/opt/working_dir/privatesky/modules/bar/lib/Brick.js","./FileBarMap":"/opt/working_dir/privatesky/modules/bar/lib/FileBarMap.js","buffer":false,"fs":false}],"/opt/working_dir/privatesky/modules/bar/lib/FolderBarMap.js":[function(require,module,exports){
(function (Buffer){
const Brick = require("./Brick");
const pathModule = "path";
const path = require(pathModule);

function FolderBarMap(header) {
    header = header || {};

    let archiveConfig;
    let encryptionKey;

    this.add = (filePath, brick) => {
        filePath = filePath.split(path.sep).join("/");
        this.load();
        if (typeof header[filePath] === "undefined") {
            header[filePath] = [];
        }

        const brickObj = {
            checkSum: brick.getAdler32(),
            hash: brick.getHash()
        };

        const encKey = brick.getTransformParameters() ? brick.getTransformParameters().key : undefined;
        if (encKey) {
            brickObj.key = encKey;
        }
        header[filePath].push(brickObj);
    };

    this.isInHeader = (filePath) => {
        return header[filePath] !== undefined;
    };

    this.removeBrick = (filePath, brickHash) => {
        let indexToRemove = header[filePath].findIndex(brickObj => brickObj.hash === brickHash);
        header[filePath].splice(indexToRemove, 1);
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

    this.getHashList = (filePath) => {
        this.load();
        return header[filePath].map(brickObj => brickObj.hash);
    };

    this.getCheckSumList = (filePath) => {
        this.load();
        return header[filePath].map(brickObj => brickObj.checkSum);
    };

    this.emptyList = (filePath) => {
        header[filePath] = [];
    };


    this.toBrick = () => {
        this.load();
        const brick = new Brick(archiveConfig);
        if (encryptionKey) {
            brick.setTransformParameters({key: encryptionKey});
        }
        brick.setRawData(Buffer.from(JSON.stringify(header)));
        return brick;
    };


    this.getFileList = (folderBarPath) => {
        this.load();
        if (!folderBarPath || folderBarPath === "" || folderBarPath === "/") {
            return Object.keys(header);
        }
        return Object.keys(header).filter(fileName => fileName.includes(folderBarPath));
    };

    this.getTransformParameters = (brickId) => {
        this.load();
        if (!brickId) {
            return encryptionKey ? {key: encryptionKey} : undefined;
        }
        let bricks = [];
        const files = this.getFileList();
        files.forEach(file => {
            bricks = bricks.concat(header[file]);
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
        }else{
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

module.exports = FolderBarMap;
}).call(this,require("buffer").Buffer)

},{"./Brick":"/opt/working_dir/privatesky/modules/bar/lib/Brick.js","buffer":false}],"/opt/working_dir/privatesky/modules/bar/lib/FolderBrickStorage.js":[function(require,module,exports){
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
       
        let brickId = barMapBrick.getId();
        if (!brickId) {
            brickId = barMapBrick.getHash();
        }

        barMapBrick.setId(brickId);
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
},{"./Brick":"/opt/working_dir/privatesky/modules/bar/lib/Brick.js","./FolderBarMap":"/opt/working_dir/privatesky/modules/bar/lib/FolderBarMap.js","fs":false,"path":false}],"/opt/working_dir/privatesky/modules/bar/lib/Seed.js":[function(require,module,exports){
(function (Buffer){
const crypto = require("pskcrypto");

function Seed(compactSeed, id, endpoint, usedForEncryption  = true, randomLength = 32) {
    let seed;

    init();

    this.getCompactForm = () => {
        if (!seed) {
            throw Error("Cannot return seed");
        }

        return generateCompactForm(seed);
    };

    this.getLocation = () => {
        if (!seed) {
            throw Error("Cannot retrieve location");
        }

        return seed.endpoint + "/" + seed.id.toString("hex");
    };

    this.getEndpoint = () => {
        if (!seed) {
            throw Error("Cannot retrieve endpoint");
        }

        return seed.endpoint.toString();
    };

    this.getId = () => {
        if (!seed.id) {
            return;
        }
        return seed.id.toString("hex");
    };

    this.setId = (localId) => {
        seed.id = localId;
    };

    this.getEncryptionKey = (algorithm) => {
        if (seed.tag === 'r') {
            return;
        }

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
        localSeed.id = id;
        if (!id && usedForEncryption) {
            //Bugfix: randomBytes in browser returns an Uint8Array object that has a wrong constructor and prototype
            //that is why we create a new instance of Buffer/Uint8Array based on the result of randomBytes
            localSeed.id = Buffer.from(crypto.randomBytes(randomLength));
            //TODO: why don't we use ID Generator from swarmutils?
        }

        if (endpoint) {
            localSeed.endpoint = endpoint;
        }else{
            throw Error("The SEED could not be created because an endpoint was not provided.")
        }

        if (usedForEncryption === true) {
            localSeed.flag = 'e';
        }else{
            localSeed.flag = 'r';
        }

        return localSeed;
    }

    function generateCompactForm(expandedSeed) {
        if (typeof expandedSeed === "string") {
            return expandedSeed;
        }

        if(!expandedSeed.id){
            throw Error("The seed does not contain an id");
        }
        let compactSeed = expandedSeed.id.toString('base64');
        if (expandedSeed.endpoint) {
            compactSeed += '|' + Buffer.from(JSON.stringify(expandedSeed.endpoint)).toString('base64');
        }

        compactSeed += expandedSeed.flag;
        return Buffer.from(encodeURIComponent(compactSeed));
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

        const decodedCompactSeed = decodeURIComponent(compactFormSeed);
        const localSeed = {};
        const splitCompactSeed = decodedCompactSeed.split('|');

        localSeed.flag = splitCompactSeed[1][splitCompactSeed[1].length - 1];
        splitCompactSeed[1] = splitCompactSeed[1].slice(0, -1);
        localSeed.id = Buffer.from(splitCompactSeed[0], 'base64');

        if (splitCompactSeed[1] && splitCompactSeed[1].length > 0) {
            localSeed.endpoint = JSON.parse(Buffer.from(splitCompactSeed[1], 'base64').toString());
        } else {
            console.warn('Cannot find endpoint in compact seed')
        }

        return localSeed;
    }
}

module.exports = Seed;
}).call(this,require("buffer").Buffer)

},{"buffer":false,"pskcrypto":"pskcrypto"}],"/opt/working_dir/privatesky/modules/bar/lib/transforms/BrickTransform.js":[function(require,module,exports){
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

},{"buffer":false}],"/opt/working_dir/privatesky/modules/bar/lib/transforms/BrickTransformFactory.js":[function(require,module,exports){
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


},{"./BrickTransform":"/opt/working_dir/privatesky/modules/bar/lib/transforms/BrickTransform.js","./CompressionEncryptionGenerator":"/opt/working_dir/privatesky/modules/bar/lib/transforms/CompressionEncryptionGenerator.js","./CompressionGenerator":"/opt/working_dir/privatesky/modules/bar/lib/transforms/CompressionGenerator.js","./EncryptionGenerator":"/opt/working_dir/privatesky/modules/bar/lib/transforms/EncryptionGenerator.js"}],"/opt/working_dir/privatesky/modules/bar/lib/transforms/CompressionEncryptionGenerator.js":[function(require,module,exports){
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
},{"./CompressionGenerator":"/opt/working_dir/privatesky/modules/bar/lib/transforms/CompressionGenerator.js","./EncryptionGenerator":"/opt/working_dir/privatesky/modules/bar/lib/transforms/EncryptionGenerator.js"}],"/opt/working_dir/privatesky/modules/bar/lib/transforms/CompressionGenerator.js":[function(require,module,exports){
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


},{"zlib":false}],"/opt/working_dir/privatesky/modules/bar/lib/transforms/EncryptionGenerator.js":[function(require,module,exports){
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
            params:decryptionParameters
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

        const encOptions = config.getEncryptionOptions();
        if(transformParameters && transformParameters.key){
            key = transformParameters.key;
        }else{
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
},{"pskcrypto":"pskcrypto"}],"/opt/working_dir/privatesky/modules/bar/utils/AsyncDispatcher.js":[function(require,module,exports){

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
},{}],"/opt/working_dir/privatesky/modules/bar/utils/isStream.js":[function(require,module,exports){
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

},{}],"/opt/working_dir/privatesky/modules/bar/utils/utilities.js":[function(require,module,exports){
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
},{"fs":false}],"/opt/working_dir/privatesky/modules/edfs-brick-storage/EDFSBrickStorage.js":[function(require,module,exports){
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

        let brickId = barMapBrick.getId();
        if (!brickId) {
            brickId = barMapBrick.getHash();
            barMapBrick.setId(brickId);
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
                map = bar.createBarMap(mapBrick);
                callback(undefined, map);
            });
        });
    };
}

module.exports = EDFSBrickStorage;


},{"bar":"bar"}],"/opt/working_dir/privatesky/modules/edfs-middleware/flows/BricksManager.js":[function(require,module,exports){
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
    init: function (rootFolder, callback) {

        if (!rootFolder) {
            callback(new Error("No root folder specified!"));
            return;
        }
        rootFolder = path.resolve(rootFolder);
        this.__ensureFolderStructure(rootFolder, (err, pth) => {
            brickStorageFolder = rootFolder;
            callback(err, rootFolder);
        });
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
        fs.mkdir(folder, {recursive: true}, callback);
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

},{"pskcrypto":"pskcrypto"}],"/opt/working_dir/privatesky/modules/edfs-middleware/lib/EDFSClient.js":[function(require,module,exports){
require("psk-http-client");

function EDFSClient(url) {
    this.attachAlias = (fileName, alias, callback) => {
        $$.remote.doHttpPost(url + "/EDFS/attachHashToAlias/" + fileName, alias, callback);
    };

    this.writeToAlias = (alias, data, callback) => {
        $$.remote.doHttpPost(url + "/EDFS/alias/" + alias, data, callback);
    };

    this.readFromAlias = (alias, callback) => {
        $$.remote.doHttpGet(url + "/EDFS/alias/" + alias, callback);
    };

    this.writeFile = (fileName, data, callback) => {
        $$.remote.doHttpPost(url + "/EDFS/" + fileName, data, callback);
    };

    this.readFile = (fileName, callback) => {
        $$.remote.doHttpGet(url + "/EDFS/" + fileName, callback);
    };
}

module.exports = EDFSClient;
},{"psk-http-client":"psk-http-client"}],"/opt/working_dir/privatesky/modules/edfs-middleware/lib/EDFSMiddleware.js":[function(require,module,exports){
require("../flows/BricksManager");

function EDFSMiddleware(server) {

    server.use('/*',function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, X-Content-Length');
        next();

    });

    server.post('/:fileId', (req, res) => {
        $$.flow.start("BricksManager").write(req.params.fileId, req, (err, result) => {
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

    server.get('/:fileId', (req, res) => {
        res.setHeader("content-type", "application/octet-stream");
        $$.flow.start("BricksManager").read(req.params.fileId, res, (err, result) => {
            res.statusCode = 200;
            if (err) {
                console.log(err);
                res.statusCode = 404;
            }
            res.end();
        });
    });

    server.post('/attachHashToAlias/:fileId', (req, res) => {
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

    server.get('/getVersions/:alias', (req, res) => {
        $$.flow.start("BricksManager").readVersions(req.params.alias, (err, fileHashes) => {
            res.statusCode = 200;
            if(err) {
                console.error(err);
                res.statusCode = 404;
            }
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify(fileHashes));
        });
    });
}

module.exports = EDFSMiddleware;

},{"../flows/BricksManager":"/opt/working_dir/privatesky/modules/edfs-middleware/flows/BricksManager.js"}],"/opt/working_dir/privatesky/modules/edfs/brickTransportStrategies/FetchBrickTransportStrategy.js":[function(require,module,exports){
(function (Buffer){

function FetchBrickTransportStrategy(initialConfig) {
    const url = initialConfig;
    this.send = (name, data, callback) => {

        fetch(url + "/EDFS/", {
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
            return response.json();
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

    this.getLocator = () => {
        return url;
    };
}
//TODO:why we use this?
FetchBrickTransportStrategy.prototype.FETCH_BRICK_TRANSPORT_STRATEGY = "FETCH_BRICK_TRANSPORT_STRATEGY";


module.exports = FetchBrickTransportStrategy;

}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/opt/working_dir/privatesky/modules/edfs/brickTransportStrategies/HTTPBrickTransportStrategy.js":[function(require,module,exports){

function HTTPBrickTransportStrategy(endpoint) {
    require("psk-http-client");

    this.send = (name, data, callback) => {
        $$.remote.doHttpPost(endpoint + "/EDFS/" + name, data, callback);
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
},{"psk-http-client":"psk-http-client"}],"/opt/working_dir/privatesky/modules/edfs/brickTransportStrategies/brickTransportStrategiesRegistry.js":[function(require,module,exports){
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
            throw Error("Invalid endpoint");
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
},{}],"/opt/working_dir/privatesky/modules/edfs/lib/EDFS.js":[function(require,module,exports){
function EDFS(endpoint) {
    const RawDossier = require("./RawDossier");
    const barModule = require("bar");
    const fsAdapter = require("bar-fs-adapter");
    const constants = require('../moduleConstants');
    const self = this;

    this.createCSB = () => {
        return new RawDossier(endpoint);
    };

    this.createBar = () => {
        return barModule.createArchive(createArchiveConfig());
    };

    this.bootCSB = (seed, callback) => {
        const rawDossier = new RawDossier(endpoint, seed);
        rawDossier.start(err => callback(err, rawDossier));
    };

    this.loadBar = (seed) => {
        return barModule.createArchive(createArchiveConfig(seed));
    };

    this.clone = (seed, callback) => {
        const edfsBrickStorage = require("edfs-brick-storage").create(endpoint);
        const bar = this.loadBar(seed);
        bar.clone(edfsBrickStorage, true, callback);
    };

    this.createWallet = (templateSeed, pin, overwrite = false, callback) => {
        const wallet = this.createCSB();
        wallet.mount("", constants.CSB.CONSTITUTION_FOLDER, templateSeed, (err => {
            if (err) {
                return callback(err);
            }

            const seed = wallet.getSeed();
            if (typeof pin !== "undefined") {
                require("../seedCage").putSeed(seed, pin, overwrite, (err) => {
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

    this.loadWallet = function (walletSeed, pin, overwrite, callback) {
        if (typeof overwrite === "function") {
            callback = overwrite;
            overwrite = pin;
            pin = walletSeed;
            walletSeed = undefined;
        }
        if (typeof walletSeed === "undefined") {
            require("../seedCage").getSeed(pin, (err, seed) => {
                if (err) {
                    return callback(err);
                }
                try {
                    let wallet = this.loadBar(seed);
                    return callback(undefined, wallet);
                } catch (err) {
                    return callback(err);
                }
            });
        } else {
            let wallet;
            try {
                wallet = this.loadBar(walletSeed);
                if (typeof pin !== "undefined" && pin !== null) {
                    require("../seedCage").putSeed(walletSeed, pin, overwrite, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        callback(undefined, wallet);
                    });
                } else {
                    return callback(undefined, wallet);
                }
            } catch (err) {
                return callback(err);
            }
        }
    };

    this.createBarWithConstitution = function (folderConstitution, callback) {
        const bar = this.createBar();
        bar.addFolder(folderConstitution, constants.CSB.CONSTITUTION_FOLDER, (err, mapDigest) => {
            if (err) {
                return callback(err);
            }

            callback(undefined, bar);
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

        if (seed) {
            archiveConfigurator.setSeed(seed);
        } else {
            archiveConfigurator.setSeedEndpoint(endpoint);
        }

        return archiveConfigurator;
    }
}

module.exports = EDFS;
},{"../moduleConstants":"/opt/working_dir/privatesky/modules/edfs/moduleConstants.js","../seedCage":"/opt/working_dir/privatesky/modules/edfs/seedCage/index.js","./RawDossier":"/opt/working_dir/privatesky/modules/edfs/lib/RawDossier.js","bar":"bar","bar-fs-adapter":"bar-fs-adapter","edfs-brick-storage":"edfs-brick-storage"}],"/opt/working_dir/privatesky/modules/edfs/lib/RawDossier.js":[function(require,module,exports){
/*

Sinica: to be renamed CSBHandler. RootCSB should be deleted
*/

function RawDossier(endpoint, seed) {
    const barModule = require("bar");
    const constants = require("../moduleConstants").CSB;
    let bar = createBar(seed);
    this.getSeed = () => {
        return bar.getSeed();
    };

    this.start = (callback) => {
        createBlockchain(bar).start(callback);
    };

    this.addFolder = (fsFolderPath, barPath, callback) => {
        bar.addFolder(fsFolderPath, barPath, (err, barMapDigest) => callback(err, barMapDigest));
    };

    this.addFile = (fsFilePath, barPath, callback) => {
        bar.addFile(fsFilePath, barPath, (err, barMapDigest) => callback(err, barMapDigest));
    };

    this.readFile = bar.readFile;

    this.extractFolder = bar.extractFolder;

    this.extractFile = bar.extractFile;

    this.writeFile = (barPath, data, callback) => {
        bar.writeFile(barPath, data, (err, barMapDigest) => callback(err, barMapDigest));
    };

    this.listFiles = bar.listFiles;

    this.mount = (path, name, archiveIdentifier, callback) => {
        bar.readFile(constants.MANIFEST_FILE, (err, data) => {
            let manifest;
            if (err) {
                manifest = {};
                manifest.mounts = [];
            }

            if (data) {
                manifest = JSON.parse(data.toString());
                const pathNames = manifest.mounts.filter(el => el.localPath === path);
                const index = pathNames.findIndex(el => el === name);
                if (index >= 0) {
                    return callback(Error(`A mount point at path ${path} with the name ${name} already exists.`));
                }
            }

            const mount = {};
            mount.localPath = path;
            mount.mountName = name;
            mount.archiveIdentifier = archiveIdentifier;

            manifest.mounts.push(mount);

            bar.writeFile(constants.MANIFEST_FILE, JSON.stringify(manifest), callback);
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

            callback();
        });
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

        return barModule.createArchive(archiveConfigurator);
    }

    this.getRawDossier = (rawDossier, path, callback) => {
        if (path === "" || path === "/") {
            return callback(undefined, {rawDossier, path});
        }
        rawDossier.listFiles((err, files) => {
            if (err) {
                return callback(err);
            }

            if (files.length === 0) {
                return callback();
            }
            let pathRest = [];

            let barPath = files.find(barPath => barPath === path);
            if (barPath) {
                return callback(undefined, {rawDossier, path});
            } else {
                let splitPath = path.split("/");
                rawDossier.readFile(constants.MANIFEST_FILE, (err, manifestContent) => {
                    if (err) {
                        return callback(err);
                    }

                    const manifest = JSON.parse(manifestContent.toString());
                    pathRest.unshift(splitPath.pop());
                    while (splitPath.length > 0) {
                        for (let mount of manifest.mounts) {
                            const localPath = splitPath.join("/");
                            const name = pathRest.shift();
                            if (mount.localPath === localPath && mount.mountName === name) {
                                const internalRawDossier = createBar(mount.archiveIdentifier);
                                let newPath = "";
                                if (pathRest.length > 0) {
                                    newPath = pathRest.join("/");
                                }
                                return this.getRawDossier(internalRawDossier, newPath, callback);
                            }
                        }

                        pathRest.unshift(splitPath.pop());
                    }
                    console.log(" nothing to see here");
                    return;
                });
            }
        });
    };
}

module.exports = RawDossier;
},{"../moduleConstants":"/opt/working_dir/privatesky/modules/edfs/moduleConstants.js","bar":"bar","bar-fs-adapter":"bar-fs-adapter","blockchain":false,"edfs-brick-storage":"edfs-brick-storage"}],"/opt/working_dir/privatesky/modules/edfs/moduleConstants.js":[function(require,module,exports){
const HTTPBrickTransportStrategy = require("./brickTransportStrategies/HTTPBrickTransportStrategy");
HTTPBrickTransportStrategy.prototype.HTTP_BRICK_TRANSPORT_STRATEGY = "HTTP_BRICK_TRANSPORT_STRATEGY";

module.exports = {
    CSB: {
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

},{"./brickTransportStrategies/HTTPBrickTransportStrategy":"/opt/working_dir/privatesky/modules/edfs/brickTransportStrategies/HTTPBrickTransportStrategy.js"}],"/opt/working_dir/privatesky/modules/edfs/seedCage/BrowserSeedCage.js":[function(require,module,exports){
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

},{"buffer":false}],"/opt/working_dir/privatesky/modules/edfs/seedCage/NodeSeedCage.js":[function(require,module,exports){
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

function getSeed(pin, callback) {
    fs.readFile(seedCagePath, (err, encryptedSeed) => {
        if (err) {
            return callback(err);
        }

        let seed;
        try {
            const pskEncryption = crypto.createPskEncryption(algorithm);
            const encKey = crypto.deriveKey(algorithm, pin);
            seed = pskEncryption.decrypt(encryptedSeed, encKey).toString();
        } catch (e) {
            return callback(e);
        }

        callback(undefined, seed);
    });
}

function putSeed(seed, pin, overwrite = false, callback) {
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

},{"buffer":false}],"/opt/working_dir/privatesky/modules/edfs/seedCage/index.js":[function(require,module,exports){
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
},{"./BrowserSeedCage":"/opt/working_dir/privatesky/modules/edfs/seedCage/BrowserSeedCage.js","./NodeSeedCage":"/opt/working_dir/privatesky/modules/edfs/seedCage/NodeSeedCage.js","overwrite-require":"overwrite-require"}],"/opt/working_dir/privatesky/modules/overwrite-require/moduleConstants.js":[function(require,module,exports){
module.exports = {
  BROWSER_ENVIRONMENT_TYPE: 'browser',
  SERVICE_WORKER_ENVIRONMENT_TYPE: 'service-worker',
  ISOLATE_ENVIRONMENT_TYPE: 'isolate',
  THREAD_ENVIRONMENT_TYPE: 'thread',
  NODEJS_ENVIRONMENT_TYPE: 'nodejs'
};

},{}],"/opt/working_dir/privatesky/modules/overwrite-require/standardGlobalSymbols.js":[function(require,module,exports){
(function (global){
let logger = console;

if (!global.process || process.env.NO_LOGS !== 'true') {
    try {
        const PSKLoggerModule = require('psklogger');
        const PSKLogger = PSKLoggerModule.PSKLogger;

        logger = PSKLogger.getLogger();

        console.log('Logger init successful', process.pid);
    } catch (e) {
        if(e.message.indexOf("psklogger")!==-1){
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

},{"psklogger":false}],"/opt/working_dir/privatesky/modules/psk-http-client/lib/psk-abstract-client.js":[function(require,module,exports){
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

        createRequestManager();
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
},{}],"/opt/working_dir/privatesky/modules/psk-http-client/lib/psk-browser-client.js":[function(require,module,exports){
(function (Buffer){
function generateMethodForRequestWithData(httpMethod) {
    return function (url, data, callback) {
        const xhr = new XMLHttpRequest();

        xhr.onload = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                const data = xhr.response;
                callback(null, data);
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
                callback(null, buffer);
            }
            else{
                callback(null, xhr.response);
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
    }

    this.signSwarm = function(swarm, agent){
        swarm.meta.signature = agent;
    }
}



$$.remote.cryptoProvider = new CryptoProvider();

$$.remote.base64Encode = function base64Encode(stringToEncode){
    return window.btoa(stringToEncode);
};

$$.remote.base64Decode = function base64Decode(encodedString){
    return window.atob(encodedString);
};

}).call(this,require("buffer").Buffer)

},{"buffer":false}],"/opt/working_dir/privatesky/modules/psk-http-client/lib/psk-node-client.js":[function(require,module,exports){
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
					callback(null, rawData, res.headers);
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

},{"./psk-abstract-client":"/opt/working_dir/privatesky/modules/psk-http-client/lib/psk-abstract-client.js","buffer":false,"http":false,"https":false,"url":false}],"/opt/working_dir/privatesky/modules/psk-security-context/lib/Agent.js":[function(require,module,exports){
function Agent(agentId, publicKey){
    this.agentId = agentId;
    this.publicKey = publicKey;
}

module.exports = Agent;
},{}],"/opt/working_dir/privatesky/modules/psk-security-context/lib/EncryptedSecret.js":[function(require,module,exports){
function EncryptedSecret(encryptedData, agentId){
    this.encryptedData = encryptedData;
    this.agentId = agentId;
}

module.exports = EncryptedSecret;
},{}],"/opt/working_dir/privatesky/modules/psk-security-context/lib/PSKSignature.js":[function(require,module,exports){
function PSKSignature(message, signature, type, agentId) {
    this.message = message;
    this.signature = signature;
    this.type = type;
    this.agentId = agentId;
}

module.exports = PSKSignature;
},{}],"/opt/working_dir/privatesky/modules/psk-security-context/lib/RawCSBSecurityContext.js":[function(require,module,exports){
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
},{}],"/opt/working_dir/privatesky/modules/psk-security-context/lib/RootCSBSecurityContext.js":[function(require,module,exports){
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
},{"./SecurityContext":"/opt/working_dir/privatesky/modules/psk-security-context/lib/SecurityContext.js"}],"/opt/working_dir/privatesky/modules/psk-security-context/lib/SecurityContext.js":[function(require,module,exports){
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

},{"./Agent":"/opt/working_dir/privatesky/modules/psk-security-context/lib/Agent.js","./EncryptedSecret":"/opt/working_dir/privatesky/modules/psk-security-context/lib/EncryptedSecret.js","./PSKSignature":"/opt/working_dir/privatesky/modules/psk-security-context/lib/PSKSignature.js","pskcrypto":"pskcrypto","swarmutils":"swarmutils"}],"/opt/working_dir/privatesky/modules/pskcrypto/lib/PskCrypto.js":[function(require,module,exports){
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

},{"./PskEncryption":"/opt/working_dir/privatesky/modules/pskcrypto/lib/PskEncryption.js","./utils/cryptoUtils":"/opt/working_dir/privatesky/modules/pskcrypto/lib/utils/cryptoUtils.js","buffer":false,"crypto":false,"overwrite-require":"overwrite-require"}],"/opt/working_dir/privatesky/modules/pskcrypto/lib/PskEncryption.js":[function(require,module,exports){
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

},{"./utils/cryptoUtils":"/opt/working_dir/privatesky/modules/pskcrypto/lib/utils/cryptoUtils.js","buffer":false,"crypto":false}],"/opt/working_dir/privatesky/modules/pskcrypto/lib/utils/DuplexStream.js":[function(require,module,exports){
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
},{"stream":false,"util":false}],"/opt/working_dir/privatesky/modules/pskcrypto/lib/utils/cryptoUtils.js":[function(require,module,exports){
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

},{"buffer":false,"crypto":false}],"/opt/working_dir/privatesky/modules/pskcrypto/lib/utils/isStream.js":[function(require,module,exports){
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
},{"stream":false}],"/opt/working_dir/privatesky/modules/pskcrypto/signsensusDS/ssutil.js":[function(require,module,exports){
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
},{"crypto":false}],"/opt/working_dir/privatesky/modules/swarm-engine/bootScripts/BootEngine.js":[function(require,module,exports){
function BootEngine(getSeed, getEDFS, initializeSwarmEngine, runtimeBundles, constitutionBundles) {

    if(typeof getSeed !== "function"){
        throw new Error("getSeed missing or not a function");
    }
    getSeed = promisify(getSeed);

    if(typeof getEDFS !== "function"){
        throw new Error("getEDFS missing or not a function");
    }
    getEDFS = promisify(getEDFS);

    if(typeof initializeSwarmEngine !== "function"){
        throw new Error("initializeSwarmEngine missing or not a function");
    }
    initializeSwarmEngine = promisify(initializeSwarmEngine);

    if(typeof runtimeBundles !== "undefined" && !Array.isArray(runtimeBundles)){
        throw new Error("runtimeBundles is not array");
    }

    if(typeof constitutionBundles !== "undefined" && !Array.isArray(constitutionBundles)){
        throw new Error("constitutionBundles is not array");
    }

    const EDFS = require('edfs');
    let edfs;

    const evalBundles = async (bundles, ignore) => {
        const listFiles = promisify(this.bar.listFiles);
        const readFile = promisify(this.bar.readFile);

        let fileList = await listFiles(EDFS.constants.CSB.CONSTITUTION_FOLDER);
        fileList = bundles.filter(bundle => fileList.includes(`${EDFS.constants.CSB.CONSTITUTION_FOLDER}/${bundle}`))
            .map(bundle => `${EDFS.constants.CSB.CONSTITUTION_FOLDER}/${bundle}`);

        if (fileList.length !== bundles.length) {
            const message = `Some bundles missing. Expected to have ${JSON.stringify(bundles)} but got only ${JSON.stringify(fileList)}`;
            if(!ignore){
                throw new Error(message);
            }else{
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
           this.bar = edfs.loadBar(seed);
           await evalBundles(runtimeBundles);
           await initializeSwarmEngine();
           if (typeof constitutionBundles !== "undefined") {
               await evalBundles(constitutionBundles, true);
           }
        };

        __boot()
            .then(() => callback(undefined, this.bar))
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

},{"edfs":"edfs"}],"/opt/working_dir/privatesky/modules/swarmutils/lib/Combos.js":[function(require,module,exports){
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
},{}],"/opt/working_dir/privatesky/modules/swarmutils/lib/OwM.js":[function(require,module,exports){
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
},{}],"/opt/working_dir/privatesky/modules/swarmutils/lib/Queue.js":[function(require,module,exports){
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
},{}],"/opt/working_dir/privatesky/modules/swarmutils/lib/SwarmPacker.js":[function(require,module,exports){
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
},{}],"/opt/working_dir/privatesky/modules/swarmutils/lib/TaskCounter.js":[function(require,module,exports){

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
},{}],"/opt/working_dir/privatesky/modules/swarmutils/lib/beesHealer.js":[function(require,module,exports){
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
},{"./OwM":"/opt/working_dir/privatesky/modules/swarmutils/lib/OwM.js"}],"/opt/working_dir/privatesky/modules/swarmutils/lib/pingpongFork.js":[function(require,module,exports){
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
},{"child_process":false}],"/opt/working_dir/privatesky/modules/swarmutils/lib/pskconsole.js":[function(require,module,exports){
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


},{}],"/opt/working_dir/privatesky/modules/swarmutils/lib/safe-uuid.js":[function(require,module,exports){

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
},{"crypto":false}],"/opt/working_dir/privatesky/modules/swarmutils/lib/uidGenerator.js":[function(require,module,exports){
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

},{"./Queue":"/opt/working_dir/privatesky/modules/swarmutils/lib/Queue.js","buffer":false,"crypto":false}],"/opt/working_dir/privatesky/modules/syndicate/lib/AbstractPool.js":[function(require,module,exports){
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

},{"./utils":"/opt/working_dir/privatesky/modules/syndicate/lib/utils.js","events":false,"timers":false,"util":false}],"/opt/working_dir/privatesky/modules/syndicate/lib/Pool-Isolates.js":[function(require,module,exports){
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

},{"./AbstractPool":"/opt/working_dir/privatesky/modules/syndicate/lib/AbstractPool.js","util":false}],"/opt/working_dir/privatesky/modules/syndicate/lib/Pool-Threads.js":[function(require,module,exports){
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

},{"./AbstractPool":"/opt/working_dir/privatesky/modules/syndicate/lib/AbstractPool.js","util":false}],"/opt/working_dir/privatesky/modules/syndicate/lib/PoolConfig.js":[function(require,module,exports){
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
},{"./WorkerStrategies":"/opt/working_dir/privatesky/modules/syndicate/lib/WorkerStrategies.js","os":false,"util":false}],"/opt/working_dir/privatesky/modules/syndicate/lib/QueueShim.js":[function(require,module,exports){
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

},{}],"/opt/working_dir/privatesky/modules/syndicate/lib/WorkerPool.js":[function(require,module,exports){

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

},{"./QueueShim.js":"/opt/working_dir/privatesky/modules/syndicate/lib/QueueShim.js","./utils":"/opt/working_dir/privatesky/modules/syndicate/lib/utils.js","swarmutils":"swarmutils"}],"/opt/working_dir/privatesky/modules/syndicate/lib/WorkerStrategies.js":[function(require,module,exports){
const WorkerStrategies = {
    THREADS: 'threads',
    ISOLATES: 'isolates'
};

module.exports = Object.freeze(WorkerStrategies);

},{}],"/opt/working_dir/privatesky/modules/syndicate/lib/utils.js":[function(require,module,exports){
function assert(condition, {ifFails}) {
    if (condition === false) {
        console.error(ifFails);
    }
}

module.exports = {
    assert
};

},{}],"adler32":[function(require,module,exports){

"use strict";

var algorithm = require('./lib/algorithm');
var Hash = require('./lib/Hash');
var register = require('./lib/register');

exports.sum = algorithm.sum.bind(algorithm);
exports.roll = algorithm.roll.bind(algorithm);
exports.Hash = Hash;
exports.register = register;

},{"./lib/Hash":"/opt/working_dir/privatesky/modules/adler32/lib/Hash.js","./lib/algorithm":"/opt/working_dir/privatesky/modules/adler32/lib/algorithm.js","./lib/register":"/opt/working_dir/privatesky/modules/adler32/lib/register.js"}],"bar-fs-adapter":[function(require,module,exports){
module.exports.createFsAdapter = () => {
    const FsAdapter = require("./lib/FsAdapter");
    return new FsAdapter();
};
},{"./lib/FsAdapter":"/opt/working_dir/privatesky/modules/bar-fs-adapter/lib/FsAdapter.js"}],"bar":[function(require,module,exports){

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

},{"./lib/Archive":"/opt/working_dir/privatesky/modules/bar/lib/Archive.js","./lib/ArchiveConfigurator":"/opt/working_dir/privatesky/modules/bar/lib/ArchiveConfigurator.js","./lib/Brick":"/opt/working_dir/privatesky/modules/bar/lib/Brick.js","./lib/FileBrickStorage":"/opt/working_dir/privatesky/modules/bar/lib/FileBrickStorage.js","./lib/FolderBarMap":"/opt/working_dir/privatesky/modules/bar/lib/FolderBarMap.js","./lib/FolderBrickStorage":"/opt/working_dir/privatesky/modules/bar/lib/FolderBrickStorage.js","./lib/Seed":"/opt/working_dir/privatesky/modules/bar/lib/Seed.js"}],"edfs-brick-storage":[function(require,module,exports){
module.exports.create = (endpoint) => {
    const EDFSBrickStorage = require("./EDFSBrickStorage");
    return new EDFSBrickStorage(endpoint)
};

},{"./EDFSBrickStorage":"/opt/working_dir/privatesky/modules/edfs-brick-storage/EDFSBrickStorage.js"}],"edfs-middleware":[function(require,module,exports){
module.exports.getEDFSMiddleware = () => require("./lib/EDFSMiddleware");
module.exports.createEDFSClient = (url) => {
    const EDFSClient = require("./lib/EDFSClient");
    return new EDFSClient(url);
};


},{"./lib/EDFSClient":"/opt/working_dir/privatesky/modules/edfs-middleware/lib/EDFSClient.js","./lib/EDFSMiddleware":"/opt/working_dir/privatesky/modules/edfs-middleware/lib/EDFSMiddleware.js"}],"edfs":[function(require,module,exports){
require("./brickTransportStrategies/brickTransportStrategiesRegistry");
const constants = require("./moduleConstants");

function generateUniqueStrategyName(prefix) {
    const randomPart = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    return prefix + "_" + randomPart;
}

const or = require("overwrite-require");
const browserContexts = [or.constants.SERVICE_WORKER_ENVIRONMENT_TYPE];
if (browserContexts.indexOf($$.environmentType) !== -1) {
    $$.brickTransportStrategiesRegistry.add("http", require("./brickTransportStrategies/FetchBrickTransportStrategy"));
}else{
    $$.brickTransportStrategiesRegistry.add("http", require("./brickTransportStrategies/HTTPBrickTransportStrategy"));
}

module.exports = {
    attachToEndpoint(endpoint) {
        const EDFS = require("./lib/EDFS");
        return new EDFS(endpoint);
    },
    attachWithSeed(compactSeed) {
        const SEED = require("bar").Seed;
        const seed = new SEED(compactSeed);
        return this.attachToEndpoint(seed.getEndpoint());
    },
    attachWithPin(pin, callback) {
        require("./seedCage").getSeed(pin, (err, seed) => {
            if (err) {
                return callback(err);
            }

            let edfs;
            try {
                edfs = this.attachWithSeed(seed);
            } catch (e) {
                return callback(e);
            }

            callback(undefined, edfs);
        });
    },
    checkForSeedCage(callback) {
        require("./seedCage").check(callback);
    },
    constants: constants
};
},{"./brickTransportStrategies/FetchBrickTransportStrategy":"/opt/working_dir/privatesky/modules/edfs/brickTransportStrategies/FetchBrickTransportStrategy.js","./brickTransportStrategies/HTTPBrickTransportStrategy":"/opt/working_dir/privatesky/modules/edfs/brickTransportStrategies/HTTPBrickTransportStrategy.js","./brickTransportStrategies/brickTransportStrategiesRegistry":"/opt/working_dir/privatesky/modules/edfs/brickTransportStrategies/brickTransportStrategiesRegistry.js","./lib/EDFS":"/opt/working_dir/privatesky/modules/edfs/lib/EDFS.js","./moduleConstants":"/opt/working_dir/privatesky/modules/edfs/moduleConstants.js","./seedCage":"/opt/working_dir/privatesky/modules/edfs/seedCage/index.js","bar":"bar","overwrite-require":"overwrite-require"}],"overwrite-require":[function(require,module,exports){
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
                    $$.err("Require encountered an error while loading ", request, "\nCause:\n", err.stack);
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

},{"./moduleConstants":"/opt/working_dir/privatesky/modules/overwrite-require/moduleConstants.js","./standardGlobalSymbols.js":"/opt/working_dir/privatesky/modules/overwrite-require/standardGlobalSymbols.js"}],"psk-http-client":[function(require,module,exports){
//to look nice the requireModule on Node
require("./lib/psk-abstract-client");
const or = require('overwrite-require');
if ($$.environmentType === or.constants.BROWSER_ENVIRONMENT_TYPE) {
	require("./lib/psk-browser-client");
} else {
	require("./lib/psk-node-client");
}
},{"./lib/psk-abstract-client":"/opt/working_dir/privatesky/modules/psk-http-client/lib/psk-abstract-client.js","./lib/psk-browser-client":"/opt/working_dir/privatesky/modules/psk-http-client/lib/psk-browser-client.js","./lib/psk-node-client":"/opt/working_dir/privatesky/modules/psk-http-client/lib/psk-node-client.js","overwrite-require":"overwrite-require"}],"psk-security-context":[function(require,module,exports){
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

},{"./lib/EncryptedSecret":"/opt/working_dir/privatesky/modules/psk-security-context/lib/EncryptedSecret.js","./lib/PSKSignature":"/opt/working_dir/privatesky/modules/psk-security-context/lib/PSKSignature.js","./lib/RawCSBSecurityContext":"/opt/working_dir/privatesky/modules/psk-security-context/lib/RawCSBSecurityContext.js","./lib/RootCSBSecurityContext":"/opt/working_dir/privatesky/modules/psk-security-context/lib/RootCSBSecurityContext.js","./lib/SecurityContext":"/opt/working_dir/privatesky/modules/psk-security-context/lib/SecurityContext.js"}],"pskcrypto":[function(require,module,exports){
const PskCrypto = require("./lib/PskCrypto");
const ssutil = require("./signsensusDS/ssutil");

module.exports = PskCrypto;

module.exports.hashValues = ssutil.hashValues;

module.exports.DuplexStream = require("./lib/utils/DuplexStream");

module.exports.isStream = require("./lib/utils/isStream");
},{"./lib/PskCrypto":"/opt/working_dir/privatesky/modules/pskcrypto/lib/PskCrypto.js","./lib/utils/DuplexStream":"/opt/working_dir/privatesky/modules/pskcrypto/lib/utils/DuplexStream.js","./lib/utils/isStream":"/opt/working_dir/privatesky/modules/pskcrypto/lib/utils/isStream.js","./signsensusDS/ssutil":"/opt/working_dir/privatesky/modules/pskcrypto/signsensusDS/ssutil.js"}],"swarm-engine/bootScripts/launcherBootScript":[function(require,module,exports){
//the first argument is a path to a configuration folder
const path = require('path');

process.on("uncaughtException", (err) => {
    console.log('err', err);
});

let seed;
if (process.argv.length >= 3) {
    seed = process.argv[2];
}
console.log(`Launcher is using ${seed} as SEED`);

function boot(){
    const BootEngine = require("./BootEngine");

    const bootter = new BootEngine(getSeed, getEDFS, initializeSwarmEngine, ["pskruntime.js", "virtualMQ.js", "edfsBar.js"], ["blockchain.js"]);
    $$.log("Launcher booting process started");
    bootter.boot(function(err, archive){
        if(err){
            console.log(err);
            return;
        }

        self.edfs.bootCSB(self.seed, (err, csb) => {
            if (err) {
                throw err;
            }

            launch(csb);
        })
    })
}

let self = {seed};

function getSeed(callback){
    setTimeout(() => {
        callback(undefined, self.seed);
    }, 0);
}


function getEDFS(callback){
    let EDFS = require("edfs");
    self.edfs = EDFS.attachWithSeed(self.seed);
    callback(undefined, self.edfs);
}

function initializeSwarmEngine(callback){
    dossier = require("dossier");
    /*const se = require("swarm-engine");
    se.initialise();*/
    callback();
}

let dossier;
boot();


/************************ HELPER METHODS ************************/

function launch(csb) {
    const beesHealer = require('swarmutils').beesHealer;

    const domains = {};

    dossier.load(csb.getSeed(), "launcherIdentity", function(err, dossierHandler){
        if(err){
            throw err;
        }
        dossierHandler.startTransaction("Domain", "getDomains").onReturn(function(err, domainsRefs){
            if(err){
                throw err;
            }

            domainsRefs.forEach(domainRef => {
                launchDomain(domainRef.alias, domainRef);
            });

            if (domains.length === 0) {
                console.log(`\n[::] No domains were deployed.\n`);
            }
        });
    });

    function launchDomain(name, configuration) {
        if (!domains.hasOwnProperty(name)) {
            console.log(`Launcher is starting booting process for domain <${name}>`);
            const env = {config: configuration};
            const child_env = JSON.parse(JSON.stringify(process.env));

            child_env.PRIVATESKY_TMP = process.env.PRIVATESKY_TMP;
            child_env.PSK_DOMAIN_SEED = env.config.constitution;

            child_env.config = JSON.stringify({
                workspace: env.config.workspace
            });

            Object.keys(process.env).forEach(envVar => {
                if (envVar && envVar.startsWith && envVar.startsWith('PSK')) {
                    child_env[envVar] = process.env[envVar];
                }
            });

            const swarmutils = require('swarmutils');
            const child = swarmutils.pingPongFork.fork(path.resolve(path.join(process.env.PSK_ROOT_INSTALATION_FOLDER, 'psknode/bundles/domainBoot.js')), [name], {
                cwd: process.env.PSK_ROOT_INSTALATION_FOLDER,
                env: child_env
            });

            child.on('exit', (code, signal) => {
                setTimeout(() => {
                    console.log(`DomainSandbox [${name}] got an error code ${code}. Restarting...`);
                    delete domains[name];
                    $$.event('status.domains.restart', {name: name});
                    launchDomain(name, configuration);
                }, 100);
            });

            domains[name] = child;
        } else {
            console.log('Trying to start a sandbox for a domain that already has a sandbox');
        }
    }
}

},{"./BootEngine":"/opt/working_dir/privatesky/modules/swarm-engine/bootScripts/BootEngine.js","dossier":false,"edfs":"edfs","path":false,"swarmutils":"swarmutils"}],"swarmutils":[function(require,module,exports){
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

},{"./lib/Combos":"/opt/working_dir/privatesky/modules/swarmutils/lib/Combos.js","./lib/OwM":"/opt/working_dir/privatesky/modules/swarmutils/lib/OwM.js","./lib/Queue":"/opt/working_dir/privatesky/modules/swarmutils/lib/Queue.js","./lib/SwarmPacker":"/opt/working_dir/privatesky/modules/swarmutils/lib/SwarmPacker.js","./lib/TaskCounter":"/opt/working_dir/privatesky/modules/swarmutils/lib/TaskCounter.js","./lib/beesHealer":"/opt/working_dir/privatesky/modules/swarmutils/lib/beesHealer.js","./lib/pingpongFork":"/opt/working_dir/privatesky/modules/swarmutils/lib/pingpongFork.js","./lib/pskconsole":"/opt/working_dir/privatesky/modules/swarmutils/lib/pskconsole.js","./lib/safe-uuid":"/opt/working_dir/privatesky/modules/swarmutils/lib/safe-uuid.js","./lib/uidGenerator":"/opt/working_dir/privatesky/modules/swarmutils/lib/uidGenerator.js"}],"syndicate":[function(require,module,exports){
const fs = require('fs');
const path = require('path');
const PoolConfig = require('./lib/PoolConfig');
const WorkerPool = require('./lib/WorkerPool');
const WorkerStrategies = require('./lib/WorkerStrategies');

/**
 * @throws if config is invalid, if config tries to set properties to undefined or add new properties (check PoolConfig to see solutions)
 * @throws if providing a working dir that does not exist, the directory should be created externally
 * @throws if trying to use a strategy that does not exist
 */
function createWorkerPool(poolConfig, workerCreateHelper) {
    const newPoolConfig = PoolConfig.createByOverwritingDefaults(poolConfig);

    if (newPoolConfig.workerOptions && newPoolConfig.workerOptions.cwd && !fs.existsSync(newPoolConfig.workerOptions.cwd)) {
        throw new Error(`The provided working directory does not exists ${config.workingDir}`);
    }

    let concretePool = null;

    if (newPoolConfig.workerStrategy === WorkerStrategies.THREADS) {
        const PoolThreads = require('./lib/Pool-Threads');

        concretePool = new PoolThreads(newPoolConfig, workerCreateHelper);
    } else if (newPoolConfig.workerStrategy === WorkerStrategies.ISOLATES) {
        const PoolIsolates = require('./lib/Pool-Isolates');

        concretePool = new PoolIsolates(newPoolConfig, workerCreateHelper)
    } else {
        throw new TypeError(`Could not find a implementation for worker strategy "${newPoolConfig.workerStrategy}"`);
    }

    return new WorkerPool(concretePool);
}


module.exports = {
    createWorkerPool,
    PoolConfig,
    WorkerStrategies
};

},{"./lib/Pool-Isolates":"/opt/working_dir/privatesky/modules/syndicate/lib/Pool-Isolates.js","./lib/Pool-Threads":"/opt/working_dir/privatesky/modules/syndicate/lib/Pool-Threads.js","./lib/PoolConfig":"/opt/working_dir/privatesky/modules/syndicate/lib/PoolConfig.js","./lib/WorkerPool":"/opt/working_dir/privatesky/modules/syndicate/lib/WorkerPool.js","./lib/WorkerStrategies":"/opt/working_dir/privatesky/modules/syndicate/lib/WorkerStrategies.js","fs":false,"path":false}],"zmq_adapter":[function(require,module,exports){
(function (Buffer){
const defaultForwardAddress = process.env.vmq_zeromq_forward_address || "tcp://127.0.0.1:5001";
const defaultSubAddress = process.env.vmq_zeromq_sub_address || "tcp://127.0.0.1:5000";
const defaultPubAddress = process.env.vmq_zeromq_pub_address || "tcp://127.0.0.1:5001";

const zeroMQModuleName = "zeromq";
let zmq = require(zeroMQModuleName);

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
module.exports.getForwarderInstance = function(address){
    if(!instance){
        address = address || defaultForwardAddress;
        instance = new ZeromqForwarder(address);
    }
    return instance;
};

module.exports.createZeromqProxyNode = function(subAddress, pubAddress, signatureChecker){
    subAddress = subAddress || defaultSubAddress;
    pubAddress = pubAddress || defaultPubAddress;
    return new ZeromqProxyNode(subAddress, pubAddress, signatureChecker);
};

module.exports.createZeromqConsumer = function(bindAddress, monitorFunction){
    return new ZeromqConsumer(bindAddress, monitorFunction);
};

module.exports.registerKiller = registerKiller;
}).call(this,require("buffer").Buffer)

},{"buffer":false,"swarmutils":"swarmutils"}]},{},["/opt/working_dir/privatesky/builds/tmp/launcherBoot.js"])