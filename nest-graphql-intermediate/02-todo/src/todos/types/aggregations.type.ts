import { Field, Int, ObjectType } from "@nestjs/graphql";


@ObjectType({ description: 'Todo common aggregations' })
export class AggregationsType {

  @Field(() => Int)
  total: number;
  
  @Field(() => Int)
  pending: number;
  
  @Field(() => Int)
  completed: number;
  
  @Field(() => Int, {deprecationReason:'This get is obsolete.Please use total fiel instead' })
  totalTodosOld: number;

}