import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Vehicle } from '../csv/entities/vehicle.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VehicleCreateDTO } from '../csv/entities/dto/create-vehicle.input';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    @InjectQueue('export-processing') private readonly queue: Queue
  ) {}

  async addExportJob(vehicleCreateDTO: VehicleCreateDTO) {
    await this.queue.add('process-export', vehicleCreateDTO);
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