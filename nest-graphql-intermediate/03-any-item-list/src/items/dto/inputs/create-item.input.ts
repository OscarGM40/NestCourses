import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class CreateItemInput {

  @Field(() => String, { nullable: false, description: 'name of the item' })
  @IsString()
  @IsNotEmpty()
  @Length(1,50)
  name: string;
 /*  
  @Field(() => Float)
  @IsPositive()
  quantity: number; */
  
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  quantityUnits?: string;
}
