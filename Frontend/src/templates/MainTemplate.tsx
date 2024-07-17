import {
  GcdsFooter,
  GcdsHeader,
  GcdsNavLink,
  GcdsTopNav,
} from "@cdssnc/gcds-components-react";
import { ReactNode } from "react";

interface AppProps {
  currentPage?: "register" | "signin";
  children?: ReactNode;
  addMargins? : boolean;
}

function MainTemplate({ currentPage, children, addMargins }: AppProps) {
  addMargins = addMargins ?? true;

  return (
    <div>
      <GcdsHeader langHref="#" skipToHref="#">
        <GcdsTopNav slot="menu" label="Top navigation" alignment="right">
          <GcdsNavLink href="/" slot="home">
            Portable Asset Locator
          </GcdsNavLink>
          <GcdsNavLink
            style={{
              fontSize: "20px",
              fontFamily: "Noto sans, sans-serif",
              paddingBottom: currentPage === "signin" ? "2px" : "0",
            }}
            current={currentPage === "signin"}
            href="/signin"
          >
            Sign-in
          </GcdsNavLink>
          <GcdsNavLink
            style={{
              fontSize: "20px",
              fontFamily: "Noto sans, sans-serif",
              paddingBottom: currentPage === "register" ? "2px" : "0",
            }}
            current={currentPage === "register"}
            href="/register"
          >
            Register
          </GcdsNavLink>
        </GcdsTopNav>
      </GcdsHeader>

      <div
        aria-label="content"
        style={{
          marginLeft: addMargins ? "11.3%" : 0,
          marginTop: addMargins ? "60px" : 0,
        }}
      >
        {children}
      </div>

      <GcdsFooter
        display="compact"
        contextualHeading="Portable Asset Locator"
        contextualLinks='{ "Home": "/", "About": "#" }'
      />
    </div>
  );
}

export default MainTemplate;
