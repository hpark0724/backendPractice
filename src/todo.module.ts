import { Module } from '@nestjs/common';
import { TodoController } from 'src/controller/todo.controller';
import { TodoService } from 'src/service/todo.service';

@Module({
    imports: [],
    controllers: [TodoController],
    providers: [TodoService],
})
export class TodoModule { }