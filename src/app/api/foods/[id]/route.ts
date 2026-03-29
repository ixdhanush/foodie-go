import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { data: food, error } = await supabase
      .from("foods")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !food) return NextResponse.json({ message: "Food not found" }, { status: 404 });
    return NextResponse.json({ ...food, _id: food.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    delete data._id; // Remove _id
    
    const { data: food, error } = await supabase
      .from("foods")
      .update(data)
      .eq("id", params.id)
      .select()
      .single();

    if (error || !food) return NextResponse.json({ message: "Food not found" }, { status: 404 });
    
    return NextResponse.json({ ...food, _id: food.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("foods")
      .delete()
      .eq("id", params.id);

    if (error) return NextResponse.json({ message: "Food not found or deletion failed" }, { status: 404 });
    
    return NextResponse.json({ message: "Food deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
