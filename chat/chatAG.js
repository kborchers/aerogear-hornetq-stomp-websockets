$(document).ready(function(){

  var client;

  $('#connect_form').submit(function() {
    var url = $("#connect_url").val();
    var login = $("#connect_login").val();
    var passcode = $("#connect_passcode").val();

    client = AeroGear.SimplePush({
      name: "agPush",
      settings: {
        pushNetworkLogin: login,
        pushNetworkPassword: passcode,
        pushNetworkURL: url,
        endpoints: [
          {
            address: "mail",
            callback: function( message ) {
              $("#messages").append("<p><strong>Mail Notification</strong> - " + message.body + "</p>");
            }
          },
          {
            address: "foo",
            callback: function( message ) {
              $("#messages").append("<p><strong>Foo Notification</strong> - " + message.body + "</p>");
            }
          }
        ],
        onNetworkConnect: function( message ) {
          $('#connect').fadeOut({ duration: 'fast' });
          $('#messages')
            .append("<p>Client will receive broadcast push messages on jms.topic.aerogear.broadcast.<br>Client will receive personal messages on jms.topic.aerogear." + message.headers.session + "<br></p>" )
            .fadeIn();
        }
      }
    });

    return false;
  });

});