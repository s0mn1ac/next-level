import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuItem } from 'src/app/shared/models/menu-item.model';
import { BaseService } from 'src/app/shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends BaseService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  public async getMenuItems(): Promise<MenuItem[]> {
    return await this.getMenuItemsReport() as MenuItem[];
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  private async getMenuItemsReport(): Promise<any> {
    return this.serviceGet({
      url: 'assets/data/menu-options.json',
      callback: (response: any) => response.body,
      result: null
    });
  }

}
