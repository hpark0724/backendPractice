import { Module } from '@nestjs/common';
import { TodoController } from 'src/interfaces/controller/todo.controller';
import { TodoService } from '../src/application/service/todo.service';

@Module({
    imports: [],
    controllers: [TodoController],
    providers: [TodoService],
})
export class TodoModule { }