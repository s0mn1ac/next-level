import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StatusEnum } from 'src/app/shared/enums/status.enum';
import { Game } from 'src/app/shared/models/game.model';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent {

  @Input() game: Game;
  @Input() ownScore = false;
  @Input() addToList = false;
  @Input() isStatusBarVisible = false;

  @Output() addToListEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  public statusEnum: typeof StatusEnum = StatusEnum;

  constructor(private router: Router) { }

  public onClickNavigateToGame(gameId: number): void {
    this.router.navigate([`/game/${gameId}`]);
  }

  public onClickAddToListButton(event: any, game: Game): void {
    event.stopPropagation();
    this.addToListEventEmitter.emit(game);
  }

}
