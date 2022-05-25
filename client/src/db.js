import Gun from 'gun'

const gun = Gun({
  peers: [
    `http://localhost:${process.env.PORT}/gun`
  ]
})

export { gun }