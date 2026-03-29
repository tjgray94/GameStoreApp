import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  public isLoggedIn = false;
  public currentUserId: number | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.userId || null;
    });
  }

  goToGames() {
    this.router.navigate(['/user', this.currentUserId, 'games']);
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
