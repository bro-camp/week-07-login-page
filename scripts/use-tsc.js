/* eslint-disable no-console */
const { execSync, exec } = require('child_process');

const useTsc = async () => {
  console.log('* Executing tsc for the first time');
  execSync('npm run tsc');
  console.log('* tsc successfully executed for the first time');

  console.log('* Executing "tsc -w"');
  // const tsc = spawn('npm', ['run', 'tsc:watch']);
  exec('npm run tsc:watch');
  console.log('* Watching for typescript files using "tsc -w"');

  // tsc.stdout.on('data', (data) => console.log(data));
  // tsc.stderr.on('data', (data) => console.log(data));
  // tsc.on('error', (err) => console.log(err));
};

module.exports = useTsc;

/* eslint-enable no-console */
