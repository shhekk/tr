const { withNx, composePlugins } = require('@nx/webpack');
const { relative, resolve } = require('path');

module.exports = composePlugins(withNx(), (config) => {
  config.resolve.alias = {
    '~': resolve(__dirname, './src'),
  };
  // This controls how source map paths appear in DevTools (Chrome, VS Code debugger, etc.).
  config.output.devtoolFallbackModuleFilenameTemplate = function (info) {
    const rel = relative(process.cwd(), info.absoluteResourcePath);
    return `webpack:///./${rel}`;
  };
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
