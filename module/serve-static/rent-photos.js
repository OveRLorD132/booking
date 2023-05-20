import __dirname from '../../dirname.js';

import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

let writeFile = promisify(fs.writeFile);
let stat = promisify(fs.stat)
let mkdir = promisify(fs.mkdir);

export default class StaticPhotos {
    constructor() {
        this.directory = path.resolve(__dirname, 'public', 'rent-photos');
    }
    async addPhoto(photo, filename, info) {
        try {
            let photoBuffer = Buffer.from(photo.split(',')[1], 'base64');
            let userDirectory = info.user_name + info.user_id;
            let rentDirectory = info.rent_id.id;
            try {
                await stat(path.resolve(this.directory, userDirectory, rentDirectory));
            } catch(err) {
                if(err.code === 'ENOENT') {
                    console.error(err);
                    await mkdir(path.resolve(this.directory, userDirectory, rentDirectory));
                } else console.error(err);
            } finally {
                await writeFile(path.resolve(this.directory, userDirectory, rentDirectory, filename), photoBuffer);
            }
        } catch(err) {
            console.error(err);
        }

    }
}