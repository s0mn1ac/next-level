import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription } from 'rxjs';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { User } from 'src/app/shared/interfaces/user.interface';
import { List } from 'src/app/shared/models/list.model';
import { MenuItemModel } from 'src/app/shared/models/menu-item.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ListService } from 'src/app/shared/services/list.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {


  public userStructure: UserStructure;

  public menuItems: MenuItemModel[];

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
    const menuItems: MenuItemModel[] = await this.menuService.getMenuItems();
    this.menuItems = [];
    menuItems?.forEach((menuItem: MenuItemModel, index) => {
      if (index === 2) {
        lists?.forEach((list: List) => this.menuItems.push({
          disabled: false,
          icon: 'star-outline',
          name: list.name,
          redirectTo: `/lists/${list.id}`
        }));
      }
      this.menuItems.push(menuItem);
    });
  }

}
