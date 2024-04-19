const commodities = [
  {
    id: 902,
    itemgroup: "commodities",
    name: "Aluminum",
    classification: "Trivalent Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 2702,
    size: 1,
    manufacturer: "",
    identifier: "Al",
    meltingpoint: 660,
    gravitysignature: 3,
  },
  {
    id: 949,
    itemgroup: "commodities",
    name: "Ammunition",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 8000,
    size: 1,
    manufacturer: "",
    identifier: "Ammo",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 903,
    itemgroup: "commodities",
    name: "Antimony",
    classification: "Metalloid Element",
    techlevel: 0,
    rating: 0,
    mass: 6684,
    size: 1,
    manufacturer: "",
    identifier: "Sb",
    meltingpoint: 630,
    gravitysignature: 7,
  },
  {
    id: 958,
    itemgroup: "commodities",
    name: "Armor",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 8200,
    size: 1,
    manufacturer: "",
    identifier: "Armor",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 904,
    itemgroup: "commodities",
    name: "Barium",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 3510,
    size: 1,
    manufacturer: "",
    identifier: "Ba",
    meltingpoint: 725,
    gravitysignature: 4,
  },
  {
    id: 905,
    itemgroup: "commodities",
    name: "Boron",
    classification: "Metalloid Element",
    techlevel: 0,
    rating: 0,
    mass: 2340,
    size: 1,
    manufacturer: "",
    identifier: "B",
    meltingpoint: 2180,
    gravitysignature: 2,
  },
  {
    id: 936,
    itemgroup: "commodities",
    name: "CPUs",
    classification: "Computing Material",
    techlevel: 0,
    rating: 0,
    mass: 650,
    size: 1,
    manufacturer: "",
    identifier: "CPU",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 946,
    itemgroup: "commodities",
    name: "Carbon",
    classification: "Element",
    techlevel: 0,
    rating: 0,
    mass: 2620,
    size: 1,
    manufacturer: "",
    identifier: "C",
    meltingpoint: 900,
    gravitysignature: 12,
  },
  {
    id: 906,
    itemgroup: "commodities",
    name: "Cesium",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 1873,
    size: 1,
    manufacturer: "",
    identifier: "Cs",
    meltingpoint: 28,
    gravitysignature: 2,
  },
  {
    id: 940,
    itemgroup: "commodities",
    name: "Chemicals",
    classification: "Construction Material",
    techlevel: 0,
    rating: 0,
    mass: 650,
    size: 1,
    manufacturer: "",
    identifier: "CH",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 907,
    itemgroup: "commodities",
    name: "Chromium",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 7190,
    size: 1,
    manufacturer: "",
    identifier: "Cr",
    meltingpoint: 1857,
    gravitysignature: 7,
  },
  {
    id: 909,
    itemgroup: "commodities",
    name: "Cobalt",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 8900,
    size: 1,
    manufacturer: "",
    identifier: "Co",
    meltingpoint: 1495,
    gravitysignature: 9,
  },
  {
    id: 951,
    itemgroup: "commodities",
    name: "Composites",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 1800,
    size: 1,
    manufacturer: "",
    identifier: "Com",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 995,
    itemgroup: "commodities",
    name: "Conflux Biomass",
    classification: "BioMaterial",
    techlevel: 0,
    rating: 0,
    mass: 100,
    size: 1,
    manufacturer: "",
    identifier: "",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 941,
    itemgroup: "commodities",
    name: "Construction Materials",
    classification: "Construction Material",
    techlevel: 0,
    rating: 0,
    mass: 650,
    size: 1,
    manufacturer: "",
    identifier: "CM",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 908,
    itemgroup: "commodities",
    name: "Copper",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 8960,
    size: 1,
    manufacturer: "",
    identifier: "Cu",
    meltingpoint: 1083,
    gravitysignature: 9,
  },
  {
    id: 937,
    itemgroup: "commodities",
    name: "Electronics",
    classification: "Computing Material",
    techlevel: 0,
    rating: 0,
    mass: 650,
    size: 1,
    manufacturer: "",
    identifier: "EL",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 910,
    itemgroup: "commodities",
    name: "Erbium",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 8795,
    size: 1,
    manufacturer: "",
    identifier: "Er",
    meltingpoint: 1529,
    gravitysignature: 9,
  },
  {
    id: 948,
    itemgroup: "commodities",
    name: "Explosives",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 4200,
    size: 1,
    manufacturer: "",
    identifier: "Exp",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 959,
    itemgroup: "commodities",
    name: "Fiber Optics",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 670,
    size: 1,
    manufacturer: "",
    identifier: "FO",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 938,
    itemgroup: "commodities",
    name: "Fuel Cells",
    classification: "Fuel Source",
    techlevel: 0,
    rating: 0,
    mass: 650,
    size: 1,
    manufacturer: "",
    identifier: "FU",
    meltingpoint: 312,
    gravitysignature: 0,
  },
  {
    id: 911,
    itemgroup: "commodities",
    name: "Gallium",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 5907,
    size: 1,
    manufacturer: "",
    identifier: "Ga",
    meltingpoint: 30,
    gravitysignature: 6,
  },
  {
    id: 934,
    itemgroup: "commodities",
    name: "Gemwoods",
    classification: "Construction Material",
    techlevel: 0,
    rating: 0,
    mass: 90,
    size: 1,
    manufacturer: "",
    identifier: "GW",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 912,
    itemgroup: "commodities",
    name: "Germanium",
    classification: "Metalloid Element",
    techlevel: 0,
    rating: 0,
    mass: 5323,
    size: 1,
    manufacturer: "",
    identifier: "Ge",
    meltingpoint: 937,
    gravitysignature: 5,
  },
  {
    id: 913,
    itemgroup: "commodities",
    name: "Gold",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 19320,
    size: 1,
    manufacturer: "",
    identifier: "Au",
    meltingpoint: 1064,
    gravitysignature: 19,
  },
  {
    id: 901,
    itemgroup: "commodities",
    name: "Grain",
    classification: "Staple Life Source",
    techlevel: 0,
    rating: 0,
    mass: 930,
    size: 1,
    manufacturer: "",
    identifier: "GRN",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 955,
    itemgroup: "commodities",
    name: "Gravitational Components",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 3600,
    size: 1,
    manufacturer: "",
    identifier: "GravC",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 943,
    itemgroup: "commodities",
    name: "Helium",
    classification: "Noble Gas",
    techlevel: 0,
    rating: 0,
    mass: 892,
    size: 1,
    manufacturer: "",
    identifier: "He",
    meltingpoint: 272,
    gravitysignature: 0,
  },
  {
    id: 914,
    itemgroup: "commodities",
    name: "Indium",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 7310,
    size: 1,
    manufacturer: "",
    identifier: "In",
    meltingpoint: 157,
    gravitysignature: 7,
  },
  {
    id: 915,
    itemgroup: "commodities",
    name: "Iridium",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 22500,
    size: 1,
    manufacturer: "",
    identifier: "Ir",
    meltingpoint: 2410,
    gravitysignature: 22,
  },
  {
    id: 916,
    itemgroup: "commodities",
    name: "Iron",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 7860,
    size: 1,
    manufacturer: "",
    identifier: "Fe",
    meltingpoint: 1535,
    gravitysignature: 8,
  },
  {
    id: 947,
    itemgroup: "commodities",
    name: "Laser Components",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 1300,
    size: 1,
    manufacturer: "",
    identifier: "LC",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 917,
    itemgroup: "commodities",
    name: "Lithium",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 530,
    size: 1,
    manufacturer: "",
    identifier: "Li",
    meltingpoint: 181,
    gravitysignature: 1,
  },
  {
    id: 953,
    itemgroup: "commodities",
    name: "Machined Parts",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 3800,
    size: 1,
    manufacturer: "",
    identifier: "MP",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 918,
    itemgroup: "commodities",
    name: "Magnesium",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 1738,
    size: 1,
    manufacturer: "",
    identifier: "Mg",
    meltingpoint: 649,
    gravitysignature: 2,
  },
  {
    id: 954,
    itemgroup: "commodities",
    name: "Magnetics",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 1780,
    size: 1,
    manufacturer: "",
    identifier: "Mag",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 932,
    itemgroup: "commodities",
    name: "Manufactured Foods",
    classification: "Staple Life Source",
    techlevel: 0,
    rating: 0,
    mass: 450,
    size: 1,
    manufacturer: "",
    identifier: "MF",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 933,
    itemgroup: "commodities",
    name: "Medical Supplies",
    classification: "Life Repair",
    techlevel: 0,
    rating: 0,
    mass: 650,
    size: 1,
    manufacturer: "",
    identifier: "MED",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 919,
    itemgroup: "commodities",
    name: "Molybdenum",
    classification: "Transition Element",
    techlevel: 0,
    rating: 0,
    mass: 10220,
    size: 1,
    manufacturer: "",
    identifier: "Mo",
    meltingpoint: 2610,
    gravitysignature: 10,
  },
  {
    id: 956,
    itemgroup: "commodities",
    name: "Natural Products",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 850,
    size: 1,
    manufacturer: "",
    identifier: "NP",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 945,
    itemgroup: "commodities",
    name: "Nitrogen",
    classification: "Gas",
    techlevel: 0,
    rating: 0,
    mass: 1250,
    size: 1,
    manufacturer: "",
    identifier: "N",
    meltingpoint: 210,
    gravitysignature: 1,
  },
  {
    id: 962,
    itemgroup: "commodities",
    name: "Octavia Light",
    classification: "Staple Life Source",
    techlevel: 0,
    rating: 0,
    mass: 1200,
    size: 1,
    manufacturer: "",
    identifier: "OBR",
    meltingpoint: 0,
    gravitysignature: 1,
  },
  {
    id: 950,
    itemgroup: "commodities",
    name: "Optics",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 1700,
    size: 1,
    manufacturer: "",
    identifier: "Op",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 931,
    itemgroup: "commodities",
    name: "Organic Foods",
    classification: "Staple Life Source",
    techlevel: 0,
    rating: 0,
    mass: 450,
    size: 1,
    manufacturer: "",
    identifier: "OF",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 920,
    itemgroup: "commodities",
    name: "Palladium",
    classification: "Transition Element",
    techlevel: 0,
    rating: 0,
    mass: 12020,
    size: 1,
    manufacturer: "",
    identifier: "Pd",
    meltingpoint: 1554,
    gravitysignature: 12,
  },
  {
    id: 921,
    itemgroup: "commodities",
    name: "Phosphorous",
    classification: "Nonmetallic Element",
    techlevel: 0,
    rating: 0,
    mass: 1820,
    size: 1,
    manufacturer: "",
    identifier: "P",
    meltingpoint: 44,
    gravitysignature: 2,
  },
  {
    id: 922,
    itemgroup: "commodities",
    name: "Platinum",
    classification: "Transition Element",
    techlevel: 0,
    rating: 0,
    mass: 21450,
    size: 1,
    manufacturer: "",
    identifier: "Pt",
    meltingpoint: 1772,
    gravitysignature: 22,
  },
  {
    id: 923,
    itemgroup: "commodities",
    name: "Plutonium",
    classification: "Radioactive Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 19840,
    size: 1,
    manufacturer: "",
    identifier: "Pu",
    meltingpoint: 641,
    gravitysignature: 20,
  },
  {
    id: 960,
    itemgroup: "commodities",
    name: "Power Converters",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 2400,
    size: 1,
    manufacturer: "",
    identifier: "PC",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 942,
    itemgroup: "commodities",
    name: "Prosthetics",
    classification: "",
    techlevel: 0,
    rating: 0,
    mass: 1,
    size: 1,
    manufacturer: "",
    identifier: "",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 961,
    itemgroup: "commodities",
    name: "Proximity Fuses",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 1800,
    size: 1,
    manufacturer: "",
    identifier: "PF",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 997,
    itemgroup: "commodities",
    name: "Quanus Ice",
    classification: "Staple Life Source",
    techlevel: 0,
    rating: 0,
    mass: 1200,
    size: 1,
    manufacturer: "",
    identifier: "QBR",
    meltingpoint: 0,
    gravitysignature: 1,
  },
  {
    id: 935,
    itemgroup: "commodities",
    name: "RAM",
    classification: "Computing Material",
    techlevel: 0,
    rating: 0,
    mass: 650,
    size: 1,
    manufacturer: "",
    identifier: "RAM",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 957,
    itemgroup: "commodities",
    name: "RF Transceivers",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 710,
    size: 1,
    manufacturer: "",
    identifier: "RFT",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 924,
    itemgroup: "commodities",
    name: "Radium",
    classification: "Radioactive Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 5000,
    size: 1,
    manufacturer: "",
    identifier: "Ra",
    meltingpoint: 700,
    gravitysignature: 6,
  },
  {
    id: 926,
    itemgroup: "commodities",
    name: "Silicon",
    classification: "Metalloid Element",
    techlevel: 0,
    rating: 0,
    mass: 2329,
    size: 1,
    manufacturer: "",
    identifier: "Si",
    meltingpoint: 1410,
    gravitysignature: 2,
  },
  {
    id: 925,
    itemgroup: "commodities",
    name: "Silver",
    classification: "Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 10500,
    size: 1,
    manufacturer: "",
    identifier: "Ag",
    meltingpoint: 962,
    gravitysignature: 11,
  },
  {
    id: 996,
    itemgroup: "commodities",
    name: "Solrain Stout",
    classification: "Staple Life Source",
    techlevel: 0,
    rating: 0,
    mass: 1200,
    size: 1,
    manufacturer: "",
    identifier: "SBR",
    meltingpoint: 0,
    gravitysignature: 1,
  },
  {
    id: 952,
    itemgroup: "commodities",
    name: "Synthetics",
    classification: "Components",
    techlevel: 0,
    rating: 0,
    mass: 5400,
    size: 1,
    manufacturer: "",
    identifier: "Sy",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 939,
    itemgroup: "commodities",
    name: "Textiles",
    classification: "Construction Material",
    techlevel: 0,
    rating: 0,
    mass: 650,
    size: 1,
    manufacturer: "",
    identifier: "TX",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 927,
    itemgroup: "commodities",
    name: "Titanium",
    classification: "Transition Element",
    techlevel: 0,
    rating: 0,
    mass: 4540,
    size: 1,
    manufacturer: "",
    identifier: "",
    meltingpoint: 1660,
    gravitysignature: 5,
  },
  {
    id: 998,
    itemgroup: "commodities",
    name: "Trap",
    classification: "Cargo Bomb",
    techlevel: 0,
    rating: 0,
    mass: 250,
    size: 1,
    manufacturer: "",
    identifier: "UXB",
    meltingpoint: 0,
    gravitysignature: 0,
  },
  {
    id: 928,
    itemgroup: "commodities",
    name: "Uranium",
    classification: "Radioactive Metallic Element",
    techlevel: 0,
    rating: 0,
    mass: 18950,
    size: 1,
    manufacturer: "",
    identifier: "U",
    meltingpoint: 1132,
    gravitysignature: 19,
  },
  {
    id: 929,
    itemgroup: "commodities",
    name: "Vanadium",
    classification: "Transition Element",
    techlevel: 0,
    rating: 0,
    mass: 5800,
    size: 1,
    manufacturer: "",
    identifier: "V",
    meltingpoint: 1890,
    gravitysignature: 6,
  },
  {
    id: 900,
    itemgroup: "commodities",
    name: "Water",
    classification: "Staple Life Source",
    techlevel: 0,
    rating: 0,
    mass: 1000,
    size: 1,
    manufacturer: "",
    identifier: "H2O",
    meltingpoint: 0,
    gravitysignature: 1,
  },
  {
    id: 944,
    itemgroup: "commodities",
    name: "Xenon",
    classification: "Noble Gas",
    techlevel: 0,
    rating: 0,
    mass: 5897,
    size: 1,
    manufacturer: "",
    identifier: "Xe",
    meltingpoint: 112,
    gravitysignature: 6,
  },
  {
    id: 930,
    itemgroup: "commodities",
    name: "Zinc",
    classification: "Transition Element",
    techlevel: 0,
    rating: 0,
    mass: 7130,
    size: 1,
    manufacturer: "",
    identifier: "Zn",
    meltingpoint: 420,
    gravitysignature: 7,
  },
];
export default commodities;
