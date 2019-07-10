import React from "react";
import "./App.css";
import fetchHelper from "./fetchHelper";

function App() {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    fetchHelper("data.json")
      .then(response => response.json())
      .then(data => setData(data));
  }, []);
  return (
    <div className="App">
      <ul>
        {data.map(item => (
          <li key={item.value} style={{ color: item.value }}>
            {item.color}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
