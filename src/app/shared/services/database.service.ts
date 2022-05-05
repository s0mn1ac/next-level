import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ConverterService } from 'src/app/shared/services/converter.service';
import { UserStructure } from '../interfaces/user-structure.interface';
import { List } from '../models/list.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public userStructureObservable: Observable<UserStructure>;

  public uid: string;

  constructor(
    private angularFirestore: AngularFirestore,
    private converterService: ConverterService
  ) { }

  public setUserId(uid: string): void {
    this.uid = uid;
  }

  public generateUserStructure(userStructure: UserStructure): Promise<any> {
    return this.angularFirestore.collection('users').doc(userStructure.uid).set(userStructure);
  }

  public deleteUserStructure(uid: string): Promise<any> {
    return this.angularFirestore.collection('users').doc(uid).delete();
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

}
