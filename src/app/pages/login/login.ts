import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth   = inject(Auth);
  private router = inject(Router);

  activeTab = signal<'signin' | 'signup'>('signin');
  signupStep = signal<1 | 2>(1);
  showPassword = signal(false);

  loginEmail    = signal('');
  loginPassword = signal('');

  userType  = signal<'local' | 'tourist' | ''>('');
  regName   = signal('');
  regEmail  = signal('');
  regPassword = signal('');
  regConfirm  = signal('');

  errorMsg   = signal('');
  successMsg = signal('');

  switchTab(tab: 'signin' | 'signup'): void {
    this.activeTab.set(tab);
    this.signupStep.set(1);
    this.errorMsg.set('');
    this.successMsg.set('');
    this.userType.set('');
  }

  selectUserType(type: 'local' | 'tourist'): void {
    this.userType.set(type);
  }

  goToStep2(): void {
    if (!this.userType()) {
      this.errorMsg.set('Please select who you are.');
      return;
    }
    this.errorMsg.set('');
    this.signupStep.set(2);
  }

  backToStep1(): void {
    this.signupStep.set(1);
    this.errorMsg.set('');
  }

  onInput(field: string, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    if (field === 'loginEmail') this.loginEmail.set(val);
    else if (field === 'loginPassword') this.loginPassword.set(val);
    else if (field === 'regName') this.regName.set(val);
    else if (field === 'regEmail') this.regEmail.set(val);
    else if (field === 'regPassword') this.regPassword.set(val);
    else if (field === 'regConfirm') this.regConfirm.set(val);
  }

  onSignIn(): void {
    this.errorMsg.set('');
    if (!this.loginEmail() || !this.loginPassword()) {
      this.errorMsg.set('Please fill in all fields.');
      return;
    }
    if (!this.loginEmail().includes('@')) {
      this.errorMsg.set('Please enter a valid email address.');
      return;
    }
    if (this.loginPassword().length < 6) {
      this.errorMsg.set('Password must be at least 6 characters.');
      return;
    }
    this.auth.login(this.loginEmail());
    this.router.navigate(['/dashboard']);
  }

  onSignUp(): void {
    this.errorMsg.set('');
    this.successMsg.set('');
    if (!this.regName() || !this.regEmail() || !this.regPassword() || !this.regConfirm()) {
      this.errorMsg.set('Please fill in all fields.');
      return;
    }
    if (!this.regEmail().includes('@')) {
      this.errorMsg.set('Please enter a valid email address.');
      return;
    }
    if (this.regPassword().length < 6) {
      this.errorMsg.set('Password must be at least 6 characters.');
      return;
    }
    if (this.regPassword() !== this.regConfirm()) {
      this.errorMsg.set('Passwords do not match.');
      return;
    }
    this.auth.login(this.regEmail());
    this.successMsg.set('Account created! Redirecting...');
    setTimeout(() => this.router.navigate(['/dashboard']), 1000);
  }
}