/* global m */


/* Removed from v2.0.0, pass M or use global m */
// import m from 'mithril'

function is(object, type) {
	return {}.toString.call(object) === "[object "+ type +"]"
}

function bindM (M) {
  M = M || m;
  if (!M) throw new Error('cannot find mithril, make sure you have `m` available in this scope.')

  var mapClass = function (cssobjResult, attrs) {
    if(!is(attrs, 'Object')) return
    var classAttr = 'class' in attrs ? 'class' : 'className';
    var classObj = attrs[classAttr];
    if (classObj)
      attrs[classAttr] = cssobjResult.mapClass(classObj);
  };

  return function(cssobjResult) {
    var c = function (tag, pairs) {
      var args = [];

      for (var i = 1, length = arguments.length; i < length; i++) {
        args[i - 1] = arguments[i];
      }

      if(is(tag, 'Object')) return M.apply(null, [tag].concat(args))

		  if (!is(tag, 'String')) {
			  throw new Error("selector in m(selector, attrs, children) should " +
				                "be a string")
		  }

      mapClass(cssobjResult, pairs);
      return M.apply( null, [cssobjResult.mapSel(tag)].concat(args) )
    };

    c.old = M;

    for(var i in M) {
      c[i] = M[i];
    }

    c.result = cssobjResult;

    return c
  }

}

export default bindM;
