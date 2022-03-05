import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { List } from '../models/list.model';
import { UserStructure } from '../models/user-structure.model';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userBehavior = new BehaviorSubject<User>(null);

  public readonly userObservable: Observable<User> = this.userBehavior.asObservable();

  private userData: any;

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private databaseService: DatabaseService
  ) {
    this.angularFireAuth.authState.subscribe((user) => {
      const userData: User = { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL };
      this.userBehavior.next(userData);
      console.log('storeUser', user);

      if (user) {
        console.log('STORE');
        this.userData = user;
        localStorage.setItem('nextLevelUser', JSON.stringify(this.userData));
        // JSON.parse(localStorage.getItem('nextLevelUser'));
      } else {
        localStorage.setItem('nextLevelUser', 'null');
        // JSON.parse(localStorage.getItem('nextLevelUser'));
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('nextLevelUser'));
    console.log('isLoggedIn', user);
    return user !== null;
  }

  public async signUp(email: string, password: string, name: string): Promise<void> {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then((result) => {
      // this.sendVerificationMail();

      this.ngZone.run(() => {
        this.router.navigate(['home']); // TODO: Cambiar por página de inicio
      });

      const userData: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
        photoURL: 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg'
      };

      this.initUserStructure(userData.uid);
      this.generateUserDefaultLists(userData.uid);
      this.updateUserProfile(result.user, userData);
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
      localStorage.removeItem('nextLevelUser');
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

  public getStoredUser(): User {
    const user: any = JSON.parse(localStorage.getItem('nextLevelUser'));
    return user !== null ? { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL } : null;
  }

  private updateUserProfile(user, userData: User): void {
    user.updateProfile({
      displayName: userData.displayName,
      photoURL: userData.photoURL
    });
  }

  private async setUserData(userData: User): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(`users/${userData.uid}`);
    this.userBehavior.next(userData);
    return userRef.set(userData, { merge: true });
  }

  private async sendVerificationMail(): Promise<void> {
    return this.angularFireAuth.currentUser.then((u: any) => u.sendEmailVerification()).then(() => {
      this.router.navigate(['verify-email-address']);
    });
  }

  private initUserStructure(uid: string): void {
    this.databaseService.create(uid, new UserStructure(uid));
  }

  private generateUserDefaultLists(uid: string): void {

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

}
