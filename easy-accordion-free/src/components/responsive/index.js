import { dispatch } from "@wordpress/data";
import { Button } from "@wordpress/components";
import { useDeviceType } from "@easy-accordion/controls";
import { DesktopIcon, MobileIcon, TabletIcon } from "./icons";

const Responsive = () => {
	const Device = (e) => {
		const canvas = document.getElementsByClassName("edit-site-visual-editor__editor-canvas");
		if (canvas.length > 0) {
			dispatch("core/edit-site").__experimentalSetPreviewDeviceType(e.target.closest("button").value);
		} else {
			dispatch("core/edit-post").__experimentalSetPreviewDeviceType(e.target.closest("button").value);
		}
	};

	const deviceType = useDeviceType();

	const DeviceIcon = () => {
		if ("Desktop" === deviceType) {
			return <DesktopIcon />;
		}
		if ("Tablet" === deviceType) {
			return <TabletIcon />;
		}
		if ("Mobile" === deviceType) {
			return <MobileIcon />;
		}
	};

	return (
		<div className="sp-eab-responsive-picker">
			<div className="sp-eab-units-indicator">
				<span>
					<DeviceIcon />
				</span>
				<div className="sp-eab-units-btn">
					<Button className={deviceType === "Desktop" ? "active" : ""} value={"Desktop"} onClick={Device}>
						<DesktopIcon />
					</Button>
					<Button className={deviceType === "Tablet" ? "active" : ""} value={"Tablet"} onClick={Device}>
						<TabletIcon />
					</Button>
					<Button className={deviceType === "Mobile" ? "active" : ""} value={"Mobile"} onClick={Device}>
						<MobileIcon />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Responsive;
