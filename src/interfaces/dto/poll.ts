interface PollBody {
    topic: string;
    choices: string[];
}

interface VoteBody {
    choice: string;
}

export class CreatePollDto implements PollBody {
    topic: string;
    choices: string[];
}

export class VoteDto implements VoteBody {
    choice: string;
}