import { Module } from '@nestjs/common';
import { MovieUserService } from '../src/application/service/movie-user.service';
import { MovieUserController } from '../src/interfaces/controller/movie-user.controller';
import { MovieUserRepository } from './domain/repository/movie-user.repository';

@Module({
    imports: [],
    controllers: [MovieUserController, MovieUserRepository],
    providers: [MovieUserService],

})
export class MovieUserModule { }