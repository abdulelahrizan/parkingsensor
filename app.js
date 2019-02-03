var markers = {};
var map;

function setMapOnAll(map) {
    for (let username in markers) {
        markers[username].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function showMarkers() {
    setMapOnAll(map);
}

function addMarker(username, marker) {
    markers[username] = marker;
}

function deleteMarker(username) {
    clearMarkers();
    delete markers[username];
    showMarkers();
}

function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
    });

    var pos;
    // Try HTML5 geolocation.
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function (position) {
             pos = {
                 lat: position.coords.latitude,
                 lng: position.coords.longitude
             };

           map.setCenter(pos);

             //Position Marker
             var image = 'imgs/blueMarkerSmall.png';
             let currentMarker = new google.maps.Marker({
              position: pos,
              map: map,
              icon: image
             });

         });
     } else {
         // Browser doesn't support Geolocation
         handleLocationError(false, infoWindow, map.getCenter());
     }
 
    
    // map.setCenter(markerLocation);

    function update() {
        const url = "https://hurani.lib.id/parkfind@dev/getAllSpots/";
        $.get(url, function (data, status) {
            for (var i = 0; i < data.length; i++) {
                let owner = data[i];
                let username = owner[0];
                if (!owner[1].taken && !(username in markers)) {
                    var markerLocation = {lat: owner[1].location[0], lng: owner[1].location[1]};
                    let marker = new google.maps.Marker({
                        position: markerLocation,
                        map: map
                    })

                    marker.addListener("click",function(){
                        console.log("CLICKED");
                        $("#spotInfo").show();
                        document.getElementById("name").innerHTML = username;
                        document.getElementById("price").innerHTML = owner[1].rate;
                        document.getElementById("taken").innerHTML = !owner[1].taken;
                    })
                    // marker.addListener('click', function() {
                    // });

                    addMarker(username, marker);
                } else if (owner[1].taken) {
                    document.getElementById("name").innerHTML = username;
                    document.getElementById("price").innerHTML = owner[1].rate;
                    document.getElementById("taken").innerHTML = !owner[1].taken;
                    deleteMarker(username);
                }
            }
        })

    };
    update();
    window.setInterval(update, 3000);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function formSubmit() {
    let username = document.getElementById("usernameInput");
    let address = document.getElementById("addressInput");
    let rate = document.getElementById("rateInput");
    console.log(username+address+rate)
    fetch(`https://hurani.lib.id/parkfind@dev/signUpHost/username=${username}&address=${address}&rate=${rate}`)
}