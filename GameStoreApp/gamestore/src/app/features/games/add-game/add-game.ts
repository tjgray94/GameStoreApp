import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../../../core/services/auth-service';
import { GameService } from '../../../core/services/game-service';

@Component({
  selector: 'app-add-game',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-game.html',
  styleUrl: './add-game.css',
})
export class AddGame implements OnInit {

  gameForm!: FormGroup;
  submitted = false;
  formSubmitted = false;
  userId!: number;
  selectedFile: File | null = null;
  imageFileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) { this.initForm(); }

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
      
      // Update display name immediately
      this.imageFileName = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {

      this.imagePreview = reader.result;
      this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  get f(): { [key: string]: FormControl } {
    return this.gameForm.controls as { [key: string]: FormControl };
  }

  preventInput(event: KeyboardEvent) {
    event.preventDefault();
  }

  saveGame(): void {
    this.formSubmitted = true;
    
    if (this.gameForm.invalid) return;

    // Format releaseDate to "yyyy-MM-dd"
    let releaseDate = this.f['releaseDate'].value;
    if (releaseDate instanceof Date) {
      releaseDate = releaseDate.toISOString().split('T')[0];
    }
    
    const data = {
      userId: this.userId,
      name: this.f['name'].value,
      image: this.selectedFile?.name || this.f['image'].value,
      price: this.f['price'].value, 
      releaseDate: releaseDate,
      rating: this.f['rating'].value
    };

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    formData.append('game', JSON.stringify(data));
    
    this.gameService.create(formData).subscribe({
      next: () => {this.submitted = true, this.cdr.markForCheck();},
      error: (err) => console.error('Error submitting game:', err)
    });
  }

  newGame(): void {
    this.submitted = false;
    this.formSubmitted = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.gameForm.reset();
  }
  
  goBack(): void {
    this.location.back();
  }
  
  viewGames(): void {
    this.router.navigate(['/user', this.userId, 'games']);
  }
}
