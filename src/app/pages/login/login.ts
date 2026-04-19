import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth   = inject(Auth);
  private router = inject(Router);

  activeTab: 'login' | 'register' = 'login';
  showPassword = false;

  // Login fields
  loginEmail    = '';
  loginPassword = '';

  // Register fields
  regName     = '';
  regEmail    = '';
  regPassword = '';
  regConfirm  = '';

  errorMsg   = '';
  successMsg = '';

  onLogin(): void {
    this.errorMsg = '';

    if (!this.loginEmail || !this.loginPassword) {
      this.errorMsg = 'Please fill in all fields.';
      return;
    }

    if (!this.loginEmail.includes('@')) {
      this.errorMsg = 'Please enter a valid email address.';
      return;
    }

    if (this.loginPassword.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters.';
      return;
    }

    // Log the user in via AuthService
    this.auth.login(this.loginEmail);
    this.router.navigate(['/dashboard']);
  }

  onRegister(): void {
    this.errorMsg   = '';
    this.successMsg = '';

    if (!this.regName || !this.regEmail || !this.regPassword || !this.regConfirm) {
      this.errorMsg = 'Please fill in all fields.';
      return;
    }

    if (!this.regEmail.includes('@')) {
      this.errorMsg = 'Please enter a valid email address.';
      return;
    }

    if (this.regPassword.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters.';
      return;
    }

    if (this.regPassword !== this.regConfirm) {
      this.errorMsg = 'Passwords do not match.';
      return;
    }

    // Registration successful — auto login and redirect
    this.auth.login(this.regEmail);
    this.successMsg = 'Account created! Redirecting...';
    setTimeout(() => this.router.navigate(['/dashboard']), 1000);
  }
}