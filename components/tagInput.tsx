import { useState } from "react";

export default function TagInput({ updateTags }: { updateTags: (e: any) => void }) {
    const [tags, setTags] = useState([] as string[]);

    const addTag = (event: any) => {
        if (event.target.value !== '') {
            event.preventDefault();

            const newTags = [...tags];
            newTags.push(event.target.value);
            setTags(newTags);
            
            updateTags(newTags);
            event.target.value = '';
        }
    }

    const removeTag = (index: number) => {
        setTags([...tags.filter((tag, i) => i !== index)]);
        updateTags(tags);
    }

    return (
        <div className="m-2 flex flex-wrap py-2 border rounded bg-white">
            <ul className="ml-2 mr-2 flex flex-row flex-wrap">
                {tags.map((tag, index) => (
                    <li key={index}>
                        <button onClick={
                            () => removeTag(index)
                        } className="inline-flex items-center mb-2 mr-2 h-10 px-5 text-indigo-100 transition-colors duration-150 bg-purple-600 rounded-full focus:shadow-outline hover:bg-purple-500">
                            <span className="text-white">{tag}</span>
                            <span className="ml-2 text-stone-200">X</span>
                        </button>
                    </li>
                ))}
            </ul>
            <input form="" className="ml-2 mr-2 w-full appearance-none rounded py-2 px-3 leading-tight focus:outline-none focus:bg-stone-100" type="text" placeholder="Press enter to add a keyword" onKeyUp={event => (event.key === 'Enter' ? addTag(event) : event.preventDefault())}></input>
        </div>
    );
}