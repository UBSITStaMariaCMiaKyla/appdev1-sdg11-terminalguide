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

  constructor(private router: Router, private terminalService: TerminalService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        if (!e.urlAfterRedirects.startsWith('/dashboard')) {
          this.searchTerm = '';
          this.suggestions = [];
          this.showSuggestions = false;
        }
      });
  }

  onInput(): void {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) {
      this.suggestions = [];
      this.showSuggestions = false;
      return;
    }

    const results: { label: string; sublabel: string }[] = [];
    const hubs = this.terminalService.getHubs();

    for (const hub of hubs) {
      // Hub name matches
      if (hub.name.toLowerCase().includes(q)) {
        results.push({ label: hub.name, sublabel: 'Terminal Hub' });
      }
      // Individual terminal names match
      for (const terminal of hub.terminals) {
        if (terminal.name.toLowerCase().includes(q)) {
          results.push({ label: terminal.name, sublabel: `via ${hub.name}` });
        }
      }
    }

    // Deduplicate by label, cap at 8 suggestions
    const seen = new Set<string>();
    this.suggestions = results.filter(r => {
      if (seen.has(r.label)) return false;
      seen.add(r.label);
      return true;
    }).slice(0, 8);

    this.showSuggestions = this.suggestions.length > 0;
  }

  selectSuggestion(suggestion: { label: string; sublabel: string }): void {
    this.searchTerm = suggestion.label;
    this.showSuggestions = false;
    this.onSearch();
  }

  onSearch(): void {
    this.showSuggestions = false;
    if (this.searchTerm.trim()) {
      this.router.navigate(['/dashboard'], {
        queryParams: { search: this.searchTerm.trim() }
      });
    }
  }

  quickSearch(term: string): void {
    this.searchTerm = term;
    this.showSuggestions = false;
    this.onSearch();
  }

  hideSuggestions(): void {
    // Small delay so click on suggestion fires first
    setTimeout(() => { this.showSuggestions = false; }, 150);
  }
}