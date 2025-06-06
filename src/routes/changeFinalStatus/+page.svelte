<script>
  import { onMount } from "svelte";

  let caseIdInput = "";
  let loading = false;
  let results = [];
  let selectedCaseIds = [];
  let selectedRecheckCaseIds = [];
  let messages = [];
  let selectAll = false;
  let searchStats = null;

  // Create animated particles
  function createParticles() {
    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 6,
        duration: Math.random() * 3 + 3,
      });
    }
    return particles;
  }

  let particles = [];

  onMount(() => {
    particles = createParticles();
  });

  function showMessage(text, type) {
    const message = { text, type, id: Date.now() };
    messages = [...messages, message];

    // Remove message after 5 seconds
    setTimeout(() => {
      messages = messages.filter((m) => m.id !== message.id);
    }, 5000);
  }

  function updateSelectedCaseIds(item, checked) {
    if (checked) {
      selectedCaseIds = [...selectedCaseIds, item.recheck_application_id];
      selectedRecheckCaseIds = [
        ...selectedRecheckCaseIds,
        item.recheck_case_id,
      ];
    } else {
      selectedCaseIds = selectedCaseIds.filter(
        (id) => id !== item.recheck_application_id
      );
      selectedRecheckCaseIds = selectedRecheckCaseIds.filter(
        (id) => id !== item.recheck_case_id
      );
    }
  }

  async function submitCaseId() {
    const caseIds = caseIdInput.trim();

    if (!caseIds) {
      showMessage("Please enter at least one Case ID.", "error");
      return;
    }

    const caseIdArray = caseIds
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);

    if (caseIdArray.length === 0) {
      showMessage("Please enter valid Case IDs.", "error");
      return;
    }

    // Clear previous results
    results = [];
    selectedCaseIds = [];
    selectedRecheckCaseIds = [];
    messages = [];
    selectAll = false;

    // Show loading
    loading = true;

    try {
      const response = await fetch("/api/changeFinalStatus/findCaseId", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ cases: caseIdArray }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let result = await response.json();
      result = result.dispatchCases;
      console.log("result is ", result);

      loading = false;

      // Calculate statistics
      const totalCases = caseIdArray.length;
      const foundCases = result ? result.length : 0;
      const notFoundCount = totalCases - foundCases;

      // Find which cases were not found
      const foundCaseIds = result
        ? result.map((item) => item.recheck_case_id).filter((id) => id)
        : [];
      const notFoundCaseIds = caseIdArray.filter(
        (id) => !foundCaseIds.includes(id)
      );

      searchStats = {
        totalCases,
        foundCases,
        notFoundCount,
        notFoundCaseIds,
      };

      if (result && result.length > 0) {
        results = result;
        showMessage(
          `Found ${foundCases} of ${totalCases} cases`,
          foundCases === totalCases ? "success" : "error"
        );
      } else {
        showMessage(
          `No cases found. 0 of ${totalCases} cases were located.`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      loading = false;
      showMessage(
        "Error occurred while fetching data. Please try again.",
        "error"
      );
    }
  }

  async function removeFinalStatus() {
    if (selectedRecheckCaseIds.length === 0) {
      showMessage("Please select at least one case first.", "error");
      return;
    }

    try {
      const response = await fetch("/api/changeFinalStatus/removeFinalStatus", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({recheck_case_id:selectedRecheckCaseIds}),
      });

      showMessage(
        `Final Status fields hidden for ${selectedRecheckCaseIds.length} selected case(s).`,
        "success"
      );
    } catch (error) {
      showMessage("Error removing final status.", "error");
    }
  }

  async function removeDispatchStatus() {
    if (selectedCaseIds.length === 0) {
      showMessage("Please select at least one case first.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/removeDispatch", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(selectedCaseIds),
      });

      const result = await response.json();
      showMessage(
        `Dispatch Status fields hidden for ${selectedCaseIds.length} selected case(s).`,
        "success"
      );
    } catch (error) {
      showMessage("Error removing dispatch status.", "error");
    }
  }

  function toggleSelectAll() {
    if (selectAll) {
      // Select all
      selectedCaseIds = results.map((item) => item.recheck_application_id);
      selectedRecheckCaseIds = results.map((item) => item.recheck_case_id);
    } else {
      // Deselect all
      selectedCaseIds = [];
      selectedRecheckCaseIds = [];
    }
  }

  $: if (selectAll !== undefined) {
    toggleSelectAll();
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && event.ctrlKey) {
      submitCaseId();
    }
  }

  $: selectedCount = selectedCaseIds.length;
  $: totalCount = results.length;
