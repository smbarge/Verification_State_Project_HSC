import { queryDb } from "$lib/db/db";
/** @type {import('./$types').RequestHandler} */

export async function GET({ params }) {
  try {
    const { divn_code } = params;

    const sql = `
      SELECT
        ra.recheck_application_id,
        ra.seat_no,
        ra.divn_code,
        ra.recheck_type,
        ra.delivery_type,
        ra.address_id,
        ra.created_at as application_date,
        ra.status,
        ra.status_time,
        er.name,
        er.mname,
        er.schol_no,
        er.center,
        ra.sabpaisa_trans_id,
        ra.client_trans_id,
        ad.street_address,
        ad.taluka,
        ad.district,
        ad.state,
        ad.pin,
        ad.address_type,
        ad.is_default,
        ud.created_at AS registration_date,
        ud.email,
        vm.mobile_no AS mobile,
        pt.amount,
        ps1.final_time AS change_letter_time,
        ps2.final_time AS no_change_letter_time,
        ll.lot_no,
        rad.subj_code,
        ROW_NUMBER() OVER (
          PARTITION BY ra.recheck_application_id
          ORDER BY rad.subj_code
        ) as subj_index
      FROM recheck_application ra
      JOIN recheck_case rc ON rc.recheck_application_id = ra.recheck_application_id
      JOIN exam_results er ON er.seat_no = ra.seat_no
      LEFT JOIN address ad ON (
        (ra.address_id IS NOT NULL AND ad.address_id = ra.address_id)
        OR (ra.address_id IS NULL AND ad.user_id = ra.seat_no AND ad.is_default = true)
      )
      LEFT JOIN user_details ud ON ud.user_id = ra.seat_no
      LEFT JOIN verified_mobile vm ON vm.mobile_confirm_unique_id = ud.mobile_confirmation_id
      LEFT JOIN payment_transactions pt ON pt.client_txn_id = ra.client_trans_id
      LEFT JOIN paper_status ps1 ON ps1.recheck_case_id = rc.recheck_case_id AND ps1.final_status = 'noChangeLetterGenerated'
      LEFT JOIN paper_status ps2 ON ps2.recheck_case_id = rc.recheck_case_id AND ps2.final_status = 'ChangeLetterGenerated'
      LEFT JOIN lot_list ll ON ll.recheck_case_id = rc.recheck_case_id
      LEFT JOIN recheck_application_detail rad ON rad.recheck_application_id = ra.recheck_application_id
      ${divn_code == '0' ? "" : `WHERE er.divn_code = '${divn_code}'`}
      ORDER BY ra.recheck_application_id;
    `;

    const result = await queryDb(sql);

    // Group by recheck_application_id
    const grouped = {};

    for (const row of result) {
      const id = row.recheck_application_id;
      if (!grouped[id]) {
        const delivery_type_text =
          row.delivery_type == 1
            ? "by_email"
            : row.delivery_type == 2
            ? "by_hand"
            : "by_post";

        grouped[id] = {
          recheck_application_id: row.recheck_application_id,
          seat_no: row.seat_no,
          divn_code: row.divn_code,
          recheck_type: row.recheck_type,
          delivery_type: row.delivery_type,
          delivery_type_text,
          address_id: row.address_id,
          name: row.name,
          mname: row.mname,
          schol_no: row.schol_no,
          center: row.center,
          sabpaisa_trans_id: row.sabpaisa_trans_id,
          client_trans_id: row.client_trans_id,
          street_address: row.street_address?.replace(/,/g, "") || "",
          taluka: row.taluka || "",
          district: row.district || "",
          state: row.state || "",
          pin: row.pin || "",
          address_type: row.address_type || "",
          is_default: row.is_default || "",
          registration_date: row.registration_date || "",
          email: row.email || "",
          mobile: row.mobile || "",
          application_date: row.application_date || "",
          amount: row.amount || "",
          change_letter_generated: row.change_letter_time ? "yes" : "no",
          change_letter_time: row.change_letter_time || "-",
          no_change_letter_generated: row.no_change_letter_time ? "yes" : "no",
          no_change_letter_time: row.no_change_letter_time || "-",
          dispatch_date: row.status === "Complete" ? row.status_time : "-",
          lot_no: row.lot_no || "-",
          subj_1: "",
          subj_2: "",
          subj_3: "",
          subj_4: "",
          subj_5: "",
          subj_6: ""
        };
      }

      // Assign subject codes
      if (row.subj_code && row.subj_index >= 1 && row.subj_index <= 6) {
        grouped[id][`subj_${row.subj_index}`] = row.subj_code;
      }
    }

    const applications = Object.values(grouped);
console.log("application length",applications.length);

    return new Response(
      JSON.stringify({
        status: 200,
        applications
      })
    );
  } catch (err) {
    console.log("exception in processing request for data: ", err);
    return new Response(
      JSON.stringify({
        status: 500,
        body: ""
      })
    );
  }
}




