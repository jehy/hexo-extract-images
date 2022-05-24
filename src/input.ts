import yargs from 'yargs/yargs';

export type Input = {
  inputDir: string,
  replace: boolean,
  download: boolean,
};

const options = {
  inputDir: {
    alias: 'i',
    type: 'string',
    required: true,
  },
  replace: {
    alias: 'r',
    type: 'boolean',
    default: true,
    description: 'replace links to remote images with local',
  },
  download: {
    alias: 'd',
    type: 'boolean',
    default: true,
    description: 'download remote images',
  },
};

export function getInput():Input {
  return yargs(process.argv.slice(2))
  // @ts-ignore
    .options(options)
    .help('help').parseSync() as unknown as Input;
}
