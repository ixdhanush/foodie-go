import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: food, error } = await supabase
      .from("foods")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !food) return NextResponse.json({ message: "Food not found" }, { status: 404 });
    return NextResponse.json({ ...food, _id: food.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();
    delete data._id;

    const { data: food, error } = await supabase
      .from("foods")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error || !food) return NextResponse.json({ message: "Food not found" }, { status: 404 });

    return NextResponse.json({ ...food, _id: food.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { error } = await supabase
      .from("foods")
      .delete()
      .eq("id", id);

    if (error) return NextResponse.json({ message: "Food not found or deletion failed" }, { status: 404 });

    return NextResponse.json({ message: "Food deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
