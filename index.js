const { getProductPrice } = require("./src/pricing/getProductPrice");
const { getDiamondRate } = require("./src/pricing/getDiamondRate");
const { getGemstoneRate } = require("./src/pricing/getGemstoneRate");
const {
  getAllLabourMasterPricing,
} = require("./src/pricing/getAllLabourMasterPricing");

module.exports = {
  getProductPrice,
  getDiamondRate,
  getGemstoneRate,
  getAllLabourMasterPricing,
};
