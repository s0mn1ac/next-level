import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference, SetOptions } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscriber, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/services/base.service';
import { ConverterService } from 'src/app/shared/services/converter.service';
import { UserStructure } from '../interfaces/user-structure.interface';
import { User } from '../interfaces/user.interface';
import { Game } from '../models/game.model';
import { List } from '../models/list.model';
import firebase from 'firebase/compat/app';
import { doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, getFirestore, DocumentSnapshot } from 'firebase/firestore';
import { Score } from '../models/score.model';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  public listsBehavior: BehaviorSubject<List[]> = new BehaviorSubject<List[]>(undefined);
  public listsObservable: Observable<List[]> = this.listsBehavior.asObservable().pipe(distinctUntilChanged());

  private lists$: Subscription;

  private uid: string;

  constructor(private angularFirestore: AngularFirestore) { }

  public setUserId(uid: string): void {
    this.uid = uid;
  }

  public initListsSubscription(): void {
    // TODO: Traer SOLO las listas del usuario
    this.lists$?.unsubscribe();
    this.lists$ = this.angularFirestore.collection('lists').valueChanges({ idField: 'id' }).subscribe(async report => {
      await this.updateLists(report);
    });
  }

  public async addList(list: List): Promise<void> {
    const documentReference: DocumentReference = await this.angularFirestore.collection('lists').add(list);
    documentReference.get().then(async (snap) =>
      await updateDoc(doc(getFirestore(), 'users', this.uid), { lists: arrayUnion(doc(getFirestore(), 'lists', snap.id)) }));
  }

  public async modifyList(listId: string, name: string, value: string): Promise<void> {
    await updateDoc(doc(getFirestore(), 'lists', listId), { [name]: value });
  }

  public async deleteList(listId: string): Promise<void> {
    await deleteDoc(doc(getFirestore(), 'lists', listId));
    await updateDoc(doc(getFirestore(), 'users', this.uid), { lists: arrayRemove(doc(getFirestore(), 'lists', listId)) });
  }

  public async addGame(game: Game, listId: string): Promise<void> {
    await this.angularFirestore.collection('games').doc(`${this.uid}_${game.id}`).set(JSON.parse(JSON.stringify(game)));
    await updateDoc(doc(getFirestore(), 'lists', listId), { games: arrayUnion(doc(getFirestore(), 'games', `${this.uid}_${game.id}`)) });
  }

  public async deleteGame(gameId: number, listId: string): Promise<void> {
    await updateDoc(doc(getFirestore(), 'lists',  listId), { games: arrayRemove(doc(getFirestore(), 'games', `${this.uid}_${gameId}`)) });
  }

  private async updateLists(report: any): Promise<void> {
    const lists: List[] = [];
    console.log(report);
    for await (const reportItem of report) {
      const list: List = new List();
      list.id = reportItem.id;
      list.isPublic = reportItem.isPublic;
      list.name = reportItem.name;
      list.games = [];
      for await (const gameDocumentReference of reportItem.games) {
        await gameDocumentReference.get().then((gameSnapshot: DocumentSnapshot<Game>) => list.games.push(gameSnapshot.data()));
      }
      lists.push(list);
    }
    this.listsBehavior.next(lists);
  }

}
