import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import config from './mikro-orm.config';

// Controllers
import { AppController } from './app.controller';
import { AuthController } from './interfaces/controller/auth.controller';
import { MovieUserController } from './interfaces/controller/movie-user.controller';
import { PollController } from './interfaces/controller/poll.controller';
import { HealthController } from './interfaces/controller/health.controller';
import { MovieController } from './interfaces/controller/movie.controller';

// Services
import { AppService } from './app.service';
import { AuthService } from './application/service/auth.service';
import { MovieUserService } from './application/service/movie-user.service';
import { PollService } from './application/service/poll.service';
import { MovieService } from './application/service/movie.service';

// Modules
import { AuthModule } from './auth.module';
import { MovieUserModule } from './movie-user.module';
import { PollModule } from './poll.module';
import { TodoModule } from './todo.module';
import { MovieRepository } from './domain/repository/movie.repository';

@Module({
  imports: [ConfigModule.forRoot(),MikroOrmModule.forRoot(config), HttpModule,TodoModule, AuthModule, PollModule, MovieUserModule, TerminusModule],
  controllers: [AppController, AuthController, PollController, MovieUserController, HealthController, MovieController],
  providers: [AppService, AuthService, PollService, MovieUserService, MovieService,  MovieRepository, ]
})
export class AppModule { }

