import { Column} from 'typeorm';

export class VehicleCreateDTO {

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  car_make: string;

  @Column()
  car_model: string;

  @Column()
  vin: string;

  @Column()
  manufactured_date: Date;

  //{ nullable: true }
  @Column({ nullable: true })
  age_of_vehicle: number;
}

