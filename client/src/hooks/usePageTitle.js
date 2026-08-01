import { useEffect } from 'react'
import { useSite } from '../siteContext'

export default function usePageTitle(title) {
  const { site } = useSite()

  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : site.name
  }, [title, site.name])
}
