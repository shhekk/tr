# monorepo setup from scratch

with the help of https://www.youtube.com/watch?v=iOWWmfMRqs0
https://www.youtube.com/watch?v=S-jj_tifHl4

this is monorepo build compeletly using pnpm workspaces and ts project reference

# summary after working 4 days on this approach

- using pnpm workspaces we have apps & libs.
- each workspace have seperate package.json & tsconfig.json extended with base tsconfig.json at root
- each apps is init manually by legacy init-cli. create-next-app & nest new
- don't forget to extends the application/tsconfig.json with ../../tsconfig.json
- for libs add tsconfig & package.json -> main: dist/index.js types dist/index.d.ts
- make composite true for libs -> enables ts-project reference → enables upstream building
- which mean making changes in libs will build depended projects

# problems i faced in this approach

- although you can run multiple dev commands: pnpm --parallel -r dev
  but we don't have mechanism to auto run commands using the dependency graph.
  like build nestjs-libraries then → build api then → build web

- sometimes on files changes does not trigger build downstream.
  file changes in nestjs-libraries → build nestjs-libraries →x→ build api (in some cases)
  (although if api build manually, it works fine)

- i think these are the actual and only reasons to shift to build tools like nx/turbo
  else i purly like pnpm monorepos.

# module error:

- to fix these errors try to find what file is not found.
- if its outside the /src, add resolvepath manually.
- or add path reference to that project's tsconfig dir. like (reference: [{path: "../../libs/shared"}])
- or (not recommended) add files glob pattern in tsconfig.includes: ["../../libs/shared/src/**/*"]
  but, it will save the builds inside the apps/project/dist (causes duplication of code)

# nestjs related error

- nestjs need experimentalDecorators & emitDecoratorMetadata: true
- manytimes fixing tsconfig solves the error.

## generating an github ssh keys

- ssh-keygen -t ed25519 -C "your_email@example.com"
