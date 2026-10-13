export interface GithubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  location: string;
}

export interface GithubRepo {
  name: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  description: string;
}