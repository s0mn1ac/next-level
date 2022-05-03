import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference, SetOptions } from '@angular/fire/compat/firestore';
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
import { doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, setDoc, getFirestore, DocumentData } from 'firebase/firestore';
import { MetaScore } from '../models/meta-score.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public userStructureObservable: Observable<UserStructure>;

  public uid: string;

  constructor(
    private angularFirestore: AngularFirestore,
    private converterService: ConverterService
  ) {
    // this.userStructureSubscription$ = new BehaviorSubject<UserStructure>(null);
    // this.userStructure = this.userStructureSubscription$.asObservable().pipe(distinctUntilChanged());
  }

  public setUserId(uid: string): void {
    this.uid = uid;
  }

  public generateUserStructure(userStructure: UserStructure): Promise<any> {
    return this.angularFirestore.collection('users').doc(userStructure.uid).set(userStructure);
    // await setDoc(doc(getFirestore(), 'users', userStructure.id), userStructure);
  }

  public initUserStructureSubscription(): void {
    this.userStructureObservable = this.angularFirestore.collection('users').doc(this.uid).valueChanges() as Observable<UserStructure>;
  }

  public async getAllLists(): Promise<List[]> {
    const report: any = await this.angularFirestore.collection('lists').ref;
    return this.converterService.convertAllListsFromReport(report);
  }

  public async getList(listId: string): Promise<List> {
    const report: any = await this.angularFirestore.collection('lists').doc(listId).ref;
    return this.converterService.convertListFromReport(report);
  }

  // public foo(): any {
  //   return this.angularFirestore.collection('lists').doc(this.uid).ref.collection('games').;
  // }

  // CRUD

}
