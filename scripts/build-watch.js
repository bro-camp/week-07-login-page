/* eslint-disable no-console */
const fse = require('fs-extra');
const path = require('path');
const watchViewsDir = require('./copy-views-dir');
const useTsc = require('./use-tsc');
const useTscAlias = require('./use-tsc-alias');

const buildDir = path.join(__dirname, '..', 'build');

const buildHelper = async () => {
  await fse.ensureDir(buildDir);

  await watchViewsDir();
  await useTsc();

  // useTscAlias() should be given in the end to prevent unwanted calling of
  // this function when other files changes.
  await useTscAlias(buildDir);
};

buildHelper();

/* eslint-enable no-console */
