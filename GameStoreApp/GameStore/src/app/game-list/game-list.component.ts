import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from '../game';
import { GameService } from '../game.service';

@Component({
  selector: 'game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, OnDestroy {

  id!: number;
  pageTitle = 'Games';
  errorMessage!: string;
  sub!: Subscription;
  games!: Game[];
  currentGame?: Game;
  currentIndex = -1;
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  loading: boolean = false;
  filterValue: string = '';
  
  constructor(private gameService: GameService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    // Get userId from route parameters
    const userId = this.route.snapshot.params['userId'];
    
    if (userId) {
      // Store userId for later use
      this.id = userId;
      this.loadUserGames(userId);
    } else {
      console.error('User ID not found in route parameters');
    }
  }

  loadUserGames(userId: number): void {
    this.loading = true;

    this.gameService.getGamesByUserId(userId, this.currentPage, this.pageSize, this.filterValue)
    .subscribe({
      next: (response) => {
        this.games = response.games;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadUserGames(this.id);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUserGames(this.id);
    }
  }

  refreshList(): void {
    this.currentPage = 0; // Reset to first page
    this.loadUserGames(this.id);
    this.currentGame = undefined;
    this.currentIndex = -1;
  }

  onFilterChange(value: string): void {
    this.filterValue = value;
    this.currentPage = 0; // Reset to first page when filter changes
    this.loadUserGames(this.id);
  }

  setActiveGame(game: Game, index: number): void {
    this.currentGame = game;
    this.currentIndex = index;
  }
  
  removeAllGames(): void {
    this.gameService.deleteAll().subscribe({
      next: () => {
        this.refreshList();
      },
      error: (error) => {
        this.errorMessage = error;
      }
    })
  }
  
  goBack(): void {
    this.router.navigate(['/user', 'home', this.id]);
  }
  
  delete(gameId: number) {
    // Get the userId from the route parameters
    const userId = this.route.snapshot.params['userId'];
    
    if (!userId) {
      console.error('User ID is not available');
      return;
    }
    
    this.gameService.delete(userId, gameId).subscribe(res => {
      // Remove the deleted game from the games array
      this.games = this.games.filter(game => game.gameId !== gameId);
      
      // Reset current game if it was the deleted one
      if (this.currentGame && this.currentGame.gameId === gameId) {
        this.currentGame = undefined;
        this.currentIndex = -1;
      }
    });
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  onRatingClicked(message: string): void {
    this.pageTitle = 'Games: ' + message;
  }
}
