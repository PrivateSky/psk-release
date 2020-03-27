const path = require("path");

require(path.join(__dirname, "../psknode/bundles/testsRuntime"));
require(path.join(__dirname, "../psknode/bundles/pskruntime"));

let config = {testDirs: [process.cwd()]};
const {testRunner, assert} = require("double-check");
assert.begin(undefined, undefined, 10000000);

testRunner.start(config, callback);

function callback(error, result) {
    let exitCode = 0;
    if (error) {
        console.error(error);
        exitCode = 1;
    } else {
        if (!result) {
            console.log("Report and results are above, please check console!");
        } else {
            console.log("Finished!");
            if (result.failed > 0) {
                console.log("Setting exit code 1 because we have failed tests.");
                exitCode = 1;
            }
        }
    }
    process.exit(exitCode);
}