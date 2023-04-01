import { Float, Query, Resolver } from '@nestjs/graphql';

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
}
