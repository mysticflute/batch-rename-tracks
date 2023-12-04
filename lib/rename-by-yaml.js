const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const extensions = require('./extensions');

/**
 * Renames all files with certain extensions in the given directory to the list
 * of names in a yaml file.
 *
 * @param {string} dir Path to the directory containing music files.
 * @param {string} config Path to the yaml file containing the new music file
 * names.
 * @param {*} options
 */
const rename = function (dir, config, options) {
  if (!dir) {
    throw new Error('Missing directory path');
  }

  if (!fs.existsSync(dir)) {
    throw new Error(`The path "${dir}" does not exist.`);
  }

  if (!fs.statSync(dir).isDirectory()) {
    throw new Error(`The path "${dir}" is not a directory.`);
  }

  if (!fs.existsSync(config)) {
    throw new Error(`The yaml config file "${config}" does not exist.`);
  }

  if (!fs.statSync(config).isFile()) {
    throw new Error(`The yaml config path "${config}" is not a file.`);
  }

  const configData = yaml.load(fs.readFileSync(config, 'utf8'));

  if (!Array.isArray(configData)) {
    throw new Error('the yaml config file should only contain a list of names');
  }

  const files = fs.readdirSync(dir).filter(file => {
    return extensions.includes(path.extname(file));
  });

  if (configData.length !== files.length) {
    throw new Error(
      `the number of entries in the yaml config (${configData.length}) does not match the number of music files in the directory (${files.length}).`
    );
  }

  for (let i = 0; i < configData.length; i++) {
    const oldName = files[i];

    let newName = '';
    if (options.diskNumber) {
      newName += `${options.diskNumber}${options.diskSeparator}`;
    }
    if (i < 9) {
      newName += `0${i + 1}`;
    } else {
      newName += i + 1;
    }
    newName += options.trackSuffix;
    newName += configData[i];
    newName += path.extname(files[i]);

    console.log(`${oldName} -> ${newName}`);
  }

  //   files.forEach(file => {
  //     const newName = name.slice(prefix.length);
  //     const oldPath = path.join(directory, name);
  //     const newPath = path.join(directory, newName);

  //     console.log(`${name} > ${newName}`);

  //     if (newName === '') {
  //       console.error(`Error: "${oldPath}" is blank after the prefix, skipping!`);
  //     } else if (fs.existsSync(newPath)) {
  //       console.error(`Error: "${newPath}" already exists, skipping!`);
  //     } else {
  //       fs.renameSync(oldPath, newPath);
  //       counter += 1;
  //     }
  //   });
};

module.exports = { rename };
