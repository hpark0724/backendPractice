import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './application/service/auth.service';
import { MovieUserService } from './application/service/movie-user.service';
import { PollService } from './application/service/poll.service';
import { AuthModule } from './auth.module';
import { AuthController } from './interfaces/controller/auth.controller';
import { MovieUserController } from './interfaces/controller/movie-user.controller';
import { PollController } from './interfaces/controller/poll.controller';
import { MovieUserModule } from './movie-user.module';
import { PollModule } from './poll.module';
import { TodoModule } from './todo.module';


@Module({
  imports: [MikroOrmModule.forRoot(config), TodoModule, AuthModule, PollModule, MovieUserModule],
  controllers: [AppController, AuthController, PollController, MovieUserController],
  providers: [AppService, AuthService, PollService, MovieUserService],
})
export class AppModule { }
