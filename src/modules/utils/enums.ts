export enum sortByEnum {
  LowHigh = 'LowHigh',
  HighLow = 'HighLow',
}

export enum CategoriesEnum {
  'case-accessory' = 'case-accessory',
  'case-fan' = 'case-fan',
  'case' = 'case',
  'cpu-cooler' = 'cpu-cooler',
  'cpu' = 'cpu',
  'external-hard-drive' = 'external-hard-drive',
  'fan-controller' = 'fan-controller',
  'headphones' = 'headphones',
  'internal-hard-drive' = 'internal-hard-drive',
  'keyboard' = 'keyboard',
  'memory' = 'memory',
  'monitor' = 'monitor',
  'motherboard' = 'motherboard',
  'mouse' = 'mouse',
  'optical-drive' = 'optical-drive',
  'os' = 'os',
  'power-supply' = 'power-supply',
  'sound-card' = 'sound-card',
  'speakers' = 'speakers',
  'thermal-paste' = 'thermal-paste',
  'ups' = 'ups',
  'video-card' = 'video-card',
  'webcam' = 'webcam',
  'wired-network-card' = 'wired-network-card',
  'wireless-network-card' = 'wireless-network-card',
}

export enum CaseFormFactorEnum {
  'ATX Full Tower' = 0,
  'ATX Desktop' = 1,
  'ATX Mid Tower' = 2,
  'MicroATX Mid Tower' = 3,
  'MicroATX Mini Tower' = 3,
  'Mini ITX Desktop' = 4,
  'Mini ITX Tower' = 4,
}

export enum MotherboardFormFactorEnum {
  'XL ATX' = 0,
  'EATX' = 1,
  'ATX' = 2,
  'Micro ATX' = 3,
  'Flex ATX' = 3,
  'Mini ITX' = 4,
  'Thin Mini ITX' = 4,
}

export enum CPUSocketDDRSupportEnum {
  'AM5' = 'DDR5',
  'AM4' = 'DDR4',
  'LGA 1200' = 'DDR4',
  'LGA 1151' = 'DDR4',
  'LGA 1700' = 'DDR5 || DDR4', // Could be either
  'LGA 2066' = 'DDR4',
  'TR4' = 'DDR4', // Threadripper
  'sTRX4' = 'DDR4', // Threadripper PRO
  'LGA 2011' = 'DDR3',
  'FM2+' = 'DDR3',
}

export enum GPUChipsetTDP {
  'NVIDIA RTX 3080' = 320,
  'AMD RX 6800 XT' = 300,
  'NVIDIA RTX 3070' = 220,
  'AMD RX 6700 XT' = 230,
  'NVIDIA GTX 1660 Super' = 125,
  'AMD RX 580' = 185,
  'NVIDIA RTX 3090' = 350,
  'AMD RX 6900 XT' = 300,
  'NVIDIA RTX 3060' = 170,
  'AMD RX 5600 XT' = 150,
  'NVIDIA RTX 4080' = 320,
  'NVIDIA RTX 4090' = 450,
  'NVIDIA RTX 4070 Ti' = 285,
  'NVIDIA RTX 4060 Ti' = 220,
  'AMD RX 5700 XT' = 225,
  'NVIDIA GTX 1080 Ti' = 250,
  'AMD RX 5500 XT' = 130,
  'NVIDIA RTX 3050' = 130,
  'AMD RX 6600' = 132,
  'NVIDIA GTX 1050 Ti' = 75,
  'AMD RX 6500 XT' = 107,
  'NVIDIA GTX 1650 Super' = 100,
  'AMD RX 5300' = 100,
}
