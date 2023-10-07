import Layout from "@/components/Layout";
import { getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";
export default function Login(props){
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.error === 'CredentialsSignin')
      setError('Invalid credentials');
    else if (props.error)
      setError(`Error: ${props.error}`);
  }, []);

  return (
    <Layout navbar={false}>
      <title>Login</title>

      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 md:bg-white rounded-md p-8">
          <h1 className="text-4xl">Login</h1>

          <form className="flex flex-col w-3/4 mt-10" action="/api/auth/callback/credentials" method="POST">
            <input name="csrfToken" type="hidden" defaultValue={props.csrfToken} />

            <label className="text-xl">Email</label>
            <input className="border-gray-400 border-[1px] outline-0 rounded-md p-2" type="text" placeholder="Email" name="email"/>
            <label className="text-xl mt-4">Password</label>
            <input className="border-gray-400 border-[1px] outline-0 rounded-md p-2" type="password" placeholder="Password" name="password"/>

            <p className="text-red-500 text-center mt-2">{error}</p>

            <button className="bg-blue-500 text-white rounded-md p-2 mt-2 w-full md:w-3/4 self-center hover:bg-blue-600" type="submit">Login</button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      error: context.query.error || null
    },
  }
}