import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// perfectamente pueden convivir un ObjectType con una Entity,ojo
@Entity({ name: 'items' })
@ObjectType()
export class Item {

  // por defecto una primary key el ORM la pondrá como autoincrementada
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Float)
  quantity: number;

  // unidad de medida
  @Column({ comment: 'measure unit of the item/product',nullable:true })
  @Field(() => String,{nullable:true})
  @IsOptional()
  measureUnit?: string;
}
