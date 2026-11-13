import type { Metadata } from 'next';
import '@fontsource-variable/dm-sans';
import './styles.css';

export const metadata: Metadata = {
  title: 'Tasklane — Make room for meaningful work',
  description: 'A clear task board and streaming project assistant.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
