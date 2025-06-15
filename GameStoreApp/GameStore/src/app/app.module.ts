import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GameListComponent } from './game-list/game-list.component';
import { StarComponent } from './star/star.component';
import { HttpClientModule } from '@angular/common/http'
import { GameService } from './game.service';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { GameDetailGuard } from './game-detail.guard';
import { AddgameComponent } from './addgame/addgame.component';
import { EditComponent } from './edit/edit.component';
import { AdduserComponent } from './adduser/adduser.component';
import { FooterComponent } from './footer/footer.component';
import { UserHomeComponent } from './user-home/user-home.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    GameListComponent,
    StarComponent,
    GameDetailComponent,
    WelcomeComponent,
    AboutComponent,
    LoginComponent,
    AddgameComponent,
    EditComponent,
    AdduserComponent,
    FooterComponent,
    UserHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'games', component: GameListComponent },
      { path: 'games/:id', canActivate: [GameDetailGuard], component: GameDetailComponent },
      { path: 'welcome', component: WelcomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full'}
    ])
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
