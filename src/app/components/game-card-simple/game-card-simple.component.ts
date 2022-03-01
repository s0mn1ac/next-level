import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/shared/models/game.model';

@Component({
  selector: 'app-game-card-simple',
  templateUrl: './game-card-simple.component.html',
  styleUrls: ['./game-card-simple.component.scss'],
})
export class GameCardSimpleComponent implements OnInit {

  @Input() game: Game;

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

}
