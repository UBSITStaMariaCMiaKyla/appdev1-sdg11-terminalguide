import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBar {
  searchTerm: string = '';

  constructor(private router: Router) {}

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/dashboard'], {
        queryParams: { search: this.searchTerm.trim() }
      });
    }
  }

  quickSearch(term: string) {
    this.searchTerm = term;
    this.onSearch();
  }
}