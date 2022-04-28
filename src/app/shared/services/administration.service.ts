import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { RoleEnum } from '../enums/role.enum';
import { UserStructure } from '../interfaces/user-structure.interface';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private angularFirestore: AngularFirestore) { }

  public async getAllUsers(): Promise<UserStructure[]> {
    const allUsers: UserStructure[] = [];
    await this.angularFirestore.collection('users').ref
      .get()
      .then( async (querySnapshot: QuerySnapshot<UserStructure[]>) => {
        for await (const queryDocumentSnapshot of querySnapshot.docs) {
          const userStructure: UserStructure = await queryDocumentSnapshot.ref
            .get().then( async (userStructureSnapshot: DocumentSnapshot<UserStructure>) => userStructureSnapshot.data());
          allUsers.push(userStructure);
        }
    });
    return allUsers;
  }

  public async getUser(uid: string): Promise<UserStructure> {
    let userStructure: UserStructure;
    await this.angularFirestore.collection('users').doc(uid).ref
      .get()
      .then( async (documentSnapshot: DocumentSnapshot<UserStructure>) => {
        userStructure = await documentSnapshot.ref
          .get().then( async (userStructureSnapshot: DocumentSnapshot<UserStructure>) => userStructureSnapshot.data());
        });
    return userStructure;
  }

  public async modifyUser(uid: string, displayName: string, role: RoleEnum): Promise<void> {
    await this.angularFirestore.collection('users').doc(uid).update({ displayName, role });
  }

}
