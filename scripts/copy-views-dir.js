/* eslint-disable no-console */
const fse = require('fs-extra');
const chokidar = require('chokidar');
const path = require('path');

const viewsSrcPath = path.join(__dirname, '..', 'src', 'views');
const viewsDestPath = path.join(__dirname, '..', 'build', 'views');

const addDirCallback = async (changedPath) => {
  const relativePath = changedPath.slice(viewsSrcPath.length + 1);
  const destPath = path.join(viewsDestPath, relativePath);

  try {
    await fse.ensureDir(destPath);
  } catch (err) {
    console.error(`Error while ensuring directory: ${err}`);
  }
};

const addCallback = async (changedPath) => {
  const relativePath = changedPath.slice(viewsSrcPath.length + 1);
  const destPath = path.join(viewsDestPath, relativePath);

  try {
    await fse.copy(changedPath, destPath);
  } catch (err) {
    console.error(`Error while copying file: ${err}`);
  }
};

const changeCallback = addCallback;

const unlinkCallback = async (changedPath) => {
  const relativePath = changedPath.slice(viewsSrcPath.length + 1);
  const destPath = path.join(viewsDestPath, relativePath);

  try {
    await fse.remove(destPath);
  } catch (err) {
    console.error(`Error while removing path: ${err}`);
  }
};

const unlinkDirCallback = unlinkCallback;

const watchViewsDir = async () => {
  await fse.ensureDir(viewsDestPath);

  console.log('* Copying views directory for the first time');
  await fse.copy(viewsSrcPath, viewsDestPath);
  console.log('* Views directory successfully copied for the first time');

  chokidar
    .watch(viewsSrcPath, { ignoreInitial: true })
    .on('addDir', addDirCallback)
    .on('add', addCallback)
    .on('change', changeCallback)
    .on('unlink', unlinkCallback)
    .on('unlinkDir', unlinkDirCallback);

  console.log('* Watching views directory');
};

module.exports = watchViewsDir;

/* eslint-enable no-console */
