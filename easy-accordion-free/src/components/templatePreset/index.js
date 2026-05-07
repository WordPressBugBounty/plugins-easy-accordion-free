import { memo } from "@wordpress/element";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import "./editor.scss";

const TemplatePresetSlider = ({ items, label = "", attributes, setAttributes, attributesKey }) => {
	const activeSlide = items?.findIndex((item) => item?.value === attributes);
	const onPresetSlideChange = (activeIndex) => {
		const updatedPresets = items[activeIndex]?.value;
		if (updatedPresets === "vertical-six") {
			setAttributes({ toggleIconPosition: "start" });
		}
		setAttributes({
			[attributesKey]: updatedPresets,
		});
	};

	return (
		<div className="sp-eab-layout-preset-slider-component sp-eab-component-mb">
			<div className="sp-eab-component-title-wrapper sp-mb-8px">
				<span className="sp-eab-component-title">{label}</span>
			</div>
			<Swiper
				pagination={{ clickable: true }}
				navigation={true}
				modules={[Pagination, Navigation]}
				className="mySwiper sp-eab-layout-picker-swiper"
				initialSlide={activeSlide}
				onSlideChange={(e) => onPresetSlideChange(e.activeIndex)}
				key={activeSlide}
			>
				{items?.map(({ Icon }, i) => (
					<SwiperSlide key={i}>
						<div className="sp-eab-preset-image sp-d-flex sp-justify-center">
							<Icon />
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};

export default memo(TemplatePresetSlider);
