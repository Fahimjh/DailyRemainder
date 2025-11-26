
import React from "react";
import "./Footer.css";

const Footer: React.FC = () => (
	<footer className="site-footer">
		<div className="copyright-text">
			&copy; {new Date().getFullYear()} Islamic Companion. All rights reserved. By Fahimjh.
		</div>
	</footer>
);

export default Footer;
