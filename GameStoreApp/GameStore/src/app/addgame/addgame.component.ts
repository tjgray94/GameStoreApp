import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../game';
import { GameService } from '../game.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'addgame',
  templateUrl: './addgame.component.html',
  styleUrls: ['./addgame.component.css']
})
export class AddgameComponent implements OnInit {

  gameForm!: FormGroup;
  submitted = false;
  formSubmitted = false;
  userId!: number;

  constructor(private gameService: GameService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) { this.initForm(); }

  ngOnInit(): void {
    // Get userId from route parameters
    const routeUserId = this.route.snapshot.params['userId'];
    
    if (routeUserId) {
      this.userId = routeUserId;
    } else {
      // Fallback to current user from auth service
      const currentUser = this.authService.currentUser;
      if (currentUser && currentUser.userId) {
        this.userId = currentUser.userId;
      } else {
        console.error('User ID not available from route or auth service');
      }
    }
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

  saveGame(): void {
    this.formSubmitted = true;
    
    // Log validation status for debugging
    console.log('Form valid:', this.gameForm.valid);
    console.log('Form errors:', this.gameForm.errors);
    console.log('Form value:', this.gameForm.value);
    
    // Stop here if form is invalid
    if (this.gameForm.invalid) {
      console.log('Form is invalid, validation errors:', {
        name: this.f.name.errors,
        price: this.f.price.errors,
        releaseDate: this.f.releaseDate.errors,
        rating: this.f.rating.errors
      });
      return;
    }

    const data = {
      userId: this.userId,
      name: this.f.name.value,
      image: this.f.image.value,
      price: this.f.price.value, 
      releaseDate: this.f.releaseDate.value,
      rating: this.f.rating.value
    };
    
    console.log('Submitting data:', data);
    this.gameService.create(data).subscribe(response => { 
      console.log('Server response:', response); 
      this.submitted = true;
    });
  }

  newGame(): void {
    this.submitted = false;
    this.formSubmitted = false;
    this.gameForm.reset({
      name: '',
      image: '',
      price: '',
      releaseDate: '',
      rating: ''
    });
  }
  
  goBack(): void {
    this.router.navigate(['/user', 'home', this.userId]);
  }
}
