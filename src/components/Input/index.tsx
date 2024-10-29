import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input(props: InputProps){
    return(
        <input
            className="border-0 h-9 rounded-md outline-nome px-2 mb-3"
            {...props}
        />
    )
}