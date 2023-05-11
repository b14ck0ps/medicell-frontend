"use client";
import withAuth from './withAuth';

const DashboardPage: React.FC = () => {
  return <div>Dashboard Page</div>;
};

export default withAuth(DashboardPage);