import logo from "./logo.svg";
import "./App.scss";
import { useEffect, useState } from "react";
import ItemCard from "./components/ItemCard.tsx";

function App() {
  const [items, setItems] = useState([]);
  const [tokkul, setTokkul] = useState(0);
  const [type, setType] = useState("ores");
  const [sort, setSort] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tokkul = e.target.tokkul.value;
    const type = e.target.type.value;
    const sort = e.target.sort.checked;
    setTokkul(tokkul);
    setType(type);
    setSort(sort);
  };

  const getData = async () => {
    if (tokkul > 0) {
      await fetch(`/${type}/${tokkul}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (sort) {
            setItems(
              data.sort((a, b) => {
                return parseInt(a.totalPrice) - parseInt(b.totalPrice);
              })
            );
          } else {
            setItems(data);
          }
        });
    }
  };

  useEffect(() => {
    getData();
  }, [tokkul, type, sort]);

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
          <label>Sort by total price?</label>
          <input type="checkbox" name="sort" id="sort" defaultChecked={sort} />
        </form>
      </div>
      <div className="results-container">
        <ul>
          {items.map((item) => {
            return <ItemCard item={item} key={item.id} />;
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
