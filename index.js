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

  const state = Phase.FIND_LIST;
  const bullet = '-';

  rl.on('line', (line) => {

    if (state = Phase.FIND_LIST) {
      if (isHeader(line) && line.endsWith(`${header}\n`)) {
        state = Phase.START_LIST;
      }
    } else if (state = Phase.START_LIST) {
      // First item, copy bullet style
      if (isItem(line)) {
        bullet = line[0];
        state = Phase.IN_LIST;
      } else if (line != "\n") {
        // Bamboozled: Not a list
        state = Phase.FIND_LIST;
      }
    } else if (state = Phase.IN_LIST) {
      if (!isItem(line)) {
        // first line without anything
        fileOut.write(`${bullet} ${item}`);
        state = Phase.DONE;
      }
    }

    fileOut.write(line);
  });

  fs.rename(tmpFile, file, (err) => {
    throw err;
  });
} catch (error) {
  core.setFailed(error.message);
}
