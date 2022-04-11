import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  @ViewChild('customSearchbar') customSearchbar: IonSearchbar;

  @Input() section = 'blank';
  @Input() searchButton = false;

  @Output() searchEventEmitter: EventEmitter<string> = new EventEmitter<string>();

  public value: string;

  public isSearchbarVisible: boolean;

  public showSearchbar() {
    this.isSearchbarVisible = true;
    setTimeout(() => this.customSearchbar.setFocus(), 1);
  }

  public hideSearchbar() {
    this.isSearchbarVisible = false;
  }

  public onSearch(event: any): void {
    this.value = event?.target?.value === '' ? null : event?.target?.value;
    this.searchEventEmitter.emit(this.value);
    this.isSearchbarVisible = false;
  }

}
