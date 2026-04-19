import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private loggedIn = false;
  private currentUserEmail = '';

  login(email: string): void {
    this.loggedIn = true;
    this.currentUserEmail = email;
  }

  logout(): void {
    this.loggedIn = false;
    this.currentUserEmail = '';
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUserEmail(): string {
    return this.currentUserEmail;
  }
}