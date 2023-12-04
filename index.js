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
    '-c, --dry-run',
    'check the outcome of the given arguments without performing any changes'
  )
  .option(
    '-d, --disk <number>',
    'prefix the track number with this disk number'
  )
  .option(
    '-a, --auto-disk',
    'use the first number in the directory name as disk number'
  )
  .option(
    '--disk-suffix <string>',
    'insert these characters between disk and track number',
    'x'
  )
  .option(
    '--number-suffix <string>',
    'insert these characters between the track number and track name',
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
