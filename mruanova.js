$(document).ready(function () {
    //GET
    $.get("https://246gg84zg8.execute-api.us-west-2.amazonaws.com/prod/projects", function (response) {
        //SORT
        response.Items.sort(function (a, b) {
            return parseFloat(a.ProjectId) - parseFloat(b.ProjectId);
        });
        //DISPLAY PROJECTS
        for (var i = 0; i < response.Items.length; i++) {
            var project = "<div id='project"+response.Items[i].ProjectId+"' class='project'>"
                + "<div class='company'>"+response.Items[i].Name+"</div>"
                + "<div class='website'>"+response.Items[i].Website+"</div>"
                + "<div class='position'>"+response.Items[i].Position+"</div>"
                + "<div class='address'>"+response.Items[i].Address+"</div>"
                + "</div>";
            $("#projects").append(project);
        };
    }, "json");
    $("#project1").click();
    $(".animation").css("top", "450px");
});
//map.setCenter
var markers = [];
$(document).on("click", ".project", function () {
    var name = $(this)[0].children[0].innerText;
    var website = $(this)[0].children[1].innerText;
    var position = $(this)[0].children[2].innerText;
    var address = $(this)[0].children[3].innerText;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: name
            });
            markers.push(marker);
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
        }
    });

});
// Get the modal
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
    //GOOGLE MAPS
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(41.8971828, -87.63523709999998);
    var mapOptions = {
        zoom: 14,
        center: latlng
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
};