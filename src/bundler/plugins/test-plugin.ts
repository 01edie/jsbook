import * as esbuild from "esbuild-wasm";

export const testPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResole", args);
        return { path: args.path, namespace: "a" };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
              import {message, testFunc} from './message';
              console.log(message);
              testFunc()
            `,
          };
        } else {
          return {
            loader: "jsx",
            contents: `
            export const message = 'hi there';
            export const testFunc = ()=>console.log('hello world');
            `,
          };
        }
      });
    },
  };
};
