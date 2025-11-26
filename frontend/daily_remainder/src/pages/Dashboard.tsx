import React from "react";

import BackHomeButton from "../components/BackHomeButton";

const Dashboard: React.FC = () => {
  return (
    <div className="container dashboard">
      <BackHomeButton />
      <h2>Dashboard</h2>
      <p>Welcome to your Al-Mudhakkirah – The Daily Islamic Reminder dashboard. Use the menu to access features.</p>
    </div>
  );
};

export default Dashboard;
