import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { DatabaseService } from './database.service';
import { FileUpload } from '../models/file-upload.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { UserStructure } from '../interfaces/user-structure.interface';
import { RoleEnum } from '../enums/role.enum';
import firebase from 'firebase/compat/app';
import { ListService } from './list.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  public userBehavior = new BehaviorSubject<UserStructure>(null);

  public readonly userObservable: Observable<UserStructure> = this.userBehavior.asObservable();

  private angularFireAuth$: Subscription;
  private userStructure$: Subscription;

  private defaultPhotoURL = 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';

  private defaultRole: RoleEnum = RoleEnum.user;

  private redirect = false;

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private angularFireStorage: AngularFireStorage,
    private router: Router,
    private ngZone: NgZone,
    private databaseService: DatabaseService,
    private listService: ListService,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.initAngularFireAuthSubscription();
    this.initUserFilterListRef();
  }

  get isLoggedIn(): boolean {
    return JSON.parse(localStorage.getItem('next-level-user')) !== null;
  }

  ngOnDestroy(): void {
    this.angularFireAuth$?.unsubscribe();
    this.userStructure$?.unsubscribe();
  }

  public async signUp(email: string, password: string, name: string): Promise<void> {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then( async result => {
      this.redirect = true;
      await this.generateUserStructure(result.user.uid, name, email);
      this.initListsSubscription();
    }).catch((error) => this.toastService.throwError(error.code));
  }

  public async signIn(email: string, password: string): Promise<void> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then( async result => {
      this.redirect = true;
      this.initListsSubscription();
    }).catch((error) => this.toastService.throwError(error.code));
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
      const userStructure: UserStructure = JSON.parse(localStorage.getItem('next-level-user'));
      userStructure.displayName = displayName;
      userStructure.photoURL = photoURL;
      localStorage.setItem('next-level-user', JSON.stringify(userStructure));
      this.userBehavior.next(userStructure);
    });
  }

  public async updateUserProfilePicture(photoURL: string): Promise<void> {
    return await (await this.angularFireAuth.currentUser).updateProfile({ photoURL }).then(() => {
      const userStructure: UserStructure = JSON.parse(localStorage.getItem('next-level-user'));
      userStructure.photoURL = photoURL;
      localStorage.setItem('next-level-user', JSON.stringify(userStructure));
      this.userBehavior.next(userStructure);
    });
  }

  public uploadUserProfilePicture(fileUpload: FileUpload): Observable<number> {
    const filePath = `/profilePictures/${fileUpload.file.name}`;
    const storageRef = this.angularFireStorage.ref(filePath);
    const uploadTask = this.angularFireStorage.upload(filePath, fileUpload.file);
    uploadTask.snapshotChanges().pipe(
    finalize(() => {
      storageRef.getDownloadURL().subscribe(downloadURL => {
        fileUpload.url = downloadURL;
        fileUpload.name = fileUpload.file.name;
        this.updateUserProfilePicture(fileUpload.url);
      });
    })).subscribe();
    return uploadTask.percentageChanges();
  }

  public async getCurrentUser(): Promise<firebase.User> {
    return this.angularFireAuth.currentUser;
  }

  private generateUserStructure(uid: string, name: string, email: string): void {
    this.databaseService.generateUserStructure(this.getNewUserStructure(uid, name, email));
  }

  private getNewUserStructure(uid: string, displayName: string, email: string): UserStructure {
    return {
      uid,
      displayName,
      email,
      photoURL: this.defaultPhotoURL,
      role: this.defaultRole,
      mode: 'light',
      theme: 'blue',
      language: 'es'
    };
  }

  private initAngularFireAuthSubscription(): void {

    this.angularFireAuth$ = this.angularFireAuth.authState.subscribe( async (user) => {
      if (user) {
        await this.angularFirestore.collection('users').doc(user.uid).ref.get().then((userSnapshot: DocumentSnapshot<UserStructure>) => {
          const userStructure: UserStructure = userSnapshot.data();
          localStorage.setItem('next-level-user', JSON.stringify(userStructure));
          this.userBehavior.next(userStructure);
          if (this.redirect) {
            this.router.navigate(['board']);
            this.redirect = false;
          }
        });
      } else {
        localStorage.setItem('next-level-user', 'null');
      }
    });
  }

  private initUserFilterListRef(): void {
    const user: any = JSON.parse(localStorage.getItem('next-level-user'));
    if (user != null) {
      this.databaseService.setUserId(user.uid);
      this.listService.setUserId(user.uid);
      this.userService.setUserId(user.uid);
      this.initListsSubscription();
      this.initUserStructureSubscription();
    }
  }

  private initListsSubscription(): void {
    this.listService.cancelListsSubscription();
    this.listService.initListsSubscription();
  }

  private initUserStructureSubscription(): void {
    this.userService.cancelUserSubscription();
    this.userService.initUserSubscription();
  }

  private async setUserData(userData: User): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(`users/${userData.uid}`);
    return userRef.set(userData, { merge: true });
  }

}
