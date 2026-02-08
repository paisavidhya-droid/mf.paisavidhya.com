export * from "./theme";

export const fontSize = {
  h0: 45,
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 16,
  h6: 14,
  p: 12,
  h7: 10,
};

export const screenSizes = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const graphColors = ["#fe769c", "#46a0f8", "#c3f439", "#88dabc", "#e43433"];

export type OrderType = "transaction" | "redeem" | "switch" | "stp" | "swp" | "lumpsum";

export type HoldingsSourceType = "internal" | "external" | "combined";

export const monthOptions = [
  { name: "January", value: 0 },
  { name: "February", value: 1 },
  { name: "March", value: 2 },
  { name: "April", value: 3 },
  { name: "May", value: 4 },
  { name: "June", value: 5 },
  { name: "July", value: 6 },
  { name: "August", value: 7 },
  { name: "September", value: 8 },
  { name: "October", value: 9 },
  { name: "November", value: 10 },
  { name: "December", value: 11 },
];

export const redeemByOptions = [
  { name: "All Units", value: "ALL_UNITS" },
  { name: "Units", value: "UNITS" },
  { name: "Amount", value: "AMOUNT" },
];

export const holdingsSourceOptions = [
  { name: "Nivesh Star", value: "internal" },
  { name: "Outside", value: "external" },
  { name: "All", value: "combined" },
];

export type dropDownValueType = {
  name: string | number;
  value: string | number;
};

export const ifscInfoApi = "https://ifsc.razorpay.com/";

export const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const numberRegex = /^[0-9]*$/;

export const phoneRegex = /^[6-9]\d{9}$/;

export const nameRegex = /^[a-zA-Z\s]+$/;

export const panNumberRegex = /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]$/;

export const upiIdRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;

export const plans = [
  {
    title: "Child Education Plan",
    excerpt:
      "Planting Seeds of Future Success: Nurture your child's dreams with our tailored investment plan, ensuring a bountiful harvest of education and opportunities.",
    listText: ["10-12% historical growth", "Prepare for higher education costs", "No lock-in"],
    navigate: {
      baseScreen: "plans",
      screen: "child-education-plan",
    },
  },
  {
    title: "Retirement Plan",
    excerpt:
      "Crafting Your Golden Years: Embrace the future you envision with our meticulously designed retirement plan, paving the way for a secure and fulfilling journey ahead.",
    listText: ["10-12% historical growth", "Secure Your Financial Independence for Retirement", "No lock-in"],
    navigate: {
      baseScreen: "plans",
      screen: "retirement-plan",
    },
  },
  {
    title: "Marriage Plan",
    excerpt:
      "Love, Commitment, and Financial Flourish: Unite your dreams with our marriage investment plan, a foundation for a lifetime of shared happiness and financial harmony.",
    listText: ["10-12% historical growth", "Craft Your Dream Wedding and Begin Your Journey Together", "No lock-in"],
    navigate: {
      baseScreen: "plans",
      screen: "marriage-plan",
    },
  },
  {
    title: "House Purchase Plan",
    excerpt:
      "From Dreams to Keys: Explore the path to homeownership with our comprehensive house purchase plan, guiding you towards the door of your very own abode.",
    listText: ["10-12% historical growth", "Navigate Your Path to Homeownership with Confidence", "No lock-in"],
    navigate: {
      baseScreen: "plans",
      screen: "house-purchase-plan",
    },
  },
  {
    title: "Dream Planner",
    excerpt:
      "Your Goals like next vacation, dream car, or your wedding, Our Guiding Steps: Embark on a transformative journey with our versatile goal plan, designed to turn your aspirations into remarkable achievements, one strategic move at a time.",
    listText: [
      "10-12% historical growth",
      "Transform Your Dreams into Reality: Your Personal Dream Planner",
      "No lock-in",
    ],
    navigate: {
      baseScreen: "plans",
      screen: "dream-planner",
    },
  },
];

export const returnStringMap = {
  yrs2: "2 Years",
  yrs1: "1 Year",
  mths6: "6 Months",
  mths1: "1 Month",
  days1: "1 Day",
};

export const returnsOptions = [
  { value: "yrs2", name: "2 Years" },
  { value: "yrs1", name: "1 Year" },
  { value: "mths6", name: "6 Months" },
  { value: "mths1", name: "1 Month" },
  { value: "days1", name: "1 Day" },
];

export const occupationOptions = [
  { value: "BUSINESS", name: "Business" },
  { value: "PROFESSIONAL", name: "Professional" },
  { value: "SERVICE", name: "Service" },
  { value: "AGRICULTURIST", name: "Agriculture" },
  { value: "RETIRED", name: "Retired" },
  { value: "HOUSEWIFE", name: "Housewife" },
  { value: "STUDENT", name: "Student" },
  { value: "OTHERS", name: "Others" },
];

