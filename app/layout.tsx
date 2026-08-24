import type {Metadata} from 'next';
import './globals.css';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
export const metadata:Metadata={title:'Tide & Trail — Good Gear. Another Adventure.','description':'A community-first outdoor marketplace in Moncton, New Brunswick. Buy, sell, rent, repair and find your people.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <><Header/><main>{children}</main><Footer/></>}
