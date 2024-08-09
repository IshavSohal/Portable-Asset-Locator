/**
 * MainTemplate: Common template for standard site pages, containing the header, footer
 * and a slot for the page content.
 */

import {
  GcdsContainer,
  GcdsFooter,
  GcdsHeader,
  GcdsText,
} from '@cdssnc/gcds-components-react';
import { ReactNode } from 'react';

import { TopNav, type TopNavProps } from '../components/TopNav';

interface MainTemplateProps extends TopNavProps {
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
  children,
  addMargins,
}: MainTemplateProps) {
  addMargins = addMargins ?? true;

  return (
    <GcdsContainer size="full" centered>
      <GcdsHeader langHref="#" skipToHref="#" style={{ paddingBottom: 48 }}>
        <TopNav currentPage={currentPage} />
      </GcdsHeader>

      <GcdsContainer
        className="main-content"
        size="xl"
        centered
        padding="0"
        margin="0"
        style={{ marginLeft: 10 }}
      >
        <div> {children} </div>
      </GcdsContainer>

      <GcdsContainer
        className="footer-content"
        size="xl"
        centered
        style={{
          backgroundColor: '#33465C',
          paddingTop: 1,
          marginBottom: -15,
        }}
      >
        <GcdsText
          margin-bottom="450"
          margin-top="450"
          style={{ paddingBottom: 5 }}
        >
          <div style={{ color: 'white', fontSize: 24 }}>
            {' '}
            Portable Asset Locator{' '}
          </div>
        </GcdsText>
      </GcdsContainer>

      <GcdsFooter display="compact" contextualHeading="" contextualLinks="{}" />
    </GcdsContainer>
  );
}

export default MainTemplate;
