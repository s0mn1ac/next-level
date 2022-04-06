import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { NextLevelModalOptions } from 'src/app/shared/interfaces/next-level-modal-options.interface';

@Component({
  selector: 'app-next-level-modal',
  templateUrl: './next-level-modal.component.html',
  styleUrls: ['./next-level-modal.component.scss'],
})
export class NextLevelModalComponent implements OnInit {

  @ViewChild('modal') modal: IonModal;

  public breakpoints: number[] = [0, 0.3];
  public initialBreakpoint = 0.3;

  public nextLevelModalOptions: NextLevelModalOptions;

  constructor() { }

  ngOnInit() {}

  public show(nextLevelModalOptions: NextLevelModalOptions): void {
    this.nextLevelModalOptions = nextLevelModalOptions;
    this.modal.present();
  }

  public onClickModalButton(): void {
    this.nextLevelModalOptions.command();
    this.modal.dismiss();
  }

}
