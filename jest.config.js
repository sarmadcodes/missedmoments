const preset = require('react-native/jest-preset');

module.exports = {
  preset: 'react-native',

  // The react-native preset transforms js/ts/tsx but NOT jsx, and this whole
  // project is .jsx -- without this, Jest cannot transform a single component
  // and every test fails with "Cannot use import statement outside a module".
  transform: {
    ...preset.transform,
    '^.+\.(js|jsx|ts|tsx)$': 'babel-jest',
    // The preset's asset transformer covers images but not fonts, and the
    // icon packages require a .ttf at module load.
    '^.+\.(ttf|otf|woff|woff2|eot)$': require.resolve(
      'react-native/jest/assetFileTransformer.js',
    ),
  },

  // The preset does not transform node_modules, but several packages
  // (AsyncStorage's official jest mock among them) ship untranspiled ESM.
  transformIgnorePatterns: [
    'node_modules/(?!(?:' +
      '(jest-)?react-native' +
      '|react-native-.*' +          // linear-gradient, screens, permissions, ...
      '|@react-native' +
      '|@react-native-community' +
      '|@react-native-async-storage' +
      '|@react-native-vector-icons' +
      '|@react-navigation' +
      ')/)',
  ],

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  setupFiles: [...preset.setupFiles, '<rootDir>/jest.setup.js'],
};
