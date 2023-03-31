/* eslint-disable no-console */
const fse = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const buildDir = path.join(__dirname, '..', 'build');
const viewsSrcPath = path.join(__dirname, '..', 'src', 'views');
const viewsDestPath = path.join(__dirname, '..', 'build', 'views');

const buildHelper = async () => {
  console.log('* Cleaning existing build directory');
  await fse.remove(buildDir);

  console.log('* Creating build directory');
  await fse.ensureDir(buildDir);

  console.log('* Copying views directory');
  fse.ensureDir(viewsDestPath);
  await fse.copy(viewsSrcPath, viewsDestPath);

  console.log('* Compiling TypeScript');
  execSync('npm run tsc');

  console.log('* Executing tsc-alias');
  execSync('npm run tsc-alias');

  console.log('\n\n* BUILD FINISHED\n\n');
};

buildHelper();

/* eslint-enable no-console */
