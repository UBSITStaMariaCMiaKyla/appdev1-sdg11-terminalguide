import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TerminalService } from '../../services/terminal';
import { TerminalHub } from '../../models/terminal.model';

@Component({
  selector: 'app-terminal-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terminal-detail.html',
  styleUrl: './terminal-detail.css',
})
export class TerminalDetail implements OnInit {
  hub: TerminalHub | null = null;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private terminalService: TerminalService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.hub = this.terminalService.getHubById(id) ?? null;
      if (!this.hub) this.notFound = true;
    } else {
      this.notFound = true;
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}