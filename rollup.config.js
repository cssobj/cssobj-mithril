// rollup.config.js

export default {
  entry: 'lib/cssobj-mithril.js',
  moduleName: 'cssobj_mithril',
  moduleId: 'cssobj_mithril',
  globals: {
    mithril: 'm'
  },
  targets: [
    { format: 'iife', dest: 'dist/cssobj-mithril.iife.js' },
    { format: 'amd',  dest: 'dist/cssobj-mithril.amd.js'  },
    { format: 'cjs',  dest: 'dist/cssobj-mithril.cjs.js'  },
    { format: 'es',   dest: 'dist/cssobj-mithril.es.js'   }
  ]
}