export const sipCancelReasonOptions = [
  { value: "NON_AVAILABILITY_OF_FUNDS", name: "Non availability of Funds" },
  { value: "SCHEME_NOT_PERFORMING", name: "Scheme not performing" },
  { value: "SERVICE_ISSUE", name: "Service issue" },
  { value: "LOAD_REVISED", name: "Load Revised" },
  { value: "WISH_TO_INVEST_IN_OTHER_SCHEMES", name: "Wish to invest in other schemes" },
  { value: "CHANGE_IN_FUND_MANAGER", name: "Change in Fund Manager" },
  { value: "GOAL_ACHIEVED", name: "Goal Achieved" },
  { value: "NOT_COMFORTABLE_WITH_MARKET_VOLATILITY", name: "Not comfortable with market volatility" },
  { value: "WILL_BE_RESTARTING_SIP_AFTER_FEW_MONTHS", name: "Will be restarting SIP after few months" },
  { value: "MODIFICATIONS_IN_BANK_MANDATE_DATE_ETC", name: "Modifications in bank/mandate/date etc" },
  { value: "I_HAVE_DECIDED_TO_INVEST_ELSEWHERE", name: "I have decided to invest elsewhere" },
  { value: "THIS_IS_NOT_THE_RIGHT_TIME_TO_INVEST", name: "This is not the right time to invest" },
  { value: "OTHERS", name: "Others (pls specify the reason)" },
];

export const partnerOccupationOptions = [
  { value: "business", name: "Business" },
  { value: "professional", name: "Professional" },
  { value: "service", name: "Services" },
  { value: "agriculture", name: "Agriculture" },
  { value: "retired", name: "Retired" },
  { value: "house_wife", name: "Housewife" },
  { value: "student", name: "Student" },
  { value: "public_sector_service", name: "PublicSectorService" },
  { value: "private_sector_service", name: "PrivateSectorService" },
  { value: "government_service", name: "GovernmentService" },
  { value: "doctor", name: "Doctor" },
  { value: "forex_dealer", name: "ForexDealer" },
  { value: "others", name: "Others" },
];

export const sourceOfWealthOptions = [
  { value: "SALARY", name: "Salary" },
  { value: "BUSINESS", name: "Business" },
  { value: "GIFT", name: "Gift" },
  { value: "ANCESTRAL_PROPERTY", name: "Ancestral property" },
  { value: "RENTAL_INCOME", name: "Rental income" },
  { value: "PRIZE_MONEY", name: "Prize money" },
  { value: "ROYALTY", name: "Royalty" },
  { value: "OTHERS", name: "Others" },
];

export const incomeSlabOptions = [
  { value: "BELOW_1_LAKH", name: "< 1 Lakh" },
  { value: "FROM_1_TO_5_LAKHS", name: "1 - 5 Lakhs" },
  { value: "FROM_5_TO_10_LAKHS", name: "5 - 10 Lakhs" },
  { value: "FROM_10_TO_25_LAKHS", name: "10 - 25 Lakhs" },
  { value: "FROM_25_LAKHS_TO_1_CRORE", name: "25 Lakhs - 1 Crore" },
  { value: "ABOVE_1_CRORE", name: "> 1 Crore" },
];

