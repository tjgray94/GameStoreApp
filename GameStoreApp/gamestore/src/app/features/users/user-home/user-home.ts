import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Game } from '../../../core/models/game';
import { AuthService } from '../../../core/services/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-home',
  imports: [CommonModule],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css',
})

export class UserHome implements OnInit, OnDestroy {

  userId: number | null = null;
  private userSub!: Subscription;
  games!: Game[];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.params['userId'];
    if (paramId) {
      this.userId = Number(paramId);
    } else {
      this.userSub = this.authService.currentUser$.subscribe(user => {
        if (user && user.userId) {
          this.userId = Number(user.userId);
        } else {
          this.userId = null;
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  viewInventory() {
    if (this.userId != null) {
      console.log('Navigating to games for userId:', this.userId, typeof this.userId);
      this.router.navigate([`/user/${this.userId}/games`]);
    }
  }

  addGame() {
    this.router.navigate([`/user/${this.userId}/games/add`]);
  }
}
