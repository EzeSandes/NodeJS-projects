# CLI Uppercase Processor

A command-line tool that converts text from a file or standard input to uppercase using Node.js Streams.

## Features

- Read input from a file (`--file`) or from stdin (`--in`)
- Efficient processing using **Node.js Streams**
- Option to output result to console or to a file (`out.txt`)
- Low memory usage, ideal for processing large files (even several GB)

## Usage

```bash
# Show help
node index.js --help

# Process a file and save to out.txt
node index.js --file=example.txt

# Process from stdin and show output in console
cat example.txt | node index.js --in --out

# Process a file using default output (out.txt)
node index.js --file=example.txt
```

## Technical Explanation: Understanding Streams in this Project

This section explains in detail how the Streams implementation works. It is written for future reference and to help you (or others) fully understand the architecture.

### Core Function: processFile(inStream)

```javaScript
function processFile(inStream) {
  let outStream = inStream;

  const upperStream = new Transform({
    transform(chunk, enc, next) {
      this.push(chunk.toString().toUpperCase());
      next();
    },
  });

  outStream = outStream.pipe(upperStream);

  const targetStream = args.out
    ? process.stdout
    : fs.createWriteStream(OUTFILE);

  outStream.pipe(targetStream);
}
```

### How the Streams Work – Step by Step

1 - What is a Stream?

In Node.js, a Stream is an abstract interface for working with data in chunks rather than loading the entire file into memory at once. This makes it possible to efficiently process very large files without high memory consumption.

2 - Data Flow Pipeline

The application builds the following pipeline:

```text
inStream → upperStream (Transform) → targetStream
```

- `inStream` (Readable): Source of the data. It can be:
  - `process.stdin` (standard input)
  - `fs.createReadStream()` (file reader)

- `upperStream` (Transform): A custom Transform Stream that converts each chunk of data to uppercase.

- `targetStream` (Writable): Destination of the processed data:
  process.stdout (console) - `fs.createWriteStream()` (writes to out.txt)

3 - When Does the Processing Actually Start?

- The first `.pipe()` call (`outStream.pipe(upperStream)`) only connects the streams. No data is processed yet.

- The second `.pipe()` call (`outStream.pipe(targetStream)`) activates the flow. When the `targetStream` is ready to receive data, it signals the `upperStream` to start processing. The `upperStream` then reads chunks from inStream, transforms them, and pushes them to `targetStream`.

Only after the second .pipe() does Node.js start reading the input chunk by chunk, transforming it, and writing the result.

4 - Does outStream Store All the Data?

No

- outStream is just a reference to the Transform Stream (upperStream).
- It does not accumulate or store the processed data in memory.
- Thanks to the Backpressure mechanism, only a small amount of data (usually a few chunks) is kept in memory at any given time.
- Once a chunk is processed and written to the targetStream, it is released from memory.

## Technologies Used

- Node.js
- Streams (Readable, Transform, Writable)
- minimist for argument parsing
