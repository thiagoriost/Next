// prc => snipep para generar codigo template

import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'MaoinPage',
  description: 'to description SEO title'
}

export default function MainPage() {
  return (
    <div>
      <h1>Hello Main Page</h1>
    </div>
  );
}