import { Body, Controller, Get, Post, Put, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { TodoService } from 'src/service/todo.service';
import { CreateTodoDto, UpdateTodoDto } from 'src/dto/todo';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    getTodos() {
        return this.todoService.getTodos();
    }

    @Post()
    createTodo(@Body() createTodoBody: CreateTodoDto) {
        this.todoService.createTodo(createTodoBody);
    }

    @Put(':id')
    putTodo(@Param('id', ParseIntPipe) id: number, @Body() updateTodoBody: UpdateTodoDto) {
        return this.todoService.updateTodo(id, updateTodoBody);
    }

    @Delete(':id')
    removeTodo(@Param('id', ParseIntPipe) id: number) {
        return this.todoService.deleteTodo(id);
    }

}