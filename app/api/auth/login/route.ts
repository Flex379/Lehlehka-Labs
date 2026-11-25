import { NextResponse } from "next/server";
import { api } from "@/lib/api/api";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await api.post("/auth/login", body);

    const nextResponse = NextResponse.json(response.data, {
      status: response.status,
    });

    const setCookies = response.headers["set-cookie"];

    setCookies?.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "Login failed" },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
