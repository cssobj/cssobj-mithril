
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
      '&:before, .link': {
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
  },
  view(ctrl) {
    var mc = ctrl.mc
    return mc('ul.menu', [
      // mc('style', mc.css().css),
      'test font as red',
      mc('li.item', {onclick:function() {
        mc.remove({'ul.menu':{font_size:1}})
        console.log(mc.obj())
      }}, 'test font with blue')
    ])
  }
}
m.mount(document.getElementById('menu1'), v)





//
// APP 02

var obj2 = {
  'ul.menu': {
    font_size: '32px',
    background_color: 'red',
    borderRadius: '2px',
    'li.item, li.cc': {
      color: 'blue',
      '&:before, .link': {
        ".foo[title*='\\&'], :global(.xy)": {color: 'blue'},
      },
      'html:global(.ie8) &': {color: 'purple'},
    }
  }
}

var v2 = {
  controller: function(){
    this.mc = cssobj_m(m, obj2, {
      // local:true,
      // post:[cssobj_plugin_post_stylize({ attrs: {media: 'screen'}})]
    })
  },
  view(ctrl) {
    var mc = ctrl.mc
    return mc('ul.menu', [
      mc('style', mc.css().css),
      'test font as red',
      mc('li.item', {onclick:function() {
        mc.add({'ul.menu':{line_height:'119px'}})
        console.log(mc.obj())
      }}, 'test font with blue')
    ])
  }
}
m.mount(document.getElementById('menu2'), v2)
