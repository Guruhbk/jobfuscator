var JavaScriptObfuscator = require('javascript-obfuscator');
var glob = require("glob");
var path = require('path');
var fs = require('fs');

const argv = key => {
    try{
    // Return true if the key exists and a value is defined
    if ( process.argv.includes( `--${ key }` ) ) return true;
  
    const value = process.argv.find( element => element.startsWith( `--${ key }=` ) );
  
    // Return null if the key does not exist and a value is not defined
    if ( !value ) return null;
    
    return value.replace( `--${ key }=` , '' );
    }catch(e){
        console.log(e)
    }
  }

const obfiscator = (args) => {
    const inputFolder = argv(args['i']);
    const outputFolder = argv(args['o']);
  
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
                    }, (err) => {});
                }
                fs.writeFile(outputFolder + fsFile, obfuscationResult.getObfuscatedCode(), (err) => {
                    if (err) {
                        throw new Error(err.message);
                    }
                });
            });
        });
    });
};

module.exports.obfiscator = obfiscator;