export const taxStatusOptions = [
  { value: "INDIVIDUAL", name: "Individual" },
  { value: "NRE", name: "NRE" },
  { value: "NRO", name: "NRO" },
  // { value: "ON_BEHALF_OF_MINOR", name: "On Behalf of Minor" },
  // { value: "HUF", name: "HUF" },
  // { value: "COMPANY", name: "Company" },
  // { value: "AOP", name: "AOP" },
  // { value: "PARTNERSHIP_FIRM", name: "Partnership Firm" },
  // { value: "BODY_CORPORATE", name: "Body Corporate" },
  // { value: "TRUST", name: "Trust" },
  // { value: "SOCIETY", name: "Society" },
  // { value: "OTHERS", name: "Others" },
  // { value: "NRI_OTHERS", name: "NRI Others" },
  // { value: "DFI", name: "DFI" },
  // { value: "SOLE_PROPRIETORSHIP", name: "Sole Proprietorship" },
  // { value: "OCB", name: "OCB" },
  // { value: "FII", name: "FII" },
  // { value: "OVERSEAS_CORP_BODY_OTHERS", name: "Overseas Corporate Body Others" },
  // { value: "NRI_CHILD", name: "NRI Child" },
  // { value: "NRI_HUF_NRO", name: "NRI HUF (NRO)" },
  // { value: "NRI_MINOR_NRO", name: "NRI Minor (NRO)" },
  // { value: "NRI_HUF_NRE", name: "NRI HUF (NRE)" },
  // { value: "PROVIDENT_FUND", name: "Provident Fund" },
  // { value: "SUPER_ANNUATION_FUND", name: "Super Annuation Fund" },
  // { value: "GRATUITY_FUND", name: "Gratuity Fund" },
  // { value: "PENSION_FUND", name: "Pension Fund" },
  // { value: "MUTUAL_FUNDS_FOF_SCHEMES", name: "Mutual Funds – FoF Schemes" },
  // { value: "NPS_TRUST", name: "NPS Trust" },
  // { value: "GLOBAL_DEVELOPMENT_NETWORK", name: "Global Development Network" },
  // { value: "FCRA", name: "FCRA" },
  // { value: "QFI_INDIVIDUAL", name: "QFI Individual" },
  // { value: "QFI_MINORS", name: "QFI Minors" },
  // { value: "QFI_CORPORATE", name: "QFI Corporate" },
  // { value: "QFI_PENSION_FUNDS", name: "QFI Pension Funds" },
  // { value: "QFI_HEDGE_FUNDS", name: "QFI Hedge Funds" },
  // { value: "QFI_MUTUAL_FUNDS", name: "QFI Mutual Funds" },
  // { value: "LLP", name: "LLP" },
  // { value: "NON_PROFIT_ORGANIZATION_NPO", name: "Non-Profit Organization (NPO)" },
  // { value: "PUBLIC_LIMITED_COMPANY", name: "Public Limited Company" },
  // { value: "PRIVATE_LIMITED_COMPANY", name: "Private Limited Company" },
  // { value: "UNLISTED_COMPANY", name: "Unlisted Company" },
  // { value: "MUTUAL_FUNDS", name: "Mutual Funds" },
  // { value: "FPI_CATEGORY_I", name: "FPI Category I" },
  // { value: "FPI_CATEGORY_II", name: "FPI Category II" },
  // { value: "FPI_CATEGORY_III", name: "FPI Category III" },
  // { value: "FINANCIAL_INSTITUTIONS", name: "Financial Institutions" },
  // { value: "BODY_OF_INDIVIDUALS", name: "Body of Individuals" },
  // { value: "INSURANCE_COMPANY", name: "Insurance Company" },
  // { value: "OCI_REPATRIATION", name: "OCI Repatriation" },
  // { value: "OCI_NON_REPATRIATION", name: "OCI Non-Repatriation" },
  // { value: "PERSON_OF_INDIAN_ORIGIN", name: "Person of Indian Origin" },
  // { value: "GOVERNMENT_BODY", name: "Government Body" },
  // { value: "DEFENSE_ESTABLISHMENT", name: "Defense Establishment" },
  // { value: "NON_GOVERNMENT_ORGANISATION", name: "Non-Government Organisation" },
  // { value: "BANK_COOPERATIVE_BANK", name: "Bank / Cooperative Bank" },
  // { value: "ARTIFICIAL_JURIDICAL_PERSON", name: "Artificial Juridical Person" },
  // { value: "SEAFARER_NRE", name: "Seafarer (NRE)" },
  // { value: "SEAFARER_NRO", name: "Seafarer (NRO)" },
];

export const pepDetailsOptions = [
  { value: "YES", name: "Yes" },
  { value: "RELATIVE", name: "Related to politically exposed person" },
  { value: "NO", name: "No" },
];

export const genderOptions = [
  { value: "MALE", name: "Male" },
  { value: "FEMALE", name: "Female" },
  { value: "OTHER", name: "Other" },
];

export const martialStatusOptions = [
  { value: "MARRIED", name: "Married" },
  { value: "UNMARRIED", name: "Single" },
  { value: "OTHERS", name: "Others" },
];

export const bankAccountTypeOptions = [
  { name: "Savings", value: "SAVINGS_BANK" },
  { name: "Current", value: "CURRENT_BANK" },
  { name: "NRE", value: "NRE" },
  { name: "NRO", value: "NRO" },
];

export const amfiBroadOptions = [
  { name: "No filter", value: "" },
  { name: "Equity", value: "Equity" },
  { name: "Debt", value: "Debt" },
  { name: "Hybrid", value: "Hybrid" },
];

export const mutualFundsSortOptions = [
  { name: "None", value: "" },
  { name: "Scheme Name", value: "scheme_name" },
  { name: "AUM", value: "aum_in_lakhs" },
];

export const sortingOrderOptions = [
  { name: "Ascending", value: -1 },
  { name: "Descending", value: 1 },
];

export const portfoiloTypeOptions = [
  { name: "SIP", value: "SIP" },
  { name: "Lumpsum", value: "LUMPSUM" },
];

export const riskTypeOptions = [
  { name: "CONSERVATIVE", value: "CONSERVATIVE" },
  { name: "MODERATE", value: "MODERATE" },
  { name: "AGGRESSIVE", value: "AGGRESSIVE" },
];

export const nomineeIdentityTypeOptions = [
  { name: "Pan", value: "PAN" },
  { name: "Adhaar", value: "AADHAR_CARD" },
  { name: "Driving License", value: "DRIVING_LICENSE" },
];

export const reportTypeOptions = [
  { name: "Portfolio Report", value: "portfolio_report" },
  { name: "Capital Gains", value: "capital_gains" },
];

export const financialYearOptions = [
  { name: "2025", value: "2025" },
  { name: "2024", value: "2024" },
  { name: "2023", value: "2023" },
  { name: "2022", value: "2022" },
  { name: "2021", value: "2021" },
  { name: "2020", value: "2020" },
  { name: "2019", value: "2019" },
  { name: "2018", value: "2018" },
  { name: "2017", value: "2017" },
  { name: "2016", value: "2016" },
];

