const cacheName = "quoted-cache-v0.1.0",
    assets = [
        "./",
        "index.html",
        "style.styl",
        "script.js",
        "img/quoted192.png",
        "img/quoted512.png",
        "https://fonts.googleapis.com/css?family=Quicksand"
    ]

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(assets))
    )
})

self.addEventListener("activate", event =>
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => {
                if (key !== cacheName) {
                    return caches.delete(key)
                }
            }))
        )
    )
)

self.addEventListener("fetch", event => {
    if (event.request.url === "https://raw.githubusercontent.com/rohith/quoted/master/data/quotes.md") {
        event.respondWith(
            fetch(event.request)
                .then(res => cacheResponse(event, res))
                .catch(() => caches.match(event.request).then(r => r))
        )
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request).then(res => cacheResponse(event, res)))
        )
    }
})

function cacheResponse(event, response) {
    if (response.ok) {
        return caches.open(cacheName).then(cache => cache.put(event.request, response.clone())).then(() => response)
    } else {
        throw Error(response.statusText)
    }
}