import { Module } from '@nestjs/common';
import { MovieUserService } from '../src/application/service/movie-user.service';
import { MovieUserController } from '../src/interfaces/controller/movie-user.controller';

@Module({
    imports: [],
    controllers: [MovieUserController],
    providers: [MovieUserService],

})
export class MovieUserModule { }