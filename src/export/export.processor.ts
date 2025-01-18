import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as path from 'path';
import { ExportService } from './export.service';
import { Vehicle } from '../csv/entities/vehicle.entity';
import * as csvWriter from 'csv-writer';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Processor('export-processing')
export class ExportProcessor {
  constructor(
    private readonly exportService: ExportService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @Process('process-export')
  async handleExport(job: Job) {
    const { age_of_vehicle } = job.data;
    const vehicles: Vehicle[] =
      await this.exportService.findVehiclesByAge(age_of_vehicle);

    const filePath = path.resolve(
      __dirname,
      '../../exports',
      `vehicles_export.csv`,
    );
    // console.log('Exporting vehicles to CSV:', filePath);
    const writer = csvWriter.createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'first_name', title: 'First Name' },
        { id: 'last_name', title: 'Last Name' },
        { id: 'email', title: 'Email' },
        { id: 'car_make', title: 'Car Make' },
        { id: 'car_model', title: 'Car Model' },
        { id: 'vin', title: 'VIN' },
        { id: 'manufactured_date', title: 'Manufactured Date' },
        { id: 'age_of_vehicle', title: 'Age of Vehicle' },
      ],
    });

    await writer.writeRecords(vehicles);
    console.log('CSV file created:', filePath);

    // Send notification to the client (websockets)
    this.notificationsGateway.sendNotification('File exported successfully');

  }
}