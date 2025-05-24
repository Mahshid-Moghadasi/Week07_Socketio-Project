const express = require('express');

const app = express();
const port = Number(process.env.PORT || 3000);
const server = app.listen(port);

app.use(express.static('public'));

console.log(`Server is listening on port ${port}`);

const socket = require("socket.io");
const io = socket(server);


// Poem by Sully Author
const poemText = `
 In a tapestry woven by time’s embrace,
There lies a tale of humanity’s race.
A symphony composed of hues diverse,
Each note, a story, waiting to disperse.

From distant shores, we embark as one,
Bound by the sun and the moon and their run.
Melanin dances on our canvas of skin,
A kaleidoscope of stories within.

In ebony depths and ivory glow,
The beauty of contrast begins to show.
For every shade holds a history untold,
Whispering secrets of legends of old.

Through tangled pathways of prejudice and pain,
We strive for harmony, freedom to attain.
The battles fought, the triumphs gained,
The scars we bear, the hopes sustained.

In unity we find strength anew,
For diversity is our sacred view.
Together we stand, hand in hand,
A tapestry united, forever grand.

Let not the color divide, nor shadows dim,
Our hearts beat as one, a universal hymn.
Embrace the richness of cultures entwined,
For in our differences, true beauty we find.

So let us walk this path, side by side,
With empathy and love as our guide.
In this poem, let our voices ring,
Celebrating the beauty that diversity brings
`;

const poemLines = poemText.trim().split('\n');
let clients = [];

function splitLine(line, parts) {
  const avg = Math.ceil(line.length / parts);
  const chunks = [];
  for (let i = 0; i < parts; i++) {
    chunks.push(line.slice(i * avg, (i + 1) * avg));
  }
  return chunks;
}

function updatePoemFragments() {
  const total = clients.length;
  //const gridSize = Math.ceil(Math.sqrt(total));
  const maxUsers = clients.length;

  // Assign users to a 1-row horizontal grid
  const positions = [];
  for (let i = 0; i < maxUsers; i++) {
    positions.push({ x: i, y: 0 });
  }


  clients.forEach((client, i) => {
    const pos = positions[i];
    const fragment = poemLines.map(line => {
      const segments = splitLine(line, maxUsers);
      return segments[i] || '';
    });

    //send to client
    client.socket.emit('poemFragment', {
      position: pos,
      index: i,
      gridSize: maxUsers,
      fragment,
      total: clients.length
    });

    // Also notify the shared view
    io.of('/sharedView').emit('poemAssignment', {
      id: client.socket.id,
      position: pos,
      fragment: fragment
    });
  });
}

io.of('/client').on('connection', (socket) => {
  console.log("new client connection: " + socket.id);
  clients.push({ socket });

  updatePoemFragments();

  io.of('/sharedView').emit('userJoined', { id: socket.id });

  socket.on('update', (data) => {
    io.of('/sharedView').emit('userUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log("client disconnected: " + socket.id);
    clients = clients.filter(c => c.socket.id !== socket.id);
    io.of('/sharedView').emit('userLeft', { id: socket.id });
    updatePoemFragments();
  });
});

io.of('/sharedView').on('connection', (socket) => {
  console.log("new SHARED VIEW connection: " + socket.id);
});