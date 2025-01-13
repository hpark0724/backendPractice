import { Injectable } from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto } from 'src/interfaces/dto/todo';

@Injectable()
export class TodoService {
    private todo: { id: number, title: string, author: string, description: string, priority: number }[] = [];

    getTodos() {
        return this.todo;
    }

    createTodo(createTodoBody: CreateTodoDto) {
        // throw new Error('Not implemented');

        this.todo.push({
            id: this.todo.length + 1,
            title: createTodoBody.title,
            author: createTodoBody.author,
            description: createTodoBody.description,
            priority: createTodoBody.priority
        })
    }

    updateTodo(id: number, updateTodoBody: UpdateTodoDto) {
        const todoId = this.todo.find(todo => todo.id == id);
        if (!todoId) {
            throw new Error('The todo ${id} is not found');
        }

        Object.assign(todoId, updateTodoBody);

        return todoId;
    }


    deleteTodo(id: number) {
        const todoIndex = this.todo.findIndex(todo => todo.id == id);
        if (todoIndex == -1) {
            throw new Error('The todo ${index} is not found');
        }

        this.todo.splice(todoIndex, 1);

        return { message: 'Todo with ${id} deleted successfully' }
    }
}