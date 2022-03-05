import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { List } from '../models/list.model';
import { UserStructure } from '../models/user-structure.model';
import { DatabaseService } from './database.service';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  public userBehavior = new BehaviorSubject<User>(null);

  public readonly userObservable: Observable<User> = this.userBehavior.asObservable();

  private angularFireAuthSubscription$: Subscription;

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private databaseService: DatabaseService
  ) {
    this.initAngularFireAuthSubscription();
  }

  get isLoggedIn(): boolean {
    return JSON.parse(localStorage.getItem('next-level-user')) !== null;
  }

  ngOnDestroy(): void {
    this.angularFireAuthSubscription$?.unsubscribe();
  }

  public async signUp(email: string, password: string): Promise<void> {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then((result) => {
      // this.sendVerificationMail();

      this.ngZone.run(() => {
        this.router.navigate(['home']); // TODO: Cambiar por página de inicio
      });

      const userData: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      };

      this.setUserData(userData);
    }).catch((error) => {
      window.alert(error.message); // TODO: Cambiar las alertas por TOAST
    });
  }

  public async signIn(email: string, password: string): Promise<void> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then((result) => {

      this.ngZone.run(() => {
        this.router.navigate(['home']); // TODO: Cambiar por página de inicio
      });

      const userData: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      };

      this.setUserData(userData);
    }).catch((error) => {
      window.alert(error.message); // TODO: Cambiar las alertas por TOAST
    });
  }

  public async signOut(): Promise<void> {
    return this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('next-level-user');
      this.router.navigate(['sign-in']);
    });
  }

  public async forgotPassword(passwordResetEmail: string): Promise<void> {
    return this.angularFireAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.'); // TODO: Cambiar las alertas por TOAST
      })
      .catch((error) => {
        window.alert(error); // TODO: Cambiar las alertas por TOAST
      });
  }

  public async updateUserProfile(displayName: string, photoURL: string): Promise<void> {
    return await (await this.angularFireAuth.currentUser).updateProfile({ displayName, photoURL }).then(() => {
      const userData: User = JSON.parse(localStorage.getItem('next-level-user'));
      userData.displayName = displayName;
      userData.photoURL = photoURL;
      localStorage.setItem('next-level-user', JSON.stringify(userData));
      this.userBehavior.next(userData);
    });
  }

  public initUserStructure(uid: string): void {
    this.databaseService.create(uid, new UserStructure(uid));
  }

  public generateUserDefaultLists(uid: string): void { // TODO: Revisar

    const playedList: List = new List();
    playedList.name = 'Jugados';
    playedList.isPublic = false;
    playedList.games = [];

    const pendingList: List = new List();
    pendingList.name = 'Pendientes';
    pendingList.isPublic = false;
    pendingList.games = [];

    this.databaseService.createList(uid, playedList);
    this.databaseService.createList(uid, pendingList);
  }

  public async getCurrentUser(): Promise<firebase.User> {
    return this.angularFireAuth.currentUser;
  }

  private initAngularFireAuthSubscription(): void {
    this.angularFireAuthSubscription$ = this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        const userData: User = { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL };
        localStorage.setItem('next-level-user', JSON.stringify(userData));
        this.userBehavior.next(userData);
      } else {
        localStorage.setItem('next-level-user', 'null');
      }
    });
  }

  private async setUserData(userData: User): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(`users/${userData.uid}`);
    return userRef.set(userData, { merge: true });
  }

  // private async sendVerificationMail(): Promise<void> {
  //   return this.angularFireAuth.currentUser.then((u: any) => u.sendEmailVerification()).then(() => {
  //     this.router.navigate(['verify-email-address']);
  //   });
  // }

}
