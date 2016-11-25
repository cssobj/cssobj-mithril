/* global m */

/* Removed from v2.0.0, pass M or use global m */
// import m from 'mithril'

function is (object, type) {
  return {}.toString.call(object) === '[object ' + type + ']'
}

export default function bindM (M) {
  M = M || m
  if (!M) throw new Error('cannot find mithril, make sure you have `m` available in this scope.')

  const mapClass = function (cssobjResult, attrs) {
    if (!is(attrs, 'Object')) return
    const classAttr = 'class' in attrs ? 'class' : 'className'
    const classObj = attrs[classAttr]
    if (classObj) {
      attrs[classAttr] = cssobjResult.mapClass(classObj)
    }
  }

  const factory = function (cssobjResult) {
    const c = function (tag, pairs) {
      const args = []

      for (let i = 1, length = arguments.length; i < length; i++) {
        args[i - 1] = arguments[i]
      }

      if (is(tag, 'Object')) return M.apply(null, [tag].concat(args))

		  if (!is(tag, 'String')) {
			  throw new Error('selector in m(selector, attrs, children) should ' +
				                'be a string')
		  }

      mapClass(cssobjResult, pairs)
      return M.apply(null, [cssobjResult.mapSel(tag)].concat(args))
    }

    c.old = M

    for (let i in M) {
      c[i] = M[i]
    }

    c.result = cssobjResult

    return c
  }

  factory.m = M

  return factory
}

