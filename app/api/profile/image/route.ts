import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Get file extension
    const fileExtension = file.name.split(".").pop() || 'jpg';
    
    // Create unique filename with user ID and timestamp
    const fileName = `${session.user.id}/${uuidv4()}.${fileExtension}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Delete old avatar if exists (optional cleanup)
    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    });

    if (currentUser?.image) {
      // Extract filename from current image URL if it's a Supabase URL
      const currentImagePath = currentUser.image.split('/').pop();
      if (currentImagePath && currentUser.image.includes('supabase')) {
        const oldFileName = `${session.user.id}/${currentImagePath}`;
        await supabaseAdmin.storage
          .from('avatars')
          .remove([oldFileName]);
      }
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true, // Replace if file already exists
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update user in database
    await db.user.update({
      where: { id: session.user.id },
      data: {
        image: publicUrl,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ imageUrl: publicUrl });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}