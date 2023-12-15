const { getProductPrice } = require("./src/pricing/getProductPrice");
const { getDiamondRate } = require("./src/pricing/getDiamondRate");
const { getGemstoneRate } = require("./src/pricing/getGemstoneRate");
const {
  getAllLabourMasterPricing,
} = require("./src/pricing/getAllLabourMasterPricing");

console.log(
  getProductPrice({
    product_obj: {
      status: "draft",
      gold_kt: "916",
      categories: ["BANGLE"],
      metal_types: ["gold"],
      collections: ["Gold Jewellery"],
      stock_status: "outofstock",
      min_shipping_days: "5",
      max_shipping_days: "10",
      sku: "IJISKK",
      name: "IJISKK",
      description: "Test Product",
      stock_quantity: "",
      backorders: "no",
      attributes: [],
      meta_data: [
        {
          key: "metal_color",
          value: "yellow",
        },
        {
          key: "gold_gross",
          value: "64.000",
        },
        {
          key: "gold_net",
          value: "46.000",
        },
        {
          key: "diamond_from",
          value: "master",
        },
        {
          key: "diamond_lab",
          value: "GIA",
        },
        {
          key: "labourType",
          value: "master",
        },
        {
          key: "labour_from",
          value: "gross",
        },
        {
          key: "custom_wastage_from",
          value: "gross",
        },
        {
          key: "last_price_update",
          value: 1702637716,
        },
        {
          key: "metal_types",
          value: ["gold"],
        },
        {
          key: "manual_price",
          value: "",
        },
        {
          key: "seo",
          value: {
            seo_title: "",
            seo_description: "",
            seo_keywords: "",
          },
        },
        {
          key: "product_shipping",
          value: {
            min: "5",
            max: "10",
          },
        },
        {
          key: "gold_kt",
          value: "916",
        },
        {
          key: "diamond",
          value: {},
        },
        {
          key: "colorstone_details",
          value: {},
        },
        {
          key: "labour",
          value: "",
        },
      ],
      category: ["BANGLE"],
      manage_stock: false,
      short_description: "Test Product",
    },
    master_pricing: {
      gold_pricing: {
        INR: {
          default: "916",
          automatic: {
            375: {
              base: 328,
              margin: "375",
              rate: 328,
            },
            583: {
              base: 509,
              margin: "583",
              rate: 509,
            },
            750: {
              base: 4219,
              margin: 760,
              rate: 4275,
            },
            916: {
              base: "5400",
              margin: 916,
              rate: "5400",
            },
            995: {
              base: 5597,
              margin: 970,
              rate: 5456,
            },
            999: {
              base: 5619,
              margin: 970,
              rate: 5456,
            },
            999.99: {
              base: 873,
              margin: "999.99",
              rate: 873,
            },
            "": {
              base: "6300",
              rate: "6300",
              default: true,
            },
          },
          manual: {
            375: {
              base: "",
              rate: "",
            },
            583: {
              base: "",
              rate: "",
            },
            750: {
              base: "",
              rate: "",
            },
            916: {
              base: "",
              rate: "",
            },
            995: {
              base: "",
              rate: "",
            },
            999: {
              base: "",
              rate: "",
            },
            999.99: {
              base: "",
              rate: "",
            },
          },
          enabled_purities: {
            750: true,
            916: true,
            995: true,
            999: true,
          },
        },
        from: "net",
        type: "automatic",
      },
      silver_pricing: {
        INR: {
          default: "",
          automatic: {
            650: {
              base: "5879.40",
              margin: 650,
              rate: "5879.40",
            },
            750: {
              base: "6783.92",
              margin: 750,
              rate: "6783.92",
            },
            850: {
              base: "7688.44",
              margin: 850,
              rate: "7688.44",
            },
            925: {
              base: "8366.83",
              margin: 925,
              rate: "8366.83",
            },
            995: {
              base: "9000",
              margin: 995,
              rate: "9000.00",
            },
            999: {
              base: "9036.18",
              margin: 999,
              rate: "9036.18",
            },
            "": {
              base: "70.50",
              rate: "70.50",
              default: true,
            },
          },
          manual: {
            650: {
              base: "",
              rate: "",
            },
            750: {
              base: "",
              rate: "",
            },
            850: {
              base: "",
              rate: "",
            },
            925: {
              base: "",
              rate: "",
            },
            995: {
              base: "",
              rate: "",
            },
            999: {
              base: "",
              rate: "",
            },
          },
          enabled_purities: {
            650: true,
            750: true,
            850: true,
            925: true,
            995: true,
            999: true,
          },
        },
        from: "gross",
        type: "automatic",
      },
      platinum_pricing: {
        INR: {
          default: "",
          automatic: {
            850: {
              base: "8000",
              margin: 850,
              rate: 8000,
            },
            900: {
              base: 8471,
              margin: 900,
              rate: 8471,
            },
            950: {
              base: 8941,
              margin: 950,
              rate: 8941,
            },
          },
          manual: {
            850: {
              base: "",
              rate: "",
            },
            900: {
              base: "",
              rate: "",
            },
            950: {
              base: "",
              rate: "",
            },
          },
          enabled_purities: {
            850: true,
            900: true,
            950: true,
          },
        },
        from: "gross",
        type: "automatic",
      },
      labour_pricing: {
        INR: [
          {
            id: 1701930637,
            collections: [
              {
                id: 556,
                label: "Beeds Jewellery",
                value: "beeds-jewellery",
                count: 0,
              },
            ],
            categories: [
              {
                id: 580,
                label: "BANGLE",
                value: "bangle",
                count: 0,
              },
            ],
            subcategories: [
              {
                id: 285,
                label: "Birthday",
                value: "birthday",
                count: 0,
              },
            ],
            labour_from: "net",
            wastage: "15.5",
            wastage_from: "weight",
            per_gram: "999",
            making_from: "labour",
            minimum_making: "800",
            title: "Test",
          },
        ],
      },
      diamond_pricing: {
        INR: [
          {
            id: 1701849413,
            clarities: [
              {
                label: "IF/VVS",
                value: "IF/VVS",
              },
              {
                label: "IF",
                value: "IF",
              },
            ],
            colors: [
              {
                label: "YELLOW",
                value: "YELLOW",
              },
              {
                label: "EFG",
                value: "EFG",
              },
            ],
            shapes: [
              {
                value: "pear",
                label: "Pear",
              },
              {
                value: "marquise",
                label: "Marquise",
              },
            ],
            sieves: [
              {
                label: "0.005 - 0.008",
                value: "1673361401_O4Zmw",
              },
              {
                label: "Pear",
                value: "1671627705_C8cbl",
              },
            ],
            sieve_from: "",
            sieve_to: "",
            sieve_type: "",
            cuts: [
              {
                label: "Good",
                value: "good",
              },
              {
                label: "Excellent",
                value: "excellent",
              },
            ],
            types: [
              {
                label: "Lab Grown",
                value: "lab_grown",
              },
              {
                label: "Natural",
                value: "natural",
              },
            ],
            rate: "25000",
            title: "Diamond Combinatino #1",
          },
          {
            id: 1702447449,
            clarities: [
              {
                label: "VVS",
                value: "VVS",
              },
            ],
            colors: [
              {
                label: "D",
                value: "D",
              },
            ],
            shapes: [
              {
                value: "round",
                label: "Round",
              },
            ],
            sieves: [
              {
                label: "Round",
                value: "1671627657_LhurM",
              },
            ],
            sieve_from: "",
            sieve_to: "",
            sieve_type: "",
            cuts: [
              {
                label: "Excellent",
                value: "excellent",
              },
            ],
            types: [
              {
                label: "Natural",
                value: "natural",
              },
            ],
            rate: "120000",
            title: "Diamond Combination #2",
          },
          {
            id: 1702447502,
            clarities: [
              {
                label: "IF",
                value: "IF",
              },
            ],
            colors: [
              {
                label: "D",
                value: "D",
              },
            ],
            shapes: [
              {
                value: "round",
                label: "Round",
              },
            ],
            sieves: [
              {
                label: "Round",
                value: "1671627657_LhurM",
              },
            ],
            sieve_from: "",
            sieve_to: "",
            sieve_type: "",
            cuts: [
              {
                label: "Excellent",
                value: "excellent",
              },
            ],
            types: [
              {
                label: "Natural",
                value: "natural",
              },
            ],
            rate: "12536",
            title: "Diamond Combination #3",
          },
        ],
      },
      gemstone_pricing: {
        INR: [
          {
            id: 1701930517,
            title: "Gemstone Combinatino #2",
            qualities: [
              {
                label: "Kundan",
                value: "kundan",
              },
            ],
            types: [
              {
                label: "Sapphire",
                value: "sapphire",
              },
              {
                label: "Ruby",
                value: "ruby",
              },
            ],
            shapes: [
              {
                label: "Pear",
                value: "pear",
              },
              {
                label: "Round",
                value: "round",
              },
              {
                label: "Emerald",
                value: "emerald",
              },
            ],
            sizes: [
              {
                label: "8 x 5",
                value: "8 x 5",
              },
              {
                label: "11 x 7",
                value: "11 x 7",
              },
            ],
            rate: "23000",
          },
        ],
        USD: [],
        EUR: [],
        GBP: [],
        AUD: [],
        AED: [],
        SGD: [],
        SAR: [],
        ZAR: [],
        CAD: [],
        JPY: [],
        CNY: [],
        VND: [],
        THB: [],
        KWD: [],
      },
      additional_pricing: {
        hallmark: {
          INR: "9000",
        },
        certificate: {
          INR: "999",
        },
        rhodium: {
          INR: "888",
        },
      },
      last_updated: 1702447502,
      margin_pricing: {
        INR: [],
        USD: [],
        EUR: [],
        GBP: [],
        AUD: [],
        AED: [],
        SGD: [],
        SAR: [],
        ZAR: [],
        CAD: [],
        JPY: [],
        CNY: [],
        VND: [],
        THB: [],
        KWD: [],
      },
    },
    product_settings: {
      types: [
        {
          label: "Gold",
          value: "gold",
        },
        {
          label: "Silver",
          value: "silver",
        },
        {
          label: "Platinum",
          value: "platinium",
        },
        {
          label: "Diamond",
          value: "diamond",
        },
        {
          label: "Gemstone",
          value: "gemstone",
        },
      ],
      gold_purities: [
        {
          label: "22KT (916)",
          value: "916",
        },
        {
          label: "18KT (750)",
          value: "750",
        },
        {
          label: "24KT (999)",
          value: "999",
        },
        {
          label: "24KT (995)",
          value: "995",
        },
      ],
      silver_purities: [
        {
          label: "Fine (995)",
          value: "995",
        },
        {
          label: "Sterling (925)",
          value: "925",
        },
        {
          label: "Fine (999)",
          value: "999",
        },
        {
          label: "650",
          value: "650",
        },
        {
          label: "750",
          value: "750",
        },
        {
          label: "850",
          value: "850",
        },
      ],
      platinum_purities: [
        {
          label: "850",
          value: "850",
        },
        {
          label: "900",
          value: "900",
        },
        {
          label: "950",
          value: "950",
        },
      ],
      colors: [
        {
          label: "White",
          value: "white",
        },
        {
          label: "Yellow",
          value: "yellow",
        },
        {
          label: "Rose",
          value: "rose",
        },
        {
          label: "Two Tone",
          value: "two-tone",
        },
      ],
      net_weight: "manual",
      auto_diamond_sieve: "",
      collections: [],
      categories: [],
      diamond_types: [
        {
          label: "Natural",
          value: "natural",
        },
        {
          label: "Lab Grown",
          value: "lab_grown",
        },
      ],
      diamond_clarities: [
        {
          label: "VVS",
          value: "VVS",
        },
        {
          label: "IF",
          value: "IF",
        },
        {
          label: "IF/VVS",
          value: "IF/VVS",
        },
        {
          label: "VVS1",
          value: "VVS1",
        },
        {
          label: "VVS2",
          value: "VVS2",
        },
        {
          label: "VS",
          value: "VS",
        },
        {
          label: "VS2",
          value: "VS2",
        },
        {
          label: "SI3",
          value: "SI3",
        },
        {
          label: "SI",
          value: "SI",
        },
        {
          label: "SI1",
          value: "SI1",
        },
      ],
      diamond_cuts: [
        {
          label: "Excellent",
          value: "excellent",
        },
        {
          label: "Good",
          value: "good",
        },
        {
          label: "Poor",
          value: "poor",
        },
        {
          label: "Fair",
          value: "fair",
        },
      ],
      diamond_shapes: [
        {
          value: "round",
          label: "Round",
        },
        {
          value: "princess",
          label: "Princess",
        },
        {
          value: "marquise",
          label: "Marquise",
        },
        {
          value: "pear",
          label: "Pear",
        },
        {
          value: "oval",
          label: "Oval",
        },
        {
          value: "baguette",
          label: "Baguette",
        },
        {
          value: "tapered_baguette",
          label: "Taper Baguette",
        },
        {
          value: "heart",
          label: "Heart",
        },
        {
          value: "fancy",
          label: "Fancy",
        },
        {
          value: "lozenge",
          label: "Lozenge",
        },
        {
          value: "trilliant",
          label: "Trilliant",
        },
        {
          value: "bullet_baguette",
          label: "Bullet Baguette",
        },
        {
          value: "asscher",
          label: "Asscher",
        },
        {
          value: "cushion",
          label: "Cushion",
        },
        {
          value: "trillion",
          label: "Trillion",
        },
        {
          label: "Trapezoid",
          value: "trapezoid",
        },
        {
          label: "Half Moon",
          value: "halfmoon",
        },
        {
          label: "Kite",
          value: "kite",
        },
      ],
      diamond_colors: [
        {
          label: "F",
          value: "F",
        },
        {
          label: "G",
          value: "G",
        },
        {
          label: "H",
          value: "H",
        },
        {
          label: "I",
          value: "I",
        },
        {
          label: "J",
          value: "J",
        },
        {
          label: "L",
          value: "L",
        },
        {
          label: "Pink",
          value: "pink",
        },
        {
          label: "Blue",
          value: "blue",
        },
        {
          label: "E",
          value: "E",
        },
        {
          label: "D",
          value: "D",
        },
        {
          label: "YELLOW",
          value: "YELLOW",
        },
        {
          label: "PINK",
          value: "BLUE",
        },
      ],
      diamond_sizes: [],
      currency: [
        {
          label: "INR",
          value: "INR",
          symbol: "₹",
          name: "Indian Rupee",
        },
      ],
      default_currency: "INR",
      gemstone_qualities: [
        {
          label: "Precious",
          value: "precious",
        },
        {
          label: "Kundan",
          value: "kundan",
        },
        {
          label: "Uncut",
          value: "uncut",
        },
        {
          label: "Hydro",
          value: "hydro",
        },
        {
          label: "Doublet",
          value: "doublet",
        },
        {
          label: "Semi precious",
          value: "semi-precious",
        },
      ],
      gemstone_shapes: [
        {
          label: "Round",
          value: "round",
        },
        {
          label: "Square",
          value: "square",
        },
        {
          label: "Oval",
          value: "oval",
        },
        {
          label: "Emerald",
          value: "emerald",
        },
        {
          label: "Pear",
          value: "pear",
        },
        {
          label: "Marquise",
          value: "marquise",
        },
      ],
      gemstone_types: [
        {
          label: "Sapphire",
          value: "sapphire",
        },
        {
          label: "Pearl",
          value: "pearl",
        },
        {
          label: "Ruby",
          value: "ruby",
        },
        {
          label: "Blue sapphire",
          value: "blue-sapphire",
        },
        {
          label: "Amethyst",
          value: "amethyst",
        },
        {
          label: "Beads",
          value: "beads",
        },
        {
          label: "Black beeds",
          value: "black-beeds",
        },
        {
          label: "Black diamond",
          value: "black-diamond",
        },
        {
          label: "Blue sapphire-beads",
          value: "blue-sapphire-beads",
        },
        {
          label: "Emerald",
          value: "emerald",
        },
        {
          label: "Real emerald",
          value: "real-emerald",
        },
        {
          label: "Real coral",
          value: "real-coral",
        },
        {
          label: "Claw",
          value: "claw",
        },
        {
          label: "Cubic zirconia",
          value: "cubic-zirconia",
        },
        {
          label: "Navratna set with diamond",
          value: "navratna-set-with-diamond",
        },
        {
          label: "Ruby beads",
          value: "ruby-beads",
        },
        {
          label: "Ruby emerald",
          value: "ruby-emerald",
        },
        {
          label: "Synthetic beads",
          value: "synthetic-beads",
        },
      ],
      diamond_labs: [
        {
          label: "IGI",
          value: "IGI",
        },
        {
          label: "GIA",
          value: "GIA",
        },
        {
          label: "DHC",
          value: "DHC",
        },
        {
          label: "SGL",
          value: "SGL",
        },
        {
          label: "DGLA",
          value: "DGLA",
        },
        {
          label: "IIG",
          value: "IIG",
        },
        {
          label: "HRD",
          value: "HRD",
        },
        {
          label: "DGSL",
          value: "DGSL",
        },
        {
          label: "AGS",
          value: "AGS",
        },
        {
          label: "EGL",
          value: "EGL",
        },
        {
          label: "GII",
          value: "GII",
        },
        {
          label: "GSI",
          value: "GSI",
        },
        {
          label: "IDT",
          value: "IDT",
        },
        {
          label: "IIDGR",
          value: "IIDGR",
        },
        {
          label: "Forevermark",
          value: "Forevermark",
        },
      ],
      hide_pricing: false,
    },
    all_diamond_groups: {
      "1671627657_LhurM": {
        id: "1671627657_LhurM",
        fromObj: {
          wt: "0.001",
          size: "0.6",
          sieve: "+00000-0000",
        },
        toObj: {
          wt: "0.002",
          size: "0.7",
          sieve: "+00000-0000",
        },
        title: "Round",
        shape: "round",
        from: "0.001",
        to: "0.002",
      },
      "1671627672_0ytnJ": {
        id: "1671627672_0ytnJ",
        fromObj: {
          wt: "0.01",
        },
        toObj: {
          wt: "8.05",
          size: "",
        },
        title: "Princess",
        shape: "princess",
        from: "0.01",
        to: "8.05",
      },
      "1671627691_SXhR2": {
        id: "1671627691_SXhR2",
        fromObj: {
          wt: "0.02",
        },
        toObj: {
          wt: "8.05",
        },
        title: "Marquise",
        shape: "marquise",
        from: "0.02",
        to: "8.05",
      },
      "1671627705_C8cbl": {
        id: "1671627705_C8cbl",
        fromObj: {
          wt: "0.01",
        },
        toObj: {
          wt: "8.05",
        },
        title: "Pear",
        shape: "pear",
        from: "0.01",
        to: "8.05",
      },
      "1671627718_50lvN": {
        id: "1671627718_50lvN",
        fromObj: {
          wt: "0.01",
        },
        toObj: {
          wt: "8.05",
        },
        title: "Oval",
        shape: "oval",
        from: "0.01",
        to: "8.05",
      },
      "1673361401_O4Zmw": {
        id: "1673361401_O4Zmw",
        fromObj: {
          wt: "0.005",
          size: "0.9",
          sieve: "+00-0",
        },
        toObj: {
          wt: "0.008",
          size: "1.20",
          sieve: "+1.5-2",
        },
        shape: "round",
        title: "0.005 - 0.008",
        from: "0.005",
        to: "0.008",
      },
      "1673432642_lhWlS": {
        id: "1673432642_lhWlS",
        fromObj: {
          wt: "0.008",
          size: "1.20",
          sieve: "+1.5-2",
        },
        toObj: {
          wt: "0.009",
          size: "1.25",
          sieve: "+2-2.5",
        },
        shape: "round",
        title: "test",
        from: "0.008",
        to: "0.009",
      },
      "1673820396_gbZNE": {
        id: "1673820396_gbZNE",
        fromObj: {
          wt: "0.009",
          size: "1.25",
          sieve: "+2-2.5",
        },
        toObj: {
          wt: "0.01",
          size: "1.30",
          sieve: "+2.5-3",
        },
        shape: "round",
        title: "test",
        from: "0.009",
        to: "0.01",
      },
      "1673942247_AScpo": {
        id: "1673942247_AScpo",
        fromObj: {
          wt: "0.011",
          size: "1.35",
          sieve: "+3-3.5",
        },
        toObj: {
          wt: "0.05",
          size: "2.30",
          sieve: "+9-9.5",
        },
        shape: "round",
        title: "0.0046",
        from: "0.011",
        to: "0.05",
      },
      "1673954777_dXHWT": {
        id: "1673954777_dXHWT",
        fromObj: {
          wt: "0.01",
          size: "1.30",
          sieve: "+2.5-3",
        },
        toObj: {
          wt: "0.05",
          size: "2.30",
          sieve: "+9-9.5",
        },
        title: "0.1 to 0.10",
        shape: "round",
        from: "0.01",
        to: "0.05",
      },
      "1673968467_oIN1E": {
        id: "1673968467_oIN1E",
        fromObj: {
          wt: "0.10",
          size: "3.00",
          sieve: "+12-12.5",
        },
        toObj: {
          wt: "0.15",
          size: "3.30",
          sieve: "+14.5-15",
        },
        shape: "round",
        from: "0.10",
        to: "0.15",
      },
      "1673968569_eTe7l": {
        id: "1673968569_eTe7l",
        fromObj: {
          wt: "0.15",
          size: "3.30",
          sieve: "+14.5-15",
        },
        toObj: {
          wt: "0.16",
          size: "3.30",
          sieve: "+14.5-15",
        },
        shape: "round",
        title: "0.15 to 0.16 ct",
        from: "0.15",
        to: "0.16",
      },
      "1674479846_1rmrf": {
        id: "1674479846_1rmrf",
        fromObj: {
          wt: "0.60",
          size: "5.40",
          sieve: "",
        },
        toObj: {
          wt: "0.70",
          size: "5.70",
          sieve: "",
        },
        title: "newwww",
        shape: "round",
        from: "0.60",
        to: "0.70",
      },
      "1675488076_XGihC": {
        id: "1675488076_XGihC",
        fromObj: {
          wt: "0.044",
          size: "2.20",
          sieve: "+8.5-9",
        },
        toObj: {
          wt: "0.075",
          size: "2.60",
          sieve: "+10.5-11",
        },
        title: "0.044- 0.075",
        shape: "round",
        from: "0.044",
        to: "0.075",
      },
      "1675925312_ngHNf": {
        id: "1675925312_ngHNf",
        fromObj: {
          wt: "0.21",
          size: "3.80",
          sieve: "",
        },
        toObj: {
          wt: "0.26",
          size: "4.00",
          sieve: "",
        },
        title: "new",
        shape: "round",
        from: "0.21",
        to: "0.26",
      },
      "1675926633_0HpGL": {
        id: "1675926633_0HpGL",
        fromObj: {
          wt: "0.17",
          size: "3.50",
          sieve: "+15-15.5",
        },
        toObj: {
          wt: "0.26",
          size: "4.00",
          sieve: "",
        },
        title: "0.17-0.26",
        shape: "round",
        from: "0.17",
        to: "0.26",
      },
      "1676027666_bFecd": {
        id: "1676027666_bFecd",
        fromObj: {
          wt: "0.002",
          size: "0.7",
          sieve: "+00000-0000",
        },
        toObj: {
          wt: "8.05",
          size: "",
        },
        title: "Round 1",
        shape: "round",
        from: "0.002",
        to: "8.05",
      },
      "1676382457_AWncx": {
        id: "1676382457_AWncx",
        fromObj: {
          wt: 0.5,
        },
        toObj: {
          wt: 0.55,
        },
        title: "0.77-0.85",
        shape: "fancy",
        from: "0.5",
        to: "0.55",
      },
      "1679983938_4Qhny": {
        id: "1679983938_4Qhny",
        fromObj: {
          wt: "0.070",
        },
        toObj: {
          wt: "0.072",
        },
        title: "0.07- 0.027",
        shape: "heart",
        from: "0.070",
        to: "0.072",
      },
      "1695803294_Vt06a": {
        id: "1695803294_Vt06a",
        fromObj: {
          wt: 1,
        },
        toObj: {
          wt: "8.00",
        },
        title: "trapezoid",
        shape: "trapezoid",
        from: "1.00",
        to: "8.00",
      },
      "1695968900_m9Be2": {
        id: "1695968900_m9Be2",
        fromObj: {
          wt: "0.1",
        },
        toObj: {
          wt: 0.9,
        },
        title: "123",
        shape: "halfmoon",
        from: "0.1",
        to: "0.9",
      },
      "1698134765_C1OwO": {
        id: "1698134765_C1OwO",
        fromObj: {
          wt: "0.001",
        },
        toObj: {
          wt: "0.009",
        },
        title: "Oval -0.001-0.009",
        shape: "oval",
        from: "0.001",
        to: "0.009",
      },
    },
    tax: 3,
  })
);

module.exports = {
  getProductPrice,
  getDiamondRate,
  getGemstoneRate,
  getAllLabourMasterPricing,
};
