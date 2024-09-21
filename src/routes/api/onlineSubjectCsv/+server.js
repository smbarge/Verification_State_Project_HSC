import { queryDb } from "$lib/db/db";
import { camelCase } from "change-case-all"
import { DateTime } from "luxon"
/** @type {import('./$types').RequestHandler} */

const toCamelCaseObject = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [camelCase(key), value])
    )
}

export async function GET({ params }) {
    try {
        let sql = "";
        sql = `
        select rad.seat_no,rad.subj_code,rc.recheck_case_id,ra.divn_code,dm.division_name as division_code from recheck_application_detail rad 
	join recheck_application ra on ra.recheck_application_id=rad.recheck_application_id
	join recheck_case rc
	on rc.recheck_application_id = rad.recheck_application_id
	join division_master dm on dm.division_code = ra.divn_code
	where rad.subj_code in ('97','98','99','32') 
        `;

        // let applications = await queryDb(sql);
        let queryResult = await queryDb(sql)
        console.log("queryresult", queryResult);

        queryResult.rows = queryResult.map((e) => toCamelCaseObject(e))
        console.log('queryResult.rows ', queryResult.rows)

        return new Response(
            JSON.stringify({
                status: 200,
                onlineSubject: queryResult.rows,
            })
        );
    } catch (err) {
        console.log("exception in processing request for data: ", err);
        return new Response(
            JSON.stringify({
                status: 500,
                body: "",
            })
        );
    }
}
