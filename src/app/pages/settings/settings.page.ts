import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { DarkModeService } from 'src/app/shared/services/dark-mode.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  public languageSelected: string;
  public themeSelected: string;
  public isDarkModeEnabled: boolean;

  private languageSubscription$: Subscription;
  private darkModeSubscription$: Subscription;
  private themeSubscription$: Subscription;

  constructor(
    private translocoService: TranslocoService,
    private languageService: LanguageService,
    private darkModeService: DarkModeService,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.initializeLanguageSubscription();
    this.initializeDarkModeSubscription();
    this.initializeThemeSubscription();
  }

  ngOnDestroy(): void {
    this.languageSubscription$?.unsubscribe();
    this.darkModeSubscription$?.unsubscribe();
    this.themeSubscription$?.unsubscribe();
  }

  public onChangeLanguage(event: any): void {
    this.languageService.onChangeLanguageValue(event?.detail?.value);
  }

  public onChangeDarkMode(): void {
    this.darkModeService.onChangeDarkModeValue(this.isDarkModeEnabled);
  }

  public onChangeTheme(theme: string): void {
    this.themeService.onChangeThemeValue(theme);
  }

  private initializeLanguageSubscription(): void {
    this.languageSubscription$ = this.languageService.languageObservable.subscribe((value: string) => this.languageSelected = value);
  }

  private initializeDarkModeSubscription(): void {
    this.darkModeSubscription$ = this.darkModeService.darkModeObservable.subscribe((value: boolean)=> this.isDarkModeEnabled = value);
  }

  private initializeThemeSubscription(): void {
    this.themeSubscription$ = this.themeService.themeObservable.subscribe((value: string) => this.themeSelected = value);
  }

}
