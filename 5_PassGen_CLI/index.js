#!/usr/bin/env node
'use strict';

import minimist from 'minimist';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

const args = minimist(process.argv.slice(2), {
  boolean: ['help', 'numbers', 'symbols', 'uppercase', 'lowercase'],
  string: ['length', 'save'],
  alias: {
    l: 'length',
    h: 'help',
    c: 'copy',
    s: 'save',
  },
  default: {
    length: 16,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generatePassword(length, options) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

  let character = '';
  if (options.lowercase) character += lowercase;
  if (options.uppercase) character += uppercase;
  if (options.symbols) character += symbols;
  if (options.numbers) character += numbers;

  if (!character.length) character = lowercase + uppercase + numbers;

  let password = '';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++)
    password += character[randomValues[i] % character.length];

  return password;
}

function printHelp() {
  console.log(`
    Uso: passgen [options]

    Options:
    -l, --length <number>     Length of the password (default: 16)
    --no-lowercase            No lowercase letters
    --no-uppercase            No uppercase letters
    --no-numbers              No numbers
    --no-symbols              No symbols
    -h, --help                Display this help

    Examples:
    passgen
    passgen --length 20 --no-symbols
    passgen -l 12 --numbers --symbols
  `);
}

function error(msg) {
  console.error(`Error: ${msg}`);
  console.log('');
  printHelp();
  process.exit(1);
}

// ======================== MAIN LOGIC ========================

if (args.help) {
  printHelp();
  process.exit(0);
}

let length = parseInt(args.length);
if (isNaN(length) || length < 4 || length > 128) length = 16;

const options = {
  lowercase: args.lowercase,
  uppercase: args.uppercase,
  numbers: args.numbers,
  symbols: args.symbols,
};

console.log('🔐 Generating secure password...\n');

const password = generatePassword(length, options);
console.log(password);
console.log(`\nLength: ${length}`);

// ======================== SAVE TO FILE ========================

if (args.save) {
  const filename =
    typeof args.save === 'string' && args.save.length > 0
      ? args.save
      : 'password.txt';

  console.log('aqui');

  await fs.writeFile(filename, password + '\n', 'utf-8');
  console.log(`\n✅ Password saved successfully to: ${filename}`);
  try {
  } catch (err) {
    console.error(`\n❌ Error saving file: ${err.message}`);
  }
}
