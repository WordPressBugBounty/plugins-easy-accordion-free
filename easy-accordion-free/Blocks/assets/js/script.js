// Product Quantity.
function productQuantity(container = document) {
	container.querySelectorAll('.eab-quantity-input').forEach((input) => {
		input.addEventListener('change', () => {
			const wrapper = input.closest('.eab-product-cart-wrapper');
			if (!wrapper) {
				return;
			}

			const button = wrapper.querySelector('.eab-add-to-cart');
			if (!button) {
				return;
			}

			const quantity = parseInt(input.value, 10) || 1;
			button.dataset.quantity = quantity;
		});
	});
}

// SIDEBAR TABS ACCORDION BLOCK INIT.
document.addEventListener('DOMContentLoaded', () => {
	const tabsBlocks = document.querySelectorAll('.sp-eab-sidebar-tabs');
	if (tabsBlocks?.length > 0) {
		tabsBlocks.forEach((tabAccordion) => {
			const options = tabAccordion.getAttribute('data-tab-settings');
			let parsedOptions = {};
			if (options && options.trim()) {
				try {
					parsedOptions = JSON.parse(options);
				} catch (e) {
					// Invalid JSON, use empty object
					parsedOptions = {};
				}
			}
			new EabTabAccordion(tabAccordion, parsedOptions);
		});
	}
});

document.addEventListener('DOMContentLoaded', () => {
	const accordionWrappers = document.querySelectorAll(
		'.sp-eab-regular-accordion,.sp-eab-post-accordion,.sp-eab-product-accordion'
	);

	if (!accordionWrappers.length) {
		return;
	}

	accordionWrappers.forEach((accordionBlock) => {
		const qs = (s) => accordionBlock.querySelector(s);
		const qsa = (s) => accordionBlock.querySelectorAll(s);

		/* -------------------------
		 * ACCORDION INIT
		 * ------------------------- */
		const initAccordion = () => {
			const el = qs('.sp-eab-accordion');
			if (!el) {
				return null;
			}

			let options = {};
			const attrOptions = el.getAttribute('data-accordion-settings');
			if (attrOptions && attrOptions.trim()) {
				try {
					options = JSON.parse(attrOptions);
				} catch (e) {
					// Invalid JSON, use empty object
					options = {};
				}
			}
			const accordion = new EabAccordion(el, options);

			return accordion;
		};

		let accordion = initAccordion();
	});
});


//Image effect.
const applyEffectClasses = (item, isActive) => {
	const effectType = item.dataset.imageEffect;
	const hoverGrayScale = item.dataset.hoverGrayScale;
	const bgEl = item.querySelector(
		'.sp-eab-accordion-bg,.sp-eab-featured-image-wrapper'
	);

	if (!effectType || !bgEl) {
		return;
	}

	// Remove all effect classes
	item.classList.remove(
		'eab-zoom-out-active',
		'eab-zoom-out-normal',
		'eab-zoom-out-onhover'
	);

	const useHoverGray = hoverGrayScale && !isActive;

	let effectClass = '';

	switch (effectType) {
		case 'zoomOut':
			if (useHoverGray) {
				effectClass = 'eab-zoom-out-normal eab-zoom-out-onhover';
			} else if (isActive) {
				effectClass = 'eab-zoom-out-active';
			} else {
				effectClass = 'eab-zoom-out-normal';
			}
			break;
		default:
			effectClass = '';
	}

	// Apply classes
	if (effectClass) {
		effectClass.split(' ').forEach((cls) => item.classList.add(cls));
	}
};

const getDeviceValuePx = (valueObj, device = 'Desktop', units = false) => {
	if (!valueObj || !valueObj.device || !valueObj.unit) {
		return 0;
	}

	const value = valueObj.device[device];
	const unit = valueObj.unit[device];

	if (value === null) {
		return 0;
	}

	// Return proper string with correct unit
	return unit === '%' && units ? `${value}%` : value;
};

// preloader init.
document.addEventListener('DOMContentLoaded', () => {
	const accordionBlocks = document.querySelectorAll(
		'.sp-easy-accordion-block'
	);
	if (accordionBlocks.length === 0) {
		return;
	}
	accordionBlocks?.forEach((accordion) => {
		/**
		 * Preloader.
		 * Fades out preloader.
		 */
		const preloader = accordion?.querySelector('.sp-eab-preloader');
		if (preloader) {
			// Wait 0.5 seconds before showing fallback.
			setTimeout(() => {
				preloader.classList.remove('sp-d-block');
				preloader.classList.add('sp-d-hidden');
				accordion.classList.add('sp-eab-preloader-removed');
			}, 500);
		}
	});
});

