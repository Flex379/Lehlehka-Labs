import { NextResponse } from "next/server";
import { api } from "@/lib/api/api";
import axios from "axios";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const { searchParams } = new URL(request.url);

    const response = await api.get("/diary", {
      params: searchParams,
      headers: {
        Cookie: cookie ?? "",
      },
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "Failed to get diary" },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const body = await request.json();

    const response = await api.post("/diary", body, {
      headers: {
        Cookie: cookie ?? "",
      },
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "Failed to create diary entry" },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
