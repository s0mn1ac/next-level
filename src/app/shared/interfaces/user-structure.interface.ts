import { RoleEnum } from '../enums/role.enum';
import { VisualizationEnum } from '../enums/visualization.enum';

export interface UserStructure {
    uid?: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
    role?: RoleEnum;
    mode?: string;
    theme?: string;
    language?: string;
    visualization?: VisualizationEnum;
}
