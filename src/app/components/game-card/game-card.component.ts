import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/app/shared/models/game.model';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {

  @Input() game: Game;
  @Input() ownScore = false;
  @Input() addToList = false;

  @Output() addToListEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  public statusButtonColor: string;
  public statusButtonValue: string;

  constructor(
    private router: Router
  ) {
    this.statusButtonColor = 'danger';
    this.statusButtonValue = 'Pendiente';
  }

  ngOnInit() {}

  public onClickNavigateToGame(gameId: number): void {
    this.router.navigate([`/game/${gameId}`]);
  }

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

  public onClickAddToListButton(event: any, game: Game): void {
    event.stopPropagation();
    this.addToListEventEmitter.emit(game);
  }

}
