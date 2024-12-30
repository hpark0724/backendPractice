import { Module } from '@nestjs/common';
import { MovieUserService } from './service/movie-user.service';


@Module({
    imports: [],
    controllers: [],
    providers: [MovieUserService],

})
export class MovieUserModule { }