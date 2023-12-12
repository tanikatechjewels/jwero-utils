const { isArrayWithValues } = require("./helper");

const getDiamondRate = (diamondPricings, type, quality, shape, size, cut) => {
  if (!diamondPricings || !quality) return 0;
  let clarity = quality.split("-")[0];
  let color = quality.split("-")[1];

  if (!isArrayWithValues(diamondPricings)) return;
  let length = diamondPricings.length;
  for (let i = 0; i < length; i++) {
    let { types, clarities, colors, shapes, sieves, cuts } = diamondPricings[i];
    if (isArrayWithValues(types) && types.find((i) => i.value === type))
      if (clarities.find((i) => i.value === clarity)) {
        if (colors.find((i) => i.value === color)) {
          if (shapes.find((i) => i.value === shape)) {
            if (sieves.find((i) => i.value === size)) {
              // if (!cut && !isArrayWithValues(cuts))
              if (isArrayWithValues(cuts) && cuts.find((i) => i.value === cut))
                return diamondPricings[i].rate;
              if (!cut) return diamondPricings[i].rate;
            }
          }
        }
      }
  }
  return "";
};

module.exports = { getDiamondRate };
