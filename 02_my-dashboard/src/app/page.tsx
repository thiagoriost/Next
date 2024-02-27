import { redirect } from "next/navigation";
import Image from "next/image";

export default function HomePage() {

  redirect('/dashboard/counter')
  /* return (
    <>
      <h1>Hi word</h1>
    </>
  ); */
}
