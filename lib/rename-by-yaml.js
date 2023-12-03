const fs = require('fs');
const path = require('path');

const rename = function (dir, config, options) {
  console.log('Renaming files via yaml config');
  console.log(dir);
  console.log(config);
  console.log(options);

  if (!dir) {
    throw new Error('Missing directory path');
  }

  if (!fs.existsSync(dir)) {
    throw new Error(`The path "${dir}" does not exist.`);
  }

  if (!fs.statSync(dir).isDirectory()) {
    throw new Error(`The path "${dir}" is not a directory.`);
  }

  let counter = 0;

  const files = fs.readdirSync(dir);
  console.log(files);
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
