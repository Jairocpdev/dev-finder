import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { GithubUser, GithubRepo } from '../models/github-user.model';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.github.com/users';

  user = signal<GithubUser | null>(null);
  repos = signal<GithubRepo[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  searchUser(username: string) {
    if(!username) return;
    this.loading.set(true);
    this.error.set(null);
    this.user.set(null);

    forkJoin({
      user: this.http.get<GithubUser>(`${this.apiUrl}/${username}`),
      repos: this.http.get<GithubRepo[]>(`${this.apiUrl}/${username}/repos?per_page=100&sort=updated`)
    }).subscribe({
      next: ({ user, repos }) => {
        this.user.set(user);
        this.repos.set(repos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Usuário não encontrado');
        this.loading.set(false);
      }
    });
  }
}