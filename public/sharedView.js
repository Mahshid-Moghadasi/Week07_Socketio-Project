const SOCKET_URL = window.location.host;
const socket = io.connect(SOCKET_URL + "/sharedView");

const users = new Map(); // Track all connected clients

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  textAlign(LEFT, TOP);
  textSize(14);
  noStroke();
  rectMode(CENTER);
  angleMode(DEGREES);

  socket.on("userJoined", onUserJoined);
  socket.on("userLeft", onUserLeft);
  socket.on("poemAssignment", onPoemAssignment);
}

function draw() {
  background(0);

  if (users.size === 0) {
    fill(200);
    textAlign(CENTER, CENTER);
    text("Waiting for clients to connect...", width / 2, height / 2);
    return;
  }

  const gridSize = ceil(sqrt(users.size));
  const margin = 40;
  const cellWidth = (width - margin * 2) / gridSize;
  const cellHeight = (height - margin * 2) / gridSize;

  for (const [id, user] of users.entries()) {
    if (!user.position) continue;

    const { x, y } = user.position;
    const cellX = margin + x * cellWidth;
    const cellY = margin + y * cellHeight;

    // Draw background for this user's cell
    fill(30);
    stroke(255);
    rect(cellX + cellWidth / 2, cellY + cellHeight / 2, cellWidth - 10, cellHeight - 10);

    // Show poem fragment and ID
    noStroke();
    fill(255);
    textSize(10);
    textAlign(LEFT, TOP);

    text(`ID: ${id.slice(0, 5)}`, cellX + 10, cellY + 10);

    if (user.fragment) {
      let yOffset = 25;
      for (let line of user.fragment) {
        text(line.trim(), cellX + 10, cellY + yOffset);
        yOffset += 14;
      }
    }
  }
}

function onUserJoined(data) {
  users.set(data.id, {});
}

function onUserLeft(data) {
  users.delete(data.id);
}

function onPoemAssignment(data) {
  if (!users.has(data.id)) {
    users.set(data.id, {});
  }
  const user = users.get(data.id);
  user.position = data.position;
  user.fragment = data.fragment;
}

function touchStarted(e) {
  e.preventDefault();
}