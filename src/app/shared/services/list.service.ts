import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ConverterService } from 'src/app/shared/services/converter.service';
import { Game } from '../models/game.model';
import { List } from '../models/list.model';
import { doc, arrayUnion, arrayRemove, getFirestore } from 'firebase/firestore';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  public listsBehavior: BehaviorSubject<List[]> = new BehaviorSubject<List[]>(undefined);
  public listsObservable: Observable<List[]> = this.listsBehavior.asObservable().pipe(distinctUntilChanged());

  private lists$: Subscription;

  private uid: string;

  constructor(
    private loadingService: LoadingService,
    private angularFirestore: AngularFirestore,
    private converterService: ConverterService
  ) { }

  public setUserId(uid: string): void {
    this.uid = uid;
  }

  public initListsSubscription(): void {
    const id = { idField: 'id' };
    this.lists$ = this.angularFirestore.collection('users').doc(this.uid).collection('lists').valueChanges(id).subscribe(async report => {
      await this.updateLists(report);
    });
  }

  public cancelListsSubscription(): void {
    this.lists$?.unsubscribe();
  }

  public async addList(list: List): Promise<void> {
    await this.angularFirestore.collection('users').doc(this.uid).collection('lists').add(list);
  }

  public async modifyList(listId: string, name: string, value: any): Promise<void> {
    await this.angularFirestore.collection('users').doc(this.uid).collection('lists').doc(listId).update({ [name]: value });
  }

  public async deleteList(listId: string): Promise<void> {
    await this.angularFirestore.collection('users').doc(this.uid).collection('lists').doc(listId).delete();
  }

  public async addListToFavorites(listId: string): Promise<void> {
    await this.angularFirestore.collection('users').doc(this.uid).collection('lists').doc(listId).update({
      favorites: arrayUnion(doc(getFirestore(), `users/${this.uid}/lists`, listId))
    });
  }

  public async getGame(gameId: string): Promise<Game> {
    const report: any = await this.angularFirestore.collection('users').doc(this.uid).collection('games').doc(`${gameId}`).ref;
    return await this.converterService.convertGameFromReport(report);
  }

  public async addGame(game: Game, listId: string): Promise<void> {
    await this.angularFirestore.collection('users').doc(this.uid).collection('games').doc(`${game.id}`).ref
      .get()
      .then( async (gameSnapshot: DocumentSnapshot<Game>) => {
        if (gameSnapshot.data() === undefined) {
          await this.angularFirestore.collection('users').doc(this.uid).collection('games').doc(`${game.id}`).set(
            JSON.parse(JSON.stringify(game)), { merge: true }
          );
        }
        await this.angularFirestore.collection('users').doc(this.uid).collection('lists').doc(listId).update({
          games: arrayUnion(doc(getFirestore(), `users/${this.uid}/games`, `${game.id}`))
        });
      });
  }

  public async modifyGame(gameId: number, name: string, value: any): Promise<void> {
    await this.angularFirestore.collection('users').doc(this.uid).collection('games').doc(`${gameId}`).update({ [name]: value });
  }

  public async deleteGame(gameId: number, listId: string): Promise<void> {
    await this.angularFirestore.collection('users').doc(this.uid).collection('lists').doc(listId).update({
      games: arrayRemove(doc(getFirestore(), `users/${this.uid}/games`, `${gameId}`))
    });
  }

  public getGamesSubscription(): Observable<DocumentData[]> {
   return this.angularFirestore.collection('users').doc(this.uid).collection('games').valueChanges();
  }

  private async updateLists(report: any): Promise<void> {
    const lists: List[] = [];
    for await (const reportItem of report) {
      const list: List = new List();
      list.id = reportItem.id;
      list.isFavorite = reportItem.isFavorite;
      list.name = reportItem.name;
      list.type = reportItem.type;
      list.position = reportItem.position;
      list.games = [];
      for await (const gameDocumentReference of reportItem.games) {
        await gameDocumentReference.get().then((gameSnapshot: DocumentSnapshot<Game>) => list.games.push(gameSnapshot.data()));
      }
      lists.push(list);
    }
    this.loadingService.hideLoadingScreen();
    this.listsBehavior.next(lists);
  }

}
