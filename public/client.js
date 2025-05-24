const SOCKET_URL = window.location.host + "/client";
const socket = io.connect(SOCKET_URL);

let poemPosition = null;   // Your grid position (e.g., {x: 1, y: 0})
let poemFragment = [];     // The part of the poem assigned to you

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(LEFT, TOP);
  fill(255);
  textSize(18);
}


function draw() {
  background(0);

  if (poemFragment.length > 0) {
    let x = 30;
    let y = 30;

    for (let line of poemFragment) {
      text(line.trim(), x, y);
      y += 30;
    }

    textSize(14);
    //text(`Grid Position: (${poemPosition.x}, ${poemPosition.y})`, x, height - 40);
  } else {
    textAlign(CENTER, CENTER);
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

