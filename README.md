# Upstatement Task Manager
A Web App leveraging the Trello API that provides the Lorem Ipsum team a view of their tasks.

[Upstatement - Take Home Project](https://trello.com/b/JoqP7X3L/upstatement-take-home-project) - The Trello board that the Task Manager is currently configured to interact with.

[A Live Example](https://www.jcroke.com/upstatement-task-manager/) of the Task Manager running on jcroke.com.


## Configuring

Grab the source repo:

```sh
git clone https://github.com/jrcroke/lorem-ipsum-task-manager.git
```

Request the apiKey and apiToken from an [administrator](jrcroke@gmail.com).

Update the apiKey and apiToken values in the `settings` object on line 4 of `js/scripts.js`

```const settings = {
  trello: {
    apiUri: "https://api.trello.com/1/",
    apiKey: "Add apiKey Here",
    apiToken: "Add apiToken Here",
    board: {
      id: "5d6492f7120c5b050fe8a929"
    },
    lists: {
      forReview: "5d6492f7120c5b050fe8a92e"
    }
  } ...
}
```

## Running Locally

Add the source files to a local web server.

Open `index.html` in a web browser (with an active internet connection to facilitate the Trello API calls).

## Deployment

ssh into your web server and navigate to the directory where the web app should be installed.

Clone the repo using the following command:

```sh
git clone https://github.com/jrcroke/lorem-ipsum-task-manager.git
```

Update `js/scripts.js` with the apiKey and apiToken. (Steps outlined above in **Configuring** block)
