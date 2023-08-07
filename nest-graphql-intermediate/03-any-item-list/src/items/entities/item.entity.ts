import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  /* @Column()
  @Field(() => Float)
  quantity: number; */

  // unidad de medida
  @Column({ comment: 'measure unit of the item', nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  quantityUnits?: string;

  // realmente son muchos articulos pueden pertenecer a un usuario, es dificil de verlo,pero no es oneToMany o no podrian comprar más de uno,tiene que ser ManyToOne
  // IMPORTANTE: no puede ir a null la relacion,un item necesita un user
  @ManyToOne((type) => User, (user) => user.items, { nullable: false })
  // el decorador @Index('name') añade un indice(le puedo dar un name)
  @Index()
  @Field(() => User)
  user: User;
}
