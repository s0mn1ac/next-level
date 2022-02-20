import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItemModel } from 'src/app/shared/models/menu-item.model';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public menuItems: MenuItemModel[];

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    this.buildMenuItems();
  }

  private async buildMenuItems(): Promise<void> {
    this.menuItems = await this.menuService.getMenuItems();
  }

}
