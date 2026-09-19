import { NextRequest, NextResponse } from 'next/server';
import { initialDebtInstruments } from '@/lib/debt-data';

const DEBT_INSTRUMENTS = initialDebtInstruments;

// WebMCP (Web Model Context Protocol) tool definitions for 2026 Agentic Web
const WEBMCP_MANIFEST = {
  schema_version: '2026-01',
  name: 'YIELDNEST.ONLINE Indian Debt & Yield Tool Registry',
  description: 'Agentic tools for AI agents to query, filter, and calculate yields on Indian Fixed Deposits, SCSS, RBI Bonds, and Corporate Debt.',
  endpoint: '/api/mcp/tools',
  tools: [
    {
      name: 'search_debt_instruments',
      description: 'Search and filter Indian fixed-income instruments (Bank FDs, SCSS, RBI Bonds, Corporate NCDs) by interest rate, senior citizen bonus, tenure, and DICGC insurance status.',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['all', 'bank_fd', 'rbi_govt', 'corporate_fd', 'tax_saving'],
            description: 'Instrument category filter'
          },
          is_senior_citizen: {
            type: 'boolean',
            description: 'Whether to evaluate rates for senior citizens (aged 60+)'
          },
          min_rate: {
            type: 'number',
            description: 'Minimum interest rate percentage (e.g. 7.5)'
          },
          dicgc_only: {
            type: 'boolean',
            description: 'Filter only instruments covered by RBI DICGC ₹5 Lakh insurance'
          },
          query: {
            type: 'string',
            description: 'Keyword search for bank or issuer name (e.g., "SBI", "Unity", "HDFC")'
          }
        }
      }
    },
    {
      name: 'calculate_fd_yield',
      description: 'Calculate maturity value, total interest, quarterly compounding, post-tax returns, and Section 80TTB tax savings for Indian Fixed Deposits.',
      parameters: {
        type: 'object',
        required: ['principal', 'rate_percent', 'tenure_months'],
        properties: {
          principal: {
            type: 'number',
            description: 'Investment principal in Indian Rupees (INR)'
          },
          rate_percent: {
            type: 'number',
            description: 'Annual interest rate percentage (e.g. 7.5)'
          },
          tenure_months: {
            type: 'number',
            description: 'Deposit tenure in months'
          },
          is_senior_citizen: {
            type: 'boolean',
            description: 'If true, applies Section 80TTB exemption up to ₹50,000 and 15H TDS rules'
          },
          tax_bracket_percent: {
            type: 'number',
            enum: [0, 5, 10, 15, 20, 30],
            description: 'Investor income tax slab bracket percentage (default: 30%)'
          }
        }
      }
    },
    {
      name: 'get_statutory_rates',
      description: 'Fetch official benchmark statutory rates in India: RBI Repo Rate, SCSS, NSC, RBI Floating Rate, DICGC limit, and Section 80TTB deduction cap.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  ]
};

