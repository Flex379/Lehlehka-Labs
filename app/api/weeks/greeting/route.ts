import { NextResponse } from "next/server";
import axios from "axios";
import { api } from "@/lib/api/api";

export async function GET(request: Request) {
  try {
    const response = await api.get("/weeks/greeting", {
      headers: {
        Cookie: request.headers.get("cookie") ?? "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "Failed to get pregnancy week" },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
