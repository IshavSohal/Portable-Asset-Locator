
// /test

import Link from 'next/link';
import React from 'react';

const Page: React.FC = () => {
    return (
        <>
            <p>Hello this is the test page</p>
            <Link href="/dashboard">Click here to go to the Dashboard page</Link>
        </>
    );
}
export default Page;