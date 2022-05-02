import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  public isLoading = true;

  private loading: HTMLIonLoadingElement;

  constructor(private translocoService: TranslocoService, private loadingController: LoadingController) { }

  public async show(message: string): Promise<void> {
    this.loading = await this.loadingController.create({ message: this.translocoService.translate(`loadingScreens.${message}`) });
    await this.loading?.present();
  }

  public async hide(): Promise<void> {
    await this.loading?.dismiss();
  }

  public showLoadingScreen(): void {
    this.isLoading = true;
  }

  public hideLoadingScreen(): void {
    setTimeout(() => this.isLoading = false, 3000);
  }

}
