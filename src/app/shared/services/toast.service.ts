import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { ErrorCodesConfig } from '../strings/error-codes.config';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private translocoService: TranslocoService, private toastController: ToastController) { }

  public async throwSuccessToast(successCode: string): Promise<void> {
    const message: string = this.translocoService.translate(`successCodes.${successCode}`);
    const toast = await this.toastController.create({ message, duration: 3000, color: 'success', mode: 'ios', icon: 'checkmark-outline' });
    await toast.present();
  }

  public async throwWarningToast(warningCode: string): Promise<void> {
    const message: string = this.translocoService.translate(`warningCodes.${warningCode}`);
    const toast = await this.toastController.create({ message, duration: 3000, color: 'warning', mode: 'ios', icon: 'alert-outline' });
    await toast.present();
  }

  public async throwErrorToast(errorCode: string): Promise<void> {
    const message: string = this.getMessageByErrorCode(errorCode);
    const toast = await this.toastController.create({ message, duration: 3000, color: 'danger', mode: 'ios', icon: 'close-outline' });
    await toast.present();
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  private getMessageByErrorCode(errorCode: string): string {
    switch (errorCode) {
      case ErrorCodesConfig.authEmailAlreadyInUse:
        return this.translocoService.translate('errorCodes.authEmailAlreadyInUse');
      case ErrorCodesConfig.authWrongPassword:
        return this.translocoService.translate('errorCodes.authWrongPassword');
      case ErrorCodesConfig.authUserNotFound:
        return this.translocoService.translate('errorCodes.authUserNotFound');
      default:
        return this.translocoService.translate('errorCodes.default');
    }
  }

}
