import { Component, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../game';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id!: number;
  game!: Game;
  userId!: number;
  @ViewChild('gamesForm') form!: NgForm;

  constructor(private gameService: GameService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['gameId'];
    
    // Get userId from route parameters first
    const routeUserId = this.route.snapshot.params['userId'];
    if (routeUserId) {
      this.userId = routeUserId;
    } else {
      // Fallback to current user from auth service
      const currentUser = this.authService.currentUser;
      if (currentUser && currentUser.userId) {
        this.userId = currentUser.userId;
      }
    }
    
    this.gameService.getGame(this.id).subscribe(data => {
      this.game = data;
    })
  }

  submit(){
    const gameData = this.game;
    this.gameService.update(this.userId, this.id, gameData).subscribe(res => {
      this.router.navigate(['/user', this.userId, 'games']);
    })
  }
}
