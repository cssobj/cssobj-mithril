var localize = require('cssobj-plugin-localize')
var cssobj = require('cssobj-core')({
	plugins:[localize()]
})

var mithril = require("./mithril.js/mithril")
var cssobj_mithril = require("../dist/cssobj-mithril.cjs.js")

var obj = {
  '.red':{
    color:'red',
    p:{
      fontSize:'12px'
    }
  },
  '.blue':{
    color:'blue'
  },
  '.orange':{
    color:'orange'
  }
}

module.exports = cssobj_mithril(mithril)(cssobj(obj))
