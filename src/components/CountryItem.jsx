import { useEffect, useReducer } from "react";
import { useCities } from "../contexts/CitiesContext";
import styles from "./CountryItem.module.css";
import Spinner from "./Spinner";

function reducer(state, action) {
  switch (action.type) {
    case "flag":
      return { ...state, flag: action.payload };
    case "setIsFlagLoading":
      return { ...state, isFlagLoading: action.payload };
    default:
      throw Error("action unknown");
  }
}

// const API_KEY = "bhehM6GqnkQXGaFYONWQAA==vnGd2bIvFTOasE5i";
// const COUNTRY_CODE_API_LINK = "https://api.api-ninjas.com/v1/country?";
function CountryItem({ country }) {
  const { flags, setFlags, getCountryCode, getFlag } = useCities();
  const [{ flag, isFlagLoading }, dispatch] = useReducer(reducer, {
    flag: getFlag(flags, country.country),
    isFlagLoading: false,
  });

  useEffect(
    function () {
      !flag && getCountryCode(dispatch, country.country, setFlags);
    },
    [country, flag, setFlags, getCountryCode]
  );
  return (
    <li className={styles.countryItem}>
      {!isFlagLoading ? (
        <img src={flag} alt={country.emoji} />
      ) : (
        <Spinner spinnerClass="spinnerFlag" />
      )}
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
