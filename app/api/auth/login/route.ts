import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LoginBodySchema } from "@/types/auth.types";

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();

  const parseBody = LoginBodySchema.safeParse(body);

  if (!parseBody.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid data",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rest-auth/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parseBody.data),
      }
    );

    if (!res.ok) {
      const errMessage: Partial<{ non_field_errors: string[] }> =
        await res.json();
      return NextResponse.json(
        {
          success: false,
          message: errMessage?.non_field_errors?.[0] || "Something went wrong",
        },
        {
          status: res.status,
        }
      );
    }

    const data: { key: string } = await res.json();

    (await cookies()).set({
      name: "token",
      value: data.key,
    });

    return NextResponse.json({
      success: true,
      message: "Success",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
