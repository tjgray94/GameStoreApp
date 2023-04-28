import { Component, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../game';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id!: number;
  game!: Game;
  @ViewChild('gamesForm') form!: NgForm;

  constructor(private gameService: GameService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['gameId'];
    this.gameService.getGame(this.id).subscribe(data => {
      this.game = data;
    })
  }

  submit(){
    this.gameService.update(this.id, this.form.value).subscribe(res => {
      this.router.navigateByUrl('/api/games')
    })
  }
}
