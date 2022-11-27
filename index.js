// Param 1 - Number of tokkul
const runelite = require("runelite");
require("dotenv").config();

const useragent = process.env.USER_AGENT;
const tokkul = process.argv.slice(2)[0];
const deathRuneId = 560;
const chaosRuneId = 562;
const obsidianCapeId = 6568;
const onyxId = 6571;

function convertToInternationalCurrencySystem(labelValue) {
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
    : Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
    : Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
    : Math.abs(Number(labelValue));
}

const getPrices = new Promise(async (resolve, reject) => {
  const data = await runelite.prices({ useragent, timestep: "1h" });
  resolve([
    data[deathRuneId].avgHighPrice,
    data[chaosRuneId].avgHighPrice,
    data[obsidianCapeId].avgHighPrice,
    data[onyxId].avgHighPrice || data[onyxId].avgLowPrice,
  ]);
});

Promise.all([getPrices]).then((values) => {
  workOutValues(...values);
});

const workOutValues = (values) => {
  const deathPrice = values[0];
  const deathTokkulPrice = 270;

  const chaosPrice = values[1];
  const chaosTokkulPrice = 135;

  const obsidianCapePrice = values[2];
  const obsidianCapeTokkulPrice = 90000;

  const onyxPrice = values[3];
  const onyxTokkulPrice = 300000;

  const numOfDeaths = Math.floor(tokkul / deathTokkulPrice) * deathPrice;
  const numOfChaos = Math.floor(tokkul / chaosTokkulPrice) * chaosPrice;
  const numOfObbyCapes =
    Math.floor(tokkul / obsidianCapeTokkulPrice) * obsidianCapePrice;
  const numOfOnyx = Math.floor(tokkul / onyxTokkulPrice) * onyxPrice;

  console.log(Math.floor(tokkul / onyxTokkulPrice));

  console.log({
    deaths:
      tokkul >= deathTokkulPrice
        ? `${convertToInternationalCurrencySystem(
            Math.floor(tokkul / deathTokkulPrice)
          )} - Number of Deaths Runes = ${numOfDeaths}`
        : "earn more tokkul",
    chaos:
      tokkul >= chaosTokkulPrice
        ? `${convertToInternationalCurrencySystem(
            numOfChaos
          )} - Number of Chaos Runes = ${Math.floor(tokkul / chaosTokkulPrice)}`
        : "earn more tokkul",
    obsidiancape:
      tokkul >= obsidianCapeTokkulPrice
        ? `${convertToInternationalCurrencySystem(
            numOfObbyCapes
          )} - Number of Obby Capes = ${Math.floor(
            tokkul / obsidianCapeTokkulPrice
          )} `
        : "earn more tokkul",
    onyx:
      tokkul >= onyxTokkulPrice
        ? `${convertToInternationalCurrencySystem(
            numOfOnyx
          )} - Number of Onyx's = ${Math.floor(tokkul / onyxTokkulPrice)}`
        : "earn more tokkul",
  });
};
