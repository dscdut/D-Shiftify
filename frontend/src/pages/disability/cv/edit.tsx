import { useParams } from 'react-router-dom'

import CvBuilderPage from './components/cv-builder-page'

export default function DisabilityCvEditPage() {
  const { id } = useParams()

  return <CvBuilderPage mode='edit' cvId={id} />
}