export const relationShipOptions = [
  { name: "Aunt", value: "AUNT" },
  { name: "Brother", value: "BROTHER" },
  { name: "Daughter", value: "DAUGHTER" },
  { name: "Daughter In Law", value: "DAUGHTER_IN_LAW" },
  { name: "Father", value: "FATHER" },
  { name: "Father In Law", value: "FATHER_IN_LAW" },
  { name: "Grand Daughter", value: "GRAND_DAUGHTER" },
  { name: "Grand Son", value: "GRAND_SON" },
  { name: "Grand Father", value: "GRAND_FATHER" },
  { name: "Grand Mother", value: "GRAND_MOTHER" },
  { name: "Husband", value: "HUSBAND" },
  { name: "Mother", value: "MOTHER" },
  { name: "Mother In Law", value: "MOTHER_IN_LAW" },
  { name: "Nephew", value: "NEPHEW" },
  { name: "Niece", value: "NIECE" },
  { name: "Friend", value: "FRIEND" },
  { name: "Sister", value: "SISTER" },
  { name: "Son", value: "SON" },
  { name: "Son In Law", value: "SON_IN_LAW" },
  { name: "Uncle", value: "UNCLE" },
  { name: "Wife", value: "WIFE" },
  { name: "Others", value: "OTHERS" },
];

export const businessTypeOptions = [
  { name: "Individual part-time", value: "individual part-time" },
  { name: "Individual full-time", value: "individual full-time" },
  { name: "Business", value: "business" },
];

export const mandateTypeOptions = [
  { name: "ENACH", value: "ENACH" },
  // { name: "NACH", value: "NACH" },
  { name: "UPI", value: "UPI" },
];

export const mandateLimitOptions = [
  { name: "₹10,000", value: "10000" },
  { name: "₹25,000", value: "25000" },
  { name: "₹50,000", value: "50000" },
  { name: "₹1,00,000", value: "100000" },
  { name: "₹5,00,000", value: "500000" },
  { name: "₹10,00,000", value: "1000000" },
];

export const stateOptions = [
  { value: "Andaman & Nicobar", name: "Andaman & Nicobar" },
  { value: "Arunachal Pradesh", name: "Arunachal Pradesh" },
  { value: "Andhra Pradesh", name: "Andhra Pradesh" },
  { value: "Assam", name: "Assam" },
  { value: "Bihar", name: "Bihar" },
  { value: "Chandigarh", name: "Chandigarh" },
  { value: "Chhattisgarh", name: "Chhattisgarh" },
  { value: "Goa", name: "Goa" },
  { value: "Gujarat", name: "Gujarat" },
  { value: "Haryana", name: "Haryana" },
  { value: "Himachal Pradesh", name: "Himachal Pradesh" },
  { value: "Jammu & Kashmir", name: "Jammu & Kashmir" },
  { value: "Jharkhand", name: "Jharkhand" },
  { value: "Karnataka", name: "Karnataka" },
  { value: "Kerala", name: "Kerala" },
  { value: "Madhya Pradesh", name: "Madhya Pradesh" },
  { value: "Maharashtra", name: "Maharashtra" },
  { value: "Manipur", name: "Manipur" },
  { value: "Meghalaya", name: "Meghalaya" },
  { value: "Mizoram", name: "Mizoram" },
  { value: "Nagaland", name: "Nagaland" },
  { value: "New Delhi", name: "New Delhi" },
  { value: "Orissa", name: "Orissa" },
  { value: "Pondicherry", name: "Pondicherry" },
  { value: "Punjab", name: "Punjab" },
  { value: "Rajasthan", name: "Rajasthan" },
  { value: "Sikkim", name: "Sikkim" },
  { value: "Telangana", name: "Telangana" },
  { value: "Tamil Nadu", name: "Tamil Nadu" },
  { value: "Tripura", name: "Tripura" },
  { value: "Uttar Pradesh", name: "Uttar Pradesh" },
  { value: "Uttaranchal", name: "Uttaranchal" },
  { value: "West Bengal", name: "West Bengal" },
  { value: "Dadra and Nagar Haveli", name: "Dadra and Nagar Haveli" },
  { value: "Daman and Diu", name: "Daman and Diu" },
  { value: "Lakshadweep", name: "Lakshadweep" },
  { value: "Others", name: "Others" },
];

