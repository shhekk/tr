const { withNx, composePlugins } = require('@nx/webpack');
const { relative, resolve } = require('path');
// const swcConfig = require('./.swcrc');

module.exports = composePlugins(withNx(), (config) => {
  config.resolve.alias = {
    '~': resolve(__dirname, './src'),
  };
  // This controls how source map paths appear in DevTools (Chrome, VS Code debugger, etc.).
  config.output.devtoolFallbackModuleFilenameTemplate = function (info) {
    const rel = relative(process.cwd(), info.absoluteResourcePath);
    return `webpack:///./${rel}`;
  };

  config.module = config.module || {};
  config.module.rules = config.module.rules || [];

  config.module.rules.pop(); // removed last default swc loader and added my own swc options

  config.module.rules.push({
    test: /\.ts$/,
    exclude: /node_modules/,
    use: {
      loader: 'swc-loader',
      options: {
        jsc: {
          parser: { syntax: 'typescript', decorators: true, tsx: true },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
            react: { runtime: 'automatic' },
          },
          target: 'es2017',

          loose: true,
        },
        module: {
          type: 'commonjs',
        },
      },
    },
  });

  // confirm if swc is used by nx ↓
  // console.dir(config.module.rules, { depth: null, colors: true });

  config.ignoreWarnings = [
    /(Failed to parse source map from)\s.*\/generated-prisma-client\/.*/,
  ];
  return config;
});

// const nodeExternals = require('webpack-node-externals');
// const isProd =
//   typeof process.env.NODE_ENV === 'undefined' &&
//   process.env.NODE_ENV === 'production';
// const mode = isProd ? 'production' : 'development';
// /**@type {import("webpack").Configuration} */
// module.exports = {
//   mode: 'development',
//   entry: 'src/main.ts',
//   output: 'dist/main.js',
//   target: 'node',
//   externals: [nodeExternals()],
//   module: {
//     rules: [
//       {
//         test: /\.ts$/,
//         use: ['ts-loader'],
//         exclude: /node_modules/,
//       },
//     ],
//   },
// };
