import { queryDb } from "$lib/db/db";
/** @type {import('./$types').RequestHandler} */

export async function POST({ request }) {
  try {
    let { cases } = await request.json();
    console.log("cases", cases);
    let dispatchCases = [];

    for (let i = 0; i < cases.length; i++) {
      const query = `
        SELECT 
          ra.status, 
          rc.recheck_case_id, 
          ra.recheck_application_id, 
          ps.final_status 
        FROM recheck_case rc 
        JOIN recheck_application ra ON ra.recheck_application_id = rc.recheck_application_id 
        JOIN paper_status ps ON ps.recheck_case_id = rc.recheck_case_id
        WHERE rc.recheck_case_id = '${cases[i]}'
      `;
      const rows = await queryDb(query);
      console.log('rows',rows);
      
      if (rows.length > 0) {
        dispatchCases.push(rows[0]);
      }
    }
    return new Response(
      JSON.stringify({
        status: 200,
        dispatchCases,
      })
    );
  } catch (err) {
    console.log('error is',err)
    return new Response(
      JSON.stringify({
        status: 500,
        body: "",
      })
    );
  }
}
