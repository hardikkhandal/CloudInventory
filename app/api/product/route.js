//mongodb+srv://hardik_khandal:Z4cLVgFcRy2HNOlb@cluster.iznlmik.mongodb.net/

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import uploadthing from "uploadthing";

export async function GET(request) {
  const uri =
    "mongodb+srv://hardik:buh8AtI0PX94K7g8@cluster.iznlmik.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");
    const query = {};
    const products = await inventory.find(query).toArray();
    return NextResponse.json({ success: true, products });
  } finally {
    await client.close;
  }
}

export async function POST(request) {
  try {
    let body = await request.json();

    // Check if there's a file in the request
    if (body.file) {
      const uploadedFile = await uploadthing(body.file); // Upload the file
      body.imageUrl = uploadedFile.url; // Add file URL to the product data
      delete body.file; // Remove file object from the body to avoid storing it directly in MongoDB
    }

    const database = client.db("stock");
    const inventory = database.collection("inventory");
    const product = await inventory.insertOne(body);
    return NextResponse.json({ product, ok: true });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ ok: false, error: error.message });
  } finally {
    await client.close();
  }
}
