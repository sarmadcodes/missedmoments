const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

// Without Watchman, Metro falls back to fs.watch and walks every directory in
// the project. Gradle's C++ build creates and deletes temp dirs under
// android/app/.cxx while it runs, and watching a dir that CMake has just
// removed crashes the bundler with ENOENT. Native build output contains no JS,
// so keep it out of the file map entirely.
//
// metro-file-map normalises paths to forward slashes before testing these
// patterns, so they must use `/` even on Windows.
const nativeBuildArtifacts = [
  /\/android\/\.gradle\/.*/,
  /\/android\/build\/.*/,
  /\/android\/app\/build\/.*/,
  /\/android\/app\/\.cxx\/.*/,
  /\/ios\/build\/.*/,
  /\/ios\/Pods\/.*/,
];

const defaultBlockList = defaultConfig.resolver?.blockList;

const config = {
  resolver: {
    blockList: [
      ...(Array.isArray(defaultBlockList)
        ? defaultBlockList
        : defaultBlockList
        ? [defaultBlockList]
        : []),
      ...nativeBuildArtifacts,
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
