import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UserStructure } from '../interfaces/user-structure.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userBehavior = new BehaviorSubject<UserStructure>(null);

  public readonly userObservable: Observable<UserStructure> = this.userBehavior.asObservable();

  private userStructure$: Subscription;

  private uid: string;

  constructor(
    private angularFirestore: AngularFirestore
  ) { }

  public setUserId(uid: string): void {
    this.uid = uid;
  }

  public initUserSubscription(): void {
    this.userStructure$ = this.angularFirestore.collection('users').doc(this.uid).valueChanges().subscribe(changes => {
      if (changes != null) {
        localStorage.setItem('next-level-user', JSON.stringify(changes));
        this.userBehavior.next(changes);
      }
    });
  }

  public cancelUserSubscription(): void {
    this.userStructure$?.unsubscribe();
  }

  public async modifyUser(name: string, value: any): Promise<void> {
    await this.angularFirestore.collection('users').doc(this.uid).update({ [name]: value });
  }

}
