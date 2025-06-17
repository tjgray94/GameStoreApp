import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUserId: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
    
    // Subscribe to current user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.userId || null;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}
