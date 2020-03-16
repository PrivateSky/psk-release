consoleToolsRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/opt/working_dir/privatesky/builds/tmp/consoleTools_intermediar.js":[function(require,module,exports){
(function (global){
global.consoleToolsLoadModules = function(){ 

	if(typeof $$.__runtimeModules["pskwallet"] === "undefined"){
		$$.__runtimeModules["pskwallet"] = require("pskwallet");
	}

	if(typeof $$.__runtimeModules["buffer-crc32"] === "undefined"){
		$$.__runtimeModules["buffer-crc32"] = require("buffer-crc32");
	}

	if(typeof $$.__runtimeModules["node-fd-slicer"] === "undefined"){
		$$.__runtimeModules["node-fd-slicer"] = require("node-fd-slicer");
	}

	if(typeof $$.__runtimeModules["csb-wizard"] === "undefined"){
		$$.__runtimeModules["csb-wizard"] = require("csb-wizard");
	}
}
if (false) {
	consoleToolsLoadModules();
}; 
global.consoleToolsRequire = require;
if (typeof $$ !== "undefined") {            
    $$.requireBundle("consoleTools");
    };
    
    
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"buffer-crc32":"buffer-crc32","csb-wizard":"csb-wizard","node-fd-slicer":"node-fd-slicer","pskwallet":"pskwallet"}],"/opt/working_dir/privatesky/modules/csb-wizard/CSBWizard.js":[function(require,module,exports){
(function (__dirname){
const path = require('path');
const fs = require('fs');
const VirtualMQ = require('virtualmq');
const httpWrapper = VirtualMQ.getHttpWrapper();
const httpUtils = httpWrapper.httpUtils;
const Server = httpWrapper.Server;
const crypto = require('pskcrypto');
const interact = require('interact');
const serverCommands = require('./utils/serverCommands');
const executioner = require('./utils/executioner');
const url = require('url');

function CSBWizard({listeningPort, rootFolder, sslConfig}, callback) {
	const port = listeningPort || 8081;
	const server = new Server(sslConfig).listen(port);
	const randSize = 32;
	rootFolder = path.join(rootFolder, 'CSB_TMP');

	console.log("Listening on port:", port);

	fs.mkdir(rootFolder, {recursive: true}, (err) => {
		if(err) {
			throw err;
		}

		console.log("Local folder:", rootFolder);
		registerEndpoints();
		if(typeof callback === 'function') {
			return callback();
		}
	});

	function registerEndpoints() {
		server.use((req, res, next) => {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
			res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Origin');
			res.setHeader('Access-Control-Allow-Credentials', true);
			next();
		});

		server.post('/beginCSB', (req, res) => {
			const transactionId = crypto.randomBytes(randSize).toString('hex');
			fs.mkdir(path.join(rootFolder, transactionId), {recursive: true}, (err) => {
				if (err) {
					res.statusCode = 500;
					res.end();
					return;
				}

				res.end(transactionId);
			});
		});

		server.post('/attachFile', (req, res) => {
			res.statusCode = 400;
			res.end('Illegal url, missing transaction id');
		});

		server.post('/attachFile/:transactionId/:fileAlias', (req, res) => {
			const transactionId = req.params.transactionId;
			const fileObj = {
				fileName: req.params.fileAlias,
				stream: req
			};

			serverCommands.attachFile(path.join(rootFolder, transactionId), fileObj, (err) => {
				if(err) {
					if(err.code === 'EEXIST') {
						res.statusCode = 409;
					} else {
						res.statusCode = 500;
					}
				}

				res.end();
			});
		});

		server.post('/addBackup', (req, res) => {
			res.statusCode = 400;
			res.end('Illegal url, missing transaction id');
		});

		server.post('/addBackup/:transactionId', httpUtils.bodyParser);

		server.post('/addBackup/:transactionId', (req, res) => {
			const transactionId = req.params.transactionId;

			const backupObj = {
				endpoint: req.body
			};

			serverCommands.addBackup(path.join(rootFolder, transactionId), backupObj, (err) => {
				if(err) {
					res.statusCode = 500;
				}

				res.end();
			});
		});

		server.post('/buildCSB', (req, res) => {
			res.statusCode = 400;
			res.end('Illegal url, missing transaction id');
		});
		server.post('/buildCSB/:transactionId', httpUtils.bodyParser);
		server.post('/buildCSB/:transactionId', (req, res) => {
			const transactionId = req.params.transactionId;
			executioner.executioner(path.join(rootFolder, transactionId), (err, seed) => {
				if(err) {
					res.statusCode = 500;
					console.log("Error", err);
					res.end();
					return;
				}

				const body = JSON.parse(req.body);

				if(body.url !== '' && body.channel !== '') {
					const endpoint = new url.URL(body.url).origin;
					const channel = body.channel;
					const ris = interact.createRemoteInteractionSpace('remote', endpoint, channel);
					ris.startSwarm('notifier', 'init', seed.toString());
				}

				res.end(seed.toString());

			});
		});

		server.use('/web', (req, res) => {
			res.statusCode = 303;
			let redirectLocation = 'index.html';

			if(!req.url.endsWith('/')) {
				redirectLocation = '/web/' + redirectLocation;
			}

			res.setHeader("Location", redirectLocation);
			res.end();
		});

		server.use('/web/*', httpUtils.serveStaticFile(path.join(__dirname, 'web'), '/web'));

		server.use((req, res) => {
			res.statusCode = 404;
			res.end();
		});
	}
}

module.exports = CSBWizard;

}).call(this,"/modules/csb-wizard")

},{"./utils/executioner":"/opt/working_dir/privatesky/modules/csb-wizard/utils/executioner.js","./utils/serverCommands":"/opt/working_dir/privatesky/modules/csb-wizard/utils/serverCommands.js","fs":false,"interact":false,"path":false,"pskcrypto":false,"url":false,"virtualmq":false}],"/opt/working_dir/privatesky/modules/csb-wizard/utils/CommandsAssistant.js":[function(require,module,exports){
const fs = require('fs');
const path = require('path');

function CommandsAssistant(localFolder) {

	const filePath = path.join(localFolder, 'commands.json');

	function loadCommands(callback) {
		fs.mkdir(localFolder, {recursive: true}, (err) => {
			if (err) {
				return callback(err);
			}

			fs.readFile(filePath, (err, commands) => {
				if (err) {
					return callback(undefined, []);
				}

				callback(undefined, JSON.parse(commands.toString()));
			});
		});
	}

	function saveCommands(commandsArr, callback) {
		fs.mkdir(localFolder, {recursive: true}, (err) => {
			if (err) {
				return callback(err);
			}

			fs.writeFile(filePath, JSON.stringify(commandsArr), callback);
		});
	}

	function addCommand(command, callback) {
		loadCommands((err, commandsArr) => {
			if (err) {
				return callback(err);
			}

			commandsArr.push(command);

			saveCommands(commandsArr, callback);
		});
	}

	return {
		addCommand,
		loadCommands
	};
}

module.exports = CommandsAssistant;

},{"fs":false,"path":false}],"/opt/working_dir/privatesky/modules/csb-wizard/utils/csbInteractions.js":[function(require,module,exports){
const path = require('path');
const is = require("interact").createInteractionSpace();


function createCSB(workingDir, backups, callback) {
    let savedSeed;
    is.startSwarm("createCsb", "withoutPin", "", backups, workingDir, undefined, false).on({
        printSensitiveInfo: function (seed, defaultPin) {
            savedSeed = seed;
        },
        handleError: function (err) {
            callback(err);
        },
        __return__: function () {
            callback(undefined, savedSeed);
        }
    });
}

function attachFile(workingDir, fileName, seed, callback) {
    is.startSwarm("attachFile", "withCSBIdentifier", seed, fileName, path.join(workingDir, fileName), workingDir).on({
        handleError: function (err) {
            callback(err);
        },

        __return__: function () {
            callback();
        }
    });
}

function saveBackup(workingDir, seed, callback) {
    is.startSwarm("saveBackup", "withCSBIdentifier", seed, workingDir).on({
        handleError: function (err) {
            callback(err);
        },

        csbBackupReport: function (result) {
            callback(result.errors, result.successes);
        }
    });
}

module.exports = {
    attachFile,
    createCSB,
    saveBackup
};

},{"interact":false,"path":false}],"/opt/working_dir/privatesky/modules/csb-wizard/utils/executioner.js":[function(require,module,exports){
const csbInteraction = require('./csbInteractions');
const CommandsAssistant = require('./CommandsAssistant');

function executioner(workingDir, callback) {
    const filteredCommands = [];
    const backups = [];

    const commandsAssistant = new CommandsAssistant(workingDir);
    commandsAssistant.loadCommands((err, commands) => {
        if (err) {
            console.log();
        }
        for (let i = 0; i < commands.length; ++i) {
            if (commands[i].name === 'addBackup') {
                backups.push(commands[i].params.endpoint);
                continue;
            }

            filteredCommands.push(commands[i]);
        }


        csbInteraction.createCSB(workingDir, backups, (err, seed) => {
            if (err) {
                return callback(err);
            }

            executeCommand(filteredCommands, seed, workingDir, 0, (err) => {
                if (err) {
                    return callback(err);
                }

                csbInteraction.saveBackup(workingDir, seed, (errors, successes) => {
                    if (errors) {
                        return callback(errors);
                    }

                    callback(undefined, seed);
                });
            });
        });
    });
}

function executeCommand(commands, seed, workingDir, index = 0, callback) {
    if (index === commands.length) {
        return callback();
    }

    const match = judge(commands[index], seed, workingDir, (err) => {
        if (err) {
            return callback(err);
        }

        executeCommand(commands, seed, workingDir, ++index, callback);
    });

    if (!match) {
        return callback(new Error('No match for command found' + commands[index].name));
    }
}

function judge(command, seed, workingDir, callback) {
    switch (command.name) {
        case 'attachFile':
            csbInteraction.attachFile(workingDir, command.params.fileName, seed, callback);
            break;
        default:
            return false;
    }

    return true;
}

module.exports = {
    executioner
};

},{"./CommandsAssistant":"/opt/working_dir/privatesky/modules/csb-wizard/utils/CommandsAssistant.js","./csbInteractions":"/opt/working_dir/privatesky/modules/csb-wizard/utils/csbInteractions.js"}],"/opt/working_dir/privatesky/modules/csb-wizard/utils/serverCommands.js":[function(require,module,exports){
const fs = require("fs");
const path = require("path");
const url = require('url');

const CommandsAssistant = require("./CommandsAssistant");

function attachFile(workingDir, FileObj, callback) {
	const cmd = {
		name: 'attachFile',
		params: {
			fileName: FileObj.fileName
		}
	};

	const commandsAssistant = new CommandsAssistant(workingDir);
	const filePath = path.join(workingDir, FileObj.fileName);
	fs.access(filePath, (err) => {
		if (!err) {
			const e = new Error('File already exists');
			e.code = 'EEXIST';
			return callback(e);
		}

		const file = fs.createWriteStream(filePath);

		file.on('close', () => {
			commandsAssistant.addCommand(cmd, callback);
		});

		FileObj.stream.pipe(file);
	});
}

function addBackup(workingDir, backupObj, callback) {
	try {
		const endpoint = new url.URL(backupObj.endpoint).origin;

		const cmd = {
			name: 'addBackup',
			params: {
				endpoint: endpoint
			}
		};

		const commandAssistant = new CommandsAssistant(workingDir);
		commandAssistant.addCommand(cmd, callback);
	} catch (e) {
		return callback(e);
	}
}

module.exports = {
	attachFile,
	addBackup
};

},{"./CommandsAssistant":"/opt/working_dir/privatesky/modules/csb-wizard/utils/CommandsAssistant.js","fs":false,"path":false,"url":false}],"/opt/working_dir/privatesky/modules/node-fd-slicer/modules/node-pend/index.js":[function(require,module,exports){
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

},{}],"/opt/working_dir/privatesky/modules/pskwallet/cmds/bar.js":[function(require,module,exports){
const utils = require("../utils/utils");

function listFiles(alseed, folderPath) {
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
            utils.loadArchiveWithAlias(alseed, (err, bar) => {
                if (err) {
                    throw err;
                }

                bar.listFiles(folderPath, (err, fileList) => {
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

                const bar = edfs.loadBar(alseed);
                bar.listFiles(folderPath, (err, fileList) => {
                    if (err) {
                        throw err;
                    }

                    console.log("Files:", fileList);
                });
            });
        }
    }
}

function extractFolder(alseed, barPath, fsFolderPath) {
    if (utils.isAlias(alseed)) {
        utils.loadArchiveWithAlias(alseed, (err, bar) => {
            if (err) {
                throw err;
            }

            bar.extractFolder(fsFolderPath, barPath, (err) => {
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

            const bar = edfs.loadBar(alseed);
            bar.extractFolder(fsFolderPath, barPath, (err) => {
                if (err) {
                    throw err;
                }

                console.log("Extracted folder.");
            });
        });
    }
}

function extractFile(alseed, barPath, fsFilePath) {
    if (utils.isAlias(alseed)) {
        utils.loadArchiveWithAlias(alseed, (err, bar) => {
            if (err) {
                throw err;
            }

            bar.extractFile(fsFilePath, barPath, (err) => {
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

            const bar = edfs.loadBar(alseed);
            bar.extractFile(fsFilePath, barPath, (err) => {
                if (err) {
                    throw err;
                }

                console.log("Extracted file.");
            });
        });
    }
}

addCommand("list", "files", listFiles, " <archiveSeed>/<alias> <folderPath> \t\t\t\t |prints the list of all files stored at path <folderPath> inside the archive whose SEED is <archiveSeed>. If an alias is specified then the CSB's SEED is searched from the wallet.");
addCommand("extract", "folder", extractFolder, " <archiveSeed> <archivePath> <fsFolderPath> \t\t |extracts the folder stored at <archivePath> inside the archive whose SEED is <archiveSeed> and writes all the extracted file on disk at path <fsFolderPath>");
addCommand("extract", "file", extractFile, " <archiveSeed> <archivePath> <fsFilePath> \t\t |extracts the folder stored at <archivePath> inside the archive whose SEED is <archiveSeed> and writes all the extracted file on disk at path <fsFilePath>");


},{"../utils/utils":"/opt/working_dir/privatesky/modules/pskwallet/utils/utils.js"}],"/opt/working_dir/privatesky/modules/pskwallet/cmds/csb.js":[function(require,module,exports){
const utils = require("../utils/utils");
const AGENT_IDENTITY = require("../utils/utils").getOwnIdentity();

function createCSB(domainName, constitutionPath, noSave) {
    const pth = "path";
    const path = require(pth);
    const EDFS = require("edfs");

    if (noSave === "nosave") {
        const edfs = utils.getInitializedEDFS();
        edfs.createBarWithConstitution(path.resolve(constitutionPath), (err, archive) => {
            if (err) {
                throw err;
            }

            archive.writeFile(EDFS.constants.CSB.DOMAIN_IDENTITY_FILE, domainName, () => {
                if (err) {
                    throw err;
                }
                console.log("The CSB was created. Its SEED is the following.");
                console.log("SEED", archive.getSeed());
            });
        });
    } else {
        getPin((err, pin) => {
            if (err) {
                throw err;
            }

            EDFS.attachWithPin(pin, (err, edfs) => {
                if (err) {
                    throw err;
                }

                edfs.loadWallet(undefined, pin, true, (err, wallet) => {
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
                            edfs.createBarWithConstitution(path.resolve(constitutionPath), (err, archive) => {
                                if (err) {
                                    throw err;
                                }

                                csb.startTransaction("StandardCSBTransactions", "addFileAnchor", domainName, "csb", archive.getSeed(), wallet.getMapDigest()).onReturn((err, res) => {
                                    if (err) {
                                        console.error(err);
                                        process.exit(1);
                                    }

                                    console.log("The CSB was created and a reference to it has been added to the wallet.");
                                    console.log("Its SEED is:", archive.getSeed());
                                    process.exit(0);
                                });

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

            const bar = edfs.loadBar(alseed);
            bar.addFolder(appPath, EDFS.constants.CSB.APP_FOLDER, (err) => {
                if (err) {
                    throw err;
                }

                console.log('All done');
            })
        });
    }
}

addCommand("create", "csb", createCSB, "<domainName> <constitutionPath> <nosave>\t\t\t\t |creates an archive containing constitutions folder <constitutionPath> for Domain <domainName>");
addCommand("set", "app", setApp, " <seed>/<alias> <folderPath> \t\t\t\t\t |add an app to an existing archive");

},{"../utils/utils":"/opt/working_dir/privatesky/modules/pskwallet/utils/utils.js","dossier":false,"edfs":false}],"/opt/working_dir/privatesky/modules/pskwallet/cmds/index.js":[function(require,module,exports){
require("./wallet");
require("./bar");
require("./csb");

},{"./bar":"/opt/working_dir/privatesky/modules/pskwallet/cmds/bar.js","./csb":"/opt/working_dir/privatesky/modules/pskwallet/cmds/csb.js","./wallet":"/opt/working_dir/privatesky/modules/pskwallet/cmds/wallet.js"}],"/opt/working_dir/privatesky/modules/pskwallet/cmds/wallet.js":[function(require,module,exports){
const consoleUtils = require("../utils/consoleUtils");
const utils = require("../utils/utils");

function createWallet(templateSeed) {
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
        consoleUtils.insertPassword({validationFunction: utils.validatePin}, (err, pin) => {
            if (err) {
                console.log(`Caught error: ${err.message}`);
                process.exit(1);
            }

            consoleUtils.insertPassword({
                prompt: "Confirm pin:",
                validationFunction: utils.validatePin
            }, (err, newPin) => {
                if (err) {
                    console.log(`Caught error: ${err.message}`);
                    process.exit(1);
                }

                if (pin !== newPin) {
                    console.log("The PINs do not coincide. Try again.");
                    __createWallet(edfs, overwrite);
                } else {
                    edfs.createWallet(templateSeed, pin, overwrite, (err, seed) => {
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
    const EDFS = require("edfs");
    let edfs;
    try {
        edfs = EDFS.attachWithSeed(seed);
    } catch (e) {
        throw Error("The provided seed is invalid.");
    }

    __saveSeed();

    function __saveSeed() {
        consoleUtils.insertPassword({validationFunction: utils.validatePin}, (err, pin) => {
            if (err) {
                console.log(`Caught error: ${err.message}`);
                process.exit(1);
            }

            consoleUtils.insertPassword({
                prompt: "Confirm pin:",
                validationFunction: utils.validatePin
            }, (err, newPin) => {
                if (err) {
                    console.log(`Caught error: ${err.message}`);
                    process.exit(1);
                }

                if (pin !== newPin) {
                    console.log("The PINs do not coincide. Try again.");
                    __saveSeed();
                } else {
                    edfs.loadWallet(seed, pin, true, (err, wallet) => {
                        if (err) {
                            throw err;
                        }

                        console.log("Wallet was restored");
                    });
                }
            });
        });
    }
}

function changePin() {
    utils.loadWallet(undefined, (err, wallet) => {
        if (err) {
            throw err;
        }

        consoleUtils.insertPassword({prompt: "Insert a new PIN:", validationFunction: utils.validatePin}, (err, pin) => {
            if (err) {
                throw err;
            }

            utils.getEDFS(wallet.getSeed(), (err, edfs) => {
                if (err) {
                    throw err;
                }

                edfs.loadWallet(wallet.getSeed(), pin, true, (err) => {
                    if (err) {
                        throw err;
                    }

                    console.log("The PIN has been changed.");
                });
            });
        });
    });
}

addCommand("create", "wallet", createWallet, "<templateSeed> \t\t\t\t\t\t |creates a clone of the CSB whose SEED is <templateSeed>");
addCommand("restore", null, restore, "<seed> \t\t\t\t |Checks the seed is valid and allows the selection of a PIN");
addCommand("change", "pin", changePin, "\t\t\t\t |Asks for the PIN and then allows for the selection of a new PIN");

},{"../utils/consoleUtils":"/opt/working_dir/privatesky/modules/pskwallet/utils/consoleUtils.js","../utils/utils":"/opt/working_dir/privatesky/modules/pskwallet/utils/utils.js","bar":false,"edfs":false}],"/opt/working_dir/privatesky/modules/pskwallet/utils/consoleUtils.js":[function(require,module,exports){
const rl = "readline";
const readline = require(rl);
const getPassword = require("./getPassword").readPassword;

const NO_TRIES = 3;
const DEFAULT_PROMPT = "Insert pin:";

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
        return callback(new Error(`You have inserted an invalid pin ${NO_TRIES} times`));
    } else {
        getPassword(options.prompt,  (err, pin)=> {
            if (options.validationFunction && !options.validationFunction(pin)) {
                if (options.noTries !== 1) {
                    console.log("Validation failed. Maybe you have inserted an invalid character.");
                    console.log("Try again");
                }
                options.noTries--;
                insertPassword(options, callback);
            } else {
                return callback(null, pin);
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
},{"./getPassword":"/opt/working_dir/privatesky/modules/pskwallet/utils/getPassword.js"}],"/opt/working_dir/privatesky/modules/pskwallet/utils/getPassword.js":[function(require,module,exports){
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
},{}],"/opt/working_dir/privatesky/modules/pskwallet/utils/utils.js":[function(require,module,exports){
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

function validatePin(pin) {
    if (typeof pin === "undefined" || pin.length < 4) {
        return false;
    }

    //The regex below checks that the pin only contains utf-8 characters
    return !/[\x00-\x03]|[\x05-\x07]|[\x09]|[\x0B-\x0C]|[\x0E-\x1F]/.test(pin);
}

function getEDFS(seed, callback) {
    const EDFS = require("edfs");
    if (!seed) {
        getPin((err, pin) => {
            if (err) {
                return callback(err);
            }

            EDFS.attachWithPin(pin, callback);
        });

    } else {
        callback(undefined, EDFS.attachWithSeed(seed));
    }
}

function loadWallet(walletSeed, callback) {
    getEDFS(walletSeed, (err, edfs) => {
        if (err) {
            return callback(err);
        }


        getPin((err, pin) => {
            if (err) {
                return callback(err);
            }

            edfs.loadWallet(walletSeed, pin, true, callback);
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

                    callback(undefined, edfs.loadBar(seed));
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

let lastPin;
let timeStamp;
const PIN_LIFETIME = 5000;
global.getPin = function (callback) {
    const currentTimestamp = new Date().getTime();
    if (!lastPin || (currentTimestamp - timeStamp) > PIN_LIFETIME) {
        consoleUtils.insertPassword({validationFunction: validatePin}, (err, pin) => {
            if (err) {
                return callback(err);
            }

            lastPin = pin;
            timeStamp = new Date().getTime();
            callback(undefined, pin);
        });
    } else {
        callback(undefined, lastPin);
    }
};

module.exports = {
    getInitializedEDFS,
    validatePin,
    isAlias,
    loadWallet,
    getEDFS,
    getOwnIdentity,
    loadArchiveWithAlias
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./consoleUtils":"/opt/working_dir/privatesky/modules/pskwallet/utils/consoleUtils.js","bar":false,"dossier":false,"edfs":false}],"buffer-crc32":[function(require,module,exports){
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

},{"buffer":false}],"csb-wizard":[function(require,module,exports){
module.exports = require('./CSBWizard');

},{"./CSBWizard":"/opt/working_dir/privatesky/modules/csb-wizard/CSBWizard.js"}],"node-fd-slicer":[function(require,module,exports){
(function (Buffer,setImmediate){
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

}).call(this,require("buffer").Buffer,require("timers").setImmediate)

},{"./modules/node-pend":"/opt/working_dir/privatesky/modules/node-fd-slicer/modules/node-pend/index.js","buffer":false,"events":false,"fs":false,"stream":false,"timers":false,"util":false}],"pskwallet":[function(require,module,exports){
(function (__dirname){
const pskConsole = require('swarmutils').createPskConsole();
const pathModule = "path";
const path = require(pathModule);
process.env.PSK_ROOT_INSTALATION_FOLDER = path.resolve("." + __dirname + "/../..");
require("./cmds");
pskConsole.runCommand();

}).call(this,"/modules/pskwallet")

},{"./cmds":"/opt/working_dir/privatesky/modules/pskwallet/cmds/index.js","swarmutils":false}]},{},["/opt/working_dir/privatesky/builds/tmp/consoleTools_intermediar.js"])