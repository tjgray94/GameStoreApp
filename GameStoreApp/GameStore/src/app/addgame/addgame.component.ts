import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
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
  selectedFile: File | null = null;
  imageFileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private gameService: GameService,
              private fb: FormBuilder,
              private location: Location,
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
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.selectedFile = file;
      this.imageFileName = file.name;
      
      // Update form control with filename
      this.gameForm.patchValue({
        image: file.name
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Getter for easy access to form fields
  get f(): { [key: string]: FormControl } {
    return this.gameForm.controls as { [key: string]: FormControl };
  }

  preventInput(event: KeyboardEvent) {
    event.preventDefault();
  }

  saveGame(): void {
    this.formSubmitted = true;
    
    if (this.gameForm.invalid) {
      return;
    }
    
    const data = {
      userId: this.userId,
      name: this.f.name.value,
      image: this.selectedFile?.name || this.f.image.value,
      price: this.f.price.value, 
      releaseDate: this.f.releaseDate.value,
      rating: this.f.rating.value
    };

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    formData.append('game', JSON.stringify(data));
    
    console.log('Submitting data:', data);
    this.gameService.create(formData).subscribe({
      next: (response) => { 
        console.log('Server response:', response); 
        this.submitted = true;
      },
      error: (error) => {
        console.error('Error submitting game:', error);
      }
    });
  }

  newGame(): void {
    this.submitted = false;
    this.formSubmitted = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.gameForm.reset({
      name: '',
      image: '',
      price: '',
      releaseDate: '',
      rating: ''
    });
  }
  
  goBack(): void {
    this.location.back();
  }
  
  viewGames(): void {
    this.router.navigate(['/user', this.userId, 'games']);
  }
}
