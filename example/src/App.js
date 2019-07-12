import React, { useState, useEffect } from "react";
import "./App.css";
import fetchHelper from "./fetchHelper";
import Progress from "react-progress-2";
import "react-progress-2/main.css";

function useSetupLoaderOnFetch() {
  useEffect(() => {
    fetchHelper.addBeforeRequestInterceptor(() => {
      Progress.show();
    });

    fetchHelper.addAfterResonseInterceptor(() => {
      Progress.hide();
    });
  }, []);
}

function App() {
  useSetupLoaderOnFetch();

  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    fetchHelper
      .fetch("https://api.github.com/users/rudyhuynh/repos")
      .then(([data, status]) => {
        if (status === 200 && Array.isArray(data)) {
          setData(data);
        } else {
          setError("Load data error " + status);
        }
      });
  }

  return (
    <div className="App">
      <Progress.Component />
      <button onClick={fetchData}>Refresh</button>
      {error ? <div>{error}</div> : null}
      <ul>
        {data.map(item => (
          <li key={item.id}>
            {item.name}: <a href={item.html_url}>{item.html_url}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
