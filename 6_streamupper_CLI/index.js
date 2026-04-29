#!/usr/bin/env node
import minimist from 'minimist';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Transform } from 'stream';
import getStdin from 'get-stdin';

const args = minimist(process.argv.slice(2), {
  boolean: ['help', 'in', 'out'],
  string: ['file'],
  alias: {
    h: 'help',
    i: 'in',
    o: 'o',
  },
});

/* ////////////////////////////// GLOBAL VARIABLES */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_PATH = path.resolve(process.env.BASEPATH || __dirname);
let OUTFILE = path.join(BASE_PATH, 'out.txt');

/* ////////////////////////////// MAIN PROGRAM */

if (args.help) {
  printHelp();
  process.exit(0);
} else if (args.in || args._.includes('-')) {
  // <string> | node index.js --in
  // cat hello.txt | node index.js --in
  processFile(process.stdin); // process.stdin = Readable stream by default.
} else if (args.file) {
  // --file="fileName"
  // async
  let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
  processFile(stream);
} else {
  error('Incorrect usage', true);
}

/* ////////////////////////////// FUNCTIONS */

function printHelp() {
  console.log(`Usage: node index.js [options]

Options:
  -h, --help                Show this help message
  -i, --in                  Read input from stdin
  -o, --out                 Display result in out.txt
  -f, --file=<FILENAME>     Read input from a file
`);
}

// Process the contents of the file or stdin
function processFile(inStream) {
  let outStream = inStream;

  /*
  'Transforms' reads data, modify them ans passes to the next data.

  'chunck': Its a block of binary code. Thats why its very fast and easy to manipulate.
  */
  const upperStream = new Transform({
    transform(chunk, enc, next) {
      this.push(chunk.toString().toUpperCase());
      next(); // 'next' chunck to proccess.
    },
  });

  outStream = outStream.pipe(upperStream);

  let targetStream;

  if (args.out) {
    targetStream = process.stdout;
  } else {
    targetStream = fs.createWriteStream(OUTFILE);
  }

  outStream.pipe(targetStream);
}

function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    console.log('');
    printHelp();
  }
}
