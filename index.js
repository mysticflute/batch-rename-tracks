const { program } = require('commander');

program
  .name('batch-rename-tracks')
  .description('CLI to rename multiple music track files');

program
  .argument('<source>', 'the directory containing the files to rename')
  .argument('');
// program.option("--first").option("-s, --separator <char>");

program.parse();

// const options = program.opts();
// const limit = options.first ? 1 : undefined;
// console.log(program.args[0].split(options.separator, limit));
