'use client'
import './Selections.css'
import { useState } from 'react';

type SelectProps = {
   options: any[];
   onSelect: (optionsSelected: any[]) => void;
}

export default function Selections ({ options, onSelect }: SelectProps) {
   const [optionsSelected, setOptionsSelected] = useState<any[]>([]);
   const [optionsSelectedIndex, setOptionsSelectedIndex] = useState<number[]>([]);


   const toggleOptionAdded = (option: any, index: number) => {
      if (optionsSelectedIndex.includes(index)) {
         // remove option
         setOptionsSelected(prev => ([ ...prev.filter(opt => opt !== option) ]));
         onSelect([ ...optionsSelected.filter(opt => opt !== option)]);
         setOptionsSelectedIndex(prev => ([ ...prev.filter(ind => ind !== index) ]));
      } else {
         // add option
         setOptionsSelected(prev => ([ ...prev, option ]));
         onSelect([ ...optionsSelected, option ]);
         setOptionsSelectedIndex(prev => ([ ...prev, index ]));
      }
   }

   return (
      <div className="selections">
         {options.map((option, index) => (
            <div 
               key={index}
               className={`selection ${optionsSelectedIndex.includes(index) && 'selected'}`}
               onClick={() => toggleOptionAdded(option, index)}
            >{option}</div>
         ))}
      </div>
   )
}
