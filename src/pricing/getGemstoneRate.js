const { isArrayWithValues } = require("./helper");

const getGemstoneRate = (gemstonePricings, quality, type, shape, size) => {
  if (!isArrayWithValues(gemstonePricings)) return;
  for (let i = 0; i < gemstonePricings.length; i++) {
    let { qualities, types, shapes, sizes } = gemstonePricings[i];
    if (qualities.find((i) => i.value === quality))
      if (types.find((i) => i.value === type))
        if (shapes.find((i) => i.value === shape))
          if (sizes.find((i) => i.value === size))
            return gemstonePricings[i].rate;
  }
  return "";
};

module.exports = { getGemstoneRate };
