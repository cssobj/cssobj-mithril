

cssobj({'ul.!menu.main':{'li.item':{color:'red'}}}, {
  local:false,
  post:[cssobj_plugin_post_stylize({attrs: {media: 'screen'}})]
})

var mc = cssobj_m()
mc.css({
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
}, {
  local:true,
  post:[cssobj_plugin_post_stylize({name:'mimi', attrs: {media: 'screen'}})]
})

// console.log(mc.css({'ul.menu':{color:'abc'}}))

var v = {
  view() {
    return mc('ul.menu', [
      // mc('style', mc.css().css),
      'test font as red',
      mc('li.item', 'test font with blue')
    ])
  }
}

m.mount(document.body, v)
