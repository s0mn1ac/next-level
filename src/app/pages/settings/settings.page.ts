import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoleEnum } from 'src/app/shared/enums/role.enum';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public languageSelected: string;
  public themeSelected: string;

  public isProUser: boolean;
  public isDarkModeEnabled: boolean;

  private user$: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.setInitialData();
    this.initSubscriptions();
  }

  public onChangeLanguage(event: any): void {
    this.userService.modifyUser('language', event?.detail?.value);
  }

  public onChangeDarkMode(): void {
    this.userService.modifyUser('mode', this.isDarkModeEnabled ? 'dark' : 'light');
  }

  public onChangeTheme(event: any): void {
    this.userService.modifyUser('theme', event?.detail?.value);
  }

  private initSubscriptions(): void {
    this.user$ = this.userService.userObservable.subscribe((value: UserStructure) => this.setUserStructure(value));
  }

  private setInitialData(): void {
    const userStructure: UserStructure = JSON.parse(localStorage.getItem('next-level-user'));
    this.setUserStructure(userStructure);
  }

  private setUserStructure(userStructure: UserStructure): void {
    if (userStructure != null) {
      this.languageSelected = userStructure.language;
      this.isDarkModeEnabled = userStructure.mode === 'dark';
      this.themeSelected = userStructure.theme;
      this.isProUser = userStructure.role === RoleEnum.pro || userStructure.role === RoleEnum.admin;
    }
  }

}
