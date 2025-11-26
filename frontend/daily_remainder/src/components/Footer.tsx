
import React from "react";
import "./Footer.css";

const Footer: React.FC = () => (
	<footer className="site-footer">
		<div className="copyright-text">
			&copy; {new Date().getFullYear()} Al-Mudhakkirah – The Daily Islamic Reminder. All rights reserved By Fahimjh.
		</div>
	</footer>
);

export default Footer;
