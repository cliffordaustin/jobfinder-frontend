import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignupBodySchema } from "@/types/auth.types";

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();

  const parseBody = SignupBodySchema.safeParse(body);

  if (!parseBody.success) {
    return NextResponse.json({
      success: false,
      message: "Invalid data",
    });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rest-auth/registration/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...parseBody.data,
        password2: parseBody.data.password1,
      }),
    }
  );

  if (!res.ok) {
    const errMessage: Partial<{
      non_field_errors: string[];
      email: string[];
      password1: string[];
    }> = await res.json();

    return NextResponse.json(
      {
        success: false,
        message:
          errMessage?.email?.[0] ||
          errMessage?.password1?.[0] ||
          errMessage?.non_field_errors?.[0] ||
          "Something went wrong",
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
}
