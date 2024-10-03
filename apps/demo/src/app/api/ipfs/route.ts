import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const file = form.get("file") as unknown as File;
    form.append("file", file);
    form.append("pinataMetadata", JSON.stringify({ name: file.name }));

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` },
      body: form,
    });
    const { IpfsHash: cid } = await res.json();
    const url = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${cid}`;

    return NextResponse.json({ url, cid }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
