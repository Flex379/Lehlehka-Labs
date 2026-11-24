import { NextResponse } from "next/server";
import { api } from "@/lib/api/api";
import axios from "axios";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie");

    const response = await api.get("/users/current", {
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
        error.response?.data ?? { message: "Failed to get user" },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const body = await request.json();

    const response = await api.patch("/users/current", body, {
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
        error.response?.data ?? { message: "Failed to update user" },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
