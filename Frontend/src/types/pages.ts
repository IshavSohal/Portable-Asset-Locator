type sitePages = 'register' | 'signin' | 'manage-assets' | 'my-assets';

type pageURL = {
  [page in sitePages]: string;
};

const pageURLs: pageURL = {
  register: '/register',
  signin: '/signin',
  'manage-assets': '/manage-assets',
  'my-assets': '/dashboard',
};

export { pageURLs };
export type { sitePages };
