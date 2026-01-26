# nx added, dist moved to root, webpack added

- nx added in the project
- rootDir is moved to tsconfig.base.json (to use dependent projects directly)
- removed shared/ as internal Package dependency and being used directly (\*no ts-path references either)
  - @tr/shared module is resolved via baseUrl and paths in tsconfig.base.json
  - shared/ is nonbuildable library -- check nx.json plugins → @nx/js/ts
- webpack builds api and saves build in dist/
  - node watches api/ and its dependencies in dev mode
  - webpack also saves all dependencies directly in dist/main.js
  - webpack being used via nx pipeline using @nx/webpack
  - webpack using swc as compiler for backend nest app (.swcrc as config)
- @tr/frontend (@nx/next) and @tr/backend (@nx/nest) added

# notes

- if you want files and include to be empty → then define these explicitly in tsconfig, else it has a default value or it extends from base config.
