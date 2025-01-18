import { Controller, Post, Body } from '@nestjs/common';
import { ExportService } from './export.service';
import { VehicleCreateDTO } from '../csv/entities/dto/create-vehicle.input';

@Controller('csv')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('export')
  async exportCsv(@Body() vehicleCreateDTO: VehicleCreateDTO) {
    await this.exportService.addExportJob(vehicleCreateDTO);
    // return { message: 'Export job added' };
    return this.exportService.findVehiclesByAge(vehicleCreateDTO.age_of_vehicle);
  }
}