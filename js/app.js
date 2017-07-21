// my API in AWS
var api = "https://246gg84zg8.execute-api.us-west-2.amazonaws.com/prod/projects";
var modal = document.getElementById('myModal');
var btn = document.getElementById("about");
var span = document.getElementsByClassName("close")[0];

// show modal ABOUT
btn.onclick = function () {
    modal.style.display = "block";
};

// hide modal ABOUT on click X
span.onclick = function () {
    modal.style.display = "none";
};

// hide modal ABOUT on click anywhere outside the modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

var geocoder;
var map;
var markers=[];

// initialize google maps
function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(41.8838158, -87.6415424);
    var mapOptions = {
        zoom: 14,
        center: latlng
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
};

// add a marker in google maps for each project
function addMarker(index,title,website,address) {
    console.log(index);
    console.log(title);
    console.log(website);
    console.log(address);
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: title
            });
            markers.push(marker);
            var contentString = '<div id="content">' +
                '<div class="company">' + title + '</div>' +
                '<div id="bodyContent">' +
                '<div class="website">' + website + '</div>' +
                '<div class="address">'+ address + '</div>' +
                '</div>' +
                '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            if(index===1) {
                infowindow.open(map, marker);
            }
            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        }
    });
};

function mapGeoCode(name,website,position,address){
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            // set center of the map
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
};

// display all projects from API using angular.js
var app = angular.module('app', []);
app.factory("projectFactory", function ($http) {
    var factory = {};
    factory.search = function (callback) {
        $http.get(api).then(function (response) {
            console.log(api);
            factory.projects = response.data.Items.sort(function (a, b) {
                return parseFloat(a.ProjectId) - parseFloat(b.ProjectId);
            });
            callback(factory.projects);
        });
    };
    return factory;
});
app.controller('projectsController', function ($scope, projectFactory) {
    $scope.mapGeoCode = function (name,website,position,address) {
        return mapGeoCode(name,website,position,address);
    };
    projectFactory.search(function (projects) {
        $scope.projects = projects;
        if($scope.projects){
            for (var project = 0; project < $scope.projects.length; project++) {
                addMarker($scope.projects[project].ProjectId,
                    $scope.projects[project].Name,
                    $scope.projects[project].Website,
                    $scope.projects[project].Address);
            }
        }
    });
});
/*
$(document).ready(function () {
        events:{
			// on click set center
            'click':'mapGeoCode'
        },
        mapGeoCode: function(){  
        }
    });
});*/