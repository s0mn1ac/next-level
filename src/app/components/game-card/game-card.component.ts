import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from 'src/app/shared/models/game.model';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {

  @Input() game: Game;
  @Input() isOwnScoreVisible = false;

  @Output() addToListEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  public statusButtonColor: string;
  public statusButtonValue: string;

  constructor() {
    this.statusButtonColor = 'danger';
    this.statusButtonValue = 'Pendiente';
  }

  ngOnInit() {}

  public onClickChangeButtonStatus(): void {
    if (this.statusButtonColor === 'danger') {
      this.statusButtonColor = 'warning';
      this.statusButtonValue = 'Jugando';
    } else if (this.statusButtonColor === 'warning') {
      this.statusButtonColor = 'success';
      this.statusButtonValue = 'Completado';
    } else if (this.statusButtonColor === 'success') {
      this.statusButtonColor = 'danger';
      this.statusButtonValue = 'Pendiente';
    }
  }

  public onClickAddToListButton(game: Game): void {
    this.addToListEventEmitter.emit(game);
  }

}
