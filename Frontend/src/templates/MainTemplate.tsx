/**
 * MainTemplate: Common template for standard site pages, containing the header, footer
 * and a slot for the page content.
 */

import {
  GcdsFooter,
  GcdsHeader,
  GcdsNavLink,
  GcdsTopNav,
} from "@cdssnc/gcds-components-react";
import { ReactNode } from "react";

interface AppProps {
  /**
   * Name of the current page.
   */
  currentPage?:
    | "register"
    | "signin"
    | "unassigned-assets"
    | "team-assets"
    | "my-assets";

  /**
   * Whether the user is currently logged in.
   */
  loggedIn?: boolean;

  /**
   * The type of user - Employee or Custodian.
   */
  userType?: "employee" | "custodian";

  /**
   * The page content, to be placed into the slot.
   */
  children?: ReactNode;

  /**
   * Whether top margins should be applied to the content section exterior.
   * Default will be 'true'.
   */
  addMargins?: boolean;
}

function MainTemplate({
  currentPage,
  loggedIn,
  userType,
  children,
  addMargins,
}: AppProps) {
  addMargins = addMargins ?? true;
  userType = userType ?? "employee";

  return (
    <div>
      <GcdsHeader langHref="#" skipToHref="#">
        <GcdsTopNav slot="menu" label="Top navigation" alignment="right">
          <GcdsNavLink href="/" slot="home">
            Portable Asset Locator
          </GcdsNavLink>

          {/* Links for non-logged in users */}
          {!loggedIn && (
            <>
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
            </>
          )}

          {/* Links for logged-in people. Placeholders for now. TODO: Implement. */}
          {loggedIn && (
            <>
              <GcdsNavLink
                style={{
                  fontSize: "20px",
                  fontFamily: "Noto sans, sans-serif",
                  paddingBottom:
                    currentPage === "unassigned-assets" ? "2px" : "0",
                }}
                current={currentPage === "unassigned-assets"}
                href="/"
              >
                Unassigned Assets
              </GcdsNavLink>
              {userType === "custodian" && (
                <GcdsNavLink
                  style={{
                    fontSize: "20px",
                    fontFamily: "Noto sans, sans-serif",
                    paddingBottom: currentPage === "team-assets" ? "2px" : "0",
                  }}
                  current={currentPage === "team-assets"}
                  href="/"
                >
                  Team Assets
                </GcdsNavLink>
              )}
              <GcdsNavLink
                style={{
                  fontSize: "20px",
                  fontFamily: "Noto sans, sans-serif",
                  paddingBottom: currentPage === "my-assets" ? "2px" : "0",
                }}
                current={currentPage === "my-assets"}
                href="/"
              >
                My Assets
              </GcdsNavLink>
              <GcdsNavLink
                style={{
                  fontSize: "20px",
                  fontFamily: "Noto sans, sans-serif",
                }}
                href="/"
              >
                Sign out
              </GcdsNavLink>
            </>
          )}
        </GcdsTopNav>
      </GcdsHeader>

      <div
        aria-label="content"
        style={{
          marginTop: addMargins ? "60px" : 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            maxWidth: "90%",
            textAlign: "left",
          }}
        >
          {children}
        </div>
      </div>

      <GcdsFooter
        display="compact"
        contextualHeading="Portable Asset Locator"
        contextualLinks='{ "Home": "/", "About": "#" }'
        style={{ textAlign: "start" }}
      />
    </div>
  );
}

export default MainTemplate;
