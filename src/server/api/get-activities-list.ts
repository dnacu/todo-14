import express from 'express'

import { query } from '@/server/modules/query'
import { escape } from '@/server/modules/escape'

const router = express.Router()

router.get('/board/:boardId/activity', async (req, res) => {
  const { boardId } = req.params
  const { lastSendedActivityId } = req.body

  if (!boardId) {
    res.sendStatus(404)
    return
  }

  const additionalOption = lastSendedActivityId
    ? `AND id < ${escape(lastSendedActivityId)}`
    : ''

  // SELECT * FROM activity WHERE boardId=1 AND id < 40 ORDER BY id DESC LIMIT 10
  const activities = await query<any>(
    `SELECT * FROM activity WHERE boardId=${escape(
      boardId
    )} ${additionalOption} ORDER BY id DESC LIMIT 10`
  )

  const result = []

  for (const act of activities) {
    if (act.cardId) {
      const [card] = await query(`
      SELECT * FROM card WHERE id=${escape(act.cardId)}`)
      const { id, type, boardId, occuredAt, fromm, to } = act
      result.push({
        id,
        type,
        boardId,
        occuredAt,
        fromm,
        to,
        card,
        column: null,
      })
    } else if (act.columnId) {
      const [column] = await query(`
      SELECT * FROM \`column\` WHERE id=${escape(act.columnId)}`)
      const { id, type, boardId, occuredAt, fromm, to } = act
      result.push({
        id,
        type,
        boardId,
        occuredAt,
        fromm,
        to,
        card: null,
        column,
      })
    }
  }

  res.json({ activities: result })
})

export { router as getActivitiesListRouter }