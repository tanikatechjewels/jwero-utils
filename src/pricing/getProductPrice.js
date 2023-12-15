const { getAllLabourMasterPricing } = require("./getAllLabourMasterPricing");
const { getDiamondRate } = require("./getDiamondRate");
const { getGemstoneRate } = require("./getGemstoneRate");
const {
  isArrayWithValues,
  isNumber,
  isObjWithValues,
  validateNumber,
} = require("./helper");

/**
 * @param {Object} product_obj The product to update
 * @param {Object} master_pricing The master pricing data
 * @param {Object} product_settings The product settings
 * @param {Object} all_diamond_groups All diamond groups
 * @param {Number} tax the calculated tax
 * @param {Object} promotion_stepper The date
 */
function getProductPrice({
  product_obj: productObj,
  master_pricing: masterPricing,
  product_settings: productSettings,
  all_diamond_groups: allDiamondGroups,
  tax,
  promotion_stepper,
}) {
  // if (isObjWithValues(productObj)) return {};
  console.log({
    product_obj: isObjWithValues(productObj),
    master_pricing: isObjWithValues(masterPricing),
    product_settings: isObjWithValues(productSettings),
    all_diamond_groups: isObjWithValues(allDiamondGroups),
    tax: tax,
    promotion_stepper: isObjWithValues(promotion_stepper),
  });

  if (
    !isObjWithValues(productObj) ||
    !isObjWithValues(productSettings) ||
    !isObjWithValues(masterPricing)
  )
    return {};

  const setupJweroLegacyProduct = (product) => {
    if (!isObjWithValues(product)) return product;

    let {
      metal_type,
      metal_types,
      metal_color,
      gold_kt,
      gold_gross,
      gold_net,
      gold_rate,
      silver_gross,
      silver_net,
      platinium_gross,
      platinium_net,
      variants,
      silver_purity,
      platinium_purity,
      hallmarked,
      huid,
      subcategory,
      categories,
      collections,
      labourType,
      labour_from,
      labour_per_gram,
      wastage_percent,
      making_from,
      minimum_making,
      diamond,
      colorstone_details,
      diamond_from,
      colorstone_from,
      extra_charges,
      onlyColorstone,
      onlyDiamond,
      custom_discounts,
      labour_pricing_title,
      minimum_labour,
      per_gram,
      labour: _labour_per_gram,
      custom_wastage_from,
    } = product;

    if (labourType === "individual") labourType = "customize";
    if (!labourType) labourType = "master";
    if (diamond_from === "individual") diamond_from = "customize";
    if (colorstone_from === "individual") colorstone_from = "customize";
    if (minimum_labour) minimum_making = minimum_labour;
    if (!diamond_from) diamond_from = "master";
    if (!colorstone_from) colorstone_from = "master";

    if (isArrayWithValues(metal_types))
      metal_types = metal_types?.map((i) => i.toLowerCase());

    if (metal_type && !isArrayWithValues(metal_types)) {
      if (metal_type !== "multi") metal_types = [metal_type?.toLowerCase()];
      else {
        let array = [];
        if (gold_gross) array.push("gold");
        if (silver_gross) array.push("silver");
        if (platinium_gross) array.push("platinium");
        metal_types = array;
      }
    }
    if (!metal_types || !isArrayWithValues(metal_types)) metal_types = ["gold"];
    return {
      ...product,
      labourType,
      diamond_from,
      colorstone_from,
      minimum_making,
      diamond_from,
      colorstone_from,
      metal_types,
    };
  };

  let { labour_pricing, diamond_pricing, gemstone_pricing, margin_pricing } =
    masterPricing;

  let product = { ...productObj };
  let { meta_data } = product;
  if (!meta_data) meta_data = [];
  for (const obj of meta_data)
    if (!product.hasOwnProperty(obj.key) || !checkTruthy(product?.[obj.key]))
      product[obj.key] = obj.value;

  product = setupJweroLegacyProduct(product);

  let { default_currency, net_weight } = productSettings;

  if (net_weight === "auto") {
    if (product.gold_gross)
      product.gold_net = getNetWeight(product.gold_gross, product);
    if (product.silver_gross)
      product.silver_net = getNetWeight(product.silver_gross, product);
    if (product.platinium_gross)
      product.platinium_net = getNetWeight(product.platinium_gross, product);
  }
  let {
    metal_type,
    metal_types,
    metal_color,
    gold_kt,
    gold_gross,
    gold_net,
    gold_rate,
    silver_gross,
    silver_net,
    platinium_gross,
    platinium_net,
    variants,
    silver_purity,
    platinium_purity,
    hallmarked,
    huid,
    subcategory,
    categories,
    collections,
    labourType,
    labour_from,
    labour_per_gram,
    wastage_percent,
    making_from,
    minimum_making,
    diamond,
    diamond_customize,
    colorstone_details,
    colorstone_details_customize,
    diamond_from,
    colorstone_from,
    extra_charges,
    onlyColorstone,
    onlyDiamond,
    custom_discounts,
    labour_pricing_title,
    minimum_labour,
    per_gram,
    labour: _labour_per_gram,
    custom_wastage_from,
    manual_price,
  } = product;

  if (!making_from) making_from = "labour";
  if (!labour_per_gram && per_gram) labour_per_gram = per_gram;
  if (!labour_per_gram && _labour_per_gram) labour_per_gram = _labour_per_gram;

  let metaData = {};
  if (labourType === "individual") labourType = "customize";
  if (!labourType) labourType = "master";
  if (diamond_from === "individual") diamond_from = "customize";
  if (colorstone_from === "individual") colorstone_from = "customize";
  if (minimum_labour) minimum_making = minimum_labour;
  if (!diamond_from) diamond_from = "master";
  if (!colorstone_from) colorstone_from = "master";

  // if (isObjWithValues(diamond)) diamond = Object.values(diamond);
  // if (isObjWithValues(colorstone_details))
  //   colorstone_details = Object.values(colorstone_details);

  let diamondPricings = diamond_pricing?.[default_currency];
  let gemstonePricing = gemstone_pricing?.[default_currency];
  let marginPricing = margin_pricing?.[default_currency];

  const calculateTotalLabourPrice = () => {
    let totalWeight = 0;
    let { variants } = product;
    let totalMetalRate = 0;
    let { labour_from } = product;
    if (!labour_from) labour_from = "gross";
    let labourMaster = getAllLabourMasterPricing;
    let totalLabourPrice = 0;
    let labourBreakup = {};

    // console.log(labour_from, "<<<<< labour_from");

    if (labourType === "master") {
      if (
        isArrayWithValues(labour_pricing?.[default_currency]) &&
        labour_pricing?.[default_currency].find(
          (i) => i.id == labour_pricing_title
        )
      ) {
        let obj = labour_pricing?.[default_currency].find(
          (i) => i.id == labour_pricing_title
        );
        let { labour_from: master_labour_from } = obj;
        if (master_labour_from) labour_from = master_labour_from;
      }
    }
    if (metal_type && !isArrayWithValues(metal_types)) {
      if (metal_type !== "multi") metal_types = [metal_type?.toLowerCase()];
      else {
        let array = [];
        if (gold_gross) array.push("gold");
        if (silver_gross) array.push("silver");
        if (platinium_gross) array.push("platinium");
        metal_types = array;
      }
    }

    let totalWeights = { gross: 0, net: 0 };
    let froms = ["gross", "net"];
    let metals = ["gold", "silver", "platinium"];
    let purityKey = {
      gold: "gold_kt",
      silver: "silver_purity",
      platinium: "platinium_purity",
    };
    let pricingKey = {
      gold: "gold_pricing",
      silver: "silver_pricing",
      platinium: "platinum_pricing",
    };

    for (let from of froms)
      for (let metal of metals) {
        if (metal_types?.includes(metal)) {
          if (isArrayWithValues(variants) && false)
            variants.map(
              (i) => (totalWeight += validateNumber(i[`${metal}_${from}`]))
            );
          else {
            totalWeights[from] += validateNumber(product?.[`${metal}_${from}`]);
            // totalWeight += validateNumber(product[`${metal}_${from}`]);
          }
          let pricing = masterPricing?.[pricingKey[metal]];
          let { type } = pricing || {};
          if (
            pricing?.[default_currency] &&
            pricing?.[default_currency]?.[type] &&
            pricing?.[default_currency]?.[type]?.[product?.[purityKey[metal]]]
          ) {
            totalMetalRate += validateNumber(
              pricing[default_currency][type][product?.[purityKey[metal]]].rate
            );
          }
        }
      }

    //dividing by 2 because it was calculated twice for froms
    totalMetalRate = Math.round(totalMetalRate / 2);
    totalWeight = totalWeights[labour_from];

    // if (metal_types?.includes("gold")) {
    //   if (isArrayWithValues(variants) && false)
    //     variants.map(
    //       (i) => (totalWeight += validateNumber(i[`gold_${labour_from}`]))
    //     );
    //   else totalWeight += validateNumber(product[`gold_${labour_from}`]);
    //   let { type } = gold_pricing;
    //   if (
    //     gold_pricing[default_currency] &&
    //     gold_pricing[default_currency][type] &&
    //     gold_pricing[default_currency][type][gold_kt]
    //   ) {
    //     totalMetalRate += validateNumber(
    //       gold_pricing[default_currency][type][gold_kt].rate
    //     );
    //   }
    // }
    // if (metal_types?.includes("silver")) {
    //   if (isArrayWithValues(variants) && false)
    //     variants.map(
    //       (i) => (totalWeight += validateNumber(i[`silver_${labour_from}`]))
    //     );
    //   else totalWeight += validateNumber(product[`silver_${labour_from}`]);
    //   let { type } = silver_pricing;
    //   if (
    //     silver_pricing[default_currency] &&
    //     silver_pricing[default_currency][type] &&
    //     silver_pricing[default_currency][type][silver_purity]
    //   ) {
    //     totalMetalRate += validateNumber(
    //       silver_pricing[default_currency][type][silver_purity].rate
    //     );
    //   }
    // }
    // if (metal_types?.includes("platinium")) {
    //   if (isArrayWithValues(variants) && false)
    //     variants.map(
    //       (i) => (totalWeight += validateNumber(i[`platinium_${labour_from}`]))
    //     );
    //   else totalWeight += validateNumber(product[`platinium_${labour_from}`]);
    //   let { type } = platinum_pricing;
    //   if (
    //     platinum_pricing[default_currency] &&
    //     platinum_pricing[default_currency][type] &&
    //     platinum_pricing[default_currency][type][platinium_purity]
    //   ) {
    //     totalMetalRate += validateNumber(
    //       platinum_pricing[default_currency][type][platinium_purity].rate
    //     );
    //   }
    // }

    let currentObj = {
      labour_from: 0,
      per_gram: 0,
      wastage: 0,
      minimum_making: 0,
    };
    if (labourType === "master") {
      // let allLabourPricing = getAllLabourMasterPricing(
      //   labour_pricing[default_currency],
      //   collections,
      //   categories,
      //   subcategory
      // );
      let allLabourPricing = labour_pricing[default_currency];
      let temp_collections = collections
        ?.map((i) => i.label || i.name)
        .filter(Boolean);
      let temp_categories = categories
        ?.map((i) => i.label || i.name)
        .filter(Boolean);
      let temp_subcategories = isArrayWithValues(subcategory)
        ? subcategory?.map((i) => i.label || i.name)?.filter(Boolean)
        : [];
      let labourMasterPricings = getAllLabourMasterPricing(
        labour_pricing[default_currency],
        temp_collections,
        temp_categories,
        temp_subcategories
      );
      // console.log(product.labour_pricing_title, labour_pricing_title, allLabourPricing, "labour");
      let obj =
        isArrayWithValues(labourMasterPricings) && labourMasterPricings[0];
      if (
        obj
        // isArrayWithValues(allLabourPricing) &&
        // allLabourPricing.find((i) => i.id == product.labour_pricing_title)
      ) {
        // let obj = allLabourPricing.find(
        //   (i) => i.id == product.labour_pricing_title
        // );
        // setTotalLabour(Math.round(labour));
        let { labour_from, per_gram, wastage, minimum_making } = obj;
        // currentObj = { labour_from, per_gram, wastage, minimum_making };

        // let { labour_from, per_gram, wastage, minimum_making } = currentObj;
        // if (!labour_from) {
        //   return 0;
        // }
        let totalWeight = totalWeights[labour_from] || totalWeights.gross;
        wastage = wastage || 0;
        per_gram = per_gram || 0;

        let total = totalWeight * validateNumber(per_gram);
        // total += total * (wastage / 100);
        let labour = totalWeight * validateNumber(per_gram),
          wastageTemp =
            totalWeight * validateNumber(totalMetalRate) * (wastage / 100);
        total += wastageTemp;
        labourBreakup = {
          labour: Math.round(labour),
          wastage: Math.round(wastageTemp),
        };
        // setLabourBreakdown({
        //   labour: Math.round(labour),
        //   wastage: Math.round(wastageTemp),
        // });
        // total += total * (wastage / 100);

        //         let totalRate = totalWeight * validateNumber(totalMetalRate);
        // total +=
        // let totalWastage = totalWeight * validateNumber(per_gram);
        // totalWastage += totalWastage * (wastage / 100);
        // onEditProduct({
        //   price_breakup: {
        //     ...price_breakup,
        //     master: { ...price_breakup.master, labour: Math.round(total) },
        //   },
        // });
        if (
          minimum_making &&
          validateNumber(minimum_making) > Math.round(total)
        )
          totalLabourPrice = Math.round(
            validateNumber(minimum_making) + validateNumber(wastageTemp)
          );
        else totalLabourPrice = Math.round(total);
      }
    } else if (labourType === "customize") {
      // currentObj = {
      //   labour_from: product.labour_from,
      //   per_gram: validateNumber(product.labour_per_gram),
      //   wastage: validateNumber(product.wastage_percent),
      //   minimum_making: validateNumber(product.minimum_making),
      // };

      // let { } =
      //   product;
      // if (
      //   !labour_from ||
      //   !labour_per_gram ||
      //   !wastage_percent
      // )
      //   return 0;

      let totalMetalWeightPercentage =
        (totalWeights[custom_wastage_from] || totalWeight) *
        (validateNumber(wastage_percent) / 100);
      // totalWeight * (validateNumber(wastage_percent) / 100);

      let total_labour = Math.round(
        totalMetalRate * totalMetalWeightPercentage
      );

      // let total_labour = Math.round(
      //   totalMetalRate * (validateNumber(wastage_percent) / 100)
      // );
      let total_per_gram = 0;
      if (making_from === "labour") {
        total_per_gram = Math.round(labour_per_gram * totalWeight) || 0;
      } else if (
        making_from == "labour-wastage" ||
        making_from == "labour_wastage"
      ) {
        let _total_weight = totalWeights[custom_wastage_from] || totalWeight;
        let wastage = _total_weight + _total_weight * (wastage_percent / 100);
        total_per_gram = Math.round(labour_per_gram * wastage) || 0;
      }
      // onEditProduct({ total_per_gram, total_labour });
      totalLabourPrice =
        Math.round(total_per_gram) > validateNumber(minimum_making)
          ? Math.round(total_labour + total_per_gram)
          : validateNumber(
              validateNumber(Math.round(minimum_making)) +
                validateNumber(Math.round(total_labour))
            );
    } else totalLabourPrice = 0;

    return { total: totalLabourPrice, labourBreakup };
  };

  const calculateTotalMetalPrice = () => {
    let types = productSettings.types || [];
    types =
      types.filter((i) => ["gold", "silver", "platinium"].includes(i.value)) ||
      [];
    let metalArray = [...types];
    let total = 0;
    let goldTotal = 0;
    let silverTotal = 0;
    let platinumTotal = 0;
    let metalRates = {
      gold: {},
      silver: {},
      platinum: {},
    };

    // if (isArrayWithValues(metalArray) && isObjWithValues(masters)) {
    let { gold_pricing, silver_pricing, platinum_pricing } = masterPricing;
    let { variants } = product;
    if (
      metalArray.find((i) => i.value === "gold") &&
      gold_pricing[default_currency] &&
      metal_types?.includes("gold")
    ) {
      let goldRates = gold_pricing[default_currency][gold_pricing.type];
      if (goldRates) {
        let goldRate = goldRates[gold_kt] || 0;
        metalRates.gold[gold_kt] = goldRate?.rate || 0;
        if (goldRate)
          if (isArrayWithValues(variants) && false)
            variants.map(
              (i) =>
                (total +=
                  validateNumber(goldRate.rate) *
                  validateNumber(i[`gold_${gold_pricing.from}`]))
            );
          else {
            total +=
              validateNumber(goldRate.rate) *
              validateNumber(product[`gold_${gold_pricing.from}`]);
            goldTotal =
              validateNumber(goldRate.rate) *
              validateNumber(product[`gold_${gold_pricing.from}`]);
          }
      }
    }
    if (
      metalArray.find((i) => i.value === "silver") &&
      silver_pricing[default_currency] &&
      metal_types?.includes("silver")
    ) {
      let silverRates = silver_pricing[default_currency][silver_pricing.type];
      if (silverRates) {
        let silverRate = silverRates[silver_purity] || 0;
        metalRates.silver[silver_purity] = silverRate?.rate || 0;

        if (silverRate)
          if (isArrayWithValues(variants))
            variants.map(
              (i) =>
                (total +=
                  validateNumber(silverRate.rate) *
                  validateNumber(i[`silver_${silver_pricing.from}`]))
            );
          else {
            total +=
              validateNumber(silverRate.rate) *
              validateNumber(product[`silver_${silver_pricing.from}`]);
            silverTotal =
              validateNumber(silverRate.rate) *
              validateNumber(product[`silver_${silver_pricing.from}`]);
          }
      }
    }
    if (
      metalArray.find((i) => i.value === "platinium") &&
      platinum_pricing[default_currency] &&
      metal_types?.includes("platinium")
    ) {
      let platinumRates =
        platinum_pricing[default_currency][platinum_pricing.type];
      if (platinumRates) {
        let platinumRate = platinumRates[platinium_purity] || 0;
        metalRates.platinum[platinium_purity] = platinumRate?.rate || 0;
        if (platinumRate)
          if (isArrayWithValues(variants))
            variants.map(
              (i) =>
                (total +=
                  validateNumber(platinumRate.rate) *
                  validateNumber(i[`platinium_${platinum_pricing.from}`]))
            );
          else {
            total +=
              validateNumber(platinumRate.rate) *
              validateNumber(product[`platinium_${platinum_pricing.from}`]);
            platinumTotal =
              validateNumber(platinumRate.rate) *
              validateNumber(product[`platinium_${platinum_pricing.from}`]);
          }
      }
    }
    return {
      total: Math.round(total),
      metalBreakup: {
        gold: Math.round(goldTotal),
        silver: Math.round(silverTotal),
        platinum: Math.round(platinumTotal),
      },
      metalRates,
    };
  };
  const calculateTotalDiamond = () => {
    // let obj = {};
    // // let obj = { ...diamond };
    // if (!obj) return 0;

    let details = [];
    if (isArrayWithValues(diamond)) details = diamond;
    else if (isObjWithValues(diamond)) details = Object.values(diamond);
    else if (
      isArrayWithValues(diamond_customize) &&
      (diamond_from === "customize" || diamond_from === "individual")
    )
      details = diamond_customize;
    else if (
      isObjWithValues(diamond_customize) &&
      (diamond_from === "customize" || diamond_from === "individual")
    )
      details = Object.values(diamond_customize);
    else return { total: 0 };
    let total = 0;
    const diamondBreakup = {};
    const diamondRates = {};
    if (isArrayWithValues(details)) {
      for (let i = 0; i < details.length; i++) {
        let rate = 0;
        if (diamond_from === "customize" || diamond_from === "individual") {
          rate = validateNumber(details[i].diamond_rate);
          diamondBreakup[i + 1] = validateNumber(rate);
          diamondRates[i + 1] = validateNumber(rate);
        } else {
          let {
            diamond_quality,
            diamond_shape,
            // diamond_sieve,
            diamond_cut,
            diamond_type,
            diamond_weight,
            diamond_pieces,
          } = details[i];
          let diamond_sieve;
          if (isObjWithValues(allDiamondGroups)) {
            let netWeight = Number(
              Number(diamond_weight) / Number(diamond_pieces)
            );
            let diamondGroup = Object.values(allDiamondGroups);
            // console.log(diamondGroup);
            let obj = diamondGroup.find((i) => {
              return (
                i.shape === diamond_shape &&
                netWeight >= Number(i.from) &&
                netWeight <= Number(i.to)
              );
            });
            if (!obj)
              obj = diamondGroup.find((i) => {
                let netWeightFixed2 = Number(netWeight).toFixed(2);
                return (
                  i.shape === diamond_shape &&
                  netWeightFixed2 >= Number(i.from) &&
                  netWeightFixed2 <= Number(i.to)
                );
              });
            diamond_sieve = obj?.id;
          }

          rate =
            getDiamondRate(
              diamondPricings,
              diamond_type,
              diamond_quality,
              diamond_shape,
              diamond_sieve,
              diamond_cut
            ) || 0;
        }
        total += rate * validateNumber(details[i].diamond_weight);

        diamondRates[i + 1] = validateNumber(rate);
        diamondBreakup[i + 1] = validateNumber(
          Math.round(rate * validateNumber(details[i].diamond_weight))
        );
      }
    }
    return { total: Math.round(total), diamondBreakup, diamondRates };
  };
  const calculateTotalGemstone = () => {
    // let obj = { ...colorstone_details };
    // let details = Object.values(obj);

    let details = [];
    if (isArrayWithValues(colorstone_details)) details = colorstone_details;
    else if (isObjWithValues(colorstone_details))
      details = Object.values(colorstone_details);
    else if (
      isArrayWithValues(colorstone_details_customize) &&
      (colorstone_from === "customize" || colorstone_from === "individual")
    )
      details = colorstone_details_customize;
    else if (
      isObjWithValues(colorstone_details_customize) &&
      (colorstone_from === "customize" || colorstone_from === "individual")
    )
      details = Object.values(colorstone_details_customize);
    else return { total: 0 };

    let total = 0;
    let gemstoneBreakup = {},
      gemstoneRates = {};
    if (isArrayWithValues(details)) {
      for (let i = 0; i < details.length; i++) {
        let rate = 0;
        if (
          colorstone_from === "customize" ||
          colorstone_from === "individual"
        ) {
          rate = validateNumber(details[i].colorstone_rate);
          gemstoneBreakup[i + 1] = validateNumber(rate);
          gemstoneRates[i + 1] = validateNumber(rate);
        } else {
          let {
            colorstone_quality,
            colorstone_type,
            colorstone_shape,
            colorstone_size,
          } = details[i];
          rate =
            getGemstoneRate(
              gemstonePricing,
              colorstone_quality,
              colorstone_type,
              colorstone_shape,
              colorstone_size
            ) || 0;
        }
        if (
          colorstone_from === "customize" ||
          colorstone_from === "individual"
        ) {
          total += validateNumber(rate);

          gemstoneBreakup[i + 1] = validateNumber(rate);
          gemstoneRates[i + 1] = validateNumber(rate);
        } else {
          total += rate * validateNumber(details[i].colorstone_weight);
          gemstoneBreakup[i + 1] = validateNumber(
            Math.round(rate * validateNumber(details[i].colorstone_weight))
          );
          gemstoneRates[i + 1] = validateNumber(rate);
        }
      }
    }
    return { total: Math.round(total), gemstoneBreakup, gemstoneRates };
    // onEditProduct({
    //   price_breakup: {
    //     ...price_breakup,
    //     [colorstone_from]: {
    //       ...price_breakup[colorstone_from],
    //       colorstone: Math.round(total),
    //     },
    //   },
    // });
    // if (isObjWithValues(masters) && isObjWithValues(productSettings)) {
    //   let { default_currency } = productSettings;
    //   let { gemstone_pricing } = masters;
    //   if (gemstone_pricing[default_currency]) {
    //   }
    // }
  };

  let { total: labour, labourBreakup } = calculateTotalLabourPrice();
  let metalObj = calculateTotalMetalPrice();
  let metal = metalObj.total;

  let extraCharges = 0;

  if (isArrayWithValues(extra_charges)) {
    // extra_charges = Object.values(extra_charges);
    extra_charges?.map(
      (i) => (extraCharges += validateNumber(i.extra_charge_value))
    );
  }
  if (isObjWithValues(extra_charges)) {
    extra_charges = Object.values(extra_charges);
    extra_charges?.map(
      (i) => (extraCharges += validateNumber(i.extra_charge_value))
    );
  }

  let {
      total: diamond_total,
      diamondBreakup,
      diamondRates,
    } = calculateTotalDiamond() || {},
    {
      total: gemstone_total,
      gemstoneBreakup,
      gemstoneRates,
    } = calculateTotalGemstone();

  if (onlyDiamond) {
    metal = 0;
    gemstone_total = 0;
    labour = 0;
  } else if (onlyColorstone) {
    metal = 0;
    diamond_total = 0;
    labour = 0;
  }
  let discount = { labour: 0, metal: 0, diamond: 0, gemstone: 0, total: 0 };

  let priceBreakup = {
    master: { metal, extraCharges },
    metalBreakup: metalObj.metalBreakup,
    metalRates: metalObj.metalRates,
    diamondBreakup,
    diamondRates,
    gemstoneBreakup,
    gemstoneRates,
    labourBreakup,
  };

  priceBreakup = {
    ...priceBreakup,
    [diamond_from]: { ...priceBreakup[diamond_from], diamond: diamond_total },
  };
  priceBreakup = {
    ...priceBreakup,
    [labourType]: { ...priceBreakup[labourType], labour },
  };
  priceBreakup = {
    ...priceBreakup,
    [colorstone_from]: {
      ...priceBreakup[colorstone_from],
      colorstone: gemstone_total,
      gemstone: gemstone_total,
    },
  };

  let isERPProduct = product?.ornate_unique_id || product?.jemisys_product;
  if (marginPricing) {
    let ERPName = product?.ornate_unique_id
      ? "ornate"
      : product?.jemisys_product
      ? "jemisys"
      : null;
    let margin = getMarginRate({
      product,
      margin_pricing: marginPricing,
      margin_on: { erp: [ERPName] },
    });

    if (isObjWithValues(margin))
      priceBreakup = addMarginInPriceBreakup({
        priceBreakup,
        product,
        marginCombination: margin,
      });
  }

  if (isObjWithValues(custom_discounts)) {
    if (custom_discounts.on_sale_metal) {
      let { type, value } = custom_discounts.on_sale_metal;
      if (value)
        if (type == "by_percentage")
          discount.metal += validateNumber(
            Number(metal) * (validateNumber(value) / 100)
          );
        else if (type == "by_amount")
          discount.metal += validateNumber(Math.round(value));
    }
    if (custom_discounts.on_sale_making) {
      let { type, value } = custom_discounts.on_sale_making;
      if (value)
        if (type == "by_percentage")
          discount.labour += validateNumber(
            Number(labour) * (validateNumber(value) / 100)
          );
        else if (type == "by_amount")
          discount.labour += validateNumber(Math.round(value));
    }
    if (custom_discounts.on_sale_diamond) {
      let { type, value } = custom_discounts.on_sale_diamond;
      if (value)
        if (type == "by_percentage")
          discount.diamond += validateNumber(
            Number(diamond_total) * (validateNumber(value) / 100)
          );
        else if (type == "by_amount")
          discount.diamond += validateNumber(Math.round(value));
    }
    if (custom_discounts.on_sale_colorstone) {
      let { type, value } = custom_discounts.on_sale_colorstone;
      if (value)
        if (type == "by_percentage")
          discount.gemstone += validateNumber(
            Number(gemstone_total) * (validateNumber(value) / 100)
          );
        else if (type == "by_amount")
          discount.gemstone += validateNumber(Math.round(value));
    }
    if (custom_discounts.on_total_sale) {
      let { type, value } = custom_discounts.on_total_sale;
      if (value) {
        if (type == "by_percentage")
          discount.total +=
            Number(getTotalProductPrice(product, priceBreakup)) *
            (validateNumber(value) / 100);
        else if (type == "by_amount") discount.total += Number(value);
      }
    }
  }
  // Object.values(discount).map(
  //   (i) => (discountTotal += Math.round(validateNumber(i)))
  // );
  // discount.total = discountTotal;
  // let totalPrice = Math.round(labour + metal + gemstone_total + diamond_total);
  // console.log(labour, metal, gemstone_total, diamond_total, discount);

  let totalDiscount = 0;
  Object.values(discount).map(
    (i) => (totalDiscount += validateNumber(Math.round(i)))
  );
  // console.log(discount);
  // console.log(totalDiscount);
  let totalTax = 0;

  let totalPrice = getTotalProductPrice(product, priceBreakup);

  let priceWithoutTax = totalPrice;

  if (totalPrice && tax) {
    totalTax = Math.round((totalPrice * validateNumber(tax)) / 100);
    totalPrice += totalTax;
  }

  if (isObjWithValues(promotion_stepper) && promotion_stepper?.enable) {
    let {
      price,
      tax: newTax,
      priceDifference,
    } = addPromotionStepper({
      ...promotion_stepper,
      price: totalPrice,
      priceWithoutTax: priceWithoutTax,
      tax: totalTax,
      taxRate: tax,
    });
    totalPrice = price;
    totalTax = newTax;
    if (priceDifference && validateNumber(priceBreakup?.[labourType]?.labour))
      priceBreakup[labourType].labour = Math.round(
        priceBreakup?.[labourType]?.labour + priceDifference
      );
  }

  let priceObj = {
    ...priceBreakup,
    discount: { ...discount },
    totalDiscount,
    totalPrice,
    tax: totalTax,
    has_manual_price: false,
    // price: totalDiscountPrice,
  };

  priceObj.priceWithoutTax = Math.round(
    validateNumber(priceObj.price) - validateNumber(priceObj.totalTax)
  );
  priceObj.price = Math.round(totalPrice - totalDiscount);

  // totalDiscountPrice += Math.round(
  //   (totalDiscountPrice * validateNumber(tax)) / 100
  // );
  if (validateNumber(product.manual_price) || productSettings?.hide_pricing) {
    priceObj.totalTax = Math.round(
      validateNumber(
        (Math.round(product.manual_price) * validateNumber(tax)) / 100
      )
    );

    priceObj.totalDiscount = 0;
    if (isObjWithValues(custom_discounts) && custom_discounts?.on_total_sale) {
      let { type, value } = custom_discounts?.on_total_sale;
      if (value) {
        if (type == "by_percentage")
          priceObj.totalDiscount =
            validateNumber(Math.round(product.manual_price)) *
            (validateNumber(value) / 100);
        else if (type == "by_amount") priceObj.totalDiscount = Number(value);
      }
    }

    priceObj.priceWithoutTaxWithDiscount = Math.round(
      product.manual_price - priceObj.totalDiscount
    );

    priceObj.price = Math.round(
      validateNumber(
        Math.round(priceObj.priceWithoutTaxWithDiscount) + priceObj.totalTax
      )
    );
    priceObj.totalPrice = validateNumber(Math.round(product.manual_price));
    priceObj.has_manual_price = true;
  }
  // console.log(priceObj);
  return priceObj;
}

