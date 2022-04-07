import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { DarkModeService } from './shared/services/dark-mode.service';
import { LanguageService } from './shared/services/language.service';
import { ListService } from './shared/services/list.service';
import { LoadingService } from './shared/services/loading.service';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  private languageSubscription$: Subscription;
  private darkModeSubscription$: Subscription;
  private themeSubscription$: Subscription;

  private themes: string[] = ['red', 'orange', 'yellow', 'green', 'blue'];

  constructor(
    private translocoService: TranslocoService,
    private languageService: LanguageService,
    private darkModeService: DarkModeService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  ngOnDestroy(): void {
    this.languageSubscription$?.unsubscribe();
    this.darkModeSubscription$?.unsubscribe();
    this.themeSubscription$?.unsubscribe();
  }

  private initSubscriptions(): void {
    this.languageSubscription$ = this.languageService.languageObservable.subscribe((value: string) => this.setLanguage(value));
    this.darkModeSubscription$ = this.darkModeService.darkModeObservable.subscribe((value: boolean) => this.setDarkMode(value));
    this.themeSubscription$ = this.themeService.themeObservable.subscribe((value: string) => this.setTheme(value));
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
