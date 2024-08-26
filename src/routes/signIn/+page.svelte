<script>
  import { onMount } from "svelte";
  import { initKeycloak } from "../../lib/keycloakService";
  import { goto } from "$app/navigation";

  let dataLoaded = false;

  onMount(async () => {
    const authenticated = await initKeycloak();
    if (authenticated) {
      goto("/verificationDashboard");
    }
  });
</script>

<div></div>