document.addEventListener('DOMContentLoaded', () => {
	const accordions = Array.from(
		document.querySelectorAll(
			'.sp-eab-image-accordion,.sp-eab-product-accordion'
		)
	);

	accordions.forEach((accordion) => {
		const items = Array.from(
			accordion.querySelectorAll('.sp-eab-image-accordion-item')
		);
		if (!items.length) {
			return;
		}

		// --- Read data attributes ---
		const defaultOpen = accordion.dataset.defaultOpen || 'first-item';
		const activeEvent = accordion.dataset.activeEvent || 'click';
		const selectedIndex =
			parseInt(accordion.dataset.selectedAccordion, 10) - 1;
		const scrollToActive = accordion.dataset.scrollToActiveItem;
		const accessibility = accordion.dataset.eabAccessibility;
		const itemToUrl = accordion.dataset.anchorLink;
		const autoInterval = accordion.dataset.autoplayDelay;
		const animation =
			accordion.dataset.animation &&
				accordion.dataset.animation !== 'none'
				? accordion.dataset.animation
				: null;

		let activeIndex = -1;
		let intervalRef = null;

		const applyAnimation = (item, isActive) => {
			const content = item.querySelector('.eab-animation');
			if (content) {
				// Only apply animation if it's not 'none'
				if (animation && animation !== 'none') {
					// Remove previous animation classes
					content.classList.remove('animated', animation);
					if (isActive) {
						content.classList.add('animated', animation);
					}
				}
			}
		};

		const updateAccessibility = () => {
			if (!accessibility) {
				return;
			}
			items.forEach((item, index) => {
				const isActive = index === activeIndex;
				const button = item.querySelector('.sp-eab-accordion-bg');

				item.setAttribute('role', 'region');
				if (button) {
					button.setAttribute('role', 'button');
					button.setAttribute('tabindex', '0');
					button.setAttribute(
						'aria-expanded',
						isActive ? 'true' : 'false'
					);
					button.setAttribute(
						'aria-label',
						(
							item.querySelector('.sp-eab-image-title')
								?.textContent || ''
						)
							.replace(/\s+/g, ' ')
							.trim()
					);
				}
			});
		};

		// --- Helper: set active item ---
		let allowUrlUpdate = false; // URL updates blocked until first open

		const setActiveItem = (index, shouldScroll = false) => {
			items.forEach((item, i) => {
				const isActive = i === index;
				if (
					!(
						accordion.classList.contains(
							'sp-eab-accordion-slider'
						) || accordion.classList.contains('sp-eab-carousel')
					)
				) {
					item.classList.toggle('active', isActive);
				}
				applyEffectClasses(item, isActive);
				applyAnimation(item, isActive);
			});

			const previousIndex = activeIndex;
			activeIndex = index;
			updateAccessibility();

			// --- URL update logic ---
			const activeItem = items[index];
			if (activeItem && itemToUrl) {
				const slug = activeItem.getAttribute('data-slug');
				if (slug && allowUrlUpdate && previousIndex !== index) {
					const base = window.location.href.split('#')[0];
					history.replaceState(null, '', base + slug);
				}
			}

			// Scroll
			if (shouldScroll && scrollToActive && items[index]) {
				items[index].scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'nearest',
				});
			}

			// After first active item: allow URL updates
			allowUrlUpdate = true;
		};

		// --- Keyboard navigation ---
		if (accessibility) {
			items.forEach((item, index) => {
				const button = item.querySelector('.sp-eab-accordion-bg');
				if (!button) {
					return;
				}

				button.addEventListener('keydown', (e) => {
					switch (e.key) {
						case 'ArrowRight':
						case 'ArrowDown':
							setActiveItem(
								(activeIndex + 1) % items.length,
								true
							);
							items[activeIndex % items.length]
								.querySelector('.sp-eab-accordion-bg')
								?.focus();
							e.preventDefault();
							break;
						case 'ArrowLeft':
						case 'ArrowUp':
							setActiveItem(
								(activeIndex - 1 + items.length) % items.length,
								true
							);
							items[activeIndex % items.length]
								.querySelector('.sp-eab-accordion-bg')
								?.focus();
							e.preventDefault();
							break;
						case 'Enter':
						case ' ':
							setActiveItem(index, true);
							e.preventDefault();
							break;
					}
				});
			});
		}

		let isHashOpen = false;
		const currentHash = window.location.hash;

		if (currentHash && itemToUrl) {
			const matchedIndex = items.findIndex(
				(item) => item.getAttribute('data-slug') === currentHash
			);

			if (matchedIndex >= 0) {
				isHashOpen = true;
				activeIndex = matchedIndex;

				// Open from URL but DO NOT update URL again
				setTimeout(() => {
					setActiveItem(matchedIndex, true);
				}, 50);
			}
		}

		if (!isHashOpen) {
			switch (defaultOpen) {
				case 'first-item':
					activeIndex = 0;
					break;
				case 'close-all':
					activeIndex = -1;
					break;
				case 'open-selected-item':
					activeIndex =
						selectedIndex >= 0 && selectedIndex < items.length
							? selectedIndex
							: 0;
					break;
				default:
					activeIndex = 0;
			}

			if (activeIndex >= 0) {
				setTimeout(() => setActiveItem(activeIndex, true), 300);
			}
		}

		// --- Auto-play logic ---
		let autoPlayIntervalRef = null;
		let isPaused = false;

		// --- Start / Resume autoplay ---
		const startAutoPlay = () => {
			clearInterval(autoPlayIntervalRef);
			if (items.length <= 1 || isPaused) {
				return;
			}
			autoPlayIntervalRef = setInterval(() => {
				const nextIndex = (activeIndex + 1) % items.length;
				setActiveItem(nextIndex, true);
			}, autoInterval);
		};

		// --- Pause autoplay ---
		const pauseAutoplay = () => {
			isPaused = true;
			clearInterval(autoPlayIntervalRef);
		};

		// --- Resume autoplay ---
		const resumeAutoplay = () => {
			if (!isPaused) {
				return;
			}
			isPaused = false;
			startAutoPlay();
		};

		if (activeEvent === 'auto') {
			startAutoPlay();
			accordion.addEventListener('mouseenter', pauseAutoplay);
			accordion.addEventListener('mouseleave', resumeAutoplay);
		}

		// --- Click / Hover Event handling ---
		const eventType = activeEvent === 'hover' ? 'mouseenter' : 'click';

		items.forEach((item, index) => {
			item.addEventListener(eventType, () => {
				if (defaultOpen === 'close-all' && activeIndex === index) {
					// Only remove active class if NOT slider
					if (
						!(
							accordion.classList.contains(
								'sp-eab-accordion-slider'
							) || accordion.classList.contains('sp-eab-carousel')
						)
					) {
						item.classList.remove('active');
					}
					applyEffectClasses(item, false);
					activeIndex = -1;
					updateAccessibility();
				} else {
					setActiveItem(index, true);
				}

				// Restart autoplay if enabled
				if (activeEvent === 'auto') {
					startAutoPlay();
				}
			});
		});
	});

	// Add scripts for variation.
	productQuantity();
});

const animateAccordionItemsOnView = (items, animationClass = 'none') => {
	if (!animationClass || animationClass.toLowerCase() === 'none') {
		return;
	}
	if (!('IntersectionObserver' in window)) {
		// Fallback: animate immediately if IntersectionObserver not supported
		items.forEach((item) => {
			item.classList.add('animated', animationClass);
		});
		return;
	}

	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('animated', animationClass);
					// Stop observing after animation
					obs.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.2, // Trigger when 20% of the item is visible
		}
	);

	items.forEach((item) => observer.observe(item));
};

// reload screen on resize tablet-or-desktop to mobile.
document.addEventListener('DOMContentLoaded', () => {
	if (window?.elementorFrontend?.isEditMode()) {
		return;
	}
	// Function to determine the device category.
	const getDeviceType = () => {
		const width = window.innerWidth;
		if (width <= 600) {
			return 'mobile';
		}
		return 'tablet-or-desktop';
	};

	// Track initial device type
	let currentDevice = getDeviceType();

	window.addEventListener('resize', () => {
		const newDevice = getDeviceType();
		// Reload only if switching between mobile and tablet/desktop
		if (newDevice !== currentDevice) {
			location.reload();
		}

		// Update the current device type
		currentDevice = newDevice;
	});
});
