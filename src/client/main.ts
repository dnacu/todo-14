import './styles/globalstyle.scss'
import './styles/page.scss'

import './scripts/card-dnd'
import './scripts/column-dnd'

import './scripts/init.ts'
import './scripts/column.ts'
import './scripts/card.ts'
import './scripts/activity.ts'

import './scripts/color-scheme.ts'
import { resetDatabaseAPI } from './api/reset-database'

import io from 'socket.io-client'
import { createCardClient } from './scripts/card-handlers'

function reset() {
  resetDatabaseAPI(
    parseInt(document.querySelector('.app').getAttribute('board-id'))
  ).then(() => {
    window.location.reload()
  })
}

window.addEventListener('load', () => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'z' && e.metaKey && e.shiftKey) {
      reset()
    }
  })

  document
    .querySelector<HTMLDivElement>('.reset')
    .addEventListener('click', reset)
})

export const socket = io.connect(
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:12100'
    : 'wss://todo.woowahan.dev:12100'
)

socket.on('card', ([data]) => {
  const { type, payload } = data

  if (type === 'create') {
    createCardClient(payload.columnId, payload.cardId, payload.content)
  }
})
