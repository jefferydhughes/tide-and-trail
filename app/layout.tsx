import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export const metadata={title:'Tide & Trail | Community. Gear. Environment.',description:'A community-powered outdoor gear marketplace near the Bay of Fundy.'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/>{children}<Footer/></body></html>}