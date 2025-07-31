import './Selector.css'

type SelectorProps = {
   options: any[];
   selectedIndex: number;
   onClickAction: (index: number) => void;
}

export default function Selector ({ options, selectedIndex, onClickAction }: SelectorProps) {
   return (
      <div className='selections'>
         {options.map((option: any, index: number) => (
            <div 
               key={index}
               className={`selector-option ${(selectedIndex == index) && 'selected'}`} 
               onClick={() => onClickAction(index)}
            >{option}</div>
         ))}
      </div>
   )
}
