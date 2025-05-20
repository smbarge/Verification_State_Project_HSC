import { queryDb } from "$lib/db/db";
/** @type {import('./$types').RequestHandler} */

export async function GET() {
  try {
    // const sql = `SELECT
    //   d.divn_code,
    //   t.recheck_type,
    //   COUNT(DISTINCT ra.recheck_application_id) AS total_applications,
    //   COUNT(DISTINCT CASE WHEN ra.status = 'Complete' THEN ra.recheck_application_id END) AS complete_applications,
    //   COUNT(DISTINCT CASE WHEN ra.status != 'Complete' OR ra.status IS NULL THEN ra.recheck_application_id END) AS incomplete_applications
    // FROM
    // (SELECT DISTINCT divn_code FROM recheck_application) d
    // CROSS JOIN
    //  (SELECT 1 AS recheck_type UNION ALL SELECT 2 UNION ALL SELECT 3) t
    // LEFT JOIN
    //   recheck_application ra ON d.divn_code = ra.divn_code AND t.recheck_type = ra.recheck_type
    // LEFT JOIN
    //   recheck_application_detail rad ON ra.recheck_application_id = rad.recheck_application_id
    // GROUP BY
    //   d.divn_code, t.recheck_type;`;
    const sql = `SELECT 
    ps.division_code,
    ra.recheck_type,
    SUM(CASE WHEN rc.recheck_case_id LIKE '%H301%' THEN 1 ELSE 0 END) AS count_S01,
    SUM(CASE WHEN rc.recheck_case_id LIKE '%H301%' AND ra.status = 'Complete' THEN 1 ELSE 0 END) AS complete_S01,
    SUM(CASE WHEN rc.recheck_case_id LIKE '%H301%' AND (ra.status IS NULL OR ra.status = '') THEN 1 ELSE 0 END) AS pending_S01,

    SUM(CASE WHEN rc.recheck_case_id LIKE '%H302%' THEN 1 ELSE 0 END) AS count_S02,
    SUM(CASE WHEN rc.recheck_case_id LIKE '%H302%' AND ra.status = 'Complete' THEN 1 ELSE 0 END) AS complete_S02,
    SUM(CASE WHEN rc.recheck_case_id LIKE '%H302%' AND (ra.status IS NULL OR ra.status = '') THEN 1 ELSE 0 END) AS pending_S02,

    SUM(CASE WHEN rc.recheck_case_id LIKE '%H303%' THEN 1 ELSE 0 END) AS count_S03,
    SUM(CASE WHEN rc.recheck_case_id LIKE '%H303%' AND ra.status = 'Complete' THEN 1 ELSE 0 END) AS complete_S03,
    SUM(CASE WHEN rc.recheck_case_id LIKE '%H303%' AND (ra.status IS NULL OR ra.status = '') THEN 1 ELSE 0 END) AS pending_S03

FROM (
    SELECT DISTINCT ps.recheck_case_id, ps.division_code
    FROM paper_status ps
    WHERE ps.division_code BETWEEN '1' AND '9'  -- assuming division_code is string; adjust if numeric
) AS ps
JOIN recheck_case rc ON ps.recheck_case_id = rc.recheck_case_id
JOIN recheck_application ra ON rc.recheck_application_id = ra.recheck_application_id

GROUP BY ps.division_code, ra.recheck_type
ORDER BY ps.division_code, ra.recheck_type
`;

    let rows = await queryDb(sql);
    console.log("rows is ", rows);
    
rows = rows.map(r => {
  let total_applications;
  let complete_applications;
  let incomplete_applications;

  if (r.recheck_type == 1) {
    total_applications = r.count_s01;
    complete_applications = r.complete_s01;
    incomplete_applications = r.pending_s01;
  }

  if (r.recheck_type == 2) {
    total_applications = r.count_s02;
    complete_applications = r.complete_s02;
    incomplete_applications = r.pending_s02;
  }

  if (r.recheck_type == 3) {
    total_applications = r.count_s03;
    complete_applications = r.complete_s03;
    incomplete_applications = r.pending_s03;
  }

  return {
    divn_code: r.division_code,
    recheck_type: r.recheck_type,
    total_applications,
    complete_applications,
    incomplete_applications
  };
});


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
