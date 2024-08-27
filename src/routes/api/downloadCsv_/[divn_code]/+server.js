import { queryDb } from "$lib/db/db";
/** @type {import('./$types').RequestHandler} */

export async function GET({ params }) {
  try {
    const { divn_code } = params;
    let sql = "";
    if (divn_code == 0) {
      sql = `select ra.recheck_application_id, ra.seat_no, ra.divn_code, ra.recheck_type, ra.delivery_type, ra.address_id,  er.name, er.mname,  er.schol_no, er.center, ra.sabpaisa_trans_id, ra.client_trans_id
      from recheck_application ra, exam_results er
      where er.seat_no = ra.seat_no `;
    } else {
      sql = `select ra.recheck_application_id, ra.seat_no, ra.divn_code, ra.recheck_type, ra.delivery_type, ra.address_id,  er.name, er.mname,  er.schol_no, er.center, ra.sabpaisa_trans_id, ra.client_trans_id
      from recheck_application ra, exam_results er
      where er.seat_no = ra.seat_no
      and er.divn_code = '${divn_code}'`;
    }
    let applications = await queryDb(sql);
    const ra_ids = applications.map((e) => e.recheck_application_id);
    console.log("applications is", applications);
    if (ra_ids.length) {
      sql = `select ra.recheck_application_id, ra.address_id, ad.street_address, ad.taluka, ad.district, ad.state, ad.pin, ad.address_type, ad.is_default from recheck_application_address ra, address ad
    where ra.address_id = ad.address_id
    and recheck_application_id in (${ra_ids.join(",")})`;

      const addresses = await queryDb(sql);
      console.log("addresses is", addresses);

      sql = `SELECT recheck_application_detail_id, recheck_application_id, subj_code
    FROM public.recheck_application_detail
    where recheck_application_id in (${ra_ids.join(",")})`;
      const application_subjects = await queryDb(sql);

      console.log("application_subjects ", application_subjects);
      applications = applications.map((e) => {
        // assign address
        let address = {};
        if (e.address_id) {
          const found = addresses.find((a) => a.address_id == e.address_id);
          const {
            address_id,
            address_type,
            district,
            is_default,
            pin,
            state,
            street_address,
            taluka,
          } = found;
          address = {
            address_id,
            address_type,
            district,
            is_default,
            pin,
            state,
            street_address,
            taluka,
          };
        } else {
          const address_id = "";
          const address_type = "";
          const district = "";
          const is_default = "";
          const pin = "";
          const state = "";
          const street_address = "";
          const taluka = "";
          address = {
            address_id,
            address_type,
            district,
            is_default,
            pin,
            state,
            street_address,
            taluka,
          };
        }
        let subject_codes = application_subjects.filter(
          (as) => as.recheck_application_id == e.recheck_application_id
        );
        subject_codes = subject_codes.map((e) => e.subj_code);
        let subj_codes = {
          subj_1: "",
          subj_2: "",
          subj_3: "",
          subj_4: "",
          subj_5: "",
          subj_6: "",
        };
        subject_codes.forEach((e, i) => {
          subj_codes[`subj_${i + 1}`] = e;
        });
        return { ...e, ...address, ...subj_codes };
      });
    }
    sql = `
    SELECT 
     ra.recheck_application_id as recheck_application_id, 
      ud.created_at as registration_date, 
      ud.email as email, vm.mobile_no as mobile, 
      ra.created_at as application_date, 
      ll.lot_no as lotno, 
      pt.amount as amount
    FROM 
      recheck_application as ra, 
      user_details as ud ,
      verified_mobile as vm , 
      lot_list ll, 
      recheck_case as rc, 
      payment_transactions pt
    WHERE 
      ra.seat_no = ud.user_id AND 
      vm.mobile_confirm_unique_id = ud.mobile_confirmation_id AND
      rc.recheck_application_id = ra.recheck_application_id AND
      ll.recheck_case_id = rc.recheck_case_id AND
      pt.client_txn_id = ra.client_trans_id 
    `;
    const application_details = await queryDb(sql);
    applications = applications.map((ap) => {
      const found = application_details.find(
        (ad) => ad.recheck_application_id == ap.recheck_application_id
      );
      console.log("found: ", found);
      if (!found) return { ...ap };
      const delivery_type_text =
        ap.delivery_type == 1
          ? "by_email"
          : ap.delivery_type == 2
          ? "by_hand"
          : "by_post";
      return { ...ap, ...found, delivery_type_text };
    });

    sql = `
  SELECT  distinct rc.recheck_application_id as recheck_application_id,  ps.final_status as final_status, ps.final_time as final_time
	FROM public.paper_status as ps, recheck_case as rc
	where final_status = 'noChangeLetterGenerated' and
	rc.recheck_case_id = ps.recheck_case_id 
    `;
    const change_letter_generated = await queryDb(sql);
    applications = applications.map((ap) => {
      const found = change_letter_generated.find(
        (ad) => ad.recheck_application_id == ap.recheck_application_id
      );
      console.log("found: ", found);
      if (!found)
        return {
          ...ap,
          change_letter_generated: "no",
          change_letter_time: "-",
        };
      return {
        ...ap,
        change_letter_generated: "yes",
        change_letter_time: found.final_time,
      };
    });

    sql = `
  SELECT  distinct rc.recheck_application_id as recheck_application_id,  ps.final_status as final_status, ps.final_time as final_time
	FROM public.paper_status as ps, recheck_case as rc
	where final_status = 'ChangeLetterGenerated' and
	rc.recheck_case_id = ps.recheck_case_id 
    `;
    const no_change_letter_generated = await queryDb(sql);
    applications = applications.map((ap) => {
      const found = no_change_letter_generated.find(
        (ad) => ad.recheck_application_id == ap.recheck_application_id
      );
      console.log("found: ", found);
      if (!found)
        return {
          ...ap,
          no_change_letter_generated: "no",
          no_change_letter_time: "-",
        };
      return {
        ...ap,
        no_change_letter_generated: "yes",
        no_change_letter_time: found.final_time,
      };
    });
    sql = `
    select recheck_application_id, status, status_time from recheck_application
where status = 'Complete'
    `;
    const dispatch_status = await queryDb(sql);
    applications = applications.map((ap) => {
      const found = dispatch_status.find(
        (ad) => ad.recheck_application_id == ap.recheck_application_id
      );
      console.log("found: ", found);
      if (!found)
        return {
          ...ap,
          dispatch_date: "-",
        };
      return {
        ...ap,
        dispatch_date: found.status_time,
      };
    });

    return new Response(
      JSON.stringify({
        status: 200,
        applications,
      })
    );
  } catch (err) {
    console.log("exception iis reading data: ", err);
    return new Response(
      JSON.stringify({
        status: 500,
        body: "",
      })
    );
  }
}
