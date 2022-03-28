import { DocumentReference } from '@angular/fire/compat/firestore';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { Game } from './game.model';

export class List {
    id: string;
    name: string;
    isPublic: boolean;
    games: Game[];

    // constructor(documentId: string, documentData: DocumentData) {
    //     this.id = documentId;
    //     this.name = documentData.name;
    //     this.isPublic = documentData.isPublic;
    //     this.games = documentData.games;
    // }
}
