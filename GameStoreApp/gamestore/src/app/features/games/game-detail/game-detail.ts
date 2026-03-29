import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Star } from '../../../shared/star/star';
import { Game } from '../../../core/models/game';
import { GameService } from '../../../core/services/game-service';

@Component({
  selector: 'app-game-detail',
  imports: [CurrencyPipe, DatePipe, RouterModule, Star],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.css',
})
export class GameDetail implements OnInit {

  pageTitle = 'Game Detail';
  currentGame: Game = {
    name: '',
    image: '',
    price: 0,
    releaseDate: '',
    rating: 0
  };
  gameId: number = 0;
  @Input() game!: Game;
  id!: number;
  isLoading: boolean = true;
  hasError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('userId'));

    this.route.data.subscribe(({ game }) => {
      this.game = game;
      this.isLoading = false;
      this.hasError = false;
    });
  }

  updateGame(): void {
    this.router.navigate(['/user', this.id, 'games', this.game.gameId, 'update']);
  }

  deleteGame(): void {
    this.gameService.delete(this.id, this.gameId).subscribe(() => {
      this.router.navigate(['/user', this.id, 'games']);
    });
  }

  onBack(): void {
    this.router.navigate(['/user', this.id, 'games']);
  }
}
