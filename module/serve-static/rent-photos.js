import __dirname from "../../dirname.js";

import path from "path";
import fs from "fs";
import { promisify } from "util";

let writeFile = promisify(fs.writeFile);
let stat = promisify(fs.stat);
let mkdir = promisify(fs.mkdir);
let readdir = promisify(fs.readdir);
let readfile = promisify(fs.readFile);

export default class StaticPhotos {
  constructor() {
    this.directory = path.resolve(__dirname, "public", "rent-photos");
  }
  async addPhoto(photo, filename, id) {
    try {
      let photoBuffer = Buffer.from(photo.split(",")[1], "base64");
      try {
        await stat(path.resolve(this.directory, id));
      } catch (err) {
        if (err.code === "ENOENT") {
          await mkdir(
            path.resolve(this.directory, id)
          );
        } else console.error(err);
      } finally {await writeFile(path.resolve(this.directory, id, filename), photoBuffer)}
    } catch (err) {
      console.error(err);
    }
  }
  async getPhotos(id) {
    try {
      let files = await this.readAllPhotos(id);
      files = files.map((file) => this.readPhoto(file))
      return await Promise.all(files);
    } catch (err) {
      console.error(err);
    }
  }
  async readPhoto(filename) {
    return await readfile(filename, "base64");
  }
  async readAllPhotos(id) {
    let directory = path.resolve(this.directory, id);
    try {
      let files = await readdir(directory);
      files = files.map((file) => path.resolve(directory, file));
      return files;
    } catch (err) {
      console.error(err);
    }
  }
}
