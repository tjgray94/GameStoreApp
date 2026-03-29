import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from '../services/game-service';

@Injectable({ providedIn: 'root' })
export class GamesResolver implements Resolve<any> {

  constructor(private gameService: GameService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const userId = Number(route.paramMap.get('userId'));

    if (!userId) {
      throw new Error('Invalid userId');
    }

    return this.gameService.getGamesByUserId(
      userId,
      0,
      10,
      '',
      'gameId',
      'asc'
    );
  }
}
