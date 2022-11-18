#!/usr/bin/env node

const {obfiscator} = require('../lib/jobfuscator')

obfiscator(process.argv);
console.log("Code obfuscator successfully");