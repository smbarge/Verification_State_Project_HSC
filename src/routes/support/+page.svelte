<script>
  import { goto } from "$app/navigation";
  import {
    Search,
    Loader2,
    X,
    AlertTriangle,
    CheckCircle,
  } from "lucide-svelte";

  let recheckCaseId = "";
  let loading = false;
  let records = [];
  let errorMsg = "";
  let searchhed = false;

  // Popup state
  let popup = {
    show: false,
    type: "", // "confirm" | "success" | "error"
    message: "",
    onConfirm: null,
  };
  const gotoVerificationDashboard = () => {
    goto("./verificationDashboard");
  };

  function showAlert(message, type = "error") {
    popup = { show: true, type, message, onConfirm: null };
  }

  function showConfirm(message, onConfirm) {
    popup = { show: true, type: "confirm", message, onConfirm };
  }

  function closePopup() {
    popup = { show: false, type: "", message: "", onConfirm: null };
  }

  function handleConfirm() {
    const fn = popup.onConfirm;
    closePopup();
    if (fn) fn();
  }

  const searchCase = async () => {
    try {
      searchhed = true;
      errorMsg = "";
      records = [];

      if (!recheckCaseId.trim()) {
        errorMsg = "Please enter Recheck Case ID";
        return;
      }

      loading = true;

      const response = await fetch(
        `/api/revertcase?recheck_case_id=${recheckCaseId}`,
      );

      const result = await response.json();

      console.log("result :", result);

      if (result.status !== 200) {
        errorMsg = result.message || "Failed to fetch data";
        return;
      }

      records = result.data || [];

      console.log("records :", records);
    } catch (e) {
      console.log("searchCase error :", e);
      errorMsg = "Something went wrong";
    } finally {
      loading = false;
    }
  };

  const revertApplication = async (row) => {
    showConfirm(
      `Are you sure you want to revert Paper ID ${row.paper_id}?`,
      async () => {
        try {
          const response = await fetch("/api/revertcase", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recheck_case_id: row.recheck_case_id,
              paper_id: row.paper_id,
            }),
          });

          const result = await response.json();

          if (result.status !== 200) {
            showAlert(result.message || "Failed to revert", "error");
            return;
          }

          showAlert("Application reverted successfully", "success");
          await searchCase();
        } catch (e) {
          console.log("revertApplication error :", e);
          showAlert("Something went wrong", "error");
        }
      },
    );
  };
</script>

