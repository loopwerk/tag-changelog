# tag-changelog
A GitHub Action triggered by a new tag getting pushed. It then fetches all the commits since the previous tag and creates a changelog text using the [Conventional Commits](https://www.conventionalcommits.org) format. It will also turn PR numbers into clickable links.

This action returns the generated changelog text, but doesn't do anything more; you need to for example prepend it to a `CHANGELOG.md` file, create a GitHub Release with this text, etc.

## Example workflow
```
name: Create Release

on:
  push:
    tags:
      - '*'

jobs:
  create-release:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Create changelog text
        id: changelog
        uses: loopwerk/conventional-changelog-action@latest
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          exclude: other,doc,chore

      - name: Create release
        uses: actions/create-release@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: ${{ steps.changelog.outputs.changes }}
```

## Inputs
* `token`: Your GitHub token, `${{ secrets.GITHUB_TOKEN }}`. Required.
* `exclude`: A comma separated list of commits types you want to exclude from the changelog, for example: "other,chore". Optional (defaults to nothing).
* `config_file`: Location of the config JSON file. Optional.

## Outputs
* `changelog`: Generated changelog for the latest tag, including the version/date header (suitable for prepending to a CHANGELOG.md file).
* `changes`: Generated changelog for the latest tag, without the version/date header (suitable for GitHub Releases).

## Custom config
```
- name: Create changelog text
  uses: loopwerk/conventional-changelog-action@latest
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    config_file: .github/tag-changelog.json
```

The config file can be used to map commit types to changelog labels.

### Example config file:

```
{
  "types": [
    { "types": ["feat", "feature"], "label": "New Features" },
    { "types": ["fix", "bugfix"], "label": "Bugfixes" },
    { "types": ["improvements", "enhancement"], "label": "Improvements" },
    { "types": ["perf"], "label": "Performance Improvements" },
    { "types": ["build", "ci"], "label": "Build System" },
    { "types": ["refactor"], "label": "Refactors" },
    { "types": ["doc", "docs"], "label": "Documentation Changes" },
    { "types": ["test", "tests"], "label": "Tests" },
    { "types": ["style"], "label": "Code Style Changes" },
    { "types": ["chore"], "label": "Chores" },
    { "types": ["other"], "label": "Other Changes" }
  ]
}
```

The order in which the types appear also determines the order of the generated sections in the changelog.

## Roadmap
- It would be nice to be able to supply a changelog message template instead of having a hardcoded template in the action itself. 
- Display breaking changes notes.
- Display type scope.

## Thanks
Thanks to [Helmisek/conventional-changelog-generator](https://github.com/Helmisek/conventional-changelog-generator) and [ardalanamini/auto-changelog](https://github.com/ardalanamini/auto-changelog) for inspiration. Thanks to [nektos/act](https://github.com/nektos/act) for making it possible to run GitHub Actions locally, making development and testing a whole lot easier.
