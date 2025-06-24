export function calculateTaxes({ revenue, deductions, state }) {
  const taxableIncome = revenue - deductions; // yearly inputs assumed

  const federalBrackets = [
    { cap: 11600, rate: 0.10 },
    { cap: 47150, rate: 0.12 },
    { cap: 100525, rate: 0.22 },
    { cap: 191950, rate: 0.24 },
    { cap: 243725, rate: 0.32 },
    { cap: 609350, rate: 0.35 },
    { cap: Infinity, rate: 0.37 },
  ];

  let federalTax = 0;
  let remaining = taxableIncome;
  let previousCap = 0;

  for (const bracket of federalBrackets) {
    if (taxableIncome <= previousCap) break;

    const incomeInBracket = Math.min(bracket.cap - previousCap, remaining);
    federalTax += incomeInBracket * bracket.rate;
    remaining -= incomeInBracket;
    previousCap = bracket.cap;
  }

  const caBrackets = [
    { cap: 10100, rate: 0.01 },
    { cap: 23942, rate: 0.02 },
    { cap: 37788, rate: 0.04 },
    { cap: 52455, rate: 0.06 },
    { cap: 66295, rate: 0.08 },
    { cap: 338639, rate: 0.093 },
    { cap: 406364, rate: 0.103 },
    { cap: 677275, rate: 0.113 },
    { cap: 1000000, rate: 0.123 },
    { cap: Infinity, rate: 0.133 },
  ];

  const stateRates = {
    AL: 0.04, AK: 0.0, AZ: 0.056, AR: 0.065,
    CO: 0.029, CT: 0.0635, DE: 0.0, FL: 0.06, GA: 0.04,
    HI: 0.04, ID: 0.06, IL: 0.0625, IN: 0.07, IA: 0.06,
    KS: 0.065, KY: 0.06, LA: 0.0445, ME: 0.055, MD: 0.06,
    MA: 0.0625, MI: 0.06, MN: 0.0688, MS: 0.07, MO: 0.0425,
    MT: 0.0, NE: 0.055, NV: 0.0685, NH: 0.0, NJ: 0.0663,
    NM: 0.0513, NY: 0.04, NC: 0.0475, ND: 0.05, OH: 0.0575,
    OK: 0.045, OR: 0.0, PA: 0.06, RI: 0.07, SC: 0.06,
    SD: 0.045, TN: 0.07, TX: 0.0625, UT: 0.061, VT: 0.06,
    VA: 0.053, WA: 0.065, WV: 0.06, WI: 0.05, WY: 0.04, DC: 0.06
  };

  let stateTax = 0;

  if (state === 'CA') {
    remaining = taxableIncome;
    previousCap = 0;

    for (const bracket of caBrackets) {
      if (taxableIncome <= previousCap) break;

      const incomeInBracket = Math.min(bracket.cap - previousCap, remaining);
      stateTax += incomeInBracket * bracket.rate;
      remaining -= incomeInBracket;
      previousCap = bracket.cap;
    }
  } else {
    const flatRate = stateRates[state] ?? 0;
    stateTax = taxableIncome * flatRate;
  }

  const totalTax = federalTax + stateTax;

  return {
    taxableIncome,
    federalTax,
    stateTax,
    totalTax,
  };
}