<!-- ───── Popup Modal ───── -->
{#if popup.show}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    on:click={popup.type !== "confirm" ? closePopup : undefined}
    role="dialog"
    aria-modal="true"
  >
    <!-- Dialog box -->
    <div
      class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6"
      on:click|stopPropagation
    >
      <!-- Close button (non-confirm only) -->
      {#if popup.type !== "confirm"}
        <button
          on:click={closePopup}
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      {/if}

      <!-- Icon -->
      <div class="flex justify-center mb-4">
        {#if popup.type === "success"}
          <div class="bg-green-100 rounded-full p-3">
            <CheckCircle class="text-green-600" size={28} />
          </div>
        {:else if popup.type === "error"}
          <div class="bg-red-100 rounded-full p-3">
            <AlertTriangle class="text-red-500" size={28} />
          </div>
        {:else if popup.type === "confirm"}
          <div class="bg-yellow-100 rounded-full p-3">
            <AlertTriangle class="text-yellow-500" size={28} />
          </div>
        {/if}
      </div>

      <!-- Message -->
      <p class="text-center text-gray-700 text-sm font-medium mb-6">
        {popup.message}
      </p>

      <!-- Buttons -->
      {#if popup.type === "confirm"}
        <div class="flex gap-3">
          <button
            on:click={closePopup}
            class="flex-1 h-10 rounded-xl border border-gray-300 text-gray-600 font-medium text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            on:click={handleConfirm}
            class="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition"
          >
            Yes, Revert
          </button>
        </div>
      {:else}
        <button
          on:click={closePopup}
          class="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition"
        >
          OK
        </button>
      {/if}
    </div>
  </div>
{/if}

<!-- ───── Main Page ───── -->
<div class="w-full max-w-7xl mx-auto p-4">
  <!-- Search Card -->
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
    <div class="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">
          Recheck Case Search
        </h2>

        <p class="text-sm text-gray-500 mt-1">
          Search all paper entries using Recheck Case ID
        </p>
      </div>

      <button
        on:click={gotoVerificationDashboard}
        type="button"
        class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
      >
        Verification Dashboard
      </button>
    </div>

    <form
      class="flex flex-col md:flex-row gap-3"
      on:submit|preventDefault={searchCase}
    >
      <!-- Input -->
      <div class="relative flex-1">
        <input
          bind:value={recheckCaseId}
          type="text"
          placeholder="Enter Recheck Case ID"
          class="w-full h-12 pl-4 pr-12 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>
      </div>

      <!-- Button -->
      <button
        type="submit"
        disabled={loading}
        class="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {#if loading}
          <Loader2 class="animate-spin" size={18} />
          Searching...
        {:else}
          <Search size={18} />
          Search
        {/if}
      </button>
    </form>

    <!-- Error -->
    {#if errorMsg}
      <div
        class="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
      >
        {errorMsg}
      </div>
    {/if}
  </div>

  <!-- Skeleton -->
  {#if loading}
    <div class="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
      <div class="animate-pulse">
        <div class="h-5 bg-gray-200 rounded w-48 mb-6"></div>
        <div class="space-y-4">
          {#each Array(5) as _}
            <div class="grid grid-cols-6 gap-4">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Table -->
  {#if records.length > 0 && !loading}
    <div
      class="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
    >
      <div
        class="px-5 py-4 border-b border-gray-200 flex items-center justify-between"
      >
        <h3 class="font-semibold text-lg text-gray-800">Search Results</h3>
        <span class="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
          {records.length} Records
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 text-gray-700">
            <tr>
              <th class="px-4 py-3 text-left">Seat No</th>
              <th class="px-4 py-3 text-left">Subject</th>
              <th class="px-4 py-3 text-left">Paper Id</th>
              <th class="px-4 py-3 text-left">Answer Sheet URL</th>
              <th class="px-4 py-3 text-left">Final Status</th>
              <th class="px-4 py-3 text-left">Action Button</th>
            </tr>
          </thead>

          <tbody>
            {#each records as row}
              <tr class="border-t border-gray-100 hover:bg-blue-50 transition">
                <td class="px-4 py-3 font-medium">{row.seat_no}</td>
                <td class="px-4 py-3">{row.subj_code}</td>
                <td class="px-4 py-3">{row.paper_id}</td>
                <td class="px-4 py-3">
                  {#if row.answersheet_url}
                    <a
                      href={row.answersheet_url}
                      target="_blank"
                      class="text-blue-600 hover:text-blue-800 hover:underline break-all"
                    >
                      {row.answersheet_url}
                    </a>
                  {:else}
                    <span class="text-red-500 font-medium">Url Not Found</span>
                  {/if}
                </td>
                <td class="px-4 py-3">
                  {row.final_status == null || row.final_status == ""
                    ? "-"
                    : row.final_status}
                </td>
                <td class="px-4 py-3">
                  {#if row.paper_id === records[0].paper_id}
                    <button
                      on:click={() => revertApplication(row)}
                      disabled={!row.answersheet_url}
                      class={row.answersheet_url
                        ? "bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                        : "bg-gray-300 py-2 px-4 rounded-lg text-gray-500 cursor-not-allowed"}
                    >
                      Application Revert
                    </button>
                  {/if}
                </td>
                <!-- <td class="px-4 py-3">
                  <button
                    on:click={() => revertApplication(row)}
                    disabled={!row.answersheet_url }
                    class="{row.answersheet_url ? 'bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all' : 'bg-gray-300 py-2 px-4 rounded-lg  text-gray-500 cursor-not-allowed'} "
                  >
                    Application Revert
                  </button>
                </td> -->
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  <!-- No Data -->
  {#if searchhed && !loading && records.length === 0 && !errorMsg}
    <div
      class="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center"
    >
      <p class="text-gray-500">No records found for this Recheck Case ID</p>
    </div>
  {/if}
</div>
