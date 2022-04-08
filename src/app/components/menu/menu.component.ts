import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription } from 'rxjs';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { User } from 'src/app/shared/interfaces/user.interface';
import { MenuItemModel } from 'src/app/shared/models/menu-item.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {

  public user$: Subscription;

  public userStructure: UserStructure;

  public menuItems: MenuItemModel[];

  constructor(private menuService: MenuService, private userService: UserService) { }

  ngOnInit(): void {
    this.setInitialData();
    this.initUserSubscription();
    this.buildMenuItems();
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe();
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

  private async buildMenuItems(): Promise<void> {
    this.menuItems = await this.menuService.getMenuItems();
  }

}
