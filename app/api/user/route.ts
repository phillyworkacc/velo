import { getUserDetailsByEmailServer } from "@/app/actions/user";
import { NextResponse } from "next/server";

export async function GET () {
   const user = await getUserDetailsByEmailServer();
   return NextResponse.json(user);
}