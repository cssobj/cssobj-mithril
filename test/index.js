
var css = {
  textarea:{width:'600px', height:'120px'},
  '#menu1':{
    fontFamily: 'Arial,Helvetica',
    fontSize: '16px',
    color: 'green',
    'ul.profile':{
      'li':{
        color:'red',
        '&.item':{
          $id: 'item',
          color: 'blue',
          fontSize: [16, function(prev, node, result) {
            return result.data.age ? result.data.age + 'px' : prev
          }]
        },
        '&.item.active':{
          $id: 'active',
          color: ['purple', function(prev, node, result) {
            return result.data.color || prev
          }]
        }
      },
      'li:global(.item)':{
        color: 'teal'
      }
    }
  }
}

function cssobj_plugin_post_csstext(callback) {
  var cb = function(str) {
    typeof callback=='function' && callback(str)
  }

}

var com = {

  controller : function(arg){
    var self = this

    // invoke cssobj
    var result = cssobj(css, {local:true, onUpdate: displayCSS})

    // get mc instance from result and m
    self.mc = cssobj_mithril(m)(result)

    // mithril model part
    var name = 0
    var colorArr = ['brown', 'orange', 'cyan']
    var nameArr = ['username', 'James Yang', 'Jason Zhou']
    self.age = 16
    self.getName = function(next) {
      if(next) name++
      var len = nameArr.length
      result.update({color: colorArr[name % len]})
      return nameArr[name % len]
    }
    self.updateAge = function() {
      self.age++
      // fontSize will be same as age
      result.update({age: self.age})
    }
  },

  view : function(ctrl, arg) {
    var mc = ctrl.mc
    return mc('ul.profile', [

      mc('a[href="#"]', {onclick:function(e) {
        ctrl.name = ctrl.getName(true)
      }}, 'Update Name'),

      // mc also work with component
      mc({view:function() {
        return m('li', 'User Profile')
      }}),

      mc('li.item.active', 'Name: '+ctrl.getName()),

      mc('li.item', {class: ':global(.item nav) .nav', onclick:ctrl.updateAge}, 'Age: '+ctrl.age + ' [+ click +] '),

      mc('li.!item', 'Company: abc')
    ])
  }
}

m.mount(document.getElementById('menu1'), com)

displayHTML()


// hellper function to display CSSOM text

function displayHTML() {
  setTimeout(function() {
    document.getElementById('htmltext').value = document.getElementById('menu1').innerHTML.replace(/<a|<li/gi, '\n  $&')
  })
}

function displayCSS(result) {
  displayHTML()
  var cb = function(str) {
    document.getElementById('csstext').value = str
  }
  var dom = result.cssdom

  if(!dom) return cb('')
  var sheet = dom.sheet || dom.styleSheet
  if(sheet.cssText) return cb(sheet.cssText)

  var str = ''
  var rules = sheet.cssRules || sheet.rules
  for(var i = 1, len = rules.length; i < len; i++) {
    str += rules[i].cssText + '\n'
  }

  return cb(str)
}
