const isArray = (arr) => arr && Array.isArray(arr);
const isObjWithValues = (obj) =>
  obj && Object.keys(obj).length > 0 && !isArray(obj);

const isNumber = (no) => !isNaN(Number(no));

const isArrayWithValues = (arr) => arr && Array.isArray(arr) && arr.length > 0;

const getRandomInt = (max) => Math.floor(Math.random() * max);

const validateNumber = (num) => {
  if (typeof num === "undefined" || num === null) {
    return 0;
  } else if (typeof num === "string" && num.trim() === "") {
    return 0;
  } else {
    const parsedNum = Number(num);
    if (isNaN(parsedNum) || !isFinite(parsedNum)) {
      return 0;
    } else {
      return parsedNum;
    }
  }
};

const checkCustomizations = (obj) => {
  if (!isObjWithValues(obj)) return;
  let { diamond, color, kt, diamond_purities, purities, colors } = obj;
  return {
    diamond: diamond == "1",
    color: color == "1",
    kt: kt == "1",
    diamondTypes: allDiamondPurities.filter((i) =>
      diamond_purities?.includes(i.value)
    ),
    metalPurities: allMetalPurities.filter((i) => purities?.includes(i.value)),
    metalColors: allMetalColors.filter((i) => colors?.includes(i.value)),
  };
};

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

const removeEmptyStrings = (obj) => {
  const result = {};

  for (const key in obj) {
    if (typeof obj[key] === "object") {
      const nestedObj = removeEmptyStrings(obj[key]);
      if (Object.keys(nestedObj).length > 0) {
        result[key] = nestedObj;
      }
    } else if (obj[key] !== "") {
      result[key] = obj[key];
    }
  }

  return result;
};

const transformProduct = (product) => {
  let transformed = {
    metal: {},
    diamond: {},
    gemstone: {},
    making: {},
    extracharges: {},
    breakup: {},
  };

  // Metal
  for (let metalType of ["gold", "silver", "platinium"]) {
    let grossKey = `${metalType}_gross`;
    let netKey = `${metalType}_net`;
    let purityKey = metalType === "gold" ? "gold_kt" : `${metalType}_purity`;
    let frontEndKey = metalType;
    if (metalType === "platinium") frontEndKey = "platinum";
    let purity =
      product.meta_data.find((item) => item.key === purityKey)?.value || "";
    transformed.metal[frontEndKey] = {
      [grossKey]:
        product.meta_data.find((item) => item.key === grossKey)?.value || "",
      [netKey]:
        product.meta_data.find((item) => item.key === netKey)?.value || "",
      [`${frontEndKey}_purity`]:
        product.meta_data.find((item) => item.key === purityKey)?.value || "",
      rate: product?.breakup?.metalRates?.[frontEndKey]?.[purity] || "",
      amount: product?.breakup?.metalBreakup?.[frontEndKey] || "",
    };
  }

  // Diamonds
  let diamonds = product.meta_data.find(
    (item) => item.key === "diamond"
  )?.value;
  // for (let key in diamonds) {
  //     transformed.diamond[`${key}:`] = diamonds[key];
  // }

  if (diamonds) {
    let diamondAmount = product?.breakup?.diamondBreakup;
    let diamondRates = product?.breakup?.diamondRates;
    transformed.diamond = {};

    Object.values(diamonds || {})?.forEach((dai, index) => {
      let {
        diamond_type,
        diamond_quality,
        diamond_shape,
        diamond_sieve,
        diamond_cut,
        diamond_pieces,
        diamond_weight,
        diamond_rate,
      } = dai;

      transformed.diamond[index + 1] = {
        clarity: diamond_quality?.split("-")?.[0] || "",
        color: diamond_quality?.split("-")?.[1] || "",
        cut: diamond_cut,
        size: diamond_sieve,
        weight: diamond_weight,
        rate: diamondRates?.[index + 1] || "",
        amount: diamondAmount?.[index + 1] || "",
      };
    });
  }

  // Gemstones
  let gemstones =
    product.meta_data.find((item) => item.key === "colorstone_details")
      ?.value || {};
  for (let key in gemstones) {
    let {
      colorstone_quality,
      colorstone_type,
      colorstone_shape,
      colorstone_size,
      colorstone_pieces,
      colorstone_weight,
      colorstone_rate,
    } = gemstones[key] || {};

    let valueObj = {
      clarity: colorstone_quality,
      type: colorstone_type,
      shape: colorstone_shape,
      // color,
      // cut,
      size: colorstone_size,
      weight: colorstone_weight,
    };
    transformed.gemstone[key] = valueObj;
  }

  // Making
  transformed.making = {
    from:
      product.meta_data.find((item) => item.key === "making_from")?.value || "",
    pergram_amt:
      product.meta_data.find((item) => item.key === "per_gram")?.value || "",
    wastage:
      product.meta_data.find((item) => item.key === "wastage_percent")?.value ||
      "",
    minimum_making:
      product.meta_data.find((item) => item.key === "minimum_labour")?.value ||
      "",
    amount: product.breakup.labour || "",
  };

  // Extra charges
  let extraCharges =
    product.meta_data.find((item) => item.key === "extra_charges")?.value || {};
  for (let key in extraCharges) {
    let { extra_charge_label, extra_charge_value } = extraCharges[key] || {};
    transformed.extracharges[key] = {
      label: extra_charge_label,
      value: extra_charge_value,
    };
  }

  // Breakup
  transformed.breakup = {
    metal: product.breakup.master.metal || "",
    diamond: product.breakup.master.diamond || "",
    gemstone: product.breakup.master.gemstone || "",
    making: product.breakup.master.labour || "",
    extra_charges: product.breakup.master.extraCharges || "",
    tax: product.breakup.tax || "",
    total: product.breakup.totalPrice || "",
  };

  // Recursively remove falsy values from the transformed object
  const removeFalsy = (obj) => {
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === "object") {
        removeFalsy(obj[key]);
      } else if (!obj[key]) {
        delete obj[key];
      }
    }
    return obj;
  };

  return removeFalsy(transformed);
};

