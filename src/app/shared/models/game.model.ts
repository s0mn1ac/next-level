import { Platform } from './platform.model';
import { Esrb } from './esrb.model';
import { Genre } from './genre.model';
import { Store } from './store.model';
import { ParentPlatform } from './parent-platform.model';
import { StatusEnum } from '../enums/status.enum';
import { Score } from './score.model';
import { Developer } from './developer.model';
import { Publisher } from './publisher.model';

export class Game {
    id: number;
    name: string;
    slug: string;
    image: string;
    releaseDate: string;
    tba: boolean;
    metascore: Score;
    avgPlaytime: number;
    screenshots: string[];
    esrb: Esrb;
    genres: Genre[];
    parentPlatforms: ParentPlatform[];
    platforms: Platform[];
    stores: Store[];

    description: string;
    dominantColor: string; // TODO: ¿Al final se usa?
    saturatedColor: string; // TODO: ¿Al final se usa?
    developers: Developer[];
    publishers: Publisher[];

    status: StatusEnum = StatusEnum.pending; // TODO: ¿Al final se usa?
    completed: boolean;
    score: Score = { value: 50, color: 'score-yellow' };
    myPlatform: Platform;
}
