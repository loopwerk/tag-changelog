# tag-changelog
A GitHub Action triggered by a new tag getting pushed. It then fetches all the commits since the previous tag and creates a changelog text using the [Conventional Commits](https://www.conventionalcommits.org) format. It will also turn PR numbers into clickable links.

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
        uses: loopwerk/conventional-changelog-action@latest
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
          body: ${{ steps.changelog.outputs.changes }}
```

## Inputs
* `token`: Your GitHub token, `${{ secrets.GITHUB_TOKEN }}`. Required.
* `exclude`: A comma separated list of commits types you want to exclude from the changelog. Optional.

## Outputs
* `changelog`: Generated changelog for the latest tag.
* `changes`: Generated changelog for the latest tag, without the version/date header.

## Roadmap
This action is very simple, and not very configurable yet. 

- It would be nice to be able to supply a changelog message template instead of having a hardcoded template in the action itself. 
- The mapping from raw type (like `feat`) to changelog header (like `New Features`) would also be good to have configurable. 
- Mentioning the author of a PR within the changelog would be good.
- Configure the ordering of the types.
- Display breaking changes notes.

## Thanks
Thanks to [Helmisek/conventional-changelog-generator](https://github.com/Helmisek/conventional-changelog-generator) and [ardalanamini/auto-changelog](https://github.com/ardalanamini/auto-changelog) for inspiration. Thanks to [nektos/act](https://github.com/nektos/act) for making it possible to run GitHub Actions locally, making development and testing a whole lot easier.
