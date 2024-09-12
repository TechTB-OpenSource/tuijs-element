import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy'; 

export default [
  {
    input: [
      'src/index.js'
    ],
    output: {
      dir: 'public',
      format: 'es'
    },
    plugins: [
      resolve(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      copy({
        targets: [
          { src: 'src/index.html', dest: 'public/' }
        ]
      })
    ]
  },
];
