const SOCKET_URL = window.location.host + "/client";
const socket = io.connect(SOCKET_URL);

let poemPosition = null;
let poemFragment = [];

socket.on("poemFragment", (data) => {
  poemPosition = data.position;
  poemFragment = data.fragment;

  const total = data.total || "?";
  const positionText = `You have 1 piece out of ${total} — find others to complete the poem.<br>Your Position: (${poemPosition.x}, ${poemPosition.y})`;
  document.getElementById("positionDisplay").innerHTML = positionText;

  renderPoem(poemFragment);
});

socket.on("roomFull", () => {
  alert("Room is full. Try again later.");
});

function renderPoem(fragment) {
  const container = document.getElementById("poemContainer");
  container.innerHTML = ""; // clear previous content

  fragment.forEach(line => {
    const p = document.createElement("p");
    p.textContent = line.trim();
    container.appendChild(p);
  });
}