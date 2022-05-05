import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-empty-screen',
  templateUrl: './empty-screen.component.html',
  styleUrls: ['./empty-screen.component.scss'],
})
export class EmptyScreenComponent {

  @Input() icon: string;
  @Input() title: string;
  @Input() description: string;
  @Input() buttonLabel: string;
  @Input() showButton = true;

  @Output() clickEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  public onClick(): void {
    this.clickEventEmitter.emit();
  }

}
