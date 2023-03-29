/* eslint-disable no-console */
const chokidar = require('chokidar');
const { execSync } = require('child_process');

const runTscAlias = () => {
  console.log('* Executing tsc-alias');
  execSync('npm run tsc-alias');
  console.log('* tsc-alias successfully executed');
};

const useTscAlias = async (buildDir) => {
  console.log('* Executing tsc-alias for the first time');
  execSync('npm run tsc-alias');
  console.log('* tsc-alias successfully executed for the first time');

  chokidar
    .watch(buildDir, { ignoreInitial: true })
    .on('addDir', runTscAlias)
    .on('add', runTscAlias)
    .on('change', runTscAlias);
  // .on('unlink', runTscAlias)
  // .on('unlinkDir', runTscAlias)

  console.log('* Waching files for using tsc-alias');
};

module.exports = useTscAlias;

/* eslint-enable no-console */
