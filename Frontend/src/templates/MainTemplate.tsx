/**
 * MainTemplate: Common template for standard site pages, containing the header, footer
 * and a slot for the page content.
 */

import {
  GcdsContainer,
  GcdsFooter,
  GcdsHeader,
  GcdsNavLink,
  GcdsText,
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
    <GcdsContainer size="full" centered>
      <GcdsHeader langHref="#" skipToHref="#" style={{paddingBottom: 48}}>
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
                }}
                href="/"
              >
                Sign out
              </GcdsNavLink>
            </>
          )}
        </GcdsTopNav>
      </GcdsHeader>

      <GcdsContainer size="xl" centered padding="0" margin="0" style={{marginLeft: 10}}>
        <div> {children} </div>
      </GcdsContainer>

      <GcdsContainer size="xl" centered style={{backgroundColor: '#33465C', paddingTop: 1, marginBottom: -15 }}>
          <GcdsText margin-bottom="450" margin-top="450" style={{ paddingBottom: 5}}>
              <div style={{ color: 'white', fontSize: 24 }}> Portable Asset Locator </div>
          </GcdsText>
      </GcdsContainer>

      <GcdsFooter
        display="compact"
        contextualHeading=""
        contextualLinks='{}'
        />
    </GcdsContainer>
  );
}

export default MainTemplate;
