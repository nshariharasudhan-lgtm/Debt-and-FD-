export interface ArticleAuthor {
  name: string;
  role: string;
  credentials: string;
  avatarUrl?: string;
  bio?: string;
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export type ArticleCategory = 
  | 'Taxation & 80TTB' 
  | 'Bank FDs & DICGC' 
  | 'RBI Sovereign Bonds' 
  | 'Corporate Debt & Ratings' 
  | 'Retirement Planning';

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  metaTitle: string; // Optimal: 50-60 characters
  metaDescription: string; // Optimal: 140-160 characters
  canonicalUrl?: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: ArticleCategory;
  excerpt: string;
  content: string; // Markdown formatted article body
  author: ArticleAuthor;
  publishedDate: string; // e.g. '2025-02-15'
  updatedDate: string;
  readTimeMinutes: number;
  featured?: boolean;
  isPublished: boolean;
  faqs: ArticleFaq[];
  viewsCount?: number;
}

export interface SeoAuditResult {
  score: number; // 0 - 100
  checks: {
    id: string;
    label: string;
    passed: boolean;
    recommendation: string;
    severity: 'critical' | 'warning' | 'info';
  }[];
}

export const defaultAuthor: ArticleAuthor = {
  name: 'Venkatesh Ramanathan',
  role: 'Chief Fixed Income Strategist',
  credentials: 'CFP®, CFA',
  bio: 'Venkatesh has 18+ years evaluating Indian debt securities, banking regulations, and retirement cashflow structuring for senior citizens.'
};

