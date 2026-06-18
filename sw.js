const CACHE_NAME = "farm-ai-cache-v1";

const urlsToCache = [
    "/",
    "/static/css/style.css",
    "/static/js/script.js",
    "https://cdn.jsdelivr.net/npm/chart.js"
];

// Install service worker
self.addEventListener("install", event => {
    console.log("Service Worker Installed ✅");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch (offline support)
self.addEventListener("fetch", event => {

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );

});