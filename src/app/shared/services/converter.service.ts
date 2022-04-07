import { Injectable } from '@angular/core';
import { Platform } from '../models/platform.model';
import { Esrb } from '../models/esrb.model';
import { Game } from '../models/game.model';
import { Genre } from '../models/genre.model';
import { Store } from '../models/store.model';
import { ParentPlatform } from '../models/parent-platform.model';
import { Score } from '../models/score.model';
import { List } from '../models/list.model';
import { CollectionReference, DocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Developer } from '../models/developer.model';
import { Publisher } from '../models/publisher.model';
import { ResponseData } from '../models/response-data.model';


@Injectable({
    providedIn: 'root'
})
export class ConverterService {

    public async convertAllListsFromReport(report: CollectionReference): Promise<List[]> {
        const allLists: List[] = [];
        await report.get().then( async (querySnapshot: QuerySnapshot<List[]>) => {
            for await (const queryDocumentSnapshot of querySnapshot.docs) {
                allLists.push(await this.convertListFromReport(queryDocumentSnapshot.ref));
            }
        });
        return allLists;
    }

    public async convertListFromReport(report: any): Promise<List> {
        const list: List = new List();
        await report.get().then( async (listSnapshot: DocumentSnapshot<List>) => {
            const listData: any = listSnapshot.data();
            list.id = listSnapshot.id;
            list.name = listData.name;
            list.isPublic = listData.isPublic;
            list.games = [];
            for await (const gameDocumentReference of listData.games) {
                await gameDocumentReference.get().then((gameSnapshot: DocumentSnapshot<Game>) => {
                    list.games.push(gameSnapshot.data());
                });
            }
        });

        return list;
    }

    public convertGamesFromReport(report: any): ResponseData {

        const games: Game[] = [];
        report?.results?.forEach((result: any) => {
            const game: Game = new Game();
            game.id = result.id;
            game.name = result.name;
            game.slug = result.slug;
            game.image = result.background_image;
            game.releaseDate = result.released;
            game.tba = result.tba;
            game.metascore = new Score(result.metacritic);
            game.score = new Score(result.score);
            game.avgPlaytime = result.playtime;
            game.screenshots = result.screenshots?.map((screenshot: any) => screenshot.image);
            game.esrb = result.esrb_rating != null ? this.buildEsrb(result.esrb_rating) : null;
            game.genres = this.buildGenres(result.genres);
            game.parentPlatforms = this.buildParentPlatforms(result.parent_platforms);
            game.platforms = this.buildPlatforms(result.platforms);
            game.stores = this.buildStores(result.stores);
            games.push(game);
        });

        const responseData: ResponseData = new ResponseData();
        responseData.count = report.count;
        responseData.next = report.next;
        responseData.previous = report.previous;
        responseData.results = games;
        return responseData;
    }

    public async convertGameFromReport(report: any): Promise<Game> {
        const game: Game = new Game();
        await report.get().then( async (gameSnapshot: DocumentSnapshot<List>) => {
            const gameData: any = gameSnapshot.data();
            if (gameData === undefined) {
                return;
            }
            game.id = gameData.id;
            game.name = gameData.name;
            game.slug = gameData.slug;
            game.image = gameData.image;
            game.releaseDate = gameData.releaseDate;
            game.tba = gameData.tba;
            game.metascore = gameData.metascore;
            game.score = gameData.score;
            game.avgPlaytime = gameData.avgPlaytime;
            game.screenshots = gameData.screenshots;
            game.esrb = gameData.esrb;
            game.genres = gameData.genres;
            game.parentPlatforms = gameData.parentPlatforms;
            game.platforms = gameData.platforms;
            game.stores = gameData.stores;
            game.description = gameData.description;
            game.dominantColor = `#${gameData.dominant_color}`;
            game.saturatedColor = `#${gameData.saturated_color}`;
            game.developers = this.buildDevelopers(gameData.developers);
            game.publishers = this.buildPublishers(gameData.publishers);
            game.completed = gameData.completed;
        });
        return game;
    }

    public convertGameInfoFromReport(report: any): Game {
        const game: Game = new Game();
        game.id = report.id;
        game.name = report.name;
        game.slug = report.slug;
        game.image = report.background_image;
        game.releaseDate = report.released;
        game.tba = report.tba;
        game.metascore = new Score(report.metacritic);
        game.score = new Score(report.score);
        game.avgPlaytime = report.playtime;
        game.screenshots = report.screenshots?.map((screenshot: any) => screenshot.image);
        game.esrb = report.esrb_rating != null ? this.buildEsrb(report.esrb_rating) : null;
        game.genres = this.buildGenres(report.genres);
        game.parentPlatforms = this.buildParentPlatforms(report.parent_platforms);
        game.platforms = this.buildPlatforms(report.platforms);
        game.stores = this.buildStores(report.stores);
        game.description = report.description;
        game.dominantColor = `#${report.dominant_color}`;
        game.saturatedColor = `#${report.saturated_color}`;
        game.developers = this.buildDevelopers(report.developers);
        game.publishers = this.buildPublishers(report.publishers);
        return game;
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

    private buildDevelopers(developersRaw: any): Developer[] {
        const developers: Developer[] = [];
        developersRaw?.forEach((developerRaw: any) => {
            const developer: Developer = new Developer();
            developer.id = developerRaw.id;
            developer.name = developerRaw.name;
            developer.slug = developerRaw.slug;
            developers.push(developer);
        });
        return developers;
    }

    private buildPublishers(publishersRaw: any): Publisher[] {
        const publishers: Publisher[] = [];
        publishersRaw?.forEach((publisherRaw: any) => {
            const publisher: Publisher = new Publisher();
            publisher.id = publisherRaw.id;
            publisher.name = publisherRaw.name;
            publisher.slug = publisherRaw.slug;
            publishers.push(publisher);
        });
        return publishers;
    }

}
