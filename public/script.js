const searchElem = document.querySelector('.search-container > input');
const searchBox = new google.maps.places.SearchBox(searchElem);

document.querySelector('.forecast-btn').addEventListener('click', () => {
  document.querySelector('.forecast-content').classList.toggle('active');
  document.querySelector('.forecast-btn').classList.toggle('clicked');
})

searchBox.addListener('places_changed', () => {
  const place = searchBox.getPlaces()[0]
  if (place == null) return;
  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();
  fetch('/weather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      latitude: latitude,
      longitude: longitude
    })
  })
  .then(res => res.json())
  .then(data => {   
    setWeatherData(data, place);
    getForecast(data);
    document.querySelector('.forecast-btn').style.display = 'block';
  })
})

const dayGradient = 'linear-gradient(to bottom, #57c1eb 0%,#246fa8 100%)';
const nightGradient = 'linear-gradient(to bottom, #051b6b, #091761, #0b1357, #0c104d, #0c0c44)';

function setWeatherData(data, place) {
  locationStr = '';
  for (const item of place.address_components) {
    if ( (item.types.includes('locality')) || (item.types.includes('country')) ) {
      locationStr += item.long_name + ', ';
    }
  }
  locationStr = locationStr.slice(0, -2);

  document.querySelector('.location > span').textContent = locationStr;
  document.querySelector('.status').textContent = data.current.weather[0].main;
  document.querySelector('.wind-title').textContent = 'Wind';
  document.querySelector('.wind-value').textContent = data.current.wind_speed + ' MPS';
  document.querySelector('.humidity-title').textContent = 'Humidity';
  document.querySelector('.humidity-value').textContent = data.current.humidity + ' %';
  document.querySelector('.temperature').innerHTML = Math.round(data.current.temp) + '&#8451;';
  document.querySelector('.feels-like').innerHTML = 'Feels Like ' + Math.round(data.current.feels_like) + '&#8451;'; 
  document.querySelector('.icon').innerHTML = `<i class="wi ${selectIcon(data.current.weather[0].icon)}"></i>`
  console.log(data)
}


function selectIcon(icon) {
  let selectedIcon;
  switch (icon) {
    case '01d':
      selectedIcon = "wi-day-sunny"
      break;
    case '01n':
      selectedIcon = "wi-night-clear"
      break;
    case '02d':
    case '02n':
      selectedIcon = "wi-cloudy"
      break;
    case '03d':
    case '03n':
    case '04d':
    case '04n':
      selectedIcon = "wi-night-cloudy"
      break;
    case '09d':
    case '09n':
      selectedIcon = "wi-showers"
      break;
    case '10d':
    case '10n':
      selectedIcon = "wi-rain"
      break;
    case '11d':
    case '11n':
      selectedIcon = "wi-thunderstorm"
      break;
    case '13d':
    case '13n':
      selectedIcon = "wi-snow"
      break;
    case '50d':
    case '50n':
      selectedIcon = "wi-fog"
      break;
    default:
      selectedIcon = "wi-meteor"
  }
  return selectedIcon;
}

function getForecast(data) {
  const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  let day = new Date();
  let nextDay;
  for (let i = 1; i < 8; i++) {
    nextDay = new Date(day);
    day = nextDay;
    nextDay.setDate(day.getDate() + 1);
    document.getElementById(`day${i}`).querySelector('.item-header').textContent = week[nextDay.getDay()];
    document.getElementById(`day${i}`).querySelector('.item-info').innerHTML = 
    `<i class="wi ${selectIcon(data.daily[i].weather[0].icon)}"></i>${Math.round(data.daily[i].temp.max - data.daily[i].temp.min)}`+'&#8451;';
  }
}

