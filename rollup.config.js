import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

function build({ input, output, external }) {
  return [
    // browser-friendly UMD build
    {
      input: input,
      external,
      output: {
        name: output.name,
        dir: output.dir,
        file: pkg.browser,
        format: "umd"
      },
      plugins: [
        resolve(), // so Rollup can find `ms`
        commonjs(), // so Rollup can convert `ms` to an ES module
        babel({
          exclude: ["node_modules/**"]
        })
      ]
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify
    // `file` and `format` for each target)
    {
      input: input,
      external,
      output: [
        { file: pkg.main, format: "cjs", dir: output.dir },
        { file: pkg.module, format: "es", dir: output.dir }
      ],
      plugins: [
        babel({
          exclude: ["node_modules/**"]
        })
      ]
    }
  ];
}

export default [
  ...build({
    input: "src/utils/pipe",
    output: {
      name: "pipe",
      dir: "lib/utils"
    }
  }),
  ...build({
    input: "src/hofs/defaultHeadersHOF",
    output: {
      name: "defaultHeadersHOF",
      dir: "lib"
    }
  }),
  ...build({
    input: "src/hofs/onErrorRetryHOF",
    output: {
      name: "onErrorRetryHOF",
      dir: "lib"
    },
    external: ["rxjs/Observable"]
  })
];
