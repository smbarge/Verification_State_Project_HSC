import { queryDb } from "$lib/db/db";
/** @type {import('./$types').RequestHandler} */

export async function GET(params) {
  try {
    
console.log("params is ",params.params.caseSeatNo);

     const sql = `select seat_no from paper_status where recheck_case_id='${params.params.caseSeatNo}'
`;

    let rows = await queryDb(sql);
 
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
        seatNo: rows[0].seat_no,
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
