import { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";

import styles from "./CityItem.module.css";
import Spinner from "./Spinner";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

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

function CityItem({ city }) {
  const { flags, setFlags, currentCity, getCountryCode, getFlag, deleteCity } =
    useCities();
  const [{ flag, isFlagLoading }, dispatch] = useReducer(reducer, {
    flag: getFlag(flags, city.country),
    isFlagLoading: false,
  });

  useEffect(
    function () {
      !flag && getCountryCode(dispatch, city.country, setFlags);
    },
    [city, flag, setFlags, getCountryCode]
  );
  const { cityName, emoji, date, id, position } = city;

  function handleClick(e) {
    e.preventDefault();
    deleteCity(id);
  }
  return (
    <li>
      {/* <span className={styles.emoji}>{emoji}</span> */}
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        {!isFlagLoading ? (
          <img src={flag} alt={emoji} />
        ) : (
          <Spinner spinnerClass="spinnerFlag" />
        )}

        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
