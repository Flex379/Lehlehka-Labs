import { NextResponse } from "next/server";
import axios from "axios";
import { api } from "@/lib/api/api";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const response = await api.get("/tasks", {
      params: Object.fromEntries(url.searchParams.entries()),
      headers: {
        Cookie: request.headers.get("cookie") ?? "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "Failed to get tasks" },
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
    const body = await request.json();
    const response = await api.post("/tasks", body, {
      headers: {
        Cookie: request.headers.get("cookie") ?? "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "Failed to create task" },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
