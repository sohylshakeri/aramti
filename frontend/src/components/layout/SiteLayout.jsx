import { Outlet } from 'react-router-dom'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

export default function SiteLayout() {
  return (
    <div className="site">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
