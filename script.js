class QuoteFactory {
    constructor() {
        this.mainElm = document.querySelector("main")
        this.quoteDiv = document.getElementById("quote")
        this.controlsDiv = document.getElementById("controls")
        this.showControls = false
        this.quoteDuration = 9500
        this.quotesDataURL = "https://raw.githubusercontent.com/rohith/quoted/master/data/quotes.md"
        this.fadeDuration = 500 // comes from style.styl with opacity transition time
        this.colors = [
            "rgb(44, 62, 80)",
            "rgb(192, 57, 43)",
            "rgb(211, 84, 0)",
            "rgb(22, 160, 133)",
            "rgb(39, 174, 96)",
            "rgb(41, 128, 185)",
            "rgb(142, 68, 173)"
        ].sort(() => Math.random() - 0.5)
    }

    boot() {
        this.setupUtils()
        this.bindEvents()
        this.fetchQuotes()
        this.registerSW()
    }

    setupUtils() {
        Array.prototype.nextItem = function (currentItem) {
            let currentIndex = this.indexOf(currentItem)
            return currentIndex < 0 || currentIndex === this.length - 1 ? this[0] : this[currentIndex + 1]
        }
    }

    bindEvents() {
        if (("share" in navigator)) {
            this.showControls = true
            document.getElementById("share").onclick = this.shareQuote
        }
    }

    fetchQuotes() {
        fetch(this.quotesDataURL)
            .then(response => response.text())
            .then(data => {
                this.quotes = data.split("\n").map(s => s.trim()).filter(s => s).sort(() => Math.random() - 0.5)
                this.quoteDiv.classList.toggle("fade")
                setTimeout(() => {
                    this.changeQuote()
                    if (this.showControls) {
                        this.controlsDiv.classList.remove("fade")
                    } else {
                        this.controlsDiv.style.display = "none"
                    }
                    setInterval(() => this.changeQuote(), this.quoteDuration)
                }, this.fadeDuration);
            })
    }

    registerSW() {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("sw.js")
                .then(() => console.log("Service Worker Registered"))
                .catch(e => console.error(`Service Worker not Registered due to ${JSON.stringify(e)}`))
        }
    }

    shareQuote() {
        navigator.share({
            title: document.title,
            text: document.getElementById("quote").innerText,
            url: window.location.origin
        }).catch(error => console.log("Error Sharing:", error))
    }

    changeQuote() {
        this.quoteDiv.innerText = this.quotes.nextItem(this.quoteDiv.innerText)
        this.changeBGColor()
        this.quoteDiv.classList.toggle("fade")
        setTimeout(() => {
            this.quoteDiv.classList.toggle("fade")
        }, this.quoteDuration - this.fadeDuration)
    }

    changeBGColor() {
        let currentColor = this.mainElm.style.backgroundColor,
            currentIndex = this.colors.indexOf(currentColor),
            nextIndex = currentIndex >= 0 ? (currentIndex < this.colors.length - 1 ? currentIndex + 1 : 0) : 0

        this.mainElm.style.backgroundColor = this.colors[nextIndex]
    }
}

window.addEventListener("load", () => {
    new QuoteFactory().boot()
})