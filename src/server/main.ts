import { PORT, app } from './app'
import SocketIO from 'socket.io'
import http from 'http'

const a = http.createServer(app)
const io = SocketIO(a)
a.listen(PORT, () => console.log(`Listening on port ${PORT}`))
// const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

// const io = SocketIO(server)

io.on('connect', (socket) => {
  socket.on('card', (...data) => {
    socket.broadcast.emit('card', {
      ...data,
    })
  })
})

export { io as socket }
