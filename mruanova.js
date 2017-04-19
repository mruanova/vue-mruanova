var geocoder;
var map;
var app = angular.module('demo', []).controller('WelcomeController', function ($scope, $http) {
    $scope.date = new Date();
    //GET ALL PROJECTS
    $http({
        method: 'GET',
        url: 'https://246gg84zg8.execute-api.us-west-2.amazonaws.com/prod/projects'
    }).then(function successCallback(response) {
        //SORT
        response.data.Items.sort(function (a, b) {
            return parseFloat(a.ProjectId) - parseFloat(b.ProjectId);
        });
        //DISPLAY PROJECTS
        for (var i = 0; i < response.data.Items.length; i++) {
            console.log(response.data.Items[i].ProjectId);
            console.log(response.data.Items[i].Name);
            console.log(response.data.Items[i].Website);
            console.log(response.data.Items[i].Position);
            console.log(response.data.Items[i].Address);
        }
    }, function errorCallback(response) {
        console.log('ERROR: GET PROJECTS FAILED');
    });
});
angular.bootstrap(document, ['demo']);
function initialize() {
    //GOOGLE MAPS
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(41.8971828, -87.63523709999998);
    var mapOptions = {
        zoom: 14,
        center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    //1
    var title1 = "Coding DOJO";
    var address1 = "213 W Institute Pl #610, Chicago, IL 60610";
    var website1 = "www.codingdojo.com";
    geocoder.geocode({ 'address': address1 }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: title1
            });
            var contentString = '<div id="content">' +
                '<div class="link2">' + title1 + '</div>' +
                '<div id="bodyContent">' +
                '<div class="website">' + website1 + '</div>' +
                '<div class="address">'+ address1 + '</div>' +
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
    //2
    var title2 = "CSG International";
    var address2 = "33 W Monroe St #900, Chicago, IL 60603";
    var website2 = "www.csgi.com";
    geocoder.geocode({ 'address': address2 }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: title2
            });
            var contentString = '<div id="content">' +
                '<div class="link2">' + title2 + '</div>' +
                '<div id="bodyContent">' +
                '<div class="website">' + website2 + '</div>' +
                '<div class="address">' + address2 + '</div>' +
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
    //3
    var title3 = "AON Consulting Inc";
    var address3 = "200 E Randolph St #7, Chicago, IL 60601";
    var website3 = "www.aon.com";
    geocoder.geocode({ 'address': address3 }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: title3
            });
            var contentString = '<div id="content">' +
                '<div class="link2">' + title3 + '</div>' +
                '<div id="bodyContent">' +
                '<div class="website">' + website3 + '</div>' +
                '<div class="address">' + address3 + '</div>' +
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
    //4
    var title4 = "AVANADE Inc";
    var address4 = "161 N Clark St #3700, Chicago, IL 60601";
    var website4 = "www.avanade.com";
    geocoder.geocode({ 'address': address4 }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: title4
            });
            var contentString = '<div id="content">' +
                '<div class="link2">' + title4 + '</div>' +
                '<div id="bodyContent">' +
                '<div class="website">' + website4 + '</div>' +
                '<div class="address">' + address4 + '</div>' +
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
    //5
    var title5 = "G/O Digital Marketing";
    var address5 = "225 N Michigan Ave #1600, Chicago, IL 60601";
    var website5 = "www.godigitalmarketing.com";
    geocoder.geocode({ 'address': address5 }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: title5
            });
            var contentString = '<div id="content">' +
                '<div class="link2">' + title5 + '</div>' +
                '<div id="bodyContent">' +
                '<div class="website">' + website5 + '</div>' +
                '<div class="address">' + address5 + '</div>' +
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
}
function codeAddress(address) {
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
        }
    });
};
// Get the modal
var modal = document.getElementById('myModal');
var btn = document.getElementById("about");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
    modal.style.display = "block";
}
span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
//READY
$(document).ready(function () {
    $(".animation").css("top", "425px");
});