export const amfiSubOptions = {
  Equity: [
    {
      name: "No filter",
      value: "",
    },
    {
      name: "Dynamic Asset Allocation or Balanced Advantage",
      value: "Dynamic Asset Allocation or Balanced Advantage",
    },
    {
      name: "Multi Asset Allocation",
      value: "Multi Asset Allocation",
    },
    {
      name: "Equity Savings",
      value: "Equity Savings",
    },
    {
      name: "Conservative Hybrid Fund",
      value: "Conservative Hybrid Fund",
    },
    {
      name: "Arbitrage Fund",
      value: "Arbitrage Fund",
    },
    {
      name: "Aggressive Hybrid Fund",
      value: "Aggressive Hybrid Fund",
    },
  ], //Equity categories
  Debt: [
    {
      name: "No filter",
      value: "",
    },
    {
      name: "Medium Duration Fund",
      value: "Medium Duration Fund",
    },
    {
      name: "Gilt Fund",
      value: "Gilt Fund",
    },
    {
      name: "Floater Fund",
      value: "Floater Fund",
    },
    {
      name: "Fixed Maturity Plans",
      value: "Fixed Maturity Plans",
    },
    {
      name: "Banking and PSU Fund",
      value: "Banking and PSU Fund",
    },
    {
      name: "Low Duration Fund",
      value: "Low Duration Fund",
    },
    {
      name: "Gilt Fund with 10 year Constant duration",
      value: "Gilt Fund with 10 year Constant duration",
    },
    {
      name: "Liquid Fund",
      value: "Liquid Fund",
    },
    {
      name: "Credit Risk Fund",
      value: "Credit Risk Fund",
    },
    {
      name: "Overnight Fund",
      value: "Overnight Fund",
    },
    {
      name: "Money Market Fund",
      value: "Money Market Fund",
    },
    {
      name: "Dynamic Bond",
      value: "Dynamic Bond",
    },
    {
      name: "Corporate Bond Fund",
      value: "Corporate Bond Fund",
    },
    {
      name: "Medium to Long Duration Fund",
      value: "Medium to Long Duration Fund",
    },
    {
      name: "Short Duration Fund",
      value: "Short Duration Fund",
    },
    {
      name: "Long Duration Fund",
      value: "Long Duration Fund",
    },
    {
      name: "Ultra Short Duration Fund",
      value: "Ultra Short Duration Fund",
    },
  ], //debt categories
  Hybrid: [
    {
      name: "No filter",
      value: "",
    },
    {
      name: "Large & Mid Cap Fund",
      value: "Large & Mid Cap Fund",
    },
    {
      name: "ELSS",
      value: "ELSS",
    },
    {
      name: "Sectoral / Thematic",
      value: "Sectoral / Thematic",
    },
    {
      name: "Value Fund",
      value: "Value Fund",
    },
    {
      name: "Focused Fund",
      value: "Focused Fund",
    },
    {
      name: "Flexi Cap Fund",
      value: "Flexi Cap Fund",
    },
    {
      name: "Contra Fund",
      value: "Contra Fund",
    },
    {
      name: "Multi Cap Fund",
      value: "Multi Cap Fund",
    },
    {
      name: "Dividend Yield Fund",
      value: "Dividend Yield Fund",
    },
    {
      name: "Small Cap Fund",
      value: "Small Cap Fund",
    },
    {
      name: "Large Cap Fund",
      value: "Large Cap Fund",
    },
    {
      name: "Mid Cap Fund",
      value: "Mid Cap Fund",
    },
  ], //Hybrid catgories
};

// export const sipDateOptions = [
//   { name: 1, value: 1 },
//   { name: 2, value: 2 },
//   { name: 3, value: 3 },
//   { name: 4, value: 4 },
//   { name: 5, value: 5 },
//   { name: 6, value: 6 },
//   { name: 7, value: 7 },
//   { name: 8, value: 8 },
//   { name: 9, value: 9 },
//   { name: 10, value: 10 },
//   { name: 11, value: 11 },
//   { name: 12, value: 12 },
//   { name: 13, value: 13 },
//   { name: 14, value: 14 },
//   { name: 15, value: 15 },
//   { name: 16, value: 16 },
//   { name: 17, value: 17 },
//   { name: 18, value: 18 },
//   { name: 19, value: 19 },
//   { name: 20, value: 20 },
//   { name: 21, value: 21 },
//   { name: 22, value: 22 },
//   { name: 23, value: 23 },
//   { name: 24, value: 24 },
//   { name: 25, value: 25 },
//   { name: 26, value: 26 },
//   { name: 27, value: 27 },
//   { name: 28, value: 28 },
// ];

export const sipDurationOptions = [
  { name: "Until Cancelled (upto 30 years)", value: 30 },
  { name: "6 months", value: 0.5 },
  { name: "12 months", value: 1 },
  { name: "18 months", value: 1.5 },
  { name: "2 year", value: 2 },
  { name: "3 year", value: 3 },
  { name: "4 year", value: 4 },
  { name: "5 year", value: 5 },
  { name: "6 year", value: 6 },
  { name: "7 year", value: 7 },
  { name: "8 year", value: 8 },
  { name: "9 year", value: 9 },
  { name: "10 year", value: 10 },
  { name: "11 year", value: 11 },
  { name: "12 year", value: 12 },
  { name: "13 year", value: 13 },
  { name: "14 year", value: 14 },
  { name: "15 year", value: 15 },
  { name: "16 year", value: 16 },
  { name: "17 year", value: 17 },
  { name: "18 year", value: 18 },
  { name: "19 year", value: 19 },
  { name: "20 year", value: 20 },
  { name: "21 year", value: 21 },
  { name: "22 year", value: 22 },
  { name: "23 year", value: 23 },
  { name: "24 year", value: 24 },
  { name: "25 year", value: 25 },
];

export const frequencyOptions = [
  { name: "Daily", value: "DAILY" },
  { name: "Weekly", value: "WEEKLY" },
  { name: "Monthly", value: "MONTHLY" },
  { name: "Quarterly", value: "QUARTERLY" },
  { name: "Half Yearly", value: "HALF_YEARLY" },
  { name: "Yearly", value: "YEARLY" },
];

