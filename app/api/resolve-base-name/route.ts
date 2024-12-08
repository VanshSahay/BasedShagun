import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const baseName = searchParams.get("id");

    if (!baseName) {
        return NextResponse.json(
            { error: "Base name is required" },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `https://basescan.org/name-lookup-search?id=${baseName}`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
            }
        );

        const text = await response.text();
        const regex = /<span id="spanBSCAddress">([\s\S]*?)<\/span>/;
        const match = text.match(regex);

        if (match && match[1]) {
            return NextResponse.json({ address: match[1].toLowerCase() });
        }

        return NextResponse.json(
            { error: "Base name resolution failed" },
            { status: 404 }
        );
    } catch (error) {
        console.error("Error resolving base name:", error);
        return NextResponse.json(
            { error: "Failed to resolve base name" },
            { status: 500 }
        );
    }
}
