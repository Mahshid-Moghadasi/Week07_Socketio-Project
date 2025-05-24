const SOCKET_URL = window.location.host + "/client";
const socket = io.connect(SOCKET_URL);

let poemPosition = null;   // Your grid position (e.g., {x: 1, y: 0})
let poemFragment = [];     // The part of the poem assigned to you

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(LEFT, TOP);
  textWrap(WORD); // this wraps text to fit screen width  
  textAlign(LEFT, TOP);
  fill(255);
  textSize(18);
}


function draw() {
  background(0);

  if (poemFragment.length > 0) {
    textAlign(LEFT, TOP);
    textWrap(WORD);
    textSize(18);
    fill(255);

    let x = 20;  // left padding
    let y = 60;  // leave room for top message
    let maxWidth = width - 40; // padding on both sides

    for (let line of poemFragment) {
      text(line.trim(), x, y, maxWidth); // wrap within screen width
      y += 50; // space between lines
    }

  } else {
    textAlign(CENTER, CENTER);
    textSize(16);
    fill(200);
    text("Waiting for your piece of the poem...", width / 2, height / 2);
  }
}

// Update fragment + grid position from the server
socket.on("poemFragment", (data) => {
  poemPosition = data.position;
  poemFragment = data.fragment;

  // Update the top-of-page display
  const total = data.total || "?"; // in case total isn't sent
  const display = document.getElementById("positionDisplay");
  if (poemPosition) {
    display.innerHTML = `You have 1 piece out of ${total} — find others to complete the poem.<br>Your Position: (${poemPosition.x}, ${poemPosition.y})`;
  }
});

// Optional error handling
socket.on("roomFull", () => {
  alert("Room is full. Try again later.");
});

