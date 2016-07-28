
var css = {
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


var com = {

  controller : function(arg){
    var self = this
    // a normal invoke to cssobj
    var result = cssobj(css, {local:true})
    // get mc instance from result and m
    self.mc = cssobj_mithril(result, m)
    // mithril model part
    var nameArr = ['username', 'James Yang', 'Jason Zhou']
    var name = 0
    self.getName = function(next) {
      if(next) name++
      return nameArr[name % 3]
    }
    self.age = 16
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
