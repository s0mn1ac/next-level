import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  public userSubscription$: Subscription;

  public user: User;

  public breakpoints: number[] = [0, 0.3];
  public initialBreakpoint = 0.3;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.initUserSubscription();
  }

  ngOnDestroy(): void {
    this.userSubscription$?.unsubscribe();
  }

  public onClickLogOutButton(logOutModal: IonModal): void {
    logOutModal.dismiss();
    this.authService.signOut();
  }

  private initUserSubscription(): void {
    this.userSubscription$ = this.authService.userObservable?.subscribe((user: User) => this.user = user);
  }

}
