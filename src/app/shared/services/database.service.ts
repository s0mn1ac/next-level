import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/services/base.service';
import { ConverterService } from 'src/app/shared/services/converter.service';
import { UserStructure } from '../interfaces/user-structure.interface';
import { User } from '../interfaces/user.interface';
import { Game } from '../models/game.model';
import { List } from '../models/list.model';
import firebase from 'firebase/compat/app';
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, getFirestore } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public userStructureObservable: Observable<UserStructure>;

  private uid: string;

  constructor(private angularFirestore: AngularFirestore) {
    // this.userStructureSubscription$ = new BehaviorSubject<UserStructure>(null);
    // this.userStructure = this.userStructureSubscription$.asObservable().pipe(distinctUntilChanged());
  }

  public setUserId(uid: string): void {
    this.uid = uid;
  }

  public generateUserStructure(userStructure: UserStructure): Promise<any> {
    return this.angularFirestore.collection('users').doc(userStructure.id).set(userStructure);
    // await setDoc(doc(getFirestore(), 'users', userStructure.id), userStructure);
  }

  public initUserStructureSubscription(): void {
    this.userStructureObservable = this.angularFirestore.collection('users').doc(this.uid).valueChanges() as Observable<UserStructure>;
  }

  // CRUD

  public async addList(list: List): Promise<any> {
    // await setDoc(doc(getFirestore(), 'users', userStructure.id), userStructure);
    await updateDoc(doc(getFirestore(), 'users',this.uid), { lists: arrayUnion(list) });
    // return this.angularFirestore.collection('users').doc(this.uid).set(
    //   { lists: arrayUnion(list) },
    //   { merge: true }
    // );
  }

  // public modifyList(): Promise<any> {

  // }

  public async deleteList(list: List): Promise<any> {
    await updateDoc(doc(getFirestore(), 'users',this.uid), { lists: arrayRemove(list) });
    // return this.angularFirestore.collection('users').doc(this.uid).set(
    //   { lists: arrayRemove(list) },
    //   { merge: true }
    // );
  }

  // public addGameToList(): Promise<any> {

  // }

  // public modifyGameFromList(): Promise<any> {

  // }

  // public deleteGameFromList(): Promise<any> {

  // }

}
