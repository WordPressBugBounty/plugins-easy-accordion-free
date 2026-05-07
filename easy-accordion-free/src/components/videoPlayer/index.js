import { memo } from "@wordpress/element";
import "./editor.scss";

function getVideoId(url) {
	const regex = /(?:youtube\.com\/(?:.*[?&]v=|v\/|embed\/)|youtu\.be\/)([^"&?\/ ]{11})/;
	const match = url?.match(regex);
	return match ? match[1] : null;
}

const VideoPlayer = ({ videoType, bgVideo, youtubeVideo }) => {
	let id = "";

	if (videoType === "youtube") {
		id = getVideoId(youtubeVideo);
	}

	return (
		<div className="sp-eab-video-player sp-w-full">
			{videoType === "html5" && (
				<video autoPlay muted loop key={bgVideo?.url}>
					<source src={bgVideo?.url} type="video/mp4" />
				</video>
			)}
			{videoType === "youtube" && (
				<iframe
					key={id}
					width="100%"
					height="500px"
					src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1`}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
			)}
		</div>
	);
};

export default memo(VideoPlayer);
