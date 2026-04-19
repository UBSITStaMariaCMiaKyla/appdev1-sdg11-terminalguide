import { Component, inject, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  private auth   = inject(Auth);
  private router = inject(Router);

  menuOpen     = false;
  dropdownOpen = false;

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  getUserEmail(): string {
    return this.auth.getUserEmail();
  }

  getUserName(): string {
    const email = this.auth.getUserEmail();
    return email ? email.split('@')[0] : 'User';
  }

  getInitials(): string {
    return this.getUserName().charAt(0).toUpperCase();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  onLogout(): void {
    this.auth.logout();
    this.dropdownOpen = false;
    this.menuOpen = false;
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar-profile')) {
      this.dropdownOpen = false;
    }
  }
}