const shopifyProductsMappingArray = [
  {
    jwero_key: [
      {
        key: "images",
        data_type: "array",
        array_obj_key: "src",
        array_obj_value: "src",
        array_map: [{ from: "src", to: "src" }],
      },
    ],
    key: [
      {
        key: "images",
        data_type: "array",
        array_map: [{ from: "src", to: "src" }],
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "name",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "title",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "tags",
        data_type: "array",
        array_obj_key: "name",
        array_obj_value: "name",
      },
    ],
    key: [
      {
        key: "tags",
        data_type: "string",
        key_to_map: "name",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "description",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "body_html",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "sku",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "variants",
        data_type: "array",
        array_obj_key: "sku",
        array_obj_value: "sku",
        index: 0,
      },

      {
        key: "sku",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "priceBreakup",
        data_type: "object",
      },
      {
        key: "price",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "variants",
        data_type: "array",
        array_obj_key: "price",
        array_obj_value: "price",
        index: 0,
      },

      {
        key: "price",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "priceBreakup",
        data_type: "object",
      },
      {
        key: "totalPrice",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "variants",
        data_type: "array",
        array_obj_key: "compare_at_price",
        array_obj_value: "compare_at_price",
        index: 0,
      },
      {
        key: "compare_at_price",
        data_type: "string",
      },
    ],
  },
];
const defaultWoocommerceCustomerMapping = [
  {
    jwero_key: [
      {
        key: "first_name",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "first_name",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "last_name",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "last_name",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "email",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "email",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "phone",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "phone",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "state",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "state",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "address_Line_1",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "address_Line_1",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "address_Line_2",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "address_Line_2",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "city",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "city",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "postcode",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "postcode",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "country",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "country",
        data_type: "string",
      },
    ],
  },
  // {
  //   jwero_key: [
  //     {
  //       key: "meta_data",
  //       data_type: "array",
  //       array_obj_key: "key",
  //       array_obj_value: "value",
  //     },
  //     {
  //       key: "total_purchase",
  //       data_type: "string",
  //     },
  //   ],
  //   key: [
  //     {
  //       key: "total_spent",
  //       data_type: "string",
  //     },
  //   ],
  // },
];
const defaultShopifyCustomerMapping = [
  {
    jwero_key: [
      {
        key: "first_name",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "first_name",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "last_name",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "last_name",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "email",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "email",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "phone",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "phone",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "state",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "default_address",
        data_type: "object",
      },
      {
        key: "country_code",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "address_Line_1",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "default_address",
        data_type: "object",
      },
      {
        key: "address1",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "address_Line_2",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "default_address",
        data_type: "object",
      },
      {
        key: "address2",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "city",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "default_address",
        data_type: "object",
      },
      {
        key: "city",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "postcode",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "default_address",
        data_type: "object",
      },
      {
        key: "zip",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "billing",
        data_type: "object",
      },
      {
        key: "country",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "default_address",
        data_type: "object",
      },
      {
        key: "country",
        data_type: "string",
      },
    ],
  },
  {
    jwero_key: [
      {
        key: "meta_data",
        data_type: "array",
        array_obj_key: "key",
        array_obj_value: "value",
      },
      {
        key: "total_purchase",
        data_type: "string",
      },
    ],
    key: [
      {
        key: "total_spent",
        data_type: "string",
      },
    ],
  },
];