export const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const folioOptions = [{ name: "New Folio", value: "new folio" }];

export const calculatorUrl = [
  "/embed/education-calculator", //childredn educaion
  "/embed/dream-plan", //dream planner
  "/embed/house-purchase-plan", //house purchase
  "/embed/marriage-plan", //marriage plan
  "/embed/retirement-calculator", //retirement plan
];

export const embedPieCharUrl = "/embed/pie-chart";

export const riskInfoQuestion = [
  {
    question: "What is your age?",
    answer: [
      { value: "13", name: "13" },
      { value: "14", name: "14" },
      { value: "15", name: "15" },
      { value: "16", name: "16" },
      { value: "17", name: "17" },
    ],
  },
  {
    question: "What is your marital status?",
    answer: [
      { value: "married", name: "Married" },
      { value: "single", name: "single" },
    ],
  },
  {
    question: "What is your occupation?",
    answer: [
      { value: "occupation1", name: "Occupation 1" },
      { value: "occupation2", name: "Occupation 2" },
      { value: "occupation3", name: "Occupation 3" },
      { value: "occupation4", name: "Occupation 4" },
      { value: "occupation5", name: "Occupation 5" },
      { value: "occupation6", name: "Occupation 6" },
    ],
  },
];

export const addressTypeOptions = [
  { value: "RESIDENTIAL_OR_BUSINESS", name: "Residential or Business" },
  { value: "RESIDENTIAL", name: "Residential" },
  { value: "BUSINESS", name: "Business" },
  { value: "REGISTERED_OFFICE", name: "Registered Office" },
  { value: "UNSPECIFIED", name: "Unspecified" },
  { value: "RESIDENT_OR_BUSINESS_FOREIGN", name: "Resident or Business - Foreign" },
  { value: "RESIDENTIAL_FOREIGN", name: "Residential - Foreign" },
  { value: "BUSINESS_FOREIGN", name: "Business - Foreign" },
  { value: "REGISTERED_OFFICE_FOREIGN", name: "Registered Office - Foreign" },
  { value: "UNSPECIFIED_FOREIGN", name: "Unspecified - Foreign" },
];

