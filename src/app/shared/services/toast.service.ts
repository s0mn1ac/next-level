import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ErrorCodesConfig } from '../strings/error-codes.config';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private url = 'https://api.rawg.io/api';
  private key = '?key=f5b9bcd495c6417d948da840a50adc5a';

  constructor(private translocoService: TranslocoService) {}

  public throwError(errorCode: string): void {
    const message: string = this.getMessageByErrorCode(errorCode);
    console.warn(message);
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  private getMessageByErrorCode(errorCode: string): string {
    switch (errorCode) {
      case ErrorCodesConfig.authEmailAlreadyInUse:
        return this.translocoService.translate('errorCodes.authEmailAlreadyInUse');
      default:
        break;
    }
  }

}
