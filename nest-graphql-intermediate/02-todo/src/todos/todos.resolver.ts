import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Todo } from './entity/todo.entity';
import { TodosService } from './todos.service';
import { CreateTodoInput } from './dto/inputs/create-todo.input';
import { UpdateTodoInput } from './dto/inputs/update-todo.input';
import { StatusArgs } from './dto/args/status.args';
import { AggregationsType } from './types/aggregations.type';

@Resolver()
export class TodosResolver {
  constructor(private readonly todosService: TodosService) {}

  @Query(() => [Todo], {
    name: 'findAllTodos',
    description: 'encuentra todos los Todos',
  })
  findAllTodos(@Args() status: StatusArgs): Todo[] {
    return this.todosService.findAll(status);
  }

  @Query(() => Todo, {
    name: 'findOneTodoByID',
    description: 'encuentra un Todo segun su ID',
  })
  findOneTodo(@Args('id', { type: () => Int }) id: number) {
    return this.todosService.findOne(id);
  }

  // una mutation tmb tiene un tipo de retorno
  @Mutation(() => Todo, {
    description: 'crea un Todo',
    name: 'createTodo',
  })
  createTodo(@Args('CreateTodoInput') createTodoInput: CreateTodoInput) {
    return this.todosService.createTodo(createTodoInput);
  }

  @Mutation(() => Todo, {
    description: 'actualiza un Todo',
    name: 'updateTodo',
  })
  updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    return this.todosService.updateTodo(updateTodoInput);
  }

  @Mutation(() => Boolean)
  removeTodo(@Args('id', { type: () => Int }) id: number) {
    return this.todosService.removeTodo(id);
  }

  // AGGREGATIONS
  @Query(() => Int, {
    description: 'cuenta todos los todos en cualquier estado',
    name: 'totalTodos',
  })
  totalTodos(): number {
    return this.todosService.totalTodos;
  }

  @Query(() => Int, {
    description: 'cuenta todos los todos ya completados',
    name: 'completedTodos',
  })
  completedTodos():number{
    return this.todosService.completedTodos;
  }

  @Query(() => Int, {
    description: 'cuenta todos los todos pendientes',
    name: 'pendingTodos',
  })
  pendingTodos():number{
    return this.todosService.pendingTodos;
  }
  // AGGREGATIONS CON UN CUSTOM TYPE
  @Query(() => AggregationsType)
  aggregations():AggregationsType{
    return {
      total:this.todosService.totalTodos,
      completed: this.todosService.completedTodos,
      pending: this.todosService.pendingTodos,
      totalTodosOld:this.todosService.totalTodos,
    }
  }
}
