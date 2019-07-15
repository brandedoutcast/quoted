const cacheName = "quoted-cache-v0.2.1",
    assets = [
        "./",
        "index.html",
        "style.styl",
        "script.js",
        "img/quoted192.png",
        "img/quoted512.png",
        "https://fonts.googleapis.com/css?family=Quicksand",
        "https://raw.githubusercontent.com/rohith/quoted/master/data/quotes.md"
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
    let request = event.request
    if (request.url === "https://raw.githubusercontent.com/rohith/quoted/master/data/quotes.md") {
        event.respondWith(
            caches.match(request)
                .then(cacheResponse => {
                    let fetchResponse = fetchReq(request)
                    return cacheResponse || fetchResponse
                })
        )
    } else {
        event.respondWith(
            caches.match(request).then(cacheResponse => cacheResponse || fetchReq(request))
        )
    }
})

function fetchReq(request) {
    return fetch(request).then(netRes => {
        let resClone = netRes.clone()
        if (resClone.ok) {
            caches.open(cacheName).then(cache => cache.put(request, resClone))
        } else {
            throw Error(response.statusText)
        }
        return netRes
    })
}
