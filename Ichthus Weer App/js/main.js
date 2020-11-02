//Constant for the api keys
const weatherkey = "d1f4a30eef8514144e73965f892e2828";
const googlekey = "AIzaSyBMiVuSa-3qaXFJbF9Qzpcff-wFb94FkbY";
const test = {};

const dtconversionformat = { weekday: 'long' };
const timeatmformat = { hour: '2-digit', minute:'2-digit' };
const alerttimeformat = { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }

//Check if the browser supports / user allows geolocation, else makes the notification block visible and displays an error
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    document.querySelector(".notificationblock").style.display = "block";
    document.querySelector(".inner-notificationblock").innerHTML = `
    <h2> Geen locatie gevonden! </h2>
    <br>
    <h3>Als je de IchthusWeerApp wilt gebruiken, zul je je locatie moeten delen!</h3>    
    <h4>(Refresh de pagina als je locatie delen hebt toegestaan)</h4>
    <h4>Dat doe je zo:</h4>
    <img src="./img/Weatherapp-location.png" alt="Weatherapp-tutorial">
    `;
}

//Function to make the notification block visible and show the error recieved by the api
function showError(){
    document.querySelector(".notificationblock").style.display = "block";
    document.querySelector(".inner-notificationblock").innerHTML = 
    `
    <h2> Geen locatie gevonden! </h2>
    <br>
    <h3>Als je de IchthusWeerApp wilt gebruiken, zul je je locatie moeten delen!</h3>    
    <h4>(Refresh de pagina als je locatie delen hebt toegestaan)</h4>
    <h4>Dat doe je zo:</h4>
    <img src="./img/Weatherapp-location.png" alt="Weatherapp-tutorial">
    `;
}

//Function to set user's position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
    getGoogleMaps(latitude, longitude);
}

//Function to request the map from the google maps api
function getGoogleMaps(latitude, longitude){
    // Call the api
    let googlemapsapi = `https://www.google.com/maps/embed/v1/directions?origin=${latitude},${longitude}&destination=Ichthus+Lyceum+Driehuis&key=${googlekey}&mode=bicycling&units=metric&maptype=roadmap`

    document.getElementById("mapsrc").setAttribute("src", `${googlemapsapi}`);
}

