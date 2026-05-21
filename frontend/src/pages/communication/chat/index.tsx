import { useState } from 'react'

import ChatContainer from './ChatContainer'
import ChatList from './components/ChatList'
import { mockConversations } from './mock-data'

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const activeConversation = mockConversations.find((conversation) => conversation.id === activeChatId)

  const readText = (text: string) => {
    const cleanText = text.trim()

    if (!cleanText || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(cleanText))
  }

  if (activeConversation) {
    return (
      <div className='transition-opacity duration-200'>
        <ChatContainer
          key={activeConversation.id}
          conversation={activeConversation}
          onBackToList={() => setActiveChatId(null)}
        />
      </div>
    )
  }

  return (
    <div className='transition-opacity duration-200'>
      <ChatList
        conversations={mockConversations}
        onSelectConversation={setActiveChatId}
        onReadListTitle={() => readText('D-SHIFTIFY chat list')}
      />
    </div>
  )
}
