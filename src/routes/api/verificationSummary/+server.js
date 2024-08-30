import { queryDb } from "$lib/db/db";
/** @type {import('./$types').RequestHandler} */

export async function GET() {
  try {
    const sql = `SELECT
      d.divn_code,
      t.recheck_type,
      COUNT(DISTINCT ra.recheck_application_id) AS total_applications,
      COUNT(DISTINCT CASE WHEN rad.status = 'Complete' THEN ra.recheck_application_id END) AS complete_applications,
      COUNT(DISTINCT CASE WHEN rad.status != 'Complete' OR rad.status IS NULL THEN ra.recheck_application_id END) AS incomplete_applications
    FROM
    (SELECT DISTINCT divn_code FROM recheck_application) d
    CROSS JOIN
     (SELECT 1 AS recheck_type UNION ALL SELECT 2 UNION ALL SELECT 3) t
    LEFT JOIN
      recheck_application ra ON d.divn_code = ra.divn_code AND t.recheck_type = ra.recheck_type
    LEFT JOIN
      recheck_application_detail rad ON ra.recheck_application_id = rad.recheck_application_id
    GROUP BY
      d.divn_code, t.recheck_type;`;

    const rows = await queryDb(sql);

    return new Response(
      JSON.stringify({
        status: 200,
        error: 0,
        errorMsg: "",
        summary: rows,
      })
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: 500,
        error: -1,
        errorMsg: "error in fetching data",
      })
    );
  }
}
