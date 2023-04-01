import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
  @Query(() => String, {
    description: 'retorna un literal',
    name: 'hello',
    nullable: false,
  })
  helloWorld(): string {
    return 'Hola mundo';
  }

  @Query(() => Float, {
    description: 'retorna un scalar Float entre 0 y 100',
    name: 'randomNumber',
    nullable: false,
  })
  getRandomNumber(): number {
    return +(Math.random() * 100).toFixed(2);
  }

  @Query(() => Int, {
    description:
      'retorna un entero entre 0 y el argumento recibido no incluyente,por defecto un 6',
    name: 'randomNumberFromZeroTo',
    nullable: false,
  })
  getRandomNumberFromZeroTo(
    @Args('to', { type: () => Int, nullable: true, defaultValue: 2 })
    to: number = 6,
  ): number {
    return Math.floor(Math.random() * to);
  }
}
