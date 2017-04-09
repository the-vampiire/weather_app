$(function() {

// calls get_weather on page load
get_weather();


    // toggles sidebar

        var wrapper = $('#wrapper'),
        open = false,
        sidebar_button = $('#sidebar_button');

        sidebar_button.click(function(){
            if(!open){
                open = true;
                sidebar_button.empty().html('<i id="button_icon" class="fa fa-caret-left fa-2x"></i>');
            }
            else if(open){
                open = false;
                sidebar_button.empty().html('<i id="button_icon" class="fa fa-caret-right fa-2x"></i>');
            }

            wrapper.toggleClass("toggled");


        });



    // Temperature Units (default: Fahrenheit)
            var Celsius = false;
            $('#Units_Switch').click(function(){
               if(!Celsius){
                   Celsius = true;
               }
               else if(Celsius){
                   Celsius = false;
               }
            });

    // Actual Temperature (default: On)
        var Actual = true;
        $('#Actual_Switch').click(function(){
            if(!Actual){
                Actual = true;
                $('#Feels_Like_Switch').prop('checked', false);
                Feels_Like = false;
            }
            else if(Actual){
                Actual = false;
                $('#Feels_Like_Switch').prop('checked', true);
                Feels_Like = true;
            }
        });

    // Feels Like Temperature (default: Off)
            var Feels_Like = false;
            $('#Feels_Like_Switch').click(function(){
                if(!Feels_Like){
                    Feels_Like = true;
                    $('#Actual_Switch').prop('checked',false);
                    Actual = false;
                }
                else if(Feels_Like){
                    Feels_Like = false;
                    $('#Actual_Switch').prop('checked',true);
                    Actual = true;
                }
            });

    // Humidity (default: On)
            var Humidity = true;
            $('#Humidity_Switch').click(function(){
                if(!Humidity){
                    Humidity = true;
                }
                else if(Humidity){
                    Humidity = false;
                }
            });

    // Cloud Coverage (default: On)
        var Cloud_Coverage = true;
        $('#Cloud_Switch').click(function(){
            if(!Cloud_Coverage){
                Cloud_Coverage = true;
            }
            else if(Cloud_Coverage){
                Cloud_Coverage = false;
            }
        });


    // Experimental Feature (default: Off)
    // Experimental button feature for querying flickr to produce a background image local to the current location
        var experimental = false;
        $('#Experimental_Switch').click(function(){
            if (experimental) {
                experimental = false;
            }
            else if (!experimental) {
                alert('Experimental feature. Uses location data to find the top rated image of your current city from Flickr! If it fails the page will reload with normal options selected');
                experimental = true;

            }
        });


    // Apply Settings

        $('#apply_settings').click(function(){
            wrapper.toggleClass("toggled");
            get_weather();
        });



// get location and weather

    function get_weather() {

        // JQuery shortcuts
        var body = $('body'),
        loading_div = $('#loading_div'),
        temperature_div = $('#temperature'),
        feels_like_temp_div = $('#feels_like_temperature'),
        clouds_div = $('#cloud_coverage'),
        condition_icon_div = $('#condition_icon'),
        condition_text_div = $('#condition_text'),
        humidity_div = $('#humidity'),
        time_div = $('#time'),
        location_div = $('#location'),
        date_div = $('#date'),
        jumbotron = $('#jumbotron'),
        temp_row = $('#temperature_row'),
        cond_row = $('#conditions_row');

        // clear jumbotron while loading
        temperature_div.empty();
        feels_like_temp_div.empty();
        clouds_div.empty();
        humidity_div.empty();
        condition_icon_div.hide();
        condition_text_div.empty();
        location_div.empty();

        // display loading animation
        loading_div.append('<i class="fa fa-spinner fa-pulse fa-5x" style="color:white"></i>');

        // if https and user accepts location services
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(pass, fail);

            function pass(position) {

                var lat = position.coords.latitude;
                var lon = position.coords.longitude;

                get_weather_secure(lat, lon);
            }

            function fail() {
                alert('Failed to retrieve secure location data\n. ' +
                    '\nEnsure that the browser you are using has location service permission enabled\n' +
                    'for iOS: settings -> privacy -> location services -> Safari / Facebook / your browser -> enable \n' +
                    'Then refresh and accept the request for checking your location');
            }

        // gets flickr background image based on location
            function get_flickr(lat, lon) {

                $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=bc63861a86c28aee09bb476d83cfe159&' +
                    'format=json&lat=' + lat + '&lon=' + lon + '&accuracy=16&safe_search=1&content_type=1&per_page=1&' +
                    'sort=interestingness-desc&text=downtown&text=city&text=skyline&media=photos&nojsoncallback=1', function (data) {

                    var photo = data.photos.photo[0];

                    // if no photo is found for location turn set experimental switch and variable to false and stop loading
                    if (photo === undefined || photo.farm === undefined) {
                        alert('No Flickr image matching request criteria was found for your area, sorry.');

                        $('#Experimental_Switch').prop('checked', false);
                        experimental = false;
                    }

                    else {
                        $('body').css("background-image", "url(" + "https://farm" + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + "_h.jpg" + ")");
                    }
                });
            }

        // gets and displays weather on secure connection
            function get_weather_secure(lat, lon) {
                $.get('https://api.apixu.com/v1/current.json?key=70d0f73f8eb048b8964185106170604&q=' + lat + ',' + lon, function (data) {

                // JSON data shortcuts
                    var current = data.current,
                    location = data.location;

                // Weather data

                    // Fahrenheit
                    var temp_f = current.temp_f, /* use for displaying *F <span>&#8457;</span> */
                    feels_like_f = current.feelslike_f,

                    // Celsius
                    temp_c = current.temp_c, /* use for displaying *F <span>&#8451;</span> */
                    feels_like_c = current.feelslike_c,

                    // Shared
                    humidity = current.humidity,
                    cloud_coverage = current.cloud,
                    is_day = current.is_day, /* day = 1, night = 0 */
                    condition_icon = current.condition.icon, /*add 'https:' prefix to load icon securely*/
                    condition_text = current.condition.text,
                    condition_code = current.condition.code,

                // Location data
                    name = location.name,
                    time_raw = location.localtime,
                    time = time_raw.slice(11),
                    date_split = time_raw.slice(0,10).split('-'),
                    date = date_split[1]+'-'+date_split[2]+'-'+date_split[0];

                // displays weather and location data

                    // remove loading animation
                    loading_div.empty();
                    condition_icon_div.show();

                    // display date, time, location
                        time_div.append('<h3>'+time+'</h3>');
                        location_div.append('<h2>'+name+'</h2>');
                        date_div.append('<h3>'+date+'</h3>');

                    // display weather
                        if(Celsius){
                            if(Feels_Like){
                                feels_like_temp_div.append('<h3>'+feels_like_c+'<span>&#8451;</span></h3>');
                            }
                            if(Actual){
                                temperature_div.append('<h3>'+temp_c+'<span>&#8451;</span></h3>');
                            }
                        }

                        if(!Celsius){
                            if(Feels_Like){
                                feels_like_temp_div.append('<h3>'+feels_like_f+'<span>&#8457;</span></h3>');
                            }
                            if(Actual){
                                temperature_div.append('<h3>'+temp_f+'<span>&#8457;</span></h3>');
                            }
                        }

                        if(Cloud_Coverage){
                            clouds_div.append('<h3>Cloud Cover: '+cloud_coverage+'%</h3>');
                        }


                        if(Humidity){
                            humidity_div.append('<h3>Humidity: '+humidity+'%</h3>');
                        }


                        condition_icon_div.attr('src', 'https://'+condition_icon).attr({width: 100});
                        condition_text_div.append('<h4>'+condition_text+'</h4>');


            // sets background image depending on condition code if experimental feature is off (default)

                    if(experimental){
                        get_flickr(lat,lon);
                    }

                    else{
                        // daytime
                        if(is_day === 1){
                            switch(condition_code){
                                // sunny
                                case 1000:
                                    body.css('background-image', 'url("Images/SUNNY_joseph-barrientos-7032_mini.jpg")');
                                    break;
                                // partly cloudy
                                case (1003):
                                case (1006):
                                    body.css('background-image', 'url("Images/PARTLY_CLOUDY_marcelo-quinan-78447_mini.jpg")');
                                    break;
                                // overcast
                                case (1009):
                                    body.css('background-image', 'url("Images/OVERCAST_antoine-barres-224061_mini.jpg")');
                                    break;
                                // fog
                                case (1030):
                                case (1135):
                                    body.css('background-image', 'url("Images/FOG_nicolas-cool-113893_mini.jpg")');
                                    break;
                                // rainy
                                case (1063):
                                case (1087):
                                case (1150):
                                case (1153):
                                case (1168):
                                case (1171):
                                case (1180):
                                case (1183):
                                case (1186):
                                case (1189):
                                case (1193):
                                case (1195):
                                case (1197):
                                case (1201):
                                case (1240):
                                case (1243):
                                case (1246):
                                case (1273):
                                case (1276):
                                    body.css('background-image', 'url("Images/RAINY_gabriele-diwald-201135_mini.jpg")');
                                    break;
                                // snowy
                                case (1066):
                                case (1072):
                                case (1147):
                                case (1114):
                                case (1117):
                                case (1210):
                                case (1213):
                                case (1216):
                                case (1219):
                                case (1222):
                                case (1225):
                                case (1237):
                                case (1204):
                                case (1069):
                                case (1207):
                                case (1249):
                                case (1252):
                                case (1255):
                                case (1258):
                                case (1261):
                                case (1264):
                                case (1279):
                                case (1282):
                                    body.css('background-image', 'url("Images/RAINY_gabriele-diwald-201135_mini.jpg")');
                                    break;
                                default:
                                    body.css('background-image', 'url("Images/SUNNY_joseph-barrientos-7032_mini.jpg")');
                            }
                        }

                        // night time
                        else if(is_day === 0){
                            jumbotron.css('background-color','rgba(255,255,255,0.25)', 'color','white');
                            temp_row.css('color','white');
                            cond_row.css('color','white');
                            switch(condition_code){
                                // night sky
                                case 1000:
                                    body.css('background-image', 'url("Images/NIGHT_hoang-duy-le-149870_mini.jpg")');
                                    break;
                                // cloudy
                                case (1003):
                                case (1006):
                                case (1009):
                                    body.css('background-image', 'url("Images/NIGHT_CLOUDY_matthew-kane-162961_mini.jpg")');
                                    break;
                                // fog
                                case (1030):
                                case (1135):
                                    body.css('background-image', 'url("Images/NIGHT_FOG_aaron-lee-140096_mini.jpg")');
                                    break;
                                // rainy
                                case (1063):
                                case (1087):
                                case (1150):
                                case (1153):
                                case (1168):
                                case (1171):
                                case (1180):
                                case (1183):
                                case (1186):
                                case (1189):
                                case (1193):
                                case (1195):
                                case (1197):
                                case (1201):
                                case (1240):
                                case (1243):
                                case (1246):
                                case (1273):
                                case (1276):
                                    body.css('background-image', 'url("Images/NIGHT_RAIN_dominik-schroder-14532_mini.jpg")');
                                    break;
                                // snowy
                                case (1066):
                                case (1072):
                                case (1147):
                                case (1114):
                                case (1117):
                                case (1210):
                                case (1213):
                                case (1216):
                                case (1219):
                                case (1222):
                                case (1225):
                                case (1237):
                                case (1204):
                                case (1069):
                                case (1207):
                                case (1249):
                                case (1252):
                                case (1255):
                                case (1258):
                                case (1261):
                                case (1264):
                                case (1279):
                                case (1282):
                                    body.css('background-image', 'url("Images/NIGHT_SNOW_jason-strull-216097_mini.jpg")');
                                    break;
                                default:
                                    body.css('background-image', 'url("Images/NIGHT_hoang-duy-le-149870_mini.jpg")');

                            }
                        }

                    }

                });
            }

        }

    }

});

