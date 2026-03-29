import { Routes } from '@angular/router';
import { Welcome } from './features/welcome/welcome';
import { About } from './features/about/about';
import { Login } from './features/auth/login/login';
import { AddUser } from './features/users/add-user/add-user';
import { UserHome } from './features/users/user-home/user-home';
import { GameList } from './features/games/game-list/game-list';
import { GamesResolver } from './core/resolvers/games-resolver';
import { AddGame } from './features/games/add-game/add-game';
import { GameDetail } from './features/games/game-detail/game-detail';
import { GameDetailResolver } from './core/resolvers/game-detail-resolver';
import { UpdateGame } from './features/games/update-game/update-game';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'about', component: About },
  { path: 'login', component: Login },
  { path: 'addUser', component: AddUser },
  { path: 'user/home/:userId', component: UserHome },
  { path: 'user/:userId/games', component: GameList },
  { path: 'user/:userId/games/add', component: AddGame },
  { path: 'user/:userId/games/:gameId', component: GameDetail, resolve: { game: GameDetailResolver } },
  { path: 'user/:userId/games/:gameId/update', component: UpdateGame }
];
