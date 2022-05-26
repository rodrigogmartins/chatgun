import Gun from 'gun'
import GunSea from 'gun/sea'

const gun = Gun({
  peers: [
    `http://localhost:${process.env.PORT}/gun`
  ]
})

export { gun }