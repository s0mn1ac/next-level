import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public languageSelected: string;

  constructor(private translocoService: TranslocoService) { }

  ngOnInit() {
    this.getActiveLanguage();
  }

  public onClickChangeLanguageButton(event: any): void {
    this.translocoService.setActiveLang(event?.detail?.value);
  }

  private getActiveLanguage(): void {
    this.languageSelected = this.translocoService.getActiveLang();
  }

}
