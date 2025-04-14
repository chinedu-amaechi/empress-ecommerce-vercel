import { Outlet } from "react-router-dom";

import SideNav from "./SideNav";
import ProtectedRoutes from "./ProtectedRoutes";

function AppLayout() {
  return (
    <ProtectedRoutes>
      <div className="flex h-dvh w-full bg-[#ebebeb] text-[#000814]">
        <SideNav />
        <main className="h-full flex-1 overflow-y-scroll px-6 py-8">
          <Outlet />
        </main>
      </div>
    </ProtectedRoutes>
  );
}

export default AppLayout;
