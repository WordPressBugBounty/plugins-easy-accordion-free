class EabHelpers {
	constructor() {
		this.headingSelector = '.sp-eab-accordion-heading';
	}

	qs(selector, el = false) {
		if (el) {
			return el.querySelector(selector);
		}
		return document.querySelector(selector);
	}
	qsAll(selector, el = false) {
		if (el) {
			return el.querySelectorAll(selector);
		}
		return document.querySelectorAll(selector);
	}
}
class EabAccordion {
	constructor(selectorEl, options = {}) {
		this.container = selectorEl;
		this.items = this.container.querySelectorAll(
			':scope > .sp-eab-accordion-item'
		);
		this.options = Object.assign(
			{
				openMultiItemAtaTime: true,
				defaultAccordionOpen: 'close-all',
				selectedItemOpen: 1, // only works when defaultAccordionOpen ===  open-selected-item;
				mode: 'vertical',
				activeEvent: 'click',
				transitionDuration: 600, // in ms
				autoplayDuration: 3000, // in ms
				autoplayPauseOnHover: true,
				scrollToTopOnLoad: false,
				scrollToTopOnClick: false,
				accordionItemToUrl: false,
				animationEffect: false,
				applyAccessibility: true,
			},
			options
		);
		this.isVerticalMode = this.options.mode === 'vertical';
		this.#accordionInit();
		// autoplay constants.
		this.currentIndex = 0;
		this.autoplayInterval = null;
		this.isAutoplayPaused = false;
	}

