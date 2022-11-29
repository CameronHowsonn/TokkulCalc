// Param 1 - Number of tokkul
const runelite = require("runelite");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;

const oreAndGem = {
  tinOre: {
    title: "Tin Ore",
    id: 438,
    tokkulPrice: 4,
  },
  copperOre: {
    title: "Copper Ore",
    id: 436,
    tokkulPrice: 4,
  },
  ironOre: {
    title: "Iron Ore",
    id: 440,
    tokkulPrice: 25,
  },
  coal: {
    title: "Coal",
    id: 453,
    tokkulPrice: 67,
  },
  mithrilOre: {
    title: "Mithril Ore",
    id: 447,
    tokkulPrice: 243,
  },
  adamantiteOre: {
    title: "Adamantite Ore",
    id: 449,
    tokkulPrice: 600,
  },
  runiteOre: {
    title: "Runite Ore",
    id: 451,
    tokkulPrice: 4800,
  },
  goldOre: {
    title: "Gold Ore",
    id: 444,
    tokkulPrice: 225,
  },
  silverOre: {
    title: "Silver Ore",
    id: 442,
    tokkulPrice: 112,
  },
  uncutSapphire: {
    title: "Uncut Sapphire",
    id: 1623,
    tokkulPrice: 37,
  },

  uncutEmerald: {
    title: "Uncut Emerald",
    id: 1621,
    tokkulPrice: 75,
  },
  uncutRuby: {
    title: "Uncut Ruby",
    id: 1619,
    tokkulPrice: 150,
  },
  uncutDiamond: {
    title: "Uncut Diamond",
    id: 1617,
    tokkulPrice: 300,
  },
  uncutDragonstone: {
    title: "Uncut Dragonstone",
    id: 1631,
    tokkulPrice: 1500,
  },
  uncutOnyx: {
    title: "Uncut Onyx",
    id: 6571,
    tokkulPrice: 300000,
  },
  OnyxBoltTips: {
    title: "Onyx Bolt Tips",
    id: 9194,
    tokkulPrice: 300000,
  },
};

const equipment = {
  ToktzXilUl: {
    title: "Toktz-Xil-Ul",
    id: 6522,
    tokkulPrice: 375,
  },
  ToktzXilAk: {
    title: "Toktz-Xil-Ak",
    id: 6523,
    tokkulPrice: 60000,
  },
  ToktzXilEk: {
    title: "Toktz-Xil-Ek",
    id: 6525,
    tokkulPrice: 37500,
  },
  TzhaarKetOm: {
    title: "Tzhaar-Ket-Om",
    id: 6528,
    tokkulPrice: 75001,
  },
  ToktzMejTal: {
    title: "Toktz-Mej-Tal",
    id: 6526,
    tokkulPrice: 52500,
  },
  TzhaarKetEm: {
    title: "Tzhaar-Ket-Em",
    id: 6527,
    tokkulPrice: 45000,
  },
  ObsidianCape: {
    title: "Obsidian Cape",
    id: 6568,
    tokkulPrice: 90000,
  },
  ToktzKetXil: {
    title: "Toktz-Ket-Xil",
    id: 6524,
    tokkulPrice: 67500,
  },
  ObsidianHelmet: {
    title: "Obsidian Helmet",
    id: 21298,
    tokkulPrice: 84480,
  },
  ObsidianPlateBody: {
    title: "Obsidian Platebody",
    id: 21301,
    tokkulPrice: 126000,
  },
  ObsidianPlateLegs: {
    title: "Obsidian Platelegs",
    id: 21304,
    tokkulPrice: 126000,
  },
};

const runes = {
  fireRune: {
    title: "Fire Rune",
    id: 554,
    tokkulPrice: 6,
  },
  waterRune: {
    title: "Water Rune",
    id: 555,
    tokkulPrice: 6,
  },
  airRune: {
    title: "Air Rune",
    id: 556,
    tokkulPrice: 6,
  },
  earthRune: {
    title: "Earth Rune",
    id: 557,
    tokkulPrice: 6,
  },
  mindRune: {
    title: "Mind Rune",
    id: 558,
    tokkulPrice: 4,
  },
  bodyRune: {
    title: "Body Rune",
    id: 559,
    tokkulPrice: 4,
  },
  chaosRune: {
    title: "Chaos Rune",
    id: 562,
    tokkulPrice: 135,
  },
  deathRune: {
    title: "Death Rune",
    id: 560,
    tokkulPrice: 270,
  },
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("dotenv").config();

const useragent = process.env.USER_AGENT;

const convertToGP = (labelValue) => {
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
    : Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
    : Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
    : Math.abs(Number(labelValue)) + "gp";
};

const getPrices = async (type, tokkul) => {
  const data = await runelite.prices({ useragent, timestep: "1h" });

  let itemType;

  if (type === "ores") {
    itemType = oreAndGem;
  }

  if (type === "equipment") {
    itemType = equipment;
  }

  if (type === "runes") {
    itemType = runes;
  }

  return Object.values(itemType).map((item) => {
    const itemData = data[item.id];

    if (itemData) {
      return {
        ...item,
        price: itemData?.avgHighPrice || itemData?.avgLowPrice,
        amount: Math.floor(tokkul / item.tokkulPrice),
        totalPrice: convertToGP(
          (itemData?.avgLowPrice || itemData?.avgHighPrice) *
            Math.floor(tokkul / item.tokkulPrice)
        ),
        image: `http://cdn.rsbuddy.com/items/${item.id}.png`,
      };
    } else {
      return null;
    }
  });
};

app.get("/:type/:count/:sort?/:filter?", function (req, res) {
  const tokkul = req.params.count;
  const type = req.params.type;
  const sort = req.params.sort || false;
  const filter = req.params.filter || false;

  if (!type) {
    res.send({
      error: "Please provide a type",
      status: 400,
    });
  }

  if (!tokkul) {
    res.send({
      error: "Please provide a tokkul count",
      status: 400,
    });
  }

  Promise.all([getPrices(type, tokkul)])
    .then((values) => {
      const finalData = values[0].filter((element) => element != null); //Some items are not in the runelite api?
      if (sort) {
        console.log(sort);
        finalData.sort((a, b) => {
          if (a.amount > 0 && b.amount > 0) {
            console.log(a, b);
            return (
              a.totalPrice.replace(/\D/g, "") - b.totalPrice.replace(/\D/g, "")
            );
          }
        });
      }
      if (filter) {
        finalData.filter((item) => item.totalPrice > 0);
      }
      res.status(200).json(finalData);
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: 400,
        message: "failure",
        err,
      });
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
