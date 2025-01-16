import { Module } from '@nestjs/common';
import { MovieService } from '../src/application/service/movie.service';
import { MovieController } from '../src/interfaces/controller/movie.controller';

@Module({
    imports: [],
    controllers: [MovieController],
    providers: [MovieService],

})
export class MovieModule { }