	//Ensure event listeners don't stack when the same DOM
	//is initialized multiple times (e.g. block re-render / AJAX).
	#removeBoundEvent(el, eventName, storeKey) {
		if (!el) {
			return;
		}
		const key = storeKey || `__eab_${eventName}_handler`;
		const prev = el[key];
		if (prev) {
			el.removeEventListener(eventName, prev);
			try {
				delete el[key];
			} catch (e) {
				// ignore if delete fails
			}
		}
	}

	#bindEvent(el, eventName, handler, storeKey) {
		if (!el || typeof handler !== 'function') {
			return;
		}
		const key = storeKey || `__eab_${eventName}_handler`;
		this.#removeBoundEvent(el, eventName, key);
		el.addEventListener(eventName, handler);
		el[key] = handler;
	}

	/* ----------------------------
	 * ACCESSIBILITY SETUP
	 * ----------------------------- */
	#getFocusableElements(item) {
		const selectors = `a[href], area[href], button, input:not([type="hidden"]), select, textarea, iframe`;
		return [...item.querySelectorAll(selectors)].filter((el) => {
			return (
				!el.disabled &&
				el.getAttribute('aria-hidden') !== 'true' &&
				el.offsetParent !== null
			);
		});
	}
	#applyAccessibilityAttributes(item, index) {
		const trigger = item.querySelector('.sp-eab-accordion-heading');
		const content = item.querySelector('.sp-eab-accordion-content');
		const uniqueId = item?.getAttribute('id');
		const shortId = uniqueId?.slice(-6) || index;
		const triggerId = `eab-trigger${shortId}`;
		const contentId = `eab-content${shortId}`;
		// --- Accessible roles & attributes ---
		trigger.setAttribute('id', triggerId);
		trigger.setAttribute('role', 'button');
		trigger.setAttribute('tabindex', '0');
		trigger.setAttribute('aria-controls', contentId);
		trigger.setAttribute('aria-expanded', 'false');
		trigger.setAttribute('aria-disabled', 'false');

		content.setAttribute('id', contentId);
		content.setAttribute('role', 'region');
		content.setAttribute('aria-labelledby', triggerId);

		// --- Keyboard Navigation ---
		const onKeydown = (e) => {
			const triggers = [
				...this.container.querySelectorAll('.sp-eab-accordion-heading'),
			];
			if (e.key !== 'Tab') {
				e.preventDefault();
			}
			switch (e.key) {
				case 'Enter':
				case ' ':
					this.#toggleAccordionItem(item);
					break;
				case 'ArrowDown':
				case 'ArrowRight':
					if (triggers[index + 1]) {
						triggers[index + 1].focus();
					}
					break;
				case 'ArrowUp':
				case 'ArrowLeft':
					if (triggers[index - 1]) {
						triggers[index - 1].focus();
					}
					break;
				case 'Home':
					triggers[0].focus();
					break;
				case 'End':
					triggers[triggers?.length - 1].focus();
					break;
				case 'Tab':
					// Only handle forward tab.
					if (e.shiftKey) {
						return;
					}
					if (
						item.classList.contains('eab-expand') &&
						this.#getFocusableElements(item)
					) {
						return;
					}
					const nextTrigger = triggers[index + 1];
					if (nextTrigger) {
						e.preventDefault();
						nextTrigger.focus();
					}
					break;
			}
		};
		this.#bindEvent(trigger, 'keydown', onKeydown, '__eabKeydownHandler');
	}

	#toggleAriaControls(item, state = 'true') {
		const trigger = item.querySelector('.sp-eab-accordion-heading');
		trigger.setAttribute('aria-expanded', state);
	}

	/* -------------------------
	 * ACCORDION INIT
	 * -------------------------- */
	#accordionInit() {
		// INITIALIZE EACH ACCORDION ITEM.
		const activeEvent = this.options.activeEvent;
		const defaultOpenItems = this.options.defaultAccordionOpen;
		const isEabSlugExist =
			window?.location?.href?.includes('eab-accordion-');
		const cssString = this.isVerticalMode
			? `max-height: 0; transition: max-height ${this.options.transitionDuration || 500}ms ease;`
			: `width: 0; transition: width ${this.options.transitionDuration || 500}ms ease;`;

		if (defaultOpenItems === 'close-all') {
			this.collapseAll();
		}

		// LOOP THROUGH EACH ITEM.
		this.items.forEach((item, index) => {
			const content = item.querySelector('.sp-eab-accordion-content');
			content.style.cssText = cssString;
			// ADD EVENT LISTENER BASED ON ACTIVE EVENT TYPE.
			const trigger = item.querySelector('.sp-eab-accordion-heading');
			// Clean up any previously bound handlers to avoid double toggles.
			this.#removeBoundEvent(
				trigger,
				'mouseenter',
				'__eabToggleMouseenterHandler'
			);
			this.#removeBoundEvent(trigger, 'click', '__eabToggleClickHandler');
			this.#removeBoundEvent(
				item,
				'mouseenter',
				'__eabAutoplayPauseHandler'
			);
			this.#removeBoundEvent(
				item,
				'mouseleave',
				'__eabAutoplayResumeHandler'
			);
			if (activeEvent === 'hover') {
				const onTriggerMouseenter = () =>
					this.#toggleAccordionItem(item);
				this.#bindEvent(
					trigger,
					'mouseenter',
					onTriggerMouseenter,
					'__eabToggleMouseenterHandler'
				);
			} else if (activeEvent === 'click') {
				const onTriggerClick = () => this.#toggleAccordionItem(item);
				this.#bindEvent(
					trigger,
					'click',
					onTriggerClick,
					'__eabToggleClickHandler'
				);
			} else if (activeEvent === 'auto') {
				const onTriggerClick = () => this.#toggleAccordionItem(item);
				this.#bindEvent(
					trigger,
					'click',
					onTriggerClick,
					'__eabToggleClickHandler'
				);
				// PAUSE AUTOPLAY ON HOVER.
				if (this.options.autoplayPauseOnHover) {
					const onPause = () => this.#pauseAutoplay();
					const onResume = () => this.#resumeAutoplay();
					this.#bindEvent(
						item,
						'mouseenter',
						onPause,
						'__eabAutoplayPauseHandler'
					);
					this.#bindEvent(
						item,
						'mouseleave',
						onResume,
						'__eabAutoplayResumeHandler'
					);
				}
			}

			// DEFAULT OPEN ITEM SET FROM ACCORDION ITEM BLOCK ONLY WORK ON VERTICAL ACCORDION.
			if (this.isVerticalMode && item.getAttribute('data-default-open')) {
				this.#openAccordionItem(item);
				// SCROLL TO TOP ON LOAD.
				if (this.options.scrollToTopOnLoad) {
					this.#scrollItemIntoView(item);
				}
			}
			// ACCESSIBILITY INIT.
			if (this.options.applyAccessibility) {
				this.#applyAccessibilityAttributes(item, index);
			}
			// variations product.
			const variationsProduct = item.querySelector('.variations_form');
			if (variationsProduct) {
				content.style.overflowY = 'auto';
			}
		});
		// ACCORDION AUTOPLAY HANDLER.
		if (activeEvent === 'auto') {
			this.#startAutoplay();
		}
		// ACCORDION DEFAULT OPEN HANDLER.
		if (isEabSlugExist) {
			return; // skip default open if URL has accordion slug.
		}
		if (defaultOpenItems === 'open-all') {
			this.expandAll();
		} else if (defaultOpenItems === 'first-item') {
			this.#openAccordionItem(this.items[0]);
		} else if (defaultOpenItems === 'open-selected-item') {
			const item = this.items[this.options.selectedItemOpen];
			if (item) {
				this.#openAccordionItem(item);
			}
		}
	}

	/* ---------------------------------------
	 * TOGGLE ACCORDION ITEM
	 * ---------------------------------------- */
	#toggleAccordionItem(item) {
		// UPDATE INDEX IF ACTIVATOR EVENT IS AUTOPLAY AND CLICKED ON ITEM.
		if (this.options.activeEvent === 'auto') {
			const index = Array.from(this.items).indexOf(item);
			if (index !== -1) {
				this.currentIndex = index;
			}
		}
		// TOGGLE ITEM FUNCTIONALITY.
		if (item.classList.contains('eab-expand')) {
			this.#closeAccordionItem(item);
		} else {
			if (!this.options.openMultiItemAtaTime) {
				this.collapseAll();
			}
			this.#openAccordionItem(item);
			// if (this.options.accordionItemToUrl) {
			// 	this.#accordionToUrl(item);
			// }
		}
	}
	/* -----------------------------------
	 * HANDLE OPEN ACCORDION ITEM
	 * ------------------------------------ */
	#openAccordionItem(item) {
		if (!item) {
			return;
		}
		// APPLY CONTENT ANIMATION.
		this.#handleContentAnimation(item, 'APPLY');
		const content = item.querySelector('.sp-eab-accordion-content');
		item.classList.add('eab-expand');
		if (this.isVerticalMode) {
			content.style.maxHeight = content.scrollHeight + 'px';
		} else {
			content.style.width = content.scrollWidth + 'px';
		}
		// ACCESSIBILITY TOGGLE.
		if (this.options.applyAccessibility) {
			this.#toggleAriaControls(item, 'true');
		}
	}
	/* ------------------------------------
	 * HANDLE CLOSE ACCORDION ITEM
	 * ------------------------------------- */
	#closeAccordionItem(item) {
		// REMOVE CONTENT ANIMATION.
		this.#handleContentAnimation(item, 'REMOVE');
		const content = item.querySelector('.sp-eab-accordion-content');
		item.classList.remove('eab-expand');
		if (this.isVerticalMode) {
			content.style.maxHeight = '0px';
		} else {
			content.style.width = '0px';
		}
		// ACCESSIBILITY TOGGLE.
		if (this.options.applyAccessibility) {
			this.#toggleAriaControls(item, 'false');
		}
	}
	/* ---------------------------------
	 * METHOD EXPAND ALL ACCORDION
	 * --------------------------------- */
	expandAll() {
		this.items.forEach((item) => this.#openAccordionItem(item));
	}
	/* -------------------------------
	 * METHOD COLLAPSE ALL ACCORDION
	 * --------------------------------*/
	collapseAll() {
		this.items.forEach((item) => this.#closeAccordionItem(item));
	}

	/* --------------------------------
	 * ACCORDION AUTOPLAY
	 * --------------------------------- */
	#startAutoplay() {
		this.autoplayInterval = setInterval(() => {
			if (this.isAutoplayPaused) {
				return;
			} // skip while paused

			this.collapseAll();
			const currentItem = this.items[this.currentIndex];
			this.#openAccordionItem(currentItem);

			this.currentIndex = (this.currentIndex + 1) % this.items.length;
		}, this.options.autoplayDuration);
	}

	#pauseAutoplay() {
		this.isAutoplayPaused = true;
	}

	#resumeAutoplay() {
		this.isAutoplayPaused = false;
	}

	/* ----------------------------------
	 * SCROLL OPENED ITEM TO TOP
	 * ---------------------------------*/
	#scrollItemIntoView(item) {
		const offset = 300; // admin bar or extra spacing
		const rect = item.getBoundingClientRect();
		const scrollTop = window.pageYOffset + rect.top - offset;
		window.scrollTo({ top: scrollTop, behavior: 'smooth' });
	}
	/* ----------------------------------
	 * ACCORDION TO URL HASH ITEM
	 * ----------------------------------*/
	#accordionToUrl(item) {
		const url = item
			.querySelector('.sp-eab-accordion-header-wrapper')
			?.getAttribute('data-slug');
		if (url) {
			const newLink = window.location.href.split('#')[0] + url;
			window.location.href = newLink;
		}
	}
	#accordionOpenByUrl(item) {
		const slug = window.location?.href?.split('#')[1] || '';
		const dataSlug = item
			.querySelector('.sp-eab-accordion-header-wrapper')
			?.getAttribute('data-slug');
		if (dataSlug === `#${slug}`) {
			this.#openAccordionItem(item);
		}
	}
	/* -----------------------------------
	 * APPLY CONTENT ANIMATION
	 * ------------------------------------ */
	#handleContentAnimation(item, action) {
		const effect = this.options.animationEffect;
		const animatedWrapper = item?.querySelector(
			'.sp-eab-accordion-content-wrapper'
		);
		if (!effect || !animatedWrapper) {
			return;
		}
		if (action === 'APPLY') {
			animatedWrapper.classList.add('animated', effect);
		} else if (action === 'REMOVE') {
			animatedWrapper.classList.remove('animated', effect);
		}
	}
}

