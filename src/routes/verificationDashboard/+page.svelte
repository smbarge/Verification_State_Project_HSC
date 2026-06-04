<script>
  import { onMount } from "svelte";
  import VerificationCard from "$lib/components/VerificationCard.svelte";
  import { A } from "flowbite-svelte";
  import { goto } from "$app/navigation";

  let selected_division_code = -1;
  let date = "";
  let applicationType = "";
  let divisions = [{ division_code: 0, division_name: "All" }];
  let disableDownload = false;
  let disableDownload1 = false;

  let alertMsg = "";
  let alertMsg1 = "";
  let seatNo = "";
  let caseSeatNo = "";
  let alerMsgcase = "";
  let showPopup = false;
  let resultSeatNo = [];
  // Replace this with your actual search function
  async function searchCase() {
    if (caseSeatNo.trim() === "") {
      alerMsgcase = "Please enter a valid Case Id.";
      return;
    }
    let response = await fetch(`/api/recheckCaseId/${caseSeatNo}`, {
      method: "GET", // or simply omit this line, as GET is the default method
      headers: {
        "Content-Type": "application/json",
        // Add other headers if needed, like authorization
        // 'Authorization': 'Bearer your-token-here'
      },
    });
    let data = await response.json();
    if (data.error != 0) {
      alerMsgcase = data.errorMsg;
      seatNo = "";
      caseSeatNo = "";
      return;
    }
    resultSeatNo = data.seatNo;
    // Example logic
    alerMsgcase = "";
    showPopup = true;
    // perform your search logic here
    console.log("Searching for seat no:", caseSeatNo);
  }

  const gotoSupport = () => {
    goto("./support");
  };

    const accentMap = {
    blue:   "bg-blue-500",
    green:  "bg-green-500",
    violet: "bg-violet-500",
  };

  let selected_division = -1;
  const downloadCSV = async () => {
    console.log("downloadCSV function called");
    alertMsg = "";
    if (selected_division_code == -1) {
      alertMsg = "Please select division";
      return;
    }
    console.log("division code is ", selected_division_code);

    const response = await fetch(`/api/downloadCsv/${selected_division_code}`, {
      method: "GET", // or simply omit this line, as GET is the default method
      headers: {
        "Content-Type": "application/json",
        // Add other headers if needed, like authorization
        // 'Authorization': 'Bearer your-token-here'
      },
    });
    console.log("response: ", response);
    let result = await response.json();
    let applications = result.applications;
    console.log("result is ", result);

    // Example data
    disableDownload = true;
    let data = [
      ["Name", "Age", "City"],
      ["Alice", "24", "New York"],
      ["Bob", "30", "Los Angeles"],
      ["Charlie", "28", "Chicago"],
    ];
    if (applications.length == 0) {
      alertMsg = "no data";
      disableDownload = false;
      return;
    }
    let headers = Object.keys(applications[0]);
    let rows = applications.map((e) => Object.values(e));
    data = [headers, ...rows];

    // Convert to CSV string
    let csvContent = data.map((e) => e.join(",")).join("\n");

    // Use Blob instead of data URI
    let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    let url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "recheck_applications.csv");
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Cleanup
    document.body.removeChild(link);
    // let headers = [Object.keys(applications[0])];
    // data = [headers];
    // applications.forEach((e) => {
    //   data = [...data, Object.values(e)];
    // });

    // // Convert data to CSV format
    // let csvContent =
    //   "data:text/csv;charset=utf-8," + data.map((e) => e.join(",")).join("\n");

    // // Create a download link
    // const encodedUri = encodeURI(csvContent);
    // const link = document.createElement("a");
    // link.setAttribute("href", encodedUri);
    // link.setAttribute("download", "recheck_applications.csv");
    // document.body.appendChild(link); // Required for FF

    // // Simulate click
    // link.click();

    // // Clean up
    // document.body.removeChild(link);
    disableDownload = false;
  };
  const downloadPayment = async () => {
    alertMsg1 = "";
    if (selected_division == -1) {
      alertMsg1 = "Please select division";
      return;
    }
    const response = await fetch(`/api/downloadPayment/${selected_division}`, {
      method: "GET", // or simply omit this line, as GET is the default method
      headers: {
        "Content-Type": "application/json",
        // Add other headers if needed, like authorization
        // 'Authorization': 'Bearer your-token-here'
      },
    });
    console.log("response: ", response);
    let result = await response.json();
    let applications = result.applications;
    console.log("result is ", applications);

    // Example data
    disableDownload1 = true;
    downloadpay(applications);

    disableDownload1 = false;
  };

  const onlineSubjectData = async () => {
    const response = await fetch(`/api/onlineSubjectCsv`, {
      method: "GET", // or simply omit this line, as GET is the default method
      headers: {
        "Content-Type": "application/json",
        // Add other headers if needed, like authorization
        // 'Authorization': 'Bearer your-token-here'
      },
    });
    console.log("response: ", response);
    let result = await response.json();
    let applications = result.onlineSubject;
    console.log("result is ", applications);

    let headers = [Object.keys(applications[0])];
    let data = [headers];
    applications.forEach((e) => {
      data = [...data, Object.values(e)];
    });

    // Convert data to CSV format
    let csvContent =
      "data:text/csv;charset=utf-8," + data.map((e) => e.join(",")).join("\n");

    // Create a download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ITSubject.csv");
    document.body.appendChild(link); // Required for FF

    // Simulate click
    link.click();

    // Clean up
    document.body.removeChild(link);
    // Example data
    // downloadpay(applications);
  };

  async function csvDownload() {
    try {
      const response = await fetch("/api/report");

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "hsc_report.xlsx";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to download report");
    }
  }

  function convertToCSV(data) {
    let divisionName = divisions.find(
      (e) => e.division_code == selected_division,
    )?.division_name;

    // const headers = Object.keys(data[0]).join(",");
    const titleRow = `Account head wise fee collection report,,,,`;
    let name = `${divisionName},,,,`;
    let headers = ["Date", "301", "302", "303", "Total"];
    let rows = data.map((row) => Object.values(row).join(",")).join("\n");
    console.log("rows is", rows);
    return `${titleRow}\n${name}\n${headers}\n${rows}`;
  }

  function downloadpay(data, filename = "payment.csv") {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  let verificationStateCount = {
    total_applications: 0,
    complete_applications: 0,
    incomplete_applications: 0,
  };
  let photocopyStateCount = {
    total_applications: 0,
    complete_applications: 0,
    incomplete_applications: 0,
  };
  let reEvaluationStateCount = {
    total_applications: 0,
    complete_applications: 0,
    incomplete_applications: 0,
  };
  let verificationDivisionCounts = [];

  let photocopyDivisionCounts = [];
  let reEvaluationDivisionCounts = [];

  onMount(async () => {
    {
      let response = await fetch("/api/divisions/", {
        method: "GET", // or simply omit this line, as GET is the default method
        headers: {
          "Content-Type": "application/json",
          // Add other headers if needed, like authorization
          // 'Authorization': 'Bearer your-token-here'
        },
      });
      console.log("response: ", response);
      let data = await response.json();
      console.log("divisions is", data);

      const lDivisions = data.divisions.map((e) => {
        const { division_code, division_name } = e;
        return { division_code, division_name };
      });
      divisions = [...divisions, ...lDivisions];
      response = await fetch("/api/verificationSummary/", {
        method: "GET", // or simply omit this line, as GET is the default method
        headers: {
          "Content-Type": "application/json",
          // Add other headers if needed, like authorization
          // 'Authorization': 'Bearer your-token-here
        },
      });
      console.log("response: ", response);
      let { error, errorMsg, summary } = await response.json();
      console.log("summary is", summary);
      verificationDivisionCounts = summary.filter((e) => e.recheck_type == 1);
      photocopyDivisionCounts = summary.filter((e) => e.recheck_type == 2);
      reEvaluationDivisionCounts = summary.filter((e) => e.recheck_type == 3);

      verificationStateCount = verificationDivisionCounts.reduce(
        (a, c) => {
          return {
            total_applications:
              a.total_applications + Number(c.total_applications),
            complete_applications:
              a.complete_applications + Number(c.complete_applications),
            incomplete_applications:
              a.incomplete_applications + Number(c.incomplete_applications),
          };
        },
        {
          total_applications: 0,
          complete_applications: 0,
          incomplete_applications: 0,
        },
      );
      console.log("verificationStateCount: ", verificationStateCount);

      photocopyStateCount = photocopyDivisionCounts.reduce(
        (a, c) => {
          return {
            total_applications:
              a.total_applications + Number(c.total_applications),
            complete_applications:
              a.complete_applications + Number(c.complete_applications),
            incomplete_applications:
              a.incomplete_applications + Number(c.incomplete_applications),
          };
        },
        {
          total_applications: 0,
          complete_applications: 0,
          incomplete_applications: 0,
        },
      );
      console.log("photocopyStateCount: ", photocopyStateCount);
      //--
      reEvaluationStateCount = reEvaluationDivisionCounts.reduce(
        (a, c) => {
          return {
            total_applications:
              a.total_applications + Number(c.total_applications),
            complete_applications:
              a.complete_applications + Number(c.complete_applications),
            incomplete_applications:
              a.incomplete_applications + Number(c.incomplete_applications),
          };
        },
        {
          total_applications: 0,
          complete_applications: 0,
          incomplete_applications: 0,
        },
      );
      console.log("reEvaluationStateCount: ", reEvaluationStateCount);
    }
  });
  $: puneDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 1,
  )
    ? verificationDivisionCounts.find((e) => e.divn_code == 1)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: puneDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 1,
  )
    ? photocopyDivisionCounts.find((e) => e.divn_code == 1)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: puneDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 1,
  )
    ? reEvaluationDivisionCounts.find((e) => e.divn_code == 1)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: nagpurDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 2,
  )
    ? verificationDivisionCounts.find((e) => e.divn_code == 2)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: nagpurDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 2,
  )
    ? photocopyDivisionCounts.find((e) => e.divn_code == 2)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: nagpurDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 2,
  )
    ? reEvaluationDivisionCounts.find((e) => e.divn_code == 2)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: chsambhajinagarDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 3,
  )
    ? verificationDivisionCounts.find((e) => e.divn_code == 3)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: chsambhajinagarDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 3,
  )
    ? photocopyDivisionCounts.find((e) => e.divn_code == 3)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: chsambhajinagarDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 3,
  )
    ? reEvaluationDivisionCounts.find((e) => e.divn_code == 3)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: mumbaiDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 4,
  )
    ? verificationDivisionCounts.find((e) => e.divn_code == 4)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: mumbaiDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 4,
  )
    ? photocopyDivisionCounts.find((e) => e.divn_code == 4)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: mumbaiDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 4,
  )
    ? reEvaluationDivisionCounts.find((e) => e.divn_code == 4)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: kolhapurDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 5,
  )
    ? verificationDivisionCounts.find((e) => e.divn_code == 5)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: kolhapurDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 5,
  )
    ? photocopyDivisionCounts.find((e) => e.divn_code == 5)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: kolhapurDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 5,
  )
    ? reEvaluationDivisionCounts.find((e) => e.divn_code == 5)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: amravatiDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 6,
  )
    ? verificationDivisionCounts.find((e) => e.divn_code == 6)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: amravatiDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 6,
  )
    ? photocopyDivisionCounts.find((e) => e.divn_code == 6)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: amravatiDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 6,
  )
    ? reEvaluationDivisionCounts.find((e) => e.divn_code == 6)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: nashikDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 7,
  )
    ? verificationDivisionCounts.find((e) => e.divn_code == 7)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: nashikDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 7,
  )
    ? photocopyDivisionCounts.find((e) => e.divn_code == 7)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: nashikDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 7,
  )
    ? reEvaluationDivisionCounts.find((e) => e.divn_code == 7)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: laturDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 8,
  )
    ? verificationDivisionCounts.find((e) => e.divn_code == 8)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: laturDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 8,
  )
    ? photocopyDivisionCounts.find((e) => e.divn_code == 8)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: laturDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 8,
  )
    ? reEvaluationDivisionCounts.find((e) => e.divn_code == 8)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: konkanDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 9,
  )
    ? verificationDivisionCounts.find((e) => e.divn_code == 9)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: konkanDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 9,
  )
    ? photocopyDivisionCounts.find((e) => e.divn_code == 9)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: konkanDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 9,
  )
    ? reEvaluationDivisionCounts.find((e) => e.divn_code == 9)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };
</script>
<!-- <div class="max-w-6xl mx-auto px-4 py-8">
  <div class="text-center mb-8">
    <h1 class="text-xl font-semibold text-slate-800 tracking-tight">
      Verification Photocopy &amp; Re-evaluation
    </h1>
    <p class="text-xs text-slate-500 mt-1 tracking-wide uppercase">Data Download Portal</p>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

    <div class="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 shadow-sm">
      <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
      </div>
      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Division Details</p>
      <div class="h-px bg-slate-50"></div>
      <select
        id="division1"
        bind:value={selected_division_code}
        class="w-full h-9 border border-slate-200 rounded-lg text-sm px-2 bg-slate-50 text-slate-700 focus:border-blue-400 focus:outline-none"
      >
        <option value="" disabled selected>Select a division</option>
        {#each divisions as { division_code, division_name }}
          <option value={division_code}>{division_name}</option>
        {/each}
      </select>
      <button
        on:click={downloadCSV}
        type="button"
        disabled={disableDownload}
        class="w-full h-9 flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-blue-500 to-indigo-500 hover:opacity-90 active:scale-95 transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download
      </button>
      <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">CSV Export</span>
      {#if alertMsg}
        <div class="p-2 bg-red-50 text-red-600 rounded-lg text-xs">{alertMsg}</div>
      {/if}
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 shadow-sm">
      <div class="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
        <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      </div>
      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Payment Details</p>
      <div class="h-px bg-slate-50"></div>
      <select
        id="division2"
        bind:value={selected_division}
        class="w-full h-9 border border-slate-200 rounded-lg text-sm px-2 bg-slate-50 text-slate-700 focus:border-teal-400 focus:outline-none"
      >
        <option value="" disabled selected>Select a division</option>
        {#each divisions as { division_code, division_name }}
          <option value={division_code}>{division_name}</option>
        {/each}
      </select>
      <button
        on:click={downloadPayment}
        type="button"
        disabled={disableDownload1}
        class="w-full h-9 flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-teal-400 to-cyan-500 hover:opacity-90 active:scale-95 transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download
      </button>
      <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full w-fit">Payment CSV</span>
      {#if alertMsg1}
        <div class="p-2 bg-red-50 text-red-600 rounded-lg text-xs">{alertMsg1}</div>
      {/if}
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 shadow-sm">
      <div class="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
        <svg class="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Search Recheck Case ID</p>
      <div class="h-px bg-slate-50"></div>
      <div class="relative">
        <input
          id="seatNo"
          type="text"
          bind:value={caseSeatNo}
          placeholder="Enter Recheck Case ID"
          class="w-full h-9 pl-3 pr-10 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-700 focus:border-violet-400 focus:outline-none"
        />
        <div
          class="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-400 hover:text-violet-500"
          on:click={searchCase}
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.75 3.75a7.5 7.5 0 0012.9 12.9z"/></svg>
        </div>
      </div>
      <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full w-fit">Case Lookup</span>

      {#if showPopup}
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-4 flex justify-between items-center">
              <div>
                <h2 class="text-base font-bold">Search Results</h2>
                <p class="text-xs text-blue-100">Total Records: {resultSeatNo.length}</p>
              </div>
              <button class="text-white text-lg hover:text-red-200" on:click={() => (showPopup = false)}>✕</button>
            </div>
            <div class="p-4 max-h-72 overflow-y-auto">
              {#if resultSeatNo.length > 0}
                <div class="space-y-2">
                  {#each resultSeatNo as seat, index}
                    <div class="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-blue-50 transition">
                      <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">{index + 1}</div>
                      <p class="font-medium text-slate-800 text-sm">{seat.seat_no}</p>
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-center py-6 text-slate-400 text-sm">No records found</div>
              {/if}
            </div>
            <div class="bg-slate-50 px-4 py-3 flex justify-end">
              <button class="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition" on:click={() => (showPopup = false)}>Close</button>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 shadow-sm">
      <div class="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
        <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      </div>
      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">IT Subject Details</p>
      <div class="h-px bg-slate-50"></div>
      <p class="text-xs text-slate-400 flex-1">Download subject-wise IT data for online candidates.</p>
      <button
        on:click={onlineSubjectData}
        type="button"
        disabled={disableDownload1}
        class="w-full h-9 flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-blue-500 to-indigo-500 hover:opacity-90 active:scale-95 transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download
      </button>
      <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">Subject Data</span>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 shadow-sm">
      <div class="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      </div>
      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Report</p>
      <div class="h-px bg-slate-50"></div>
      <p class="text-xs text-slate-400 flex-1">Generate and download the full recheck summary report.</p>
      <button
        on:click={csvDownload}
        type="button"
        class="w-full h-9 flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-teal-400 to-cyan-500 hover:opacity-90 active:scale-95 transition"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download
      </button>
      <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full w-fit">Full Report</span>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 shadow-sm">
      <div class="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
        <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>
      </div>
      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Go to Support Page</p>
      <div class="h-px bg-slate-50"></div>
      <p class="text-xs text-slate-400 flex-1">Navigate to support for recheck revert actions.</p>
      <button
        on:click={gotoSupport}
        type="button"
        class="w-full h-9 flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-rose-500 to-pink-500 hover:opacity-90 active:scale-95 transition"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        Recheck Revert
      </button>
      <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full w-fit">Support</span>
    </div>

  </div>
</div> -->
 <div class="max-w-7xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-5 text-center">
    Verification Photocopy And Re-evaluation Data Download
  </h1>

  <div class="flex gap-4 items-start justify-center">
    <form class="space-y-3 w-[180px]">
      <div>
        <label for="division1" class="block text-sm font-medium text-gray-700">
          Division Details
        </label>

        <select
          id="division1"
          bind:value={selected_division_code}
          class="mt-1 block w-full h-9 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2"
        >
          <option value="" disabled selected>Select a division</option>

          {#each divisions as { division_code, division_name }}
            <option value={division_code}>{division_name}</option>
          {/each}
        </select>
      </div>

      <div>
        <button
          on:click={downloadCSV}
          type="button"
          disabled={disableDownload}
          class="w-full h-9 bg-blue-500 text-white text-sm rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Download
        </button>

        {#if alertMsg}
          <div class="mt-2 p-2 bg-red-200 rounded text-sm">
            {alertMsg}
          </div>
        {/if}
      </div>
    </form>

    <form class="space-y-3 w-[180px]">
      <div>
        <label for="division2" class="block text-sm font-medium text-gray-700">
          Payment Details
        </label>

        <select
          id="division2"
          bind:value={selected_division}
          class="mt-1 block w-full h-9 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2"
        >
          <option value="" disabled selected>Select a division</option>

          {#each divisions as { division_code, division_name }}
            <option value={division_code}>{division_name}</option>
          {/each}
        </select>
      </div>

      <div>
        <button
          on:click={downloadPayment}
          type="button"
          disabled={disableDownload1}
          class="w-full h-9 bg-blue-500 text-white text-sm rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Download
        </button>

        {#if alertMsg1}
          <div class="mt-2 p-2 bg-red-200 rounded text-sm">
            {alertMsg1}
          </div>
        {/if}
      </div>
    </form>

   

    <form class="space-y-2 w-[220px]">
      <div>
        <label for="seatNo" class="block text-sm font-medium text-gray-700">
          Search Recheck Case ID
        </label>

        <div class="relative">
          <input
            id="seatNo"
            type="text"
            bind:value={caseSeatNo}
            placeholder="Enter Recheck Case ID"
            class="mt-1 block w-full h-9 pl-3 pr-12 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />

          <div
            class="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-blue-600"
            on:click={searchCase}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.75 3.75a7.5 7.5 0 0012.9 12.9z"
              />
            </svg>
          </div>
        </div>
      </div>

      {#if showPopup}
        <div
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        >
          <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div
              class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-4 flex justify-between items-center"
            >
              <div>
                <h2 class="text-lg font-bold">Search Results</h2>
                <p class="text-sm text-blue-100">
                  Total Records: {resultSeatNo.length}
                </p>
              </div>

              <button
                class="text-white text-xl hover:text-red-200"
                on:click={() => (showPopup = false)}
              >
                ✕
              </button>
            </div>

            <div class="p-4 max-h-80 overflow-y-auto">
              {#if resultSeatNo.length > 0}
                <div class="space-y-2">
                  {#each resultSeatNo as seat, index}
                    <div
                      class="flex items-center gap-3 p-3 border rounded-lg hover:bg-blue-50 transition"
                    >
                      <div
                        class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold"
                      >
                        {index + 1}
                      </div>

                      <div class="flex-1">
                        <p class="font-medium text-gray-800">
                          {seat.seat_no}
                        </p>
                      </div>
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-center py-6 text-gray-500">
                  No records found
                </div>
              {/if}
            </div>

            <div class="bg-gray-50 px-4 py-3 flex justify-end">
              <button
                class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                on:click={() => (showPopup = false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      {/if}

  
    </form>

    <form class="space-y-3 w-[150px]">
      <div>
        <label class="block text-sm text-center font-medium text-gray-700 mt-1">
          IT Subject Details
        </label>
      </div>

      <div class="pt-8">
        <button
          on:click={onlineSubjectData}
          type="button"
          disabled={disableDownload1}
          class="w-full h-9 bg-blue-500 text-white text-sm rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Download
        </button>
      </div>
    </form>

    <form class="space-y-3 w-[140px]">
      <div>
        <label class="block text-sm text-center font-medium text-gray-700 mt-1">
          Report
        </label>
      </div>

      <div class="pt-8">
        <button
          on:click={csvDownload}
          type="button"
          class="w-full h-9 bg-blue-500 text-white text-sm rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Download
        </button>
      </div>
    </form>

    <form class="space-y-3 w-[170px]">
      <div>
        <label class="block text-sm text-center font-medium text-gray-700 mt-1">
          Go to Support Page
        </label>
      </div>

      <div class="pt-8">
        <button
          on:click={gotoSupport}
          type="button"
          class="w-full h-9 bg-blue-500 text-white text-sm rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Recheck Revert
        </button>
      </div>
    </form>
  </div>
</div> 

<div class="p-4 bg-white shadow rounded-lg">
  <h3 class="text-lg font-semibold">Maharashtra State</h3>
  <div class="grid gird-cols-1 md:grid-cols-3 gap-4 mt-4">
    <VerificationCard
      title={"Verification of Answer book"}
      TotalCount={verificationStateCount.total_applications}
      CompletedCount={verificationStateCount.complete_applications}
      PendingCount={verificationStateCount.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Photocopy of Answer Book"}
      TotalCount={photocopyStateCount.total_applications}
      CompletedCount={photocopyStateCount.complete_applications}
      PendingCount={photocopyStateCount.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Re-evaluation of Answer Book"}
      TotalCount={reEvaluationStateCount.total_applications}
      CompletedCount={reEvaluationStateCount.complete_applications}
      PendingCount={reEvaluationStateCount.incomplete_applications}
    ></VerificationCard>
  </div>
</div>

<div class="p-4 bg-white shadow rounded-lg">
  <h3 class="text-lg font-semibold">Pune Division</h3>
  <div class="grid gird-cols-1 md:grid-cols-3 gap-4 mt-4">
    <VerificationCard
      title={"Verification of Answer book"}
      TotalCount={puneDivisionVerificationCount?.total_applications}
      CompletedCount={puneDivisionVerificationCount?.complete_applications}
      PendingCount={puneDivisionVerificationCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Photocopy of Answer Book"}
      TotalCount={puneDivisionPhotocopyCount?.total_applications}
      CompletedCount={puneDivisionPhotocopyCount?.complete_applications}
      PendingCount={puneDivisionPhotocopyCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Re-evaluation of Answer Book"}
      TotalCount={puneDivisionReEvaluationCount?.total_applications}
      CompletedCount={puneDivisionReEvaluationCount?.complete_applications}
      PendingCount={puneDivisionReEvaluationCount?.incomplete_applications}
    ></VerificationCard>
  </div>
</div>
<div class="p-4 bg-white shadow rounded-lg">
  <h3 class="text-lg font-semibold">Nagpur Division</h3>
  <div class="grid gird-cols-1 md:grid-cols-3 gap-4 mt-4">
    <VerificationCard
      title={"Verification of Answer book"}
      TotalCount={nagpurDivisionVerificationCount?.total_applications}
      CompletedCount={nagpurDivisionVerificationCount?.complete_applications}
      PendingCount={nagpurDivisionVerificationCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Photocopy of Answer Book"}
      TotalCount={nagpurDivisionPhotocopyCount?.total_applications}
      CompletedCount={nagpurDivisionPhotocopyCount?.complete_applications}
      PendingCount={nagpurDivisionPhotocopyCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Re-evaluation of Answer Book"}
      TotalCount={nagpurDivisionReEvaluationCount?.total_applications}
      CompletedCount={nagpurDivisionReEvaluationCount?.complete_applications}
      PendingCount={nagpurDivisionReEvaluationCount?.incomplete_applications}
    ></VerificationCard>
  </div>
</div>
<div class="p-4 bg-white shadow rounded-lg">
  <h3 class="text-lg font-semibold">Chh.Sambhajinagar Division</h3>
  <div class="grid gird-cols-1 md:grid-cols-3 gap-4 mt-4">
    <VerificationCard
      title={"Verification of Answer book"}
      TotalCount={chsambhajinagarDivisionVerificationCount?.total_applications}
      CompletedCount={chsambhajinagarDivisionVerificationCount?.complete_applications}
      PendingCount={chsambhajinagarDivisionVerificationCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Photocopy of Answer Book"}
      TotalCount={chsambhajinagarDivisionPhotocopyCount?.total_applications}
      CompletedCount={chsambhajinagarDivisionPhotocopyCount?.complete_applications}
      PendingCount={chsambhajinagarDivisionPhotocopyCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Re-evaluation of Answer Book"}
      TotalCount={chsambhajinagarDivisionReEvaluationCount?.total_applications}
      CompletedCount={chsambhajinagarDivisionReEvaluationCount?.complete_applications}
      PendingCount={chsambhajinagarDivisionReEvaluationCount?.incomplete_applications}
    ></VerificationCard>
  </div>
</div>
<div class="p-4 bg-white shadow rounded-lg">
  <h3 class="text-lg font-semibold">Mumbai Division</h3>
  <div class="grid gird-cols-1 md:grid-cols-3 gap-4 mt-4">
    <VerificationCard
      title={"Verification of Answer book"}
      TotalCount={mumbaiDivisionVerificationCount?.total_applications}
      CompletedCount={mumbaiDivisionVerificationCount?.complete_applications}
      PendingCount={mumbaiDivisionVerificationCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Photocopy of Answer Book"}
      TotalCount={mumbaiDivisionPhotocopyCount?.total_applications}
      CompletedCount={mumbaiDivisionPhotocopyCount?.complete_applications}
      PendingCount={mumbaiDivisionPhotocopyCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Re-evaluation of Answer Book"}
      TotalCount={mumbaiDivisionReEvaluationCount?.total_applications}
      CompletedCount={mumbaiDivisionReEvaluationCount?.complete_applications}
      PendingCount={mumbaiDivisionReEvaluationCount?.incomplete_applications}
    ></VerificationCard>
  </div>
</div>
<div class="p-4 bg-white shadow rounded-lg">
  <h3 class="text-lg font-semibold">Kolhapur Division</h3>
  <div class="grid gird-cols-1 md:grid-cols-3 gap-4 mt-4">
    <VerificationCard
      title={"Verification of Answer book"}
      TotalCount={kolhapurDivisionVerificationCount?.total_applications}
      CompletedCount={kolhapurDivisionVerificationCount?.complete_applications}
      PendingCount={kolhapurDivisionVerificationCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Photocopy of Answer Book"}
      TotalCount={kolhapurDivisionPhotocopyCount?.total_applications}
      CompletedCount={kolhapurDivisionPhotocopyCount?.complete_applications}
      PendingCount={kolhapurDivisionPhotocopyCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Re-evaluation of Answer Book"}
      TotalCount={kolhapurDivisionReEvaluationCount?.total_applications}
      CompletedCount={kolhapurDivisionReEvaluationCount?.complete_applications}
      PendingCount={kolhapurDivisionReEvaluationCount?.incomplete_applications}
    ></VerificationCard>
  </div>
</div>
<div class="p-4 bg-white shadow rounded-lg">
  <h3 class="text-lg font-semibold">Amaravati Division</h3>
  <div class="grid gird-cols-1 md:grid-cols-3 gap-4 mt-4">
    <VerificationCard
      title={"Verification of Answer book"}
      TotalCount={amravatiDivisionVerificationCount?.total_applications}
      CompletedCount={amravatiDivisionVerificationCount?.complete_applications}
      PendingCount={amravatiDivisionVerificationCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Photocopy of Answer Book"}
      TotalCount={amravatiDivisionPhotocopyCount?.total_applications}
      CompletedCount={amravatiDivisionPhotocopyCount?.complete_applications}
      PendingCount={amravatiDivisionPhotocopyCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Re-evaluation of Answer Book"}
      TotalCount={amravatiDivisionReEvaluationCount?.total_applications}
      CompletedCount={amravatiDivisionReEvaluationCount?.complete_applications}
      PendingCount={amravatiDivisionReEvaluationCount?.incomplete_applications}
    ></VerificationCard>
  </div>
</div>

<div class="p-4 bg-white shadow rounded-lg">
  <h3 class="text-lg font-semibold">Nashik Division</h3>
  <div class="grid gird-cols-1 md:grid-cols-3 gap-4 mt-4">
    <VerificationCard
      title={"Verification of Answer book"}
      TotalCount={nashikDivisionVerificationCount?.total_applications}
      CompletedCount={nashikDivisionVerificationCount?.complete_applications}
      PendingCount={nashikDivisionVerificationCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Photocopy of Answer Book"}
      TotalCount={nashikDivisionPhotocopyCount?.total_applications}
      CompletedCount={nashikDivisionPhotocopyCount?.complete_applications}
      PendingCount={nashikDivisionPhotocopyCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Re-evaluation of Answer Book"}
      TotalCount={nashikDivisionReEvaluationCount?.total_applications}
      CompletedCount={nashikDivisionReEvaluationCount?.complete_applications}
      PendingCount={nashikDivisionReEvaluationCount?.incomplete_applications}
    ></VerificationCard>
  </div>
</div>
<div class="p-4 bg-white shadow rounded-lg">
  <h3 class="text-lg font-semibold">Latur Division</h3>
  <div class="grid gird-cols-1 md:grid-cols-3 gap-4 mt-4">
    <VerificationCard
      title={"Verification of Answer book"}
      TotalCount={laturDivisionVerificationCount?.total_applications}
      CompletedCount={laturDivisionVerificationCount?.complete_applications}
      PendingCount={laturDivisionVerificationCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Photocopy of Answer Book"}
      TotalCount={laturDivisionPhotocopyCount?.total_applications}
      CompletedCount={laturDivisionPhotocopyCount?.complete_applications}
      PendingCount={laturDivisionPhotocopyCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Re-evaluation of Answer Book"}
      TotalCount={laturDivisionReEvaluationCount?.total_applications}
      CompletedCount={laturDivisionReEvaluationCount?.complete_applications}
      PendingCount={laturDivisionReEvaluationCount?.incomplete_applications}
    ></VerificationCard>
  </div>
</div>
<div class="p-4 bg-white shadow rounded-lg">
  <h3 class="text-lg font-semibold">Konkan Division</h3>
  <div class="grid gird-cols-1 md:grid-cols-3 gap-4 mt-4">
    <VerificationCard
      title={"Verification of Answer book"}
      TotalCount={konkanDivisionVerificationCount?.total_applications}
      CompletedCount={konkanDivisionVerificationCount?.complete_applications}
      PendingCount={konkanDivisionVerificationCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Photocopy of Answer Book"}
      TotalCount={konkanDivisionPhotocopyCount?.total_applications}
      CompletedCount={konkanDivisionPhotocopyCount?.complete_applications}
      PendingCount={konkanDivisionPhotocopyCount?.incomplete_applications}
    ></VerificationCard>
    <VerificationCard
      title={"Re-evaluation of Answer Book"}
      TotalCount={konkanDivisionReEvaluationCount?.total_applications}
      CompletedCount={konkanDivisionReEvaluationCount?.complete_applications}
      PendingCount={konkanDivisionReEvaluationCount?.incomplete_applications}
    ></VerificationCard>
  </div>
</div>
