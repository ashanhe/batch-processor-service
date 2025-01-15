import { Controller, Post, Body } from '@nestjs/common';
import { ExportService } from './export.service';
import { VehicleCreateDTO } from '../csv/entities/dto/create-vehicle.input';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('csv')
  async exportCsv(@Body() vehicleCreateDTO: VehicleCreateDTO) {
    await this.exportService.addExportJob(vehicleCreateDTO);
    return { message: 'Export job added' };
  }
}