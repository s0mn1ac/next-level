import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/shared/services/base.service';
import { ConverterService } from 'src/app/shared/services/converter.service';
import { User } from '../interfaces/user.interface';
import { Game } from '../models/game.model';
import { List } from '../models/list.model';
import { UserStructure } from '../models/user-structure.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private dbPath = '/';

  private userFireList: AngularFireList<UserStructure>;

  constructor(private db: AngularFireDatabase) {
    this.userFireList = db.list(this.dbPath);
  }

  public generateUserStructure(uid: string, userStructure: UserStructure): any {
    return this.userFireList.set(uid, userStructure);
  }

  getAll(): AngularFireList<UserStructure> {
    return this.userFireList;
  }

  create(uid: string, userStructure: UserStructure): any {
    return this.userFireList.set(uid, userStructure);
  }

  createList(uid: string, list: List): any {
    const listFireList: AngularFireList<List> = this.db.list(`${this.dbPath}/${uid}/lists`);
    return listFireList.push(list);
  }

  update(key: string, value: any): Promise<void> {
    return this.userFireList.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.userFireList.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.userFireList.remove();
  }

}
