import { Link } from "react-router-dom";
import MainTemplate from "../templates/MainTemplate";
import { GcdsHeading } from "@cdssnc/gcds-components-react";

function Dashboard() {
  return (
    <MainTemplate addMargins={false}>
      <GcdsHeading tag="h1">Dashboard</GcdsHeading>
      <div>
        <Link to="/">Home</Link>
      </div>
    </MainTemplate>
  );
}

export default Dashboard;
