$(document).ready(function(){

  var mailEndpoint, mailRequest, fooEndpoint, fooRequest, broadcastEndpoint;

  $('#connect_form').submit(function() {
    var url = $("#connect_url").val();
    var login = $("#connect_login").val();
    var passcode = $("#connect_passcode").val();

    AeroGear.SimplePush.config.pushAppID = "9d77092e-520c-42d7-9e62-a841a297af07";
    AeroGear.SimplePush.config.appInstanceID = "e224fc1a-6178-43c3-940b-936eebabd583";
    AeroGear.SimplePush.config.pushNetworkLogin = login;
    AeroGear.SimplePush.config.pushNetworkPassword = passcode;
    AeroGear.SimplePush.config.pushNetworkURL = url;

    // This is an AeroGear addition to the spec since we need to setup the channels
    navigator.push.connect( function() {
      mailRequest = navigator.push.register();
      mailRequest.onsuccess = function( event ) {
        mailEndpoint = event.target.result;
        mailRequest.registerWithPushServer( "mail", mailEndpoint );
      };

      fooRequest = navigator.push.register();
      fooRequest.onsuccess = function( event ) {
        fooEndpoint = event.target.result;
        fooRequest.registerWithPushServer( "mail", fooEndpoint );
      };

      navigator.setMessageHandler( "push", function( message ) {
        console.log(message);
        if ( message.headers.destination === mailEndpoint.address )
          $("#messages").append("<p><strong>Mail Notification</strong> - " + message.body + "</p>");
        else if ( message.headers.destination === fooEndpoint.address )
          $("#messages").append("<p><strong>Foo Notification</strong> - " + message.body + "</p>");
        // Broadcast messages are subscribed by default and can be acted on as well
        else if ( message.headers.destination === broadcastEndpoint.address )
          $("#messages").append("<p><strong>Broadcast Notification</strong> - " + message.body + "</p>");
      });

      // Just for display/testing and not necessary for functionality
      $("#connect").fadeOut({ duration: "fast" });
      $("#messages")
        .append("<p>Client id is " + AeroGear.SimplePush.sessionID + "<br></p>" )
        .fadeIn();
    });

    return false;
  });
});