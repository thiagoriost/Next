// prc => snipep para generar codigo template

import { SimpleWidget } from "@/components/index.";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'MaoinPage',
  description: 'to description SEO title'
}

export default function MainPage() {
  return (
    <div className="text-black p-2">
      <h1 className="mt-2 text-3xl">Dashboard</h1>
      <span className="text-xl">Información general</span>
      <div className="flex flex-wrap mt-2 p-2 bg-slate-200 rounded-lg items-center justify-center">
        <SimpleWidget />
      </div>
    </div>
  );
}