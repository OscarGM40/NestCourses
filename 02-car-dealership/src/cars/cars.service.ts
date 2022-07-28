import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CarsService {
  private cars: Array<Car> = [
    {
      id: uuidv4(),
      brand: 'Toyota',
      model: 'Corolla',
    },
    {
      id: uuidv4(),
      brand: 'Honda',
      model: 'Civic',
    },
    {
      id: uuidv4(),
      brand: 'Jeep',
      model: 'Cherokee',
    },
  ];

  findAll() {
    return this.cars;
  }

  findOneById(id: string) {
    const car = this.cars.find((car) => car.id === id);
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    return car;
  }
}
