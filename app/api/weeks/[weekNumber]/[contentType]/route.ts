import { NextResponse } from "next/server";
import axios from "axios";
import { api } from "@/lib/api/api";

interface RouteContext {
  params: Promise<{ weekNumber: string; contentType: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { weekNumber, contentType } = await params;
  const week = Number(weekNumber);

  if (
    !Number.isInteger(week) ||
    week < 1 ||
    week > 42 ||
    !["baby", "mom"].includes(contentType)
  ) {
    return NextResponse.json({ message: "Invalid week request" }, { status: 400 });
  }

  try {
    const response = await api.get(`/weeks/${week}/${contentType}`, {
      headers: {
        Cookie: request.headers.get("cookie") ?? "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "Failed to get week details" },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
