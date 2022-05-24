import util from 'util';
import stream from 'stream';
import axios from 'axios';
import fs from 'fs';

const pipeline = util.promisify(stream.pipeline);

export async function downloadFile(from: string, to: string):Promise<boolean> {
  try {
    const request = await axios.get(from, {
      responseType: 'stream',
    });
    await pipeline(request.data, fs.createWriteStream(to));
    return true;
  } catch (error) {
    console.error(`download ${from} pipeline failed`, error);
    return false;
  }
}
