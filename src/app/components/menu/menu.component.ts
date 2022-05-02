import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { List } from 'src/app/shared/models/list.model';
import { MenuItem } from 'src/app/shared/models/menu-item.model';
import { ListService } from 'src/app/shared/services/list.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MenuService } from './menu.service';
import { RoleEnum } from 'src/app/shared/enums/role.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {

  public userStructure: UserStructure;

  public menuItems: MenuItem[];

  public isAppLoaded = false;

  private user$: Subscription;
  private lists$: Subscription;

  constructor(
    private menuService: MenuService,
    private listService: ListService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.setInitialData();
    this.initUserSubscription();
    this.initListsSubscription();
    this.buildMenuItems();
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe();
    this.lists$?.unsubscribe();
  }

  private setInitialData(): void {
    const userStructure: UserStructure = JSON.parse(localStorage.getItem('next-level-user'));
    this.setUserStructure(userStructure);
  }

  private setUserStructure(userStructure: UserStructure): void {
    if (userStructure != null) {
      this.userStructure = userStructure;
    }
  }

  private initUserSubscription(): void {
    this.user$ = this.userService.userObservable?.subscribe((value: UserStructure) => this.setUserStructure(value));
  }

  private initListsSubscription(): void {
    this.lists$ = this.listService.listsObservable.subscribe((lists: List[]) => this.loadLists(lists));
  }

  private loadLists(lists: List[]): void {
    const favorites: List[] = lists?.filter((list: List) => list.isFavorite);
    this.buildMenuItems(favorites);
  }

  private async buildMenuItems(lists?: List[]): Promise<void> {
    const menuItems: MenuItem[] = await this.menuService.getMenuItems();
    this.menuItems = [];
    menuItems?.forEach((menuItem: MenuItem, index) => {
      if (index === 2) {
        lists?.forEach((list: List) => this.menuItems.push({
          disabled: false,
          icon: 'star-outline',
          color: 'primary',
          name: list.name,
          translate: false,
          redirectTo: `/lists/${list.id}`
        }));
      }
      this.menuItems.push(menuItem);
    });
    if (this.userStructure.role === RoleEnum.admin) {
      this.menuItems.push({
        disabled: false,
        icon: 'podium-outline',
        color: 'primary',
        name: 'administration',
        translate: true,
        redirectTo: '/administration'
      });
    }
    this.isAppLoaded = true;
  }

}
