import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GithubService } from './core/services/github.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-[#f6f8fa] p-4 md:p-8 font-sans">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h1 class="text-3xl font-bold mb-2">dev-finder</h1>
          <p class="text-gray-500 mb-4">Busque qualquer perfil do GitHub</p>

          <div class="flex gap-2">
            <input
              [(ngModel)]="username"
              (keyup.enter)="search()"
              placeholder=" "
              class="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              (click)="search()"
              class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
              [disabled]="github.loading()"
            >
              {{ github.loading()? 'Buscando...' : 'Buscar' }}
            </button>
          </div>

          @if (github.error()) {
            <p class="text-red-500 mt-3 text-sm">{{ github.error() }}</p>
          }
        </div>

        <!-- Profile -->
        @if (github.user(); as user) {
          <div class="bg-white rounded-xl shadow-sm border p-6 mb-6 flex gap-6">
            <img [src]="user.avatar_url" class="w-24 h-24 rounded-full" />
            <div>
              <h2 class="text-2xl font-bold">{{ user.name || user.login }}</h2>
              <p class="text-gray-500">{{ '@' + user.login }}</p>
              @if (user.bio) { <p class="mt-2">{{ user.bio }}</p> }
              <div class="flex gap-4 mt-3 text-sm">
                <span>📦 {{ user.public_repos }} repos</span>
                <span>👥 {{ user.followers }} seguidores</span>
                <span>➡️ {{ user.following }} seguindo</span>
              </div>
            </div>
          </div>

          <h3 class="font-bold mb-3 text-gray-700">Repositórios recentes ({{ github.repos().length }} de {{ user.public_repos }})</h3>

          <!-- Repos -->
          <div class="grid md:grid-cols-2 gap-4">
            @for (repo of github.repos(); track repo.name) {
              <a [href]="repo.html_url" target="_blank" class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition block">
                <h3 class="font-bold text-purple-600">{{ repo.name }}</h3>
                @if (repo.description) { <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ repo.description }}</p> }
                <div class="flex gap-3 mt-3 text-xs text-gray-500">
                  @if (repo.language) { <span class="bg-gray-100 px-2 py-1 rounded">{{ repo.language }}</span> }
                  <span>⭐ {{ repo.stargazers_count }}</span>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class AppComponent {
  github = inject(GithubService);
  username = '';

  search() {
    if (!this.username.trim()) return; 
    this.github.searchUser(this.username.trim());
  }
}