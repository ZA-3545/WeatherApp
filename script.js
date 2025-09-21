
async function getWeather() {
    const result=document.getElementById("result")
    const userInput=document.getElementById("cityInput").value
    if(!userInput){
        result.innerHTML=`<p class="error">Please enter a city name</p>`
    }
    try{
    const GeoApi=`https://geocoding-api.open-meteo.com/v1/search?name=${userInput}`
    const geoResponse= await fetch(GeoApi)
    const geoData= await geoResponse.json()
    if(!geoData.results || geoData.results.length===0){
        result.innerHTML=`<p class="error"> city not found</p>`
       
    }
    const {latitude,longitude,name,country}=geoData.results[0]
    const WeatherApi=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&current=precipitation,apparent_temperature,is_day,weather_code,wind_speed_10m,temperature_2m,cloud_cover,rain,showers,snowfall`
    const weatherResponse=await fetch(WeatherApi)
    const weatherData=await weatherResponse.json()
    const current=weatherData.current
    const temperature=current?.temperature_2m
    const windspeed=current?.wind_speed_10m
    const weatherCode=current?.weather_code
    const is_day= current?.is_day
    const apparent_temperature=current?.apparent_temperature
    const {cls,desc}=changeBack(weatherCode,is_day)
    document.querySelector('body').className=cls
    result.innerHTML=`<h2>${name},${country}</h2>
    <p>🌡️Temperature:${temperature}°C (Feel like ${apparent_temperature}°C)</p>
    <p>☁️Conditon : ${desc}</p>
    <p>🍃Wind speed : ${windspeed} m/s</p>
    <p>${is_day? `Day`:`Night`}</p>`
    
    }
    catch(error){
        console.log(error)
    }
  
}
function changeBack(code,is_day){
    let cls=''
    let desc= ''
    if(code===0){
        cls=is_day ? 'sunny-day' :'sunny-night'
        desc="Clear sky"
    }
    else if(code ===1 || code ===2 ||code==3 || code===45||code===48){
        cls = is_day ? 'cloudy-day' :'cloudy-night'
        desc='Cloudy/fog'
    }
    else if(code ===51 || code ===53 ||code==55 ||code==61 ||code==63 || code===65){
        cls = is_day ? 'rainy-day' :'rainy-night'
        desc='Rain'
    }
    else if(code ===71 || code ===73 ||code==80 ||code==85 ||code==86 || code===75){
        cls = is_day ? 'snowy-day' :'snowy-night'
        desc='Snow'
    }
    return {cls,desc}
}