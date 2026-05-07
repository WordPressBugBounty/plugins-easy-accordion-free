export const RightSymbolIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="none">
		<g clipPath="">
			<path
				fill="#fff"
				d="M6.028 0H6a6.03 6.03 0 0 0-4.817 2.422A5.95 5.95 0 0 0 0 6c0 1.146.324 2.26.938 3.221a6.017 6.017 0 0 0 2.434 2.174A5.942 5.942 0 0 0 6 12H6.028C9.32 11.984 12 9.292 12 6S9.32.016 6.028 0Zm3.55 4.727L5.815 8.492a.857.857 0 0 1-1.22 0L2.42 6.318a.865.865 0 0 1 .61-1.473c.231 0 .448.09.611.253l1.564 1.564 3.154-3.154a.857.857 0 0 1 .61-.253c.23 0 .447.09.61.253.163.163.253.38.253.61 0 .23-.09.447-.253.61Z"
			/>
			<path
				fill="#fff"
				d="M9.579 4.727 5.814 8.492a.857.857 0 0 1-1.22 0L2.42 6.318a.865.865 0 0 1 .61-1.473c.231 0 .448.09.611.253l1.564 1.564 3.154-3.154a.857.857 0 0 1 .61-.253c.23 0 .447.09.61.253.163.163.253.38.253.61 0 .23-.09.447-.253.61Z"
			/>
			<path
				fill="#1A74E4"
				d="M6.028 0H6a6.03 6.03 0 0 0-4.817 2.422A5.95 5.95 0 0 0 0 6c0 1.146.324 2.26.938 3.221a6.017 6.017 0 0 0 2.434 2.174A5.942 5.942 0 0 0 6 12H6.028C9.32 11.984 12 9.292 12 6S9.32.016 6.028 0Zm3.55 4.727L5.815 8.492a.857.857 0 0 1-1.22 0L2.42 6.318a.865.865 0 0 1 .61-1.473c.231 0 .448.09.611.253l1.564 1.564 3.154-3.154a.857.857 0 0 1 .61-.253c.23 0 .447.09.61.253.163.163.253.38.253.61 0 .23-.09.447-.253.61Z"
			/>
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M0 0h12v12H0z" />
			</clipPath>
		</defs>
	</svg>
);

//component Reset Icon.
export const ResetIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width={14} height={14} viewBox="0 0 14 14" fill="none">
		<g clipPath="url(#clip0_13968_266e)">
			<path
				d="M2.26612 4.11595C3.37829 2.2925 5.49847 1.20166 7.74998 1.50927C10.7824 1.92355 12.9048 4.71765 12.4905 7.75006C12.0762 10.7825 9.2821 12.9049 6.24972 12.4906C3.99821 12.183 2.24836 10.5634 1.66601 8.5085M2.02244 2.49303L2.04627 4.36557L3.84791 4.2143"
				stroke="#949494"
				strokeWidth={1.75}
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="transparent"
			/>
		</g>
		<defs>
			<clipPath id="clip0_13968_266e">
				<rect width={14} height={14} fill="white" />
			</clipPath>
		</defs>
	</svg>
);

export const BorderIcon = ({ color = "#2F2F2F" }) => (
	<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M11.8337 1.25H5.47697C5.21957 0.521755 4.52505 0 3.70866 0C2.89227 0 2.19775 0.521755 1.94035 1.25H0.166992V2.5H1.94035C2.19775 3.22825 2.89227 3.75 3.70866 3.75C4.52505 3.75 5.21957 3.22825 5.47697 2.5H11.8337V1.25Z"
			fill={color}
		/>
		<path
			d="M11.8337 7.5H10.0603C9.8029 6.77175 9.10838 6.25 8.29199 6.25C7.47561 6.25 6.78108 6.77175 6.52368 7.5H0.166992V8.75H6.52368C6.78108 9.47824 7.47561 10 8.29199 10C9.10838 10 9.8029 9.47824 10.0603 8.75H11.8337V7.5Z"
			fill={color}
		/>
	</svg>
);

export const AlignLeft = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
		<path fill="#2F2F2F" stroke="#757575" d="M8.4 14.8v.5H.5v-.5h7.9ZM.5 1.2V.7h7.9v.5H.5Zm15 7H.5v-.5h15v.5Z" />
	</svg>
);

export const AlignCenter = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
		<path
			fill="#2F2F2F"
			stroke="#757575"
			d="M12.4 1.2v.5H3.6v-.5h8.8ZM15.5 8H.5v-.5h15v.5ZM3.6 14.8v.5h8.8v-.5H3.6Z"
		/>
	</svg>
);

export const AlignRight = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width={80} height={24} fill="none">
		<path
			fill="#2F2F2F"
			stroke="#757575"
			d="M47.5 18.8v.5h-7.9v-.5h7.9Zm0-13.6h-7.9v-.5h7.9v.5Zm0 6.6v.5h-15v-.5h15Z"
		/>
	</svg>
);

export const CategoryIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
		<g fill="#FF5B2E" clipPath="url(#eabcategoryIcon)">
			<path d="M.5 4.015a.5.5 0 0 0-.5.5v7.03a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-7.03a.5.5 0 0 0-.5-.5H.5Zm14.527 6.497a.5.5 0 0 1-.5.5H1.534a.5.5 0 0 1-.5-.5V7.496a.5.5 0 0 1 .5-.5h12.993a.5.5 0 0 1 .5.5v3.016ZM0 .5A.5.5 0 0 1 .5 0h15a.5.5 0 0 1 .5.5v1.981a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5V.5ZM0 13.519a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 .5.5V15.5a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-1.981Z" />
		</g>
		<defs>
			<clipPath id="eabcategoryIcon">
				<path fill="#fff" d="M0 0h16v16H0z" />
			</clipPath>
		</defs>
	</svg>
);
