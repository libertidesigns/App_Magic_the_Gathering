const CACHE = 'mtg-sbirka-v4'
const BASE = self.registration.scope

self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([BASE, BASE + 'index.html', BASE + 'manifest.json', BASE + 'icon.svg'])
        .catch(() => {})
    )
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  
  // External: GAS, Scryfall, fonts → network only
  if (url.hostname !== location.hostname) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('', { status: 503 }))
    )
    return
  }

  // App files → cache first, fallback to network, fallback to index.html
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached
      return fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE).then(cache => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() => caches.match(BASE + 'index.html'))
    })
  )
})
