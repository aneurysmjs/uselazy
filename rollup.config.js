import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const noDeclarationFiles = { compilerOptions: { declaration: false } };

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

const extensions = ['.tsx'];

const namedExports = {
  react: ['useEffect', 'useState']
};

export default [
  // ES
  {
    input: 'src/index.tsx',
    output: {
      file: 'es/uselazy.js',
      format: 'es',
      indent: false
    },
    external,
    plugins: [
      commonjs({
        namedExports,
      }),
      nodeResolve({
        extensions,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
    ],
  },
  // ES for Browsers
  {
    input: 'src/index.tsx',
    output: { file: 'es/uselazy.mjs', format: 'es', indent: false },
    external,
    plugins: [
      commonjs({
        namedExports,
      }),
      nodeResolve({
        extensions,
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
  // UMD Development
  {
    input: 'src/index.tsx',
    output: {
      file: 'dist/uselazy.js',
      format: 'umd',
      name: 'useLazy',
      indent: false,
      globals: {
        react: 'React',
      },
    },
    external,
    plugins: [
      commonjs({
        namedExports,
      }),
      nodeResolve({
        extensions
      }),
      typescript({ useTsconfigDeclarationDir: true }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  },

  // UMD Production
  {
    input: 'src/index.tsx',
    output: {
      file: 'dist/uselazy.min.js',
      format: 'umd',
      name: 'useLazy',
      indent: false,
      globals: {
        react: 'React',
      },
    },
    external,
    plugins: [
      commonjs({
        namedExports,
      }),
      nodeResolve({
        extensions,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  }
];
