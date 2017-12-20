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

// display all projects from API using underscore and backbone
$(document).ready(function () {

	// create a model for a project using backbone with defaults
    var ProjectModel = Backbone.Model.extend({
        defaults: {
        ProjectId: null,
        Name: null,
        Website: null,
        Position: null,
        Address: null
        }
    });

	// create a collection for a project using backbone from API
    var ProjectCollection = Backbone.Collection.extend({
        model: ProjectModel,
        url: api,
        parse: function(response){
            return response.Items.sort(function (a, b) {
                return parseFloat(a.ProjectId) - parseFloat(b.ProjectId);
            });
        }
    });

	// create a template using underscore
    var template = "<img src='img/<%=ProjectId%>.jpg' alt='<%=ProjectId%>' class='logo'>";
    template +="<div class='company'><%=Name%></div>";
    template+="<div class='position'><%=Position%></div>";
    template+="<div class='address'><%=Address%></div>";
    template+="<div class='cb'></div>";

	// create a view for a project using backbone and a template from uderscore
    var ProjectView = Backbone.View.extend({
        tagName: "div",
        template: _.template(template),
        initialize: function(){
            this.listenTo(this.collection,"sync",this.render);
        },
        render: function(){
			// render projects and add markers
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
			// on click set center
            'click':'mapGeoCode'
        },
        mapGeoCode: function(){             
            var name = $(this)[0].model.attributes.Name;
            var website = $(this)[0].model.attributes.Website;
            var position = $(this)[0].model.attributes.Position;
            var address = $(this)[0].model.attributes.Address;
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
        }
    });

	// create a list view using backbone
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
        }
    });

	// instantiate
    var projectCollection = new ProjectCollection();

	// fetch
    projectCollection.fetch().then(function(){
        var myProjectList = new ProjectListView({collection:projectCollection});
    });    
});