<script>
  import { onMount } from "svelte";
  import VerificationCard from "$lib/components/VerificationCard.svelte";

  let selected_division_code = -1;
  let date = "";
  let applicationType = "";
  let divisions = [{ division_code: 0, division_name: "All" }];
  let disableDownload = false;
  let alertMsg = "";
  const downloadCSV = async () => {
    alertMsg = "";
    if (selected_division_code == -1) {
      alertMsg = "Please select division";
      return;
    }
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
    let headers = [Object.keys(applications[0])];
    data = [headers];
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
    link.setAttribute("download", "recheck_applications.csv");
    document.body.appendChild(link); // Required for FF

    // Simulate click
    link.click();

    // Clean up
    document.body.removeChild(link);
    disableDownload = false;
  };
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
        }
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
        }
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
        }
      );
      console.log("reEvaluationStateCount: ", reEvaluationStateCount);
    }
  });
  $: puneDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 1
  );
  $: puneDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 1
  );
  $: puneDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 1
  );

  $: nagpurDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 2
  );
  $: nagpurDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 2
  );
  $: nagpurDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 2
  );
  $: chsambhajinagarDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 3
  );
  $: chsambhajinagarDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 3
  );
  $: chsambhajinagarDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 3
  );

  $: mumbaiDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 4
  );
  $: mumbaiDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 4
  );
  $: mumbaiDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 4
  );

  $: kolhapurDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 5
  );
  $: kolhapurDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 5
  );
  $: kolhapurDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 5
  );
  $: amravatiDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 6
  );
  $: amravatiDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 6
  );
  $: amravatiDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 6
  );
  $: nashikDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 7
  );
  $: nashikDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 7
  );
  $: nashikDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 7
  );
  $: laturDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 8
  )
    ? verificationDivisionCounts.find((e) => e.divn_code == 8)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: laturDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 8
  )
    ? photocopyDivisionCounts.find((e) => e.divn_code == 8)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: laturDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 8
  )
    ? reEvaluationDivisionCounts.find((e) => e.divn_code == 8)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: konkanDivisionVerificationCount = verificationDivisionCounts.find(
    (e) => e.divn_code == 9
  )
    ? verificationDivisionCounts.find((e) => e.divn_code == 9)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: konkanDivisionPhotocopyCount = photocopyDivisionCounts.find(
    (e) => e.divn_code == 9
  )
    ? photocopyDivisionCounts.find((e) => e.divn_code == 9)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };

  $: konkanDivisionReEvaluationCount = reEvaluationDivisionCounts.find(
    (e) => e.divn_code == 9
  )
    ? reEvaluationDivisionCounts.find((e) => e.divn_code == 9)
    : {
        total_applications: 0,
        complete_applications: 0,
        incomplete_applications: 0,
      };
</script>

<div class="max-w-md mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">
    Verification Photocopy And Re-evaluation Data Download
  </h1>

  <form class="space-y-4">
    <!-- Division Selection -->
    <div>
      <label for="division" class="block text-sm font-medium text-gray-700"
        >Division</label
      >
      <!-- <pre>
        {JSON.stringify(divisions, null, 2)}
      </pre> -->
      <select
        id="division"
        bind:value={selected_division_code}
        class="mt-1 block w-full h-8 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        <option value="" disabled selected>Select a division</option>
        <!-- <option value="division1">ALL</option>
        <option value="division2">Nashik</option>
        <option value="division3">Kolhapur</option> 
	-->
        {#each divisions as { division_code, division_name }}
          <option value={division_code}>{division_name}</option>
        {/each}
      </select>
    </div>

    <!-- Download Button -->
    <div>
      <button
        on:click={downloadCSV}
        type="button"
        disabled={disableDownload}
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Download
      </button>
      {#if alertMsg}
        <div class=" mt-3 p-3 bg-red-200 rounded">
          {alertMsg}
        </div>
      {/if}
    </div>
  </form>
</div>

<div class="p-4 bg-white shadow rounded-lg">
  <h3 class="text-lg font-semibold">Maharashtra State</h3>
  <div class="grid gird-cols-1 md:grid-cols-3 space-x-4 mt-4">
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
  <div class="grid gird-cols-1 md:grid-cols-3 space-x-4 mt-4">
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
  <div class="grid gird-cols-1 md:grid-cols-3 space-x-4 mt-4">
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
  <div class="grid gird-cols-1 md:grid-cols-3 space-x-4 mt-4">
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
  <div class="grid gird-cols-1 md:grid-cols-3 space-x-4 mt-4">
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
  <div class="grid gird-cols-1 md:grid-cols-3 space-x-4 mt-4">
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
  <div class="grid gird-cols-1 md:grid-cols-3 space-x-4 mt-4">
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
  <div class="grid gird-cols-1 md:grid-cols-3 space-x-4 mt-4">
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
  <div class="grid gird-cols-1 md:grid-cols-3 space-x-4 mt-4">
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
  <div class="grid gird-cols-1 md:grid-cols-3 space-x-4 mt-4">
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
