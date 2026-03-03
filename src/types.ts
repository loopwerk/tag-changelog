import type { components } from "@octokit/openapi-types";

export interface TypeDefinition {
  types: string[];
  label: string;
}

type GitHubUser = components["schemas"]["nullable-simple-user"];

export interface ParsedCommit {
  type: string;
  subject: string;
  body?: string;
  scope?: string;
  notes?: CommitNote[];
  sha?: string;
  url?: string;
  author?: GitHubUser | Record<string, never>;
}

export interface CommitNote {
  title: string;
  text: string;
}

export interface NoteWithCommit extends CommitNote {
  commit: ParsedCommit;
}

export interface CommitGroup {
  type: string;
  commits: ParsedCommit[];
}

export interface Config {
  types: TypeDefinition[];
  excludeTypes: string[];
  includeCommitBody: boolean;
  renderTypeSection: (label: string, commits: ParsedCommit[], includeCommitBody: boolean) => string;
  renderNotes: (notes: NoteWithCommit[]) => string;
  renderChangelog: (release: string, changes: string) => string;
}

export interface ChangelogOutput {
  changelog: string;
  changes: string;
}

export type FetchUserFunc = (pullNumber: string) => Promise<{ username: string; userUrl: string }>;
