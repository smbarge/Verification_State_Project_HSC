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
