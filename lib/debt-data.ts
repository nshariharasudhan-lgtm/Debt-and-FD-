export interface DebtInstrument {
  id: string;
  name: string;
  issuer: string;
  type: 'bank_fd' | 'corporate_fd' | 'rbi_govt' | 'ncd_bond';
  subType: string;
  generalRate: number; // in percentage e.g. 7.25
  seniorCitizenRate: number; // in percentage e.g. 7.75
  superSeniorRate?: number; // for 80+ years e.g. 8.00
  tenureMonthsMin: number;
  tenureMonthsMax: number;
  popularTenureLabel: string;
  payoutFrequency: ('monthly' | 'quarterly' | 'half_yearly' | 'annual' | 'cumulative')[];
  creditRating: string; // e.g. 'Sovereign', 'CRISIL AAA', 'ICRA AA+', 'DICGC Insured'
  ratingAgency?: 'CRISIL' | 'ICRA' | 'CARE' | 'RBI / Govt' | 'DICGC';
  safetyLevel: 'Highest (Sovereign)' | 'Very High (DICGC Insured)' | 'High (AAA Corporate)' | 'Moderate (AA+ Corporate)';
  minInvestment: number; // in INR
  maxInvestment?: number; // e.g. 30,00,000 for SCSS
  dicgcCovered: boolean; // up to 5 Lakhs
  taxBenefitSection?: '80C' | '80TTB' | 'Tax Free' | 'Standard';
  tdsThreshold: number; // 40,000 for regular, 50,000 for senior citizens
  description: string;
  keyHighlights: string[];
  prematureWithdrawalAllowed: boolean;
  prematureWithdrawalPenalty?: string;
  officialApplyUrl?: string;
  lastUpdated: string;
  featured?: boolean;
}

export interface MarketBenchmark {
  rbiRepoRate: number;
  benchmarkGsec10Y: number;
  retailCpiInflation: number;
  scssRate: number;
  rbiFrsbRate: number;
  highestSfbFdRate: number;
  highestPsuFdRate: number;
  lastPolicyDate: string;
  nextRbiMeeting: string;
}

export const initialBenchmarks: MarketBenchmark = {
  rbiRepoRate: 6.50,
  benchmarkGsec10Y: 6.92,
  retailCpiInflation: 5.10,
  scssRate: 8.20,
  rbiFrsbRate: 8.05,
  highestSfbFdRate: 9.00,
  highestPsuFdRate: 7.75,
  lastPolicyDate: 'Current RBI MPC Stance: Neutral',
  nextRbiMeeting: 'Bi-monthly Monetary Policy Review'
};

