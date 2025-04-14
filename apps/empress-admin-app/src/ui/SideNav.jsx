import {
  Category,
  Chat,
  Close,
  Dashboard,
  DriveEta,
  Inventory2,
  Logout,
  Menu,
  People,
  Settings,
} from "@mui/icons-material";
import SideNavList from "./SideNavList";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function SideNav() {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showMobileSidebar, setMobileShowSidebar] = useState(false);

  useEffect(() => {
    function handleResize() {
      window.addEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
      return () => {
        window.removeEventListener("resize", () => {
          setWindowWidth(window.innerWidth);
        });
      };
    }
    handleResize();
  }, []);

  function handleLogout() {
    setUser(null);
    sessionStorage.removeItem("token");
    navigate("/login");
  }

  const navLinks = (
    <>
      <div>
        <div className="flex h-20 items-center justify-center gap-2 text-white">
          <img src="./empress-logo.png" alt="Empress logo" className="w-14" />
          <span className="text-2xl font-bold tracking-wider">Empress</span>
        </div>
        <nav>
          <ul className="flex flex-col gap-0.5">
            <SideNavList to="/" text="Dashboard" icon={Dashboard} />
            <SideNavList to="/customers" text="Customers" icon={People} />
            <SideNavList to="/products" text="Products" icon={Inventory2} />
            <SideNavList to="/collections" text="Collections" icon={Category} />
            <SideNavList to="/orders" text="Orders" icon={DriveEta} />
            <SideNavList to="/messsages" text="Messages" icon={Chat} />
          </ul>
        </nav>
      </div>
      <div>
        <ul>
          <SideNavList to="/settings" text="Settings" icon={Settings} />
          <li className="w-full">
            <button
              className={`font-montserrat flex w-full items-center gap-2 rounded-sm p-3 text-sm text-white transition-all hover:bg-[#003566] hover:text-[#FFC300]`}
              onClick={handleLogout}
            >
              <Logout sx={{ color: "white", width: "24px" }} /> Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );

  const mobileSidebar = !showMobileSidebar ? (
    <div
      className="fixed top-1 left-2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#001D3D]"
      onClick={() => setMobileShowSidebar(true)}
    >
      <Menu sx={{ color: "white" }} />
    </div>
  ) : (
    <div className="fixed top-0 left-0 z-30 h-full w-full bg-black/30">
      <div
        className="fixed top-1 left-2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#001D3D]"
        onClick={() => setMobileShowSidebar(false)}
      >
        <Close sx={{ color: "white" }} />
      </div>
      <aside className="flex h-full w-60 flex-col justify-between bg-[#001D3D] p-2">
        {navLinks}
      </aside>
    </div>
  );

  // const desktopSidebar = (
  //   <aside className="h-full w-64 bg-linear-to-t from-[#1E3E62] to-[#3C4048] p-2">
  //     <nav>{navLinks}</nav>
  //   </aside>
  // );

  if (windowWidth < 768) {
    return mobileSidebar;
  }

  return (
    <aside className="flex h-full w-60 flex-col justify-between bg-[#001D3D] p-2">
      {navLinks}
    </aside>
  );
}

export default SideNav;
