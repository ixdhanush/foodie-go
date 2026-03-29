import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let query = supabase.from("orders").select("*, user:users(name, email)").order("created_at", { ascending: false });

    if ((session.user as any).role !== "admin") {
      query = query.eq("user_id", (session.user as any).id);
    }

    const { data: orders, error } = await query;
    if (error) throw error;

    // Map properties for frontend
    const mappedOrders = orders.map(order => ({
      ...order,
      _id: order.id,
      createdAt: order.created_at
    }));

    return NextResponse.json(mappedOrders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    const { data: newOrder, error } = await supabase
      .from("orders")
      .insert([
        {
          items: data.items,
          total_amount: data.totalAmount,
          delivery_address: data.deliveryAddress,
          payment_method: data.paymentMethod,
          user_id: (session.user as any).id,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ ...newOrder, _id: newOrder.id, createdAt: newOrder.created_at }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
