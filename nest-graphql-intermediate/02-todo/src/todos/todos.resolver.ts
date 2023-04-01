import { Query, Resolver } from '@nestjs/graphql';
import { Todo } from './entity/todo.entity';
import { TodosService } from './todos.service';

@Resolver()
export class TodosResolver {
  constructor(private readonly todosService: TodosService) {}

  @Query(() => [Todo], {
    name: 'todos',
    description: 'encuentra todos los Todos',
  })
  findAllTodos(): Todo[] {
    return this.todosService.findAll();
  }

  findOneTodo() {
    return null;
  }

  createTodo() {}

  updateTodo() {}

  removeTodo() {}
}
