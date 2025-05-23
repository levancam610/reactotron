import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"
import minify from "rollup-plugin-babel-minify"

function getPlugins() {
  return [
    resolve({ extensions: [".ts", ".tsx"] }),
    babel({ extensions: [".ts", ".tsx"], runtimeHelpers: true }),
    process.env.NODE_ENV === "production"
      ? minify({
          comments: false,
        })
      : null,
    filesize(),
  ]
}

const EXTERNALS = [
  "reactotron-core-client",
  "react",
  "react-native",
  "react-native/Libraries/Network/XHRInterceptor",
]

export default [
  {
    input: "src/reactotron-react-native.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
      },
    ],
    plugins: getPlugins(),
    external: EXTERNALS,
  },
]
