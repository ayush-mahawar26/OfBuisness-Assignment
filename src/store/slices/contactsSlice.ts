import { createSlice } from '@reduxjs/toolkit';

export interface Contact {
  id: number;
  name: string;
  address: string;
  email: string;
  contactNo?: string;
}

interface ContactsState {
  contacts: Contact[];
  selectedRows: number[];
  searchTerm: string;
}

const initialState: ContactsState = {
  contacts: [],
  selectedRows: [],
  searchTerm: '',
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, action) => {
      const newId = state.contacts.length > 0 
        ? Math.max(...state.contacts.map(c => c.id)) + 1 
        : 1;
      state.contacts.push({
        ...action.payload,
        id: newId,
      });
    },
    updateContact: (state, action) => {
      const index = state.contacts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
    },
    deleteContact: (state, action) => {
      state.contacts = state.contacts.filter(c => c.id !== action.payload);
    },
    deleteContacts: (state, action) => {
      state.contacts = state.contacts.filter(c => !action.payload.includes(c.id));
      state.selectedRows = [];
    },
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload;
    },
    toggleRowSelection: (state, action) => {
      const id = action.payload;
      if (state.selectedRows.includes(id)) {
        state.selectedRows = state.selectedRows.filter(rowId => rowId !== id);
      } else {
        state.selectedRows.push(id);
      }
    },
    selectAllRows: (state) => {
      state.selectedRows = state.contacts.map(c => c.id);
    },
    clearSelection: (state) => {
      state.selectedRows = [];
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { 
  addContact, 
  updateContact, 
  deleteContact, 
  deleteContacts,
  setSelectedRows,
  toggleRowSelection,
  selectAllRows,
  clearSelection,
  setSearchTerm
} = contactsSlice.actions;
export default contactsSlice.reducer;

