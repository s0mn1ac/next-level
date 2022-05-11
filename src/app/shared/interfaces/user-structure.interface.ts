import { RoleEnum } from '../enums/role.enum';

export interface UserStructure {
    uid?: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
    role?: RoleEnum;
    mode?: string;
    theme?: string;
    language?: string;
}
