import logo from "./logo.svg";
import "./App.scss";
import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [tokkul, setTokkul] = useState(0);
  const [type, setType] = useState("ores");

  const handleSubmit = (e) => {
    e.preventDefault();
    const tokkul = e.target.tokkul.value;
    const type = e.target.type.value;
    console.log(tokkul, type);
    setTokkul(tokkul);
    setType(type);
  };

  const getData = async () => {
    if (tokkul > 0) {
      await fetch(`/${type}/${tokkul}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setItems(data);
        });
    }
  };

  useEffect(() => {
    getData();
  }, [tokkul, type]);

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <div className="App">
      <h1>Tokkul Calculator</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="tokkul">Tokkul</label>
          <select name="type" id="type">
            <option value="ores" defaultValue={true}>
              Ores
            </option>
            <option value="equipment">Equipment</option>
            <option value="runes">Runes</option>
          </select>
          <input
            type="number"
            name="tokkul"
            id="tokkul"
            defalutvalue={tokkul}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="results-container">
        <ul>
          {items.map((item) => {
            return (
              <li key={item.name}>
                <img src={item.image} alt={item.name} />
                <p>{item.title}</p>
                <p>{item.quantity}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
