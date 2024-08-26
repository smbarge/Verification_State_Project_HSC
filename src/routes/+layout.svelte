<script>
  import { goto } from "$app/navigation";
  import "../app.css";
  import { DarkMode } from "flowbite-svelte";
  import "flowbite/dist/flowbite.css";
  import { keycloakInstance } from "../stores/stores";
  let redirectUri = import.meta.env.VITE_LOGOUT_URL;
</script>

<div
  class="grid grid-cols-12 bg-primary-400 dark:bg-gray-800 font-semibold text-xs rounded-md md:text-sm m-2 items-center mt-2 p-1"
>
  <div class="font-bold col-span-2 flex sm:justify-end justify-center">
    <img src="/mahalogo.png" class="h-10 w-10" alt="board Logo" />
  </div>
  <div class="col-span-8 text-gray-100 dark:text-gray-100">
    MAHARASHTRA STATE BOARD OF SECONDARY & HIGHER SECONDARY EDUCATION,PUNE <strong
    >
      HSC Exam Recheck</strong
    >
  </div>
  <!-- <div>

  <button class="bg-blue-300 rounded-sm"> logout </button>
  </div> -->
  <!-- <label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" value="" class="sr-only peer">
  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
</label> -->
  <span class=" col-span-1"><DarkMode /></span>
</div>
<div></div>
<!-- <span
  class="text-xs dark:bg-gray-800 m-2 ml-5 flex justify-center items-center mt-2 mb-2 md:text-sm dark:text-gray-200 md:bg-primary-200 p-1 rounded"
>
  MAHARASHTRA STATE BOARD OF SECONDARY & HIGHER SECONDARY EDUCATION PUNE HSC
  EXAMINATION FEBRUARY-2023 RESULT
</span> -->
<slot />
