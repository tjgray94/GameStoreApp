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
  imageWidth = 50;
  imageMargin = 2;
  showImage: boolean = false;
  errorMessage!: string;
  sub!: Subscription;
  
  games!: Game[];
  currentGame?: Game;
  currentIndex = -1;
  
  constructor(private gameService: GameService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    // Get userId from route parameters
    const userId = this.route.snapshot.params['userId'];
    
    if (userId) {
      // Store userId for later use
      this.id = userId;
      
      // Get games for this user
      this.gameService.getGamesByUserId(userId).subscribe((data) => {
        this.games = data;
        this.filteredGames = data;
      });
    } else {
      console.error('User ID not found in route parameters');
    }
  }

  retrieveGames(): void {
    this.gameService.getAll().subscribe(data => {
      this.games = data;
    })
  }
  refreshList(): void {
    this.retrieveGames();
    this.currentGame = undefined;
    this.currentIndex = -1;
  }
  setActiveGame(game: Game, index: number): void {
    this.currentGame = game;
    this.currentIndex = index;
  }
  removeAllGames(): void {
    this.gameService.deleteAll().subscribe(data => {
      this.refreshList();
    })
  }

  // getAllGames(){
  //   this.games = this.gameService.getAllGames();
  // }

  // getGames() {
  //   this.gameService.getGames().subscribe({
  //     next: games => this.games = games,
  //     error: error => this.errorMessage = <any>error
  //   })
  // }
  
  private _listFilter: string = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter: ', value);
    this.filteredGames = this.performFilter(value);
  }

  filteredGames: Game[] = [];

  performFilter(filterBy: string): Game[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.games.filter((game: Game) => 
      game.name.toLocaleLowerCase().includes(filterBy));
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }


  addGame(name: string, image: string, _price: string, releaseDate: string, _rating: string): void {
    let price = parseInt(_price)
    let rating = parseInt(_rating)
    this.gameService.addGame({name, image, price, releaseDate, rating}).subscribe({
      next:(game: any) => this.games.push(game)
    })
  }

  updateGame(id: string, name: string, image: string, _price: string, releaseDate: string, _rating: string): void {
    let gameId = parseInt(id)
    let price = parseInt(_price)
    let rating = parseInt(_rating)
    this.gameService.updateGame({gameId, name, image, price, releaseDate, rating}).subscribe({
      next:(game: any) => this.games = game
    })
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
