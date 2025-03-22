<script lang="ts">
	import { Menu } from '$lib/icons';
</script>

<div class="navbar bg-base-100 fixed top-0 z-50 shadow-md">
	<div class="navbar-start">
		<div class="dropdown">
			<label for="mobile-menu" class="btn btn-ghost lg:hidden">
				<Menu class_names="h-5 w-5" />
			</label>
			<ul
				id="mobile-menu"
				class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
			>
				<li><a href="#features">Features</a></li>
				<li><a href="#testimonials">Testimonials</a></li>
				<li><a href="#pricing">Pricing</a></li>
			</ul>
		</div>
		<a href="/" class="btn btn-ghost text-xl">Developer Hub CRM</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href="#features">Features</a></li>
			<li><a href="#testimonials">Testimonials</a></li>
			<li><a href="#pricing">Pricing</a></li>
		</ul>
	</div>
	<div class="navbar-end">
		<a href="/auth/login" class="btn btn-ghost">Login</a>
		<a href="/auth/register" class="btn btn-primary">Register</a>
	</div>
</div>
