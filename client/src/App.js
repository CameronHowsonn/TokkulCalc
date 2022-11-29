import logo from "./logo.svg";
import "./App.scss";
import { useEffect, useState } from "react";
import ItemCard from "./components/ItemCard.tsx";

function App() {
  const [items, setItems] = useState([]);
  const [tokkul, setTokkul] = useState(0);
  const [type, setType] = useState("ores");
  const [sort, setSort] = useState(false);
  const [hideItems, setHideItems] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tokkul = e.target.tokkul.value;
    const type = e.target.type.value;
    const sort = e.target.sort.checked;
    const hideItems = e.target.hideItems.checked;
    setTokkul(tokkul);
    setType(type);
    setSort(sort);
    setHideItems(hideItems);
  };

  const getData = async () => {
    if (tokkul > 0) {
      await fetch(`/${type}/${tokkul}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (sort && hideItems) {
            setItems(
              data
                .sort((a, b) => parseInt(a.totalPrice) - parseInt(b.totalPrice))
                .filter((item) => item.amount > 0)
            );
            return;
          }
          if (sort) {
            setItems(
              data.sort(
                (a, b) => parseInt(a.totalPrice) - parseInt(b.totalPrice)
              )
            );
            return;
          }
          if (hideItems) {
            setItems(data.filter((item) => item.amount > 0));
            return;
          }
          setItems(data);
        });
    }
  };

  useEffect(() => {
    getData();
  }, [tokkul, type, sort, hideItems]);

  return (
    <div className="App">
      <h1>Tokkul Calculator</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group input">
            <label htmlFor="tokkul">Tokkul</label>
            <input
              type="number"
              name="tokkul"
              id="tokkul"
              defalutvalue={tokkul}
            />
            <select name="type" id="type">
              <option value="ores" defaultValue={true}>
                Ores
              </option>
              <option value="equipment">Equipment</option>
              <option value="runes">Runes</option>
            </select>
          </div>
          <div className="form-group bottom">
            <label>Sort by total price?</label>
            <input
              type="checkbox"
              name="sort"
              id="sort"
              defaultChecked={sort}
            />
            <label>Hide items you can't afford?</label>
            <input
              type="checkbox"
              name="hideItems"
              id="hideItems"
              defaultChecked={hideItems}
            />
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      <ul className="results-container">
        {items.map((item) => {
          return <ItemCard item={item} key={item.id} />;
        })}
      </ul>
    </div>
  );
}

export default App;
