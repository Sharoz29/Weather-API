//Naming variables
const searchOptions = document.querySelector(".search-by");
const cityOption = document.querySelector(".city-name");
const zipcodeOption = document.querySelector(".city-zipcode");
const coordinatesOption = document.querySelector(".coordinates");
const loader = document.querySelector(".loader");
const search = document.querySelector(".search-bar");
const searchBar = document.querySelector(".search");
const searchIcon = document.querySelector(".icon");
const apiKey = "6651622f9959778d400f897e7975bec9";
const weatherDataContainer = document.querySelector(".data-container");
const errorcontainer = document.querySelector(".errors");
const errors = document.querySelector(".error-conatiner");
const optionSelector = document.querySelector(".cities");
const options = document.querySelectorAll(".option-city");
const cities = document.querySelectorAll(".city-option");
const other = document.querySelector(".other-option");
const cityContainer = document.querySelector(".city");

var id = 1;
var errorMsg;
var region;
var city;
var zipcode;
var coordinates;
var country;
var date;
var day;
var condition;
var image;
var temperatureC;
var temperatureF;
var pressure;
var humidity;
var windSpeed;
var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

//  user can view temprature both in centigrade and farenhite

//  user can switch between days to get detailed temprature of that day

//  each section of per day temprature show min max temprature of day

//  relavent images/icons will show the weather condition
//  area chart will show the complete temprature of a day with an interval of 3 hour

//Showing city options
const showOptions = function () {
  const data = document.querySelectorAll(".data");
  data.forEach((ds) => {
    ds.classList.add("hidden");
  });
  options.forEach((option) => {
    option.classList.remove("hidden");
  });
  search.classList.add("hidden");
  cityContainer.classList.remove("hidden");
};
optionSelector.addEventListener("mouseover", showOptions);

//Hiding city options
const hideOptions = function () {
  options.forEach((option) => {
    option.classList.add("hidden");
  });
};

cityContainer.addEventListener("mouseleave", function () {
  cityContainer.classList.add("hidden");
});

options.forEach((option) => {
  option.addEventListener("click", hideOptions);
});

//Showing the weather of given cities
cities.forEach((city) => {
  city.addEventListener("click", function () {
    const cityname = city.textContent;
    const data = document.querySelectorAll(".data");
    data.forEach((dataSet) => {
      dataSet.classList.add("hidden");
    });
    getWeather(cityname);
  });
});

//Showing search bar
other.addEventListener("click", function () {
  const data = document.querySelectorAll(".data");
  data.forEach((ds) => {
    ds.classList.add("hidden");
  });
  search.classList.remove("hidden");
});

//Searching using searchbar
searchOptions.addEventListener("click", toggleOptions);

function toggleOptions() {
  cityOption.classList.toggle("hidden");
  zipcodeOption.classList.toggle("hidden");
  coordinatesOption.classList.toggle("hidden");
}

cityOption.addEventListener("click", searchByCity);
zipcodeOption.addEventListener("click", searchByZipcode);
coordinatesOption.addEventListener("click", searchByCoordinates);

//Implementing loader
const displayLoader = function () {
  loader.style.display = "block";
};

const hideLoader = function () {
  loader.style.display = "none";
};

hideLoader();

function searchByCity() {
  searchOptions.classList.toggle("hidden");
  zipcodeOption.classList.toggle("hidden");
  coordinatesOption.classList.toggle("hidden");
}
function searchByZipcode() {
  searchOptions.classList.toggle("hidden");
  cityOption.classList.toggle("hidden");
  coordinatesOption.classList.toggle("hidden");
}
function searchByCoordinates() {
  searchOptions.classList.toggle("hidden");
  cityOption.classList.toggle("hidden");
  zipcodeOption.classList.toggle("hidden");
}

var input = searchBar.addEventListener("keypress", takeinput);

//1.  Retrieving correct information from the user
function takeinput(e) {
  if (e.key === "Enter") {
    if (!searchOptions.classList.contains("hidden")) {
      alert("Please select an option");
    }
    const data = document.querySelectorAll(".data");
    data.forEach((dataSet) => {
      dataSet.classList.add("hidden");
    });

    e.preventDefault();
    handleCityInput();
    handleZipcodeInput();
    handleCoordinatesInput();
    searchBar.value = "";
  }
}

