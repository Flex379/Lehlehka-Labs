import { NextResponse } from "next/server";
import { api } from "@/lib/api/api";
import axios from "axios";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie");

    const response = await api.get("/auth/session", {
      headers: {
        Cookie: cookie ?? "",
      },
    });

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
      const nextResponse = NextResponse.json(
        error.response?.data ?? { message: "Session check failed" },
        { status: error.response?.status ?? 500 },
      );

      const setCookies = error.response?.headers?.["set-cookie"];

      setCookies?.forEach((cookie) => {
        nextResponse.headers.append("Set-Cookie", cookie);
      });

      return nextResponse;
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
