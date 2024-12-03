import { useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import ButtonBack from "./ButtonBack";
import styles from "./City.module.css";
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

function City() {
  const { id } = useParams();
  const {
    flags,
    setFlags,
    getCity,
    currentCity,
    getCountryCode,
    getFlag,
    isLoading,
  } = useCities();

  const [{ flag, isFlagLoading }, dispatch] = useReducer(reducer, {
    flag: { country: "", flagApi: "" },
    isFlagLoading: false,
  });

  useEffect(
    function () {
      async function executeOrder() {
        await getCity(id);
      }
      executeOrder();
    },
    [id]
  );

  useEffect(
    function () {
      dispatch({
        type: "flag",
        payload: getFlag(flags, currentCity?.country),
      });
      !flag && getCountryCode(dispatch, currentCity?.country, setFlags);
    },
    [currentCity, flag, flags]
  );

  if (isLoading) return <Spinner />;

  const { cityName, emoji, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          {!isFlagLoading ? (
            <img src={flag} alt={emoji} />
          ) : (
            <Spinner spinnerClass="spinnerFlag" />
          )}{" "}
          {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <ButtonBack />
      </div>
    </div>
  );
}

export default City;
