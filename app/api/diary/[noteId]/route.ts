import { NextResponse } from "next/server";
import { api } from "@/lib/api/api";
import axios from "axios";

type RouteContext = {
  params: Promise<{ noteId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const cookie = request.headers.get("cookie");
    const { noteId } = await context.params;
    const body = await request.json();

    const response = await api.patch(`/diary/${noteId}`, body, {
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
        error.response?.data ?? { message: "Failed to update diary entry" },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const cookie = request.headers.get("cookie");
    const { noteId } = await context.params;

    const response = await api.delete(`/diary/${noteId}`, {
      headers: {
        Cookie: cookie ?? "",
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "Failed to delete diary entry" },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