//Function to request the weather from the api and give get the values we want
function getWeather(latitude, longitude){
    // Request onecall weather information from the api with our latitude and longitude, our api key, our language and the unit 
    let weatherapi = `http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${weatherkey}&lang=nl&units=metric`

    // Display the data in browser console, just for convenience
    console.log(weatherapi); 

    // Fetch the data recieved from the api
    fetch(weatherapi)
        // Put the recieved data in a response.json file and returns the variable data
        .then(function(response){
            let data = response.json();
            return data;
        })

        // Take the recieved data and converts it into our preferred format
        .then(function(data){
            //Convert the fetched data into an easily applicable format
            document.querySelector(".currenttemperature").innerHTML = `${Math.floor(data.current.temp)}°<span>C</span>`;
            document.querySelector(".currentweathericon").innerHTML = `<img src="img/${data.current.weather[0].icon}white.svg"/>`;
            document.getElementById("favicon").setAttribute("href", `./img/${data.current.weather[0].icon}white.svg`);

            for (let i = 0; i < data.daily.length; i++) {
                document.querySelector(`.forecastday${i}_temperature`).innerHTML = `<br>${Math.floor(data.daily[i].temp.day)}°<span>C</span>`;
                document.querySelector(`.forecastday${i}_date`).innerHTML = `<br>${new Date(data.daily[i].dt * 1000).toLocaleDateString('nl-NL', dtconversionformat)}`;
                document.querySelector(`.forecastday${i}_precipitation`).innerHTML = `<br>${NulltoZero(data.daily[i].rain)}<span> mm</span>`;
                document.querySelector(`.forecastday${i}_weathericon`).innerHTML = `<img src="img/${data.daily[i].weather[0].icon}.svg"/>`;
                document.querySelector(`.forecastday${i}_winddirectionicon`).innerHTML = `<img src="img/${windspeedtoicon(data.daily[i].wind_speed)}.svg"/>` ;
                document.querySelector(`.forecastday${i}_winddirectionicon`).style.transform = `rotate(${data.daily[i].wind_deg}deg)`;
            }

            const A = compareroutetowinddirection(latitude, longitude);
            const B = Math.floor(data.current.wind_deg / 45);

            function compareroutetowinddirection(latitude, longitude){
                var routeangle = Math.atan2(4.636104 - longitude, 52.443338 - latitude) * 180 / Math.PI;
                if (routeangle < 0) {
                    routeangle += 360.0;
                }
                var val = Math.floor((routeangle / 45) + 0.5);
                return val;
            }

            function degToCompass(val) {
                // var val = Math.floor((num / 45) + 0.5);
                var arr = ["N", "NO", "O", "ZO", "Z", "ZW", "W", "NW"];
                return arr[(val % 8)];
            }
            
            if (
                (A == 1 & B == 8) ||
                (A == 1 & B == 1) ||
                (A == 1 & B == 2) ||
                (A == 2 & B == 1) ||
                (A == 2 & B == 2) ||
                (A == 2 & B == 3) ||
                (A == 3 & B == 2) ||
                (A == 3 & B == 3) ||
                (A == 3 & B == 4) ||
                (A == 4 & B == 3) ||
                (A == 4 & B == 4) ||
                (A == 4 & B == 5) ||
                (A == 5 & B == 4) ||
                (A == 5 & B == 5) ||
                (A == 5 & B == 6) ||
                (A == 6 & B == 5) ||
                (A == 6 & B == 6) ||
                (A == 6 & B == 7) ||
                (A == 7 & B == 6) ||
                (A == 7 & B == 7) ||
                (A == 7 & B == 8) ||
                (A == 8 & B == 7) ||
                (A == 8 & B == 8) ||
                (A == 8 & B == 1)
                ){
                    document.querySelector(".windroute").innerHTML = '<p>Je hebt wind mee, je kan een paar minuutjes later weggaan!<p>';
            } 
            else if (
                (A == 1 & B == 4) ||
                (A == 1 & B == 5) ||
                (A == 1 & B == 6) ||
                (A == 2 & B == 5) ||
                (A == 2 & B == 6) ||
                (A == 2 & B == 7) ||
                (A == 3 & B == 6) ||
                (A == 3 & B == 7) ||
                (A == 3 & B == 8) ||
                (A == 4 & B == 7) ||
                (A == 4 & B == 8) ||
                (A == 4 & B == 1) ||
                (A == 5 & B == 8) ||
                (A == 5 & B == 1) ||
                (A == 5 & B == 2) ||
                (A == 6 & B == 1) ||
                (A == 6 & B == 2) ||
                (A == 6 & B == 3) ||
                (A == 7 & B == 2) ||
                (A == 7 & B == 3) ||
                (A == 7 & B == 4) ||
                (A == 8 & B == 3) ||
                (A == 8 & B == 4) ||
                (A == 8 & B == 5)
                ) {
                    document.querySelector(".windroute").innerHTML = '<p>Je hebt helaas wind tegen, je kan het best een paar minuutjes eerder weggaan!<p>';
            }
            else {
                document.querySelector(".windroute").innerHTML = '<p>Je hebt helaas geen wind mee, je kan het best op tijd weggaan!<p>';
            }

            if (data.minutely) {
                Chart.defaults.global.defaultFontColor = "#000";
                let precipitationchart = new Chart(document.getElementById("precipitationchart"), {
                    type: 'line',
                    scaleBeginAtZero : true,
                    data: {
                        labels: [   `${new Date(NulltoZero(data.minutely[0].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[1].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[2].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[3].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[4].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[5].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[6].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[7].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[8].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[9].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[10].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[11].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[12].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[13].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[14].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[15].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[16].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[17].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[18].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[19].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[20].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[21].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[22].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[23].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[24].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[25].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[26].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[27].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[28].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[29].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[30].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[31].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[32].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[33].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[34].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[35].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[36].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[37].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[38].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[39].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[40].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[41].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[42].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[43].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[44].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[45].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[46].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[47].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[48].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[49].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[50].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[51].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[52].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[53].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[54].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[55].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[56].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[57].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[58].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[59].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                    `${new Date(NulltoZero(data.minutely[60].dt) * 1000).toLocaleTimeString('nl-NL', timeatmformat)}`,
                                ],
                        datasets: [{
                            label: 'Rain for the coming hour in mm/h',
                            data: [ `${NulltoZero(data.minutely[0].precipitation)}`, 
                                    `${NulltoZero(data.minutely[1].precipitation)}`, 
                                    `${NulltoZero(data.minutely[2].precipitation)}`, 
                                    `${NulltoZero(data.minutely[3].precipitation)}`, 
                                    `${NulltoZero(data.minutely[4].precipitation)}`, 
                                    `${NulltoZero(data.minutely[5].precipitation)}`, 
                                    `${NulltoZero(data.minutely[6].precipitation)}`, 
                                    `${NulltoZero(data.minutely[7].precipitation)}`, 
                                    `${NulltoZero(data.minutely[8].precipitation)}`, 
                                    `${NulltoZero(data.minutely[9].precipitation)}`, 
                                    `${NulltoZero(data.minutely[10].precipitation)}`, 
                                    `${NulltoZero(data.minutely[11].precipitation)}`, 
                                    `${NulltoZero(data.minutely[12].precipitation)}`, 
                                    `${NulltoZero(data.minutely[13].precipitation)}`, 
                                    `${NulltoZero(data.minutely[14].precipitation)}`, 
                                    `${NulltoZero(data.minutely[15].precipitation)}`, 
                                    `${NulltoZero(data.minutely[16].precipitation)}`, 
                                    `${NulltoZero(data.minutely[17].precipitation)}`, 
                                    `${NulltoZero(data.minutely[18].precipitation)}`, 
                                    `${NulltoZero(data.minutely[19].precipitation)}`, 
                                    `${NulltoZero(data.minutely[20].precipitation)}`, 
                                    `${NulltoZero(data.minutely[21].precipitation)}`, 
                                    `${NulltoZero(data.minutely[22].precipitation)}`, 
                                    `${NulltoZero(data.minutely[23].precipitation)}`, 
                                    `${NulltoZero(data.minutely[24].precipitation)}`, 
                                    `${NulltoZero(data.minutely[25].precipitation)}`, 
                                    `${NulltoZero(data.minutely[26].precipitation)}`, 
                                    `${NulltoZero(data.minutely[27].precipitation)}`, 
                                    `${NulltoZero(data.minutely[28].precipitation)}`, 
                                    `${NulltoZero(data.minutely[29].precipitation)}`, 
                                    `${NulltoZero(data.minutely[30].precipitation)}`, 
                                    `${NulltoZero(data.minutely[31].precipitation)}`, 
                                    `${NulltoZero(data.minutely[32].precipitation)}`, 
                                    `${NulltoZero(data.minutely[33].precipitation)}`, 
                                    `${NulltoZero(data.minutely[34].precipitation)}`, 
                                    `${NulltoZero(data.minutely[35].precipitation)}`, 
                                    `${NulltoZero(data.minutely[36].precipitation)}`, 
                                    `${NulltoZero(data.minutely[37].precipitation)}`, 
                                    `${NulltoZero(data.minutely[38].precipitation)}`, 
                                    `${NulltoZero(data.minutely[39].precipitation)}`, 
                                    `${NulltoZero(data.minutely[40].precipitation)}`, 
                                    `${NulltoZero(data.minutely[41].precipitation)}`, 
                                    `${NulltoZero(data.minutely[42].precipitation)}`, 
                                    `${NulltoZero(data.minutely[43].precipitation)}`, 
                                    `${NulltoZero(data.minutely[44].precipitation)}`, 
                                    `${NulltoZero(data.minutely[45].precipitation)}`, 
                                    `${NulltoZero(data.minutely[46].precipitation)}`, 
                                    `${NulltoZero(data.minutely[47].precipitation)}`, 
                                    `${NulltoZero(data.minutely[48].precipitation)}`, 
                                    `${NulltoZero(data.minutely[49].precipitation)}`, 
                                    `${NulltoZero(data.minutely[50].precipitation)}`, 
                                    `${NulltoZero(data.minutely[51].precipitation)}`, 
                                    `${NulltoZero(data.minutely[52].precipitation)}`, 
                                    `${NulltoZero(data.minutely[53].precipitation)}`, 
                                    `${NulltoZero(data.minutely[54].precipitation)}`, 
                                    `${NulltoZero(data.minutely[55].precipitation)}`, 
                                    `${NulltoZero(data.minutely[56].precipitation)}`, 
                                    `${NulltoZero(data.minutely[57].precipitation)}`, 
                                    `${NulltoZero(data.minutely[58].precipitation)}`, 
                                    `${NulltoZero(data.minutely[59].precipitation)}`, 
                                    `${NulltoZero(data.minutely[60].precipitation)}`
                                ],
                            fill: true,
                            borderColor: ['rgba(3, 73, 252, 1)'],
                            borderWidth: 4,
                            pointRadius: 0,
                            backgroundColor: ['rgba(3, 73, 252, 1)'],
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    suggestedMin: 0,
                                }
                            }]
                        }
                    }
                });
        

            } else {
                document.querySelector(".chartblock").innerHTML = 
                '<span class="title">Error</span><p>De regen grafiek kon helaas niet geladen worden in verband met een error bij OpenWeatherMap.</p>';
            }
            if (data.alerts) {
                document.querySelector(".notificationblock").style.display = "block";
                document.querySelector(".inner-notificationblock").innerHTML = `
                <div class="alerts_title">Waarschuwing van ${data.alerts[0].sender_name}</div>
                <div class="alerts_event">${data.alerts[0].event}:</div>
                <br>
                <div class="alerts_description">${data.alerts[0].description}</div>
                <br>
                <div class="alerts_date"> Deze waarschuwing geldt van:<br>${new Date(NulltoZero(data.alerts[0].start) * 1000).toLocaleDateString('nl-NL', alerttimeformat)}, tot:<br>${new Date(NulltoZero(data.alerts[0].end) * 1000).toLocaleDateString('nl-NL', alerttimeformat)}</div>
                `;
            }
            })
}

//Function to convert null value recieved from the api to display 0 for the user to read '0 mm'
function NulltoZero(vrain){
    if(vrain == null){
        return '0';
    } return vrain;
};

//Function to choose the correct icon according to the windspeed
function windspeedtoicon(vwindspeed) {
    if(vwindspeed >= 0 && vwindspeed < 0.2){
        var val = 'winddirectionicon0'
    }else if(vwindspeed >= 0.2 && vwindspeed < 3.4){
        var val = 'winddirectionicon1';
    }else if(vwindspeed >= 3.4 && vwindspeed < 8){
        var val = 'winddirectionicon2';
    }else if(vwindspeed >= 8){
        var val = 'winddirectionicon3';
    }else if(vwindspeed = null){
        var val = 'winddirectionicon0'
    }
    return val;
}

// Gives the correct month names per month value
Date.prototype.monthName = function() {
    const monthsOfYear = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    return monthsOfYear[this.getMonth()];
}
  
// Gives the correct day names per day value
Date.prototype.dayName = function() {
    const daysOfWeek = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
    return daysOfWeek[this.getDay()];
}

// Function that requests current date and time and converts it to a usable format
function realtimeClock() {
    const now = new Date(),
    today = now.dayName(),
    year = now.getFullYear(),
    month = now.monthName(),
    day = now.getDate(),
    secs = ('0' + now.getSeconds()).slice(-2),
    mins = ('0' + now.getMinutes()).slice(-2),
    hours = now.getHours();

    //Change the date and time element to the current time and date
    document.querySelector(".currentdate").innerHTML = `${today} ${day} ${month} ${year}`;
    document.querySelector(".currenttime").innerHTML = `${hours}:${mins}:${secs}`;
  
    requestAnimationFrame(realtimeClock);
};

//Constantly refreshes the realtimeclock  
requestAnimationFrame(realtimeClock);

document.querySelector(".closeButton").addEventListener('click', function(e) {
    e.preventDefault();
    this.parentNode.style.display = 'none';
}, false);