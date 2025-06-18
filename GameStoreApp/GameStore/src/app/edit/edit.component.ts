import { Component, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../game';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
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
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  gameForm!: FormGroup;
  @ViewChild('gamesForm') form!: NgForm;

  constructor(private gameService: GameService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) { 
    this.initForm();
  }

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
      
      // If there's an existing image, set up the preview
      if (this.game.image) {
        // Set image preview for existing image
        this.imagePreview = `assets/${this.game.image}`;
      }
    });
  }

  initForm(): void {
    this.gameForm = this.fb.group({
      name: ['', [Validators.required]],
      image: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      releaseDate: ['', [Validators.required]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  // Getter for easy access to form fields
  get f(): { [key: string]: FormControl } {
    return this.gameForm.controls as { [key: string]: FormControl };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.selectedFile = file;
      
      // Update game object with filename
      if (this.game) {
        this.game.image = file.name;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submit(){
    const gameData = this.game;
    
    // Create FormData for file upload
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    
    formData.append('game', JSON.stringify(gameData));
    
    console.log('Submitting updated data:', gameData);
    this.gameService.update(this.userId, this.id, formData).subscribe(res => {
      this.router.navigate(['/user', this.userId, 'games']);
    });
  }
}
