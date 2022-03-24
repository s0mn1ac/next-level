import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';
import { ConverterService } from 'src/app/shared/services/converter.service';
import { UserStructure } from '../interfaces/user-structure.interface';
import { User } from '../interfaces/user.interface';
import { Game } from '../models/game.model';
import { List } from '../models/list.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private uid: string;

  constructor(private angularFirestore: AngularFirestore) { }

  public setUserId(uid: string): void {
    this.uid = uid;
  }

  public createUserStructure(userStructure: UserStructure): Promise<any> {
    return this.angularFirestore.collection('users').doc(userStructure.id).set(userStructure);
  }

  public getUserStructure(): Observable<UserStructure> {
    return this.angularFirestore.collection('users').doc(this.uid).valueChanges() as Observable<UserStructure>;
  }

}
