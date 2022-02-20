import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private translocoService: TranslocoService) {}

  public onClickChangeLanguageButton(language: string): void {
    this.translocoService.setActiveLang(language);
  }

}
