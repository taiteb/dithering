let img
let wid
let hig
// ASCII characters from darkest to brightest
let ascii = ['@', '%', '#', '*', '+', '-', ':', '.']
// 2d array that will store ascii-converted pixel data 
let newimg = []
let c

// preload image for performance
function preload() {
  img = loadImage('/utopia.jpg')
  pixelDensity(2)
}

function setup() {
  // resize to reduce load on pixel data extraction
  // img.resize(400, 0)
  background(255)
  wid = img.width
  hig = img.height
  // resize back up for ascii character clarity 
  c = createCanvas(wid, hig);
  // load source image pixels, iterate by rows/cols, extract pixel data 
  img.loadPixels();
  for (let i = 0; i < hig; i += 5) {
    let row = []
    for (let j = 0; j < wid; j += 5) {
      // p5 uses a 1d array for images, stored RGBA
      // index location for the pixel we're observing is our current location
      // on the row, plus however many rows we're down (times number of pixels in that row)
      // multiplied by 4 (4 data points [RGBA] for each pixel)
      let index = (j + i * wid) * 4
      r = img.pixels[index]
      g = img.pixels[index + 1]
      b = img.pixels[index + 2]
      row.push(rgbAvgToAscii(r, g, b))
    }
    newimg.push(row)
  }
  img.updatePixels()
  background(255)
  let halftoneValues = [15, 45, 75];
  // let rgbColors = ["#FF0000", "#00FF00", "#0000FF"]
  let rgbColors = ["#E9D985", "#93d995", "#2DC7FF"]
  // scale text size to size of image, assigns alignment so things can easily be mapped by pixel location
  let txtsiz = (height / newimg.length)
  textSize(txtsiz)
  textAlign(LEFT);
  textAlign(TOP);
  let embiggening = 5
  // draws ascii character to screen, multiplying index by size of character for proper spacing
  for (let i = 0; i < newimg.length; i++) {
    for (let j = 0; j < newimg[i].length; j++) {
      // Constants for logarithmic scaling
      const a = embiggening * 2;  // Max value
      const b = 0.2;  // Adjust scaling behavior

      // Apply logarithmic scaling
      let stk = a * (Math.exp(b * newimg[i][j][3]) - 1);  // Adding 1 to prevent log(0) at h = 0
      // let stk = newimg[i][j][h]
      strokeWeight(stk + 1)
      stroke('black')
      point((j * embiggening), (i * embiggening))
      for (let h = 0; h < halftoneValues.length; h++) {
        // text(newimg[i][j], j*txtsiz, i*txtsiz)
        halftone = halftoneValues[h]
        // xHT = (j * cos(halftone)) / (j * sin(halftone));
        // yHT = (i * cos(halftone)) / (i * sin(halftone));
        r = embiggening * 1.25
        xHT = r * cos(halftone);
        yHT = r * sin(halftone);
        // Apply exponential scaling
        let stk = a * (Math.exp(b * newimg[i][j][h]) - 1);  // Adding 1 to prevent log(0) at h = 0
        // let stk = newimg[i][j][h]
        strokeWeight(stk + 1)
        stroke(rgbColors[h])
        point((j * embiggening) + xHT, (i * embiggening) + yHT)
      }
    }
  }
}

function draw() {
}

function rgbAvgToAscii(r, g, b) {
  // This weights the values based on luminosity, scales it to 255, and accesses 
  // the ascii character stored at that index (0-9)
  let avg = 1 - ((r * 0.2126 + g * 0.7152 + b * 0.0322) / 255)
  let adjustedAvg = ceil(avg * 10)
  // console.log(adjustedAvg)
  // return adjustedAvg
  // return [r * 0.2126, g * 0.7152, b * 0.0722]
  // console.log([((255/r) * 0.2126), ((g / 255) * 0.5152), ((b / 255) * 0.0722)])
  if ((g / 255) > 0.25) {
    console.log(g, (g / 255))
  }
  return [((r / 255)), ((g / 255)), ((b / 255)), (1-((r + g + b) / 3) / 255)]
}

function mouseClicked() {
  save(c, `img.png`)
}