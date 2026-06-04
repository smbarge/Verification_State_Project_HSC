import { queryDb } from "$lib/db/db";
/** @type {import('./$types').RequestHandler} */

export async function GET(params) {
  try {
    
     console.log("params is ",params.params.caseSeatNo);

     const value = params.params.caseSeatNo?.trim();
     console.log("received value is ",value);
//      const sql = `select seat_no from paper_status where recheck_case_id='${params.params.caseSeatNo}'
// `;

let sql;
    // let rows = await queryDb(sql);
 
    if (/^[A-Za-z][0-9]{6}$/.test(value)) {
    // Seat No (e.g. A123456)
    sql = `
        SELECT DISTINCT recheck_case_id as seat_no
        FROM paper_status
        WHERE seat_no = '${value}'
    `;
} else {
    // Recheck Case ID
    sql = `
        SELECT DISTINCT seat_no
        FROM paper_status
        WHERE recheck_case_id = '${value}'
    `;
}
const rows = await queryDb(sql);
 console.log("rows is ",rows.length);
if (rows.length==0){
     return new Response(
      JSON.stringify({
        status: 200,
        error: -2,
        errorMsg: "No data found ",
        
      })
    );
}
    return new Response(
      JSON.stringify({
        status: 200,
        error: 0,
        errorMsg: "",
        seatNo: rows,
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
