import './App.css';
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import {Card , CardContent , Typography} from '@material-ui/core';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import About from './About';


function App() {

const [countries, setCountries] = useState([]);
const [country, setCountry] = useState('worldwide');
const [countryInfo, setcountryInfo] = useState({});
const [tableData, setTableData] = useState([]);
const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [zoom, setZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [isLoading, setLoading] = useState(false);

useEffect(()=>{
 fetch('https://disease.sh/v3/covid-19/all')
.then(response => response.json())
.then(data => {
  setcountryInfo(data);
})
},[])

useEffect(() => {
  const getCountriesData = async () => {
    await fetch('https://disease.sh/v3/covid-19/countries')
    .then((response)=> response.json())
    .then((data)=>{
      const countries = data.map((country)=> (
        {
          name: country.country,
          value: country.countryInfo.iso2
        }
      ));
      const sortedData= sortData(data)
      setTableData(sortedData);
      setCountries(countries);
      setMapCountries(data);
    })
  }
  getCountriesData();
},[]);

const onCountryChange= async (event) => {
  const countryCode = event.target.value;

  setCountry(countryCode);

  const url= countryCode =='worldwide' ? 'https://disease.sh/v3/covid-19/countries/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
  await fetch (url)
  .then(response => response.json())
  .then(data => {
    setCountry(countryCode);

    //All the Data from the response
    setcountryInfo(data);

    setLoading(false);
        // console.log([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoom(4);

  })

}
console.log("Info",countryInfo)

  return (
    <div className="app">

      <div className="app__left">
      <div className="app__header">
          <h1 className='header__maintitle'>COVID 19 TRACKER</h1>
              <FormControl className='app__dropdown'>
                <Select variant='outlined' onChange={onCountryChange} value={country}>
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                    {countries.map((country)=> (
                      <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))}
                </Select>
                
              </FormControl>
          </div>

          <div className="app__stats">
            <InfoBox isRed  active={casesType === "cases"} onClick={(e) => setCasesType("cases")} title='Corona Virus Cases' total={prettyPrintStat(countryInfo.cases)} cases={prettyPrintStat(countryInfo.todayCases)}/>
            <InfoBox active={casesType === "recovered"} onClick={(e) => setCasesType("recovered")} title='Recovered' total={prettyPrintStat(countryInfo.recovered)} cases={prettyPrintStat(countryInfo.todayRecovered)}/>
            <InfoBox isRed active={casesType === "deaths"}  onClick={(e) => setCasesType("deaths")} title='Deaths' total={prettyPrintStat(countryInfo.deaths)} cases={prettyPrintStat(countryInfo.todayDeaths)}/>
          </div>


          {/* Map Section */}
          <Map countries={mapCountries}
          center={mapCenter}
          zoom={zoom}
          casesType={casesType} />

          <About/>
      
       </div>

       <Card className="app__right">
         <CardContent> 
           <h3>Live cases By Country</h3>
           <Table countries={tableData} />
        {/* Table */}
        <h3>World Wide new {casesType}</h3>
        <LineGraph className='app__graph' casesType={casesType}/>
         {/* Graph */}
         </CardContent>
         
       </Card>
          

    </div>
  );
}

export default App;
