import '../styles/table.style.css';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleRowSelection, selectAllRows, clearSelection, deleteContacts } from '../store/slices/contactsSlice';
import { ActionButtons } from './ActionButton';
import EditIcon from '../assets/SVGs/Edit.svg';
import DeleteIcon from '../assets/SVGs/Delete.svg';
import type { Contact } from '../store/slices/contactsSlice';
import { useMemo } from 'react';

interface TableProps {
    onEdit?: (contact: Contact) => void;
}

export const Table = ({ onEdit }: TableProps) => {
    const allContacts = useAppSelector((state) => state.contacts.contacts);
    const searchTerm = useAppSelector((state) => state.contacts.searchTerm);
    const selectedRows = useAppSelector((state) => state.contacts.selectedRows);
    const dispatch = useAppDispatch();

    const contacts = useMemo(() => {
        if (!searchTerm.trim()) return allContacts;
        return allContacts.filter(contact => {
            const searchLower = searchTerm.toLowerCase();
            return (
                contact.name.toLowerCase().includes(searchLower) ||
                contact.email.toLowerCase().includes(searchLower)
            );
        })
    }, [allContacts, searchTerm]);

    const selectAll = selectedRows.length === contacts.length && contacts.length > 0;

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            dispatch(selectAllRows());
        } else {
            dispatch(clearSelection());
        }
    };

    const handleRowSelect = (id: number) => {
        dispatch(toggleRowSelection(id));
    };

    const onDeletePress = (id: number) => {
        dispatch(deleteContacts([id]));
    };

    const onEditPress = (contact: Contact) => {
        if (onEdit) {
            onEdit(contact);
        }
    };


    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="empty-state">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        contacts.map((row) => (
                            <tr key={row.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(row.id)}
                                        onChange={() => handleRowSelect(row.id)}
                                    />
                                </td>
                                <td>{row.name}</td>
                                <td>{row.contactNo || '-'}</td>
                                <td>{row.address}</td>
                                <td>{row.email}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        <ActionButtons
                                            onPress={() => onEditPress(row)}
                                            label="Edit"
                                            icon={<img
                                                src={EditIcon}
                                                alt="edit"
                                                width={16}
                                                height={16}
                                            />}
                                            color="#EFF6FF"
                                        />

                                        <ActionButtons
                                            onPress={() => onDeletePress(row.id)}
                                            label="Delete"
                                            icon={<img
                                                src={DeleteIcon}
                                                alt="delete"
                                                width={16}
                                                height={16}
                                            />}
                                            color="#EFF6FF"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

