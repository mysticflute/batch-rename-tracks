const { program } = require('commander');
const renameByYamlConfig = require('./lib/rename-by-yaml');

program
  .name('batch-rename-tracks')
  .description('CLI to rename multiple music track files');

program
  .command('yaml')
  .description('rename files according to a yaml config file')
  .argument('<dir>', 'directory containing the files to rename')
  .argument(
    '<config>',
    'yaml file containing an ordered list of new track names'
  )
  .option(
    '-t, --dry-run',
    'display the outcome of the given arguments without performaning any changes'
  )
  .option('-n, --disk <number>', 'disk number')
  .option(
    '-d, --disk-suffix <string>',
    'the characters between disk and track number',
    'x'
  )
  .option(
    '-t, --track-suffix <string>',
    'the characters between the track number and track name',
    ' - '
  )
  .action((dir, config, options) => {
    try {
      renameByYamlConfig.rename(dir, config, options);
    } catch (e) {
      program.error(e);
    }
  });

program.parse();