const checkTruthy = (value) => {
  if (!value) {
    // check for falsy values
    return false;
  } else if (Array.isArray(value) && value.length === 0) {
    // check for empty array
    return false;
  } else if (typeof value === "object" && Object.keys(value).length === 0) {
    // check for empty object
    return false;
  } else {
    return true;
  }
};

const addPromotionStepper = (obj) => {
  let {
    min = 499,
    max = 999,
    medium = 750,
    taxRate = 3,
    priceWithoutTax,
    price,
  } = obj;

  let lastThreeDigits = price % 1000;
  let stepperPrice = 0;
  if (lastThreeDigits >= medium) {
    stepperPrice = Math.floor(price / 1000) * 1000 + max;
  } else {
    stepperPrice = Math.floor(price / 1000) * 1000 + min;
  }
  let priceDifference = stepperPrice - price;
  let priceDifferenceWithoutTax = priceDifference / (1 + taxRate / 100);
  let newPrice = priceWithoutTax + priceDifferenceWithoutTax;
  let newTax = (newPrice * taxRate) / 100;
  let finalPrice = newPrice + newTax;

  return {
    price: Math.round(stepperPrice),
    tax: Math.round(newTax),
    priceDifference: priceDifferenceWithoutTax,
  };
};

const getMarginRate = ({
  product = {},
  margin_pricing = [],
  margin_on = {},
}) => {
  let { collections, categories, subcategory, tags } = product;
  for (let combination of margin_pricing) {
    let {
      collections: _collections,
      categories: _categories,
      subcategories: _subcategories,
      tags: _tags,
      apply_all_categories,
      apply_all_collections,
      apply_all_sub_categories,
      apply_all_tags,
    } = combination;
    // if there are collections it should have combinations collections and if there aren't it should be true
    /* The above code is checking if certain conditions are met before returning a combination object.
    It checks if the arrays `collections`, `categories`, `subcategory`, and `tags` contain values
    that exist in their respective arrays `_collections`, `_categories`, `_subcategories`, and
    `_tags`. If these arrays are empty or `apply_all_*` is true, the condition is considered true. */

    if (
      ((isArrayWithValues(collections) &&
        _collections?.some((i) =>
          collections?.find((j) => j?.value == i?.value || j?.slug == i?.value)
        )) ||
        apply_all_collections ||
        !isArrayWithValues(_collections)) &&
      ((isArrayWithValues(categories) &&
        _categories?.some((i) =>
          categories?.find((j) => j?.value == i?.value || j?.slug == i?.value)
        )) ||
        apply_all_categories ||
        !isArrayWithValues(_categories)) &&
      ((isArrayWithValues(subcategory) &&
        _subcategories?.some((i) =>
          subcategory?.find((j) => j?.value == i?.value || j?.slug == i?.value)
        )) ||
        apply_all_sub_categories ||
        !isArrayWithValues(_subcategories)) &&
      ((isArrayWithValues(tags) &&
        _tags?.some((i) =>
          tags?.find((j) => j?.value == i?.value || j?.slug == i?.value)
        )) ||
        apply_all_tags ||
        !isArrayWithValues(_tags))
    ) {
      for (let marginkey in margin_on) {
        let values = margin_on?.[marginkey];
        if (
          values?.every((i) =>
            combination?.[marginkey]?.find((j) => j?.value === i)
          )
        ) {
          return combination;
        }
      }
      return combination;
    }
  }
};

