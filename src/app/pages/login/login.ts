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

  activeTab: 'signin' | 'signup' = 'signin';
  signupStep: 1 | 2 = 1;
  showPassword = false;

  // Sign In fields
  loginEmail    = '';
  loginPassword = '';

  // Sign Up fields
  userType:    'local' | 'tourist' | '' = '';
  regName     = '';
  regEmail    = '';
  regPassword = '';
  regConfirm  = '';

  errorMsg   = '';
  successMsg = '';

  switchTab(tab: 'signin' | 'signup'): void {
    this.activeTab  = tab;
    this.signupStep = 1;
    this.errorMsg   = '';
    this.successMsg = '';
    this.userType   = '';
  }

  selectUserType(type: 'local' | 'tourist'): void {
    this.userType = type;
  }

  goToStep2(): void {
    if (!this.userType) {
      this.errorMsg = 'Please select who you are.';
      return;
    }
    this.errorMsg   = '';
    this.signupStep = 2;
  }

  backToStep1(): void {
    this.signupStep = 1;
    this.errorMsg   = '';
  }

  onSignIn(): void {
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

    this.auth.login(this.loginEmail);
    this.router.navigate(['/dashboard']);
  }

  onSignUp(): void {
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

    this.auth.login(this.regEmail);
    this.successMsg = 'Account created! Redirecting...';
    setTimeout(() => this.router.navigate(['/dashboard']), 1000);
  }
}