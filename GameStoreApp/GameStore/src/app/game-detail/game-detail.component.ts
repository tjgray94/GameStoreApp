import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../game';
import { GameService } from '../game.service';

@Component({
  selector: 'game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {

  pageTitle: string = 'Game Details';
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
  

  constructor(private gameService: GameService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['gameId'];
    this.gameService.getGame(this.id).subscribe(data => {
      this.game = data;
      this.currentGame = { ...data };
    })
  }

  getGame(id: number): void {
    this.gameService.getGame(id).subscribe(data => {
      this.currentGame = data;
      console.log(data);
    },
    error => {
      console.log(error);
    })
  }

  deleteGame(): void {
    this.gameService.delete(this.currentGame.gameId).subscribe(() => {
      this.router.navigate(['/api/games']);
    })
  }

  onBack(): void {
    this.router.navigate(['/api/games']);
  }

}
