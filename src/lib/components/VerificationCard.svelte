<!-- <script>
  export let title;
  export let TotalCount;
  export let CompletedCount;
  export let PendingCount;

  // Calculate completion percentage
  $: completionPercentage = TotalCount > 0 
    ? Math.round((CompletedCount / TotalCount) * 100) 
    : 0;
</script>


<div class="bg-gray-100 rounded-lg shadow p-4 mb-4 md:mb-0">
<div
    class=" gap-2 p-4 bg-white border border-1 bg-gradient-to-r from-blue-200 from-10% to-blue-200 to-90% shadow rounded-lg"
  >
  <h4 class="font-medium text-gray-800 mb-3">{title}</h4>
  
  <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
    <div 
      class="bg-blue-600 h-2.5 rounded-full" 
      style="width: {completionPercentage}%"
    ></div>
  </div>
  
  <div class="grid grid-cols-3 gap-2 text-sm">
    <div class="text-center">
      <p class="text-gray-500">Total</p>
      <p class="font-semibold text-gray-800">{TotalCount}</p>
    </div>
    <div class="text-center">
      <p class="text-gray-500">Completed</p>
      <p class="font-semibold text-green-600">{CompletedCount}</p>
    </div>
    <div class="text-center">
      <p class="text-gray-500">Pending</p>
      <p class="font-semibold text-orange-500">{PendingCount}</p>
    </div>
  </div>
  </div>
</div>

 -->


<script>
  export let title = "Title";
  //   export let TotalCount = "123";
  //   export let CompletedCount = "124";
  //   export let PendingCount = "125";
  export let TotalCount;
  export let CompletedCount;
  export let PendingCount;
</script>

<div class="col-span-1 bg-gray-100 rounded-lg">
  <div
    class="grid grid-cols-3 gap-2 p-4 bg-white border border-1 bg-gradient-to-r from-blue-200 from-10% to-blue-200 to-90% shadow rounded-lg"
  >
    <div class="col-span-3">
      <h3 class="text-lg font-semibold">{title}</h3>
    </div>
    <div class="col-span-3 sm:col-span-1 p-1 bg-gray-100 rounded-lg">
      <div class="text-center md:text-lg font-bold">Total</div>
      <div class=" text-center md:text-xl">{TotalCount}</div>
    </div>
    <div class="col-span-3 sm:col-span-1 p-1 bg-gray-100 rounded-lg">
      <div class="text-center md:text-lg font-bold">Completed</div>
      <div class="text-center md:text-xl">{CompletedCount}</div>
    </div>
    <div class="col-span-3 sm:col-span-1 p-1 bg-gray-100 rounded-lg">
      <div class="text-center md:text-lg font-bold">Pending</div>
      <div class="text-center md:text-xl">{PendingCount}</div>
    </div>
  </div>
</div>
<!-- 
<script>
  export let title = "Title";
  export let TotalCount;
  export let CompletedCount;
  export let PendingCount;

  $: completedPct = TotalCount > 0 ? (CompletedCount / TotalCount) * 100 : 0;
  $: pendingPct = TotalCount > 0 ? (PendingCount / TotalCount) * 100 : 0;
</script>

<div class="bg-white border border-slate-100 rounded-2xl p-4 overflow-hidden">

  <div class="h-1 w-full rounded-full bg-blue-500 mb-4"></div>

  <h3 class="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
    Overview
  </h3>
  <p class="text-base font-semibold text-slate-800 mb-4">{title}</p>

  <div class="grid grid-cols-3 gap-2">

    <div class="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center">
      <p class="text-[10px] font-semibold uppercase tracking-wider text-blue-600 mb-1">Total</p>
      <p class="text-2xl font-semibold text-slate-800 leading-none">{TotalCount ?? '—'}</p>
    </div>

    <div class="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center">
      <p class="text-[10px] font-semibold uppercase tracking-wider text-green-700 mb-1">Completed</p>
      <p class="text-2xl font-semibold text-slate-800 leading-none">{CompletedCount ?? '—'}</p>
    </div>

    <div class="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center">
      <p class="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-1">Pending</p>
      <p class="text-2xl font-semibold text-slate-800 leading-none">{PendingCount ?? '—'}</p>
    </div>

  </div>

  {#if TotalCount > 0}
    <div class="flex gap-1 mt-3 h-1.5 rounded-full overflow-hidden">
      <div
        class="bg-green-500 rounded-full h-full transition-all duration-500"
        style="width: {completedPct}%"
      ></div>
      <div
        class="bg-amber-400 rounded-full h-full transition-all duration-500"
        style="width: {pendingPct}%"
      ></div>
    </div>
  {/if}

</div> -->