// ACCORDION SIDEBAR TAB SCRIPT.
class EabTabAccordion extends EabHelpers {
	// EabTabAccordion CLASS CONSTRUCTOR.
	constructor(selectorEl, options = {}) {
		super();
		this.block = selectorEl;
		this.options = Object.assign(
			{
				defaultOpenItem: "first-item",
				selectedItemOpen: 1, // only works when defaultOpenItem ===  open-selected-item;
				activeEvent: "click",
				transitionDuration: 600, // in ms
				autoplayDuration: 3000, // in ms
				scrollToTopOnLoad: false,
				accordionItemToUrl: false,
				contentHeight: 'auto',
				template: '',
			},
			options
		);
		// Elements
		this.headings = this.qsAll(this.headingSelector, this.block);
		this.allContents = this.qsAll('.sp-eab-sidebar-tab-item', this.block);
		this.#initBlock();
	}

	// TAB BLOCK INIT.
	#initBlock() {
		this.headings.forEach((heading, index) => {
			// event listener init.
			const eventListener =
				this.options.activeEvent === 'hover' ? 'mouseenter' : 'click';
			heading.addEventListener(eventListener, () => {
				this.#openTabItem(heading);
			});
			// default open items.
			const itemNumber = index + 1;
			if (
				this.options.defaultOpenItem === 'first-item' &&
				itemNumber === 1
			) {
				this.#openTabItem(heading);
			}
			if (
				this.options.defaultOpenItem === 'open-selected-item' &&
				itemNumber === parseInt(this.options.selectedItemOpen)
			) {
				this.#openTabItem(heading);
			}
		});
		// navigation wrappers.
		if (this.options.contentHeight === 'auto') {
			const contentWrapper = this.qs(
				'.sp-eab-sidebar-tabs-content',
				this.block
			);
			const navWrapper = this.qs('.sp-eab-sidebar-tabs-nav', this.block);
			contentWrapper.style.minHeight = `${navWrapper.offsetHeight}px`;
		}
	}

	#openTabItem(heading) {
		const contentId = heading?.getAttribute('data-tabid');
		if (!contentId) {
			return;
		}
		// heading update.
		this.headings?.forEach((h) => h.classList.remove('eab-expand'));
		heading.classList.add('eab-expand');
		// content update.
		const content = this.qs(`#${contentId}`, this.block);
		this.allContents?.forEach((c) => c.classList.remove('eab-expand'));
		content.classList.add('eab-expand');

		if ('sidebar-tab-accordion-one' === this.options.template) {
			const navWrapper = heading.closest('.sp-eab-sidebar-tabs-nav');
			const contentWrapper = content.closest('.sp-eab-sidebar-tabs-content');
			if (!navWrapper || !contentWrapper) {
				return;
			}
			contentWrapper.style.borderBottomLeftRadius = contentWrapper?.offsetHeight > navWrapper?.offsetHeight ? '' : '0';
		}
	}
}
