<script lang="ts">
	let { header, page, image, content, width = 1200, height = 630, url } = $props<{
		header: string;
		page: string;
		image: string;
		content: string;
		width: number;
		height: number;
		url: string;
	}>();
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
