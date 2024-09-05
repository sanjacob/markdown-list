const core = require('@actions/core');
const github = require('@actions/github');
const readline = require('readline');
const fs = require('fs');
  
const isHeader = (line) => {
  const pattern = /^[#]+[\t ]+[a-zA-Z0-9|\t V]+$/;
  return pattern.test(line);
};

const isItem = (line) => {
  const pattern = /^[-+*].+$/;
  return pattern.test(line);
};

try {
  // Inputs
  const file = core.getInput('file');
  const header = core.getInput('header');
  const item = core.getInput('item');

  // Health checks
  if (!file.endsWith('.md')) {
    console.log(`WARNING: Expected a markdown file`);
  }

  // Set up file streams
  const tmpFile = `/tmp/${file}.md-list`;

  const fileIn = fs.createReadStream(file);
  const fileOut = fs.createWriteStream(tmpFile);

  const rl = readline.createInterface({
    input: fileIn,
    crlfDelay: Infinity
  });

  // Simple stm to track progress
  const Phase = {
    FIND_LIST: 'FIND_LIST',
    START_LIST: 'START_LIST',
    IN_LIST: 'IN_LIST',
    DONE: 'DONE'
  };

  let state = Phase.FIND_LIST;
  let bullet = '-';

  rl.on('line', (line) => {
    if (state = Phase.FIND_LIST) {
      if (isHeader(line) && line.endsWith(header)) {
        console.log("Found header");
        state = Phase.START_LIST;
      }
      console.log("Finding header");
    } else if (state = Phase.START_LIST) {
      console.log("in start");
      // First item, copy bullet style
      if (isItem(line)) {
        bullet = line[0];
        state = Phase.IN_LIST;
      } else if (line !== "") {
        // Bamboozled: Not a list
        console.log("not a list");
        console.log(line);
        state = Phase.FIND_LIST;
      }
    } else if (state = Phase.IN_LIST) {
      console.log("in list");
      if (!isItem(line)) {
        // first line without anything
        fileOut.write(`${bullet} ${item}\n`);
        state = Phase.DONE;
      }
    }

    fileOut.write(line + '\n');
  });

  rl.on('close', () => {
    fileOut.end();

    fs.rename(tmpFile, file, (err) => {
      if (err != null) {
        throw err;
      }
    });
  });
} catch (error) {
  core.setFailed(error.message);
}
