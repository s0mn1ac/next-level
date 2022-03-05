import { RoleEnum } from '../enums/role.enum';
import { List } from './list.model';

export class UserStructure {
    id: string;
    role: RoleEnum;
    isProUser: boolean;
    lists: List[];

    constructor(uid: string) {
        this.id = uid;
        this.role = RoleEnum.user;
        this.isProUser = false;
        this.lists = [];
    }
}
