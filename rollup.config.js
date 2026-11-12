import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs",
      format: "cjs",
      sourcemap: true,
      exports: "named",
      // apexgantt's `require` entry is a module object whose `default` is the
      // chart class. Without "compat", `new ApexGantt(...)` constructs the
      // module object and throws "ApexGantt is not a constructor".
      interop: "compat",
    },
    {
      file: "dist/index.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
    }),
  ],
  external: ["react", "react-dom", "apexgantt"],
};
