import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity({name: 'products'})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('float', { default: 0 }) //fijate que numeric daba un string,debe ser float
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column({ type: 'text' })
  gender: string;

  @Column({
    type: 'text',
    array:true,
    default: []
    })
  tags: string[];

  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    {cascade:true,eager:true}
  )
  images?:ProductImage[];

 @ManyToOne(
    () => User,
    (user) => user.product,
    {eager:true}
  )
  user:User;

  // procedures
  @BeforeInsert()
  checkSlugB4Insert(): void {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugB4Update(): void {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}