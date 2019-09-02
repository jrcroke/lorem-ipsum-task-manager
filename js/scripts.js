// ----
// Set some "Global" vars
// ----
const settings = {
  trello: {
    apiUri: "https://api.trello.com/1/",
    apiKey: "f0fa976d2c2df5c3765e51e83b9744b9",
    board: {
      id: "5d6492f7120c5b050fe8a929"
    },
    lists: {
      forReview: "5d6492f7120c5b050fe8a92e"
    },
    labels: {
      query: "label:CLIENT"
    },
  },
  contentHooks: {
    openCardContainer: "#open-card-container",
    closedCardContainer: "#closed-card-container",
    cardDiv: ".cardDiv"
  },
  messages: {
    tasksDone: "<div class='alert alert-success' role='alert'>Well Done! All task are currenty marked complete.</div>",
    tasksIncomplete: "<div class='alert alert-warning' role='alert'>There are not any tasks marked complete :(</div>",
    apiError: "<div class='alert alert-danger' role='alert'>Apologies ... the connection to Trello is not working at the moment. Please try again in a few minutes and <a href='mailto:help@upstatement.com'>let us know</a> if you continue to have issues.</div>"
  }
}

// ----
// Authorize to Trello - Good for user logging into Trello and viewing thier content
// ----
const authTrello = () => {
  Trello.authorize({
    type: 'redirect',
    name: 'Trello Auth for Lorem Ipsum Task Manager',
    scope: {
      read: true,
      write: true
    },
    expiration: '30days',
    error: function() {
      console.log('Trello authentication failed');
    }
  })
}

// ----
// Retrieve a board by ID
// ----
const getboard = () => {
  const boardUri = settings.trello.apiUri + 'boards/' + settings.trello.board.id + '/lists?key=' + settings.trello.apiKey + '&token=' + localStorage.trello_token
  console.log(boardUri)
  $.ajax({
    type: 'GET',
    url: boardUri,
    success: function(data) {
      getCards(data[0].id)
      getCards(data[1].id)
    },
    error: function(data) {
      console.log("board not found")
    }
  })
}

// ----
// Retrieve cards by List ID
// ----
const getCards = (listId) => {
  const cardsUri = settings.trello.apiUri + 'lists/' + listId + '/cards?key=' + settings.trello.apiKey + '&token=' + localStorage.trello_token
  $.ajax({
    type: 'GET',
    async: false,
    url: cardsUri,
    success: function(data) {
      outputCards(data)
    },
    error: function(data) {
      console.log("Card not found")
    }
  })
}

// ----
// Retrieve Trello Lists
// ----
const getlists = () => {
  const listsUri = settings.trello.apiUri + 'boards/' + settings.board.id + '/lists?fields=all&filter=all&key=' + settings.trello.apiKey + '&token=' + localStorage.trello_token
  $.ajax({
    type: 'GET',
    async: false,
    url: listsUri,
    success: function(data) {
      console.log(JSON.stringify(data))
    },
    error: function(data) {
      console.log("Card not found")
    }
  })
}

// ----
// Search for cards with query - Great for getting cards by board with a list filter
// ----
const searchCards = () => {
  const cardsUri = 'https://api.trello.com/1/search?query=' + settings.trello.labels.query + '&idboards=' + settings.trello.board.id + '&modelTypes=cards&board_fields=name%2Curl&card_fields=all&card_list=true&key=' + settings.trello.apiKey + '&token=' + localStorage.trello_token
  $.ajax({
    type: 'GET',
    async: true,
    url: cardsUri,
    success: function(data) {
      const cards = data.cards
      outputCards(cards)
    },
    error: function(data) {
      console.log("Card not found")
      // Let the user know they are done ... if they are done
      const openCardContainer = $(settings.contentHooks.openCardContainer)
      const apiError = $("<div/>", {
        "class": "apiError",
        "html": settings.messages.apiError
      })
      openCardContainer.append(apiError)
    }
  })
}

