import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { UserStructure } from '../interfaces/user-structure.interface';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public userStructureObservable: Observable<UserStructure>;

  constructor(private angularFirestore: AngularFirestore) { }

  public generateUserStructure(userStructure: UserStructure): Promise<any> {
    return this.angularFirestore.collection('users').doc(userStructure.uid).set(userStructure);
  }

  public deleteUserStructure(uid: string): Promise<any> {
    return this.angularFirestore.collection('users').doc(uid).delete();
  }

}
