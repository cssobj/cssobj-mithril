
// Global Test
cssobj({'ul.!menu.main':{'li.item':{color:'red'}}}, {
  local:false,
  post:[cssobj_plugin_post_stylize({attrs: {media: 'screen'}})]
})


//
// APP 01

var obj = {
  'ul.menu': {
    font_size: '32px',
    background_color: 'red',
    borderRadius: '2px',
    'li.item, li.cc': {
      color: 'blue',
      '&:before, &:after': {
        content:'"---"',
        ".foo[title*='\\&'], :global(.xy)": {color: 'blue'},
      },
      'html:global(.ie8) &': {color: 'purple'},
    }
  }
}

// console.log(mc.css({'ul.menu':{color:'abc'}}))

var v = {
  controller: function(){
    this.mc = cssobj_m()
    this.mc.css(obj, {
      local:true,
      post:[cssobj_plugin_post_stylize({name:'mimi', attrs: {media: 'screen'}})]
    })
    this.dom = document.getElementById('style_cssobj_mimi')
    this.prev = this.mc.css().map.item
  },
  view: function(ctrl) {
    var mc = ctrl.mc
    return mc('ul.menu', [
      // mc('style', mc.css().css),
      'test font as red',
      mc('li', ['head css dom is: ',typeof ctrl.dom]),
      mc('li', 'css for item is same? (expected:false) ', ctrl.isSame, ctrl.prev),
      mc('li.item', {onclick:function() {
        mc.option().prefix=false
        mc.remove({'ul.menu':{font_size:1}})
        ctrl.isSame = mc.css().map.item === ctrl.prev
        ctrl.prev = mc.css().map.item
      }}, 'test font with blue')
    ])
  }
}
m.mount(document.getElementById('menu1'), v)





//
// APP 02

var obj2 = JSON.parse(JSON.stringify(obj))

var v2 = {
  controller: function(){
    this.mc = cssobj_m(m, obj2, {
      // local:true,
      // post:[cssobj_plugin_post_stylize({ attrs: {media: 'screen'}})]
    })
    this.prev = this.mc.css().map.item
  },
  view: function(ctrl) {
    var mc = ctrl.mc
    return mc('ul.menu', [
      mc('style', mc.css().css),
      'test font as red',
      mc('li', ['first char of item name: ', mc.css().map.item[0]]),
      mc('li', 'prev item class is same? (expected:true) ', ctrl.isSame, ctrl.prev),
      mc('li.item', {onclick:function() {
        mc.add({'ul.menu':{line_height:'50px'}})
        console.log(mc.obj())
        ctrl.isSame = ctrl.prev== mc.css().map.item
        ctrl.prev = mc.css().map.item
      }}, 'test font with blue')
    ])
  }
}
m.mount(document.getElementById('menu2'), v2)
