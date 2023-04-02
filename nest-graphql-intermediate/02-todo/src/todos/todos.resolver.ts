import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Todo } from './entity/todo.entity';
import { TodosService } from './todos.service';
import { CreateTodoInput } from './dto/inputs/create-todo.input';
import { UpdateTodoInput } from './dto/inputs/update-todo.input';

@Resolver()
export class TodosResolver {
  constructor(private readonly todosService: TodosService) {}

  @Query(() => [Todo], {
    name: 'findAllTodos',
    description: 'encuentra todos los Todos',
  })
  findAllTodos(): Todo[] {
    return this.todosService.findAll();
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

  @Mutation(() => Todo,{
    description: 'actualiza un Todo',
    name:'updateTodo'
  })
  updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    return this.todosService.updateTodo(updateTodoInput)
  }

  @Mutation(() => Boolean)
  removeTodo(@Args('id',{type: () => Int}) id:number) {
    return this.todosService.removeTodo(id);
  }
}
