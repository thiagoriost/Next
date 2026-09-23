import { redirect } from "next/navigation";

export default function HomePage() {

  redirect('/dashboard/counter') // Redirect to the counter dashboard page
  /* return (
    <>
      <h1>Hi word</h1>
    </>
  ); */
}
