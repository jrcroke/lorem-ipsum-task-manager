// ----
// Set some "global" vars
// ----
const settings = {
  apiUri: 'https://api.trello.com/1/',
  apiKey: 'f0fa976d2c2df5c3765e51e83b9744b9',
  apiToken: 'd08e5d3463ec8b3fd0e82df54d4b2b0f5f3e89d1a707345b3eb180bf6263ae08',
  board: {
    id: '5d6492f7120c5b050fe8a929'
  },
  lists: {
    forReview: '5d6492f7120c5b050fe8a92e'
  }
}

// ----
// Authorize to Trello
// ----
const authTrello = (settings) => {
  Trello.authorize({
    type: "redirect",
    name: "Trello Authentication",
    scope: {
      read: true,
      write: true },
    expiration: "1hour",
    success: getBoard(settings),
    error: function() { console.log("Trello authentication failed"); }
  })
}

// ----
// Retrieve a board by ID
// ----
const getBoard = () => {
  const boardUri =  settings.apiUri + "boards/" + settings.board.id + "/lists?key=" + settings.apiKey + "&token=" + settings.apiToken
  console.log(boardUri)
  $.ajax({
      type: "GET",
      url: boardUri,
      success: function(data) {
        getCards(data[0].id)
        getCards(data[1].id)
      },
      error: function(data) {
        console.log('Board not found')
      }
    })
}

// ----
// Retrieve cards by List ID
// ----
const getCards = (listId) => {
  const cardsUri =  settings.apiUri + "lists/" + listId + "/cards?key=" + settings.apiKey + "&token=" + settings.apiToken
  $.ajax({
      type: "GET",
      async: false,
      url: cardsUri,
      success: function(data) {
        outputCards(data)
      },
      error: function(data) {
        console.log('Card not found')
      }
    })
}

// ----
// Retrieve lists
// ----
const getLists = () => {

  const listsUri =  settings.apiUri + "boards/" + settings.board.id + "/lists?fields=all&filter=all&key=" + settings.apiKey + "&token=" + settings.apiToken

  $.ajax({
      type: "GET",
      async: false,
      url: listsUri,
      success: function(data) {
        console.log(JSON.stringify(data))
      },
      error: function(data) {
        console.log('Card not found')
      }
    })

}

// ----
//  Package up the initial loaders
// ----
const init = () => {

  getLists()

}


// ----
//	Push the fist domino
// ----
$(document ).ready( init() );