// import { queryDb } from "$lib/db/db";
// /** @type {import('./$types').RequestHandler} */

// export async function GET({ params }) {
//   try {
//     const { divn_code } = params;
//     let sql = "";
//     if (divn_code == 0) {
//       sql = `SELECT 
//         rc.recheck_case_id,
//         ra.recheck_application_id, 
//         ra.seat_no, ra.divn_code, 
//         ra.recheck_type, 
//         ra.delivery_type, 
//         ra.address_id,  
//         er.name, 
//         er.mname,  
//         er.schol_no, 
//         er.center, 
//         ra.sabpaisa_trans_id, 
//         ra.client_trans_id
//       FROM 
//         recheck_application ra,
//         recheck_case rc, 
//         exam_results er
//       WHERE 
//       er.seat_no = ra.seat_no AND
//       ra.recheck_application_id = rc.recheck_application_id 
//       `;
//     } else {
//       sql = `SELECT 
//         rc.recheck_case_id,
//         ra.recheck_application_id, 
//         ra.seat_no, 
//         ra.divn_code, 
//         ra.recheck_type, 
//         ra.delivery_type, 
//         ra.address_id,  
//         er.name, er.mname,  
//         er.schol_no, 
//         er.center, 
//         ra.sabpaisa_trans_id, 
//         ra.client_trans_id
//       FROM 
//       recheck_application ra, 
//       recheck_case rc,
//       exam_results er
//       WHERE 
//         er.seat_no = ra.seat_no AND
//       ra.recheck_application_id = rc.recheck_application_id AND
//         er.divn_code = '${divn_code}'`;
//     }
//     let applications = await queryDb(sql);
//     const ra_ids = applications.map((e) => e.recheck_application_id);
//     if (ra_ids.length) {
//       sql = `
//       SELECT 
//     ra.recheck_application_id, 
//     ad.address_id, 
//     ad.street_address, 
//     ad.taluka, 
//     ad.district, 
//     ad.state, 
//     ad.pin, 
//     ad.address_type, 
//     ad.is_default
// FROM 
//     recheck_application ra
// LEFT JOIN 
//     address ad ON (
//         (ra.address_id IS NOT NULL AND ad.address_id = ra.address_id) OR
//         (ra.address_id IS NULL AND ad.user_id = ra.seat_no AND ad.is_default = true)
//     )
// WHERE 
//     ra.recheck_application_id IN (${ra_ids.join(",")});

//       `;

//       const addresses = await queryDb(sql);

//       sql = `SELECT 
//         recheck_application_detail_id, 
//         recheck_application_id, subj_code
//       FROM public.recheck_application_detail
//       WHERE recheck_application_id in (${ra_ids.join(",")})`;

//       const application_subjects = await queryDb(sql);

//       applications = applications.map((e) => {
//         // assign address
//         console.log('e is', e)
//         let address = {};
//         const found = addresses.find((a) => a.recheck_application_id == e.recheck_application_id);
//         console.log("found: ", found);
//         if (found) {
//           address = { ...found };
//         } else {
//           const address_id = "";
//           const address_type = "";
//           const district = "";
//           const is_default = "";
//           const pin = "";
//           const state = "";
//           const street_address = "";
//           const taluka = "";
//           address = {
//             address_id,
//             address_type,
//             district,
//             is_default,
//             pin,
//             state,
//             street_address,
//             taluka,
//           };
//         }
//         let subject_codes = application_subjects.filter(
//           (as) => as.recheck_application_id == e.recheck_application_id
//         );
//         // remove commas
//         if(address.street_address){
//          address.street_address = address.street_address
//           .split("")
//           .filter((e) => e != ",")
//           .join("");
//         }else{
//           address.street_address = ""
//         }
//         // address.street_address = address.street_address
//         //   .split("")
//         //   .filter((e) => e != ",")
//         //   .join("");
//         subject_codes = subject_codes.map((e) => e.subj_code);
//         let subj_codes = {
//           subj_1: "",
//           subj_2: "",
//           subj_3: "",
//           subj_4: "",
//           subj_5: "",
//           subj_6: "",
//         };
//         subject_codes.forEach((e, i) => {
//           subj_codes[`subj_${i + 1}`] = e;
//         });
//         return { ...e, ...address, ...subj_codes };
//       });
//     }
//     sql = `SELECT 
//       ud.user_id as user_id,
//       ud.created_at as registration_date, 
//       ud.email as email, 
//       vm.mobile_no as mobile
//     FROM 
//       user_details as ud ,
//       verified_mobile as vm 
//     WHERE 
//       vm.mobile_confirm_unique_id = ud.mobile_confirmation_id`;

