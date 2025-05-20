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
