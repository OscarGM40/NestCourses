import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  controllers: [CarsController],
  // dado que un Service es un Provider todos vendrán aqui
  providers: [CarsService],
})
export class CarsModule {}
