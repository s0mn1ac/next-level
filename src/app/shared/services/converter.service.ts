import { Injectable } from '@angular/core';
import { Platform } from '../models/platform.model';
import { Esrb } from '../models/esrb.model';
import { Game } from '../models/game.model';
import { Genre } from '../models/genre.model';
import { Store } from '../models/store.model';
import { ParentPlatform } from '../models/parent-platform.model';
import { Score } from '../models/score.model';


@Injectable({
    providedIn: 'root'
})
export class ConverterService {

    public convertGamesFromReport(report: any): Game[] {
        const games: Game[] = [];
        report?.results?.forEach((result: any) => {
            const game: Game = new Game();
            game.id = result.id;
            game.name = result.name;
            game.slug = result.slug;
            game.image = result.background_image;
            game.releaseDate = result.released;
            game.tba = result.tba;
            game.metascore = this.buildScore(result.metacritic);
            game.avgPlaytime = result.playtime;
            game.screenshots = result.screenshots?.map((screenshot: any) => screenshot.image);
            game.esrb = this.buildEsrb(result.esrb_rating);
            game.genres = this.buildGenres(result.genres);
            game.parentPlatforms = this.buildParentPlatforms(result.parent_platforms);
            game.platforms = this.buildPlatforms(result.platforms);
            game.stores = this.buildStores(result.stores);
            games.push(game);
        });
        return games;
    }

    private buildScore(scoreRaw: number): Score {
        const score: Score = new Score();
        score.value = scoreRaw;
        if (scoreRaw >= 0 && scoreRaw < 50) {
            score.color = 'score-red';
        } else if (scoreRaw >= 50 && scoreRaw < 75) {
            score.color = 'score-yellow';
        } else {
            score.color = 'score-green';
        }
        return score;
    }

    private buildEsrb(esrbRaw: any): Esrb {
        const esrb: Esrb = new Esrb();
        esrb.id = esrbRaw.id;
        esrb.name = esrbRaw.name;
        esrb.slug = esrbRaw.slug;
        return esrb;
    }

    private buildGenres(genresRaw: any[]): Genre[] {
        const genres: Genre[] = [];
        genresRaw?.forEach((genreRaw: any) => {
            const genre: Genre = new Genre();
            genre.id = genreRaw.id;
            genre.name = genreRaw.name;
            genre.slug = genreRaw.slug;
            genre.image = genreRaw.image_background;
            genres.push(genre);
        });
        return genres;
    }

    private buildParentPlatforms(parentPlatformsRaw: any): ParentPlatform[] {
        const parentPlatforms: ParentPlatform[] = [];
        parentPlatformsRaw?.forEach((parentPlatformRaw: any) => {
            const parentPlatform: ParentPlatform = new ParentPlatform();
            parentPlatform.id = parentPlatformRaw.platform.id;
            parentPlatform.name = parentPlatformRaw.platform.name;
            parentPlatform.slug = parentPlatformRaw.platform.slug;
            parentPlatform.image = `assets/images/platforms/${parentPlatform.slug}.svg`;
            parentPlatforms.push(parentPlatform);
        });
        return parentPlatforms;
    }

    private buildPlatforms(platformsRaw: any): Platform[] {
        const platforms: Platform[] = [];
        platformsRaw?.forEach((platformRaw: any) => {
            const platform: Platform = new Platform();
            platform.name = platformRaw.platform.name;
            platform.slug = platformRaw.platform.slug;
            platform.releaseDate = platformRaw.released_at;
            platforms.push(platform);
        });
        return platforms;
    }

    private buildStores(storesRaw: any): Store[] {
        const stores: Store[] = [];
        storesRaw?.forEach((storeRaw: any) => {
            const store: Store = new Store();
            store.id = storeRaw.store.id;
            store.name = storeRaw.store.name;
            store.slug = storeRaw.store.slug;
            store.domain = storeRaw.store.domain;
            store.image = storeRaw.store.image_background;
            stores.push(store);
        });
        return stores;
    }

}
