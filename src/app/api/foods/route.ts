import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    let query = supabase.from("foods").select("*").order("created_at", { ascending: false });

    if (category) query = query.eq("category", category);
    if (type) query = query.eq("type", type);
    if (search) {
      query = query.or(`name.ilike.%${search}%,restaurant.ilike.%${search}%`);
    }

    const { data: foods, error } = await query;
    if (error) throw error;

    // Map `id` to `_id` to maintain compatibility with the frontend that expects `_id`
    const mappedFoods = foods.map(food => ({ ...food, _id: food.id }));

    return NextResponse.json(mappedFoods, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    // Remove _id if it's there
    delete data._id;

    const { data: food, error } = await supabase
      .from("foods")
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ...food, _id: food.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
