const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("color");
const bgColorPicker = document.getElementById("bg-color");
const fontSizeSelector = document.getElementById("font-size");
const brushShapeSelector = document.getElementById("brush-shape");
const clearBtn = document.getElementById("clearBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const saveBtn = document.getElementById("saveBtn");
const savePdfBtn = document.getElementById("savePdfBtn");
const retrieveBtn = document.getElementById("retrieveBtn");
const fileUpload = document.getElementById("fileUpload");

let isDrawing = false;
let savedData = null;
let history = [];
let redoHistory = [];

canvas.width = canvas.parentElement.offsetWidth;
canvas.height = 300;

function saveState() {
  history.push(canvas.toDataURL());
  redoHistory = [];
}

function startDrawing(event) {
  isDrawing = true;
  saveState();
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
}

function draw(event) {
  if (!isDrawing) return;
  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = fontSizeSelector.value;
  ctx.lineCap = brushShapeSelector.value;
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
  ctx.closePath();
}

function clearCanvas() {
  ctx.fillStyle = bgColorPicker.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  saveState();
}

function undo() {
  if (history.length > 0) {
    redoHistory.push(history.pop());
    const img = new Image();
    img.src = history[history.length - 1] || "";
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}

function redo() {
  if (redoHistory.length > 0) {
    const img = new Image();
    img.src = redoHistory.pop();
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    history.push(img.src);
  }
}

function saveCanvas() {
  const link = document.createElement("a");
  link.download = "signature.png";
  link.href = canvas.toDataURL();
  link.click();
}

function saveAsPDF() {
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF();
  pdf.addImage(imgData, "PNG", 10, 10, 190, 80);
  pdf.save("signature.pdf");
}

function retrieveCanvas() {
  if (savedData) {
    const img = new Image();
    img.src = savedData;
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else {
    alert("No saved signature to retrieve!");
  }
}

function uploadFile(event) {
  const file = event.target.files[0];
  if (file) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

clearBtn.addEventListener("click", clearCanvas);
undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);
saveBtn.addEventListener("click", () => {
  savedData = canvas.toDataURL();
  saveCanvas();
});
savePdfBtn.addEventListener("click", saveAsPDF);
retrieveBtn.addEventListener("click", retrieveCanvas);
fileUpload.addEventListener("change", uploadFile);

bgColorPicker.addEventListener("input", () => {
  ctx.fillStyle = bgColorPicker.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

window.addEventListener("resize", () => {
  const temp = canvas.toDataURL();
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = 300;
  const img = new Image();
  img.src = temp;
  img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
});
