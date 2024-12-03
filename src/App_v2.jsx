import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import Homepage from "./pages/Homepage";
import Pricing from "./pages/Pricing";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import { useEffect, useRef, useState } from "react";
import CountryList from "./components/CountryList";

const BASE_URL = "http://localhost:8000";
const API_KEY = "bhehM6GqnkQXGaFYONWQAA==vnGd2bIvFTOasE5i";
const COUNTRY_CODE_API_LINK = "https://api.api-ninjas.com/v1/country?";
function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const flags = useRef([]);

  useEffect(function () {
    async function fetchCitiesAndFlags() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
        await data.forEach((city) => {
          async function getFlagApi() {
            try {
              const resp = await fetch(
                `${COUNTRY_CODE_API_LINK}name=${city.country}`,
                {
                  method: "GET",
                  headers: { "X-Api-Key": API_KEY },
                }
              );
              const countryData = await resp.json();
              // console.log(countryData[0]);
              const flag_Api = `https://flagsapi.com/${countryData[0].iso2}/shiny/32.png`;

              flags.current = flags.current
                .map((flag) => flag.country)
                .includes(city.country)
                ? [...flags.current]
                : [
                    ...flags.current,
                    { country: city.country, flagApi: flag_Api },
                  ];
            } catch (e) {
              // alert("Error loading country flag");
              console.log(e);
            }
          }
          getFlagApi().then(() => setIsLoading(false));
          console.log(flags.current);
        });
      } catch {
        alert("There was an error loading data...");
        setIsLoading(false);
      }
    }

    fetchCitiesAndFlags();
  }, []);
  return (
    <div>
      {/* <h1>Hello Router!</h1> */}
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Homepage />} /> */}
          <Route index element={<Homepage />} />
          <Route path="product" element={<Product />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="app" element={<AppLayout />}>
            <Route
              index
              element={
                <CityList
                  cities={cities}
                  flags={flags.current}
                  isLoading={isLoading}
                />
              }
            />
            <Route
              path="cities"
              element={
                <CityList
                  cities={cities}
                  flags={flags.current}
                  isLoading={isLoading}
                />
              }
            />
            <Route
              path="countries"
              element={
                <CountryList
                  cities={cities}
                  flags={flags.current}
                  isLoading={isLoading}
                />
              }
            />
            <Route path="form" element={<p>Form</p>} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
