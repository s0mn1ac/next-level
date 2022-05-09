import { Component, Input } from '@angular/core';
import { Game } from 'src/app/shared/models/game.model';
import { List } from 'src/app/shared/models/list.model';

@Component({
  selector: 'app-next-level-list',
  templateUrl: './next-level-list.component.html',
  styleUrls: ['./next-level-list.component.scss'],
})
export class NextLevelListComponent {

  @Input() list: List;

  public getEmptySpaces(games: Game[]): any[] {
    return games?.length >= 4 ? [] : new Array(4 - games?.length);
  }

}
