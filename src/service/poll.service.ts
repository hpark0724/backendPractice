import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class PollService {

    private polls: Array<{ id: string; topic: string; choices: string[]; vote: number[] }> = [];

    createPoll(poll: { topic: string; choices: string[] }) {
        if (poll.choices.length === 0) {
            throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
        }

        const id = uuidv4(); // poll object에 대한 unique ID 부여
        const vote = poll.choices.map(() => 0); // poll object 길이만큼 배열 0으로 초기화해서 생성
        const pollWithId = { id, ...poll, vote };
        this.polls.push(pollWithId);
        return pollWithId;
    }

    getPolls() {
        if (this.polls.length === 0) {
            throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
        }
        return this.polls;
    }

    vote(id: string, choice: string) {
        if (this.polls.length === 0) {
            throw new HttpException("Invalid input", HttpStatus.BAD_REQUEST);
        }

        if (choice === null) {
            throw new HttpException('', HttpStatus.BAD_REQUEST);
        }

        const poll = this.polls.find((poll) => poll.id === id);
        const choiceIndex = poll.choices.findIndex((c) => c === choice);

        if (choiceIndex === -1) {
            throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
        }
        poll.vote[choiceIndex] += 1;
    }

    getPollbyId(id: string) {
        if (!id) {
            throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
        }

        const pollIndex = this.polls.findIndex((poll) => poll.id == id);

        if (pollIndex == -1) {
            throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
        }

        return this.polls[pollIndex]
    }

    deletePoll(id: string) {
        if (!this.polls) {
            throw new HttpException("Invalid input", HttpStatus.BAD_REQUEST);
        }

        const pollIndex = this.polls.findIndex((poll) => poll.id === id);

        if (pollIndex === -1) {
            throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
        }

        this.polls.splice(pollIndex, 1);

    }

}