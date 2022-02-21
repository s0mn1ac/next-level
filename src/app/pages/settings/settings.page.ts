import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { DarkModeService } from 'src/app/shared/services/dark-mode.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  public languageSelected: string;

  public isDarkModeEnabled: boolean;

  private darkModeSubscription$: Subscription;

  constructor(private translocoService: TranslocoService, private darkModeService: DarkModeService) { }

  ngOnInit() {
    this.getActiveLanguage();
    this.initializeDarkModeSubscription();
  }

  ngOnDestroy(): void {
    this.darkModeSubscription$?.unsubscribe();
  }

  public onClickChangeLanguageButton(event: any): void {
    this.translocoService.setActiveLang(event?.detail?.value);
  }

  public onChangeDarkMode(): void {
    this.darkModeService.onChangeDarkModeValue(this.isDarkModeEnabled);
  }

  private getActiveLanguage(): void {
    this.languageSelected = this.translocoService.getActiveLang();
  }

  private initializeDarkModeSubscription(): void {
    this.darkModeSubscription$ = this.darkModeService.darkModeObservable.subscribe((value: boolean) => this.isDarkModeEnabled = value);
  }

}
