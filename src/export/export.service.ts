import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Vehicle } from '../csv/entities/vehicle.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VehicleCreateDTO } from '../csv/entities/dto/create-vehicle.input';
import * as path from 'path';
import * as csvWriter from 'csv-writer';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    @InjectQueue('export-processing') private readonly queue: Queue
  ) {}

  async addExportJob(vehicleCreateDTO: VehicleCreateDTO): Promise<string> {
    const vehicles: Vehicle[] = await this.findVehiclesByAge(vehicleCreateDTO.age_of_vehicle);

    const filePath = path.resolve(
      __dirname,
      '../../exports',
      `vehicles_export.csv`,
    );

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

    return filePath;
  }

  async findVehiclesByAge(age: number): Promise<Vehicle[]> {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - age;  
    const endYear = startYear + 1;

    return this.vehicleRepository.find({
      where: {
        manufactured_date: Between(new Date(startYear, 0, 1), new Date(endYear, 0, 1)),
      },
    });
  }
}