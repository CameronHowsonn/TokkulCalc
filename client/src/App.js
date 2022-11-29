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
  const [isLoading, setIsLoading] = useState(false);
  const [reqs, setReqs] = useState(0);
  const [error, setError] = useState(false);

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

  useEffect(() => {
    const getData = async () => {
      if (tokkul > 0) {
        setItems([]);
        setIsLoading(true);
        setReqs((prev) => prev + 1);
        await fetch(`/${type}/${tokkul}/${sort}/${hideItems}`)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            console.log(data);
            setItems(data.sendData);
            setError(false);
            setIsLoading(false);
          });
      } else {
        setError("Please enter a valid amount of tokkul");
      }
    };
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
              placeholder="Enter tokkul amount"
              min="0"
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
            <div className="group">
              <label>Sort by total price?</label>
              <input
                type="checkbox"
                name="sort"
                id="sort"
                defaultChecked={sort}
                onChange={(e) => setSort(e.target.checked)}
              />
            </div>
            <div className="group">
              <label>Hide items you can't afford?</label>
              <input
                type="checkbox"
                name="hideItems"
                id="hideItems"
                defaultChecked={hideItems}
                onChange={(e) => setHideItems(e.target.checked)}
              />
            </div>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>

      {error && reqs > 0 && <p className="error">{error}</p>}

      {isLoading && reqs > 0 ? (
        <div className="loading">Loading...</div>
      ) : (
        <ul className="results-container">
          {items.map((item) => {
            return <ItemCard item={item} key={item.id} />;
          })}
        </ul>
      )}
    </div>
  );
}

export default App;
