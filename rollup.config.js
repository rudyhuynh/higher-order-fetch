import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

const fs = require("fs");

function build({ input, output, external }) {
  return [
    {
      input: input,
      output: {
        name: output.file,
        file: output.file + ".umd.js",
        format: "umd"
      },
      plugins: [
        resolve(),
        commonjs(),
        babel({
          exclude: ["node_modules/**"]
        })
      ]
    },

    {
      input: input,
      external,
      output: [
        { file: output.file + ".cjs.js", format: "cjs" },
        {
          file: output.file + ".js",
          format: "es"
        }
      ],
      plugins: [
        babel({
          exclude: ["node_modules/**"]
        })
      ]
    }
  ];
}

const exceptHOFs = ["onErrorRetryHOF"];

export default [
  ...build({
    input: "src/utils/pipe",
    output: {
      file: "utils/pipe"
    }
  }),
  ...fs
    .readdirSync("./src/hofs")
    .filter(file => !file.endsWith("test.js"))
    .map(file => file.slice(0, -3))
    .filter(fileName => !exceptHOFs.includes(fileName))
    .map(fileName =>
      build({
        input: "src/hofs/" + fileName,
        output: {
          file: "hofs/" + fileName
        }
      })
    )
    .reduce(function(a, b) {
      return a.concat(b);
    }, []),
  ...build({
    input: "src/hofs/onErrorRetry",
    output: {
      file: "hofs/onErrorRetry"
    },
    external: ["rxjs", "rxjs/operators"]
  })
];
