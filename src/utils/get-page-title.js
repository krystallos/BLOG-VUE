import defaultSettings from '@/settings'

const title = defaultSettings.title || 'WDNMD-我带你们答'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
