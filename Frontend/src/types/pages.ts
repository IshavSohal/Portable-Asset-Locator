type sitePages = 'register' | 'signin' | 'manage-assets' | 'my-assets' | 'unassigned-assets';

type pageURL = {
  [page in sitePages]: string;
};

const pageURLs: pageURL = {
  register: '/register',
  signin: '/signin',
  'manage-assets': '/manage-assets',
  'my-assets': '/dashboard',
  'unassigned-assets': '/unassigned-assets',
};

export { pageURLs };
export type { sitePages };