//     const application_emails_mobile_creation_date = await queryDb(sql);
//     applications = applications.map((ap) => {
//       const found = application_emails_mobile_creation_date.find(
//         (ad) => ad.user_id == ap.seat_no
//       );
//       let details = {};
//       if (!found) {
//         details = {
//           registration_date: "",
//           email: "",
//           mobile: "",
//         };
//       } else {
//         details = { ...found };
//       }
//       const delivery_type_text =
//         ap.delivery_type == 1
//           ? "by_email"
//           : ap.delivery_type == 2
//             ? "by_hand"
//             : "by_post";
//       return { ...ap, ...details, delivery_type_text };
//     });

//     sql = `SELECT 
//       ra.recheck_application_id as recheck_application_id, 
//       ra.created_at as application_date, 
//       pt.amount as amount
//     FROM 
//       recheck_application as ra, 
//       lot_list ll, 
//       payment_transactions pt
//     WHERE 
//       pt.client_txn_id = ra.client_trans_id 
//     `;
//     const application_details = await queryDb(sql);

//     applications = applications.map((ap) => {
//       const found = application_details.find(
//         (ad) => ad.recheck_application_id == ap.recheck_application_id
//       );
//       if (!found) return { ...ap };
//       return { ...ap, ...found };
//     });

//     sql = `SELECT  
//             distinct rc.recheck_application_id as recheck_application_id,  
//             ps.final_status as final_status, 
//             ps.final_time as final_time
// 	        FROM 
//             public.paper_status as ps, 
//             recheck_case as rc
// 	        WHERE 
//             final_status = 'noChangeLetterGenerated' AND
// 	          rc.recheck_case_id = ps.recheck_case_id 
//     `;
//     const change_letter_generated = await queryDb(sql);
//     applications = applications.map((ap) => {
//       const found = change_letter_generated.find(
//         (ad) => ad.recheck_application_id == ap.recheck_application_id
//       );
//       if (!found)
//         return {
//           ...ap,
//           change_letter_generated: "no",
//           change_letter_time: "-",
//         };
//       return {
//         ...ap,
//         change_letter_generated: "yes",
//         change_letter_time: found.final_time,
//       };
//     });

//     sql = `SELECT  
//             distinct rc.recheck_application_id as recheck_application_id,  
//             ps.final_status as final_status, 
//             ps.final_time as final_time
// 	        FROM 
//             public.paper_status as ps, 
//             recheck_case as rc
// 	        WHERE 
//           final_status = 'ChangeLetterGenerated' AND
// 	        rc.recheck_case_id = ps.recheck_case_id 
//     `;
//     const no_change_letter_generated = await queryDb(sql);
//     applications = applications.map((ap) => {
//       const found = no_change_letter_generated.find(
//         (ad) => ad.recheck_application_id == ap.recheck_application_id
//       );
//       if (!found)
//         return {
//           ...ap,
//           no_change_letter_generated: "no",
//           no_change_letter_time: "-",
//         };
//       return {
//         ...ap,
//         no_change_letter_generated: "yes",
//         no_change_letter_time: found.final_time,
//       };
//     });
//     sql = `
//     select recheck_application_id, status, status_time from recheck_application
// where status = 'Complete'
//     `;
//     const dispatch_status = await queryDb(sql);
//     applications = applications.map((ap) => {
//       const found = dispatch_status.find(
//         (ad) => ad.recheck_application_id == ap.recheck_application_id
//       );
//       if (!found)
//         return {
//           ...ap,
//           dispatch_date: "-",
//         };
//       return {
//         ...ap,
//         dispatch_date: found.status_time,
//       };
//     });
//     sql = `SELECT 
//       rc.recheck_application_id, 
//       ll.lot_no
//     FROM 
//       lot_list ll,
//       recheck_case rc,
//       recheck_application ra
//     WHERE 
//       ll.recheck_case_id = rc.recheck_case_id AND
//       ra.recheck_application_id = rc.recheck_application_id
//     ORDER BY 
//       rc.recheck_application_id
//     `;
//     const lotNos = await queryDb(sql);
//     applications = applications.map((ap) => {
//       const found = lotNos.find(
//         (ad) => ad.recheck_application_id == ap.recheck_application_id
//       );
//       if (!found)
//         return {
//           ...ap,
//           lot_no: "-",
//         };
//       return {
//         ...ap,
//         lot_no: found.lot_no,
//       };
//     });

//     return new Response(
//       JSON.stringify({
//         status: 200,
//         applications,
//       })
//     );
//   } catch (err) {
//     console.log("exception in processing request for data: ", err);
//     return new Response(
//       JSON.stringify({
//         status: 500,
//         body: "",
//       })
//     );
//   }
// }
