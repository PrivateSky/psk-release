const path = require("path");

require(path.join(__dirname, "../psknode/bundles/testsRuntime"));
require(path.join(__dirname, "../psknode/bundles/pskruntime"));

let config = {testDirs: [process.cwd()]};
const {testRunner, assert} = require("double-check");
assert.begin(undefined, undefined, 10000000);
//assert.end(undefined, 1, true);

testRunner.start(config, callback);

function callback(error, result) {
    if(error) {
        console.error(error);
    } else {
        if(!result){
            console.log("Report and results are above, please check console!");
        }else{
            console.log("Finished!");
        }
        process.exit(0);
    }
}