</script>

<main>
  <!-- Animated Background Particles -->
  <div class="particles">
    {#each particles as particle (particle.id)}
      <div
        class="particle"
        style="left: {particle.left}%; top: {particle.top}%; animation-delay: {particle.delay}s; animation-duration: {particle.duration}s;"
      ></div>
    {/each}
  </div>

  <!-- Header -->
  <header>
    <div class="header-content">
      <div class="logo">HSC Status Remove Portal</div>
    </div>
  </header>

  <!-- Main Content -->
  <div class="main-content">
    <div class="card">
      <h1 class="form-title">Case ID Lookup</h1>
      <div class="form-group">
        <label for="caseId">Enter Case ID(s)</label>
        <textarea
          id="caseId"
          bind:value={caseIdInput}
          on:keypress={handleKeyPress}
          placeholder="Enter one or more Case IDs separated by commas..."
          rows="4"
        ></textarea>
      </div>
      <button class="submit-btn" on:click={submitCaseId}>
        <span>Search Cases</span>
      </button>
    </div>

    <!-- Messages -->
    {#each messages as message (message.id)}
      <div class="message {message.type}">
        {message.text}
      </div>
    {/each}

    <!-- Loading -->
    {#if loading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Searching for cases...</p>
      </div>
    {/if}

    <!-- Search Statistics -->
    {#if searchStats}
      <div class="stats-container">
        <div class="stats-title">Search Results Summary</div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">{searchStats.totalCases}</span>
            <span class="stat-label">Total Searched</span>
          </div>
          <div class="stat-item">
            <span class="stat-number" style="color: #4caf50;"
              >{searchStats.foundCases}</span
            >
            <span class="stat-label">Found</span>
          </div>
          <div class="stat-item">
            <span class="stat-number" style="color: #f44336;"
              >{searchStats.notFoundCount}</span
            >
            <span class="stat-label">Not Found</span>
          </div>
        </div>
        {#if searchStats.notFoundCount > 0}
          <div class="not-found-section">
            <div class="not-found-title">Cases Not Found:</div>
            <div class="not-found-list">
              {#each searchStats.notFoundCaseIds as id}
                <span class="not-found-item">{id}</span>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Select All Section -->
    {#if results.length > 0}
      <div class="select-all-container">
        <div class="select-all-checkbox">
          <input type="checkbox" id="selectAll" bind:checked={selectAll} />
          <label for="selectAll">Select All Cases</label>
        </div>
        <div class="selected-count">
          {selectedCount} of {totalCount} cases selected
        </div>
      </div>
    {/if}

    <!-- Results -->
    {#each results as item, index (item.recheck_case_id)}
      <div class="result-item" style="animation-delay: {index * 0.2}s;">
        <div class="case-checkbox">
          <input
            type="checkbox"
            id="case_{index}"
            class="case-checkbox-input"
            checked={selectedCaseIds.includes(item.recheck_application_id)}
            on:change={(e) => updateSelectedCaseIds(item, e.target.checked)}
          />
          <label for="case_{index}"
            >Case ID: {item.recheck_case_id || "N/A"}</label
          >
        </div>
        <div class="result-field">
          <span class="field-label">Case ID:</span>
          <span class="field-value">{item.recheck_case_id || "N/A"}</span>
        </div>
        <div class="result-field">
          <span class="field-label">Application ID:</span>
          <span class="field-value">{item.recheck_application_id || "N/A"}</span
          >
        </div>
        <div class="result-field">
          <span class="field-label">Final Status:</span>
          <span class="field-value">{item.final_status || "N/A"}</span>
        </div>
        <div class="result-field">
          <span class="field-label">Dispatch Date:</span>
          <span class="field-value">{item.status || "N/A"}</span>
        </div>
      </div>
    {/each}

    <!-- Action Buttons -->
    {#if results.length > 0}
      <div class="button-row">
        <button class="submit-btn" on:click={removeFinalStatus}>
          <span>Remove Final Status</span>
        </button>
        <button class="submit-btn" on:click={removeDispatchStatus}>
          <span>Remove Dispatch Status</span>
        </button>
      </div>
    {/if}
  </div>

  <!-- Footer -->
  <footer>
    <div class="footer-content">
      <p>&copy; 2025 HSC Status Remove Portal. All rights reserved.</p>
    </div>
  </footer>
</main>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
  }

  main {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    position: relative;
  }

  /* Animated background particles */
  .particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }

  /* Header */
  header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1rem 0;
    position: relative;
    z-index: 10;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo {
    font-size: 1.8rem;
    font-weight: bold;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* Main Content */
  .main-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 3rem 2rem;
    position: relative;
    z-index: 10;
  }

  .card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    margin-bottom: 2rem;
    animation: slideUp 0.6s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .form-title {
    font-size: 2rem;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #555;
  }

  textarea {
    width: 100%;
    min-height: 120px;
    padding: 1rem;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.8);
  }

  textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }

  .submit-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .submit-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }

  .submit-btn:active {
    transform: translateY(-1px);
  }

  .submit-btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  .submit-btn:hover::before {
    left: 100%;
  }

  /* Button row styling */
  .button-row {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .button-row .submit-btn {
    flex: 1;
    width: auto;
  }

  /* Messages */
  .message {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    animation: slideDown 0.3s ease-out;
  }

  .message.success {
    background: rgba(245, 247, 245, 0.87);
    border-left: 4px solid #4caf50;
    color: #2e7d32;
  }

  .message.error {
    background: rgba(244, 67, 54, 0.1);
    border-left: 4px solid #f44336;
    color: #c62828;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Loading animation */
  .loading {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    margin-bottom: 1rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Statistics container */
  .stats-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 15px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    animation: slideUp 0.6s ease-out;
  }

  .stats-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
    text-align: center;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .stat-item {
    text-align: center;
    padding: 1rem;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 10px;
    border: 1px solid rgba(102, 126, 234, 0.2);
    transition: all 0.3s ease;
  }

  .stat-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }

  .stat-number {
    font-size: 1.8rem;
    font-weight: bold;
    color: #667eea;
    display: block;
    margin-bottom: 0.3rem;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
  }

  .not-found-section {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(244, 67, 54, 0.05);
    border-radius: 8px;
    border-left: 4px solid #f44336;
  }

  .not-found-title {
    font-weight: 600;
    color: #c62828;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .not-found-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .not-found-item {
    background: rgba(244, 67, 54, 0.1);
    color: #c62828;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid rgba(244, 67, 54, 0.2);
  }

  /* Select all container */
  .select-all-container {
    margin-bottom: 1rem;
    padding: 1rem;
    background: rgba(76, 175, 80, 0.1);
    border-radius: 12px;
    border: 2px dashed rgba(102, 126, 234, 0.3);
  }

  .select-all-checkbox {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #333;
  }

  .select-all-checkbox input[type="checkbox"] {
    width: 20px;
    height: 20px;
    margin-right: 0.8rem;
    cursor: pointer;
    accent-color: #667eea;
  }

  .selected-count {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
  }

  /* Case checkbox styling */
  .case-checkbox {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.5rem;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .case-checkbox:hover {
    background: rgba(102, 126, 234, 0.1);
  }

  .case-checkbox input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin-right: 0.8rem;
    cursor: pointer;
    accent-color: #667eea;
  }

  .case-checkbox label {
    cursor: pointer;
    font-weight: 600;
    color: #333;
    margin: 0;
    flex: 1;
  }

  /* Results */
  .result-item {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-left: 4px solid #667eea;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .result-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }

  .result-field {
    display: flex;
    margin-bottom: 0.8rem;
    align-items: center;
  }

  .field-label {
    font-weight: 600;
    color: #333;
    min-width: 140px;
    margin-right: 1rem;
  }

  .field-value {
    color: #666;
    font-size: 0.95rem;
    background: rgba(102, 126, 234, 0.1);
    padding: 0.3rem 0.8rem;
    border-radius: 8px;
  }

  /* Footer */
  footer {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    color: white;
    text-align: center;
    padding: 2rem 0;
    position: relative;
    z-index: 10;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .main-content {
      padding: 2rem 1rem;
    }

    .card {
      padding: 1.5rem;
    }

    .form-title {
      font-size: 1.5rem;
    }

    .result-field {
      flex-direction: column;
      align-items: flex-start;
    }

    .field-label {
      min-width: auto;
      margin-right: 0;
      margin-bottom: 0.3rem;
    }

    .button-row {
      flex-direction: column;
      gap: 0.5rem;
    }

    .button-row .submit-btn {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .card {
      padding: 1rem;
      margin: 0 0.5rem 2rem;
    }

    .main-content {
      padding: 1rem 0.5rem;
    }
  }
</style>
