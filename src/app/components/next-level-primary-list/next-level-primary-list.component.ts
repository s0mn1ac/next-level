import { Component, Input, OnInit } from '@angular/core';
import { StatusEnum } from 'src/app/shared/enums/status.enum';
import { List } from 'src/app/shared/models/list.model';

@Component({
  selector: 'app-next-level-primary-list',
  templateUrl: './next-level-primary-list.component.html',
  styleUrls: ['./next-level-primary-list.component.scss'],
})
export class NextLevelPrimaryListComponent implements OnInit {

  @Input() list: List;

  public statusEnum: typeof StatusEnum = StatusEnum;

  constructor() { }

  ngOnInit() {}

}
