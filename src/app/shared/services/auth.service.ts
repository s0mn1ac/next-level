import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { List } from '../models/list.model';
import { DatabaseService } from './database.service';
import { FileUpload } from '../models/file-upload.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { UserStructure } from '../interfaces/user-structure.interface';
import { RoleEnum } from '../enums/role.enum';
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
    private angularFireStorage: AngularFireStorage,
    private router: Router,
    private ngZone: NgZone,
    private databaseService: DatabaseService,
    private toastService: ToastService
  ) {
    this.initAngularFireAuthSubscription();
    this.initUserFilterListRef();
  }

  get isLoggedIn(): boolean {
    const user: any = JSON.parse(localStorage.getItem('next-level-user'));
    console.log(user);
    return JSON.parse(localStorage.getItem('next-level-user')) !== null;
  }

  ngOnDestroy(): void {
    this.angularFireAuthSubscription$?.unsubscribe();
  }

  public async signUp(email: string, password: string, name: string): Promise<void> {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then(async (result) => {

      const userData: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      };

      this.setUserData(userData);

      await this.updateUserProfile(name, 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg');
      const user: firebase.User = await this.getCurrentUser();
      await this.generateUserStructure(user.uid);
      this.router.navigate(['board']);

    }).catch((error) => this.toastService.throwError(error.code));
  }

  public async signIn(email: string, password: string): Promise<void> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then((result) => {

      this.ngZone.run(() => {
        this.router.navigate(['board']);
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

  public async updateUserProfilePicture(photoURL: string): Promise<void> {
    return await (await this.angularFireAuth.currentUser).updateProfile({ photoURL }).then(() => {
      const userData: User = JSON.parse(localStorage.getItem('next-level-user'));
      userData.photoURL = photoURL;
      localStorage.setItem('next-level-user', JSON.stringify(userData));
      this.userBehavior.next(userData);
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

  private generateUserStructure(uid: string): void {
    this.databaseService.generateUserStructure(this.getNewUserStructure(uid));
  }

  private getNewUserStructure(uid: string): UserStructure {
    return {
      id: uid,
      role: RoleEnum.user,
      isProUser: false,
      lists: [
        { id: 'jugados', name: 'Jugados', isPublic: false, games: [] },
        { id: 'pendientes', name: 'Pendientes', isPublic: false, games: [] }
      ]
    };
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

  private initUserFilterListRef(): void {
    const user: any = JSON.parse(localStorage.getItem('next-level-user'));
    if (user != null) {
      this.databaseService.setUserId(user.uid);
    }
  }

  private async setUserData(userData: User): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(`users/${userData.uid}`);
    return userRef.set(userData, { merge: true });
  }

}
