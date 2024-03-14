const userTab = document.querySelector("[user-weather]");
const searchTab = document.querySelector("[search-weather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loding-container");
const userInfoContainer = document.querySelector(".user-weatherInfo");


let currentTab = userTab;
const API_KEY = "3631a4d47d28020176a533300da12547";
currentTab.classList.add("current-tab");

getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // kya search form wala container is visible , if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // phle search walw tab pr tha, ab your weather tab visible krna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () =>{
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () =>{
    // pass clicked tab as input parameter
    switchTab(searchTab);
});

// check if cordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API CALL
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("Error Found");
    }

}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the element

    const cityName = document.querySelector(".location");
    const countyIcon = document.querySelector(".flag");
    const desc = document.querySelector(".weather-description");
    const weatherIcon = document.querySelector(".weatherIcon");
    const temp = document.querySelector(".temperature");
    const windSpeed = document.querySelector(".windValue");
    const humidity = document.querySelector(".humidityPercentage");
    const cloudiness = document.querySelector(".cloudPercentage");

    console.log(weatherInfo);

    // fetch values from  weatherIinfo object and put it UI element
    cityName.innerText = weatherInfo?.name;
    countyIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("GeoLocation Not Supported by Your Device");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grnatAccess]");

grantAccessButton.addEventListener("click", getLocation);

const serachInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = serachInput.value;

    if(cityName === "")
    {
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
        serachInput.value = "";
    }
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch(err){
        console.log("Error Generated during city fetching");
    }
}