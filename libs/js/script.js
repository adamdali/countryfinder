var countries = [];
var currentLatitude = 51.505;
var currentLongitude = -0.09;

// $(document).ready(function() { 
    
// });
console.log(currentLongitude);

$.ajax({
    type: 'GET',
    url: 'libs/php/getAllCountries.php',
    success: function(response) {
        $(".initdata").text('Select Your Country');
        for (var i = 0; i < response.length; i++)
            $("#search").append('<option value="' + response[i].country + '" data-iso="' + response[i].code + '">' + response[i].country + '</option>')
        initGeolocation();
    },
    error: function(response) {

    }
})


bounds = new L.LatLngBounds(new L.LatLng(-89.98155760646617, -180), new L.LatLng(89.99346179538875, 180));

var mymap = L.map('map', {
    maxBounds: bounds
}).setView([currentLatitude, currentLongitude], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    setMaxBounds: bounds,

    maxZoom: 18,
    minZoom: 3,
    center: bounds.getCenter(),
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,


}).addTo(mymap);
var southWest = L.latLng(-89.98155760646617, -180),
     northEast = L.latLng(89.99346179538875, 180);
var bounds = L.latLngBounds(southWest, northEast);

var popup = L.popup();

function onMapClick(e) {
    $('#loader').show(0);
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    
    removeCountryBorder();
    removeExistingMarkers();
    apiAjaxCalls(lat, lng, e);
}

let markers = [];
let clusterMarkers = L.markerClusterGroup();

function initGeolocation()
{
   if( navigator.geolocation )
   {
      // Call getCurrentPosition with success and failure callbacks
      navigator.geolocation.getCurrentPosition( success, fail );
   }
   else
   {
      alert("Sorry, your browser does not support geolocation services.");
   }
}

function success(position)
{
    currentLongitude = position.coords.longitude;
    currentLatitude = position.coords.latitude;
    // console.log(currentLongitude);
    mymap.setView([currentLatitude, currentLongitude], 5);
    $.ajax({
        type: 'GET',
        url: 'libs/php/getCountryDetails.php?lat=' + currentLatitude + "&lng=" + currentLongitude,
        success: function(response) {
            let countryName = response.features[0].properties.components.country;
            // continent = response.features[0].properties.components.continent;
            
            //let returnedCountryCode = response.features[0].properties.components.country_code;
            //$('#search option:contains(' + "CAN" + ')').attr('selected', 'selected');
            $('#search').val(countryName).change();
        }
    });
}

function fail()
{
    console.log("Fail");
   // Could not obtain location
}

