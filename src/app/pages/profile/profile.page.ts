import { Component, OnInit } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public breakpoints: number[] = [0, 0.3];
  public initialBreakpoint = 0.3;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  public onClickLogOutButton(logOutModal: IonModal): void {
    logOutModal.dismiss();
    this.authService.signOut();
  }

}
