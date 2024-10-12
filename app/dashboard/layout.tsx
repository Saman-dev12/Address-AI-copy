import SideNav from "./components/side-nav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <SideNav />
      <div className="flex-grow lg:ml-72 p-4 lg:p-8">{children}</div>
    </div>
  );
};

export default DashboardLayout;