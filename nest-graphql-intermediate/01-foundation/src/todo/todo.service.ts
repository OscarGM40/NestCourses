import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  // mock de una coleccion de todos
  private todos: Todo[] = [
    {
      id: 1,
      description: 'Piedra del Alma',
      done: false,
    },
    {
      id: 2,
      description: 'Piedra del Tiempo',
      done: false,
    },
    {
      id: 3,
      description: 'Piedra del Espacio',
      done: true,
    },
  ];

  create(createTodoDto: CreateTodoDto) {
    // console.log(this.todos.map((todo) => todo.id));
    // console.log(...this.todos.map((todo) => todo.id));
    return this.todos.push({
      // Math.max no pide un array,sino un numero por cada argumento(los que quiera)
      id: Math.max(...this.todos.map((todo) => todo.id), 0) + 1,
      description: createTodoDto.description,
      done: false,
    });
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) throw new NotFoundException(`TODO con id ${id} no encontrado`);
    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    const todoToUpdateIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoToUpdateIndex === -1)
      throw new NotFoundException(`TODO con id ${id} no encontrado`);
    // si llega aqui si encontro y puedo acceder
    this.todos[todoToUpdateIndex] = {
      ...this.todos[todoToUpdateIndex],
      ...updateTodoDto,
    };
    return this.todos[todoToUpdateIndex];
  }

  remove(id: number) {
    const todos = this.todos.filter((todo) => todo.id !== id);
    return todos;
  }
}
