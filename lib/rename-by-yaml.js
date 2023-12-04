const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const extensions = require('./extensions');

/**
 * Renames all files in the given directory to the list of names in a yaml file.
 *
 * The files in the directory are sorted by name then replaced with the names as
 * ordered in the yaml file. The number of names in the yaml file must match the
 * number of files in the directory.
 *
 * Each name is prefixed with the disk number (if specified) and track number
 * (based on sort order).
 *
 * Delimiters are placed between the disk and/or track number as specified in
 * options.
 *
 * @param {string} dir Path to the directory containing the music files.
 * @param {string} config Path to the yaml file containing the new file names.
 * @param {Object} options Optional configuration.
 * @param {boolean} options.dryRun - If true, display the outcome without
 * performing any changes.
 * @param {number} options.disk - The disk number, e.g., "1".
 * @param {number} options.autoDisk - Use the first number in the directory name
 * as the disk number.
 * @param {string} options.diskSuffix - The characters to place after the disk
 * number, e.g., "x".
 * @param {string} options.numberSuffix - The characters to place after the
 * track number, e.g., "_".
 *
 * @see extensions.
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

  if (!config) {
    throw new Error('Missing yaml config file path');
  }

  if (!fs.existsSync(config)) {
    throw new Error(`The yaml config file "${config}" does not exist.`);
  }

  if (!fs.statSync(config).isFile()) {
    throw new Error(`The yaml config path "${config}" is not a file.`);
  }

  let diskNumber = null;
  if (options.disk !== null && options.disk !== undefined) {
    diskNumber = options.disk;
  } else if (options.autoDisk) {
    const match = dir.match(/\d+/);
    if (match) {
      diskNumber = match[0];
    }
  }

  let trackNames;

  const configData = yaml.load(fs.readFileSync(config, 'utf8'));
  if (Array.isArray(configData)) {
    trackNames = configData;
  } else if (diskNumber !== null && diskNumber !== undefined) {
    trackNames = configData[`disk${diskNumber}`];
    if (!trackNames) {
      throw new Error(
        `disk${diskNumber} was not found in the yaml config file.`
      );
    }
    if (!Array.isArray(trackNames)) {
      throw new Error(
        `the value for disk${diskNumber} must be a list of names.`
      );
    }
  } else {
    throw new Error(
      'The yaml config file must only contain a single list of names if disk number is not specified.'
    );
  }

  const files = fs
    .readdirSync(dir)
    .filter(file => {
      return extensions.includes(path.extname(file));
    })
    .sort();

  if (trackNames.length !== files.length) {
    throw new Error(
      `the number of entries in the yaml config (${trackNames.length}) does not match the number of music files in the directory (${files.length}).`
    );
  }

  for (let i = 0; i < trackNames.length; i++) {
    const oldName = files[i];

    let newName = '';

    if (diskNumber !== null && diskNumber !== undefined && diskNumber !== '') {
      newName += `${diskNumber}${options.diskSuffix || ''}`;
    }

    if (i < 9) {
      newName += `0${i + 1}`;
    } else {
      newName += i + 1;
    }
    newName += options.numberSuffix;

    newName += trackNames[i];
    newName += path.extname(files[i]);

    console.log(`${oldName} > ${newName}`);

    if (!options.dryRun) {
      const oldPath = path.join(dir, oldName);
      const newPath = path.join(dir, newName);
      if (fs.existsSync(newPath)) {
        throw new Error(`"${newPath}" already exists!`);
      } else {
        fs.renameSync(oldPath, newPath);
      }
    }
  }
};

module.exports = { rename };
