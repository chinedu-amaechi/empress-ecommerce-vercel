import { Dashboard } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function SideNavB({ to, text, icon }) {
  const [active, setActive] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === to) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [pathname, to]);
  return (
    
  );
}

export default SideNavList;
