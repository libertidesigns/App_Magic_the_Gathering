// sw.js – Service Worker pro PWA instalaci
// Umožňuje instalaci aplikace jako desktopová app v Chrome/Edge

const CACHE = 'mtg-sbirka-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

// Pro tuto app nepotřebujeme offline cache (potřebujeme internet pro Scryfall)
// SW je zde jen pro povolení PWA instalace
self.addEventListener('fetch', event => {
  // Propusť vše normálně
  event.respondWith(fetch(event.request))
})
