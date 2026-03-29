import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Game } from '../../../core/models/game';
import { GameService } from '../../../core/services/game-service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-update-game',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './update-game.html',
  styleUrl: './update-game.css',
})
export class UpdateGame implements OnInit {

  id!: number;
  game: Game | null = null;
  userId!: number;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  gameForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['gameId'];
    this.initForm();

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
      this.gameForm.patchValue({
        name: data.name,
        image: data.image,
        price: data.price,
        releaseDate: data.releaseDate,
        rating: data.rating
      });
      if (data.image) {
        this.imagePreview = `http://localhost:5001/images/${data.image}`;
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
      // Update the form's image field so the UI updates immediately
      this.gameForm.patchValue({ image: file.name });
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // "yyyy-MM-dd"
  }

  goBack(): void {
    window.history.back();
  }

  submit() {
    if (this.gameForm.invalid) {
      this.gameForm.markAllAsTouched();
      return;
    }
    const formValue = this.gameForm.value;
    const gameData: Game = {
      gameId: this.id,
      userId: this.userId,
      name: formValue.name,
      image: formValue.image,
      price: formValue.price,
      releaseDate: this.formatDate(formValue.releaseDate),
      rating: formValue.rating
    };
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    formData.append('game', JSON.stringify(gameData));
    this.gameService.update(this.userId, this.id, formData).subscribe({
      next: res => this.router.navigate(['/user', this.userId, 'games']),
      error: err => {
        console.error('Update failed:', err);
        alert('Update failed. Please check your input and try again.');
      }
    });
  }
}
