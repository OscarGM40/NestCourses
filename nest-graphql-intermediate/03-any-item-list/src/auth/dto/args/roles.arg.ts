import { IsArray } from 'class-validator';
import { ValidRoles } from './../../enums/valid-roles.enum';
import { ArgsType, Field } from '@nestjs/graphql';


// recuerda que para que esta clase sea un tipo reconocible por GraphQl necesito decorar la clase con @ArgsType y la propiedad con @Field
@ArgsType()
export class ValidRolesArgs {

  // recuerda que con class-validator puedo validar cualquier property
  @Field(() => [ValidRoles], { nullable:true })
  @IsArray()
  roles:  ValidRoles[] = []

}