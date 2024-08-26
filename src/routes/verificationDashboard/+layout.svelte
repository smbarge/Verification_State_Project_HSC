<script>
  import { goto } from "$app/navigation";
  import { DarkMode } from "flowbite-svelte";
  import "flowbite/dist/flowbite.css";
  import { keycloakInstance } from "../../stores/stores";
  let redirectUri = import.meta.env.VITE_LOGOUT_URL;
</script>

<button
  on:click={() => {
    $keycloakInstance.logout({ redirectUri });
  }}
  class="absolute top-3 right-4 bg-blue-300 rounded-sm ml-2 col-span-1 p-2"
>
  Logout</button
>

<slot />
