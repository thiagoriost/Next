import { Metadata } from "next"

export const metadata: Metadata = {
  title:'Contact',
  description: 'SEO Description contact page',
  keywords: ['Contact page', 'Rigo', 'Informacion']
}

export default function ContactPage(){
    return (
      <>
       <span className="text-7xl"> Contact page</span>
      </>
    )
  }
  