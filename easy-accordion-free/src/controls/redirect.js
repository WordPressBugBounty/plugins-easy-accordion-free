window.addEventListener("load", function () {
	const url = new URL(window.location.href);
	if (!url.searchParams.has("eabblock_inserter")) {
		return;
	}

	function tryClick() {
		if (!wp.data.dispatch) {
			return false;
		}
		const { dispatch } = wp.data;
		if (dispatch("core/editor")) {
			dispatch("core/editor").setIsInserterOpened(true);
		} else if (dispatch("core/edit-post")) {
			dispatch("core/edit-post").setIsInserterOpened(true);
		}
		// clear url.
		url.searchParams.delete("eabblock_inserter");
		history.replaceState(null, "", url.toString());
		return true;
	}

	// Try every 100ms for up to 2 seconds
	let attempts = 0;
	const interval = setInterval(() => {
		attempts++;
		if (tryClick() || attempts > 20) {
			clearInterval(interval);
		}
	}, 100);
});
