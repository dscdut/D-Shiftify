import { Volume2 } from 'lucide-react'

import { getRoleLabel } from '../role-labels'
import { type MockConversation } from '../types'

interface ChatListProps {
  conversations: MockConversation[]
  onSelectConversation: (conversationId: string) => void
  onReadListTitle: () => void
}

const getLastMessage = (conversation: MockConversation) => conversation.messages[conversation.messages.length - 1]

export default function ChatList({ conversations, onSelectConversation, onReadListTitle }: ChatListProps) {
  return (
    <main className='min-h-screen w-full bg-white text-black'>
      <section className='mx-auto min-h-screen w-full max-w-md bg-white'>
        <header className='fixed left-1/2 top-0 z-40 w-full max-w-md -translate-x-1/2 border-b-2 border-black bg-white px-4 py-4'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <p className='text-base font-black uppercase leading-none text-black'>D-SHIFTIFY</p>
              <h1 className='mt-3 text-2xl font-black uppercase leading-tight text-black'>Chat List</h1>
            </div>

            <button
              type='button'
              aria-label='Read chat list title aloud'
              onClick={onReadListTitle}
              className='flex min-h-11 min-w-11 items-center justify-center border-2 border-black bg-white p-3 text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-black'
            >
              <Volume2 aria-hidden='true' size={24} />
            </button>
          </div>
        </header>

        <nav aria-label='Recent conversations' className='pt-28'>
          <ul>
            {conversations.map((conversation) => {
              const lastMessage = getLastMessage(conversation)
              const roleLabel = getRoleLabel(conversation.participantRole)
              const snippet = lastMessage?.text || 'No messages yet'
              const timestamp = lastMessage?.timestamp || ''

              return (
                <li key={conversation.id} className='border-b border-black'>
                  <button
                    type='button'
                    aria-label={`Chat with ${conversation.contactName}, ${roleLabel}, last message: ${snippet}`}
                    onClick={() => onSelectConversation(conversation.id)}
                    className='flex min-h-24 w-full flex-col items-start gap-2 bg-white p-4 text-left text-black transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-black active:bg-gray-100'
                  >
                    <div className='flex w-full items-start justify-between gap-3'>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-xl font-black leading-tight text-black'>{conversation.contactName}</p>
                        <p className='mt-1 text-lg font-bold leading-tight text-black'>{roleLabel}</p>
                      </div>

                      <time className='shrink-0 text-base font-bold text-black' dateTime={timestamp}>
                        {timestamp}
                      </time>
                    </div>

                    <p className='line-clamp-2 text-lg leading-relaxed text-black'>{snippet}</p>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </section>
    </main>
  )
}
