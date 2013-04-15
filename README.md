# AeroGear SimplePush / HornetQ Demo

## Deploying the Demo

1. Clone this repo
2. Run `mvn clean install` Now the server is running
3. Open a browser to `<repo dir>/chat` then keep the default values in the form and click "Connect"
4. Make a note of the message stating "Client will receive personal messages on jms.topic.aerogear.xxxxxxxxxx"
5. In a different browser, open `<repo dir>/chat/index2.html`
6. In the "Destination" field, type the personal message address from step 4 and click connect
7. The demo is set up to "hear" push messages on `mail` and `foo` endpoints. Try sending messages and setting different headers to see the reaction in the other browser.