import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from '../services/game-service';
import { Game } from '../models/game';

@Injectable({ providedIn: 'root' })
export class GameDetailResolver implements Resolve<Game> {

  constructor(private gameService: GameService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Game> {
    const gameId = Number(route.paramMap.get('gameId'));
    if (!gameId) {
      throw new Error('Invalid gameId');
    }
    return this.gameService.getGame(gameId);
  }
}