import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Game } from '../../../core/models/game';
import { GameService } from '../../../core/services/game-service';
import { SortState } from '../../../core/models/sortState';
import { Star } from '../../../shared/star/star';

@Component({
  selector: 'app-game-list',
  imports: [CurrencyPipe, DatePipe, FormsModule, RouterModule, Star],
  templateUrl: './game-list.html',
  styleUrl: './game-list.css',
})
export class GameList implements OnInit {

  id!: number;
  pageTitle = 'Games';
  errorMessage!: string;
  games: Game[] = [];
  currentGame?: Game;
  currentIndex = -1;
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  loading: boolean = false;
  filterValue: string = '';

  sortState: SortState = {
    column: 'gameId',
    direction: 'asc'
  };

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.route.data.subscribe(data => {
    //   const response = data['gamesData'];

    //   this.games = response.games || [];
    //   this.totalItems = response.totalItems;
    //   this.totalPages = response.totalPages;
    //   this.currentPage = response.currentPage;

    //   this.id = Number(this.route.snapshot.paramMap.get('userId'));
    // });
    
    this.id = Number(this.route.snapshot.paramMap.get('userId'));

    if (!this.id || isNaN(this.id)) return;

    this.currentPage = 0;
    this.loadUserGames(this.id);
  }

  loadUserGames(userId: number): void {
    this.loading = true;

    this.gameService.getGamesByUserId(
      userId,
      this.currentPage,
      this.pageSize,
      this.filterValue,
      this.sortState.column,
      this.sortState.direction
    )
    .subscribe({
      next: (response) => {
        this.games = response.games || [];
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.loading = false;

        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }

  onSort(column: string): void {
    if (this.sortState.column === column) {
      // Toggle direction if same column is clicked
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column and default to ascending
      this.sortState.column = column;
      this.sortState.direction = 'asc';
    }
    this.loadUserGames(this.id);
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
    if (!this.id) {
      console.error('User ID is not available');
      return;
    }
    
    this.gameService.delete(this.id, gameId).subscribe({
      next: () => {
        // Remove the deleted game from the list
        this.games = this.games.filter(game => game.gameId !== gameId);
        
        // Reset current selection if needed
        if (this.currentGame?.gameId === gameId) {
          this.currentGame = undefined;
          this.currentIndex = -1;
        }
  
        // If page is empty after deletion, go back one page
        if (this.games.length === 0 && this.currentPage > 0) {
          this.currentPage--;
        }
  
        // Reload current page
        this.loadUserGames(this.id);
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }

  onRatingClicked(message: string): void {
    this.pageTitle = 'Games: ' + message;
  }
}
