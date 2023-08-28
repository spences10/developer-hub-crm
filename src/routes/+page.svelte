<script lang="ts">
	export let data
</script>

<h1>Welcome to Developer Hub CRM</h1>

{#if data.username}
	<p>Logged in as {data.username}</p>
{:else}
	<a href="/login">Login</a>
	<a href="/register">Register</a>
{/if}
