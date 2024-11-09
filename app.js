

function shuffleArray(array) {
    // Create a copy of the array to avoid modifying the original
    const shuffledArray = [...array];
  
    // Fisher-Yates shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j],   
   shuffledArray[i]];
    }
  
    return shuffledArray;   
  
  }
function removeRandomItem(array) {
    if (array.length === 0) {
      return null; // Or throw an error if you prefer
    }
  
    const randomIndex = Math.floor(Math.random() * array.length);
    const removedItem = array.splice(randomIndex, 1)[0];
  
    return [removedItem, array];
  }
function duplicateItems(arr) {
  const duplicatedArr = [];
  for (let i = 0; i < arr.length; i++) {
    duplicatedArr.push(arr[i], arr[i]);
  }
  return duplicatedArr;
}
class clickPrompt {
    constructor(game) {
        this.active = false
        this.stage = 0
        this.game = game
        this.card1 = null
        this.card2 = null
    }

    interact (card) {
        if (this.stage == 0) {
            console.log("stage 1")
            this.begin()
            card.flip()
            this.game.enableAllCardsExcept([card.id].concat(this.game.collectedIDs))
            this.card1 = card

            return
        }
        if (this.stage == 1) {
            console.log("stage 2")
            card.flip()
            this.game.disableAllCards()
            this.card2 = card
            this.stage = 2

            setTimeout(() => {
                this.end()
            },1000)
            
        }
    }
   
    begin() {
        this.active = true
        this.stage = 1
    }

    

    end() {
        
        if (this.card1.object == this.card2.object) {
            this.card1.element.style.border = "rgb(206, 105, 105) solid 1px"
            this.card2.element.style.border = "rgb(206, 105, 105) solid 1px"

            this.game.collectedIDs.push(this.card1.id, this.card2.id)
            this.game.statsController.currentFound()

            
            
        } else {
            this.card1.flip()
            this.card2.flip()
            this.game.statsController.switchTurn()
        }
        this.game.enableAllCardsExcept(this.game.collectedIDs)

        this.active = false
        this.stage = 0
        this.card1 = null
        this.card2 = null
    }
}
class Card {
    constructor(element, object, game) {
        this.id = String(Math.round(Math.random()*100000000))
        this.element = element
        this.allowClick = false
        this.flipped = false
        this.object = object
        this.game = game

        

        this.element.onclick = () => {
            if (this.allowClick == false) {return}
            this.game.prompt.interact(this)
        }
    }

    flip () {
        
        if(this.flipped == false) {
            this.element.style.transform = "rotateY(180deg)"
            this.element.style.background = "white"
            this.element.style.border = "rgb(105, 105, 206) solid 1px"
            setTimeout(() => {
                this.element.innerHTML = String(this.object)
            }, 200)
            
            this.flipped = true
        } else {
            this.element.style.transform = "rotateY(0deg)"
            this.element.style.background = "black"
            this.element.style.border = "none"
            this.element.innerHTML = '<div class="cardicon"></div>'

            this.flipped = false
        }
    }
}
class MemoryGame {
    constructor() {
        this.ready = false
        this.cards = {}
        this.collectedIDs = []
        this.statsController = new statsController("Liban", "Yasmin")

        this.prompt = new clickPrompt(this)

        this.objects = {
            1: '<div class="cardicon" style="background-image: url(./cardObjects/boots.png)"></div>',
            2: '<div class="cardicon" style="background-image: url(./cardObjects/christmas-ball.png)"></div>',
            3: '<div class="cardicon" style="background-image: url(./cardObjects/gloves.png)"></div>',
            4: '<div class="cardicon" style="background-image: url(./cardObjects/greenleaf.png)"></div>',
            5: '<div class="cardicon" style="background-image: url(./cardObjects/hot-drink.png)"></div>',
            6: '<div class="cardicon" style="background-image: url(./cardObjects/jacket.png)"></div>',
            7: '<div class="cardicon" style="background-image: url(./cardObjects/leaf.png)"></div>',
            8: '<div class="cardicon" style="background-image: url(./cardObjects/pine-tree.png)"></div>',
            9: '<div class="cardicon" style="background-image: url(./cardObjects/pumpkin.png)"></div>',
            10: '<div class="cardicon" style="background-image: url(./cardObjects/scarf.png)"></div>',
            11: '<div class="cardicon" style="background-image: url(./cardObjects/snow.png)"></div>',
            12: '<div class="cardicon" style="background-image: url(./cardObjects/umbrella.png)"></div>'
        }
    }

    init() {
        this.ready = true
       
        let cardList = shuffleArray(Object.values(this.objects))
        cardList = cardList.splice(6, 6)
        cardList = duplicateItems(cardList)
        
        document.querySelectorAll(".card").forEach(c => {
            let res = removeRandomItem(cardList)
            cardList = res[1]
            let removed = res[0]

            let newCard = new Card(c, removed, this)
            newCard.allowClick = true

            this.cards[newCard.id] = newCard
        })
    }

    enableAllCards () {
        for (let card of Object.values(this.cards)) {
            card.allowClick = true
        }
    }
    disableAllCards () {
        for (let card of Object.values(this.cards)) {
            card.allowClick = false
        }
    }

    disableAllCardsExcept (exceptionIDs) {
        for (let card of Object.values(this.cards)) {
            if (exceptionIDs.includes(card.id)) {
                card.allowClick = true
                continue
            }
            card.allowClick = false
        }
    }
    enableAllCardsExcept (exceptionIDs) {
        for (let card of Object.values(this.cards)) {
            if (exceptionIDs.includes(card.id)) {
                card.allowClick = false
            }
            card.allowClick = true
        }
    }

    terminate () {
        this.ready = false
        document.querySelectorAll(".card").forEach(c => {
            c.style.transform = "rotateY(0deg)"
        })
    }
}

class statsController {
    constructor(player1, player2) {
        this.player1name = player1
        this.player2name = player2
        this.init()
    }

    currentFound() {
        this.turn.score++
        this.turn.scoreElement.innerHTML = this.turn.score
    }

    init () {
        const qSelect = (q) => {return document.querySelector(`${q}`)}
        this.player1 = {
            name: this.player1name,
            element: qSelect(".player1"),
            nameElement: qSelect(".player1 .playername span"),
            scoreElement: qSelect(".player1 .score span"),
            statusElement: qSelect(".player1 .status"),
            score:0
        }
        this.player2 = {
            name: this.player2name,
            element: qSelect(".player2"),
            nameElement: qSelect(".player2 .playername span"),
            scoreElement: qSelect(".player2 .score span"),
            statusElement: qSelect(".player2 .status"),
            score:0
        }

        this.player1.nameElement.innerText = this.player1.name
        this.player2.nameElement.innerText = this.player2.name

        this.player1.scoreElement.innerText = this.player1.score
        this.player2.scoreElement.innerText = this.player2.score

        this.turn = this.player1
        
        
    }

    switchTurn () {
        if (this.turn == this.player1) {
            this.turn = this.player2

            this.player1.statusElement.innerHTML = `
            `
            this.player2.statusElement.innerHTML = `
            <div class="inner">
                    <span>Your Turn</span>
                </div>
            `
        } else {
            this.turn = this.player1

            this.player1.statusElement.innerHTML = `
            <div class="inner redstatus">
                    <span>Your Turn</span>
                </div>
            `
            this.player2.statusElement.innerHTML = `
            `
        }
    }
}


let game1 = new MemoryGame()
game1.init()

