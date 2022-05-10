import { Component } from "react";

/**
 * Component for inputting tags/keywords.
 * @param tags The tags to display
 * @param setTags The callback to set the tags
 */
export default class TagInput extends Component<{ tags: string[], setTags: (tags: string[]) => void }> {

    /**
     * Add tag to the list.
     * @param event A keyup event that was triggered and has a reference to the input
     */
    addTag(event: any) {
        if (event.target.value !== '') {
            // Prevent default behavior (i.e. submitting the form)
            event.preventDefault();

            // Add tag to the list
            const newTags = [...this.props.tags];
            newTags.push(event.target.value);
            this.props.setTags(newTags);
            
            // Clear input
            event.target.value = '';
        }
    }

    /**
     * Remove tag from the list.
     * @param index The index of the tag to remove
     */
    removeTag(index: number) {
        // Remove tag from the list (alternate method to editing the array directly than using addTag)
        this.props.setTags([...this.props.tags.filter((tag, i) => i !== index)]);
    }

    /**
     * Render the component.
     * @returns The component
     */
    render() {
        return (
            <div className="m-2 flex flex-wrap py-2 border rounded bg-white">
                <ul className="ml-2 mr-2 flex flex-row flex-wrap">
                    {this.props.tags.map((tag, index) => (
                        <li key={index}>
                            <button type="button" onClick={
                                () => this.removeTag(index)
                            } className="inline-flex items-center mb-2 mr-2 h-10 px-5 text-indigo-100 transition-colors duration-150 bg-purple-600 rounded-full focus:shadow-outline hover:bg-purple-500">
                                <span className="text-white">{tag}</span>
                                <span className="ml-2 text-stone-200">X</span>
                            </button>
                        </li>
                    ))}
                </ul>
                <input form="" className="ml-2 mr-2 w-full appearance-none rounded py-2 px-3 leading-tight focus:outline-none focus:bg-stone-100" type="text" placeholder="Press enter to add a keyword" onKeyUp={event => (event.key === 'Enter' ? this.addTag(event) : event.preventDefault())}></input>
            </div>
        );
    }
}