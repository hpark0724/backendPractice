import { Module } from '@nestjs/common';
import { TodoController } from './interfaces/controller/todo.controller';
import { TodoService } from './application/service/todo.service';
// import { TodoController } from './interfaces/controller/todo.controller';
// import { TodoService } from './application/service/todo.service';

@Module({
    imports: [],
    controllers: [TodoController],
    providers: [TodoService],
})
export class TodoModule { }