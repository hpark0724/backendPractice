import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo.module';
import { AuthModule } from './auth.module';
import { AuthController } from './interfaces/controller/auth.controller';
import { AuthService } from '../src/application/service/auth.service';
import { PollModule } from './poll.module';
import { PollService } from '../src/application/service/poll.service';
import { PollController } from './interfaces/controller/poll.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { MovieUserModule } from './movie-user.module';
import { MovieUserController } from './interfaces/controller/movie-user.controller';
import { MovieUserService } from '../src/application/service/movie-user.service';

@Module({
  imports: [MikroOrmModule.forRoot(config), TodoModule, AuthModule, PollModule, MovieUserModule],
  controllers: [AppController, AuthController, PollController, MovieUserController],
  providers: [AppService, AuthService, PollService, MovieUserService],
})
export class AppModule { }
