'use client'
import { getAllClients, getEditorWhoCompletedTask } from "@/app/actions/admin";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SearchSelect from "@/components/SearchSelect/SearchSelect";
import FinalApproveForm from "./FinalApproveForm";


export default function ApproveTaskForm ({ taskId }: { taskId: string }) {
   const router = useRouter();
   const [error, setError] = useState<string | undefined>(undefined);

   const [editorsCompletedTask, setEditorsCompletedTask] = useState<EditorDetails[] | null>(null);
   const [allClients, setAllClients] = useState<ClientDetails[] | null>(null);

   const [selectedEditor, setSelectedEditor] = useState<number>(-1);
   const [selectedClient, setSelectedClient] = useState<number>(-1);

   async function formLoader () {
      setError(undefined);

      // get all editors who have completed the task
      const editors = await getEditorWhoCompletedTask(taskId);
      if (editors == false) { setError("Failed to get any editors from db."); return; }
      setEditorsCompletedTask(editors);

      // get all clients
      const clients = await getAllClients();
      if (clients == false) { setError("Failed to get any clients from db."); return; }
      setAllClients(clients);

      console.log(clients, editors);
   }

   useEffect(() => {
      formLoader();
   }, []);

   return (
      <>
         <div className="text-l pd-1 bold-700 mt-4">Approve Task</div>
         <div className="text-xxs mb-15 grey-5">Approve a task completed by an editor, this means their task was posted to a client's social media account</div>
         <div className="text-s dfb column">
            {(editorsCompletedTask == null || allClients == null) && (<>
               <div className="text-xs grey-4 pd-1">Loading Form...</div>
            </>)}

            <div className="text-s dfb column gap-30">
               {(editorsCompletedTask !== null) && <>
                  <SearchSelect 
                     options={editorsCompletedTask} 
                     placeholderName="Editors"
                     onChooseOption={(index) => setSelectedEditor(index)}
                  />
               </>}

               {(allClients !== null && selectedEditor > -1) && <>
                  <SearchSelect 
                     options={allClients} 
                     placeholderName="Clients"
                     onChooseOption={(index) => setSelectedClient(index)}
                  />
               </>}
            </div>


            {(allClients !== null && editorsCompletedTask !== null && selectedClient > -1 && selectedEditor > -1) && (<>
               <FinalApproveForm 
                  editor={editorsCompletedTask[selectedEditor]}
                  client={allClients[selectedClient]}
                  taskId={taskId}
                  onApprovePost={() => {
                     setSelectedClient(-1);
                     setSelectedEditor(-1);
                     toast.success("Post Approved");
                     router.refresh();
                  }}
                  onError={(error) => setError(error)}
               />
            </>)}

            {(error !== undefined) && (<div className="text-xxs error bold-600">{error}</div>)}
         </div>
      </>
   )
}