const getWeather = function (city) {
  displayLoader();
  fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=0bf177da53c443f7a46143134230504&q=${city}&days=5&aqi=no&alerts=no`
  )
    .then((response) => {
      if (!response.ok) throw new Error(`Error with weather API`);
      return response.json();
    })
    .then((data) => {
      hideLoader();
      id++;
      renderData(data);
    })
    .catch((err) => {
      if (!cityOption.classList.contains("hidden")) {
        renderError(`Something went wrong💥💥 : Please enter correct City`);
      }
      if (!coordinatesOption.classList.contains("hidden")) {
        renderError(
          `Something went wrong💥💥 : Please enter correct coordinates`
        );
      }
      if (!zipcodeOption.classList.contains("hidden")) {
        renderError(`Something went wrong💥💥 : Please enter correct zipcode`);
      }
    });
};

const renderError = function (msg) {
  const errorHtml = `<span class="error">${msg}</span>`;
  errors.classList.remove("hidden");
  errorcontainer.insertAdjacentHTML("beforeend", errorHtml);
  hideLoader();
  errorMsg = document.querySelectorAll(".error");
};

const handleCityInput = function () {
  if (!cityOption.classList.contains("hidden")) {
    city = searchBar.value;
    getWeather(city);
  }
};

function handleZipcodeInput() {
  if (!zipcodeOption.classList.contains("hidden")) {
    zipcode = searchBar.value;
    getWeather(zipcode);
  }
}
function handleCoordinatesInput() {
  if (!coordinatesOption.classList.contains("hidden")) {
    coordinates = searchBar.value;
    getWeather(coordinates);
  }
}

const renderData = function (data) {
  const weatherData = data.current;
  const locationData = data.location;

  //getting timezone
  region = locationData.region;
  //Getting City
  city = locationData.name;

  //Getting Country
  country = locationData.country;

  //Getting Day
  const timeStamp = weatherData.last_updated_epoch;
  date = new Date(timeStamp * 1000);
  day = days[date.getDay()];

  //Getting condition
  const conditions = weatherData.condition;
  condition = conditions.text;

  //Getting weather image
  image = conditions.icon;

  //Getting temperature
  //1.  Temperature in celcuis
  temperatureC = weatherData.temp_c;
  //2.  Temperature in Farenheit
  temperatureF = weatherData.temp_f;

  //Getting pressure
  pressure = weatherData.pressure_mb;

  //Getting humidity
  humidity = weatherData.humidity;

  //Getting Wind speed
  windSpeed = weatherData.wind_mph;

  //Getting the forecast for next five days
  const forecastObj = data.forecast;
  const [...forecasts] = forecastObj.forecastday;

  //1.  Day#1
  const weather1 = forecasts[0];
  const timeStamp1 = weather1.date_epoch;
  var day1 = days[new Date(timeStamp1 * 1000).getDay()];

  var condition1 = weather1.day;
  var image1container = condition1.condition;
  var img1 = image1container.icon;

  var max1 = condition1.maxtemp_c;
  var min1 = condition1.mintemp_c;
  var maxf1 = condition1.maxtemp_f;
  var minf1 = condition1.mintemp_f;

  var hourArr1 = weather1.hour;

  var hone1 = hourArr1[0];
  var h1tempC1 = hone1.temp_c;
  var h1tempF1 = hone1.temp_f;
  var hone1Condition = hone1.condition;
  var hone1Logo = hone1Condition.icon;

  var hone3 = hourArr1[3];
  var h1tempC3 = hone3.temp_c;
  var h1tempF3 = hone3.temp_f;
  var hone3Condition = hone3.condition;
  var hone3Logo = hone3Condition.icon;

  var hone6 = hourArr1[6];
  var h1tempC6 = hone6.temp_c;
  var h1tempF6 = hone6.temp_f;
  var hone6Condition = hone6.condition;
  var hone6Logo = hone6Condition.icon;

  var hone9 = hourArr1[9];
  var h1tempC9 = hone9.temp_c;
  var h1tempF9 = hone9.temp_f;
  var hone9Condition = hone9.condition;
  var hone9Logo = hone9Condition.icon;

  var hone12 = hourArr1[12];
  var h1tempC12 = hone12.temp_c;
  var h1tempF12 = hone12.temp_f;
  var hone12Condition = hone12.condition;
  var hone12Logo = hone12Condition.icon;

  var hone15 = hourArr1[15];
  var h1tempC15 = hone15.temp_c;
  var h1tempF15 = hone15.temp_f;
  var hone15Condition = hone15.condition;
  var hone15Logo = hone15Condition.icon;

  var hone18 = hourArr1[18];
  var h1tempC18 = hone18.temp_c;
  var h1tempF18 = hone18.temp_f;
  var hone18Condition = hone18.condition;
  var hone18Logo = hone18Condition.icon;

  var hone21 = hourArr1[21];
  var h1tempC21 = hone21.temp_c;
  var h1tempF21 = hone21.temp_f;
  var hone21Condition = hone21.condition;
  var hone21Logo = hone21Condition.icon;

  //2.  Day#2
  const weather2 = forecasts[1];
  const timeStamp2 = weather2.date_epoch;
  var day2 = days[new Date(timeStamp2 * 1000).getDay()];
  var condition2 = weather2.day;
  var image2container = condition2.condition;
  var img2 = image2container.icon;

  var weatherCondition2 = image2container.text;

  var max2 = condition2.maxtemp_c;
  var min2 = condition2.mintemp_c;
  var maxf2 = condition1.maxtemp_f;
  var minf2 = condition1.mintemp_f;

  var avgTempC2 = condition2.avgtemp_c;
  var avgTempF2 = condition2.avgtemp_f;

  var hCondition2 = weather2.hour;
  var hCondition2Of1 = hCondition2[0];
  var pressure2 = hCondition2Of1.pressure_mb;
  var windSpeed2 = condition2.maxwind_mph;
  var humidity2 = condition2.avghumidity;

  var hourArr2 = weather2.hour;

  var htwo1 = hourArr2[0];
  var h2tempC1 = htwo1.temp_c;
  var h2tempF1 = htwo1.temp_f;
  var htwo1Condition = htwo1.condition;
  var htwo1Logo = htwo1Condition.icon;

  var htwo3 = hourArr2[3];
  var h2tempC3 = htwo3.temp_c;
  var h2tempF3 = htwo3.temp_f;
  var htwo3Condition = htwo3.condition;
  var htwo3Logo = htwo3Condition.icon;

  var htwo6 = hourArr2[6];
  var h2tempC6 = htwo6.temp_c;
  var h2tempF6 = htwo6.temp_f;
  var htwo6Condition = htwo6.condition;
  var htwo6Logo = htwo6Condition.icon;

  var htwo9 = hourArr2[9];
  var h2tempC9 = htwo9.temp_c;
  var h2tempF9 = htwo9.temp_f;
  var htwo9Condition = htwo9.condition;
  var htwo9Logo = htwo9Condition.icon;

  var htwo12 = hourArr2[12];
  var h2tempC12 = htwo12.temp_c;
  var h2tempF12 = htwo12.temp_f;
  var htwo12Condition = htwo12.condition;
  var htwo12Logo = htwo12Condition.icon;

  var htwo15 = hourArr2[15];
  var h2tempC15 = htwo15.temp_c;
  var h2tempF15 = htwo15.temp_f;
  var htwo15Condition = htwo15.condition;
  var htwo15Logo = htwo15Condition.icon;

  var htwo18 = hourArr2[18];
  var h2tempC18 = htwo18.temp_c;
  var h2tempF18 = htwo18.temp_f;
  var htwo18Condition = htwo18.condition;
  var htwo18Logo = htwo18Condition.icon;

  var htwo21 = hourArr2[21];
  var h2tempC21 = htwo21.temp_c;
  var h2tempF21 = htwo21.temp_f;
  var htwo21Condition = htwo21.condition;
  var htwo21Logo = htwo21Condition.icon;

  //3.  Day#3
  const weather3 = forecasts[2];
  const timeStamp3 = weather3.date_epoch;
  var day3 = days[new Date(timeStamp3 * 1000).getDay()];

  var condition3 = weather3.day;
  var image3container = condition3.condition;
  var img3 = image3container.icon;

  var max3 = condition3.maxtemp_c;
  var min3 = condition3.mintemp_c;
  var maxf3 = condition1.maxtemp_f;
  var minf3 = condition1.mintemp_f;

  var avgTempC3 = condition3.avgtemp_c;
  var avgTempF3 = condition3.avgtemp_f;

  var weatherCondition3 = image3container.text;

  var hCondition3 = weather3.hour;
  var hCondition3Of1 = hCondition3[0];
  var pressure3 = hCondition3Of1.pressure_mb;
  var windSpeed3 = condition3.maxwind_mph;
  var humidity3 = condition3.avghumidity;

  var hourArr3 = weather3.hour;

  var hthree1 = hourArr3[0];
  var h3tempC1 = hthree1.temp_c;
  var h3tempF1 = hthree1.temp_f;
  var hthree1Condition = hthree1.condition;
  var hthree1Logo = hthree1Condition.icon;

  var hthree3 = hourArr3[3];
  var h3tempC3 = htwo3.temp_c;
  var h3tempF3 = htwo3.temp_f;
  var hthree3Condition = hthree3.condition;
  var hthree3Logo = hthree3Condition.icon;

  var hthree6 = hourArr3[6];
  var h3tempC6 = hthree6.temp_c;
  var h3tempF6 = hthree6.temp_f;
  var hthree6Condition = hthree6.condition;
  var hthree6Logo = hthree6Condition.icon;

  var hthree9 = hourArr3[9];
  var h3tempC9 = hthree9.temp_c;
  var h3tempF9 = hthree9.temp_f;
  var hthree9Condition = hthree9.condition;
  var hthree9Logo = hthree9Condition.icon;

  var hthree12 = hourArr3[12];
  var h3tempC12 = hthree12.temp_c;
  var h3tempF12 = hthree12.temp_f;
  var hthree12Condition = hthree12.condition;
  var hthree12Logo = hthree12Condition.icon;

  var hthree15 = hourArr3[15];
  var h3tempC15 = hthree15.temp_c;
  var h3tempF15 = hthree15.temp_f;
  var hthree15Condition = hthree15.condition;
  var hthree15Logo = hthree15Condition.icon;

  var hthree18 = hourArr3[18];
  var h3tempC18 = hthree18.temp_c;
  var h3tempF18 = hthree18.temp_f;
  var hthree18Condition = hthree18.condition;
  var hthree18Logo = hthree18Condition.icon;

  var hthree21 = hourArr3[21];
  var h3tempC21 = hthree21.temp_c;
  var h3tempF21 = hthree21.temp_f;
  var hthree21Condition = hthree21.condition;
  var hthree21Logo = hthree21Condition.icon;

  //4.  Day#4
  const weather4 = forecasts[3];
  const timeStamp4 = weather4.date_epoch;
  var day4 = days[new Date(timeStamp4 * 1000).getDay()];

  var condition4 = weather4.day;
  var image4container = condition4.condition;
  var img4 = image4container.icon;

  var max4 = condition4.maxtemp_c;
  var min4 = condition4.mintemp_c;
  var maxf4 = condition1.maxtemp_f;
  var minf4 = condition1.mintemp_f;

  var avgTempC4 = condition4.avgtemp_c;
  var avgTempF4 = condition4.avgtemp_f;

  var weatherCondition4 = image4container.text;

  var hCondition4 = weather4.hour;
  var hCondition4Of1 = hCondition4[0];
  var pressure4 = hCondition4Of1.pressure_mb;
  var windSpeed4 = condition4.maxwind_mph;
  var humidity4 = condition4.avghumidity;

  var hourArr4 = weather4.hour;

  var hfour1 = hourArr4[0];
  var hfour1Condition = hfour1.condition;
  var hfour1Logo = hfour1Condition.icon;

  var h4tempC1 = hfour1.temp_c;
  var h4tempF1 = hfour1.temp_f;

  var hfour3 = hourArr4[3];
  var h4tempC3 = hfour3.temp_c;
  var h4tempF3 = hfour3.temp_f;
  var hfour3Condition = hfour3.condition;
  var hfour3Logo = hfour3Condition.icon;

  var hfour6 = hourArr4[6];
  var h4tempC6 = hfour6.temp_c;
  var h4tempF6 = hfour6.temp_f;
  var hfour6Condition = hfour6.condition;
  var hfour6Logo = hfour6Condition.icon;

  var hfour9 = hourArr4[9];
  var h4tempC9 = hfour9.temp_c;
  var h4tempF9 = hfour9.temp_f;
  var hfour9Condition = hfour9.condition;
  var hfour9Logo = hfour9Condition.icon;

  var hfour12 = hourArr4[12];
  var h4tempC12 = hfour12.temp_c;
  var h4tempF12 = hfour12.temp_f;
  var hfour12Condition = hfour12.condition;
  var hfour12Logo = hfour12Condition.icon;

  var hfour15 = hourArr4[15];
  var h4tempC15 = hfour15.temp_c;
  var h4tempF15 = hfour15.temp_f;
  var hfour15Condition = hfour15.condition;
  var hfour15Logo = hfour15Condition.icon;

  var hfour18 = hourArr4[18];
  var h4tempC18 = hfour18.temp_c;
  var h4tempF18 = hfour18.temp_f;
  var hfour18Condition = hfour18.condition;
  var hfour18Logo = hfour18Condition.icon;

  var hfour21 = hourArr4[21];
  var h4tempC21 = hfour21.temp_c;
  var h4tempF21 = hfour21.temp_f;
  var hfour21Condition = hfour21.condition;
  var hfour21Logo = hfour21Condition.icon;

  //5.  Day#5
  const weather5 = forecasts[4];
  const timeStamp5 = weather5.date_epoch;
  var day5 = days[new Date(timeStamp5 * 1000).getDay()];

  var condition5 = weather5.day;
  var image5container = condition5.condition;
  var img5 = image5container.icon;

  var max5 = condition5.maxtemp_c;
  var min5 = condition5.mintemp_c;
  var maxf5 = condition1.maxtemp_f;
  var minf5 = condition1.mintemp_f;

  var avgTempC5 = condition5.avgtemp_c;
  var avgTempF5 = condition5.avgtemp_f;

  var weatherCondition5 = image5container.text;

  var hCondition5 = weather5.hour;
  var hCondition5Of1 = hCondition5[0];
  var pressure5 = hCondition5Of1.pressure_mb;
  var windSpeed5 = condition5.maxwind_mph;
  var humidity5 = condition5.avghumidity;

  var hourArr5 = weather5.hour;

  var hfive1 = hourArr5[0];
  var h5tempC1 = hfive1.temp_c;
  var h5tempF1 = hfive1.temp_f;
  var hfive1Condition = hfive1.condition;
  var hfive1Logo = hfive1Condition.icon;

  var hfive3 = hourArr5[3];
  var h5tempC3 = hfive3.temp_c;
  var h5tempF3 = hfive3.temp_f;
  var hfive3Condition = hfive3.condition;
  var hfive3Logo = hfive3Condition.icon;

  var hfive6 = hourArr5[6];
  var h5tempC6 = hfive6.temp_c;
  var h5tempF6 = hfive6.temp_f;
  var hfive6Condition = hfive6.condition;
  var hfive6Logo = hfive6Condition.icon;

  var hfive9 = hourArr5[9];
  var h5tempC9 = hfive9.temp_c;
  var h5tempF9 = hfive9.temp_f;
  var hfive9Condition = hfive9.condition;
  var hfive9Logo = hfive9Condition.icon;

  var hfive12 = hourArr5[12];
  var h5tempC12 = hfive12.temp_c;
  var h5tempF12 = hfive12.temp_f;
  var hfive12Condition = hfive12.condition;
  var hfive12Logo = hfive12Condition.icon;

  var hfive15 = hourArr5[15];
  var h5tempC15 = hfive15.temp_c;
  var h5tempF15 = hfive15.temp_f;
  var hfive15Condition = hfive15.condition;
  var hfive15Logo = hfive15Condition.icon;

  var hfive18 = hourArr5[18];
  var h5tempC18 = hfive18.temp_c;
  var h5tempF18 = hfive18.temp_f;
  var hfive18Condition = hfive18.condition;
  var hfive18Logo = hfive18Condition.icon;

  var hfive21 = hourArr5[21];
  var h5tempC21 = hfive21.temp_c;
  var h5tempF21 = hfive21.temp_f;
  var hfive21Condition = hfive21.condition;
  var hfive21Logo = hfive21Condition.icon;

  //Adding the html
  const html = `
  <div class="data" id ="${id}">
    <div class="data-title">
      <h2 class="title">${city}, ${country}</h2>
      <span class="day-main-${id}">${day}</span>
      <span class="weather-${id}">${condition}</span>
    </div>
    <div class="data-current">
      <div class="weather-pic">
        <img class="picture main-${id}" src="${image}" />
      </div>
      <div class="temperature">
        <span class="temp tempC-${id}">${temperatureC}</span>
        <span class = "temp tempF-${id} hidden">${temperatureF}</span>
        <span class="btn celcuis-${id}"> &#8451 </span>
        <span class="btn farenheit-${id}"> &#8457 </span>
      </div>
      <div class="info">
        <div class="pressure">
            <span class="pressure-title">Pressure: </span>
            <span class="pressure-info-${id}">${pressure} hPa</span>
        </div>
        <div class="humidity">
            <span class="humidity-title">Humidity: </span>
            <span class="humidity-info-${id}">${humidity}%</span>
        </div>
        <div class="wind-speed">
            <span class="wind-speed-title">Wind Speed</span>
            <span class="wind-speed-info-${id}">${windSpeed} mph</span>
        </div>
      </div>
    </div>
    <div class="hours">
      <div class="hour hour1">
          <div class="hour-title">00</div>
          <img class="l hour-logo-1-${id}" src="${hone1Logo}">
          <div class="hour-temperatureC-1-${id} htempC">${h1tempC1}⁰</div>
          <div class="hour-temperatureF-1-${id} htempF hidden">${h1tempF1}⁰</div>
      </div>
      <div class="hour hour2">
          <div class="hour-title">03</div>
          <img class="l hour-logo-3-${id}" src="${hone3Logo}">
          <div class="hour-temperatureC-3-${id} htempC">${h1tempC3}⁰</div>
          <div class="hour-temperatureF-3-${id} htempF hidden">${h1tempF3}⁰</div>
      </div>
      <div class="hour hour3">
          <div class="hour-title">06</div>
          <img class="l hour-logo-6-${id}" src="${hone6Logo}">
          <div class="hour-temperatureC-6-${id} htempC">${h1tempC6}⁰</div>
          <div class="hour-temperatureF-6-${id} htempF hidden">${h1tempF6}⁰</div>
      </div>
      <div class="hour hour4">
          <div class="hour-title">09</div>
          <img class="l hour-logo-9-${id}" src="${hone9Logo}">
          <div class="hour-temperatureC-9-${id} htempC">${h1tempC9}⁰</div>
          <div class="hour-temperatureF-9-${id} htempF hidden">${h1tempF9}⁰</div>
      </div>
      <div class="hour hour5">
          <div class="hour-title">12</div>
          <img class="l hour-logo-12-${id}" src="${hone12Logo}">
          <div class="hour-temperatureC-12-${id} htempC">${h1tempC12}⁰</div>
          <div class="hour-temperatureF-12-${id} htempF hidden">${h1tempF12}⁰</div>
      </div>
      <div class="hour hour6">
          <div class="hour-title">15</div>
          <img class="l hour-logo-15-${id}" src="${hone15Logo}">
          <div class="hour-temperatureC-15-${id} htempC">${h1tempC15}⁰</div>
          <div class="hour-temperatureF-15-${id} htempF hidden">${h1tempF15}⁰</div>
      </div>
      <div class="hour hour7">
          <div class="hour-title">18</div>
          <img class="l hour-logo-18-${id}" src="${hone18Logo}">
          <div class="hour-temperatureC-18-${id} htempC">${h1tempC18}⁰</div>
          <div class="hour-temperatureF-18-${id} htempF hidden">${h1tempF18}⁰</div>
      </div>
      <div class="hour hour8">
          <div class="hour-title">21</div>
          <img class="l hour-logo-21-${id}" src="${hone21Logo}">
           <div class="hour-temperatureC-21-${id} htempC">${h1tempC21}⁰</div>
          <div class="hour-temperatureF-21-${id} htempF hidden">${h1tempF21}⁰</div>
      </div>
    </div>
    <div class="five-day-data">
        <div class="day day-1-${id}">
            <div class="day-name">${day1}</div>
            <img class="picture" src="${image}">
            <div class="temp-diff">
                <span class="lowestC">${min1} ⁰</span>
                <span class="highestC">${max1} ⁰</span>
                <span class = "lowestF hidden">${minf1} ⁰</span>
                <span class = "highestF hidden">${maxf1} ⁰</span>
                
            </div>

            
        </div>
        <div class="day day-2-${id}">
            <div class="day-name">${day2}</div>
            <img class="picture" src="${img2}">
            <div class="temp-diff">
                <span class="lowestC">${min2} ⁰</span>
                <span class="highestC">${max2} ⁰</span>
                <span class = "lowestF hidden">${minf2} ⁰</span>
                <span class = "highestF hidden">${maxf2} ⁰</span>
            </div>

            
        </div>
        <div class="day day-3-${id}">
            <div class="day-name">${day3}</div>
            <img class="picture" src="${img3}">
            <div class="temp-diff">
                <span class="lowestC">${min3} ⁰</span>
                <span class="highestC">${max3} ⁰</span>
                <span class = "lowestF hidden">${minf3} ⁰</span>
                <span class = "highestF hidden">${maxf3} ⁰</span>
            </div>

            
        </div>
        <div class="day day-4-${id}">
            <div class="day-name">${day4}</div>
            <img class="picture" src="${img4}">
            <div class="temp-diff">
                <span class="lowestC">${min4} ⁰</span>
                <span class="highestC">${max4} ⁰</span>
                <span class = "lowestF hidden">${minf4} ⁰</span>
                <span class = "highestF hidden">${maxf4} ⁰</span>
            </div>


        </div>
        <div class="day day-5-${id}">
            <div class="day-name">${day5}</div>
            <img class="picture" src="${img5}">
            <div class="temp-diff">
                <span class="lowestC">${min5} ⁰</span>
                <span class="highestC">${max5} ⁰</span>
                <span class = "lowestF hidden">${minf5} ⁰</span>
                <span class = "highestF hidden">${maxf5} ⁰</span>
            </div>
        </div>
    </div>
  </div>`;
  weatherDataContainer.insertAdjacentHTML("beforeend", html);

  //Selecting the temperature btns
  const celcuisBtn = document.querySelector(`.celcuis-${id}`);
  const farenheitBtn = document.querySelector(`.farenheit-${id}`);

  //Selecting main content
  const tempC = document.querySelector(`.tempC-${id}`);
  const tempF = document.querySelector(`.tempF-${id}`);
  const tempsLowestC = document.querySelectorAll(".lowestC");
  const tempsLowestF = document.querySelectorAll(".lowestF");
  const tempHighestC = document.querySelectorAll(".highestC");
  const tempHighestF = document.querySelectorAll(".highestF");
  const hourTempC = document.querySelectorAll(".htempC");
  const hourTempF = document.querySelectorAll(".htempF");

  //Selecting hour content
  //1.  hours
  const hour1Logo = document.querySelector(`.hour-logo-1-${id}`);
  const hour3Logo = document.querySelector(`.hour-logo-3-${id}`);
  const hour6Logo = document.querySelector(`.hour-logo-6-${id}`);
  const hour9Logo = document.querySelector(`.hour-logo-9-${id}`);
  const hour12Logo = document.querySelector(`.hour-logo-12-${id}`);
  const hour15Logo = document.querySelector(`.hour-logo-15-${id}`);
  const hour18Logo = document.querySelector(`.hour-logo-18-${id}`);
  const hour21Logo = document.querySelector(`.hour-logo-21-${id}`);
  //2.  hourly celcius
  const hour1C = document.querySelector(`.hour-temperatureC-1-${id}`);
  const hour3C = document.querySelector(`.hour-temperatureC-3-${id}`);
  const hour6C = document.querySelector(`.hour-temperatureC-6-${id}`);
  const hour9C = document.querySelector(`.hour-temperatureC-9-${id}`);
  const hour12C = document.querySelector(`.hour-temperatureC-12-${id}`);
  const hour15C = document.querySelector(`.hour-temperatureC-15-${id}`);
  const hour18C = document.querySelector(`.hour-temperatureC-18-${id}`);
  const hour21C = document.querySelector(`.hour-temperatureC-21-${id}`);
  //3.  hourly farenheit
  const hour1F = document.querySelector(`.hour-temperatureF-1-${id}`);
  const hour3F = document.querySelector(`.hour-temperatureF-3-${id}`);
  const hour6F = document.querySelector(`.hour-temperatureF-6-${id}`);
  const hour9F = document.querySelector(`.hour-temperatureF-9-${id}`);
  const hour12F = document.querySelector(`.hour-temperatureF-12-${id}`);
  const hour15F = document.querySelector(`.hour-temperatureF-15-${id}`);
  const hour18F = document.querySelector(`.hour-temperatureF-18-${id}`);
  const hour21F = document.querySelector(`.hour-temperatureF-21-${id}`);

  //Switching temperatures between celcuis and farenheit
  celcuisBtn.addEventListener("click", function () {
    celcuisBtn.classList.add("selected");
    farenheitBtn.classList.remove("selected");
    tempC.classList.remove("hidden");
    tempF.classList.add("hidden");
    tempsLowestC.forEach((temp) => {
      temp.classList.remove("hidden");
    });
    tempHighestC.forEach((temp) => {
      temp.classList.remove("hidden");
    });
    tempsLowestF.forEach((temp) => {
      temp.classList.add("hidden");
    });
    tempHighestF.forEach((temp) => {
      temp.classList.add("hidden");
    });
    hourTempC.forEach((temp) => {
      temp.classList.remove("hidden");
    });
    hourTempF.forEach((temp) => {
      temp.classList.add("hidden");
    });
  });
  farenheitBtn.addEventListener("click", function () {
    celcuisBtn.classList.remove("selected");
    farenheitBtn.classList.add("selected");
    tempF.classList.remove("hidden");
    tempC.classList.add("hidden");
    tempsLowestF.forEach((temp) => {
      temp.classList.remove("hidden");
    });
    tempHighestF.forEach((temp) => {
      temp.classList.remove("hidden");
    });
    tempsLowestC.forEach((temp) => {
      temp.classList.add("hidden");
    });
    tempHighestC.forEach((temp) => {
      temp.classList.add("hidden");
    });
    hourTempF.forEach((temp) => {
      temp.classList.remove("hidden");
    });
    hourTempC.forEach((temp) => {
      temp.classList.add("hidden");
    });
  });

  //Selecting main area
  const selectedDay = document.querySelector(`.day-main-${id}`);
  const selectedCondition = document.querySelector(`.weather-${id}`);
  const selectedPicture = document.querySelector(`.main-${id}`);
  const selectedCelcius = document.querySelector(`.tempC-${id}`);
  const selectedFarenheit = document.querySelector(`.tempF-${id}`);
  const selectedPressure = document.querySelector(`.pressure-info-${id}`);
  const selectedHumidity = document.querySelector(`.humidity-info-${id}`);
  const selectedWindSpeed = document.querySelector(`.wind-speed-info-${id}`);

  //Toggling day1
  const selectedDay1 = document.querySelector(`.day-1-${id}`);
  selectedDay1.addEventListener("click", function () {
    selectedDay.textContent = day;
    selectedCondition.textContent = condition;
    selectedPicture.removeAttribute("src");
    selectedPicture.setAttribute("src", image);
    selectedCelcius.textContent = temperatureC;
    selectedFarenheit.textContent = temperatureF;
    selectedPressure.textContent = `${pressure} hPa`;
    selectedHumidity.textContent = `${humidity}%`;
    selectedWindSpeed.textContent = `${windSpeed} mph`;
    //Hourly
    //1.  Logo
    hour1Logo.removeAttribute("src");
    hour1Logo.setAttribute("src", hone1Logo);
    hour3Logo.removeAttribute("src");
    hour3Logo.setAttribute("src", hone3Logo);
    hour6Logo.removeAttribute("src");
    hour6Logo.setAttribute("src", hone6Logo);
    hour9Logo.removeAttribute("src");
    hour9Logo.setAttribute("src", hone9Logo);
    hour12Logo.removeAttribute("src");
    hour12Logo.setAttribute("src", hone12Logo);
    hour15Logo.removeAttribute("src");
    hour15Logo.setAttribute("src", hone15Logo);
    hour18Logo.removeAttribute("src");
    hour18Logo.setAttribute("src", hone18Logo);
    hour21Logo.removeAttribute("src");
    hour21Logo.setAttribute("src", hone21Logo);

    //2.  Celcuis Temperature
    hour1C.textContent = `${h1tempC1}⁰`;
    hour3C.textContent = `${h1tempC3}⁰`;
    hour6C.textContent = `${h1tempC6}⁰`;
    hour9C.textContent = `${h1tempC9}⁰`;
    hour12C.textContent = `${h1tempC12}⁰`;
    hour15C.textContent = `${h1tempC15}⁰`;
    hour18C.textContent = `${h1tempC18}⁰`;
    hour21C.textContent = `${h1tempC21}⁰`;
    //3.  Farenheit Temperature
    hour1F.textContent = `${h1tempF1}⁰`;
    hour3F.textContent = `${h1tempF3}⁰`;
    hour6F.textContent = `${h1tempF6}⁰`;
    hour9F.textContent = `${h1tempF9}⁰`;
    hour12F.textContent = `${h1tempF12}⁰`;
    hour15F.textContent = `${h1tempF15}⁰`;
    hour18F.textContent = `${h1tempF18}⁰`;
    hour21F.textContent = `${h1tempF21}⁰`;
  });

  //Toggling day2
  const selectedDay2 = document.querySelector(`.day-2-${id}`);
  selectedDay2.addEventListener("click", function () {
    selectedDay.textContent = day2;
    selectedCondition.textContent = weatherCondition2;
    selectedPicture.removeAttribute("src");
    selectedPicture.setAttribute("src", img2);
    selectedCelcius.textContent = avgTempC2;
    selectedFarenheit.textContent = avgTempF2;
    selectedPressure.textContent = `${pressure2} hPa`;
    selectedHumidity.textContent = `${humidity2}%`;
    selectedWindSpeed.textContent = `${windSpeed2} mph`;
    //Hourly
    //1.  Logo
    hour1Logo.removeAttribute("src");
    hour1Logo.setAttribute("src", htwo1Logo);
    hour3Logo.removeAttribute("src");
    hour3Logo.setAttribute("src", htwo3Logo);
    hour6Logo.removeAttribute("src");
    hour6Logo.setAttribute("src", htwo6Logo);
    hour9Logo.removeAttribute("src");
    hour9Logo.setAttribute("src", htwo9Logo);
    hour12Logo.removeAttribute("src");
    hour12Logo.setAttribute("src", htwo12Logo);
    hour15Logo.removeAttribute("src");
    hour15Logo.setAttribute("src", htwo15Logo);
    hour18Logo.removeAttribute("src");
    hour18Logo.setAttribute("src", htwo18Logo);
    hour21Logo.removeAttribute("src");
    hour21Logo.setAttribute("src", htwo21Logo);
    //2.  Celcuis Temperature
    hour1C.textContent = `${h2tempC1}⁰`;
    hour3C.textContent = `${h2tempC3}⁰`;
    hour6C.textContent = `${h2tempC6}⁰`;
    hour9C.textContent = `${h2tempC9}⁰`;
    hour12C.textContent = `${h2tempC12}⁰`;
    hour15C.textContent = `${h2tempC15}⁰`;
    hour18C.textContent = `${h2tempC18}⁰`;
    hour21C.textContent = `${h2tempC21}⁰`;
    //3.  Farenheit Temperature
    hour1F.textContent = `${h2tempF1}⁰`;
    hour3F.textContent = `${h2tempF3}⁰`;
    hour6F.textContent = `${h2tempF6}⁰`;
    hour9F.textContent = `${h2tempF9}⁰`;
    hour12F.textContent = `${h2tempF12}⁰`;
    hour15F.textContent = `${h2tempF15}⁰`;
    hour18F.textContent = `${h2tempF18}⁰`;
    hour21F.textContent = `${h2tempF21}⁰`;
  });

  //toggling day3
  const selectedDay3 = document.querySelector(`.day-3-${id}`);
  selectedDay3.addEventListener("click", function () {
    selectedDay.textContent = day3;
    selectedCondition.textContent = weatherCondition3;
    selectedPicture.removeAttribute("src");
    selectedPicture.setAttribute("src", img3);
    selectedCelcius.textContent = avgTempC3;
    selectedFarenheit.textContent = avgTempF3;
    selectedPressure.textContent = `${pressure3} hPa`;
    selectedHumidity.textContent = `${humidity3}%`;
    selectedWindSpeed.textContent = `${windSpeed3} mph`;
    //Hourly
    //1.  Logo
    hour1Logo.removeAttribute("src");
    hour1Logo.setAttribute("src", hthree1Logo);
    hour3Logo.removeAttribute("src");
    hour3Logo.setAttribute("src", hthree3Logo);
    hour6Logo.removeAttribute("src");
    hour6Logo.setAttribute("src", hthree6Logo);
    hour9Logo.removeAttribute("src");
    hour9Logo.setAttribute("src", hthree9Logo);
    hour12Logo.removeAttribute("src");
    hour12Logo.setAttribute("src", hthree12Logo);
    hour15Logo.removeAttribute("src");
    hour15Logo.setAttribute("src", hthree15Logo);
    hour18Logo.removeAttribute("src");
    hour18Logo.setAttribute("src", hthree18Logo);
    hour21Logo.removeAttribute("src");
    hour21Logo.setAttribute("src", hthree21Logo);
    //2.  Celcuis Temperature
    hour1C.textContent = `${h3tempC1}⁰`;
    hour3C.textContent = `${h3tempC3}⁰`;
    hour6C.textContent = `${h3tempC6}⁰`;
    hour9C.textContent = `${h3tempC9}⁰`;
    hour12C.textContent = `${h3tempC12}⁰`;
    hour15C.textContent = `${h3tempC15}⁰`;
    hour18C.textContent = `${h3tempC18}⁰`;
    hour21C.textContent = `${h3tempC21}⁰`;
    //3.  Farenheit Temperature
    hour1F.textContent = `${h3tempF1}⁰`;
    hour3F.textContent = `${h3tempF3}⁰`;
    hour6F.textContent = `${h3tempF6}⁰`;
    hour9F.textContent = `${h3tempF9}⁰`;
    hour12F.textContent = `${h3tempF12}⁰`;
    hour15F.textContent = `${h3tempF15}⁰`;
    hour18F.textContent = `${h3tempF18}⁰`;
    hour21F.textContent = `${h3tempF21}⁰`;
  });

  //Toggling day 4
  const selectedDay4 = document.querySelector(`.day-4-${id}`);
  selectedDay4.addEventListener("click", function () {
    selectedDay.textContent = day4;
    selectedCondition.textContent = weatherCondition4;
    selectedPicture.removeAttribute("src");
    selectedPicture.setAttribute("src", img4);
    selectedCelcius.textContent = avgTempC4;
    selectedFarenheit.textContent = avgTempF4;
    selectedPressure.textContent = `${pressure4} hPa`;
    selectedHumidity.textContent = `${humidity4}%`;
    selectedWindSpeed.textContent = `${windSpeed4} mph`;
    //Hourly
    //1.  Logo
    hour1Logo.removeAttribute("src");
    hour1Logo.setAttribute("src", hfour1Logo);
    hour3Logo.removeAttribute("src");
    hour3Logo.setAttribute("src", hfour3Logo);
    hour6Logo.removeAttribute("src");
    hour6Logo.setAttribute("src", hfour6Logo);
    hour9Logo.removeAttribute("src");
    hour9Logo.setAttribute("src", hfour9Logo);
    hour12Logo.removeAttribute("src");
    hour12Logo.setAttribute("src", hfour12Logo);
    hour15Logo.removeAttribute("src");
    hour15Logo.setAttribute("src", hfour15Logo);
    hour18Logo.removeAttribute("src");
    hour18Logo.setAttribute("src", hfour18Logo);
    hour21Logo.removeAttribute("src");
    hour21Logo.setAttribute("src", hfour21Logo);
    //2.  Celcuis Temperature
    hour1C.textContent = `${h4tempC1}⁰`;
    hour3C.textContent = `${h4tempC3}⁰`;
    hour6C.textContent = `${h4tempC6}⁰`;
    hour9C.textContent = `${h4tempC9}⁰`;
    hour12C.textContent = `${h4tempC12}⁰`;
    hour15C.textContent = `${h4tempC15}⁰`;
    hour18C.textContent = `${h4tempC18}⁰`;
    hour21C.textContent = `${h4tempC21}⁰`;
    //3.  Farenheit Temperature
    hour1F.textContent = `${h4tempF1}⁰`;
    hour3F.textContent = `${h4tempF3}⁰`;
    hour6F.textContent = `${h4tempF6}⁰`;
    hour9F.textContent = `${h4tempF9}⁰`;
    hour12F.textContent = `${h4tempF12}⁰`;
    hour15F.textContent = `${h4tempF15}⁰`;
    hour18F.textContent = `${h4tempF18}⁰`;
    hour21F.textContent = `${h4tempF21}⁰`;
  });

  //toggling day5
  const selectedDay5 = document.querySelector(`.day-5-${id}`);
  selectedDay5.addEventListener("click", function () {
    selectedDay.textContent = day5;
    selectedCondition.textContent = weatherCondition5;
    selectedPicture.removeAttribute("src");
    selectedPicture.setAttribute("src", img5);
    selectedCelcius.textContent = avgTempC5;
    selectedFarenheit.textContent = avgTempF5;
    selectedPressure.textContent = `${pressure5} hPa`;
    selectedHumidity.textContent = `${humidity5}%`;
    selectedWindSpeed.textContent = `${windSpeed5} mph`;
    //Hourly
    //1.  Logo
    hour1Logo.removeAttribute("src");
    hour1Logo.setAttribute("src", hfive1Logo);
    hour3Logo.removeAttribute("src");
    hour3Logo.setAttribute("src", hfive3Logo);
    hour6Logo.removeAttribute("src");
    hour6Logo.setAttribute("src", hfive6Logo);
    hour9Logo.removeAttribute("src");
    hour9Logo.setAttribute("src", hfive9Logo);
    hour12Logo.removeAttribute("src");
    hour12Logo.setAttribute("src", hfive12Logo);
    hour15Logo.removeAttribute("src");
    hour15Logo.setAttribute("src", hfive15Logo);
    hour18Logo.removeAttribute("src");
    hour18Logo.setAttribute("src", hfive18Logo);
    hour21Logo.removeAttribute("src");
    hour21Logo.setAttribute("src", hfive21Logo);
    //2.  Celcuis Temperature
    hour1C.textContent = `${h5tempC1}⁰`;
    hour3C.textContent = `${h5tempC3}⁰`;
    hour6C.textContent = `${h5tempC6}⁰`;
    hour9C.textContent = `${h5tempC9}⁰`;
    hour12C.textContent = `${h5tempC12}⁰`;
    hour15C.textContent = `${h5tempC15}⁰`;
    hour18C.textContent = `${h5tempC18}⁰`;
    hour21C.textContent = `${h5tempC21}⁰`;
    //3.  Farenheit Temperature
    hour1F.textContent = `${h5tempF1}⁰`;
    hour3F.textContent = `${h5tempF3}⁰`;
    hour6F.textContent = `${h5tempF6}⁰`;
    hour9F.textContent = `${h5tempF9}⁰`;
    hour12F.textContent = `${h5tempF12}⁰`;
    hour15F.textContent = `${h5tempF15}⁰`;
    hour18F.textContent = `${h5tempF18}⁰`;
    hour21F.textContent = `${h5tempF21}⁰`;
  });

  errors.classList.add("hidden");
  if (errorMsg) {
    errorMsg.forEach((msg) => {
      msg.classList.add("hidden");
    });
  }
};
