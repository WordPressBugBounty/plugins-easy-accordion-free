import { useContext } from "@wordpress/element";
import { TogglePanelBodyContext } from "../context";

const useTogglePanelBody = () => {
	return useContext(TogglePanelBodyContext);
};

export default useTogglePanelBody;
