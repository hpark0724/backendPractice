import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MovieUserController } from './interfaces/controller/movie-user.controller';
import { MovieUserService } from './application/service/movie-user.service';
import { MovieUserRepository } from './domain/repository/movie-user.repository';
import { MovieUser } from './domain/entity/movie-user.entity';

@Module({
    imports: [MikroOrmModule.forFeature([MovieUser])],
    controllers: [MovieUserController],
    providers: [MovieUserService, MovieUserRepository],
    exports: [MovieUserService, MovieUserRepository],
})
export class MovieUserModule { }
