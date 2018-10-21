// var data;

var displayName;
var myFood = document.getElementById("food")
document.addEventListener("DOMContentLoaded", event => {
  var config = {
    apiKey: "AIzaSyAAZcL1crfgSSy9KMFvb3TngMjzQQrCJdk",
    authDomain: "fruity-stuff.firebaseapp.com/",
    databaseURL: "https://fruity-stuff.firebaseio.com/",
    storageBucket: "fruity-stuff.appspot.com"
  };
  //firebase.initializeApp(config);
  const app = firebase.app();
  const database = firebase.database();
  console.log(app);
});
var username, user_latitude, user_longitude, user_food;

function writeUserData(latitude, longitude, food) {
  var user = firebase.auth().currentUser;
  console.log(user);
  displayName = user.displayName;
  console.log(displayName);
  firebase.database().ref('fruity-stuff/' + '2423424').set({
    username: displayName,
    user_latitude: latitude,
    user_longitude: longitude,
    user_food: food
  });
}

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)

    .then(result => {
      const user = result.user;
      displayName = user.displayName;
      console.log(user);
    })
    .catch(console.log)
}
//   $.ajax("userData.json").done(function(msg) {
//     data = JSON.parse(msg);
//     console.log(data);
//   });
// var latitude,longitude;
// var database = firebase.database();
// var starCountRef = firebase.database().ref('users' + postId + '/starCount');
// starCountRef.on('value', function(snapshot) {
//   var data = snapshot.val()
//   latitude = users.latitude;
//   longitude = users.longitude;
//   updateStarCount(postElement, snapshot.val());
// });

getLocation()
var x = document.getElementById("demo");
var latitude;
var longitude;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  addInfoBubble(map);
  addSVGMarkers(map);
}

/**
 * Creates a new marker and adds it to a group
 * @param {H.map.Group} group       The group holding the new marker
 * @param {H.geo.Point} coordinate  The location of the marker
 * @param {String} html             Data associated with the marker
 */
function addMarkerToGroup(group, coordinate, html) {
  var marker = new H.map.Marker(coordinate);
  // add custom data to the marker
  marker.setData(html);
  group.addObject(marker);
}
//add  location svg markers

function addSVGMarkers(map) {
  //Create the svg mark-up
  var svgMarkup = '<svg  width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
    '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="22" />' +
    '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
    'text-anchor="middle" fill="${STROKE}" >i</text></svg>';

  // Add the first marker
  var bearsIcon = new H.map.Icon(
      svgMarkup.replace('${FILL}', 'blue').replace('${STROKE}', 'red')),
    bearsMarker = new H.map.Marker({
      lat: latitude,
      lng: longitude
    }, {
      icon: bearsIcon
    });

  map.addObject(bearsMarker);
  moveMapToLocation(map);
}

function moveMapToLocation(map) {
  map.setCenter({
    lat: latitude,
    lng: longitude
  });
  map.setZoom(14);
}
/**
 * Add two markers showing the position of Liverpool and Manchester City football clubs.
 * Clicking on a marker opens an infobubble which holds HTML content related to the marker.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function addInfoBubble(map) {
  var group = new H.map.Group();

  map.addObject(group);

  // add 'tap' event listener, that opens info bubble, to the group
  group.addEventListener('tap', function(evt) {
    // event target is the marker itself, group is a parent event target
    // for all objects that it contains
    var bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
      // read custom data
      content: evt.target.getData()
    });
    // show info bubble
    ui.addBubble(bubble);
  }, false);


  addMarkerToGroup(group, {
      lat: 53.430,
      lng: -2.961
    },
    '<div ><a href=\'http://www.liverpoolfc.tv\' >Liverpool</a>' +
    '</div><div >Anfield<br>Capacity: 45,362</div>');

}



/**
 * Boilerplate map initialization code starts below:
 */

// initialize communication with the platform
var platform = new H.service.Platform({
  app_id: 'devportal-demo-20180625',
  app_code: '9v2BkviRwi9Ot26kp2IysQ',
  useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

// initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map, {
    center: {
      lat: 37,
      lng: -120
    },
    //center: {lat: latitude, lng: longitude},
    zoom: 7,
    pixelRatio: pixelRatio
  });

// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// create default UI with layers provided by the platform
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Now use the map as required...
$('#submit').click(function(){
  writeUserData(latitude, longitude, document.getElementById('food').value);
});
