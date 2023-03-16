
import { useState } from "react";
import './App.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [name, setName] = useState("");

  const fetchData =  () => {

    setIsLoading(true);
    setData("")
    fetch("https://dummy.restapiexample.com/api/v1/create", {
      method: "POST",

      // Adding body or contents to send
      body: JSON.stringify({
        name
      })
    })
      .then((res) => {
        res
          .json()
          .then((res2) => {
            setIsLoading(false);
            setData(res2.status);
          })
          .catch((err) => {
            setIsLoading(false);
            setData(err.message);
          });
      })
      .catch((err) => {
        setIsLoading(false);
        setData(err.message);
      });
  };

  return (
    <div className="App">
      {isLoading && <div className="loading">Loading data...</div>}
      {data && <div className="response">{data}</div>}
      <input
        className="name"
        value={name}
        data-testid="input-name"
        onInput={(e) => {
          setName(e.target.value);
        }}
      />
      <button disabled={isLoading} onClick={() => fetchData()}>Submit Form</button>
    </div>
  );
}
