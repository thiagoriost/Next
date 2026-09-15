import type{ Metadata } from "next"

export const metadata: Metadata = {
  title:'SEO Title',
  description: 'SEO Description about page',
  keywords: ['About page', 'Rigo', 'Informacion']
}

export default function AboutPage(){
  return (
    
    <span className="text-7xl"> About pagee</span>
  )
}


