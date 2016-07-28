
var css = {
  textarea:{width:'500px', height:'300px'},
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
            return result.data.age + 'px'
          }]
        },
        '&.item.active':{
          $id: 'active',
          color: 'purple'
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
    self.mc = cssobj_mithril(result, m)


    // mithril model part
    var name = 0
    var nameArr = ['username', 'James Yang', 'Jason Zhou']
    self.age = 16
    self.getName = function(next) {
      if(next) name++
      return nameArr[name % nameArr.length]
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
        mc.result.ref.active.obj.color = 'aqua'
        mc.result.update()
      }}, 'Update Name'),

      mc('li', 'User Profile'),

      mc('li.item.active', 'Name: '+ctrl.getName()),

      mc('li.item', {onclick:ctrl.updateAge}, 'Age: '+ctrl.age + ' [+ click +] '),

      mc('li.!item', 'Company: abc')
    ])
  }
}

m.mount(document.getElementById('menu1'), com)


// hellper function to display CSSOM text

function displayCSS(result) {
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
