import { NextResponse } from "next/server";
import axios from "axios";
import { api } from "@/lib/api/api";

interface RouteContext {
  params: Promise<{ taskId: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { taskId } = await params;

  try {
    const body = await request.json();
    const response = await api.patch(
      `/tasks/status/${encodeURIComponent(taskId)}`,
      body,
      {
        headers: {
          Cookie: request.headers.get("cookie") ?? "",
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "Failed to update task status" },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
