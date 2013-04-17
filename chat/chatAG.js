$(document).ready(function(){

  var mailEndpoint, fooEndpoint, broadcastEndpoint;

  $('#connect_form').submit(function() {
    var url = $("#connect_url").val();
    var login = $("#connect_login").val();
    var passcode = $("#connect_passcode").val();

    AeroGear.SimplePush.config.pushAppID = "9d77092e-520c-42d7-9e62-a841a297af07";
    AeroGear.SimplePush.config.appInstanceID = "e224fc1a-6178-43c3-940b-936eebabd583";
    AeroGear.SimplePush.config.pushNetworkLogin = login;
    AeroGear.SimplePush.config.pushNetworkPassword = passcode;
    AeroGear.SimplePush.config.pushNetworkURL = url;

    mailEndpoint = navigator.push.register();
    // Normally this would be put into an onsuccess callback but it is immediately available in our implementation
    AeroGear.SimplePush.registerWithChannel( "mail", mailEndpoint );

    fooEndpoint = navigator.push.register();
    // Normally this would be put into an onsuccess callback but it is immediately available in our implementation
    AeroGear.SimplePush.registerWithChannel( "foo", fooEndpoint );

    // If the app wants broadcast messages as well, user will need to register those
    broadcastEndpoint = navigator.push.register();
    // Normally this would be put into an onsuccess callback but it is immediately available in our implementation
    AeroGear.SimplePush.registerWithChannel( "broadcast", broadcastEndpoint );

    navigator.setMessageHandler( "push", function( message ) {
      if ( message.pushEndpoint.name === mailEndpoint.name )
        $("#messages").append("<p><strong>Mail Notification</strong> - " + message.body + "</p>");
      else if ( message.pushEndpoint.name === fooEndpoint.name )
        $("#messages").append("<p><strong>Foo Notification</strong> - " + message.body + "</p>");
      else if ( message.pushEndpoint.name === broadcastEndpoint.name )
        $("#messages").append("<p><strong>Broadcast Notification</strong> - " + message.body + "</p>");
    });

    // Just for display/testing and not necessary for functionality
    $("#connect").fadeOut({ duration: "fast" });
    setTimeout( function() {
      $("#messages")
        .append("<p>Client will receive broadcast push messages on jms.topic.aerogear.broadcast<br>Client will receive personal messages on jms.topic.aerogear." + AeroGear.SimplePush.sessionID + "<br></p>" )
        .fadeIn();
    }, 1000 );

    return false;
  });
});