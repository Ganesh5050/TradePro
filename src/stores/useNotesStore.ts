import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Note {
  id: string;
  stockSymbol: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesState {
  notes: Note[];
  addNote: (stockSymbol: string, content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNotesByStock: (stockSymbol: string) => Note[];
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      
      addNote: (stockSymbol, content) => set((state) => ({
        notes: [...state.notes, {
          id: Date.now().toString(),
          stockSymbol,
          content,
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      })),
      
      updateNote: (id, content) => set((state) => ({
        notes: state.notes.map(note =>
          note.id === id ? { ...note, content, updatedAt: new Date() } : note
        )
      })),
      
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(note => note.id !== id)
      })),
      
      getNotesByStock: (stockSymbol) => {
        return get().notes.filter(note => note.stockSymbol === stockSymbol);
      }
    }),
    {
      name: 'notes-storage'
    }
  )
);
