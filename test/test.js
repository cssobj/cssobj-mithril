var expect = require('chai').expect
var localize = require('cssobj-plugin-localize')
var cssobj_core = require('cssobj-core')
var cssobj_mithril = require('../dist/cssobj-mithril.cjs.js')
var render = require('mithril-node-render')

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

var cssobj = cssobj_core({plugins:[localize('prefix_')]})

describe('test for cssobj-mithril', function() {

  it('should map selector and class list', function() {
    var result = cssobj(obj)
    var mc = cssobj_mithril(result)

    expect(render(mc('li.red:global(.orange)', {class:'blue !orange'})))
      .equal('<li class="prefix_red orange  prefix_blue orange"></li>')
  })

  it('should map selector with component', function() {
    var result = cssobj(obj)
    var mc = cssobj_mithril(result)

    var component = {
      view: function(){
        return mc('li.item', {class:'news   !active'})
      }
    }

    expect(render(mc(component)))
      .equal('<li class="prefix_item  prefix_news active"></li>')

  })

})
