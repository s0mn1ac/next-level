import { Component } from '@angular/core';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { AdministrationService } from 'src/app/shared/services/administration.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.page.html',
  styleUrls: ['./administration.page.scss'],
})
export class AdministrationPage {

  public allUsers: UserStructure[] = [];

  constructor(
    private loadingService: LoadingService,
    private administrationService: AdministrationService
  ) { }

  ionViewWillEnter() {
    this.getAllUsers();
  }

  private async getAllUsers(): Promise<void> {
    await this.loadingService.show('loadingUsers');
    this.allUsers = await this.administrationService.getAllUsers();
    await this.loadingService.hide();
  }

}
