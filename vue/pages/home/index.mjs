import * as render from './render.pug'
import Swal from 'sweetalert2'

import OpenImage from './open-image/index.mjs'
import Interval from './interval/index.mjs'
export default {
  ...render,
  components: {
    Interval,
    OpenImage
  },
  data: () => {
    return {
      startAt: 0,
      timeAt: 0,
      size: 200,
      answerIndex: null,
      items: []
    }
  },
  mounted () {
    import('./style.css')
  },
  methods: {
    onPaste (e) {
      // console.log('on paste', e.clipboardData)
      const files = [...e.clipboardData.files]
      files.forEach((file) => {
        this.parseImg(file)
      })
    },
    onDrop (e) {
      // console.log('on drop', e.dataTransfer)
      const files = [...e.dataTransfer.files]
      files.forEach((file) => {
        this.parseImg(file)
      })
    },
    parseImg: function (file) {
      const self = this
      const reader = new window.FileReader()
      reader.addEventListener('load', function () {
        const url = reader.result
        const img = new window.Image()
        img.onload = function () {
          self.insert(img)
        }
        img.src = url
      }, false)

      if (!file) {
        return
      }
      reader.readAsDataURL(file)
    },
    insert (img) {
      if (!img) {
        return
      }
      const id = this.items.length
      this.items.push({
        id: id,
        flipped: false,
        src: img.src
      })
      this.reset()
    },
    makeAnswer () {
      const { items } = this
      let item, answerIndex
      while (!item || item.flipped) {
        answerIndex = this.answerIndex = Math.floor(Math.random() * items.length)
        item = items[answerIndex]
      }
      Swal.fire({
        customClass: {
          htmlContainer: 'h-75',
          image: ''
        },
        didOpen: () => {
          Swal.getContainer().onclick = Swal.close
        },
        showConfirmButton: false,
        title: '請尋找',
        icon: 'question',
        html: `<img src="${item.src}" class="h-100">`
      })
    },
    choice (index) {
      const { items, answerIndex } = this
      const item = items[index]
      if (item.flipped) {
        return
      }
      item.flipped = true
      if (index !== answerIndex) {
        return
      }
      Swal.fire({
        title: '答對了!',
        icon: 'success',
        didOpen: () => {
          Swal.getContainer().onclick = Swal.close
        },
        showConfirmButton: false
      })
    },
    isAllFlipped () {
      const { items } = this
      return items.filter((item) => { return item.flipped }).length === items.length
    },
    flipAll (flipped) {
      const { items } = this
      for (let i = 0; i < items.length; i++) {
        items[i].flipped = flipped
      }

      if (flipped) {
        this.startTime()
      }
    },
    startTime () {
      this.startAt = this.timeAt = Date.now()
    },
    stopTime () {
      this.startAt = null
    },
    refreshTime () {
      this.timeAt = Date.now()
    },
    reset () {
      const items = this.items
      const len = items.length
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const randIndex = parseInt(Math.random() * len)
          const swapIndex = items[randIndex]
          items[randIndex] = items[i]
          items[i] = swapIndex
        }
      }

      Object.assign(this, {
        first: null,
        second: null
      })

      for (let i = 0; i < len; i++) {
        items[i].no = i + 1
        items[i].flipped = false
      }
    }
  }
}
