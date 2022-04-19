import { ListTypeEnum } from '../enums/list-type.enum';
import { Game } from './game.model';

export class List {
    id?: string;
    name: string;
    isPublic: boolean;
    isFavorite: boolean;
    type: ListTypeEnum;
    position?: number;
    games: Game[];
}
