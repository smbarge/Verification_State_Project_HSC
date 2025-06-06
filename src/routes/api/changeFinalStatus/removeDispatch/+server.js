import { queryDb } from "$lib/db/db";
/** @type {import('./$types').RequestHandler} */

export async function POST({ request }) {
  try {
    let recheck_application_ids = await request.json();
    console.log("recheckCaseIDs", recheck_application_ids);
    let notUpdateRecheckApplication = [];

    for (let i = 0; i < recheck_application_ids.length; i++) {
      let query = `update recheck_application set status='' where recheck_application_id=${recheck_application_ids[i]}`;
      const { rows } = await queryDb(query);
      if (!rows.length) {
        notUpdateRecheckApplication.push(recheck_application_ids[i]);
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
