import "./SearchSelect.css"
import { CustomIcon } from "../Icons/Icon";
import React, { useState } from 'react'
import { X } from "lucide-react";

type SearchSelectProps = {
   options: ClientDetails[] | EditorDetails[];
   placeholderName: string;
   onChooseOption: (index: number) => void;
}

export default function SearchSelect ({ options, placeholderName, onChooseOption }: SearchSelectProps) {
   const [chosenOption, setChosenOption] = useState<number>(-1);
   const [search, setSearch] = useState('')

   const chooseOptionBtn = (index: number) => {
      setChosenOption(index);
      onChooseOption(index);
   }

   const resetOptionChosen = () => {
      setChosenOption(-1);
      onChooseOption(-1);
   }
   
   return (
      <div className='search-select'>
         {(chosenOption < 0) ? (<>
            <div className="text-s dfb column">
               <input 
                  type="text" 
                  className="xxs full pd-1" 
                  placeholder={`Search ${placeholderName}`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            <div className="options-list">
               {options
               .filter(option => option.user.name.toLowerCase().includes(search.toLowerCase()))
               .map((option: any, index) => {
                  const ind = options.indexOf(option);
                  return <div className="option" key={index} onClick={() => chooseOptionBtn(ind)}>
                     <CustomIcon url={option.user.image} size={24} round />
                     <div className="text-xxs bold-500 fit" style={{ whiteSpace: "nowrap" }}>{option.user.name}</div>
                     <div className="text-xxxs grey-4">{option.user.email}</div>
                  </div>
               })}
            </div>
         
         </>) : (<>
            <div className="selected-option">
               <CustomIcon url={options[chosenOption].user.image} size={24} round />
               <div className="text-xxs bold-500 full">{options[chosenOption].user.name}</div>
               <div className="close" onClick={resetOptionChosen}><X size={17} /></div>
            </div>
         </>)}
      </div>
   )
}
