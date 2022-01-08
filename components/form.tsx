import type { NextComponentType } from 'next'

const Form: NextComponentType = () => {
    

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <label className="block">
                <span className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">Username</span>
                <input name="username" type="text" placeholder="Username" className="mt-1 block w-full px-3 peer py-2
                bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder:italic placeholder-gray-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500"/>
            </label>
            <label className="block mt-2">
                <span className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">Password</span>
                <input name="password" type="password" placeholder="Password" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder:italic placeholder-gray-400
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
              disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none
              invalid:border-pink-500 invalid:text-pink-600
              focus:invalid:border-pink-500 focus:invalid:ring-pink-500"/>
            </label>
            <label className="block mt-2">
                <button type="submit" className="block w-full px-3 py-2 border bg-sky-500 hover:bg-sky-700 rounded-md shadow-sm text-sm leading-5 text-white font-semibold">Login</button>
            </label>
            <label className="block mt-2">
                <button className="block w-full px-3 py-2 border rounded-md hover:bg-slate-100 shadow-sm text-sm leading-5 font-semibold">Register</button>
            </label>
            <label className="block mt-2">
                <button className="block w-full py-2 text-sm leading-5 text-sky-500 hover:text-sky-700 font-semibold">Forgot Password</button>
            </label>
        </form>
    );
}

export default Form