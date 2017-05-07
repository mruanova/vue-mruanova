var api = "https://246gg84zg8.execute-api.us-west-2.amazonaws.com/prod/projects";
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
            if(index===1) {
                infowindow.open(map, marker);
            }
            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        }
    });
};

$(document).ready(function () {
    //console.log(api);
    //$(".animation").css("top", "450px");

    var ProjectModel = Backbone.Model.extend({
        defaults: {
        ProjectId: null,
        Name: null,
        Website: null,
        Position: null,
        Address: null
        }
    });

    var ProjectCollection = Backbone.Collection.extend({
        model: ProjectModel,
        url: api,
        parse: function(response){
            return response.Items.sort(function (a, b) {
                return parseFloat(a.ProjectId) - parseFloat(b.ProjectId);
            });
        }
    });

    var template ="<div class='company'><%=Name%></div>";
    template+="<div class='website'><%=Website%></div>";
    template+="<div class='position'><%=Position%></div>";
    template+="<div class='address'><%=Address%></div>";

    var ProjectView = Backbone.View.extend({
        tagName: "div",
        template: _.template(template),
        initialize: function(){
            this.listenTo(this.collection,"sync",this.render);
            this.listenTo(this.collection,"remove",this.whatHappened);
            //this.listenTo(this, 'change', this.studentChange);
            //this.listenTo(this, 'add', this.studentAdded);
        },
        render: function(){
            var m=this.model.toJSON();
            var t =this.template(m);
            this.$el.html(t);
            console.log(this.model.attributes.ProjectId);
            console.log(this.model.attributes.Name);
            console.log(this.model.attributes.Website);
            console.log(this.model.attributes.Position);
            console.log(this.model.attributes.Address);
            addMarker(this.model.attributes.ProjectId,this.model.attributes.Name,this.model.attributes.Website,this.model.attributes.Address);
            return this;
        },
        events:{
            'click':'mapGeoCode'
        },
        mapGeoCode: function(){             
            var name = $(this)[0].model.attributes.Name;
            var website = $(this)[0].model.attributes.Website;
            var position = $(this)[0].model.attributes.Position;
            var address = $(this)[0].model.attributes.Address;
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
            
        },
        whatHappened: function(){
            console.log('what Happened? 1');
        }
    });

    var ProjectListView = Backbone.View.extend({
        el:"#project_list",
        initialize:function(){
            this.render();
        },
        render:function(){
            this.$el.empty();
            this.collection.each(function(project){
                var projectView = new ProjectView({model:project});
                this.$el.append(projectView.render().$el);
            },this);
        },
        whatHappened: function(){
            console.log('what Happened? 2');
        }
    });

    var projectCollection = new ProjectCollection();

    projectCollection.fetch().then(function(){
        var myProjectList = new ProjectListView({collection:projectCollection});
    });    
});

$(document).on("click", ".project", function () {
    /*
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
    });*/
});