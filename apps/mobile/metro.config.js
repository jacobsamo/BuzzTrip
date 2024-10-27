// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, "../..");

const config = getDefaultConfig(projectRoot);

// for hono/client to work because unstable_enablePackageExports is not working
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "hono/client") {
    return {
      type: "sourceFile",
      filePath: path.resolve(workspaceRoot, "node_modules/hono/dist/client/index.js"),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

module.exports = withNativeWind(config, { input: "./src/lib/global.css" });
