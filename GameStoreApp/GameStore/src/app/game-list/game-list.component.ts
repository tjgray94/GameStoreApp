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
  private _listFilter: string = '';
  filteredGames: Game[] = [];
  
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
    console.log(`Requesting games - userId: ${this.id}, page: ${this.currentPage}, pageSize: ${this.pageSize}`);

    this.gameService.getGamesByUserId(userId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Received response:', response);
        this.games = response.games;
        this.filteredGames = response.games;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        console.log(`Updated state - totalItems: ${this.totalItems}, totalPages: ${this.totalPages}, currentPage: ${this.currentPage}`);
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
  
  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter: ', value);
    this.filteredGames = this.performFilter(value);
  }

  performFilter(filterBy: string): Game[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.games.filter((game: Game) => 
      game.name.toLocaleLowerCase().includes(filterBy));
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
      // Update filtered games as well
      this.filteredGames = this.filteredGames.filter(game => game.gameId !== gameId);
      
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
