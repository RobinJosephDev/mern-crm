import { Link, NavLink, useNavigate } from "react-router-dom";
import { jwtDecode as decodeToken, InvalidTokenError } from "jwt-decode";

interface JwtPayload {
  role: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let role: string | null = null;

  if (token) {
    try {
      const decoded = decodeToken<JwtPayload>(token);
      role = decoded.role;
    } catch (err) {
      if (err instanceof InvalidTokenError) {
        console.error("Invalid token");
      } else {
        console.error(err);
      }
    }
  }

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItemClass = "px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-400 transition whitespace-nowrap";

  const activeClass = "bg-blue-800 text-white font-semibold ring-2 ring-white/60";

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">CRM</h1>

      <div className="flex items-center gap-3">
        <NavLink to="/" className={({ isActive }) => `${menuItemClass} ${isActive ? activeClass : ""}`}>
          Home
        </NavLink>

        {token && (role === "admin" || role === "employee") && (
          <NavLink to="/leads" className={({ isActive }) => `${menuItemClass} ${isActive ? activeClass : ""}`}>
            Leads
          </NavLink>
        )}

        {token && role === "employee" && (
          <NavLink to="/follow-ups" className={({ isActive }) => `${menuItemClass} ${isActive ? activeClass : ""}`}>
            Follow-ups
          </NavLink>
        )}

        {token && role === "admin" && (
          <NavLink to="/leads-with-quotes" className={({ isActive }) => `${menuItemClass} ${isActive ? activeClass : ""}`}>
            Leads with Quotes
          </NavLink>
        )}

        {token && role === "admin" && (
          <NavLink to="/customers" className={({ isActive }) => `${menuItemClass} ${isActive ? activeClass : ""}`}>
            Customers
          </NavLink>
        )}

        {token && (role === "carrier" || role === "customer") && (
          <NavLink to="/shipments" className={({ isActive }) => `${menuItemClass} ${isActive ? activeClass : ""}`}>
            Shipments
          </NavLink>
        )}

        {token && (role === "carrier" || role === "admin") && (
          <NavLink to="/shipments-with-quotes" className={({ isActive }) => `${menuItemClass} ${isActive ? activeClass : ""}`}>
            Shipments with Quotes
          </NavLink>
        )}

        {token && role === "admin" && (
          <NavLink to="/users" className={({ isActive }) => `${menuItemClass} ${isActive ? activeClass : ""}`}>
            Users
          </NavLink>
        )}

        {token ? (
          <button onClick={logout} className="px-3 py-1.5 rounded-md bg-white text-blue-600 hover:bg-gray-200 transition">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className={menuItemClass}>
              Login
            </Link>
            <Link to="/register" className={menuItemClass}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
