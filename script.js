const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('userImage');
const downloadBtn = document.getElementById('downloadBtn');

const overlayImg = new Image();
overlayImg.src = './assets/pill.png'; // Make sure pill.png is inside assets folder

let userImg = null;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (userImg && userImg.complete && userImg.naturalWidth) {
    // cover canvas
    const scale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height);
    const sw = userImg.width * scale;
    const sh = userImg.height * scale;
    const dx = (canvas.width - sw) / 2;
    const dy = (canvas.height - sh) / 2;
    ctx.drawImage(userImg, dx, dy, sw, sh);
  }

  if (overlayImg && overlayImg.complete && overlayImg.naturalWidth) {
    const overlayScale = 0.5; // pill width fraction of canvas
    const oW = canvas.width * overlayScale;
    const oH = overlayImg.height * (oW / overlayImg.width);
    const x = (canvas.width - oW) / 2;
    const y = canvas.height - oH - 10;
    ctx.drawImage(overlayImg, x, y, oW, oH);
  }
}

fileInput.addEventListener('change', (ev) => {
  const f = ev.target.files[0];
  if (!f) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      userImg = img;
      draw();
      downloadBtn.disabled = false;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(f);
});

downloadBtn.addEventListener('click', () => {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clear-pill-pfp.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, 'image/png');
});
