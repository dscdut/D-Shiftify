import { type MockConversation } from './types'

export const mockConversations: MockConversation[] = [
  {
    id: 'conversation-training-1',
    contactName: 'Bright Future Training Center',
    title: 'Digital Skills Class',
    participantRole: 'training_facility',
    messages: [
      {
        id: 'training-message-1',
        sender: 'candidate',
        text: 'Hello, I am visually impaired and interested in your digital skills course. Do you have evening classes?',
        timestamp: '08:30',
        hasAudio: true
      },
      {
        id: 'training-message-2',
        sender: 'training_facility',
        text: 'Hello. Yes, our screen reader friendly class runs every Tuesday and Thursday from 6 PM to 8 PM.',
        timestamp: '08:34',
        hasAudio: true
      },
      {
        id: 'training-message-3',
        sender: 'candidate',
        text: 'That schedule works for me. Can I join remotely, and will the learning materials support audio reading?',
        timestamp: '08:38',
        hasAudio: true
      },
      {
        id: 'training-message-4',
        sender: 'training_facility',
        text: 'You can join remotely. We provide accessible documents, audio summaries, and keyboard navigation practice.',
        timestamp: '08:42',
        hasAudio: true
      }
    ]
  },
  {
    id: 'conversation-recruiter-1',
    contactName: 'Linh Tran',
    title: 'Remote Support Role',
    participantRole: 'recruiter',
    messages: [
      {
        id: 'recruiter-message-1',
        sender: 'recruiter',
        text: 'Hello, this is Linh from D-SHIFTIFY. I reviewed your profile and would like to discuss a remote customer support role.',
        timestamp: '09:15',
        hasAudio: true
      },
      {
        id: 'recruiter-message-2',
        sender: 'candidate',
        text: 'Hello Linh. Thank you for contacting me. I am interested in learning more about the position.',
        timestamp: '09:17',
        hasAudio: true
      },
      {
        id: 'recruiter-message-3',
        sender: 'recruiter',
        text: 'The role uses screen reader friendly tools. The schedule is Monday to Friday with flexible start times.',
        timestamp: '09:20',
        hasAudio: true
      },
      {
        id: 'recruiter-message-4',
        sender: 'candidate',
        text: 'That sounds suitable for me. Could you please share the interview time and required documents?',
        timestamp: '09:23',
        hasAudio: true
      }
    ]
  },
  {
    id: 'conversation-admin-1',
    contactName: 'D-SHIFTIFY Support',
    title: 'Profile Verification',
    participantRole: 'admin',
    messages: [
      {
        id: 'admin-message-1',
        sender: 'admin',
        text: 'Your profile verification is almost complete. Please confirm that your preferred contact method is phone call.',
        timestamp: '10:05',
        hasAudio: true
      },
      {
        id: 'admin-message-2',
        sender: 'candidate',
        text: 'Yes, phone call is my preferred contact method. Please also keep email notifications enabled.',
        timestamp: '10:08',
        hasAudio: true
      }
    ]
  },
  {
    id: 'conversation-candidate-1',
    contactName: 'Nguyen Minh',
    title: 'Peer Interview Practice',
    participantRole: 'candidate',
    messages: [
      {
        id: 'candidate-message-1',
        sender: 'candidate',
        text: 'Hi, I am also preparing for a recruiter interview. Would you like to practice common questions together?',
        timestamp: '11:12',
        hasAudio: true
      },
      {
        id: 'candidate-message-2',
        sender: 'candidate',
        text: 'Yes, that would help. I want to practice explaining my screen reader workflow clearly.',
        timestamp: '11:16',
        hasAudio: true
      }
    ]
  }
]
