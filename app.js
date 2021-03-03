

const form = document.querySelector('#ipForm');
const ipAddress = document.querySelector('#ipAdrress');
const error = document.querySelector('#error');

const ipvalue = document.querySelector("#ipvalue");
const locationvalue = document.querySelector("#locationvalue");
const timezonevalue = document.querySelector("#timezonevalue");
const ispvalue = document.querySelector("#ispvalue");




//map view setup
var mymap = L.map('mapid').setView([39.3999, 8.2245], 2.5);

const MAP_ACCESS_TOKEN = 'pk.eyJ1IjoibmVoYWxiMDAxIiwiYSI6ImNrbHMycXhmMzA2NDAyb28zaHQ4dW1mcmgifQ.01GaOQ1RmVWo9CokWnFD1g'

L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${MAP_ACCESS_TOKEN}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: MAP_ACCESS_TOKEN
}).addTo(mymap);


//map on click
mymap.on('click', function (e) {
    mymap.panTo(e.latlng, { animate: true, duration: 2.0 });
    console.log(e.latlng)
});

//populatedetails
const populateDetails = (data) => {

    ipvalue.innerHTML = data.ip;
    locationvalue.innerHTML = data.location.city;
    timezonevalue.innerHTML = "UTC " + data.location.timezone;
    ispvalue.innerHTML = data.isp;
}

const clearDetails = () => {
    ipvalue.innerHTML = "-";
    locationvalue.innerHTML = "-";
    timezonevalue.innerHTML = "-";
    ispvalue.innerHTML = "-";
}


//set map coordinates
const setMapView = (data) => {

    const { lat, lng } = data.location;

    const coordinates = {
        lat: lat,
        lng: lng
    }

    populateDetails(data)
    mymap.flyTo(coordinates, 16, { duration: 4.0, noStartMove: true })

   

  

    var myIcon = L.icon({
        iconUrl: './images/icon-location.svg',
        iconSize: [22, 35],
        iconAnchor: [11, 35],
        popupAnchor: [-3, -76],
      
    });
    
    L.marker(coordinates, {icon: myIcon}).addTo(mymap);


}


//get client location
const getClientIpAddress = () => {
    axios.get('https://geo.ipify.org/api/v1?apiKey=at_KSeo0bEwxSxOo5o7HJTuKW3zuxRMB')
        .then(response => {
          //  console.log(response.data)

            setMapView(response.data)
        })
}





const ValidateIPaddress = (ipaddress) => {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return (true)
    }

    return (false)
}

//form submit event
form.addEventListener('submit', event => {
    event.preventDefault();
    error.style.display = "none"
    error.innerHTML = null;

    //console.log(ipAddress.value);

    const isIP = ValidateIPaddress(ipAddress.value)
    let append = `ipAddress=${ipAddress.value}`
    if (!isIP) {
        append = `domain=${ipAddress.value}`
    }
    axios.get(`https://geo.ipify.org/api/v1?apiKey=at_KSeo0bEwxSxOo5o7HJTuKW3zuxRMB&${append}`)
        .then(response => {
           // console.log(response.data)

            setMapView(response.data)
        }).catch(err => {
            console.log(err.response)
            error.style.display = "block"
            error.innerHTML = err.response.data.messages;
        })

})


getClientIpAddress()