export const initialDebtInstruments: DebtInstrument[] = [
  // RBI & Government Instruments
  {
    id: 'scss-govt',
    name: 'Senior Citizen Savings Scheme (SCSS)',
    issuer: 'Government of India (Ministry of Finance)',
    type: 'rbi_govt',
    subType: 'Govt Small Savings',
    generalRate: 8.20, // Not applicable for <60 except retired defence personnel
    seniorCitizenRate: 8.20,
    tenureMonthsMin: 60,
    tenureMonthsMax: 96,
    popularTenureLabel: '5 Years (extendable by 3 yrs)',
    payoutFrequency: ['quarterly'],
    creditRating: 'Sovereign Guarantee',
    ratingAgency: 'RBI / Govt',
    safetyLevel: 'Highest (Sovereign)',
    minInvestment: 1000,
    maxInvestment: 3000000, // INR 30 Lakhs
    dicgcCovered: true, // 100% backed by Govt of India
    taxBenefitSection: '80C',
    tdsThreshold: 50000,
    description: 'The gold standard fixed-income instrument for Indian Senior Citizens (age 60+ or 55+ for VRS). Offers sovereign safety with high quarterly interest paid directly to bank accounts.',
    keyHighlights: [
      'Section 80C tax deduction up to ₹1.5 Lakh on principal deposit',
      'Interest qualifies for Section 80TTB deduction up to ₹50,000/year',
      'Quarterly interest credited on 1st of Jan, April, July & October',
      'Investment limit doubled to ₹30 Lakhs per individual (₹60 Lakhs for couple)'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: '1.5% deduction if closed after 1-2 yrs; 1% deduction after 2 yrs',
    lastUpdated: 'Q1 Rate Notification',
    featured: true
  },
  {
    id: 'rbi-frsb',
    name: 'RBI Floating Rate Savings Bonds (FRSB 2020)',
    issuer: 'Reserve Bank of India',
    type: 'rbi_govt',
    subType: 'Sovereign Floating Bond',
    generalRate: 8.05,
    seniorCitizenRate: 8.05,
    tenureMonthsMin: 84,
    tenureMonthsMax: 84,
    popularTenureLabel: '7 Years Lock-in',
    payoutFrequency: ['half_yearly'],
    creditRating: 'Sovereign Guarantee',
    ratingAgency: 'RBI / Govt',
    safetyLevel: 'Highest (Sovereign)',
    minInvestment: 1000,
    dicgcCovered: true,
    taxBenefitSection: '80TTB',
    tdsThreshold: 50000,
    description: '100% sovereign bond issued by RBI with interest rate pegged at 35 basis points above prevailing NSC rate. Provides automated inflation hedge when interest rates rise.',
    keyHighlights: [
      'Semi-annual payout on 1st January and 1st July',
      'No upper ceiling on investment amount',
      'Premature encashment permitted for Senior Citizens (60-70 yrs: 6 yrs; 70-80 yrs: 5 yrs; 80+ yrs: 4 yrs)',
      'Direct credit through RBI Retail Direct or designated banks'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: '50% of interest due for the last half-year deducted',
    lastUpdated: 'Reset Semi-Annually',
    featured: true
  },
  {
    id: 'gsec-10y-direct',
    name: '10-Year Benchmark Government of India Security (G-Sec)',
    issuer: 'Government of India (via RBI Retail Direct)',
    type: 'rbi_govt',
    subType: 'Tradable G-Sec Bond',
    generalRate: 6.92,
    seniorCitizenRate: 6.92,
    tenureMonthsMin: 120,
    tenureMonthsMax: 120,
    popularTenureLabel: '10 Years (Tradable on NDS-OM)',
    payoutFrequency: ['half_yearly'],
    creditRating: 'Sovereign Guarantee',
    ratingAgency: 'RBI / Govt',
    safetyLevel: 'Highest (Sovereign)',
    minInvestment: 10000,
    dicgcCovered: true,
    taxBenefitSection: 'Standard',
    tdsThreshold: 0, // No TDS on listed G-Secs!
    description: 'Direct sovereign bonds issued by the Central Government. Zero credit risk, tradable on RBI Retail Direct platform with no TDS deducted at source.',
    keyHighlights: [
      'No TDS deducted on interest payments for individual investors',
      'Semi-annual coupon payout',
      'Liquid - can be sold in secondary market via RBI Retail Direct App',
      'Ideal for locking in long-term risk-free yield for 10-30 years'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: 'Market price risk applies when selling prior to maturity',
    lastUpdated: 'Live Market Yield',
    featured: false
  },
  {
    id: 'pomis-postoffice',
    name: 'Post Office Monthly Income Scheme (POMIS)',
    issuer: 'Department of Posts, Govt of India',
    type: 'rbi_govt',
    subType: 'Postal Savings Scheme',
    generalRate: 7.40,
    seniorCitizenRate: 7.40,
    tenureMonthsMin: 60,
    tenureMonthsMax: 60,
    popularTenureLabel: '5 Years',
    payoutFrequency: ['monthly'],
    creditRating: 'Sovereign Guarantee',
    ratingAgency: 'RBI / Govt',
    safetyLevel: 'Highest (Sovereign)',
    minInvestment: 1000,
    maxInvestment: 900000, // 9 Lakhs single, 15 Lakhs joint
    dicgcCovered: true,
    taxBenefitSection: '80TTB',
    tdsThreshold: 50000,
    description: 'Reliable monthly pension-style cash flow directly deposited to Post Office Savings or linked bank account. Backed by the Central Government.',
    keyHighlights: [
      'Fixed guaranteed monthly interest payout',
      'Max ₹9 Lakhs for single account, ₹15 Lakhs for joint accounts',
      'Can be auto-credited to linked savings account',
      'Capital fully secure with sovereign guarantee'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: '2% deduction after 1-3 yrs; 1% after 3-5 yrs',
    lastUpdated: 'Q1 Notification',
    featured: false
  },

  // Bank Fixed Deposits (PSU, Private, Small Finance)
  {
    id: 'sbi-amrit-vrishti',
    name: 'SBI Amrit Vrishti / WeCare Senior FD',
    issuer: 'State Bank of India (PSU)',
    type: 'bank_fd',
    subType: 'Public Sector Bank',
    generalRate: 7.25,
    seniorCitizenRate: 7.75,
    superSeniorRate: 7.85,
    tenureMonthsMin: 14.5, // 444 days
    tenureMonthsMax: 60,
    popularTenureLabel: '444 Days (Special Tenure)',
    payoutFrequency: ['monthly', 'quarterly', 'cumulative'],
    creditRating: 'Govt PSU • DICGC',
    ratingAgency: 'DICGC',
    safetyLevel: 'Very High (DICGC Insured)',
    minInvestment: 5000,
    dicgcCovered: true,
    taxBenefitSection: '80TTB',
    tdsThreshold: 50000,
    description: 'India’s largest bank special high-yield deposit. SBI WeCare offers additional 50 bps premium for Senior Citizens across tenure brackets up to 5-10 years.',
    keyHighlights: [
      'Extra 0.50% interest for Senior Citizens across all tenures',
      'DICGC coverage up to ₹5,00,000 per depositor',
      'Flexible payout: Monthly, Quarterly or Cumulative on maturity',
      'Instant online loan or overdraft up to 90% of deposit value'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: '0.50% penalty on applicable rate',
    lastUpdated: 'Active Card Rate',
    featured: true
  },
  {
    id: 'hdfc-senior-care',
    name: 'HDFC Bank Senior Citizen Care FD',
    issuer: 'HDFC Bank Ltd (Private Sector)',
    type: 'bank_fd',
    subType: 'D-SIB Private Bank',
    generalRate: 7.25,
    seniorCitizenRate: 7.75,
    superSeniorRate: 7.85,
    tenureMonthsMin: 35,
    tenureMonthsMax: 120,
    popularTenureLabel: '35 to 55 Months',
    payoutFrequency: ['monthly', 'quarterly', 'cumulative'],
    creditRating: 'CRISIL AAA • DICGC',
    ratingAgency: 'CRISIL',
    safetyLevel: 'Very High (DICGC Insured)',
    minInvestment: 10000,
    dicgcCovered: true,
    taxBenefitSection: '80TTB',
    tdsThreshold: 50000,
    description: 'India’s premier private bank offering special 0.75% extra return for senior citizens on tenures of 5 years or more. Classified as D-SIB ("Too Big to Fail") by RBI.',
    keyHighlights: [
      '0.50% regular senior citizen premium + 0.25% special care premium for 5+ years',
      'Seamless digital net banking & mobile app management',
      'Form 15H submission in two clicks for zero TDS',
      'Compound interest calculated on quarterly basis'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: '1.0% interest rate reduction',
    lastUpdated: 'Active Card Rate',
    featured: true
  },
  {
    id: 'icici-golden-years',
    name: 'ICICI Bank Golden Years FD',
    issuer: 'ICICI Bank Ltd (Private Sector)',
    type: 'bank_fd',
    subType: 'D-SIB Private Bank',
    generalRate: 7.20,
    seniorCitizenRate: 7.75,
    tenureMonthsMin: 60,
    tenureMonthsMax: 120,
    popularTenureLabel: '5 Years 1 Day to 10 Years',
    payoutFrequency: ['monthly', 'quarterly', 'cumulative'],
    creditRating: 'ICRA AAA • DICGC',
    ratingAgency: 'ICRA',
    safetyLevel: 'Very High (DICGC Insured)',
    minInvestment: 10000,
    dicgcCovered: true,
    taxBenefitSection: '80TTB',
    tdsThreshold: 50000,
    description: 'Specially engineered for retirees to secure fixed pension cash flows with D-SIB systemic safety and digital ease.',
    keyHighlights: [
      'Additional 0.10% over and above standard senior citizen benefit',
      'Quarterly compounding maximizes cumulative maturity yield',
      'Facility to register nominee and automatic renewal',
      'DICGC guarantee covers principal + accrued interest up to ₹5 Lakhs'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: '1.25% penalty if closed before 5 years',
    lastUpdated: 'Active Card Rate',
    featured: false
  },
  {
    id: 'au-small-finance',
    name: 'AU Small Finance Bank Fixed Deposit',
    issuer: 'AU Small Finance Bank',
    type: 'bank_fd',
    subType: 'Small Finance Bank',
    generalRate: 8.00,
    seniorCitizenRate: 8.50,
    superSeniorRate: 8.75,
    tenureMonthsMin: 24,
    tenureMonthsMax: 36,
    popularTenureLabel: '24 to 36 Months',
    payoutFrequency: ['monthly', 'quarterly', 'cumulative'],
    creditRating: 'CRISIL AA+ • DICGC',
    ratingAgency: 'DICGC',
    safetyLevel: 'Very High (DICGC Insured)',
    minInvestment: 5000,
    dicgcCovered: true,
    taxBenefitSection: '80TTB',
    tdsThreshold: 50000,
    description: 'High-interest scheduled bank offering industry-leading yields up to 8.50% for seniors, fully secured under RBI DICGC ₹5 Lakh insurance cover.',
    keyHighlights: [
      'Industry-leading 8.50% annual yield for seniors (8.75% for 80+)',
      'Protected by RBI’s DICGC insurance up to ₹5,00,000',
      'Monthly interest payout option without interest penalty discount',
      'Fast video-KYC account opening'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: '1.0% penalty below agreed tenure',
    lastUpdated: 'Current Rate Sheet',
    featured: true
  },
  {
    id: 'unity-sfb-shrestha',
    name: 'Unity Small Finance Bank Shrestha FD',
    issuer: 'Unity Small Finance Bank',
    type: 'bank_fd',
    subType: 'Small Finance Bank',
    generalRate: 8.90,
    seniorCitizenRate: 9.40,
    superSeniorRate: 9.50,
    tenureMonthsMin: 33, // 1001 days
    tenureMonthsMax: 33,
    popularTenureLabel: '1001 Days Special',
    payoutFrequency: ['monthly', 'quarterly', 'cumulative'],
    creditRating: 'CARE A+ • DICGC',
    ratingAgency: 'DICGC',
    safetyLevel: 'Very High (DICGC Insured)',
    minInvestment: 10000,
    dicgcCovered: true,
    taxBenefitSection: '80TTB',
    tdsThreshold: 50000,
    description: 'Currently among the highest fixed deposit interest rates in India. 9.40% guaranteed return for Senior Citizens with DICGC statutory protection.',
    keyHighlights: [
      'Exceptional 9.40% p.a. for Senior Citizens on 1001 days tenure',
      'Quarterly compounding delivers effective yield > 10.1%',
      'DICGC coverage ensures zero default risk up to ₹5 Lakhs principal+interest',
      'Doorstep banking option for senior citizens'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: '1.00% reduction on rate for elapsed tenure',
    lastUpdated: 'Special Campaign Rate',
    featured: true
  },
  {
    id: 'bank-of-baroda-bob399',
    name: 'Bank of Baroda bob399 Monsoon / Tiranga FD',
    issuer: 'Bank of Baroda (PSU)',
    type: 'bank_fd',
    subType: 'Public Sector Bank',
    generalRate: 7.15,
    seniorCitizenRate: 7.65,
    superSeniorRate: 7.80,
    tenureMonthsMin: 13.3, // 399 days
    tenureMonthsMax: 13.3,
    popularTenureLabel: '399 Days Bucket',
    payoutFrequency: ['monthly', 'quarterly', 'cumulative'],
    creditRating: 'Govt PSU • DICGC',
    ratingAgency: 'DICGC',
    safetyLevel: 'Very High (DICGC Insured)',
    minInvestment: 5000,
    dicgcCovered: true,
    taxBenefitSection: '80TTB',
    tdsThreshold: 50000,
    description: 'Major PSU bank with robust financial health offering special tenure rates for senior citizens with direct monthly pension payout.',
    keyHighlights: [
      'PSU bank safety with 7.65% fixed return for seniors',
      'Over 8,000 branch accessibility across India',
      'No processing charge on loans against deposit',
      'Section 80TTB compliance for retirees'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: '0.50% penalty',
    lastUpdated: 'Active Card Rate',
    featured: false
  },

  // Corporate Fixed Deposits (NBFCs & Conglomerates)
  {
    id: 'bajaj-finance-fd',
    name: 'Bajaj Finance Fixed Deposit',
    issuer: 'Bajaj Finance Limited',
    type: 'corporate_fd',
    subType: 'AAA Corporate FD',
    generalRate: 8.10,
    seniorCitizenRate: 8.35,
    superSeniorRate: 8.40,
    tenureMonthsMin: 24,
    tenureMonthsMax: 60,
    popularTenureLabel: '33 to 44 Months',
    payoutFrequency: ['monthly', 'quarterly', 'half_yearly', 'annual', 'cumulative'],
    creditRating: 'CRISIL AAA / ICRA AAA',
    ratingAgency: 'CRISIL',
    safetyLevel: 'High (AAA Corporate)',
    minInvestment: 15000,
    dicgcCovered: false, // Corporate FDs not covered by DICGC
    taxBenefitSection: 'Standard',
    tdsThreshold: 5000, // Corporate FDs have lower TDS threshold of ₹5,000!
    description: 'India’s largest and most trusted corporate deposit program with dual AAA ratings from CRISIL and ICRA. Nil default track record across decades.',
    keyHighlights: [
      'Highest safety rating: CRISIL AAA/STABLE and ICRA AAA/STABLE',
      'Additional 0.25% interest rate for Senior Citizens',
      'Automated monthly interest payout for retirees',
      'Digital paperless investment via online portal'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: '3-month statutory lock-in, 2-3% haircut if exited before 6 months',
    lastUpdated: 'Active Book Rate',
    featured: true
  },
  {
    id: 'shriram-finance-fd',
    name: 'Shriram Finance Unnati Fixed Deposit',
    issuer: 'Shriram Finance Limited',
    type: 'corporate_fd',
    subType: 'AA+ Corporate FD',
    generalRate: 8.40,
    seniorCitizenRate: 8.90,
    superSeniorRate: 9.00,
    tenureMonthsMin: 12,
    tenureMonthsMax: 60,
    popularTenureLabel: '50 Months Special',
    payoutFrequency: ['monthly', 'quarterly', 'half_yearly', 'annual', 'cumulative'],
    creditRating: 'CRISIL AA+ / IND AA+',
    ratingAgency: 'CRISIL',
    safetyLevel: 'Moderate (AA+ Corporate)',
    minInvestment: 5000,
    dicgcCovered: false,
    taxBenefitSection: 'Standard',
    tdsThreshold: 5000,
    description: 'High-yielding corporate deposit program providing a notable 0.50% extra for seniors and additional 0.10% for women investors.',
    keyHighlights: [
      'Generous 0.50% extra for senior citizens (up to 8.90% p.a.)',
      'Additional 0.10% bonus for female depositors',
      'Special 50-month tenure for maximum cumulative compounding',
      'Over 40 years of market presence and retail trust'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: 'Statutory 3 months lock-in; reduced interest thereafter',
    lastUpdated: 'Active Book Rate',
    featured: true
  },
  {
    id: 'mahindra-finance-fd',
    name: 'Mahindra Finance Dhanvruddhi FD',
    issuer: 'Mahindra & Mahindra Financial Services',
    type: 'corporate_fd',
    subType: 'AAA Corporate FD',
    generalRate: 8.05,
    seniorCitizenRate: 8.30,
    tenureMonthsMin: 24,
    tenureMonthsMax: 60,
    popularTenureLabel: '30 to 42 Months',
    payoutFrequency: ['monthly', 'quarterly', 'half_yearly', 'cumulative'],
    creditRating: 'CRISIL AAA / IND AAA',
    ratingAgency: 'CRISIL',
    safetyLevel: 'High (AAA Corporate)',
    minInvestment: 10000,
    dicgcCovered: false,
    taxBenefitSection: 'Standard',
    tdsThreshold: 5000,
    description: 'Backed by the prestigious Mahindra Group. Offers prime corporate security and attractive yields for conservative wealth preservation.',
    keyHighlights: [
      'Mahindra conglomerate brand assurance',
      'CRISIL AAA rating denotes highest degree of financial safety',
      '0.25% additional interest for senior citizens',
      'Transparent quarterly compounding schedule'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: '3 months statutory lock-in, 2% penalty if withdrawn early',
    lastUpdated: 'Active Book Rate',
    featured: false
  },

  // Corporate Bonds & NCDs (Non-Convertible Debentures)
  {
    id: 'nhai-taxfree-bond',
    name: 'NHAI 8.30% Tax-Free Infrastructure Bond',
    issuer: 'National Highways Authority of India (NHAI)',
    type: 'ncd_bond',
    subType: 'Tax-Free PSU Bond',
    generalRate: 5.45, // Yield to Maturity (YTM)
    seniorCitizenRate: 5.45, // 100% Tax-Free for all
    tenureMonthsMin: 60,
    tenureMonthsMax: 120,
    popularTenureLabel: 'Maturity 2027 / 2031 (Tradable on NSE/BSE)',
    payoutFrequency: ['annual'],
    creditRating: 'CRISIL AAA / CARE AAA',
    ratingAgency: 'CRISIL',
    safetyLevel: 'Highest (Sovereign)',
    minInvestment: 50000,
    dicgcCovered: true, // Govt backed PSU
    taxBenefitSection: 'Tax Free',
    tdsThreshold: 99999999, // 100% TAX FREE under Section 10(15)(iv)(h)
    description: 'Listed tax-free sovereign PSU bonds. 100% of the annual interest is completely exempt from income tax in both Old and New Tax regimes. Ideal for investors in the 30% tax bracket.',
    keyHighlights: [
      '100% TAX-FREE interest income under Section 10(15)(iv)(h)',
      'Pre-tax equivalent yield equals 7.9% - 8.2% for investors in 30% slab',
      'Zero TDS deduction',
      'Tradable in Demat form on NSE and BSE'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: 'Liquid: sold at secondary market price on stock exchange',
    lastUpdated: 'Secondary Market YTM',
    featured: true
  },
  {
    id: 'rec-54ec-capital-gains',
    name: 'REC 54EC Capital Gains Exemption Bond',
    issuer: 'REC Limited (Maharatna Govt of India Enterprise)',
    type: 'ncd_bond',
    subType: 'Sec 54EC Capital Gains',
    generalRate: 5.25,
    seniorCitizenRate: 5.25,
    tenureMonthsMin: 60,
    tenureMonthsMax: 60,
    popularTenureLabel: '5 Years Lock-in (Statutory)',
    payoutFrequency: ['annual'],
    creditRating: 'CRISIL AAA / ICRA AAA',
    ratingAgency: 'CRISIL',
    safetyLevel: 'Highest (Sovereign)',
    minInvestment: 20000, // ₹10,000 per bond, min 2 bonds
    maxInvestment: 5000000, // ₹50 Lakhs statutory cap
    dicgcCovered: true,
    taxBenefitSection: '80C',
    tdsThreshold: 5000,
    description: 'Mandatory Section 54EC bond to exempt long-term capital gains (LTCG) arising from sale of real estate/property without paying 20% / 12.5% tax.',
    keyHighlights: [
      'Exempts up to ₹50 Lakhs LTCG tax from real estate sale',
      'AAA-rated Maharatna PSU backing ensures zero principal risk',
      'Annual coupon paid directly to bank account on June 30th',
      '5-year statutory lock-in with guaranteed redemption at par'
    ],
    prematureWithdrawalAllowed: false,
    prematureWithdrawalPenalty: 'Strict 5-year lock-in as mandated by Income Tax Act',
    lastUpdated: 'Current FY Tranche',
    featured: false
  },
  {
    id: 'tata-capital-ncd',
    name: 'Tata Capital Secured Non-Convertible Debenture (NCD)',
    issuer: 'Tata Capital Financial Services',
    type: 'ncd_bond',
    subType: 'Secured Corporate NCD',
    generalRate: 8.45,
    seniorCitizenRate: 8.70,
    tenureMonthsMin: 36,
    tenureMonthsMax: 60,
    popularTenureLabel: '3 to 5 Years',
    payoutFrequency: ['monthly', 'annual', 'cumulative'],
    creditRating: 'CRISIL AAA / ICRA AAA',
    ratingAgency: 'CRISIL',
    safetyLevel: 'High (AAA Corporate)',
    minInvestment: 10000,
    dicgcCovered: false,
    taxBenefitSection: 'Standard',
    tdsThreshold: 5000,
    description: 'Secured NCD backed by specific company assets with the trusted lineage of the Tata Group. Dual AAA ratings ensure institutional quality.',
    keyHighlights: [
      'Secured by charge on company receivables and assets',
      'CRISIL AAA rating represents gold-standard corporate credit quality',
      'Flexible annual, monthly, or cumulative compounding payout',
      'Holding in Demat enables secondary market liquidation on BSE/NSE'
    ],
    prematureWithdrawalAllowed: true,
    prematureWithdrawalPenalty: 'Traded on exchange; subject to market price execution',
    lastUpdated: 'Public Issue Rate',
    featured: true
  }
];

export interface NewsletterSubscriber {
  id: string;
  email: string;
  investorType: 'Senior Citizen (60+)' | 'Retirement Planner' | 'Retail Investor' | 'NRI / HNI';
  primaryInterest: string;
  subscribedAt: string;
  status: 'Active' | 'Pending';
}

export const sampleSubscribers: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'k.ramamurthy48@gmail.com',
    investorType: 'Senior Citizen (60+)',
    primaryInterest: 'Senior Citizen FDs & SCSS Quarterly Payouts',
    subscribedAt: '2026-09-08 11:20 AM',
    status: 'Active'
  },
  {
    id: 'sub-2',
    email: 'sunita.sharma.retire@outlook.com',
    investorType: 'Senior Citizen (60+)',
    primaryInterest: 'Monthly Pension Cashflow & Section 80TTB Tax Exemption',
    subscribedAt: '2026-09-07 04:15 PM',
    status: 'Active'
  },
  {
    id: 'sub-3',
    email: 'anil.mehta.wealth@yahoo.co.in',
    investorType: 'Retail Investor',
    primaryInterest: 'AAA Corporate Bonds & RBI Floating Rate Bonds',
    subscribedAt: '2026-09-06 09:40 AM',
    status: 'Active'
  },
  {
    id: 'sub-4',
    email: 'geetha.natarajan@gmail.com',
    investorType: 'Retirement Planner',
    primaryInterest: 'Small Finance Bank 9% FD vs DICGC ₹5L Safety Limit',
    subscribedAt: '2026-09-05 06:50 PM',
    status: 'Active'
  }
];

export interface MarketPulseUpdate {
  id: string;
  title: string;
  category: 'RBI Policy' | 'Bank FD Hikes' | 'Taxation' | 'Senior Citizen Alert';
  date: string;
  summary: string;
  impactForInvestors: string;
  tag: string;
}

export const marketPulseUpdates: MarketPulseUpdate[] = [
  {
    id: 'pulse-1',
    title: 'RBI MPC Holds Repo Rate at 6.50% - Neutral Stance Keeps Peak FD Rates Accessible',
    category: 'RBI Policy',
    date: 'September 2026 Update',
    summary: 'The Monetary Policy Committee maintained the policy repo rate at 6.50%. Liquid conditions suggest bank deposit rates are currently at their cyclical peaks.',
    impactForInvestors: 'Best window for senior citizens to lock in 3 to 5-year fixed deposits and SCSS before upcoming rate easing cycles.',
    tag: 'Peak Rates Window'
  },
  {
    id: 'pulse-2',
    title: 'Section 80TTB Tax Shelter Guide: ₹50,000 Zero-Tax Benefit on Bank & Post Office Deposits',
    category: 'Taxation',
    date: 'FY 2026-27 Advisory',
    summary: 'Senior citizens (resident individuals age 60+) are entitled to claim a deduction of up to ₹50,000 on interest earned from bank FDs, RD, savings accounts, and post office schemes under Section 80TTB.',
    impactForInvestors: 'Zero TDS deduction if total interest is under ₹50,000; ensure Form 15H is submitted at the start of financial year.',
    tag: 'Tax Exemption'
  },
  {
    id: 'pulse-3',
    title: 'Small Finance Banks Hike 2-3 Year Senior Rates up to 9.40% - How to Maximize DICGC ₹5L Shield',
    category: 'Bank FD Hikes',
    date: 'Weekly Fixed Income Review',
    summary: 'AU Small Finance Bank and Unity SFB have refreshed deposit rates. Because DICGC insures ₹5 Lakhs per bank per depositor (covering principal plus interest), strategic distribution is recommended.',
    impactForInvestors: 'Deposit ₹4.2 Lakhs to ₹4.5 Lakhs per bank to ensure accumulated interest remains 100% within the DICGC ₹5 Lakh insurance cover.',
    tag: 'High Yield Strategy'
  },
  {
    id: 'pulse-4',
    title: 'Senior Citizen Savings Scheme (SCSS) vs RBI Floating Bonds: Head-to-Head Comparison',
    category: 'Senior Citizen Alert',
    date: 'Investment Strategy',
    summary: 'While SCSS pays 8.20% quarterly with a 5-year tenure and ₹30 Lakh cap, RBI FRSB pays 8.05% half-yearly with 7-year lock-in and no investment ceiling.',
    impactForInvestors: 'Maximize SCSS first up to ₹30 Lakhs (or ₹60 Lakhs for spouses), then allocate surplus to RBI Floating Rate Bonds for sovereign safety.',
    tag: 'Portfolio Allocation'
  }
];
