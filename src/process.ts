import { promisify } from 'util';
import glob from 'glob';
import path from 'path';
import fse from 'fs-extra';
import promiseMap from 'p-map';
import type { Input } from './input';
import { getImages } from './getImages';
import { downloadFile } from './download';

export async function run(input: Input) {
  const isAbsolute = input.inputDir.startsWith('/');
  const dir = isAbsolute ? input.inputDir : path.join(__dirname, input.inputDir);
  if (!dir.includes('_posts')) {
    console.log('Please specify _posts directory of hexo');
    process.exit(1);
  }
  console.log(`Searching for md files in ${dir}`);
  const entries = await promisify(glob)('**/*.md', { cwd: dir, absolute: true });
  await promiseMap(entries, async (mdFilePath) => {
    console.log(mdFilePath);
    let postData = await fse.readFile(mdFilePath, 'utf-8');
    const images = getImages(postData);
    if (!images.uniqueSrcList || !images.uniqueSrcList.length) {
      return;
    }
    const remote:Array<string> = images.uniqueSrcList
      .filter((el) => el?.startsWith('http://') || el?.startsWith('https://')) as Array<string>;
    if (!remote.length) {
      return;
    }
    if (!input.download) {
      return;
    }
    await promiseMap(remote, (async (remoteImageHttpPath) => {
      console.log(remoteImageHttpPath);
      const name = path.basename(remoteImageHttpPath);
      const newDir = mdFilePath.substring(0, mdFilePath.length - 3);
      await fse.ensureDir(newDir);
      const newPath = path.join(newDir, name);
      if (!fse.existsSync(newPath)) {
        await downloadFile(remoteImageHttpPath, newPath);
      }
      if (!input.replace) {
        return;
      }
      postData = postData.split(remoteImageHttpPath).join(name);
      await fse.writeFile(mdFilePath, postData, 'utf-8');
    }), { concurrency: 1 });
  }, { concurrency: 1 });
}
