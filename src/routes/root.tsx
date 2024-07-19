import { Link, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div id={"sidebar"}>
        <h1>KPI Dashboard</h1>
        <nav>
          <ul>
            <li>
              <Link to={`/data`}>Data</Link>
            </li>
            <li>
              <Link to={`/kpi-builder`}>KPI Builder</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
