import Navigation from '@/components/Navigation';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout(props) {
  return (
    <div className={`bg-gray-100 min-h-screen ${inter.className}`}>
      {props.navbar !== false && <Navigation/>}
      {props.children}
    </div>
  )
}