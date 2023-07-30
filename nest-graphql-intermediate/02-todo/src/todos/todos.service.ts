import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoInput } from './dto/inputs/create-todo.input';
import { UpdateTodoInput } from './dto/inputs/update-todo.input';
import { StatusArgs } from './dto/args/status.args';

@Injectable()
export class TodosService {
  private todos: Todo[] = [
    { id: 1, description: 'Piedra del alma', done: false },
    { id: 2, description: 'Piedra del espacio', done: false },
    { id: 3, description: 'Piedra del poder', done: false },
  ];

  // en javascript puedo crear un getter sobre lo que quiera,diria que siempre fue extrapolable esta funcionalidad a toda la OOP
  get totalTodos() {
    return this.todos.length;
  }
  get completedTodos() {
    return this.todos.filter((todo) => todo.done).length;
  }
  get pendingTodos() {
    return this.todos.filter((todo) => !todo.done).length;
  }

  findAll(status: StatusArgs): Todo[] {
    if (status.status !== null) {
      return this.todos.filter((todo) => todo.done === status.status);
    }
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
