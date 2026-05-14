import { queryDb } from "$lib/db/db";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  try {
    const recheck_case_id = url.searchParams.get("recheck_case_id");

    console.log("recheck_case_id :", recheck_case_id);

    if (!recheck_case_id) {
      return new Response(
        JSON.stringify({
          status: 400,
          message: "recheck_case_id is required",
          data: [],
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const data = await queryDb(`
  SELECT *
  FROM public.paper_status
  WHERE recheck_case_id = '${recheck_case_id}'
`);

    console.log("rows :", data.length);

    return new Response(
      JSON.stringify({
        status: 200,
        message: "Data fetched successfully",
        data,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.log("ERROR :", err);

    return new Response(
      JSON.stringify({
        status: 500,
        message: "Internal Server Error",
        data: [],
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

export async function PUT({ request }) {
  try {
    const body = await request.json();

    const { recheck_case_id, paper_id } = body;

    if (!recheck_case_id || !paper_id) {
      return new Response(
        JSON.stringify({
          status: 400,
          message: "Missing required fields",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    await queryDb(
      `
      UPDATE public.paper_status
      SET
        final_status = '',
        answersheet_url = NULL,
        answersheet_confirmation = false
      WHERE recheck_case_id = '${recheck_case_id}'
      AND paper_id = '${paper_id}'
      `
    );

    return new Response(
      JSON.stringify({
        status: 200,
        message: "Application reverted successfully",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log("PUT ERROR :", err);

    return new Response(
      JSON.stringify({
        status: 500,
        message: "Internal Server Error",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
