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
                console.log("OPEN default info window");
                infowindow.open(map, marker);
            }
            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        }
    });
};

$(document).ready(function () {
    console.log("GET projects");
    $.get("https://246gg84zg8.execute-api.us-west-2.amazonaws.com/prod/projects", function (response) {
        console.log("SORT projects");
        response.Items.sort(function (a, b) {
            return parseFloat(a.ProjectId) - parseFloat(b.ProjectId);
        });
        console.log("APPEND projects");
        for (var i = 0; i < response.Items.length; i++) {
            var project = "<div id='project"+response.Items[i].ProjectId+"' class='project'>"
                + "<div class='company'>"+response.Items[i].Name+"</div>"
                + "<div class='website'>"+response.Items[i].Website+"</div>"
                + "<div class='position'>"+response.Items[i].Position+"</div>"
                + "<div class='address'>"+response.Items[i].Address+"</div>"
                + "</div>";
            $("#projects").append(project);
            console.log("ADD marker");
            if(i<5){
                addMarker(i,response.Items[i].Name,response.Items[i].Website,response.Items[i].Address);
            }
        };
    }, "json");
    $(".animation").css("top", "450px");
});

$(document).on("click", ".project", function () {
    console.log("CLICK project");
    var name = $(this)[0].children[0].innerText;
    var website = $(this)[0].children[1].innerText;
    var position = $(this)[0].children[2].innerText;
    var address = $(this)[0].children[3].innerText;
    console.log("GEOCODE address");
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            console.log("CENTER map");
            map.setCenter(results[0].geometry.location);
            console.log("CREATE marker");
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
            console.log("OPEN info window");
            infowindow.open(map, marker);
        }
    });
});