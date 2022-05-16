<template>
  <el-dialog
    title="电子签名"
    :visible.sync="dialogVisible"
    width="525px"
  >
    <canvas width="500" height="200" id="canvas" style="background: #f6f3f3;"></canvas>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="eCardImg">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    isShow() {
      this.dialogVisible = true
      Promise.resolve().then(() => {
        this._initCaves(document.getElementById('canvas'))
      })
    },
    drawLine(context, x1, y1, x2, y2) {
      context.beginPath();
      context.strokeStyle = 'black';
      context.lineWidth = 2;
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.closePath();
    },
    _initCaves(board) {
      let x = 0;
      let y = 0;

      const context = board.getContext('2d');
      const rect = board.getBoundingClientRect();

      const mouseMoveEvent = (e) => {
          this.drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
      }

      board.addEventListener('mousedown', e => {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
          board.addEventListener('mousemove', mouseMoveEvent)
      });

      board.addEventListener('mouseup', e => {
          x = 0;
          y = 0;
          board.removeEventListener('mousemove', mouseMoveEvent);
      });
    },
    convertCanvasToImage(canvas) {
      var image = new Image();
      image.setAttribute('width', '100%')
      image.setAttribute('height', '100%')
      image.src = canvas.toDataURL("image/png");
      return image;
    },
    eCardImg() {
      const img = this.convertCanvasToImage(document.getElementById('canvas'))
      this.$emit('closed', img)
      this.dialogVisible = false
    }
  }
}
</script>

<style>

</style>