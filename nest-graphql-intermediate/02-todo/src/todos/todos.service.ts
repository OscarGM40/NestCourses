import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoInput } from './dto/inputs/create-todo.input';
import { UpdateTodoInput } from './dto/inputs/update-todo.input';

@Injectable()
export class TodosService {
  private todos: Todo[] = [
    { id: 1, description: 'Piedra del alma', done: false },
    { id: 2, description: 'Piedra del espacio', done: true },
    { id: 3, description: 'Piedra del poder', done: false },
  ];

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo)
      throw new NotFoundException(`Todo con el id ${id} no encontrado`);
    return todo;
  }

  createTodo(createTodoInput: CreateTodoInput): Todo {
    const todo = new Todo();
    todo.description = createTodoInput.description;
    // fijate que interesante el Math.max(...this.colection.map(c => c.id),0)+1
    todo.id = Math.max(...this.todos.map((todo) => todo.id), 0) + 1;
    this.todos.push(todo);
    return todo;
  }

  updateTodo(updateTodoInput: UpdateTodoInput): Todo {
    const { description, done, id } = updateTodoInput;
    const todo = this.findOne(id);

    if (description) todo.description = description;
    if (done !== undefined) todo.done = done;
    return todo;
  }

  removeTodo(id: number) {
    this.findOne(id);
    // si pasó aqui es que tengo un todo
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return true;
  }
}
