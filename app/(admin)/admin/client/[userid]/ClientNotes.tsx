'use client'
import { useVeloClient } from "@/hooks/useVeloClient"
import { useEffect, useRef, useState } from "react";

function useDebouncedEffect(callback: () => void, delay: number, deps: any[]) {
   const handler = useRef<NodeJS.Timeout | null>(null);
   useEffect(() => {
      if (handler.current) clearTimeout(handler.current);
      handler.current = setTimeout(() => {
         callback();
      }, delay);

      return () => {
         if (handler.current) clearTimeout(handler.current);
      };
   }, deps);
}

export default function ClientNotes() {
   const { client, actions } = useVeloClient();
   const [notes, setNotes] = useState(client?.notes!);

   if (client == null) return null;

   useDebouncedEffect(() => {
      if (!client) return;
      if (notes.trim().length === 0) return;
      actions.saveNotes(notes);
   }, 1500, [notes]);

   return (
      <>
         <div className="text-l mt-2 mb-15 bold-700 text-left">{client.user.name}'s Notes</div>
         <textarea 
            id="client-notes" 
            className="xxs pd-15 pdx-15 full h-35" 
            placeholder="Client Notes" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
         />
      </>
   )
}