export const countryOptions = [
  { value: "AFG", name: "Afghanistan" },
  { value: "ALA", name: "Åland Islands" },
  { value: "ALB", name: "Albania" },
  { value: "DZA", name: "Algeria" },
  { value: "ASM", name: "American Samoa" },
  { value: "AND", name: "Andorra" },
  { value: "AGO", name: "Angola" },
  { value: "AIA", name: "Anguilla" },
  { value: "ATA", name: "Antarctica" },
  { value: "ATG", name: "Antigua and Barbuda" },
  { value: "ARG", name: "Argentina" },
  { value: "ARM", name: "Armenia" },
  { value: "ABW", name: "Aruba" },
  { value: "AUS", name: "Australia" },
  { value: "AUT", name: "Austria" },
  { value: "AZE", name: "Azerbaijan" },
  { value: "BHS", name: "Bahamas" },
  { value: "BHR", name: "Bahrain" },
  { value: "BGD", name: "Bangladesh" },
  { value: "BRB", name: "Barbados" },
  { value: "BLR", name: "Belarus" },
  { value: "BEL", name: "Belgium" },
  { value: "BLZ", name: "Belize" },
  { value: "BEN", name: "Benin" },
  { value: "BMU", name: "Bermuda" },
  { value: "BTN", name: "Bhutan" },
  { value: "BOL", name: "Bolivia (Plurinational State of)" },
  { value: "BES", name: "Bonaire, Sint Eustatius and Saba" },
  { value: "BIH", name: "Bosnia and Herzegovina" },
  { value: "BWA", name: "Botswana" },
  { value: "BVT", name: "Bouvet Island" },
  { value: "BRA", name: "Brazil" },
  { value: "IOT", name: "British Indian Ocean Territory" },
  { value: "BRN", name: "Brunei Darussalam" },
  { value: "BGR", name: "Bulgaria" },
  { value: "BFA", name: "Burkina Faso" },
  { value: "BDI", name: "Burundi" },
  { value: "CPV", name: "Cabo Verde" },
  { value: "KHM", name: "Cambodia" },
  { value: "CMR", name: "Cameroon" },
  { value: "CAN", name: "Canada" },
  { value: "CYM", name: "Cayman Islands" },
  { value: "CAF", name: "Central African Republic" },
  { value: "TCD", name: "Chad" },
  { value: "CHL", name: "Chile" },
  { value: "CHN", name: "China" },
  { value: "CXR", name: "Christmas Island" },
  { value: "CCK", name: "Cocos (Keeling) Islands" },
  { value: "COL", name: "Colombia" },
  { value: "COM", name: "Comoros" },
  { value: "COG", name: "Congo" },
  { value: "COD", name: "Congo, Democratic Republic of the" },
  { value: "COK", name: "Cook Islands" },
  { value: "CRI", name: "Costa Rica" },
  { value: "CIV", name: "Côte d'Ivoire" },
  { value: "HRV", name: "Croatia" },
  { value: "CUB", name: "Cuba" },
  { value: "CUW", name: "Curaçao" },
  { value: "CYP", name: "Cyprus" },
  { value: "CZE", name: "Czechia" },
  { value: "DNK", name: "Denmark" },
  { value: "DJI", name: "Djibouti" },
  { value: "DMA", name: "Dominica" },
  { value: "DOM", name: "Dominican Republic" },
  { value: "ECU", name: "Ecuador" },
  { value: "EGY", name: "Egypt" },
  { value: "SLV", name: "El Salvador" },
  { value: "GNQ", name: "Equatorial Guinea" },
  { value: "ERI", name: "Eritrea" },
  { value: "EST", name: "Estonia" },
  { value: "SWZ", name: "Eswatini" },
  { value: "ETH", name: "Ethiopia" },
  { value: "FLK", name: "Falkland Islands (Malvinas)" },
  { value: "FRO", name: "Faroe Islands" },
  { value: "FJI", name: "Fiji" },
  { value: "FIN", name: "Finland" },
  { value: "FRA", name: "France" },
  { value: "GUF", name: "French Guiana" },
  { value: "PYF", name: "French Polynesia" },
  { value: "ATF", name: "French Southern Territories" },
  { value: "GAB", name: "Gabon" },
  { value: "GMB", name: "Gambia" },
  { value: "GEO", name: "Georgia" },
  { value: "DEU", name: "Germany" },
  { value: "GHA", name: "Ghana" },
  { value: "GIB", name: "Gibraltar" },
  { value: "GRC", name: "Greece" },
  { value: "GRL", name: "Greenland" },
  { value: "GRD", name: "Grenada" },
  { value: "GLP", name: "Guadeloupe" },
  { value: "GUM", name: "Guam" },
  { value: "GTM", name: "Guatemala" },
  { value: "GGY", name: "Guernsey" },
  { value: "GIN", name: "Guinea" },
  { value: "GNB", name: "Guinea-Bissau" },
  { value: "GUY", name: "Guyana" },
  { value: "HTI", name: "Haiti" },
  { value: "HMD", name: "Heard Island and McDonald Islands" },
  { value: "VAT", name: "Holy See" },
  { value: "HND", name: "Honduras" },
  { value: "HKG", name: "Hong Kong" },
  { value: "HUN", name: "Hungary" },
  { value: "ISL", name: "Iceland" },
  { value: "IND", name: "India" },
  { value: "IDN", name: "Indonesia" },
  { value: "IRN", name: "Iran (Islamic Republic of)" },
  { value: "IRQ", name: "Iraq" },
  { value: "IRL", name: "Ireland" },
  { value: "IMN", name: "Isle of Man" },
  { value: "ISR", name: "Israel" },
  { value: "ITA", name: "Italy" },
  { value: "JAM", name: "Jamaica" },
  { value: "JPN", name: "Japan" },
  { value: "JEY", name: "Jersey" },
  { value: "JOR", name: "Jordan" },
  { value: "KAZ", name: "Kazakhstan" },
  { value: "KEN", name: "Kenya" },
  { value: "KIR", name: "Kiribati" },
  { value: "PRK", name: "Korea (Democratic People's Republic of)" },
  { value: "KOR", name: "Korea, Republic of" },
  { value: "KWT", name: "Kuwait" },
  { value: "KGZ", name: "Kyrgyzstan" },
  { value: "LAO", name: "Lao People's Democratic Republic" },
  { value: "LVA", name: "Latvia" },
  { value: "LBN", name: "Lebanon" },
  { value: "LSO", name: "Lesotho" },
  { value: "LBR", name: "Liberia" },
  { value: "LBY", name: "Libya" },
  { value: "LIE", name: "Liechtenstein" },
  { value: "LTU", name: "Lithuania" },
  { value: "LUX", name: "Luxembourg" },
  { value: "MAC", name: "Macao" },
  { value: "MDG", name: "Madagascar" },
  { value: "MWI", name: "Malawi" },
  { value: "MYS", name: "Malaysia" },
  { value: "MDV", name: "Maldives" },
  { value: "MLI", name: "Mali" },
  { value: "MLT", name: "Malta" },
  { value: "MHL", name: "Marshall Islands" },
  { value: "MTQ", name: "Martinique" },
  { value: "MRT", name: "Mauritania" },
  { value: "MUS", name: "Mauritius" },
  { value: "MYT", name: "Mayotte" },
  { value: "MEX", name: "Mexico" },
  { value: "FSM", name: "Micronesia (Federated States of)" },
  { value: "MDA", name: "Moldova, Republic of" },
  { value: "MCO", name: "Monaco" },
  { value: "MNG", name: "Mongolia" },
  { value: "MNE", name: "Montenegro" },
  { value: "MSR", name: "Montserrat" },
  { value: "MAR", name: "Morocco" },
  { value: "MOZ", name: "Mozambique" },
  { value: "MMR", name: "Myanmar" },
  { value: "NAM", name: "Namibia" },
  { value: "NRU", name: "Nauru" },
  { value: "NPL", name: "Nepal" },
  { value: "NLD", name: "Netherlands" },
  { value: "NCL", name: "New Caledonia" },
  { value: "NZL", name: "New Zealand" },
  { value: "NIC", name: "Nicaragua" },
  { value: "NER", name: "Niger" },
  { value: "NGA", name: "Nigeria" },
  { value: "NIU", name: "Niue" },
  { value: "NFK", name: "Norfolk Island" },
  { value: "MKD", name: "North Macedonia" },
  { value: "MNP", name: "Northern Mariana Islands" },
  { value: "NOR", name: "Norway" },
  { value: "OMN", name: "Oman" },
  { value: "PAK", name: "Pakistan" },
  { value: "PLW", name: "Palau" },
  { value: "PSE", name: "Palestine, State of" },
  { value: "PAN", name: "Panama" },
  { value: "PNG", name: "Papua New Guinea" },
  { value: "PRY", name: "Paraguay" },
  { value: "PER", name: "Peru" },
  { value: "PHL", name: "Philippines" },
  { value: "PCN", name: "Pitcairn" },
  { value: "POL", name: "Poland" },
  { value: "PRT", name: "Portugal" },
  { value: "PRI", name: "Puerto Rico" },
  { value: "QAT", name: "Qatar" },
  { value: "REU", name: "Réunion" },
  { value: "ROU", name: "Romania" },
  { value: "RUS", name: "Russian Federation" },
  { value: "RWA", name: "Rwanda" },
  { value: "BLM", name: "Saint Barthélemy" },
  { value: "SHN", name: "Saint Helena, Ascension and Tristan da Cunha" },
  { value: "KNA", name: "Saint Kitts and Nevis" },
  { value: "LCA", name: "Saint Lucia" },
  { value: "MAF", name: "Saint Martin (French part)" },
  { value: "SPM", name: "Saint Pierre and Miquelon" },
  { value: "VCT", name: "Saint Vincent and the Grenadines" },
  { value: "WSM", name: "Samoa" },
  { value: "SMR", name: "San Marino" },
  { value: "STP", name: "Sao Tome and Principe" },
  { value: "SAU", name: "Saudi Arabia" },
  { value: "SEN", name: "Senegal" },
  { value: "SRB", name: "Serbia" },
  { value: "SYC", name: "Seychelles" },
  { value: "SLE", name: "Sierra Leone" },
  { value: "SGP", name: "Singapore" },
  { value: "SXM", name: "Sint Maarten (Dutch part)" },
  { value: "SVK", name: "Slovakia" },
  { value: "SVN", name: "Slovenia" },
  { value: "SLB", name: "Solomon Islands" },
  { value: "SOM", name: "Somalia" },
  { value: "ZAF", name: "South Africa" },
  { value: "SGS", name: "South Georgia and the South Sandwich Islands" },
  { value: "SSD", name: "South Sudan" },
  { value: "ESP", name: "Spain" },
  { value: "LKA", name: "Sri Lanka" },
  { value: "SDN", name: "Sudan" },
  { value: "SUR", name: "Suriname" },
  { value: "SJM", name: "Svalbard and Jan Mayen" },
  { value: "SWE", name: "Sweden" },
  { value: "CHE", name: "Switzerland" },
  { value: "SYR", name: "Syrian Arab Republic" },
  { value: "TWN", name: "Taiwan, Province of China" },
  { value: "TJK", name: "Tajikistan" },
  { value: "TZA", name: "Tanzania, United Republic of" },
  { value: "THA", name: "Thailand" },
  { value: "TLS", name: "Timor-Leste" },
  { value: "TGO", name: "Togo" },
  { value: "TKL", name: "Tokelau" },
  { value: "TON", name: "Tonga" },
  { value: "TTO", name: "Trinidad and Tobago" },
  { value: "TUN", name: "Tunisia" },
  { value: "TUR", name: "Turkey" },
  { value: "TKM", name: "Turkmenistan" },
  { value: "TCA", name: "Turks and Caicos Islands" },
  { value: "TUV", name: "Tuvalu" },
  { value: "UGA", name: "Uganda" },
  { value: "UKR", name: "Ukraine" },
  { value: "ARE", name: "United Arab Emirates" },
  { value: "GBR", name: "United Kingdom of Great Britain and Northern Ireland" },
  { value: "USA", name: "United States of America" },
  { value: "UMI", name: "United States Minor Outlying Islands" },
  { value: "URY", name: "Uruguay" },
  { value: "UZB", name: "Uzbekistan" },
  { value: "VUT", name: "Vanuatu" },
  { value: "VEN", name: "Venezuela (Bolivarian Republic of)" },
  { value: "VNM", name: "Viet Nam" },
  { value: "VGB", name: "Virgin Islands (British)" },
  { value: "VIR", name: "Virgin Islands (U.S.)" },
  { value: "WLF", name: "Wallis and Futuna" },
  { value: "ESH", name: "Western Sahara" },
  { value: "YEM", name: "Yemen" },
  { value: "ZMB", name: "Zambia" },
  { value: "ZWE", name: "Zimbabwe" },
];