const ebayProductMapping = [
  {
    key: [{ key: "MessageID", data_type: "string" }],
    jwero_key: [
      {
        key: "id",
        data_type: "string",
      },
    ],
  },

  {
    key: [
      { key: "Item", data_type: "object" },
      { key: "Title", data_type: "string" },
    ],
    jwero_key: [
      {
        key: "name",
        data_type: "string",
      },
    ],
  },
  {
    key: [
      { key: "Item", data_type: "object" },
      { key: "Description", data_type: "string" },
    ],
    jwero_key: [
      {
        key: "short_description",
        data_type: "string",
      },
    ],
  },
  {
    key: [
      { key: "Item", data_type: "object" },
      { key: "Quantity", data_type: "string" },
    ],
    jwero_key: [
      {
        key: "stock_quantity",
        data_type: "string",
      },
    ],
  },

  {
    key: [
      { key: "Item", data_type: "object" },
      { key: "PictureDetails", data_type: "object" },
      { key: "PictureURL", data_type: "string" },
    ],
    jwero_key: [
      {
        key: "images",
        data_type: "array",
        array_obj_key: "src",
        array_obj_value: "src",
      },
      {
        key: "src",
        data_type: "string",
      },
    ],
  },
  {
    key: [
      { key: "Item", data_type: "object" },
      { key: "DispatchTimeMax", data_type: "string" },
    ],
    jwero_key: [
      {
        key: "meta_data",
        data_type: "array",
        array_obj_key: "key",
        array_obj_value: "value",
      },
      {
        key: "product_shipping",
        data_type: "object",
        object_key: "min",
      },
    ],
  },
];

