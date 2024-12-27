import { Controller, Get, Body, Post, Param, Delete } from "@nestjs/common";
import { PollService } from "src/service/poll.service";
import { CreatePollDto, VoteDto } from "src/dto/poll";

@Controller('polls')
export class PollController {
    constructor(private readonly pollService: PollService) { }

    @Post()
    createPoll(@Body() createPollDto: CreatePollDto) {
        return this.pollService.createPoll(createPollDto)
    }

    @Get()
    getPolls() {
        return this.pollService.getPolls();
    }

    @Post(':id/vote')
    vote(@Param('id') pollId: string, @Body() voteDto: VoteDto) {
        return this.pollService.vote(pollId, voteDto.choice);
    }

    @Get(':id')
    getPoll(@Param('id') pollId: string) {
        return this.pollService.getPollbyId(pollId);
    }

    @Delete(':id')
    deletePoll(@Param('id') pollId: string) {
        return this.pollService.deletePoll(pollId);
    }
}

