import { __ } from "@wordpress/i18n";
import { memo, useMemo, useState } from "@wordpress/element";

//Render star ratings
const renderStars = (rating = 0) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<>
			{Array(fullStars)
				.fill()
				.map((_, i) => (
					<span key={`full-${i}`} className="eab-star full">
						★
					</span>
				))}
			{hasHalfStar && <span className="eab-star half">★</span>}
			{Array(emptyStars)
				.fill()
				.map((_, i) => (
					<span key={`empty-${i}`} className="eab-star empty">
						★
					</span>
				))}
		</>
	);
};

const QuantityInput = ({ value, onChange, min = 1 }) => {
	return (
		<div className="eab-quantity">
			<input
				type="number"
				min={min}
				value={value}
				onChange={(e) => onChange(Math.max(min, Number(e.target.value)))}
				className="eab-quantity-input"
			/>
		</div>
	);
};

/**
 * Product Review Component
 */
export const ReviewData = memo(({ product }) => {
	if (!product?.average_rating || !product?.review_count) {
		return null;
	}

	return (
		<div className="eab-product-review">
			<div className="eab-stars">{renderStars(Number(product.average_rating))}</div>
			<span className="eab-review-text">({product?.review_count} reviews)</span>
		</div>
	);
});

/**
 * Product Price Component
 */
export const PriceData = memo(({ product }) => {
	if (!product?.product_price) {
		return null;
	}

	return (
		<div
			className={`eab-product-price eab-price-${product.type || "simple"}`}
			dangerouslySetInnerHTML={{ __html: product.product_price }}
		/>
	);
});

/**
 * Add To Cart Button Component
 */
export const AddToCartButton = memo(({ product, label, template = "" }) => {
	const [quantity, setQuantity] = useState(1);

	if (!product) {
		return null;
	}

	// -----------------------------
	// Variable Product
	// -----------------------------
	if (product.type === "variable") {
		return (
			<div className="eab-product-cart-wrapper">
				<a href="undefined" target="_blank" rel="noopener noreferrer" className="button eab-add-to-cart">
					{product.button_text || __("Select Options", "easy-accordion-free")}
				</a>
			</div>
		);
	}

	// -----------------------------
	// Grouped Product
	// -----------------------------
	if (product.type === "grouped") {
		return (
			<div className="eab-product-cart-wrapper">
				<a href="undefined" className="button eab-add-to-cart">
					{__("View products", "easy-accordion-free")}
				</a>
			</div>
		);
	}

	// -----------------------------
	// External Product
	// -----------------------------
	if (product.type === "external") {
		return (
			<div className="eab-product-cart-wrapper">
				<a href="undefined" target="_blank" rel="noopener noreferrer" className="button eab-add-to-cart">
					{product.button_text || __("Buy now", "easy-accordion-free")}
				</a>
			</div>
		);
	}

	// -----------------------------
	// Simple Product (AJAX + Quantity)
	// -----------------------------
	return (
		<div className="eab-product-cart-wrapper">
			{template !== "product-accordion-two" && <QuantityInput value={quantity} onChange={setQuantity} />}

			<a
				href="undefined"
				data-product_id={product.post_id}
				data-quantity={quantity}
				className="button add_to_cart_button ajax_add_to_cart eab-add-to-cart"
			>
				{label || __("Add to cart", "easy-accordion-free")}
			</a>
		</div>
	);
});

export const ProductName = memo(({ titleData }) => {
	const { title = "", accordionTitleTag = "h3" } = titleData || {};

	// Dynamic heading tag
	const TitleTag = accordionTitleTag;

	return <TitleTag className="eab-product-title">{title}</TitleTag>;
});
