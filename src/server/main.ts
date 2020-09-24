import { PORT, app } from './app'
import SocketIO from 'socket.io'

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

const io = SocketIO.listen(server)

io.on('connect', (socket) => {
  socket.on('card', (...data) => {
    socket.broadcast.emit('card', {
      ...data,
    })
  })
})

export { io as socket }