export async function GET() {
  return NextResponse.json(WEBMCP_MANIFEST, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400'
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, tool, name, params = {}, parameters = {} } = body;
    const toolName = action || tool || name;
    const args = Object.keys(params).length > 0 ? params : parameters;

    if (toolName === 'search_debt_instruments') {
      const { category = 'all', is_senior_citizen = false, min_rate = 0, dicgc_only = false, query = '' } = args;

      const results = DEBT_INSTRUMENTS.filter(inst => {
        if (category !== 'all' && inst.type !== category) return false;
        if (dicgc_only && !inst.dicgcCovered) return false;
        const rate = is_senior_citizen ? inst.seniorCitizenRate : inst.generalRate;
        if (rate < min_rate) return false;
        if (query) {
          const q = query.toLowerCase();
          const match = inst.name.toLowerCase().includes(q) ||
            inst.subType.toLowerCase().includes(q) ||
            inst.issuer.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      }).map(inst => ({
        id: inst.id,
        name: inst.name,
        issuer: inst.issuer,
        type: inst.type,
        subType: inst.subType,
        generalRate: inst.generalRate,
        seniorCitizenRate: inst.seniorCitizenRate,
        tenure: inst.popularTenureLabel,
        tenureMonthsMin: inst.tenureMonthsMin,
        tenureMonthsMax: inst.tenureMonthsMax,
        minInvestment: inst.minInvestment,
        creditRating: inst.creditRating,
        dicgcCovered: inst.dicgcCovered,
        tdsThreshold: inst.tdsThreshold,
        prematureWithdrawalAllowed: inst.prematureWithdrawalAllowed
      }));

      return NextResponse.json({
        success: true,
        tool: 'search_debt_instruments',
        total_found: results.length,
        results
      });
    }

    if (toolName === 'calculate_fd_yield') {
      const principal = Number(args.principal) || 100000;
      const rate = Number(args.rate_percent) || 7.5;
      const tenureMonths = Number(args.tenure_months) || 12;
      const isSenior = Boolean(args.is_senior_citizen);
      const taxBracket = Number(args.tax_bracket_percent ?? 30);

      // Quarterly compounding formula
      const years = tenureMonths / 12;
      const n = 4; // quarterly
      const maturity = principal * Math.pow(1 + (rate / 100) / n, n * years);
      const totalInterest = maturity - principal;

      // Section 80TTB calculation for Senior Citizens
      const annualInterest = totalInterest / Math.max(1, years);
      let taxableInterest = totalInterest;
      let taxDeductionClaimed = 0;

      if (isSenior) {
        // Section 80TTB allows up to ₹50,000 per financial year
        const annualExemption = Math.min(50000, annualInterest);
        taxDeductionClaimed = annualExemption * Math.min(years, 1);
        taxableInterest = Math.max(0, totalInterest - taxDeductionClaimed);
      }

      const totalTax = taxableInterest * (taxBracket / 100);
      const netYield = ((totalInterest - totalTax) / principal / years) * 100;
      const taxSaved80TTB = isSenior ? taxDeductionClaimed * (taxBracket / 100) : 0;

      return NextResponse.json({
        success: true,
        tool: 'calculate_fd_yield',
        calculation: {
          principal_inr: Math.round(principal),
          interest_rate_percent: rate,
          tenure_months: tenureMonths,
          maturity_amount_inr: Math.round(maturity),
          gross_interest_inr: Math.round(totalInterest),
          tax_bracket_applied: `${taxBracket}%`,
          tax_payable_inr: Math.round(totalTax),
          net_post_tax_maturity_inr: Math.round(maturity - totalTax),
          net_post_tax_yield_cagr_percent: Number(netYield.toFixed(2)),
          section_80ttb_benefit: isSenior ? {
            exemption_limit_inr: 50000,
            amount_exempted_inr: Math.round(taxDeductionClaimed),
            tax_saved_inr: Math.round(taxSaved80TTB),
            form_15h_eligible: totalTax === 0 || taxBracket === 0
          } : null,
          dicgc_status: principal <= 500000 ? '100% Principal & Interest Insured under DICGC ₹5 Lakh Limit' : 'Warning: Principal exceeds ₹5 Lakh DICGC single-bank limit. Consider spreading across banks.'
        }
      });
    }

    if (toolName === 'get_statutory_rates') {
      return NextResponse.json({
        success: true,
        tool: 'get_statutory_rates',
        data: {
          as_of_date: '2026-09-12',
          statutory_rates: {
            rbi_repo_rate: '6.50%',
            senior_citizen_savings_scheme_scss: '8.20% (Quarterly Payout, MoF Notified)',
            rbi_floating_rate_savings_bonds: '8.05% (NSC rate 7.70% + 35 bps)',
            national_savings_certificate_nsc: '7.70%',
            public_provident_fund_ppf: '7.10%',
            dicgc_deposit_insurance_limit: '₹5,00,000 per depositor per scheduled bank',
            section_80ttb_senior_exemption: '₹50,000 per financial year for resident seniors (60+)',
            section_80tta_general_exemption: '₹10,000 for non-seniors (savings accounts only)',
            section_54ec_capital_gains_cap: '₹50,00,000 per assessment year (REC/PFC/NHAI bonds at 5.25%)',
            form_15h_age_eligibility: 'Resident individual aged 60 years or above with estimated nil tax liability',
            form_15g_age_eligibility: 'Resident individual aged under 60 years whose interest does not exceed basic tax exemption limit'
          },
          data_verification_source: 'Reserve Bank of India & Ministry of Finance Department of Economic Affairs Gazette'
        }
      });
    }

    return NextResponse.json({
      error: `Unknown tool name '${toolName}'. Available tools: search_debt_instruments, calculate_fd_yield, get_statutory_rates`,
      available_tools: WEBMCP_MANIFEST.tools.map(t => t.name)
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to process WebMCP tool execution',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
