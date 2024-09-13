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
    const { divn_code } = params;
    let sql = "";
    if (divn_code == 0) {
      sql = `WITH amounts AS (
    SELECT
        DATE(transaction_date) AS transaction_date,
        udf1,
        SUM(CAST(amount AS NUMERIC)) AS total_paid_amount
    FROM
        public.payment_responses
    WHERE
        status_code = '0000'
        AND amount >= '10'
        AND client_code = 'MSBP2'
        AND DATE(transaction_date) >= '2024-08-24'
    GROUP BY
        DATE(transaction_date),
        udf1
),

detailed_report AS (
    SELECT
        transaction_date,
        COALESCE(SUM(CASE WHEN udf1 = '1' THEN total_paid_amount ELSE 0 END), 0) AS total_paid_amount_1,
        COALESCE(SUM(CASE WHEN udf1 = '2' THEN total_paid_amount ELSE 0 END), 0) AS total_paid_amount_2,
        COALESCE(SUM(CASE WHEN udf1 = '3' THEN total_paid_amount ELSE 0 END), 0) AS total_paid_amount_3,
        COALESCE(SUM(CASE WHEN udf1 IN ('1', '2', '3') THEN total_paid_amount ELSE 0 END), 0) AS total_day_amount
    FROM
        amounts
    GROUP BY
        transaction_date
),

summary_report AS (
    SELECT
        NULL::DATE AS transaction_date, -- Placeholder for total row
        COALESCE(SUM(CASE WHEN udf1 = '1' THEN total_paid_amount ELSE 0 END), 0) AS total_paid_amount_1,
        COALESCE(SUM(CASE WHEN udf1 = '2' THEN total_paid_amount ELSE 0 END), 0) AS total_paid_amount_2,
        COALESCE(SUM(CASE WHEN udf1 = '3' THEN total_paid_amount ELSE 0 END), 0) AS total_paid_amount_3,
        COALESCE(SUM(CASE WHEN udf1 IN ('1', '2', '3') THEN total_paid_amount ELSE 0 END), 0) AS total_day_amount
    FROM
        amounts
)

SELECT * FROM detailed_report
UNION ALL
SELECT * FROM summary_report
ORDER BY
    transaction_date NULLS LAST`;
    } else {
      sql = `WITH amounts AS (
    SELECT
        DATE(transaction_date) AS transaction_date,
        udf1,
        SUM(CAST(amount AS NUMERIC)) AS total_paid_amount
    FROM
        public.payment_responses
    WHERE
        status_code = '0000'
        AND amount >= '10'
        AND client_code = 'MSBP2'
        AND DATE(transaction_date) >= '2024-08-24'
        AND CAST(REGEXP_REPLACE(udf15, 'HSC_', '') AS INTEGER) = ${divn_code}
    GROUP BY
        DATE(transaction_date),
        udf1
),

detailed_report AS (
    SELECT
        transaction_date,
        COALESCE(SUM(CASE WHEN udf1 = '1' THEN total_paid_amount ELSE 0 END), 0) AS total_paid_amount_1,
        COALESCE(SUM(CASE WHEN udf1 = '2' THEN total_paid_amount ELSE 0 END), 0) AS total_paid_amount_2,
        COALESCE(SUM(CASE WHEN udf1 = '3' THEN total_paid_amount ELSE 0 END), 0) AS total_paid_amount_3,
        COALESCE(SUM(CASE WHEN udf1 IN ('1', '2', '3') THEN total_paid_amount ELSE 0 END), 0) AS total_day_amount
    FROM
        amounts
    GROUP BY
        transaction_date
),

summary_report AS (
    SELECT
        NULL::DATE AS transaction_date, -- Placeholder for total row
        COALESCE(SUM(CASE WHEN udf1 = '1' THEN total_paid_amount ELSE 0 END), 0) AS total_paid_amount_1,
        COALESCE(SUM(CASE WHEN udf1 = '2' THEN total_paid_amount ELSE 0 END), 0) AS total_paid_amount_2,
        COALESCE(SUM(CASE WHEN udf1 = '3' THEN total_paid_amount ELSE 0 END), 0) AS total_paid_amount_3,
        COALESCE(SUM(CASE WHEN udf1 IN ('1', '2', '3') THEN total_paid_amount ELSE 0 END), 0) AS total_day_amount
    FROM
        amounts
)

SELECT * FROM detailed_report
UNION ALL
SELECT * FROM summary_report
ORDER BY
    transaction_date NULLS LAST; `;
    }
    // let applications = await queryDb(sql);
    let queryResult = await queryDb(sql)
    console.log("queryresult",queryResult);
    
    queryResult.rows = queryResult.map((e) => toCamelCaseObject(e))
    console.log('queryResult.rows ',queryResult.rows) 
    let applications = queryResult.rows.map(e => {
      const dateObj = new Date(e.transactionDate ? e.transactionDate : "");

      const day = dateObj?.getDate().toString().padStart(2, '0');
      const month = (dateObj?.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so we add 1
      const year = dateObj?.getFullYear();
      // console.log("day" ,e);
      let formattedDate
      if (day.length == 2) {
        //  formattedDate = `${year}/${month}/${day}`;
        formattedDate = `${day}/${month}/${year}`;
      } else {
        formattedDate = ""
      }  // let date = e.transactionDate?.toString()
      // console.log("date",date);
      return {
        Date: formattedDate,
        verification: e.totalPaidAmount_1,
        photoCopy: e.totalPaidAmount_2,
        revaluation: e.totalPaidAmount_3,
        daytotal: e.totalDayAmount
      }
    })

    return new Response(
      JSON.stringify({
        status: 200,
        applications,
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
