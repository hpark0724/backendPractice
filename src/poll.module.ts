import { Module } from '@nestjs/common';
import { PollController } from 'src/interfaces/controller/poll.controller';
import { PollService } from '../src/application/service/poll.service';

@Module({
    imports: [],
    controllers: [PollController],
    providers: [PollService],
})
export class PollModule { }