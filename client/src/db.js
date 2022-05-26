import Gun from 'gun'

import 'gun/sea';

const gun = Gun({
  peers: [
    `http://localhost:${process.env.PORT}/gun`
  ]
})

export { gun }