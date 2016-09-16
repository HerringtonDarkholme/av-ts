import {Opt} from '../src/vuex/opt'

var a = Opt.create({test: 123})
  .action("test", s => () => s.dispatch)
  .action("test1", s => (k: string) => 123)
  // .action("test2", s => (k: string, h: number) => s.dispatch)
  .mutation('addNewProduct', s => () => s.test += 1)

var b = Opt.create({myString: '333'})
.mutation('increment', s => () => s.myString += 1)
.mutation('decrement', s => (k: number) => s.myString += 1)
// .mutation('decrement', s => (k: number, h: string) => s.myString += 1)


var c = Opt.create()
  .module("a", a)
  .module("b", b)
  .getter('mytest', s => {
    return s.$('b')
  })
  .action('INCREMENT', s => (a: string) => {
  })

var cmt = c.done().dispatch

cmt('INCREMENT')("333")
