/**
 * Schema.org JSON-LD Structured Data for BharatFixed
 * Covers: Organization, Person (Author), FinancialService, WebSite, FAQPage, Article
 */
export const SITE_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://bharatfixed.in/#organization',
      name: 'BharatFixed',
      alternateName: 'Indian Debt & Fixed Income Intelligence Portal',
      url: 'https://bharatfixed.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bharatfixed.in/assets/bharatfixed-logo.png',
        width: '512',
        height: '512'
      },
      description: 'Independent Indian fixed income intelligence platform providing verified rates and yield calculators for Bank Fixed Deposits, SCSS, RBI Bonds, and Corporate Debt.',
      sameAs: [
        'https://www.rbi.org.in',
        'https://www.dicgc.org.in',
        'https://incometaxindia.gov.in'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'editorial & research inquiries',
        email: 'analyst@bharatfixed.in',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi']
      }
    },
    {
      '@type': 'Person',
      '@id': 'https://bharatfixed.in/#author',
      name: 'Venkatesh Ramanathan, CFP®, CFA',
      jobTitle: 'Lead Fixed Income Research Analyst & Retirement Wealth Specialist',
      worksFor: {
        '@id': 'https://bharatfixed.in/#organization'
      },
      description: 'Senior financial analyst with 14+ years covering RBI monetary policy, sovereign bond yield curves, and retirement fixed-income planning in India. Certified Financial Planner (CFP®) and CFA Charterholder.',
      knowsAbout: [
        'Indian Fixed Deposits',
        'Senior Citizen Savings Scheme (SCSS)',
        'RBI Floating Rate Savings Bonds',
        'Section 80TTB Tax Deductions',
        'DICGC Deposit Insurance Act 1961',
        'Form 15H & Form 15G Compliance'
      ],
      sameAs: [
        'https://www.linkedin.com',
        'https://bharatfixed.in/#author-methodology'
      ]
    },
    {
      '@type': 'WebSite',
      '@id': 'https://bharatfixed.in/#website',
      url: 'https://bharatfixed.in',
      name: 'BharatFixed',
      publisher: {
        '@id': 'https://bharatfixed.in/#organization'
      },
      inLanguage: 'en-IN'
    },
    {
      '@type': 'FinancialService',
      '@id': 'https://bharatfixed.in/#service',
      name: 'BharatFixed Debt Yield & Retirement Analytics',
      url: 'https://bharatfixed.in',
      serviceType: 'Fixed Income Comparison & Tax Optimization Service',
      provider: {
        '@id': 'https://bharatfixed.in/#organization'
      },
      areaServed: 'IN',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Fixed Income Instruments Analyzed',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'FinancialProduct',
              name: 'Senior Citizen Savings Scheme (SCSS)',
              description: 'Sovereign Government of India small savings scheme offering 8.20% p.a. quarterly interest with Section 80C deduction.',
              annualPercentageRate: 8.20,
              feesAndCommissionsSpecification: 'Zero entry or operational fees'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'FinancialProduct',
              name: 'RBI Floating Rate Savings Bonds (FRSB 2020)',
              description: '7-year Sovereign RBI bond yielding 8.05% with semi-annual interest payout pegged 35 bps over NSC.',
              annualPercentageRate: 8.05
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'FinancialProduct',
              name: 'Scheduled Bank Fixed Deposits (DICGC Insured)',
              description: 'Term deposits in Indian Scheduled Commercial Banks insured up to ₹5,00,000 under DICGC.',
              annualPercentageRate: 9.50
            }
          }
        ]
      }
    },
    {
      '@type': 'Article',
      '@id': 'https://bharatfixed.in/#article',
      isPartOf: {
        '@id': 'https://bharatfixed.in/#website'
      },
      headline: 'Indian Bank Fixed Deposit Rates, SCSS & Sovereign Debt Yield Analysis (September 2026)',
      description: 'Comprehensive analysis of interest rates across 25+ Indian Scheduled Banks, SCSS 8.20%, and RBI Floating Rate Bonds with Section 80TTB tax deduction modeling.',
      inLanguage: 'en-IN',
      mainEntityOfPage: 'https://bharatfixed.in',
      datePublished: '2026-01-15T08:00:00+05:30',
      dateModified: '2026-09-12T09:00:00+05:30',
      author: {
        '@id': 'https://bharatfixed.in/#author'
      },
      publisher: {
        '@id': 'https://bharatfixed.in/#organization'
      }
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://bharatfixed.in/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Section 80TTB and how does it benefit Indian Senior Citizens investing in FDs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Section 80TTB of the Income Tax Act allows resident senior citizens (aged 60+) to deduct up to ₹50,000 of interest income earned from bank fixed deposits, recurring deposits, and post office time deposits. In addition, no TDS is deducted under Section 194A by banks if annual interest remains under ₹50,000.'
          }
        },
        {
          '@type': 'Question',
          name: 'How does DICGC insurance protect bank fixed deposits in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Deposit Insurance and Credit Guarantee Corporation (DICGC), an RBI subsidiary, insures all deposits up to a statutory maximum of ₹5,00,000 (Rupees Five Lakhs) for both principal and interest per depositor per bank in the same capacity. This covers Public Sector, Private, and Scheduled Small Finance Banks.'
          }
        },
        {
          '@type': 'Question',
          name: 'Why do Small Finance Banks offer up to 9.0% - 9.5% on Senior Citizen FDs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Small Finance Banks offer higher interest rates to mobilize retail liability funding for local credit operations. As RBI Scheduled Commercial Banks, their deposits enjoy identical ₹5 Lakh DICGC insurance as large PSU banks like SBI.'
          }
        },
        {
          '@type': 'Question',
          name: 'How can senior citizens prevent 10% TDS deduction using Form 15H?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Resident senior citizens whose estimated total income results in zero tax liability can submit Form 15H at the beginning of the financial year. Once accepted with a valid PAN, the bank is legally barred from deducting TDS.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is the difference between Corporate Fixed Deposits and Bank FDs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Bank FDs are covered by DICGC insurance up to ₹5 Lakhs. Corporate FDs (issued by NBFCs like Bajaj Finance) are not covered by DICGC and rely purely on credit ratings from agencies like CRISIL/ICRA.'
          }
        }
      ]
    }
  ]
};
