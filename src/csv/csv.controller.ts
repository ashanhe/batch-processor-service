import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvService } from './csv.service';
import * as path from 'path';
@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads', // Directory where uploaded files are saved
    }),
  )
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    console.log("file", file);
    const filePath = path.resolve(__dirname, '../../', file.path);
    await this.csvService.addCsvJob(filePath);
    return { message: 'CSV processing job added', filePath };
    
  }
  

}
