
// /test

import Link from 'next/link';
import React from 'react';

const Page: React.FC = () => {
    return (
        <>
            <p>Hello this is the Dashboard page</p>
            <Link href="/test">Click here to go to the Test page</Link>
        </>
    );
}
export default Page;