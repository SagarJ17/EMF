import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handleUrl = searchParams.get("url") || "";

  try {
    // 1. Fetch channel page to extract the true UC... ID
    let channelId = "";
    
    // If they already provided an RSS link or UC ID
    if (handleUrl.includes("channel_id=")) {
      channelId = handleUrl.split("channel_id=")[1].split("&")[0];
    } else if (handleUrl.includes("/channel/UC")) {
      channelId = handleUrl.split("/channel/")[1].split("/")[0];
    } else {
      // It's a handle like youtube.com/@EMF
      const htmlRes = await fetch(handleUrl);
      const html = await htmlRes.text();
      // Parse the channelId from the youtube meta tags
      const match = html.match(/"channelId":"(UC[a-zA-Z0-9_-]{22})"/);
      if (match && match[1]) {
        channelId = match[1];
      }
    }

    if (!channelId) {
      return NextResponse.json({ error: "Could not resolve Channel ID" }, { status: 400 });
    }

    // 2. Fetch the XML RSS Feed
    const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    if (!rssRes.ok) throw new Error("RSS Fetch failed");
    
    const xml = await rssRes.text();

    // 3. Parse XML using rudimentary RegEx or return raw text
    // We will parse out the <entry> blocks manually to return JSON!
    const entries: any[] = [];
    const entryBlocks = xml.split("<entry>").slice(1);
    
    for (const block of entryBlocks) {
      const videoIdMatch = block.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = block.match(/<title>(.*?)<\/title>/);
      
      if (videoIdMatch && titleMatch) {
         entries.push({
            id: videoIdMatch[1],
            title: titleMatch[1],
            url: `https://www.youtube.com/watch?v=${videoIdMatch[1]}`,
            thumbnail: `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`
         });
      }
      if (entries.length >= 10) break; // Limit to 10 newest videos
    }

    return NextResponse.json({ videos: entries });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