export const initialGuideArticles: GuideArticle[] = [
  {
    id: 'guide-80ttb-senior-citizen-tax',
    slug: 'section-80ttb-tax-saving-senior-citizens-guide',
    title: 'Section 80TTB Tax Exemption Guide: How Senior Citizens Save Up to ₹50,000 on FD Interest',
    metaTitle: 'Section 80TTB Guide: Save ₹50,000 on FD Interest | Tax FY 2025-26',
    metaDescription: 'Complete guide to Section 80TTB for Indian senior citizens. Learn how to claim ₹50,000 interest deduction on Bank FDs, Post Office deposits, and save tax.',
    canonicalUrl: 'https://yieldnest.online/guide/section-80ttb-tax-saving-senior-citizens-guide',
    primaryKeyword: 'Section 80TTB',
    secondaryKeywords: ['Senior citizen FD tax', 'Form 15H', 'Section 80TTA vs 80TTB', 'TDS on fixed deposits', 'Bank interest tax deduction'],
    category: 'Taxation & 80TTB',
    excerpt: 'Under Section 80TTB of the Indian Income Tax Act, senior citizens aged 60 and above can claim up to ₹50,000 in interest deductions across savings accounts and fixed deposits every financial year.',
    author: defaultAuthor,
    publishedDate: '2025-02-15',
    updatedDate: '2025-03-01',
    readTimeMinutes: 7,
    featured: true,
    isPublished: true,
    faqs: [
      {
        question: 'Does Section 80TTB apply to Corporate Fixed Deposits and NBFC deposits?',
        answer: 'No. Section 80TTB explicitly covers interest earned from banking companies, co-operative banks, and Post Office deposits. Interest from NBFC and corporate FDs (such as Bajaj Finance or Shriram Finance) does not qualify under Section 80TTB and is fully taxable at your applicable income tax slab.'
      },
      {
        question: 'Can I claim both Section 80TTA and Section 80TTB in the same financial year?',
        answer: 'No. As per Section 80TTA(2), individual taxpayers claiming deductions under Section 80TTB are barred from claiming deductions under Section 80TTA. Section 80TTB is significantly more beneficial for senior citizens as it offers up to ₹50,000 covering both savings and term deposits, whereas Section 80TTA only offers ₹10,000 on savings account interest.'
      },
      {
        question: 'How does Section 80TTB interact with Form 15H?',
        answer: 'Form 15H is a self-declaration submitted to your bank requesting zero TDS deduction if your total estimated annual income falls below the taxable threshold. Section 80TTB reduces your total taxable income by up to ₹50,000 when filing your Income Tax Return, lowering your final tax liability to zero if your taxable income stays within the basic exemption slab.'
      }
    ],
    content: `## What is Section 80TTB of the Income Tax Act?

Section 80TTB was introduced by the Ministry of Finance specifically to provide financial relief and tax savings to Indian senior citizens (resident individuals aged 60 years or above at any time during the relevant financial year).

Prior to its introduction, senior citizens were restricted to the standard Section 80TTA deduction, which capped interest deductions at just ₹10,000 and strictly excluded term and fixed deposits. Under **Section 80TTB**, eligible senior citizens can deduct up to **₹50,000 per financial year** from their gross total income.

---

### Key Highlights of Section 80TTB:
- **Maximum Deduction Limit:** Up to ₹50,000 per financial year.
- **Eligible Deposits:** Savings bank accounts, Fixed Deposits (FDs), Recurring Deposits (RDs), and Post Office Schemes including SCSS (Senior Citizen Savings Scheme).
- **Ineligible Deposits:** Corporate FDs, NBFC deposits, Company Debentures, and Mutual Fund Debt schemes.
- **Section 80TTA Bar:** Senior citizens claiming 80TTB cannot simultaneously claim Section 80TTA.

---

## Which Deposits Qualify for Section 80TTB?

The statutory deduction applies to interest earned from specified financial institutions:

1. **Scheduled Commercial Banks:** Public sector banks (SBI, PNB, Canara Bank, etc.) and private sector banks (HDFC, ICICI, Axis, Kotak, Federal Bank, etc.).
2. **Small Finance Banks (SFBs):** High-yield RBI-scheduled banks like Unity SFB, AU SFB, Equitas SFB, Suryoday SFB, and Ujjivan SFB.
3. **Co-operative Banks:** Registered state and urban co-operative banking entities.
4. **Post Office Small Savings Schemes:** Including Post Office Time Deposits, Post Office Recurring Deposits, and the flagship 8.20% Senior Citizen Savings Scheme (SCSS).

> **Statutory Caution:** Interest earned on corporate NBFC deposits (e.g. Bajaj Finance, Mahindra Finance, Muthoot Capital) is classified under 'Income from Other Sources' and cannot be deducted under Section 80TTB.

---

## TDS Exemption Threshold for Senior Citizens (Section 194A)

Along with Section 80TTB, Section 194A was amended to increase the Tax Deducted at Source (TDS) threshold for senior citizens to **₹50,000** per bank per financial year (compared to ₹40,000 for general citizens).

If your total interest income across all branches of a single bank is below ₹50,000:
- The bank **will not deduct TDS**.
- If interest exceeds ₹50,000 but your total taxable income is below the taxable threshold, submit **Form 15H** at the beginning of April to prevent TDS deductions.

---

## Mathematical Case Study: Tax Saved Under Section 80TTB

Consider Mr. R. Sharma, aged 66, who has invested ₹6,00,000 in a Senior Citizen Fixed Deposit yielding 7.50% p.a. and ₹10,00,000 in SCSS yielding 8.20% p.a.

- **Annual FD Interest:** ₹45,000
- **Annual SCSS Interest:** ₹82,000
- **Total Interest Income:** ₹1,27,000

| Parameter | Without 80TTB | With Section 80TTB |
| :--- | :--- | :--- |
| **Gross Interest Income** | ₹1,27,000 | ₹1,27,000 |
| **Section 80TTB Deduction** | ₹0 | -₹50,000 |
| **Taxable Interest Income** | ₹1,27,000 | ₹77,000 |
| **Tax Saved @ 20% Slab + Cess** | ₹0 | **₹10,400 Saved** |
| **Tax Saved @ 30% Slab + Cess** | ₹0 | **₹15,600 Saved** |

---

## Step-by-Step Guide to Claiming Section 80TTB in ITR

1. **Gather Form 26AS & AIS/TIS:** Download your Annual Information Statement from the Income Tax e-filing portal to cross-verify all reported interest.
2. **Report Gross Interest:** In ITR-1 (Sahaj) or ITR-2, input your total interest under 'Income from Other Sources' (split between Savings Interest and Term Deposit Interest).
3. **Enter Section 80TTB Deduction:** Under 'Deductions under Chapter VI-A', enter the deduction under Section 80TTB up to the maximum allowable cap of ₹50,000.
4. **Submit Form 15H Early:** For the upcoming financial year, deliver Form 15H to each bank holding your deposits in April to prevent unnecessary refund claims.`
  },
  {
    id: 'guide-dicgc-deposit-insurance-safety',
    slug: 'dicgc-5-lakh-deposit-insurance-rules-bank-fd',
    title: 'DICGC ₹5 Lakh Deposit Insurance: How to Safely Allocate ₹25 Lakhs Across Indian Banks',
    metaTitle: 'DICGC ₹5 Lakh Insurance Rule: Safely Spread ₹25 Lakhs in Banks',
    metaDescription: 'Learn how DICGC ₹5 Lakh deposit insurance works across Indian banks. Understand the "same right and same capacity" rule to protect high-value fixed deposits.',
    canonicalUrl: 'https://yieldnest.online/guide/dicgc-5-lakh-deposit-insurance-rules-bank-fd',
    primaryKeyword: 'DICGC 5 Lakh Insurance',
    secondaryKeywords: ['Deposit Insurance India', 'DICGC bank failure protection', 'Are SFBs insured by DICGC', 'Safe fixed deposit strategy'],
    category: 'Bank FDs & DICGC',
    excerpt: 'The Deposit Insurance and Credit Guarantee Corporation (DICGC), an RBI subsidiary, insures bank deposits up to ₹5,00,000 per depositor per bank across principal and interest.',
    author: defaultAuthor,
    publishedDate: '2025-02-18',
    updatedDate: '2025-03-02',
    readTimeMinutes: 6,
    featured: false,
    isPublished: true,
    faqs: [
      {
        question: 'Are Small Finance Banks (SFBs) covered under DICGC insurance?',
        answer: 'Yes. All RBI-licensed Scheduled Small Finance Banks (including Unity SFB, AU SFB, Equitas SFB, Ujjivan SFB, and Suryoday SFB) enjoy the exact same statutory ₹5 Lakh DICGC deposit protection as Tier-1 public sector banks like SBI or PNB.'
      },
      {
        question: 'Does the ₹5,00,000 limit apply per branch or per bank?',
        answer: 'The ₹5,00,000 insurance limit applies per bank across all its branches combined. If you have ₹3 Lakhs in SBI Branch A and ₹4 Lakhs in SBI Branch B, your total aggregate deposit in SBI is ₹7 Lakhs, of which only ₹5 Lakhs is insured.'
      },
      {
        question: 'How does the "Same Right and Same Capacity" rule work for joint accounts?',
        answer: 'Deposits held in different capacities or rights are insured separately up to ₹5 Lakhs each. For example, an individual account held by Person A, a joint account held by Person A & Person B (where A is primary), and a joint account held by Person B & Person A (where B is primary) each qualify for independent ₹5 Lakh protection limits within the same bank.'
      }
    ],
    content: `## Introduction to DICGC Deposit Insurance

When evaluating bank fixed deposits, yield should never come at the cost of capital security. Fortunately, the **Deposit Insurance and Credit Guarantee Corporation (DICGC)**, a wholly-owned subsidiary of the Reserve Bank of India, provides a statutory safety net for Indian depositors.

Following the 2020 regulatory amendment, the insurance protection was elevated from ₹1,00,000 to **₹5,00,000 per depositor per bank**.

---

### What Does the ₹5 Lakh Insurance Cover?
The insurance covers both **Principal** and **Accrued Interest** up to an aggregate ceiling of ₹5,00,000 across:
- Savings bank accounts
- Current accounts
- Fixed Deposits (Term Deposits)
- Recurring Deposits

---

## The Critical "Same Bank, All Branches" Rule

A common misconception among conservative depositors is opening accounts in multiple branches of the same bank to gain multiple insurance limits.

> **Crucial Rule:** All branches of a single bank are clubbed together. If you hold three ₹2,00,000 FDs across three different branches of Bank of Baroda, your total deposit is ₹6,00,000, and you carry ₹1,00,000 of uninsured exposure in that institution.

---

## Strategy: How to Safely Park ₹25 Lakhs with 100% DICGC Protection

To maximize your yield while maintaining zero credit risk on high-value retirement corpuses, diversify across distinct bank balance sheets:

| Institution | Category | Allocation | Card Rate (Senior) | Insured Status |
| :--- | :--- | :--- | :--- | :--- |
| **State Bank of India** | PSU Bank | ₹4,50,000 | 7.60% p.a. | 100% Insured |
| **HDFC Bank** | Large Private | ₹4,50,000 | 7.75% p.a. | 100% Insured |
| **Unity Small Finance Bank** | Scheduled SFB | ₹4,50,000 | 9.40% p.a. | 100% Insured |
| **AU Small Finance Bank** | Scheduled SFB | ₹4,50,000 | 8.50% p.a. | 100% Insured |
| **Federal Bank** | Private Bank | ₹4,50,000 | 7.80% p.a. | 100% Insured |
| **Total Corpus** | Multi-Bank Ladder | **₹22,50,000** | **~8.21% Avg Yield** | **100% DICGC Insured** |

*Note: Allocating ₹4,50,000 (instead of the full ₹5,00,000) leaves buffer for cumulative interest compounding without breaching the ₹5,00,000 statutory limit.*`
  },
  {
    id: 'guide-rbi-floating-rate-savings-bonds',
    slug: 'rbi-floating-rate-savings-bonds-complete-investor-guide',
    title: 'RBI Floating Rate Savings Bonds (FRSB 2020): 8.05% Sovereign Yield vs Bank Fixed Deposits',
    metaTitle: 'RBI Floating Rate Bonds Guide (8.05%): Sovereign Safety vs Bank FDs',
    metaDescription: 'Detailed investor guide on RBI Floating Rate Savings Bonds (FRSB 2020). Learn interest reset formula, senior citizen premature withdrawal rules, and tax treatment.',
    canonicalUrl: 'https://yieldnest.online/guide/rbi-floating-rate-savings-bonds-complete-investor-guide',
    primaryKeyword: 'RBI Floating Rate Savings Bonds',
    secondaryKeywords: ['RBI FRSB 2020', '8.05% RBI Bond', 'RBI bonds for senior citizens', 'Sovereign debt India', 'RBI bonds premature withdrawal'],
    category: 'RBI Sovereign Bonds',
    excerpt: 'RBI Floating Rate Savings Bonds offer an attractive 8.05% interest rate backed by the sovereign guarantee of the Government of India, with interest pegged 35 bps above the National Savings Certificate.',
    author: defaultAuthor,
    publishedDate: '2025-02-22',
    updatedDate: '2025-03-05',
    readTimeMinutes: 8,
    featured: false,
    isPublished: true,
    faqs: [
      {
        question: 'How is the interest rate on RBI Floating Rate Savings Bonds determined?',
        answer: 'The interest rate on RBI Floating Rate Savings Bonds is pegged directly to the National Savings Certificate (NSC) rate with a mandatory statutory spread of +0.35% (+35 basis points). Because the current NSC rate is 7.70%, the RBI bond yields 8.05% p.a.'
      },
      {
        question: 'When can senior citizens prematurely liquidate RBI Floating Rate Bonds?',
        answer: 'While general investors are locked in for the full 7-year tenure, senior citizens enjoy structured premature liquidation privileges: Age 60 to 70 years can exit after 6 years; Age 70 to 80 years can exit after 5 years; Age 80+ (super senior citizens) can exit after 4 years.'
      },
      {
        question: 'Is there any maximum investment ceiling on RBI Floating Rate Bonds?',
        answer: 'No. Unlike the Senior Citizen Savings Scheme (SCSS) which has a strict ₹30 Lakh lifetime cap, RBI Floating Rate Savings Bonds have NO maximum investment limit. You can invest ₹50 Lakhs, ₹1 Crore, or more with full sovereign backing.'
      }
    ],
    content: `## What are RBI Floating Rate Savings Bonds (FRSB 2020)?

The Reserve Bank of India Floating Rate Savings Bonds (Taxable), 2020, are sovereign debt securities issued by the Reserve Bank of India on behalf of the Government of India.

For conservative investors seeking absolute safety of principal without the ₹5 Lakh bank insurance limitation, RBI bonds offer an unparalleled combination of sovereign guarantee and attractive floating yields.

---

### Key Bond Parameters at a Glance:
- **Current Coupon Yield:** **8.05% p.a.** (Paid semi-annually on Jan 1 and July 1).
- **Benchmark Peg:** NSC Benchmark + 35 bps spread.
- **Tenure:** 7 Years from date of issuance.
- **Minimum Investment:** ₹1,000 (Multiples of ₹1,000).
- **Maximum Investment:** **No upper limit** (Unlimited sovereign capacity).
- **Credit Rating:** Sovereign (Zero default risk).

---

## Interest Reset Mechanism Explained

The coupon rate on RBI Floating Rate Bonds is reset twice every year:
1. **First Reset:** January 1st
2. **Second Reset:** July 1st

The rate is mathematically linked to the Government of India's small savings rate for the **National Savings Certificate (NSC)**:

$$\\text{RBI Bond Coupon} = \\text{Active NSC Rate} + 0.35\\%$$

Since the Ministry of Finance currently maintains the NSC rate at 7.70%, the RBI Floating Rate Bond offers **8.05% per annum**. If the Government raises the NSC rate in an inflationary cycle, your bond coupon automatically increases.

---

## Senior Citizen Premature Exit Rules

Although general investors must hold the bond until maturity at 7 years, senior citizens receive special early exit windows:

| Age Bracket | Lock-in Before Early Redemption | Minimum Notice Period |
| :--- | :--- | :--- |
| **General Citizens (<60 years)** | Full 7 Years | None (Full tenure) |
| **Senior Citizens (60 to 70 years)** | 6 Years | 6 Months prior |
| **Senior Citizens (70 to 80 years)** | 5 Years | 6 Months prior |
| **Super Seniors (80+ years)** | 4 Years | 6 Months prior |

---

## Tax Implications on RBI Bonds
- **TDS Applicable:** TDS is deducted under Section 193 if annual interest exceeds ₹10,000.
- **Form 15G / 15H:** Eligible investors can submit Form 15H (senior citizens) to waive TDS.
- **Section 80TTB Eligibility:** Because the bond is issued directly by the Government of India (not a commercial bank), interest does not qualify under Section 80TTB.`
  },
  {
    id: 'guide-corporate-fixed-deposits-ratings-risk',
    slug: 'corporate-fixed-deposit-ratings-and-risk-analysis',
    title: 'Corporate Fixed Deposits in India: CRISIL AAA vs AA Ratings, Risk Analysis & Tax Rules',
    metaTitle: 'Corporate Fixed Deposits Guide: CRISIL AAA vs AA Risk & Returns',
    metaDescription: 'Complete risk and yield analysis of Corporate Fixed Deposits in India. Learn credit ratings (CRISIL, ICRA), default safety checks, and Section 194A TDS rules.',
    canonicalUrl: 'https://yieldnest.online/guide/corporate-fixed-deposit-ratings-and-risk-analysis',
    primaryKeyword: 'Corporate Fixed Deposits India',
    secondaryKeywords: ['CRISIL AAA rating meaning', 'NBFC fixed deposits', 'Bajaj Finance FD safety', 'Corporate FD vs Bank FD', 'TDS on company fixed deposits'],
    category: 'Corporate Debt & Ratings',
    excerpt: 'Corporate and NBFC Fixed Deposits offer yields up to 9.25% p.a. Understanding credit ratings from CRISIL, ICRA, and CARE is essential before investing, as corporate deposits do not carry DICGC insurance.',
    author: defaultAuthor,
    publishedDate: '2025-02-26',
    updatedDate: '2025-03-08',
    readTimeMinutes: 7,
    featured: false,
    isPublished: true,
    faqs: [
      {
        question: 'Are Corporate Fixed Deposits insured by DICGC?',
        answer: 'No. DICGC insurance exclusively covers RBI-scheduled commercial banks and small finance banks. Corporate fixed deposits issued by NBFCs or housing finance companies (e.g. Bajaj Finance, Shriram Finance, Sundaram Finance) carry corporate credit risk and are not covered by DICGC.'
      },
      {
        question: 'What is the TDS threshold for Corporate Fixed Deposits?',
        answer: 'Under Section 194A, the TDS threshold for corporate deposits is strictly ₹5,000 per financial year (compared to ₹50,000 for senior citizens in commercial banks). If your annual interest from an NBFC deposit exceeds ₹5,000, 10% TDS will be deducted unless you submit Form 15G or 15H.'
      },
      {
        question: 'What credit rating should I insist on for corporate FDs?',
        answer: 'Conservative retail investors and senior citizens should strictly restrict their investments to deposits bearing "AAA" or "AA+" ratings from accredited SEBI-registered rating agencies (CRISIL, ICRA, CARE, or India Ratings). Never invest in unrated or lower-tier deposits solely for a 50 bps yield pickup.'
      }
    ],
    content: `## What are Corporate Fixed Deposits?

A Corporate Fixed Deposit (Company FD) is a term deposit placed with non-banking financial companies (NBFCs) or housing finance corporations (HFCs) regulated under Reserve Bank of India guidelines.

Because corporate issuers cannot collect low-cost current and savings account (CASA) deposits from the public, they offer a **100 to 200 basis point spread (1.0% to 2.0%)** over traditional bank FD rates to fund their lending operations.

---

### Credit Rating Hierarchy (CRISIL / ICRA / CARE):
1. **AAA (Highest Safety):** The highest degree of safety regarding timely servicing of financial obligations. Issuers carry the lowest credit risk. (e.g. Bajaj Finance, Sundaram Finance, LIC Housing).
2. **AA+ / AA (High Safety):** High degree of safety and very low credit risk. May have minor sensitivity to prolonged economic downturns. (e.g. Shriram Finance, Piramal Finance, Mahindra Finance).
3. **A and Below (Sub-prime for retail):** Inadequate safety margin. Retail and senior depositors should strictly avoid these tiers.

---

## Comparative Matrix: Bank FD vs Corporate NBFC FD

| Feature | Scheduled Bank FD | Corporate / NBFC FD |
| :--- | :--- | :--- |
| **Typical Senior Yield** | 7.50% - 9.40% | **8.50% - 9.25%** |
| **DICGC Statutory Cover** | Insured up to ₹5,00,000 | **Zero DICGC Insurance** |
| **Regulatory Body** | RBI Department of Supervision | RBI NBFC Scale-Based Framework |
| **TDS Threshold** | ₹50,000 (Senior) / ₹40,000 (Gen) | **₹5,000 per issuer (Sec 194A)** |
| **Section 80TTB Tax Relief** | Fully Eligible (up to ₹50k) | **Ineligible (Slab tax applies)** |
| **Premature Liquidation** | Allowed (Nominal 0.5-1% penalty) | Restricted (Min 3-month lock-in) |

---

## 4 Prudent Rules for Investing in Corporate FDs

1. **Limit Exposure to 15-20% of Debt Portfolio:** Treat corporate deposits as a yield-enhancer, not the foundational anchor of your retirement corpus.
2. **Stick Exclusively to AAA / AA+:** Insist on active rating letters from CRISIL or ICRA published within the past 12 months.
3. **Opt for Annual or Cumulative Payouts:** If you do not require monthly income, compounding preserves higher internal rates of return.
4. **Submit Form 15G / 15H Promptly:** Given the low ₹5,000 TDS threshold, submit your declaration early in April to avoid blocked capital.`
  },
  {
    id: 'guide-form-15g-15h-zero-tds-fd-interest',
    slug: 'form-15g-form-15h-zero-tds-bank-fd-interest-guide',
    title: 'Form 15G and Form 15H Guide: How to Stop TDS Deductions on Bank Fixed Deposits',
    metaTitle: 'Form 15G & 15H Guide: Stop TDS Deductions on Bank FD Interest',
    metaDescription: 'Step-by-step instructions for submitting Form 15G (under 60) and Form 15H (senior citizens) to prevent TDS on bank interest income under Section 197A.',
    canonicalUrl: 'https://yieldnest.online/guide/form-15g-form-15h-zero-tds-bank-fd-interest-guide',
    primaryKeyword: 'Form 15G and Form 15H',
    secondaryKeywords: ['Avoid TDS on bank FD', 'Form 15H eligibility rules', 'Section 197A self declaration', 'Net banking submit 15H', 'Form 15G download'],
    category: 'Taxation & 80TTB',
    excerpt: 'Form 15G and Form 15H are self-declaration forms submitted under Section 197A of the Income Tax Act to request that banks do not deduct 10% TDS on your interest income.',
    author: defaultAuthor,
    publishedDate: '2025-03-01',
    updatedDate: '2025-03-10',
    readTimeMinutes: 5,
    featured: false,
    isPublished: true,
    faqs: [
      {
        question: 'Who is eligible to submit Form 15H vs Form 15G?',
        answer: 'Form 15H is reserved exclusively for resident senior citizens aged 60 years or above. Form 15G is for resident individuals under 60 years of age and Hindu Undivided Families (HUFs). Companies, LLPs, and Non-Resident Indians (NRIs) are not permitted to submit Form 15G or 15H.'
      },
      {
        question: 'Can I submit Form 15H if my total interest exceeds the basic exemption limit?',
        answer: 'Yes. Unlike Form 15G (which requires total interest income to stay below the basic tax exemption limit), senior citizens submitting Form 15H are only required to show that their final calculated tax liability for the financial year will be NIL (taking into account Chapter VI-A deductions like Section 80C, 80D, 80TTB, and rebate under 87A).'
      },
      {
        question: 'When is the best time to submit Form 15G or Form 15H?',
        answer: 'Submit Form 15G or 15H in the first week of April at the start of every new financial year. If you open a new fixed deposit mid-year, submit the form at the time of booking to ensure the bank flags your customer ID before quarterly TDS runs.'
      }
    ],
    content: `## What are Form 15G and Form 15H?

Under Section 194A of the Indian Income Tax Act, banks are statutorily mandated to deduct **10% Tax Deducted at Source (TDS)** whenever annual interest income exceeds specified thresholds:
- **₹50,000** for Senior Citizens (Aged 60+)
- **₹40,000** for Non-Senior Citizens

If your total annual income is below the taxable threshold, having the bank deduct TDS causes unnecessary cashflow blockage, requiring you to wait until ITR filing to claim a refund from the Income Tax Department.

**Form 15G and Form 15H** are statutory self-declarations under Section 197A that instruct the bank: *"My total income is below the taxable threshold; please credit my interest in full without deducting TDS."*

---

## Form 15G vs Form 15H: Eligibility Comparison

| Parameter | Form 15G | Form 15H |
| :--- | :--- | :--- |
| **Applicable Age** | Below 60 Years | **60 Years and Above (Senior Citizens)** |
| **Eligible Entities** | Resident Individuals & HUFs | **Resident Senior Citizens Only** |
| **NRIs Allowed?** | No (NRIs cannot submit 15G) | No (NRIs cannot submit 15H) |
| **Interest Income Cap** | Must be $\\le$ Basic Exemption Limit (₹2.5L/₹3.0L) | **No Interest Cap** (Only net tax must be NIL) |
| **Validity** | One Financial Year (Valid till March 31) | **One Financial Year (Valid till March 31)** |

---

## Step-by-Step: How to Submit Form 15H via Net Banking

Almost all major scheduled banks (SBI, HDFC, ICICI, PNB, Canara Bank, Axis Bank) now allow paperless submission of Form 15G/15H:

1. **Log into Net Banking:** Navigate to 'Service Requests' or 'Tax Centre'.
2. **Select Form 15G / 15H:** Choose Form 15H (if 60+) or Form 15G.
3. **Verify Customer ID & PAN:** Ensure your PAN is correctly linked; declarations without a valid PAN trigger mandatory 20% TDS under Section 206AA.
4. **Input Estimated Annual Income:** Enter your estimated total income and the total count of fixed deposit accounts.
5. **Authenticate with OTP:** Complete Aadhaar OTP or mobile OTP verification.
6. **Save Acknowledgment:** Download the URN (Unique Reference Number) receipt for your records.`
  }
];

