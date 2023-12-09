<script lang="ts">
	export let header: string;
	export let page: string;
	export let image: string;
	export let content: string;
	export let width = 1200;
	export let height = 630;
	export let url: string;
</script>

<div class="social-card" style={`width: ${width}px; height: ${height}px;`}>
	<div class="social-card-header">
			<div class="social-card-title">
				<div class="social-card-image">
					<img src={image || '/images/b_shell_nut_favicon.png'} alt="Bradley Shellnut" />
				</div>
				<h1>{header}</h1>
			</div>
	</div>
	<div class="social-card-content">
		<h2 class="page">{page}</h2>
		<p class="content">{content}</p>
	</div>
	<div class="social-card-footer">
		<footer>
			<p>Bradley Shellnut &copy; {new Date().getFullYear()} | Built by Bradley Shellnut | {url || 'https://bradleyshellnut.com'}</p>
		</footer>
	</div>
</div>

<style>
	@font-face {
		font-family: 'Fira Sans';
		src: url('/src/lib/FiraSans-Bold.ttf');
	}

	.social-card {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		color: #D8D8D8;
		background-color: #131415;
	}

	.social-card-header {
		display: flex;
		padding: 0 1.5rem;
		flex-direction: column;
		background-color: #2E2E2E;
	}

	.social-card-title {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: 1.875rem; /* 30px */
		line-height: 2.25rem; /* 36px */
		font-weight: 700;
		letter-spacing: -0.025em;
	}

	.social-card-image {
		display: flex;
		width: 4rem;
		height: 4rem;
	}

	.social-card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 1.5rem;
		padding-top: 0;
	}

	.page {
		font-size: 3.75rem; /* 60px */
		line-height: 1;
		font-weight: 700;
	}

	.content {
		font-size: 1.25rem; /* 20px */
		line-height: 1.75rem; /* 28px */
	}

	.social-card-footer {
		display: flex;
		padding: 1rem 1.5rem;
		align-items: center;
		font-size: 1.25rem;
		line-height: 1.75rem;
		font-weight: 700;
		background-color: #2E2E2E;
	}
</style>