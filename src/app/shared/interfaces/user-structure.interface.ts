import { DocumentReference } from '@angular/fire/compat/firestore';
import { RoleEnum } from '../enums/role.enum';
import { List } from '../models/list.model';

export interface UserStructure {
    displayName?: string;
    email?: string;
    photoURL?: string;
    role?: RoleEnum;
}
