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

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public userStructureObservable: Observable<UserStructure>;

  private uid: string;

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
    return this.angularFirestore.collection('users').doc(userStructure.id).set(userStructure);
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

  public async addList(list: List): Promise<void> {
    const documentReference: DocumentReference = await this.angularFirestore.collection('lists').add(list);
    documentReference.get().then(async (snap) =>
      await updateDoc(doc(getFirestore(), 'users', this.uid), { lists: arrayUnion(doc(getFirestore(), 'lists', snap.id)) }));
  }

  public async changeListName(list: List, newListName: string): Promise<void> {
    await updateDoc(doc(getFirestore(), 'lists', list.id), { name: newListName });
  }

  public async deleteList(list: List): Promise<void> {
    await deleteDoc(doc(getFirestore(), 'lists', list.id));
    await updateDoc(doc(getFirestore(), 'users', this.uid), { lists: arrayRemove(doc(getFirestore(), 'lists', list.id)) });
  }

  public async addGameToList(game: Game, list: List): Promise<void> {
    const gameId = `${this.uid}_${game.id}`;
    await this.angularFirestore.collection('games').doc(gameId).set(JSON.parse(JSON.stringify(game))); // TODO: Comprobar si ya existe
    await updateDoc(doc(getFirestore(), 'lists', list.id), { games: arrayUnion(doc(getFirestore(), 'games', gameId)) });
  }

  public async deleteGameFromList(game: Game, list: List): Promise<void> {
    const gameId = `${this.uid}_${game.id}`;
    await updateDoc(doc(getFirestore(), 'lists',  list.id), { games: arrayRemove(doc(getFirestore(), 'games', gameId)) });
  }

}
