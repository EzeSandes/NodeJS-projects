#!/usr/bin/env node
import minimist from 'minimist';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import getStdin from 'get-stdin';

const args = minimist(process.argv.slice(2), {
  boolean: ['help', 'in'],
  string: ['file'],
  alias: {
    h: 'help',
    i: 'in',
  },
  default: {},
});

/* ////////////////////////////// GLOBAL VARIABLES */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_PATH = path.resolve(process.env.BASEPATH || __dirname);

/* ////////////////////////////// MAIN PROGRAM */

if (args.help) {
  printHelp();
  process.exit(0);
} else if (args.in || args._.includes('-')) {
  // <string> | node index.js --in
  // cat hello.txt | node index.js --in
  getStdin().then(processFile).catch(error);
} else if (args.file) {
  // --file="fileName"
  // async
  fs.readFile(path.join(BASE_PATH, args.file), function onFileRead(err, data) {
    if (err) {
      error(`Error reading file: ${err.message}`);
    } else {
      processFile(data.toString());
    }
  });
} else {
  error('Incorrect usage', true);
}

/* ////////////////////////////// FUNCTIONS */

function printHelp() {
  console.log(`Usage: node index.js [options]

Options:
  -h, --help                Show this help message
  -i, --in                  Read input from stdin
  -f, --file=<FILENAME>     Read input from a file
`);
}

// Process the contents of the file or stdin
function processFile(contents) {
  contents = contents.toUpperCase();
  process.stdout.write(contents);
}

function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    console.log('');
    printHelp();
  }
}
