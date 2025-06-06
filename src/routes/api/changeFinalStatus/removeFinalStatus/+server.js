import { queryDb } from "$lib/db/db";
/** @type {import('./$types').RequestHandler} */

export async function POST({ request }) {
  try {
    let { recheck_case_id } = await request.json();
    console.log("recheckCaseIDs", recheck_case_id);
    let notUpdateRecheckApplication = [];

    for (let i = 0; i < recheck_case_id.length; i++) {
      let query = `update paper_status set final_status='' where recheck_case_id='${recheck_case_id[i]}'`;
      const { rows } = await queryDb(query);
      if (!rows.length) {
        notUpdateRecheckApplication.push(recheck_case_id[i]);
      }
    }
    return new Response(
      JSON.stringify({
        status: 200,
        notUpdateRecheckApplication,
      })
    );
  } catch (err) {
    console.log("error is", err);
    return new Response(
      JSON.stringify({
        status: 500,
        body: "",
      })
    );
  }
}
