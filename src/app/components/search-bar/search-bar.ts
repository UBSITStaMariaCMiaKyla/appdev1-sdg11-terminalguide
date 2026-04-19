import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TerminalService } from '../../services/terminal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBar {
  searchTerm: string = '';
  suggestions: { label: string; sublabel: string }[] = [];
  showSuggestions: boolean = false;
  activeIndex: number = -1;  // -1 means nothing highlighted

  constructor(private router: Router, private terminalService: TerminalService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        if (!e.urlAfterRedirects.startsWith('/dashboard')) {
          this.searchTerm = '';
          this.suggestions = [];
          this.showSuggestions = false;
          this.activeIndex = -1;
        }
      });
  }

  onInput(): void {
    this.activeIndex = -1;
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) {
      this.suggestions = [];
      this.showSuggestions = false;
      return;
    }

    const results: { label: string; sublabel: string }[] = [];
    const hubs = this.terminalService.getHubs();

    for (const hub of hubs) {
      if (hub.name.toLowerCase().includes(q)) {
        results.push({ label: hub.name, sublabel: 'Terminal Hub' });
      }
      for (const terminal of hub.terminals) {
        if (terminal.name.toLowerCase().includes(q)) {
          results.push({ label: terminal.name, sublabel: `via ${hub.name}` });
        }
      }
    }

    const seen = new Set<string>();
    this.suggestions = results.filter(r => {
      if (seen.has(r.label)) return false;
      seen.add(r.label);
      return true;
    }).slice(0, 8);

    this.showSuggestions = this.suggestions.length > 0;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = Math.min(this.activeIndex + 1, this.suggestions.length - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, -1);
      // If back to -1, restore original typed text
      if (this.activeIndex === -1) {
        this.onInput(); // re-filter without changing searchTerm
      }
    } else if (event.key === 'Enter') {
      if (this.activeIndex >= 0) {
        event.preventDefault();
        this.selectSuggestion(this.suggestions[this.activeIndex]);
      } else {
        this.onSearch();
      }
    } else if (event.key === 'Escape') {
      this.showSuggestions = false;
      this.activeIndex = -1;
    }
  }

  selectSuggestion(suggestion: { label: string; sublabel: string }): void {
    this.searchTerm = suggestion.label;
    this.showSuggestions = false;
    this.activeIndex = -1;
    this.onSearch();
  }

  onSearch(): void {
    this.showSuggestions = false;
    this.activeIndex = -1;
    if (this.searchTerm.trim()) {
      this.router.navigate(['/dashboard'], {
        queryParams: { search: this.searchTerm.trim() }
      });
    }
  }

  quickSearch(term: string): void {
    this.searchTerm = term;
    this.showSuggestions = false;
    this.activeIndex = -1;
    this.onSearch();
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
      this.activeIndex = -1;
    }, 150);
  }
}