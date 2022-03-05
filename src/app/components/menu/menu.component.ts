import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';
import { MenuItemModel } from 'src/app/shared/models/menu-item.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {

  public userSubscription$: Subscription;

  public user: User;

  public menuItems: MenuItemModel[];

  constructor(private menuService: MenuService, private authService: AuthService) { }

  ngOnInit(): void {
    this.initUserSubscription();
    this.buildMenuItems();
  }

  ngOnDestroy(): void {
    this.userSubscription$?.unsubscribe();
  }

  private initUserSubscription(): void {
    this.userSubscription$ = this.authService.userObservable?.subscribe((user: User) => this.user = user);
  }

  private async buildMenuItems(): Promise<void> {
    this.menuItems = await this.menuService.getMenuItems();
  }

}
