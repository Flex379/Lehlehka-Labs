import { NextResponse } from "next/server";
import { api } from "@/lib/api/api";
import axios from "axios";

export async function PATCH(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const formData = await request.formData();

    const response = await api.patch("/users/current/avatars", formData, {
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
        error.response?.data ?? { message: "Failed to upload avatar" },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
