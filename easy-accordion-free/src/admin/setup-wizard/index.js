import { __ } from "@wordpress/i18n";
import { useRef, useState } from "@wordpress/element";
import { LeftArrow, RightArrow, RightArrowLong, TickIcon } from "./icons";
import { Toaster } from "react-hot-toast";
import WelcomePage from "../pages/welcome";
import BlocksSetup from "../pages/setup";
import FinishPage from "../pages/finish";

const SetupWizard = () => {
	const footer = document.querySelector("#wpfooter");
	if (footer) {
		footer.style.display = "none";
	}
	const nextBtnRef = useRef(null);
	const [stepNumber, setStepNumber] = useState(0);
	const [isExiting, setIsExiting] = useState(false);
	const [direction, setDirection] = useState("left");
	const [animationClass, setAnimationClass] = useState("");
	// steps.
	let setupSteps = ["Welcome", "Blocks", "Finish"];

	const onAnimationEnd = () => {
		if (!isExiting) {
			return;
		}
		if (direction === "left") {
			setStepNumber((prev) => prev + 1);
		} else {
			setStepNumber((prev) => prev - 1);
		}
		setAnimationClass("is-entering");
		setIsExiting(false);
	};

	const nextStep = () => {
		setDirection("left");
		setIsExiting(true);
		setAnimationClass("is-exiting");
	};

	const handleNext = () => {
		nextStep();
	};

	const handlePrev = () => {
		setDirection("right");
		setIsExiting(true);
		setAnimationClass("is-exiting");
	};
	return (
		<div className="sp-eab-admin-dashboard-container">
			<div className="sp-eap-setup-wizard-wrapper sp-d-flex sp-flex-col sp-align-center sp-justify-center">
				<div className="sp-eap-setup-wizard-content sp-d-flex sp-flex-col sp-align-center sp-justify-center">
					<div className="sp-eap-setup-steps">
						{setupSteps?.map((step, index) => (
							<div key={index} className="sp-eap-setup-step sp-d-flex sp-align-center">
								<span
									className={`sp-eap-setup-step-number sp-d-flex sp-align-center sp-justify-center${`${index === stepNumber ? " active" : ""}`}${`${index < stepNumber ? " previous" : ""}`}`}
								>
									{index < stepNumber ? <TickIcon /> : "0" + (index + 1)}
								</span>
								<span className="sp-eap-setup-step-title">{step}</span>
								{index !== setupSteps.length - 1 && <RightArrowLong />}
							</div>
						))}
					</div>
					<div className={`sp-eap-setup-step-page ${animationClass}`} onAnimationEnd={onAnimationEnd}>
						{setupSteps[stepNumber] === "Welcome" && <WelcomePage />}
						{setupSteps[stepNumber] === "Blocks" && <BlocksSetup />}
						{setupSteps[stepNumber] === "Finish" && <FinishPage />}
					</div>
					<div className="sp-eap-setup-wizard-btn-wrapper sp-d-flex">
						{stepNumber !== 0 && stepNumber !== setupSteps.length - 1 && (
							<button className="sp-eap-setup-wizard-nav-btn prev-btn" onClick={handlePrev}>
								<LeftArrow />
								{__("Previous", "easy-accordion-free")}
							</button>
						)}

						{stepNumber === 0 && (
							<a
								className="sp-eap-setup-wizard-nav-btn prev-btn"
								href={`${sp_eab_admin_dashboard_localize?.homeUrl}wp-admin/admin.php?page=eap_dashboard`}
							>
								{"Skip it"}
							</a>
						)}
						{stepNumber !== setupSteps.length - 1 && (
							<button
								className="sp-eap-setup-wizard-nav-btn next-btn"
								onClick={handleNext}
								ref={nextBtnRef}
							>
								{__("Next Step", "easy-accordion-free")}
								<RightArrow />
							</button>
						)}
					</div>
				</div>
				<img
					className="setup-wizard-bg"
					src={`${sp_eab_admin_dashboard_localize?.pluginUrl}admin/img/setup-wizard/setup-wizard-bg.svg`}
					alt="setup wizard"
				/>
				<Toaster
					position="top-right"
					toastOptions={{
						style: {
							padding: "16px 24px",
							fontSize: "18px",
							borderRadius: "10px",
							maxWidth: "400px",
						},
					}}
				/>
			</div>
		</div>
	);
};

export default SetupWizard;
