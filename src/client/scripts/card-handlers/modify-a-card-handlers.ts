import { generateEditCardForm } from '@/client/scripts/html-generator'

import { parseContent, parseLink } from '@/client/utils/content-parser'
import { eventCollector } from '@/client/utils/event-collector'

import { modifyACardAPI } from '@/client/api/modify-a-card'

import { CardData } from '../card'
import { getCardData } from '../get-data-id'
import { escapeHtml } from '@/client/utils/escape-html'

const textAreaKeyupHandler = (e) => {
  e.stopPropagation()
  const editBtn = document.querySelector('.card-btn.edit')

  const value = e.target.value.trim()
  if (!value) {
    editBtn.setAttribute('disabled', 'true')
  } else {
    editBtn.removeAttribute('disabled')
  }
}

// '카드 수정(카드 클릭)'
const editCardFormHandler = ({
  cardElm,
  ids,
}: Pick<CardData, 'cardElm' | 'ids'>) => {
  const { content } = getCardData(cardElm)

  const [, , cardId] = ids
  const editCardFormElm = generateEditCardForm({ content, id: cardId })
  cardElm.parentNode.insertBefore(editCardFormElm, cardElm)

  cardElm.classList.add('hide')

  const textAreaElm = editCardFormElm.querySelector<HTMLTextAreaElement>(
    'textarea'
  )

  textAreaElm.select()

  eventCollector.add(textAreaElm, 'keyup', textAreaKeyupHandler)
}

// '수정' 확인
const editCardHandler = async (
  { cardFormElm, ids }: Pick<CardData, 'cardFormElm' | 'ids'>,
  previousCardId: number
) => {
  const textAreaElm = cardFormElm.querySelector('textarea')
  const content = escapeHtml(textAreaElm.value.trim())
  if (!content) return

  const cardElm = document.querySelector('.card.hide')

  const [boardId, columnId, cardId] = ids

  const success = modifyACardAPI({
    urlParam: { boardId, columnId, cardId },
    bodyParam: { content, columnId, icon: null, previousCardId },
  })

  if (!success) return

  const str = parseLink(content)
  const [title, body] = parseContent(str)
  cardElm.querySelector('.card-title').innerHTML = title
  cardElm.querySelector('.card-body').innerHTML = body

  cardFormElm.remove()
  cardElm.classList.remove('hide')

  eventCollector.remove(textAreaElm, 'keyup')
}

export { editCardHandler, editCardFormHandler }