export function calculateSeoScore(article: Partial<GuideArticle>): SeoAuditResult {
  const checks: SeoAuditResult['checks'] = [];
  let score = 0;
  const maxScore = 100;

  // Check 1: Title Length (Optimal: 50-60 chars) - Weight: 15
  const titleLen = (article.title || '').trim().length;
  if (titleLen >= 40 && titleLen <= 70) {
    score += 15;
    checks.push({
      id: 'title-length',
      label: `Title Length (${titleLen} chars)`,
      passed: true,
      recommendation: 'Title is within optimal search engine display limits (40-70 characters).',
      severity: 'info'
    });
  } else {
    checks.push({
      id: 'title-length',
      label: `Title Length (${titleLen} chars)`,
      passed: false,
      recommendation: titleLen < 40 ? 'Title is too short. Expand to 45-65 characters for better CTR.' : 'Title exceeds 70 characters and may get truncated in Google search results.',
      severity: 'warning'
    });
  }

  // Check 2: Meta Description Length (Optimal: 140-160 chars) - Weight: 15
  const metaDescLen = (article.metaDescription || '').trim().length;
  if (metaDescLen >= 120 && metaDescLen <= 165) {
    score += 15;
    checks.push({
      id: 'meta-description',
      label: `Meta Description (${metaDescLen} chars)`,
      passed: true,
      recommendation: 'Meta description length is ideal for desktop and mobile SERP previews.',
      severity: 'info'
    });
  } else {
    checks.push({
      id: 'meta-description',
      label: `Meta Description (${metaDescLen} chars)`,
      passed: false,
      recommendation: metaDescLen < 120 ? 'Meta description is too short (< 120 chars). Provide a richer summary.' : 'Meta description exceeds 165 characters and will be clipped in search snippets.',
      severity: 'critical'
    });
  }

  // Check 3: Focus Keyword Defined and Present in Title - Weight: 15
  const kw = (article.primaryKeyword || '').trim().toLowerCase();
  const titleLower = (article.title || '').toLowerCase();
  if (kw.length > 2 && titleLower.includes(kw)) {
    score += 15;
    checks.push({
      id: 'kw-in-title',
      label: `Primary Keyword "${article.primaryKeyword}" in Title`,
      passed: true,
      recommendation: 'Primary keyword is prominently featured in the H1 title.',
      severity: 'info'
    });
  } else {
    checks.push({
      id: 'kw-in-title',
      label: `Primary Keyword in Title`,
      passed: false,
      recommendation: `Ensure your primary keyword "${article.primaryKeyword || 'your keyword'}" appears naturally in the article title.`,
      severity: 'critical'
    });
  }

  // Check 4: Focus Keyword in Meta Description - Weight: 10
  const metaLower = (article.metaDescription || '').toLowerCase();
  if (kw.length > 2 && metaLower.includes(kw)) {
    score += 10;
    checks.push({
      id: 'kw-in-meta',
      label: `Primary Keyword in Meta Description`,
      passed: true,
      recommendation: 'Keyword appears in meta description, which Google bolds in search snippets.',
      severity: 'info'
    });
  } else {
    checks.push({
      id: 'kw-in-meta',
      label: `Primary Keyword in Meta Description`,
      passed: false,
      recommendation: 'Include your focus keyword in the meta description to improve click-through rates.',
      severity: 'warning'
    });
  }

  // Check 5: URL Slug SEO Cleanliness - Weight: 10
  const slug = (article.slug || '').trim();
  const isSlugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  if (slug.length >= 8 && isSlugValid) {
    score += 10;
    checks.push({
      id: 'slug-format',
      label: `Clean URL Slug (/guide/${slug})`,
      passed: true,
      recommendation: 'URL slug is lowercase, hyphen-delimited, and free of special characters.',
      severity: 'info'
    });
  } else {
    checks.push({
      id: 'slug-format',
      label: `URL Slug Formatting`,
      passed: false,
      recommendation: 'Slug must be lowercase alphanumeric words separated by single hyphens.',
      severity: 'critical'
    });
  }

  // Check 6: Content Depth & Word Count - Weight: 15
  const content = (article.content || '').trim();
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 450) {
    score += 15;
    checks.push({
      id: 'content-depth',
      label: `Content Depth (${wordCount} words)`,
      passed: true,
      recommendation: 'Comprehensive article depth exceeds the 450-word authoritative threshold.',
      severity: 'info'
    });
  } else if (wordCount >= 250) {
    score += 8;
    checks.push({
      id: 'content-depth',
      label: `Content Depth (${wordCount} words)`,
      passed: false,
      recommendation: 'Article has decent length but could benefit from more detailed analysis (aim for 500+ words).',
      severity: 'warning'
    });
  } else {
    checks.push({
      id: 'content-depth',
      label: `Content Depth (${wordCount} words)`,
      passed: false,
      recommendation: 'Content is too thin (<250 words) to rank well competitively in financial search queries.',
      severity: 'critical'
    });
  }

  // Check 7: Subheadings (H2) Structure - Weight: 10
  const h2Count = (content.match(/^##\s+/gm) || []).length;
  if (h2Count >= 2) {
    score += 10;
    checks.push({
      id: 'h2-structure',
      label: `Subheading Structure (${h2Count} H2 sections)`,
      passed: true,
      recommendation: 'Well-organized semantic outline with multiple H2 headings.',
      severity: 'info'
    });
  } else {
    checks.push({
      id: 'h2-structure',
      label: `Subheading Structure (${h2Count} H2 sections)`,
      passed: false,
      recommendation: 'Include at least two H2 subheadings (## Subheading) for readable content hierarchy.',
      severity: 'warning'
    });
  }

  // Check 8: FAQ Section with Schema Support - Weight: 10
  const faqs = article.faqs || [];
  if (faqs.length >= 2 && faqs.every(f => f.question.trim() && f.answer.trim())) {
    score += 10;
    checks.push({
      id: 'faq-schema',
      label: `FAQ Section (${faqs.length} Q&As)`,
      passed: true,
      recommendation: 'Structured FAQ array qualifies for Google Search rich accordion snippets via FAQPage JSON-LD.',
      severity: 'info'
    });
  } else {
    checks.push({
      id: 'faq-schema',
      label: `FAQ Section (${faqs.length} Q&As)`,
      passed: false,
      recommendation: 'Add at least 2 Q&As to unlock Google FAQ rich snippet snippets in search results.',
      severity: 'warning'
    });
  }

  return {
    score: Math.min(maxScore, Math.max(0, score)),
    checks
  };
}

export function generateArticleJsonLd(article: GuideArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.canonicalUrl || `https://yieldnest.online/guide/${article.slug}`
    },
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: 'https://yieldnest.online/og-image.png',
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Venkatesh Ramanathan',
      jobTitle: article.author?.role || 'Chief Fixed Income Strategist',
      description: article.author?.credentials || 'CFP®, CFA'
    },
    publisher: {
      '@type': 'Organization',
      name: 'YIELDNEST.ONLINE Debt Portal',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yieldnest.online/icon.png'
      }
    },
    datePublished: article.publishedDate,
    dateModified: article.updatedDate || article.publishedDate,
    keywords: [article.primaryKeyword, ...(article.secondaryKeywords || [])].join(', ')
  };
}

export function generateFaqJsonLd(faqs: ArticleFaq[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
