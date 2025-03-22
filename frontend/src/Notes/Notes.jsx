// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function Notes() {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [notes, setNotes] = useState([]);
//   const [isAdding, setIsAdding] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingNoteId, setEditingNoteId] = useState(null);

//   const API_BASE_URL =  'http://localhost:5000/notes';

//   const fetchNotes = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(API_BASE_URL);
//       setNotes(response.data);
//     } catch (err) {
//       setError(err.message || 'Failed to fetch notes.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const addNote = async () => {
//     if (description.trim() !== '') {
//       try {
//         if (editingNoteId) {
//           await axios.put(`${API_BASE_URL}/${editingNoteId}`, { title, description });
//           setEditingNoteId(null);
//         } else {
          
//           const res=await axios.post(`${API_BASE_URL}/add`, { title, description });
         
//         }
//         setTitle('');
//         setDescription('');
//         setIsAdding(false);
//         fetchNotes();
//       } catch (err) {
        
//         setError(err.message || (editingNoteId ? 'Failed to update note.' : 'Failed to add note.'));
//       }
//     }
//   };

//   const deleteNote = async (id) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/${id}`);
//       setNotes(notes.filter((note) => note._id !== id));
//     } catch (err) {
//       setError(err.message || 'Failed to delete note.');
//     }
//   };

//   const errorRefresh = () => {
//     setError(null);
//   };

//   const edit = (note) => {
//     setTitle(note.title);
//     setDescription(note.description);
//     setEditingNoteId(note._id);
//     setIsAdding(true);
//   };

//   if (loading) {
//     return <div className="flex justify-center p-4">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="p-4 ">
//         <div className="text-red-500">Error: {error}</div>
//         <button onClick={errorRefresh} className="bg-red-300 p-2 rounded h-10">
//           Clear
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex w-full ">
//       <div className="p-4 flex flex-col justify-between">
//         <div className="flex flex-row flex-wrap gap-2 w-full max-h-[calc(100vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//           {notes.map((note) => (
//             <div
//               key={note._id}
//               className="border mb-2 rounded w-64 max-h-72 bg-slate-100"
//             >
//               <div className="border-b p-1">
//                 <strong>{note.title}</strong>
//               </div>
//               <div className="p-1 bg-white">{note.description}</div>
//               <div className="flex space-x-2 justify-end p-1">
//                 <button
//                   className="rounded-lg border border-green-500 p-1 bg-green-200 hover:bg-green-400"
//                   onClick={() => edit(note)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   key={`delete-${note._id}`}
//                   className="rounded-lg border border-red-500 p-1 bg-red-200 hover:bg-red-400"
//                   onClick={() => deleteNote(note._id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         {!isAdding && (
//           <button
//             className="rounded-lg shadow-lg w-20 bg-blue-200 p-2 mt-4"
//             onClick={() => setIsAdding(true)}
//           >
//             Add
//           </button>
//         )}
//       </div>

//       {isAdding && (
//         <div className="w-2/3 p-4">
//           <div>
//             <div className="space-y-2 mb-2">
//               <input
//                 type="text"
//                 id="title"
//                 className="w-full border border-cyan-400 rounded-lg outline-none p-1"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Title"
//               />

//               <textarea
//                 name="desc"
//                 id="description"
//                 placeholder="Create note"
//                 className="w-full border border-cyan-400 rounded-lg outline-none p-1 h-96 resize-none"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </div>
//             <div>
//               <button
//                 className="rounded-lg shadow-lg w-20 bg-green-200 p-2 mr-2"
//                 onClick={addNote}
//               >
//                 {editingNoteId ? 'Update' : 'Save'}
//               </button>
//               <button
//                 className="rounded-lg shadow-lg w-20 bg-red-200 p-2"
//                 onClick={() => {
//                   setIsAdding(false);
//                   setEditingNoteId(null);
//                   setTitle('');
//                   setDescription('');
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Notes;

import React from 'react'
import { Outlet } from 'react-router-dom'

function Notes() {
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default Notes