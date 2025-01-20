import { Module } from '@nestjs/common';
import { PollController } from './interfaces/controller/poll.controller';
import { PollService } from './application/service/poll.service';

@Module({
    imports: [],
    controllers: [PollController],
    providers: [PollService],
})
export class PollModule { }