let amazonMarketplaceIds = [
  {
    country: "Canada",
    marketplace_id: "A2EUQ1WTGCTBG2",
    country_code: "CA",
    endpoint: "https://sellingpartnerapi-na.amazon.com",
    region: "us-east-1",
  },
  {
    country: "United States of America",
    marketplace_id: "ATVPDKIKX0DER",
    country_code: "US",
    endpoint: "https://sellingpartnerapi-na.amazon.com",
    region: "us-east-1",
  },
  {
    country: "Mexico",
    marketplace_id: "A1AM78C64UM0Y8",
    country_code: "MX",
    endpoint: "https://sellingpartnerapi-na.amazon.com",
    region: "us-east-1",
  },
  {
    country: "Brazil",
    marketplace_id: "A2Q3Y263D00KWC",
    country_code: "BR",
    endpoint: "https://sellingpartnerapi-na.amazon.com",
    region: "us-east-1",
  },
  {
    country: "Spain",
    marketplace_id: "A1RKKUPIHCS9HS",
    country_code: "ES",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "United Kingdom",
    marketplace_id: "A1F83G8C2ARO7P",
    country_code: "UK",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "France",
    marketplace_id: "A13V1IB3VIYZZH",
    country_code: "FR",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "Belgium",
    marketplace_id: "AMEN7PMS3EDWL",
    country_code: "BE",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "Netherlands",
    marketplace_id: "A1805IZSGTT6HS",
    country_code: "NL",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "Germany",
    marketplace_id: "A1PA6795UKMFR9",
    country_code: "DE",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "Italy",
    marketplace_id: "APJ6JRA9NG5V4",
    country_code: "IT",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "Sweden",
    marketplace_id: "A2NODRKZP88ZB9",
    country_code: "SE",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "Poland",
    marketplace_id: "A1C3SOZRARQ6R3",
    country_code: "PL",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "Egypt",
    marketplace_id: "ARBP9OOSHTCHU",
    country_code: "EG",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },

  {
    country: "Turkey",
    marketplace_id: "A33AVAJ2PDY3EV",
    country_code: "TR",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "Saudi Arabia",
    marketplace_id: "A17E79C6D8DWNP",
    country_code: "SA",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "United Arab Emirates",
    marketplace_id: "A2VIGQ35RCS4UG",
    country_code: "AE",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "India",
    marketplace_id: "A21TJRUUN4KGV",
    country_code: "IN",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "Singapore",
    marketplace_id: "A19VAU5U5O7RUS",
    country_code: "SG",
    endpoint: "https://sellingpartnerapi-fe.amazon.com",
    region: "us-west-2",
  },
  {
    country: "Australia",
    marketplace_id: "A39IBJ37TRP1C6",
    country_code: "AU",
    endpoint: "https://sellingpartnerapi-fe.amazon.com",
    region: "us-west-2",
  },
  {
    country: "Japan",
    marketplace_id: "A1VC38T7YXB528",
    country_code: "JP",
    endpoint: "https://sellingpartnerapi-fe.amazon.com",
    region: "us-west-2",
  },
  {
    country: "Spain",
    marketplace_id: "A1RKKUPIHCS9HS",
    country_code: "ES",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "United Kingdom",
    marketplace_id: "A1F83G8C2ARO7P",
    country_code: "UK",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "France",
    marketplace_id: "A13V1IB3VIYZZH",
    country_code: "FR",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
  {
    country: "Belgium",
    marketplace_id: "AMEN7PMS3EDWL",
    country_code: "BE",
    endpoint: "https://sellingpartnerapi-eu.amazon.com",
    region: "eu-west-1",
  },
];

const allMetalColors = [
  { label: "White", value: "white" },
  { label: "Yellow", value: "yellow" },
  { label: "Rose", value: "rose" },
  { label: "Two Tone", value: "two-tone" },
];

const allMetalPurities = [
  { label: "24KT (999.99)", value: "999.99" },
  { label: "24KT (999)", value: "999" },
  { label: "24KT (995)", value: "995" },
  { label: "22KT (916)", value: "916" },
  { label: "18KT (750)", value: "750" },
  { label: "14KT (583)", value: "583" },
  { label: "9KT (375)", value: "375" },
];

const allDiamondPurities = [
  { label: "Lab Grown", value: "lab_grown" },
  { label: "Natural", value: "natural" },
];

const getMarketplaceIdFromCountry = (country) => {
  const marketplaceIds = [
    {
      country: "Spain",
      marketplace_id: "A1RKKUPIHCS9HS",
      country_code: "ES",
    },
    {
      country: "United Kingdom",
      marketplace_id: "A1F83G8C2ARO7P",
      country_code: "UK",
    },
    {
      country: "France",
      marketplace_id: "A13V1IB3VIYZZH",
      country_code: "FR",
    },
    {
      country: "Belgium",
      marketplace_id: "AMEN7PMS3EDWL",
      country_code: "BE",
    },
    {
      country: "Netherlands",
      marketplace_id: "A1805IZSGTT6HS",
      country_code: "NL",
    },
    {
      country: "Germany",
      marketplace_id: "A1PA6795UKMFR9",
      country_code: "DE",
    },
    {
      country: "Italy",
      marketplace_id: "APJ6JRA9NG5V4",
      country_code: "IT",
    },
    {
      country: "Sweden",
      marketplace_id: "A2NODRKZP88ZB9",
      country_code: "SE",
    },
    {
      country: "Poland",
      marketplace_id: "A1C3SOZRARQ6R3",
      country_code: "PL",
    },
    {
      country: "Egypt",
      marketplace_id: "ARBP9OOSHTCHU",
      country_code: "EG",
    },
    {
      country: "Turkey",
      marketplace_id: "A33AVAJ2PDY3EV",
      country_code: "TR",
    },
    {
      country: "Saudi Arabia",
      marketplace_id: "A17E79C6D8DWNP",
      country_code: "SA",
    },
    {
      country: "United Arab Emirates",
      marketplace_id: "A2VIGQ35RCS4UG",
      country_code: "AE",
    },
    {
      country: "India",
      marketplace_id: "A21TJRUUN4KGV",
      country_code: "IN",
    },
    {
      country: "Canada",
      marketplace_id: "A2EUQ1WTGCTBG2",
      country_code: "CA",
    },
    {
      country: "United States of America",
      marketplace_id: "ATVPDKIKX0DER",
      country_code: "US",
    },
    {
      country: "Mexico",
      marketplace_id: "A1AM78C64UM0Y8",
      country_code: "MX",
    },
    {
      country: "Brazil",
      marketplace_id: "A2Q3Y263D00KWC",
      country_code: "BR",
    },
    {
      country: "Singapore",
      marketplace_id: "A19VAU5U5O7RUS",
      country_code: "SG",
    },
    {
      country: "Australia",
      marketplace_id: "A39IBJ37TRP1C6",
      country_code: "AU",
    },
    {
      country: "Japan",
      marketplace_id: "A1VC38T7YXB528",
      country_code: "JP",
    },
  ];
  return marketplaceIds?.find(
    (i) => i.country?.toLowerCase() === country?.toLowerCase()
  )?.marketplace_id;
};

module.exports = {
  removeEmptyStrings,
  transformProduct,
  setupJweroLegacyProduct,
  checkCustomizations,
  getRandomInt,
  isArrayWithValues,
  isNumber,
  isObjWithValues,
  validateNumber,
  isArray,
  defaultShopifyCustomerMapping,
  shopifyProductsMappingArray,
  defaultWoocommerceCustomerMapping,
  ebayProductMapping,
  getMarketplaceIdFromCountry,
};
