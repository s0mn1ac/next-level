import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { UserStructure } from './shared/interfaces/user-structure.interface';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  private user$: Subscription;

  private themes: string[] = ['red', 'orange', 'yellow', 'green', 'blue'];

  constructor(
    private translocoService: TranslocoService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.setInitialData();
    this.initUserSubscription();
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe();
  }

  private setInitialData(): void {
    console.log('Powered by RAWG: https://rawg.io/apidocs');
    const userStructure: UserStructure = JSON.parse(localStorage.getItem('next-level-user'));
    this.setUserStructure(userStructure);
  }

  private setUserStructure(userStructure: UserStructure): void {
    if (userStructure != null) {
      this.setDarkMode(userStructure.mode === 'dark');
      this.setLanguage(userStructure.language);
      this.setTheme(userStructure.theme);
    }
  }

  private initUserSubscription(): void {
    this.user$ = this.userService.userObservable.subscribe((value: UserStructure) => this.setUserStructure(value));
  }

  private setLanguage(languageSelected: string): void {
    this.translocoService.setActiveLang(languageSelected);
  }

  private setDarkMode(isDarkModeEnabled: boolean): void {
    document.body.classList.toggle('dark', isDarkModeEnabled);
  }

  private setTheme(themeSelected: string): void {
    this.themes?.forEach((theme: string) => document.body.classList.toggle(theme, themeSelected === theme));
  }

}
