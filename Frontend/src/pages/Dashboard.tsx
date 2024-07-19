import { Link } from "react-router-dom";
import MainTemplate from "../templates/MainTemplate";
import { GcdsHeading } from "@cdssnc/gcds-components-react";
import MessageDisplay from '../components/MessageDisplay';

function Dashboard() {
  return (
    <MainTemplate addMargins={false}>
      <GcdsHeading tag="h1">Dashboard</GcdsHeading>
      <div>
        <Link to="/">Home</Link>
      </div>
            <div>
                <MessageDisplay />
            </div>
    </MainTemplate>
  );
}

export default Dashboard;
