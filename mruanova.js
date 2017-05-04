var modal = document.getElementById('myModal');
var btn = document.getElementById("about");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    modal.style.display = "block";
};

span.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

var geocoder;
var map;
var markers=[];
function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(41.8971828, -87.63523709999998);
    var mapOptions = {
        zoom: 14,
        center: latlng
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
};

function addMarker(index,title,website,address) {
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: title
            });
            markers.push(marker);
            var contentString = '<div id="content">' +
                '<div class="link2">' + title + '</div>' +
                '<div id="bodyContent">' +
                '<div class="website">' + website + '</div>' +
                '<div class="address">'+ address + '</div>' +
                '</div>' +
                '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            if(index===0) {
                infowindow.open(map, marker);
            }
            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        }
    });
};

$(document).ready(function () {
    var api = "https://246gg84zg8.execute-api.us-west-2.amazonaws.com/prod/projects";
    console.log(api);
    $.get(api, function (response) {
        response.Items.sort(function (a, b) {
            return parseFloat(a.ProjectId) - parseFloat(b.ProjectId);
        });
        for (var i = 0; i < response.Items.length; i++) {
            if(i<5){
                var project = "<div id='project"+response.Items[i].ProjectId+"' class='project'>"
                    + "<div class='company'>"+response.Items[i].Name+"</div>"
                    + "<div class='website'>"+response.Items[i].Website+"</div>"
                    + "<div class='position'>"+response.Items[i].Position+"</div>"
                    + "<div class='address'>"+response.Items[i].Address+"</div>"
                    + "</div>";
                console.log(response.Items[i].ProjectId);
                console.log(response.Items[i].Name);
                console.log(response.Items[i].Website);
                console.log(response.Items[i].Position);
                console.log(response.Items[i].Address);
                $("#projects").append(project);
                addMarker(i,response.Items[i].Name,response.Items[i].Website,response.Items[i].Address);
            }
        };
    }, "json");
    $(".animation").css("top", "450px");
});

$(document).on("click", ".project", function () {
    var name = $(this)[0].children[0].innerText;
    var website = $(this)[0].children[1].innerText;
    var position = $(this)[0].children[2].innerText;
    var address = $(this)[0].children[3].innerText;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers.length = 0;
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: name
            });
            var contentString = '<div id="content">' +
                '<div class="link2">' + name + '</div>' +
                '<div id="bodyContent">' +
                '<div class="website">' + website + '</div>' +
                '<div class="address">'+ address + '</div>' +
                '</div>' +
                '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
            infowindow.open(map, marker);
        }
    });
});