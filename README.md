# Upstatement Task Manager
A Web App leveraging the Trello API that provides the Lorem Ipsum team a view of their tasks.

## Installing Dependencies

A web browser

## Configuring

Grab the source repo:

```sh
git clone https://github.com/jrcroke/upstatement-task-manager.git
```

If necessary, update any config settings in the `settings` object on line 4 of `js/scripts.js`

```const settings = {
  trello: {
    apiUri: "https://api.trello.com/1/",
    apiKey: "f0fa976d2c2df5c3765e51e83b9744b9",
    apiToken: "d08e5d3463ec8b3fd0e82df54d4b2b0f5f3e89d1a707345b3eb180bf6263ae08",
    board: {
      id: "5d6492f7120c5b050fe8a929"
    },
    lists: {
      forReview: "5d6492f7120c5b050fe8a92e"
    }
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
```

## Running Locally

Open index.html in a web browser (with an active internet connection to facilitate the Trello API calls).

## Deployment

Either ssh into your web server and git clone (command listed above), or SFTP all files in this repo to a web server.
