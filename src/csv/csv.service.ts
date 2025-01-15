import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Between, Repository } from 'typeorm';
import { VehicleCreateDTO } from './entities/dto/create-vehicle.input';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CsvService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    @InjectQueue('csv-processing') private readonly queue: Queue
  ) {}

  // // Calculate the age of the vehicle
  private calculateVehicleAge(manufacturedDate: Date): number {
    const currentDate = new Date();
    const age = currentDate.getFullYear() - manufacturedDate.getFullYear();
    // const monthDifference = currentDate.getMonth() - manufacturedDate.getMonth();
    // if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < manufacturedDate.getDate())) {
    //   return age - 1;
    // }
    return age;
  }

  //Create
  async create(vehicle: VehicleCreateDTO): Promise<Vehicle> {
    let vehi = this.vehicleRepository.create(vehicle);
    //calculate age of the vehicle
    vehi.age_of_vehicle = this.calculateVehicleAge(
      new Date(vehi.manufactured_date),
    );
    console.log('Data saved successfully');
    return this.vehicleRepository.save(vehi);
  }

  //CSV
  async addCsvJob(filePath: string) {
    await this.queue.add('process-csv', { filePath });
  }


  //Export by age
  async findByAge(age: number): Promise<Vehicle[]> {
    const currentDate = new Date();
    const targetYear = currentDate.getFullYear() - age;
    return this.vehicleRepository.find({
      where: {
        manufactured_date: Between(
          new Date(targetYear, 0, 1),
          new Date(targetYear, 11, 31),
        ),
      },
    });
  }
}
