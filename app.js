class GifPlayer {
    constructor(gifs) {
        this.gifs = gifs
        this.element = document.querySelector(".displygif")
        this.prevButton = document.querySelector(".prevButton")
        this.nextButton = document.querySelector(".nextButton")
        this.infoText = document.querySelector(".infotext")

        this.currentIndex = 0


        this.nextButton.onclick = () => {this.next()}
        this.prevButton.onclick = () => {this.prev()}


        this.update()
    }

    update () {
        this.element.style.backgroundImage = `url(${this.gifs[this.currentIndex]})` 
        this.infoText.innerHTML = `Viewing frame <span class="bold">${this.currentIndex+1}</span> of <span class="bold">${this.gifs.length}</span>`
    }

    next () {

        if (this.currentIndex+1 == this.gifs.length) {return}
        

        this.currentIndex++
        this.update()
    }

    prev () {
        if (this.currentIndex-1 < 0) {return}

        this.currentIndex -= 1
        this.update()
    }
}

let gifs = new GifPlayer([
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400/f17cd494758405.5e868f8f45d30.gif",
    "https://i.pinimg.com/originals/68/7c/ea/687cea8aabd579611223b9f6332f1cbb.gif",
    "https://preview.redd.it/some-random-gifs-from-my-stop-motion-video-game-v0-nm7f8579fnjb1.gif?width=600&auto=webp&s=2f33c6b08118b64bc0cbeb69d11173b48fa7e10b",
    "https://i.redd.it/16kqvjrc4toc1.gif",
    "https://i.redd.it/t7v3ti9c1xdd1.gif",
    "https://i.imgur.com/j7MUnZd.gif",
    "https://i.makeagif.com/media/9-19-2023/t5Umfe.gif"
])


document.querySelector(".search").addEventListener("submit", (e) => { 
    e.preventDefault()
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(document.querySelector(".searchinput").value)}`
    window.open(googleSearchUrl, '_blank')
    document.querySelector(".searchinput").value = ""
})