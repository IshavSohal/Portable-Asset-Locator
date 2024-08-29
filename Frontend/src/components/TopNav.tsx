import { GcdsNavLink, GcdsTopNav } from '@cdssnc/gcds-components-react';
import { useAuth } from '../hooks/AuthProvider';
import { pageURLs, type sitePages } from '../types/pages';
import { GcdsNavLinkCustomEvent } from '@cdssnc/gcds-components/dist/types/components';

export interface TopNavProps {
  /**
   * Name of the current page.
   */
  currentPage?: sitePages;
}

interface NavLinkProps {
  /**
   * Whether the link represents the currently selected page.
   */
  isCurrentPage?: boolean;

  /**
   * The text for the link, usually representing the name of the page.
   */
  linkText: string;

  /**
   * The URL for the link.
   */
  linkURL: string;

  /**
   * A function to define custom functionality for when the link is clicked.
   * @param event The event that the click action will generate.
   */
  onClickAction?: (event?: GcdsNavLinkCustomEvent<void>) => any;
}

function NavLink({
  isCurrentPage,
  linkText,
  linkURL,
  onClickAction,
}: NavLinkProps) {
  return (
    <GcdsNavLink
      style={{
        fontSize: '20px',
        paddingBottom: isCurrentPage ? '2px' : '0',
        fontFamily: 'Noto sans, sans-serif',
      }}
      current={isCurrentPage}
      href={linkURL}
      onGcdsFocus={(e) => {
        if (onClickAction) {
          onClickAction(e);
        }
      }}
    >
      {linkText}
    </GcdsNavLink>
  );
}

/**
 * The common top bar, containing the site navigation links, GovCan logo, and localization button.
 * @param TopNavProps See the related interface for what each prop is for.
 */
export function TopNav({ currentPage }: TopNavProps) {
  const { user, logOut } = useAuth();

  return (
    <GcdsTopNav slot="menu" label="Top navigation" alignment="right">
      <GcdsNavLink href="/" slot="home">
        Portable Asset Locator
      </GcdsNavLink>

      {/* Links for non-logged in users */}
      {!user && (
        <>
          <NavLink
            isCurrentPage={currentPage === 'signin'}
            linkText="Sign-in"
            linkURL={pageURLs['signin']}
          />
          <NavLink
            isCurrentPage={currentPage === 'register'}
            linkText="Register"
            linkURL={pageURLs['register']}
          />
        </>
      )}

      {/* Links for logged-in people. Links are placeholders for now. TODO: Change to real links once available. */}
      {!!user && (
        <>
          {user?.role === 'Custodian' && (
            <NavLink
              isCurrentPage={currentPage === 'manage-assets'}
              linkText="Manage Assets"
              linkURL={pageURLs['manage-assets']}
            />
          )}

          <NavLink
            isCurrentPage={currentPage === 'my-assets'}
            linkText="My Assets"
            linkURL={pageURLs['my-assets']}
          />

          <NavLink linkText="Sign out" linkURL="" onClickAction={logOut} />
        </>
      )}
    </GcdsTopNav>
  );
}
