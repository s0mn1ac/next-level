import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BaseService } from 'src/app/shared/services/base.service';
import { ConverterService } from 'src/app/shared/services/converter.service';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService extends BaseService {

  private url = 'https://api.rawg.io/api';
  private key = '?key=f5b9bcd495c6417d948da840a50adc5a';

  constructor(protected http: HttpClient, private converterService: ConverterService) {
    super(http);
  }

  public async getGames(): Promise<Game[]> {
    const report = await this.getGamesReport();
    return this.converterService.convertGamesFromReport(report);
  }

  public async getLastReleasedGames(): Promise<Game[]> {
    const report = await this.getLastReleasedGamesReport();
    return this.converterService.convertGamesFromReport(report);
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  private async getGamesReport(): Promise<any> {
    return this.serviceGet({
      url: `${this.url}/games${this.key}`,
      headers: new HttpHeaders({ token: 'f5b9bcd495c6417d948da840a50adc5a' }),
      callback: (response: any) => response.body,
      result: null
    });
  }

  private async getLastReleasedGamesReport(): Promise<any> {
    const dateStart: string = moment().subtract(1, 'month').format('YYYY-MM-DD');
    const dateEnd: string = moment().format('YYYY-MM-DD');
    return this.serviceGet({
      url: `${this.url}/games${this.key}`,
      // params: { dates: `${dateStart},${dateEnd}` },
      params: { dates: `${dateStart},${dateEnd}` },
      callback: (response: any) => response.body,
      result: null
    });
  }

}
