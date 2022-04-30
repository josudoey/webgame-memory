import * as render from './render.pug'

export default {
  ...render,
  props: [],
  data: function () {
    return {
      id: ''
    }
  },
  created() {
    this.id = `img-${this._uid}`
  },
  mounted() {
  },
  methods: {
    change(e) {
      const input = e.srcElement
      for (const file of input.files) {
        this.readFile(file)
      }
      input.value = ''
    },
    readFile: function (file) {
      const self = this
      const reader = new window.FileReader()
      reader.addEventListener('load', function () {
        const url = reader.result
        const img = new window.Image()
        img.onload = function () {
          const { width, height } = this
          Object.assign(self, {
            width: width,
            height: height,
            url: url
          })
          self.$emit('load', img, self)
        }
        img.src = url
      }, false)

      if (!file) {
        return
      }
      reader.readAsDataURL(file)
    }
  }
}
