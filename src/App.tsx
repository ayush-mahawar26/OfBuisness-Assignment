import { useState } from 'react'
import './App.css'
import { CustomHeader } from './components/Header'
import { Table } from './components/Table'
import { AddContactModal } from './components/AddContactModal'
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { deleteContacts, clearSelection, setSearchTerm } from './store/slices/contactsSlice'
import type { Contact } from './store/slices/contactsSlice'
import { SearchComponent } from './components/SearchComponent'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const selectedRows = useAppSelector((state) => state.contacts.selectedRows)
  const searchTerm = useAppSelector((state) => state.contacts.searchTerm)
  const dispatch = useAppDispatch()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value))
  }

  const handleBulkDeleteClick = () => {
    if (selectedRows.length > 0) {
      setIsDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = () => {
    if (selectedRows.length > 0) {
      dispatch(deleteContacts(selectedRows))
      dispatch(clearSelection())
    }
  }

  const handleOpenModal = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact)
    } else {
      setEditingContact(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingContact(null)
  }

  return (
    <>
      <CustomHeader />

      <div className="container" style={{ marginTop: '120px', position: 'relative', marginLeft: '12rem' }}>
        <h1 id='contact-manager-title'>Contact manager</h1>
        <div className="content-table-and-form">
          <div className="search-row">
            <SearchComponent searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {selectedRows.length > 0 && (
                <button
                  className="bulk-delete-button"
                  onClick={handleBulkDeleteClick}
                >
                  Bulk Delete ({selectedRows.length})
                </button>
              )}
              <button
                className="add-contact-button"
                onClick={() => handleOpenModal()}
              >
                Add Contact
              </button>
            </div>
          </div>
          <Table onEdit={handleOpenModal} />
        </div>
      </div>
      <AddContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editContact={editingContact}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default App
