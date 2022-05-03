import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-next-level-note-modal',
  templateUrl: './next-level-note-modal.component.html',
  styleUrls: ['./next-level-note-modal.component.scss'],
})
export class NextLevelNoteModalComponent implements OnInit {

  @ViewChild('modal') modal: IonModal;

  @Output() noteEventEmitter: EventEmitter<string> = new EventEmitter<string>();

  public breakpoints: number[] = [0, 0.5];
  public initialBreakpoint = 0.5;

  public value: string;

  constructor() { }

  ngOnInit() {}

  public show(value = ''): void {
    this.value = value;
    this.modal.present();
  }

  public onClickModalButton(note: string): void {
    this.noteEventEmitter.emit(note);
    this.modal.dismiss();
  }

}
