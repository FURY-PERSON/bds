import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from "fs";
import * as path from "path";
import { app, PORT } from 'src/main';
import * as uuid from "uuid";

@Injectable()
export class FilesService {
  async createFile(file:Express.Multer.File): Promise<{fileName: string, fileUrl: string}> {
    try {
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', '..', 'static');
      if(!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, {recursive: true})
      }

      fs.writeFileSync(path.join(filePath, fileName), file.buffer)
      
      const fileUrl = `http://${process.env.DOMAIN}:${PORT}/static/` + fileName;

      return {fileName, fileUrl}
    } catch(e) {
      throw new HttpException('Image upload error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
