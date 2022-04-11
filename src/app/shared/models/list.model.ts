import { Game } from './game.model';

export class List {
    id?: string;
    name: string;
    isPublic: boolean;
    games: Game[];
}
