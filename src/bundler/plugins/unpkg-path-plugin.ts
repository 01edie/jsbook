import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // handle root entry file
      build.onResolve({ filter: /(^index\.js$)/ }, () => ({
        path: "index.js",
        namespace: "a",
      }));
      // handle relative paths
      build.onResolve(
        { filter: /^\.+\// },
        async (args: esbuild.OnResolveArgs) => ({
          path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
          namespace: "a",
        })
      );
      //  handle main file of packages
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        console.log("onResolve", args);
        return { path: `https://unpkg.com/${args.path}`, namespace: "a" };
      });

      //   .......................
    },
  };
};
