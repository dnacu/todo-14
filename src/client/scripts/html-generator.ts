import { friendlyTime } from '../modules/friendly-time'
import { parseContent, parseLink } from '@/client/utils/content-parser'

export const generateElement = (html: string): HTMLElement => {
  const parser = new DOMParser()
  const newDoc = parser.parseFromString(html, 'text/html')

  return newDoc.body.firstElementChild as HTMLElement
}

export const generateColumn = ({
  id,
  name,
}: {
  id: number
  name: string
}): HTMLElement => {
  const columnHtml = `
  <div class="column" data-column-id="${id}">
    <div class="column-header">
      <div class="badge">0</div>
      <h2 class="column-name" spellcheck="false">${name}</h2>
      <div class="actions">
        <button class="action-btn new-card-btn">
          <i class="icon add">plus</i>
        </button>
        <button class="action-btn delete-column-btn">
          <i class="icon delete">xmark</i>
        </button>
      </div>
    </div>
  
    <div class="cards-container"></div>
  </div>
  `

  return generateElement(columnHtml)
}

export const generateCard = ({
  id,
  content,
}: {
  id: number
  content: string
}): HTMLElement => {
  const str = parseLink(content)
  const [title, body] = parseContent(str)

  const cardHtml = `
  <div class="card" data-card-id="${id}">
    <i class="icon card-icon">rectangle_on_rectangle_angled</i>
    <h1 class="card-title">${title}</h1>
    <p class="card-body">${body}</p>
    <button class="delete-card-btn">
      <i class="icon delete">xmark</i>
    </button>
  </div>
  `

  return generateElement(cardHtml)
}

export const generateNewCardForm = ({
  content,
}: {
  content: string
}): HTMLElement => {
  const newCardForm = `
  <div class="card new">
    <textarea
      class="content"
      spellcheck="false"
      autocomplete="off"
    >${content}</textarea>
    <div class="buttons">
      <button class="card-btn add" disabled="true">Done</button>
      <button class="card-btn cancel">Cancel</button>
    </div>
  </div>
  `

  return generateElement(newCardForm)
}

export const generateEditCardForm = ({
  content,
  id,
}: {
  content: string
  id: number
}): HTMLElement => {
  const linkRegex = /(<a)(.*?)(href=")(.*?)"(.*?)>(.*?)(<\/a>)/gm
  const str = content.replace(linkRegex, `[$6]($4)`)

  const newCardForm = `
  <div class="card new" data-card-id="${id}">
    <textarea
      class="content"
      spellcheck="false"
      autocomplete="off"
    >${str}</textarea>
    <div class="buttons">
      <button class="card-btn edit" disabled="true">Done</button>
      <button class="card-btn cancel">Cancel</button>
    </div>
  </div>
  `

  return generateElement(newCardForm)
}

export const generateActivity = ({
  id,
  iconName,
  content,
  time,
}: {
  id: number
  iconName: string
  content: string
  time: string
}): HTMLElement => {
  const cardIconClassName =
    iconName === 'plus_circle_fill'
      ? 'create'
      : iconName === 'minus_circle_fill'
      ? 'delete'
      : iconName === 'pencil_circle_fill'
      ? 'modify'
      : iconName === 'arrow_right_arrow_left_circle_fill'
      ? 'move'
      : ''

  const activity = `
    <div class="activity" data-act-id="${id}">
      <div class="icon-wrapper ${cardIconClassName}">
        <i class="icon">${iconName}</i>
      </div>
      <div class="content">
        <div class="body">${content}</div>
        <span class="time"><i class="icon">clock</i>${friendlyTime(
          new Date(time)
        )}</span>
      </div>
    </div>
    `

  return generateElement(activity)
}
