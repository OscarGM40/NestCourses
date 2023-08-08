import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// realmente @Entity necesita el nombre de la tabla ??
@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  // unique a true crea un indice en el campo y por ello buscar por email es superrápido
  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  // @Field(() => String) <- realmente no queremos ver este campo nunca en Graphql asi que si lo comentamos no damos visión a Graphql
  password: string;

  @Column({ type: 'text', array: true, default: ['user'] })
  @Field(() => [String!])
  roles: string[];

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;

  // el mismo usuario puede modificar muchas veces a éste
  @ManyToOne((type) => User, (user) => user.lastUpdateBy, {
    nullable: true,
    // en este caso el eager no funciona por que para que funcione tiene que ser de una tabla a otra,en este caso es de una tabla a la misma(y hace dependencia circular y se lia)
    // eager:true
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdateBy' })
  // hasta aqui sería suficiente para typeorm(decoradores @ManyToOne y @JoinColumn).Puede ser nulo pues mientras no se haga un update lo es
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User;

  @OneToMany((type) => Item, (item) => item.user, { lazy: true })
  // @Field(() => [Item])
  items: Item[];
}
