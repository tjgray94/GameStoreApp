import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameListComponent } from './game-list/game-list.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { AddgameComponent } from './addgame/addgame.component';
import { AdduserComponent } from './adduser/adduser.component';
import { EditComponent } from './edit/edit.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'games', redirectTo: 'api/games', pathMatch: 'full'},
  { path: 'api/games', component: GameListComponent },
  { path: 'api/games/:gameId', component: GameDetailComponent },
  { path: 'home/user/:userId' , component: UserHomeComponent },
  { path: 'add', component: AddgameComponent},
  { path: 'api/games/:gameId/edit', component: EditComponent},
  { path: 'newUser', component: AdduserComponent},
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
