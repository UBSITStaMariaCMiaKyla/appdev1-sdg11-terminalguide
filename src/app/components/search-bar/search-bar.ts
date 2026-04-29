import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TerminalService } from '../../services/terminal';
import { TerminalHub } from '../../models/terminal.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBar implements OnInit {
  searchTerm: string = '';
  suggestions: { label: string; sublabel: string }[] = [];
  showSuggestions: boolean = false;
  activeIndex: number = -1;

  private allHubs: TerminalHub[] = [];

  private readonly placeholders: string[] = [
    'Baguio City, ano tara???',
    'Baguio, where u at??',
    'para po... saan tayo fr?',
    'Terminal reveal pls',
    'Where to, bestie?',
    'Ate kimmy ate kimmy, saan tayo?',
    'Lost? I got u',
    'Goodness gracious, gala nanaman?',
    'It`s giving, saan ang sakayan',
    'Where to tayo fr??',
    'Lowkey need ng jeep',
    'POV: di mo alam saan sasakay',
    'Baguio core: saan ang jeep',
  ];

  placeholder: string = '';

  constructor(private router: Router, private terminalService: TerminalService) {
    this.placeholder = this.placeholders[
      Math.floor(Math.random() * this.placeholders.length)
    ];

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

  ngOnInit(): void {
    // Load hubs once via HTTP GET — stored locally for suggestion lookup
    this.terminalService.getHubs().subscribe(hubs => {
      this.allHubs = hubs;
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

    for (const hub of this.allHubs) {
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
      if (this.activeIndex === -1) {
        this.onInput();
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