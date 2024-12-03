import { createContext, useContext, useEffect, useReducer } from "react";
import { useLocalStorageState } from "../custom-hooks/useLocalStorageState";

const BASE_URL = "http://localhost:8000";

const API_KEY = "bhehM6GqnkQXGaFYONWQAA==vnGd2bIvFTOasE5i";
const COUNTRY_CODE_API_LINK = "https://api.api-ninjas.com/v1/country?";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
        error: "",
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const [flags, setFlags] = useLocalStorageState([], "flags");

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data...",
        });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading data...",
      });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating city...",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city...",
      });
    }
  }

  async function getCountryCode(dispatch, country, setFlags) {
    try {
      dispatch({ type: "setIsFlagLoading", payload: true });
      if (country !== undefined) {
        const res = await fetch(`${COUNTRY_CODE_API_LINK}name=${country}`, {
          method: "GET",
          headers: { "X-Api-Key": API_KEY },
        });
        const data = await res.json();
        console.log(data[0]);
        const flag_api = `https://flagsapi.com/${data[0].iso2}/shiny/32.png`;
        dispatch({ type: "flag", payload: flag_api });
        await setFlags((flags) => [
          ...flags,
          { country: country, flagApi: flag_api },
        ]);
      }
    } catch (e) {
      console.log(e.message);
    } finally {
      dispatch({ type: "setIsFlagLoading", payload: false });
    }
  }

  function getFlag(flags, country) {
    const flagObject = flags.map((flag) => flag?.country).includes(country)
      ? flags.find((f) => f.country === country)
      : { country: "", flagApi: "" };
    return flagObject.flagApi;
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        flags,
        setFlags,
        currentCity,
        error,
        getCity,
        getCountryCode,
        getFlag,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside CitiesProvider");
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
