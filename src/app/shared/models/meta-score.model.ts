export class MetaScore {
    value: number;
    color: string;

    constructor(score: number) {
        this.value = score;
        if (score >= 0 && score < 50) {
            this.color = 'score-red';
        } else if (score >= 50 && score < 75) {
            this.color = 'score-yellow';
        } else {
            this.color = 'score-green';
        }
    }
}
