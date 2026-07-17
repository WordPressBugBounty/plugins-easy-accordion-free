window.addEventListener("load", function () {
	const url = new URL(window.location.href);
	const hasBlockInserter = url.searchParams.has("eabblock_inserter");
	const hasPatternLibrary = url.searchParams.has("eab_pattern_library");
	const hasAutoInsert = url.searchParams.has("eab_auto_insert");
	const autoInsertBlock = hasAutoInsert ? url.searchParams.get("eab_auto_insert") : null;

	if (!hasBlockInserter && !hasPatternLibrary) {
		return;
	}

	function tryScroll() {
		const headings = document.querySelectorAll(".block-editor-inserter__panel-title");
		const easyAccordionHeading = Array.from(headings).find((h) => h.textContent.trim() === "EASY ACCORDION");
		if (easyAccordionHeading) {
			easyAccordionHeading.scrollIntoView({
				behavior: "smooth",
				block: "start",
				inline: "nearest",
			});
			return true;
		}
		return false;
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

		// Try to scroll every 100ms for up to 3 seconds
		let scrollAttempts = 0;
		const scrollInterval = setInterval(() => {
			scrollAttempts++;
			if (tryScroll() || scrollAttempts > 30) {
				clearInterval(scrollInterval);
				// After scrolling, try to auto-insert block if parameter exists
				if (autoInsertBlock) {
					tryAutoInsert(autoInsertBlock);
				}
			}
		}, 100);

		return true;
	}

	function tryAutoInsert(blockName) {
		// Wait for inserter to be fully loaded
		setTimeout(() => {
			if (!wp.blocks || !wp.data.dispatch) {
				return;
			}

			try {
				// Get the block editor store
				const { dispatch } = wp.data;
				const blockEditor = dispatch("core/block-editor");
				if (!blockEditor) {
					return;
				}

				// Create the block
				const newBlock = wp.blocks.createBlock(blockName);
				if (!newBlock) {
					return;
				}

				// Insert the block at the root level
				blockEditor.insertBlock(newBlock);

				// Auto-set page title to "Easy Accordion Page"
				const editorDispatch = dispatch("core/editor");
				if (editorDispatch) {
					editorDispatch.editPost({ title: "Easy Accordion Page" });
				}

				// Select the newly inserted block using dispatch
				setTimeout(() => {
					const { dispatch } = wp.data;
					const blockEditorDispatch = dispatch("core/block-editor");
					if (blockEditorDispatch && newBlock.clientId) {
						blockEditorDispatch.selectBlock(newBlock.clientId);
					}
				}, 200);

				// Auto-click Skip button after template selection appears
				setTimeout(() => {
					tryClickSkipButton();
				}, 1500);

				// Clear the auto_insert parameter from URL
				const currentUrl = new URL(window.location.href);
				currentUrl.searchParams.delete("eab_auto_insert");
				history.replaceState(null, "", currentUrl.toString());
			} catch (error) {
				// Error auto-inserting block - silent fail
			}
		}, 500);
	}

	// Track retry attempts for skip button
	let skipButtonAttempts = 0;
	const MAX_SKIP_ATTEMPTS = 20; // 10 seconds total (20 * 500ms)

	function getEditorDocuments() {
		// The block canvas may render inside iframe[name="editor-canvas"],
		// so search both the top document and the iframe document.
		const documents = [document];
		const canvasIframe = document.querySelector('iframe[name="editor-canvas"]');
		if (canvasIframe && canvasIframe.contentDocument) {
			documents.push(canvasIframe.contentDocument);
		}
		return documents;
	}

	function tryClickSkipButton() {
		const documents = getEditorDocuments();

		// Try to find the Skip button in template selection overlay
		for (const doc of documents) {
			const skipButton = doc.querySelector(".sp-eab-layout-modal-skip-button");
			if (skipButton) {
				skipButton.click();
				return true;
			}
		}

		// Alternative: find by text content "Skip"
		for (const doc of documents) {
			const allButtons = doc.querySelectorAll("span, button, .components-button");
			for (const button of allButtons) {
				if (button.textContent.trim() === "Skip") {
					button.click();
					return true;
				}
			}
		}

		// If not found yet and under max attempts, retry after delay
		if (skipButtonAttempts < MAX_SKIP_ATTEMPTS) {
			skipButtonAttempts++;
			setTimeout(() => {
				tryClickSkipButton();
			}, 500);
		}

		return false;
	}

	function tryClickPatternButton() {
		const button = document.getElementById("sp-eab-patterns-library-modal-button");
		if (button) {
			button.click();
			// clear url.
			url.searchParams.delete("eab_pattern_library");
			history.replaceState(null, "", url.toString());
			return true;
		}
		return false;
	}

	// Handle pattern library
	if (hasPatternLibrary) {
		let attempts = 0;
		const interval = setInterval(() => {
			attempts++;
			if (tryClickPatternButton() || attempts > 30) {
				clearInterval(interval);
			}
		}, 100);
		return;
	}

	// Handle block inserter
	// Try every 100ms for up to 2 seconds
	let attempts = 0;
	const interval = setInterval(() => {
		attempts++;
		if (tryClick() || attempts > 20) {
			clearInterval(interval);
		}
	}, 100);
});
