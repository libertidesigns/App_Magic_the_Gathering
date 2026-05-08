const CACHE = 'mtg-sbirka-v3'
const APP_FILES = ['/', '/index.html', '/manifest.json', '/icon.svg']

self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(APP_FILES)).catch(() => {})
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // Pass through: GAS, Scryfall, external APIs
  if (url.hostname !== location.hostname && url.protocol !== 'chrome-extension:') {
    event.respondWith(fetch(event.request).catch(() => new Response('', {status: 503})))
    return
  }

  // App files: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE).then(cache => cache.put(event.request, clone))
        }
        return response
      }).catch(() => caches.match('/index.html'))
    })
  )
})
