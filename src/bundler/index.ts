import * as esbuild from "esbuild-wasm";
import { fetchPlugin, unpkgPathPlugin } from "./plugins";

let service: esbuild.Service;
const bundle= async (rawCode:string) => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  }

  try {
    const result = await service.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        "process.env.NODE_ENV": "'production'",
        global: "window",
      },
    });
    return {
      code:result.outputFiles[0].text,
      error:''
    }
  } catch (error : any) {
    return {
      code:'',
      error:error.message 
    }
  }
};

export default bundle