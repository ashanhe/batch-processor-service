import { Controller, Post, Body, Res } from '@nestjs/common';
import { ExportService } from './export.service';
import { VehicleCreateDTO } from '../csv/entities/dto/create-vehicle.input';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('csv')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('export')
  async exportCsv(@Body() vehicleCreateDTO: VehicleCreateDTO, @Res() res: Response) {
    const filePath = await this.exportService.addExportJob(vehicleCreateDTO);
    const fileName = path.basename(filePath);

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'text/csv');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}