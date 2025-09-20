import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Game } from '../game';
import { GameService } from '../game.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  
  id!: number;
  games!: Game[];

  constructor(private route: ActivatedRoute,
              public router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['userId'];
  }

  viewInventory() {
    this.router.navigate([`/user/${this.id}/games`]);
  }

  addGame() {
    this.router.navigate([`/user/${this.id}/games/add`]);
  }
}
