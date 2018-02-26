(() => {
  'use strict';
  const canvas = document.getElementById('canvas')
  const imgEdit = document.getElementById('edit')
  const upload = document.getElementById('upload')
  const download = document.getElementById('download')
  const pic = document.getElementById('pic')
  const rotateElm = document.getElementById('rotate')
  const lgImg = new Image()
  const rwImg = new Image()
  const csImg = new Image()
  lgImg.crossOrigin="anonymous"
  rwImg.crossOrigin="anonymous"
  csImg.crossOrigin="anonymous"
  const confirmBtn = document.getElementById('btn')
  const scaleB = document.getElementById('scaleL')
  const scaleM = document.getElementById('scaleM')
  const selectElm = document.getElementById('select')
  const tempCanvas = document.getElementById('temp')

  lgImg.src = 'http://s.easteat.com/img/logo.jpg'
  rwImg.src = 'http://s.easteat.com/img/rw.jpg'
  csImg.src = 'http://s.easteat.com/img/cs.jpg'
  const paint = canvas.getContext('2d')
  const editCtx = imgEdit.getContext('2d')
  lgImg.onload = () => {
    'use strict';
    paint.drawImage(lgImg, 0, 0, 750, 750)
    const imageData = canvas.toDataURL('image/jpeg')
    pic.src = imageData
  }
  const drawImage = {
    image: new Image(),
    ctx: editCtx,
    tempCtx: tempCanvas.getContext('2d'),
    file: null,
    w: 450,
    h: 450,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    scale: 1,
    rotate: 0,
    renderPaint () {
      const v = this.template
      const img = v === '1' ? lgImg: (v === '2' ? rwImg : csImg)
      paint.clearRect(0, 0, this.paintW, this.paintH)
      paint.drawImage(img, 0, 0, this.paintW, this.paintH)
      const imageData = canvas.toDataURL('image/jpeg')
      pic.src = imageData
    },
    render () {
      'use strict';
      const w = this.w
      const h = this.h
      const lineH = this.lineH
      const lineW = this.lineW
      if (this.file) {
        // 清空临时画布
        const imgW = this.image.width
        const imgH = this.image.height
        const tempW = Math.max(imgW, imgH)
        tempCanvas.setAttribute('height', tempW)
        tempCanvas.setAttribute('width', tempW)
        this.tempCtx.clearRect(0, 0, tempW, tempW)
        this.tempCtx.save()
        this.tempCtx.translate(tempW/2,tempW/2);
        this.tempCtx.rotate((this.rotate / 2) * Math.PI)
        this.tempCtx.translate(-tempW/2,-tempW/2);
        this.tempCtx.drawImage(this.image, 0, 0)
        this.tempCtx.restore()
      }

      // 清空画布
      this.ctx.clearRect(0, 0, this.w, this.h)
      this.ctx.globalAlpha = 1
      this.ctx.save()
      this.ctx.scale(this.scale, this.scale)

      this.file && this.ctx.drawImage(tempCanvas, this.left, this.top)
      this.ctx.restore()
      this.ctx.globalAlpha = 0.3
      // 绘制遮盖层
      this.ctx.beginPath()
      this.ctx.lineWidth = lineH
      this.ctx.moveTo(0, 0)
      this.ctx.lineTo(w, 0)
      this.ctx.stroke()

      this.ctx.beginPath()
      this.ctx.moveTo(w, lineH/2)
      this.ctx.lineWidth = lineW
      this.ctx.lineTo(w, h)
      this.ctx.stroke()

      this.ctx.beginPath()
      this.ctx.moveTo(w - lineW/2, h)
      this.ctx.lineWidth = lineH
      this.ctx.lineTo(0, h)
      this.ctx.stroke()
      this.ctx.beginPath()
      this.ctx.moveTo(0, h - lineH/2)
      this.ctx.lineWidth = lineW
      this.ctx.lineTo(0, lineH/2)
      this.ctx.stroke()
    },
    initPaint (v = '1') { // 1 logo 2 人物 3 厨师
      this.template = v
      switch (v) {
        case '1':
          this.paintT = 252
          this.paintL = 253
          this.paintW = 750
          this.paintH = 750
          this.clipW = 244
          this.clipH = 244
          break;
        case '2':
        case '3':
          this.paintT = 445
          this.paintL = 255
          this.paintW = 750
          this.paintH = 1320
          this.clipW = 244
          this.clipH = 432
          break;
      }
      canvas.setAttribute('width', this.paintW)
      canvas.setAttribute('height', this.paintH)
      this.lineW = this.w - this.clipW
      this.lineH = this.h - this.clipH
      this.renderPaint()
      this.render()
    },
    init () {
      'use strict';
      this.initPaint()
      let bMouseIsDown = false, iLastX, iLastY
      imgEdit.addEventListener('touchstart', e => {
        bMouseIsDown = true
        let touch = e.changedTouches[0];
        iLastX = touch.pageX
        iLastY = touch.pageY
      }, false)
      imgEdit.addEventListener('touchend', () => {
        bMouseIsDown = false;
        iLastX = -1;
        iLastY = -1;
      }, false)
      imgEdit.addEventListener('touchmove', e => {
        e.preventDefault()
        if (bMouseIsDown) {
          let touch = e.changedTouches[0];
          let iX = touch.pageX
          let iY = touch.pageY
          this.left += (iX - iLastX)
          this.top += (iY - iLastY)
          iLastX = iX;
          iLastY = iY;
          this.render()
        }
      }, false)
      this.image.onload = () => {
        this.render()
      }
      rotateElm.addEventListener('click', () => {
        this.rotate = (this.rotate + 1) % 4
        this.render()
      }, false)
      scaleM.addEventListener('click', () => {
        this.scale -= .1
        this.render()
      }, false)
      scaleB.addEventListener('click', () => {
        this.scale += .1
        this.render()
      }, false)
      confirmBtn.addEventListener('click', () => {
        this.renderPaint()
        paint.drawImage(imgEdit, this.lineW / 2, this.lineH / 2, this.clipW, this.clipH, this.paintL, this.paintT, this.clipW, this.clipH)
        const imageData = canvas.toDataURL('image/jpeg')
        pic.src = imageData
      }, false)
      upload.addEventListener('change', () => {
        'use strict'
        const oFile = upload.files[0]
        this.file = oFile
        const reader = new FileReader();
        reader.onloadend = (e) => {
          const dataURL = e.target.result;
          this.image.src = dataURL
        }
        reader.readAsDataURL(oFile)
      }, false)
      selectElm.addEventListener('change', () => {
        const v = selectElm.value
        this.initPaint(v)
      }, false)
      this.render()
    }
  }
  drawImage.init()
})()
