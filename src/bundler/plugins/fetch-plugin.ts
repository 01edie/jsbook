import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const pkgCache = localForage.createInstance({
  name: "pkgCache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-and-load-plugin",
    setup(build: esbuild.PluginBuild) {
      // ##### on load root entry file
      build.onLoad({ filter: /(^index\.js$)/ }, () => ({
        loader: "jsx",
        contents: inputCode,
      }));

      // ##### caching for all files
      build.onLoad(
        { filter: /.*/, namespace: "a" },
        async (args: esbuild.OnLoadArgs) => {
          // check if package data is already cached
          const cachedResult = await pkgCache.getItem<esbuild.OnLoadResult>(
            args.path
          );
          if (cachedResult) {
            return cachedResult;
          }
        }
      );

      // ##### on load css files
      build.onLoad({ filter: /.css$/ }, async (args: esbuild.OnLoadArgs) => {
        console.log("onLoad", args);

        // if not cached, receive it from network, cache it and return
        const { data, request } = await axios.get(args.path);
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
            const style = document.createElement('style')
            style.innerText='${escaped}'
            document.head.appendChild(style)
            `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          // resolveDir is not accepting path with baseURL
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await pkgCache.setItem(args.path, result);

        return result;
      });
      // ##### on load js files
      build.onLoad(
        { filter: /.*/, namespace: "a" },
        async (args: esbuild.OnLoadArgs) => {
          console.log("onLoad", args);
          // if not cached, receive it from network, cache it and return
          const { data, request } = await axios.get(args.path);
          const result: esbuild.OnLoadResult = {
            loader: "jsx",
            contents: data,
            // resolveDir is not accepting path with baseURL
            resolveDir: new URL("./", request.responseURL).pathname,
          };
          await pkgCache.setItem(args.path, result);

          return result;
        }
      );
    },
  };
};
