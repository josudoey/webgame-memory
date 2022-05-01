import * as render from './render.pug'
export default {
  ...render,
  props: [
    'delay'
  ],
  data: function () {
    return {
      intervalId: null
    }
  },
  beforeMount () {
    const { delay } = this
    const self = this
    self.$emit('start')
    this.intervalId = setInterval(function () {
      self.$emit('elapsed')
    }, delay)
  },
  beforeDestroy () {
    this.$emit('stop')
    clearTimeout(this.intervalId)
  }
}
