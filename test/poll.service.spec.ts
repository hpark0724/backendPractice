import { HttpException } from '@nestjs/common';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { PollService } from '../src/application/service/poll.service';
describe('Pollservice', () => {
    let pollService: PollService;
    beforeEach(() => {
        //const appController = new 
        pollService = new PollService();

        it('should create poll', () => {
            const pollService = new PollService();
            // happy path
            const poll = pollService.createPoll({
                topic: 'food',
                choices: ['piazza', 'buger', 'salad']
            });
            expect(poll).toBeDefined();
            expect(poll.topic).toEqual('food');
        });

        it('should not create poll', () => {
            pollService = new PollService();
            // unhapy path    
            expect(() => {
                const poll = pollService.createPoll({
                    topic: 'food',
                    choices: ['123']
                });
                // expect(poll).toBeDefined();
                // expect(poll.topic).toEqual('food');

            }).toThrow(HttpException);

        });

        it('should get poll pizza', () => {
            const polls = pollService.createPoll({
                topic: 'food',
                choices: ['piazza', 'buger', 'salad']
            });

            expect(pollService.getPollbyId(polls.id)).toBeDefined();

        });

        expect(() => {
            (pollService.getPollbyId('abc'));
        }).toThrow(HttpException);
        expect(() => {
            pollService.getPollbyId(null);

        }).toThrow(HttpException);
    });

    it('should vote', () => {
        const poll = pollService.createPoll({
            topic: 'food',
            choices: ['piazza', 'buger', 'salad']
        });
        pollService.vote(poll.id, 'piazza');
        expect(poll.vote[0]).toEqual(1);
    })

});