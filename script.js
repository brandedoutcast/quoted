class QuoteGenerator {
    constructor() {
        this.quoteDiv = document.getElementById("quote")
        this.quoteDuration = 7500
        this.fadeDuration = this.quoteDuration - 500
        this.indexer = 0
    }

    run() {
        fetch("https://raw.githubusercontent.com/rohith/quoted/master/data/quotes.md")
            .then(response => response.text())
            .then(data => {
                this.quotes = data.split("\n").filter(s => s.trim() !== "").sort(() => Math.random() - 0.5)
                this.quoteDiv.classList.toggle("fade")
                this.changeQuote()
                setInterval(() => this.changeQuote(), this.quoteDuration)
            })
    }

    changeQuote() {
        this.quoteDiv.innerText = this.nextQuote()
        this.quoteDiv.classList.toggle("fade")
        setTimeout(() => {
            this.quoteDiv.classList.toggle("fade")
        }, this.fadeDuration)
    }

    nextQuote() {
        let quote = this.quotes[this.indexer].trim()
        this.indexer++
        if (this.indexer >= this.quotes.length) {
            this.indexer = 0
        }
        return quote
    }
}

new QuoteGenerator().run()