const getNetWeight = (gross, product) => {
  if (!gross || !product) return gross || "";
  let {
    diamond,
    colorstone_details,
    colorstone_details_customize,
    diamond_customize,
    colorstone_from,
    diamond_from,
  } = product;
  let totalWeight = 0;
  let diamondArray = [];
  let gemstoneArray = [];

  if (isArrayWithValues(colorstone_details)) gemstoneArray = colorstone_details;
  else if (isObjWithValues(colorstone_details))
    gemstoneArray = Object.values(colorstone_details);
  else if (
    isArrayWithValues(colorstone_details_customize) &&
    (colorstone_from === "customize" || colorstone_from === "individual")
  )
    gemstoneArray = colorstone_details_customize;
  else if (
    isObjWithValues(colorstone_details_customize) &&
    (colorstone_from === "customize" || colorstone_from === "individual")
  )
    gemstoneArray = Object.values(colorstone_details_customize);

  if (isArrayWithValues(diamond)) diamondArray = diamond;
  else if (isObjWithValues(diamond)) diamondArray = Object.values(diamond);
  else if (
    isArrayWithValues(diamond_customize) &&
    (diamond_from === "customize" || diamond_from === "individual")
  )
    diamondArray = diamond_customize;
  else if (
    isObjWithValues(diamond_customize) &&
    (diamond_from === "customize" || diamond_from === "individual")
  )
    diamondArray = Object.values(diamond_customize);

  // if (isObjWithValues(colorstone_details))
  gemstoneArray.forEach((i) => {
    if (!isNaN(Number(i.colorstone_weight)))
      totalWeight += Number(i.colorstone_weight);
  });
  // if (isObjWithValues(diamond))
  diamondArray.forEach((i) => {
    if (!isNaN(Number(i.diamond_weight)))
      totalWeight += Number(i.diamond_weight);
  });
  if (isNumber(gross)) {
    let totalNet = Number((gross - totalWeight / 5).toFixed(3));
    if (totalNet <= 0) return gross;
    return totalNet;
  } else return gross || "";
};

const getTotalProductPrice = (product, priceBreakup) => {
  let total = 0;
  let { master, customize } = { ...priceBreakup };
  if (master) {
    if (!product.colorstone_from || product.colorstone_from === "master")
      total += validateNumber(master.colorstone);
    if (!product.diamond_from || product.diamond_from === "master")
      total += validateNumber(master.diamond);

    total += validateNumber(master.labour);
    // console.log(master.labour, "labour");
    total += validateNumber(master.metal);
    total += validateNumber(master.extraCharges);
  }
  if (customize) {
    if (
      product.labourType === "customize" ||
      product.labourType === "individual"
    )
      total += validateNumber(customize.labour);
    if (
      product.colorstone_from === "customize" ||
      product.colorstone_from === "individual"
    )
      total += validateNumber(customize.colorstone);
    if (
      product.diamond_from === "customize" ||
      product.diamond_from === "individual"
    )
      total += validateNumber(customize.diamond);
  }

  return Math.round(total);
  // onEditProduct({ price: total });
};

module.exports = {
  getProductPrice,
  getTotalProductPrice,
  getMarginRate,
};
