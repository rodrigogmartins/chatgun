import Gun from 'gun'
import 'gun/sea';

const gun = Gun({
  peers: [
    `http://localhost:3003/gun`
  ]
})

export { gun }