// ----
// Generate a card in the DOM
// ----
const outputCards = (cards) => {
  const openCardContainer = $(settings.contentHooks.openCardContainer)
  const closedCardContainer = $(settings.contentHooks.closedCardContainer)
  for (var i = 0; i < cards.length; i++) {
    // Get the card"s list and conditionally format based on that list
    const cardList = cards[i].list.name
    const isComplete = (cardList === "For Review" ? true : false)
    let cardClass = "cardDiv col-md-4"
    cardClass += (isComplete ? " completedTask" : " outstandingTask")

    // Only output the button if not completed
    const btnHtml = (cardList === "For Review" ? "" : "<button type='button' class='btn btn-sm btn-outline-success btn-done' data-card-id='" + cards[i].id + "'>Done!</button>")

    const card = $("<div/>", {
      "class": cardClass,
      "data-card-id": cards[i].id,
      "html": "<div class='card mb-4 shadow-sm'>" +
        " <div class='card-body'>" +
        "<p class='card-text'>" + cards[i].name + "</p>" +
        "<div class='d-flex justify-content-between align-items-center'>" +
        "<div class='btn-group btn-wrapper'>" +
        btnHtml +
        "</div>" +
        "<small class='text-muted'><i>List:</i> <span class='list'>" + cards[i].list.name + "</span></small>" +
        "</div>" +
        "</div>" +
        "</div>"
    })
    if (isComplete) {
      closedCardContainer.append(card)
    } else {
      openCardContainer.append(card)
    }
  }
  const updateButton = $(".btn-done")
  updateButton.click(function() {
    const cardId = $(this).data("card-id")
    updateCardStatus(cardId)
  });
  // Let the user know they are done ... if they are done
  const openCardCount = openCardContainer.find(settings.contentHooks.cardDiv).length
  if (!openCardCount) {
    const wellDone = $("<div/>", {
      "class": "wellDone",
      "html": settings.messages.tasksDone
    })
    openCardContainer.append(wellDone)
  }
  // Let the user know they have some work to do
  const closedCardCount = closedCardContainer.find(settings.contentHooks.cardDiv).length
  if (!closedCardCount) {
    const notDone = $("<div/>", {
      "class": "notDone",
      "html": settings.messages.tasksIncomplete
    })
    closedCardContainer.append(notDone)
  }
}

// ----
// Update the status of a card based on card ID
// ----
const updateCardStatus = (cardId) => {
  const cardUri = 'https://api.trello.com/1/cards/' + cardId + '?idList=' + settings.trello.lists.forReview + '&key=' + settings.trello.apiKey + '&token=' + localStorage.trello_token
  $.ajax({
    type: 'PUT',
    async: true,
    url: cardUri,
    success: function(data) {
      syncCard(data)
    },
    error: function(data) {
      console.log("Unable to Update card")
    }
  })
}

// ----
//  Sync Card to DOM
// ----
const syncCard = (data) => {
  // Clear the Incomplete message
  $(".notDone").hide()
  // Let the user know they are done ... if they are done
  const openCardContainer = $(settings.contentHooks.openCardContainer)
  const openCardCount = openCardContainer.find(settings.contentHooks.cardDiv).length
  if (openCardCount <= 1) {
    const wellDone = $("<div/>", {
      "class": "wellDone",
      "html": settings.messages.tasksDone
    })
    openCardContainer.append(wellDone)
  }
  // Mark the current card for review and move it to the Close Task pane
  const closedCardContainer = $(settings.contentHooks.closedCardContainer)
  const currentCard = $("*[data-card-id='" + data.id + "']")
  currentCard.removeClass("outstandingTask")
  currentCard.addClass("completedTask")
  currentCard.find(".list").html("For Review")
  closedCardContainer.append(currentCard)
}

// ----
//  Package up the initial loaders
// ----
const init = () => {
  // First, handle Trello Auth
  authTrello()
  // If the user is authenticated, deal some cards
  if(localStorage.trello_token){
    searchCards()
  }
}

// ----
//	Push the fist domino
// ----
$(document).ready(init())
