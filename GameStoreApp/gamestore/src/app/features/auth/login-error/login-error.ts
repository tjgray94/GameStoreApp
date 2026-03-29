import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-login-error',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './login-error.html',
  styleUrl: './login-error.css',
})
export class LoginError {

}
