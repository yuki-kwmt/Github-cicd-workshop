import './style.css'
import { formatAvailability } from './availability.js'

const events = [
  {
    title: 'はじめての Web アクセシビリティ',
    date: '2026-10-14',
    capacity: 20,
    attendees: 12,
  },
  {
    title: 'JavaScript テスト入門',
    date: '2026-10-21',
    capacity: 12,
    attendees: 10,
  },
  {
    title: 'チームで学ぶ GitHub',
    date: '2026-11-05',
    capacity: 15,
    attendees: 15,
  },
]

const eventList = document.querySelector('#event-list')

for (const event of events) {
  const card = document.createElement('article')
  card.className = 'event-card'

  const title = document.createElement('h3')
  title.textContent = event.title

  const date = document.createElement('time')
  date.dateTime = event.date
  date.textContent = new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'long',
  }).format(new Date(`${event.date}T00:00:00`))

  const availability = document.createElement('p')
  availability.className = 'availability'
  availability.textContent = formatAvailability(event.capacity, event.attendees)

  card.append(title, date, availability)
  eventList.append(card)
}
