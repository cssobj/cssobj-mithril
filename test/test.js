var expect = require('chai').expect
var localize = require('cssobj-plugin-localize')
var cssobj_core = require('cssobj-core')
var cssobj_mithril = require('../dist/cssobj-mithril.cjs.js')
var render = require('mithril-node-render')

// bind to mithril
var mithril = cssobj_mithril(require('mithril'))

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
var mc, rewrite

function testSuite (it) {

  it('should map selector and class list', function() {

    expect(render(mc('li.red:global(.orange)', {class:'blue !orange'})))
      .equal('<li class="prefix_red orange  prefix_blue orange"></li>')

    // old m will not alter class
    expect(render(mc.old('li.red.orange', {class:'blue orange'})))
      .equal('<li class="red orange blue orange"></li>')

  })

  it('should map selector with component', function() {
    var result = cssobj(obj)
    var mc = mithril(result)

    var component = {
      view: function(){
        return mc('li.item', {class:'news   !active'})
      }
    }

    expect(render(mc(component)))
      .equal('<li class="prefix_item  prefix_news active"></li>')

  })

  it('should keep all m functions', function() {
    var result = cssobj(obj)
    var m = mithril(result)
    expect(typeof m.old).equal('function')
    expect(typeof m.prop).equal('function')
    expect(typeof m.redraw).equal('function')
  })

}

describe('test for preset suite', function() {

  beforeEach(function() {
    var result = cssobj(obj)
    mc = mithril(result)
  })

  testSuite(it)

})


describe('test for v1.x', function() {

  var path = require('path')
  var fs = require('fs')
  var exec = require('child_process').exec

  before(function(done) {
    // it may take 3 min to rewrite clone repo
    this.timeout(1800000)

    // change all mithril into cssobj_mithril
    var changeRequire = function() {
      var file = path.join(__dirname, 'mithril.js/tests/test-api.js')
      var content = fs.readFileSync(file, 'utf8')
      fs.writeFileSync(file, content.replace('require("../mithril")', 'require("../../cssobj_mithril.js")'), 'utf8')

      done()
    }

    // check if mithril.js exists
    // If not, clone the repo
    try {
      fs.statSync(path.join(__dirname, 'mithril.js'))
      changeRequire()
    } catch(e) {
      exec('git clone -b next --single-branch https://github.com/MithrilJS/mithril.js && cd mithril.js && npm i', {cwd: __dirname}, function() {
        changeRequire()
      })
    }
  })

  describe('test v1.x for preset suite', function() {
    beforeEach(function() {
      var result = cssobj(obj)

      var mock = require("./mithril.js/test-utils/browserMock")()
		  if (typeof global !== "undefined") global.window = mock, global.document = mock.document

      mc = cssobj_mithril(require('./mithril.js/mithril.js'))(result)
    })

    testSuite(it)
  })


  it('should pass all the tests in v1.x', function(done) {
    this.timeout(50000)
    // Test failed
    exec('cd mithril.js && npm test', {cwd: __dirname}, function(error, stdout, stderr) {
      // console.log(444, error, 555, stdout, 666, stderr)
      done(stderr)
    })
  })

})
