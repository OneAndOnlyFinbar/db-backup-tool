import Navigation from '@/components/Navigation';

export default function Layout(props) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation/>
      {props.children}
    </div>
  )
}