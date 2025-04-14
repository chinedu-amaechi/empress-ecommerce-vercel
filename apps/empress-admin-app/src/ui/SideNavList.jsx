import { Dashboard } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function SideNavList({ to, text, icon: IconComponent }) {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setActive(pathname === to);
  }, [pathname, to]);

  return (
    <li
      className="w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NavLink
        to={to}
        className={`font-montserrat flex items-center gap-2 rounded-sm p-3 text-sm text-white transition-all ${active || hovered ? "bg-[#003566] text-[#FFC300]" : "hover:bg-[#003566] hover:text-[#FFC300]"}`}
      >
        {IconComponent ? (
          <IconComponent
            sx={{
              color: active || hovered ? "#FFC300" : "white",
              width: "24px",
              transition: "color 0.3s, transform 0.3s",
              transform: hovered ? "rotate(60deg)" : "rotate(0deg)",
            }}
          />
        ) : (
          <Dashboard
            sx={{
              color: active || hovered ? "#FFC300" : "white",
              width: "24px",
              transition: "color 0.3s, transform 0.3s",
              transform: hovered ? "rotate(60deg)" : "rotate(0deg)",
            }}
          />
        )}
        {text}
      </NavLink>
    </li>
  );
}

export default SideNavList;
