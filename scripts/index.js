
//NASA API KEY h5E8aheS8MPMrpA86w2yngy57nckYZbhse70Hri4
//https://api.nasa.gov/insight_weather/?api_key=h5E8aheS8MPMrpA86w2yngy57nckYZbhse70Hri4&feedtype=json&ver=1.0

const API_KEY = "h5E8aheS8MPMrpA86w2yngy57nckYZbhse70Hri4"
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`
const SOL = 804;
const Picture_API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${API_KEY}`


const previousWeatherToggle = document.querySelector('.show-previous-weather')
const previousWeather = document.querySelector('.previous-weather')

const seasonNorthElement = document.querySelector('[data-season-north]')
const seasonSouthElement = document.querySelector('[data-season-south]')

const unitToggle = document.querySelector('[data-unit-toggle]')
const metricRadio = document.getElementById('cel')
const imperialRadio = document.getElementById('fah')

const currentSolElement = document.querySelector('[data-current-sol]')
const currentDateElement = document.querySelector('[data-current-date]')
const currentTempHighElement = document.querySelector('[data-current-temp-high]')
const currentTempLowElement = document.querySelector('[data-current-temp-low]')
const windSpeedElement = document.querySelector('[data-wind-speed]')
const windDirectionText = document.querySelector('[data-wind-direction-text]')
const windDirectionArrow = document.querySelector('[data-wind-direction-arrow]')

const previousSolTemplate = document.querySelector('[data-previous-sol-template]')
const previousSolContainer = document.querySelector('[data-previous-sols]')


previousWeatherToggle.addEventListener('click', ()=>{
    previousWeather.classList.toggle('show-weather')
})

let selectedSolIndex

let selectedPicutreIndex

let number = getRandomInt(0,4)

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

getPicture(number).then(data => {
    console.log(data)
    updatePicture(data);
})

function updatePicture(sol){
    const selectedPhoto = sol;
    console.log(selectedPhoto)
    document.querySelector('body').style.setProperty('background-image', `url(${selectedPhoto}`)
}

getWeather().then(sols => {
    selectedSolIndex = sols.length-1
    displaySelectedSols(sols)
    displayPreviousSols(sols)
    updateUnits();

    unitToggle.addEventListener('click', ()=>{
        let metricUnits = !isMetric()
        metricRadio.checked = metricUnits
        imperialRadio.checked = !metricUnits
        displaySelectedSols(sols)
    displayPreviousSols(sols)
        updateUnits()
    })

    metricRadio.addEventListener('change', ()=>{
        displaySelectedSols(sols)
        displayPreviousSols(sols)
        updateUnits();
    })

    imperialRadio.addEventListener('change', ()=>{
        displaySelectedSols(sols)
        displayPreviousSols(sols)
        updateUnits();
    })
})

function displaySelectedSols(sols){
const selectedSol = sols[selectedSolIndex]
console.log(selectedSol)
currentSolElement.innerText = selectedSol.sol
currentDateElement.innerText = displayDate(selectedSol.date)
currentTempHighElement.innerText = displayTemperature(selectedSol.maxTemp)
currentTempLowElement.innerText = displayTemperature(selectedSol.minTemp)
windSpeedElement.innerText = displaySpeed(selectedSol.windSpeed)
windDirectionArrow.style.setProperty('--direction', `${selectedSol.windDirectionDegrees}deg`)
windDirectionText.innerText = selectedSol.windDirectionCardinal
seasonNorthElement.innerText = selectedSol.seasonNorth
seasonSouthElement.innerText = selectedSol.seasonSouth
}

function displayPreviousSols(sols){
    previousSolContainer.innerHTML = '';
    sols.forEach((solData, index) =>{
        const solContainer = previousSolTemplate.content.cloneNode(true)
        solContainer.querySelector('[data-sol]').innerText = solData.sol
        solContainer.querySelector('[data-date]').innerText = displayDate(solData.date)
        solContainer.querySelector('[data-temp-high]').innerText = displayTemperature(solData.maxTemp)
        solContainer.querySelector('[data-temp-low]').innerText = displayTemperature(solData.minTemp)
        solContainer.querySelector('[data-select-button]').addEventListener('click', ()=>{
            selectedSolIndex = index
            displaySelectedSols(sols)
        })
        previousSolContainer.appendChild(solContainer)
    })
 
}

function getWeather() {
    return fetch(API_URL).then(res => res.json())
    .then(data => {
        const {
            sol_keys,
            validity_checks,
            ...solData
        } = data
        console.log(data)
       
        return temp = Object.entries(solData).map(([sol, data]) => {
            return {
                sol: sol,
                maxTemp: data.PRE.mx,
                minTemp: data.PRE.mn,
                windSpeed: 70,
                windDirectionDegrees: 90,
                windDirectionCardinal: 90,
                date: new Date(data.First_UTC),
                seasonNorth: data.Northern_season,
                seasonSouth: data.Southern_season
            }
        })

    })
}

function getPicture(number){
      return fetch(Picture_API_URL).then(res => res.json()).then(data=>{
        const{
            latest_photos
        } = data
        
        console.log(data.latest_photos[2].img_src)
        return data.latest_photos[number].img_src;
    })

    
}

getPicture(number);

function displayDate(date){
    return date.toLocaleDateString(
        undefined,
        { day: 'numeric', month: 'long'}
    )
}

function displayTemperature(temp){
    let returnTemp = temp
    if (!isMetric()){
        returnTemp = (temp - 32) * (5/9)
    }
    return Math.round(returnTemp)
}
function displaySpeed(speed){
    let returnSpeed = speed
    if (!isMetric()){
        returnSpeed = speed / 1.609
    }
    return Math.round(returnSpeed)
}

getWeather();

function updateUnits(){
    const speedUnits = document.querySelectorAll('[data-speed-unit')
    const tempUnits = document.querySelectorAll('[data-temp-unit')

    speedUnits.forEach(unit => {
        unit.innerText = isMetric() ? 'kph' : 'mph'
    })
    tempUnits.forEach(unit => {
        unit.innerText = isMetric() ? 'C' : 'F'
    })

}

function isMetric(){
    return metricRadio.checked;
}