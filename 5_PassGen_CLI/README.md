# passgen

A lightweight and secure password generator CLI built with Node.js.

Simple, fast, and dependency-light.

## Features

- Generates cryptographically secure passwords using Node.js `crypto`
- Customizable length (default: 16)
- Options to include/exclude: lowercase, uppercase, numbers, and symbols
- Supports `--no-xxx` flags to easily disable character types
- Minimal dependencies (only `minimist`)
- Ready to use with `npx` or as a local CLI

## Installation

### Clone and use locally

```bash
git clone https://github.com/yourusername/passgen.git
cd passgen
npm install
```

## Usage

```bash
node index.js [options]
```

## Options

| Option            | Alias | Description                      | Default |
| :---------------- | :---- | :------------------------------- | :------ |
| --length <number> | -l    | Length of the generated password | 16      |
| --no-lowercase    | -     | Disable lowercase letters        | enabled |
| --no-uppercase    | -     | Disable uppercase letters        | enabled |
| --no-numbers      | -     | Disable numbers                  | enabled |
| --no-symbols      | -     | Disable special symbols          | enabled |
| --help            | -h    | Show help message                | -       |

## Examples

```bash
# Generate a default 16-character password
node index.js

# 20 characters without symbols
node index.js --length 20 --no-symbols

# 12 characters with only numbers and symbols
node index.js -l 12 --no-lowercase --no-uppercase

# 8-digit PIN (only numbers)
node index.js -l 8 --no-lowercase --no-uppercase --no-symbols

# Show help
node index.js --help
```

## How the Flags Work

- By default, all character types are enabled.
- Use `--no-lowercase`, `--no-uppercase`, etc. to disable specific types.
- If all types are disabled, the generator automatically falls back to a safe set (lowercase + uppercase + numbers).
- The password is generated using `crypto.getRandomValues()` for maximum security.

## Technologies

- Node.js (ES Modules)
- `minimist` – Lightweight argument parser
- Native `crypto` module - Cryptographically secure random generation

## License

MIT License

---

Made with ❤️ by Ezequiel Sandes
Last updated: April 2026
