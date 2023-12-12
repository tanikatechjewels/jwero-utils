const { isArrayWithValues } = require("./helper");

const getAllLabourMasterPricing = (
  labourPricing,
  collections = [],
  categories = [],
  subcategories = [],
  dontCheckSubcategories,
  allowEmptyCategories
) => {
  if (!isArrayWithValues(labourPricing)) return {};
  // let labourPricingArray = Object.values(labourPricing);
  let allLabourMasterPricing = [];
  let length = labourPricing.length;
  for (let i = 0; i < length; i++) {
    let {
      collections: allCollections,
      categories: allCategories,
      subcategories: allSubCategories,
    } = labourPricing[i];
    if (
      isArrayWithValues(allCollections) &&
      collections?.some((i) => allCollections.find((obj) => obj.label === i))
    )
      if (
        (isArrayWithValues(allCategories) &&
          allCategories?.find((obj) => obj.label === categories?.[0])) ||
        allowEmptyCategories
        // categories.every((i) => allCategories.find((obj) => obj.label === i))
      )
        if (
          !isArrayWithValues(allSubCategories) &&
          !isArrayWithValues(subcategories)
        )
          // if (!isArrayWithValues(allSubCategories))
          allLabourMasterPricing.push(labourPricing[i]);
        else if (
          isArrayWithValues(allSubCategories) &&
          allSubCategories?.find((obj) => obj.label === subcategories?.[0])
        )
          allLabourMasterPricing.push(labourPricing[i]);
        else if (dontCheckSubcategories)
          allLabourMasterPricing.push(labourPricing[i]);
  }
  if (!isArrayWithValues(allLabourMasterPricing) && !dontCheckSubcategories)
    allLabourMasterPricing = getAllLabourMasterPricing(
      labourPricing,
      collections,
      categories,
      subcategories,
      true
    );
  if (!isArrayWithValues(allLabourMasterPricing) && !allowEmptyCategories)
    allLabourMasterPricing = getAllLabourMasterPricing(
      labourPricing,
      collections,
      categories,
      subcategories,
      true,
      true
    );
  return allLabourMasterPricing;
};

module.exports = { getAllLabourMasterPricing };
