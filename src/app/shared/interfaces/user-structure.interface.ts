import { DocumentReference } from '@angular/fire/compat/firestore';
import { RoleEnum } from '../enums/role.enum';
import { List } from '../models/list.model';

export interface UserStructure {
    id: string;
    role: RoleEnum;
    isProUser: boolean;
    lists: DocumentReference[];
}
