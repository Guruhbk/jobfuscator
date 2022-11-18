var JavaScriptObfuscator = require('javascript-obfuscator');
var glob = require("glob");
var path = require('path');
var fs = require('fs');

const argv = (args, key) => {
    try {
        // Return true if the key exists and a value is defined
        if (args.includes(`--${ key }`)) return true;

        const value = args.find(element => element.startsWith(`--${ key }=`));

        // Return null if the key does not exist and a value is not defined
        if (!value) return null;

        return value.replace(`--${ key }=`, '');
    } catch (e) {
        console.log(e)
    }
}

const obfiscator = (args) => {
    try {
        let inputFolder = argv(args, 'i');
        inputFolder = inputFolder.split('\\\\').join('/').split('\\').join('/');
        let outputFolder = argv(args, 'o');
        outputFolder = outputFolder.split('\\\\').join('/').split('\\').join('/');

        return jsObfiscator(inputFolder, outputFolder);
    } catch (e) {
        console.log(e)
    }
};

const jsObfiscator = (inputFolder, outputFolder) => {
    glob(`${inputFolder}/**/*.js`, function (err, files) {
        if (err) {
            throw new Error(err.message);
        }
        files.map(file => {
            let fsFile = file.split(inputFolder)[1];
            let filePath = path.dirname(fsFile);

            fs.readFile(file, 'utf8', function (err, data) {
                if (err) {
                    throw new Error(err.message);
                }
                var obfuscationResult = JavaScriptObfuscator.obfuscate(
                    data, {
                        compact: true,
                        controlFlowFlattening: false,
                        deadCodeInjection: false,
                        debugProtection: false,
                        debugProtectionInterval: 0,
                        disableConsoleOutput: false,
                        identifierNamesGenerator: 'hexadecimal',
                        log: false,
                        numbersToExpressions: false,
                        renameGlobals: false,
                        selfDefending: false,
                        simplify: true,
                        splitStrings: false,
                        stringArray: true,
                        stringArrayCallsTransform: false,
                        stringArrayCallsTransformThreshold: 0.5,
                        stringArrayEncoding: [],
                        stringArrayIndexShift: true,
                        stringArrayRotate: true,
                        stringArrayShuffle: true,
                        stringArrayWrappersCount: 1,
                        stringArrayWrappersChainedCalls: true,
                        stringArrayWrappersParametersMaxCount: 2,
                        stringArrayWrappersType: 'variable',
                        stringArrayThreshold: 0.75,
                        unicodeEscapeSequence: false
                    }
                );
                if (!fs.existsSync(outputFolder + filePath)) {
                    fs.mkdirSync(outputFolder + filePath, {
                        recursive: true
                    }, (err) => {
                        throw new Error(err.message);
                    });
                }
                fs.writeFile(outputFolder + fsFile, obfuscationResult.getObfuscatedCode(), (err) => {
                    if (err) {
                        throw new Error(err.message);
                    }
                });
            });
        });
    });
}

module.exports.obfiscator = obfiscator;
module.exports.jsObfiscator = jsObfiscator;