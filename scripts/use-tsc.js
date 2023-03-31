/* eslint-disable no-console */
const { execSync, exec } = require('child_process');

const useTsc = async () => {
  console.log('* Executing tsc for the first time');
  execSync('npm run tsc');
  console.log('* tsc successfully executed for the first time');

  console.log('* Executing "tsc -w"');
  exec('npm run tsc:watch');
  console.log('* Watching for typescript files using "tsc -w"');
};

module.exports = useTsc;

/* eslint-enable no-console */
