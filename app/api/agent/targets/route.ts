import { NextRequest, NextResponse } from 'next/server';
import { defaultScrapeTargets, ScrapeTarget } from '@/lib/scraping-agent';

// Server-side storage for custom scrape targets added by the user
let customTargetsStore: ScrapeTarget[] = [];

export async function GET() {
  return NextResponse.json({
    defaultTargets: defaultScrapeTargets,
    customTargets: customTargetsStore,
    allTargets: [...defaultScrapeTargets, ...customTargetsStore],
    total: defaultScrapeTargets.length + customTargetsStore.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, officialUrl, category } = body;

    if (!name || !officialUrl) {
      return NextResponse.json({ error: 'Name and officialUrl are required' }, { status: 400 });
    }

    // Validate URL format
    let cleanUrl = officialUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      new URL(cleanUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Check if URL or name already exists in default or custom
    const existingDefault = defaultScrapeTargets.find(
      t => t.officialUrl.toLowerCase() === cleanUrl.toLowerCase() || t.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (existingDefault) {
      return NextResponse.json({
        error: `Target already exists in system as "${existingDefault.name}". You can select it directly from the targets list.`,
        existingTarget: existingDefault
      }, { status: 409 });
    }

    const existingCustom = customTargetsStore.find(
      t => t.officialUrl.toLowerCase() === cleanUrl.toLowerCase()
    );
    if (existingCustom) {
      return NextResponse.json({
        error: `Target URL already exists as "${existingCustom.name}".`,
        existingTarget: existingCustom
      }, { status: 409 });
    }

    const domainName = new URL(cleanUrl).hostname.replace('www.', '').split('.')[0];
    const newTargetId = `custom-${domainName}-${Date.now().toString(36)}`;

    const newTarget: ScrapeTarget = {
      id: newTargetId,
      name: name.trim(),
      category: category || 'corporate_nbfc',
      officialUrl: cleanUrl,
      status: 'idle',
      isCustom: true
    };

    customTargetsStore.push(newTarget);

    return NextResponse.json({
      success: true,
      message: `Successfully added ${newTarget.name} to the Bot's scrape endpoints.`,
      target: newTarget,
      allTargets: [...defaultScrapeTargets, ...customTargetsStore]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Target id is required' }, { status: 400 });
    }

    const initialLength = customTargetsStore.length;
    customTargetsStore = customTargetsStore.filter(t => t.id !== id);

    if (customTargetsStore.length === initialLength) {
      return NextResponse.json({ error: 'Target not found or cannot delete default built-in institutional targets' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Custom target URL removed from Bot',
      allTargets: [...defaultScrapeTargets, ...customTargetsStore]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
