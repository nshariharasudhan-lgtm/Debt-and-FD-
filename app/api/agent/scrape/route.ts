import { NextRequest, NextResponse } from 'next/server';
import { runScrapingAgent, scrapeCustomUrl, defaultScrapeTargets } from '@/lib/scraping-agent';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // If a custom URL is provided, run the intelligent single-endpoint crawler
    if (body.url && typeof body.url === 'string' && body.url.trim().length > 0) {
      const urlResult = await scrapeCustomUrl(
        body.url.trim(),
        Array.isArray(body.existingInstruments) ? body.existingInstruments : []
      );

      return NextResponse.json({
        success: true,
        type: 'url_scrape',
        data: urlResult
      });
    }

    // Otherwise run institutional batch scraper
    const customTargets = Array.isArray(body.customTargets) ? body.customTargets : [];
    const allKnownTargets = [...defaultScrapeTargets, ...customTargets];
    const targetIds = body.targetIds && Array.isArray(body.targetIds) && body.targetIds.length > 0
      ? body.targetIds
      : allKnownTargets.map(t => t.id);

    const existingInstruments = Array.isArray(body.existingInstruments) ? body.existingInstruments : [];

    const result = await runScrapingAgent(targetIds, body.apiKey, customTargets, existingInstruments);

    return NextResponse.json({
      success: true,
      type: 'batch_scrape',
      data: result
    });
  } catch (err: any) {
    console.error('Scraping agent error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Scraping agent encountered an internal failure'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Agent Ready',
    supportedTargets: defaultScrapeTargets,
    model: 'gemini-3.8-flash'
  });
}
