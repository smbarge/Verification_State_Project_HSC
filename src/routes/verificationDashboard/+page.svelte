<script>
  import { onMount } from "svelte";
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
    console.log("applications are", applications);

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

  onMount(async () => {
    {
      const response = await fetch("/api/divisions/", {
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
    }
  });
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