function apiAjaxCalls(lat, lng, e = "") {
    
    var countryName;
    var continent;
    var code;
    var capitalCity;
    var population;
    var currency;
    var language;
    var timezone;
    var country_code;
    var exchangeRate;
    var weather_temp;
    var weather_humidity;
    var weather_condition;
    var wikiUrl;

    //api for weather
    $.ajax({
        type: 'GET',
        url: 'libs/php/weather.php?lat=' + lat + '&lng=' + lng,
        success: function(response) {
            weather_temp = "";
            weather_humidity = "";
            weather_condition = "";
            if(response.weatherObservation != undefined){
                weather_temp = response.weatherObservation.temperature;
                weather_humidity = response.weatherObservation.humidity;
                weather_condition = response.weatherObservation.weatherCondition;
            }
        },
        error: function(response) {
            console.log(response);
        }
    })

    //api for wiki link
    $.ajax({
        type: 'GET',
        url: 'libs/php/wiki.php?lat=' + lat + '&lng=' + lng,
        success: function(response) {
            wikiUrl = "";
            if(response.geonames != undefined && response.geonames[0] != undefined && response.geonames[0].wikipediaUrl != undefined){
                wikiUrl = response.geonames[0].wikipediaUrl;
            }

        },
        error: function(response) {
            console.log(response);
        }
    })

    //ajax for all other data
    $.ajax({
        type: 'GET',
        url: 'libs/php/getCountryDetails.php?lat=' + lat + "&lng=" + lng,
        success: function(response) {
            countryName = response.features[0].properties.components.country;
            continent = response.features[0].properties.components.continent;
            code = response.features[0].properties.components.country_code;

            if(countryName != undefined && code != undefined){

                $('#search').val(countryName);
                if(e != undefined){
                    applyCountryBorder(countryName);
                }
    
                $.ajax({
                    type: 'GET',
                    url: 'libs/php/getCountryInfo.php?code=' + code,
                    success: function(response1) {
                        capitalCity = response1.capital;
                        population = response1.population;
                        if(response1.currencies != undefined && response1.currencies[0] != undefined){
                            if(response1.currencies[0].name != undefined){
                                currency = response1.currencies[0].name;
                            }
                            if(response1.currencies[0].code != undefined){
                                country_code = response1.currencies[0].code;
                            }
                        }
                        language = response1.languages[0].name;
                        timezone = response1.timezones[0];
                        $.ajax({
                            type: 'GET',
                            url: 'libs/php/getExchangeRate.php?countryCode=' + country_code,
                            success: function(response2) {
                                $('#loader').hide(0);
                                exchangeRate = response2.rates[country_code];
                                let marker = L.marker([lat, lng]).addTo(mymap).on('click', onClickMarker);
                                markers.push(marker);
                                $.ajax({
                                    type: 'GET',
                                    url: `https://api.worldbank.org/v2/country/${code}?format=json`,
                                    success: function(res){
                                        //console.log(res);
                                        let incomeLevel = res[1][0].incomeLevel.value;
                                        //console.log(incomeLevel);
                                        $.ajax({
                                            type: 'GET',
                                            url: `https://holidayapi.com/v1/holidays?key=0008dba4-52aa-412f-97e9-f974eac1890a&country=${code}&year=2020`,
                                            success: function(res2){
                                                let holidays = "";
                                                for(let i =0; i<res2.holidays.length; i++){
                                                    holidays += "<tr>" +
                                                        "<td>"+parseInt(i+1)+"</td>"+
                                                        "<td style='width: 300px;'>"+res2.holidays[i].name+"</td>"+
                                                        "<td>"+res2.holidays[i].date+"</td>"+
                                                    "</tr>";
                                                }
                                                let nationalHolidayTable = "<div style='height: 200px; overflow-y:scroll;'><table class='table table-striped'>" +
                                                "<thead>" +
                                                  "<tr>" +
                                                    "<th scope='col'>#</th>" +
                                                    "<th scope='col' style='width: 100px;'>Name</th>" +
                                                    "<th scope='col'>Date</th>" +
                                                  "</tr>" +
                                                "</thead>" + 
                                                "<tbody>" +
                                                    holidays +
                                                "</tbody>" +
                                              "</table></div>";
                                              $.ajax({
                                                    type: 'GET',
                                                    //url: `https://newsapi.org/v2/top-headlines?country=${code}&apiKey=b61ff748b91a4fe1bf2516028870b2b7`, //2cdf166cfef24dfcb2e6cdd6adfb3c0a
                                                    url: `https://api.mediastack.com/v1/news?access_key=deafb5345e44d670920236f525bdcfe3&countries=${code}`,
                                                    success: function(res3){
                                                        //console.log(res3);
                                                        let headlines = "";
                                                        // if(res3.articles.length > 0){
                                                        //     let title = "<h4 style='text-align:center;'>"+res3.articles[0].title+"</h4>";
                                                        //     let description = "<h5 style='text-align:center;'>"+res3.articles[0].description+"</h5>";
                                                        //     let url = "<a href='"+res3.articles[0].url+"'>Read more...</a>";
                                                        //     let content = "<p>"+res3.articles[0].content+"</p>";
                                                        //     let img = "<div style='width: 150px; height: 150px; vertical-align: middle;'><img src='"+res3.articles[0].urlToImage+"' style='object-fit: content; width: 100%; height: 100%;'></img></div>";
                                                        //     let source = res3.articles[0].source.name;
                                                        //     let author = res3.articles[0].author;
                                                        //     if(author == null) {
                                                        //         author = "";
                                                        //     }
                                                        //     let date =  new Date(res3.articles[0].publishedAt).toString().substring(0,24);
                                                            
                                                        //     headlines = "<article>"+
                                                        //         title + description + 
                                                        //         "<hr>" + 
                                                        //         "<div class='row justify-content-between' style='width: 100%;'>"+
                                                        //             "<div class='col-8'>"+date+"</div>" +
                                                        //             "<div class='col-4'>"+author+"</div>" +
                                                        //         "</div>" + 
                                                        //         "<hr>" +
                                                        //         "<div class='row justify-content-between'>"+
                                                        //             "<div class='col-7'>"+content+url +"</div>" +
                                                        //             "<div class='col-5'>"+img+"</div>" +
                                                        //         "</div>" + 
                                                                
                                                        //     "</article>";
                                                        // }
                                                        if(res3.data.length > 0){
                                                            let source = "<h3 style='text-align:center;'>"+res3.data[0].source+"</h3>"
                                                            let title = "<h4 style='text-align:center;'>"+res3.data[0].title+"</h4>";
                                                            //let description = "<h5 style='text-align:center;'>"+res3.data[0].description+"</h5>";
                                                            let url = "<a href='"+res3.data[0].url+"'>Read more...</a>";
                                                            let content = "<p>"+res3.data[0].description+"</p>";
                                                            let img = "<div style='width: 150px; height: 150px; vertical-align: middle;'><img src='"+res3.data[0].image+"' style='object-fit: content; width: 100%; height: 100%;'></img></div>";
                                                            //let source = res3.articles[0].source.name;
                                                            let author = res3.data[0].author;
                                                            if(author == null) {
                                                                author = "";
                                                            }
                                                            let date =  new Date(res3.data[0].published_at).toString().substring(0,24);
                                                            
                                                            headlines = "<article>"+
                                                                source + title + 
                                                                "<hr>" + 
                                                                "<div class='row justify-content-between' style='width: 100%;'>"+
                                                                    "<div class='col-8'>"+date+"</div>" +
                                                                    "<div class='col-4'>"+author+"</div>" +
                                                                "</div>" + 
                                                                "<hr>" +
                                                                "<div class='row justify-content-between'>"+
                                                                    "<div class='col-7'>"+content+url +"</div>" +
                                                                    "<div class='col-5'>"+img+"</div>" +
                                                                "</div>" + 
                                                                
                                                            "</article>";
                                                        }
                                                        let flagImg = `<img src="https://www.countryflags.io/${code}/flat/32.png"></img>`;
                                                        $("#dataModal .modal-body").html('<b>Country Flag: </b>'+ flagImg +'<br><b>Country Name : </b>' + countryName + '<br><b>Region/Continent : </b>' + continent + '<br><b>Capital City: </b>' + capitalCity + '<br><b>Population : </b>' + population + '<br><b>GDP : </b>' + incomeLevel + '<br><b>Currency : </b>' + currency + '<br><b>Language : </b>' + language + '<br><b>Timezone : </b>' + timezone + '<br><b>National Holidays : </b>' + nationalHolidayTable + '<br><b>Exchange Rates : </b>' + exchangeRate + '<br><b>Weather : Temperature :  </b>' + weather_temp + ' Celsius <b> , Humidity : </b>' + weather_humidity + '<br><b>Top Headlines : </b>' + headlines + '<br><b>Wikipedia Link : </b>' + wikiUrl);
                                                        $('#dataModal').modal('show');
                                                    }
                                              });
                                                
                                            }
                                        });
                                        
                                    }, 
                                    error: function(err) {
                                        console.log(err);
                                    }
                                });
                                
                            },
                            error: function(response2) {
                                console.log(response2);
                            }
                        })
    
                    },
                    error: function(response1) {
                        console.log(response1)
                    }
                });
                $.ajax({
                    type: 'GET',
                    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${countryName}&key=AIzaSyAEnX9jDrULj6lhBkExyqauTZXow5dmFTw`,
                    success: function(geocodeRes){
                        //removeExistingMarkers();
                        clusterMarkers.clearLayers();
                        mymap.removeLayer(clusterMarkers);
                        let minLat = geocodeRes.results[0].geometry.bounds.southwest.lat;
                        let minLng = geocodeRes.results[0].geometry.bounds.southwest.lng;
                        let maxLat = geocodeRes.results[0].geometry.bounds.northeast.lat;
                        let maxLng = geocodeRes.results[0].geometry.bounds.northeast.lng;
                        $.ajax({
                            type: 'GET',
                            url: 'libs/php/getLandmarks.php?minLat=' + minLat + '&minLng=' + minLng + '&maxLat=' + maxLat + '&maxLng=' + maxLng,
                            success: function(data){
                                
                                //console.log(data);
                                let markerObject = JSON.parse(data);
                                //var markers = L.markerClusterGroup();
                                for (let i=0; i<markerObject.length; i++) {
                                    const marker = L.marker([ markerObject[i].point.lat, markerObject[i].point.lon ])
                                    clusterMarkers.addLayer(marker)
                                }
                                mymap.addLayer(clusterMarkers);
                            }
                        });
                    }
                });
            }
        },
        error: function(response) {
            console.log(response);
        }
    });

    //ajax for landmarks
    
    
}

mymap.on('click', onMapClick);

$(document).on('change', 'select', function(e) {
    $('#loader').show(0);
    removeExistingMarkers();
    e.preventDefault();
    var search_country = $("#search").val();
    var code = $(this).find(':selected').attr('data-iso');
    //applyCountryBorder(search_country);
    $.ajax({
        type: 'GET',
        url: 'libs/php/getCountryGeometry.php?country=' + code,
        success: function(response_) {
            // for (var i = 0; i < response_.length; i++) {
            //     if (response_[i].latlng) {
                    var lat = response_.latlng[0];
                    var lng = response_.latlng[1];
                    apiAjaxCalls(lat, lng);
            //     }
            // }

        },
        error: function(response_) {
            console.log(response_);
        }
    })
})

$("#search-btn-latlng").click(function(e) {
    e.preventDefault();
    var lat_ = parseFloat($("#lat").val());
    var lng_ = parseFloat($("#lng").val());
    apiAjaxCalls(lat_, lng_);
})

let layer;
function applyCountryBorder(country) {
    removeCountryBorder();
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "libs/php/getCountryCoordinates.php?country=" + country,
        success: function(data) {
            layer = L.geoJson(data.data.countryInfo.geometry, {
                style : {
                    weight: 1,
                    opacity: 1,
                    color: 'black',
                    fillOpacity: 0
                }
            }).addTo(mymap);
            mymap.fitBounds(layer.getBounds()); 

        }
    });
}

function removeCountryBorder(){
    if(layer != undefined){
        layer.clearLayers();
    }
}

function removeExistingMarkers(){
    //Code to remove Existing Markers
    for(i=0;i<markers.length;i++) {
        mymap.removeLayer(markers[i]);
    }
}

function onClickMarker(e) {
    $('#dataModal').modal('show');
}

