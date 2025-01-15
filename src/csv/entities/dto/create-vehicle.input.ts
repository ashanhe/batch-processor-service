import { Column} from 'typeorm';

@InputType()
export class VehicleCreateDTO {
  //   @Column()
  //   id: string;

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
  @Field({ nullable: true })
  age_of_vehicle: number;
}
function InputType(): (target: typeof VehicleCreateDTO) => void | typeof VehicleCreateDTO {
  throw new Error('Function not implemented.');
}

function Field(arg0: { nullable: boolean; }): (target: VehicleCreateDTO, propertyKey: "age_of_vehicle") => void {
  throw new Error('Function not implemented.');
}

