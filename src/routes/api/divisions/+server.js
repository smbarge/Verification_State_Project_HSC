import { queryDb } from "$lib/db/db";
/** @type {import('./$types').RequestHandler} */

export async function GET() {
  try {
    const data = await queryDb(
      "SELECT * FROM division_master order by division_code"
    );
    return new Response(
      JSON.stringify({
        status: 200,
        divisions: data,
      })
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: 500,
        body: "",
      })
    );
  }
}
