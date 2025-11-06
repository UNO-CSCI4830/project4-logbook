export let role = 'user';

type ApplianceDataType = {
    id: number;
    name: string;
    brand: string;
    model: string;
    category: string;
    serialNumber: string;
    purchaseDate: string;
    warrantyMonths: number;
    conditionText: string;
    notes: string;
};

export const ApplianceData: ApplianceDataType[] = [
    {
    id: 1,
    name: "Samsung Refrigerator",
    brand: "Samsung",
    model: "RF28T5001SR",
    category: "Appliance",
    serialNumber: "SNX23904A12",
    purchaseDate: "2022-04-15",
    warrantyMonths: 124,
    conditionText: "Good",
    notes: "Refrigerator making slight humming noise"
    },
  {
    id: 2,
    name: "LG OLED TV",
    brand: "LG",
    model: "OLED55C1PUB",
    category: "Electronics",
    serialNumber: "LGTV99823XZ",
    purchaseDate: "2023-02-01",
    warrantyMonths: 36,
    conditionText: "New",
    notes: "TV mounted in living room, comes with magic remote",
  },
  {
    id: 3,
    name: "Whirlpool Dishwasher",
    brand: "Whirlpool",
    model: "WDT730PAHZ",
    category: "Appliance",
    serialNumber: "WHP20230115A",
    purchaseDate: "2021-10-20",
    warrantyMonths: 60,
    conditionText: "Fair",
    notes: "Dishwasher occasionally leaves water spots",
  },
  {
    id: 4,
    name: "Tesla Model Y",
    brand: "Tesla",
    model: "Model Y",
    category: "Vehicle",
    serialNumber: "5YJYGDEE8MF093244",
    purchaseDate: "2020-07-12",
    warrantyMonths: 96,
    conditionText: "Good",
    notes: "Battery at 90% health, updated autopilot system",
  },
  {
    id: 5,
    name: "PlayStation 5",
    brand: "PlayStation",
    model: "PS5",
    category: "Gaming",
    serialNumber: "PS5093842SN",
    purchaseDate: "2022-11-25",
    warrantyMonths: 24,
    conditionText: "Good",
    notes: "Occasionally loud fan during gameplay",
  },
  {
    id: 6,
    name: "Dyson Vacuum",
    brand: "Dyson",
    model: "V12 Detect Slim",
    category: "Appliance",
    serialNumber: "DY20240315",
    purchaseDate: "2024-03-15",
    warrantyMonths: 24,
    conditionText: "New",
    notes: "Cordless vacuum, excellent battery life",
  },
  {
    id: 7,
    name: "MacBook Pro",
    brand: "Apple",
    model: "MacBook Pro M3",
    category: "Electronics",
    serialNumber: "MBP20240130SN",
    purchaseDate: "2024-01-30",
    warrantyMonths: 12,
    conditionText: "New",
    notes: "Used for programming, pristine condition",
  },
]
