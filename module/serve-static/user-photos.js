import __dirname from "../../dirname.js";

import path from "path";
import fs from "fs";
import { promisify } from "util";

let writeFile = promisify(fs.writeFile);
let stat = promisify(fs.stat);
let unlink = promisify(fs.unlink);

export default class {
  constructor() {
    this.directory = path.resolve(__dirname, 'public', 'profile-images');
  }
  async loadPhoto(file, id) {
    try {
      await writeFile(path.resolve(this.directory, `${id}.png`), Buffer.from(file.split(",")[1], "base64"));
    } catch(err) {
      throw(err);
    }
  }
  async deletePhoto(id) {
    try {
      await stat(path.resolve(this.directory, `${id}.png`));
      await unlink(path.resolve(this.directory, `${id}.png`));
    } catch(err) {
      throw(err);
    }
  }
}