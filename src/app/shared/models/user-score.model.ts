export class UserScore {
    value: number;
    color: string;

    constructor(score: number) {
        this.value = score;
        if (score >= 0 && score < 5) {
            this.color = 'score-red';
        } else if (score >= 5 && score < 7) {
            this.color = 'score-yellow';
        } else {
            this.color = 'score-green';
        }
    }
}
