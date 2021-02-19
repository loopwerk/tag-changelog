# conventional-changelog-action
A GitHub Action triggered by a new tag getting pushed. It then fetches all the commits since the last tag and creates a changelog text using the [Conventional Commits](https://www.conventionalcommits.org) format. It will also turn PR numbers into clickable links.

This action returns the generated changelog text, but doesn't do anything more; you need to for example append it to a `CHANGELOG.md` file, create a GitHub Release with this text, etc. A full example doing all these things is given below.

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
        uses: loopwerk/conventional-changelog-action
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          exclude: other,perf
          
			- name: Create release
        uses: actions/create-release@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: ${{ steps.changelog.outputs.changelog }}
```

## Inputs
* `token`: your GitHub token, `${{ secrets.GITHUB_TOKEN }}`. Required.
* `exclude`: a comma separated list of commits types you want to exclude from the changelog. Optional.

## Outputs
* `changelog`: the generated string for the changelog of this release.

## Roadmap
This Actions is very simple, and not very configurable yet. 

- It would be nice to be able to supply a changelog message template instead of having a hardcoded template in the action itself. 
- The mapping from raw type (like `feat`) to changelog header (like `New Features`) would also be good to have configurable. 
- Mentioning the author of a PR within the changelog would be good.