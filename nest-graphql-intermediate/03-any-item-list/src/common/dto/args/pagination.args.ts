import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, description: 'starting index' })
  @IsOptional()
  @Min(0)
  offset: number = 0;

  @Field((type) => Int, { nullable: true, description: 'number of items' })
  @IsPositive()
  @IsOptional()
  @Min(1)
  limit: number = 10;
}
