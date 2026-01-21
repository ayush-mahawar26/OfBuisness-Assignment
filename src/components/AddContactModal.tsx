import { useState, useEffect } from 'react';
import '../styles/contactModal.style.css';
import { FormField } from './FormField';
import { StateDropdown } from './StateDropdown';
import { useAppDispatch } from '../store/hooks';
import { addContact, updateContact } from '../store/slices/contactsSlice';
import type { Contact } from '../store/slices/contactsSlice';
import { INDIAN_STATES } from '../utils/constants';

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    editContact?: Contact | null;
}


export const AddContactModal = ({ isOpen, onClose, editContact }: AddContactModalProps) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        name: '',
        contactNo: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        pincode: ''
    });
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const parseAddress = (address: string) => {
        const parts = address.split(',').map(p => p.trim());
        let addressLine1 = '';
        let addressLine2 = '';
        let state = '';
        let pincode = '';

        if (parts.length > 0) addressLine1 = parts[0];
        if (parts.length > 1) addressLine2 = parts[1];
        if (parts.length > 2) {
            const lastPart = parts[parts.length - 1];
            const pincodeMatch = lastPart.match(/(\d+)$/);
            if (pincodeMatch) {
                pincode = pincodeMatch[1];
                state = lastPart.replace(/\d+$/, '').trim();
            } else {
                state = lastPart;
            }
        }

        return { addressLine1, addressLine2, state, pincode };
    };

    useEffect(() => {
        if (editContact && isOpen) {
            const { addressLine1, addressLine2, state, pincode } = parseAddress(editContact.address);
            setFormData({
                name: editContact.name,
                contactNo: editContact.contactNo || '',
                email: editContact.email,
                addressLine1,
                addressLine2,
                state,
                pincode
            });
        } else if (isOpen) {
            setFormData({
                name: '',
                contactNo: '',
                email: '',
                addressLine1: '',
                addressLine2: '',
                state: '',
                pincode: ''
            });
        }
        setErrors({});
    }, [editContact, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: false
            }));
        }
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        if (phone.trim().length !== 10) return false;
        return /^\d*$/.test(phone);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, boolean> = {};

        if (!formData.name || formData.name.trim().length === 0) {
            newErrors.name = true;
        }

        if (!formData.email || formData.email.trim().length === 0) {
            newErrors.email = true;
        } else if (!validateEmail(formData.email.trim())) {
            newErrors.email = true;
        }

        if (!formData.addressLine1 || formData.addressLine1.trim().length === 0) {
            newErrors.addressLine1 = true;
        }

        if (!formData.pincode || formData.pincode.trim().length === 0) {
            newErrors.pincode = true;
        }

        if (formData.contactNo && formData.contactNo.trim().length > 0 && !validatePhone(formData.contactNo.trim())) {
            newErrors.contactNo = true;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const address = `${formData.addressLine1}${formData.addressLine2 ? ', ' + formData.addressLine2 : ''}${formData.state ? ', ' + formData.state : ''}${formData.pincode ? ' ' + formData.pincode : ''}`;

        if (editContact) {
            dispatch(updateContact({
                id: editContact.id,
                name: formData.name,
                address: address.trim(),
                email: formData.email,
                contactNo: formData.contactNo
            }));
        } else {
            dispatch(addContact({
                name: formData.name,
                address: address.trim(),
                email: formData.email,
                contactNo: formData.contactNo
            }));
        }

        setFormData({
            name: '',
            contactNo: '',
            email: '',
            addressLine1: '',
            addressLine2: '',
            state: '',
            pincode: ''
        });
        setErrors({});
        onClose();
    };

    const handleClose = () => {
        setFormData({
            name: '',
            contactNo: '',
            email: '',
            addressLine1: '',
            addressLine2: '',
            state: '',
            pincode: ''
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editContact ? 'Edit Contact' : 'Add Contact'}</h2>
                    <button className="modal-close-button" onClick={handleClose}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-row">
                        <FormField
                            label="Name"
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            isImportant={true}
                            hasError={errors.name}
                        />
                        <div style={{ width: '1rem' }} />
                        <FormField
                            label="Contact No."
                            id="contactNo"
                            name="contactNo"
                            type="tel"
                            value={formData.contactNo}
                            onChange={handleChange}
                            hasError={errors.contactNo}
                        />
                    </div>

                    <div className="form-row">
                        <FormField
                            label="Email"
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            isImportant={true}
                            hasError={errors.email}
                        />
                        <div style={{ width: '1rem' }} />
                        <FormField
                            label="Address Line 1"
                            id="addressLine1"
                            name="addressLine1"
                            type="text"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            required
                            isImportant={true}
                            hasError={errors.addressLine1}
                        />
                    </div>

                    <div className="form-row">
                        <FormField
                            label="Address Line 2"
                            id="addressLine2"
                            name="addressLine2"
                            type="text"
                            value={formData.addressLine2}
                            onChange={handleChange}
                        />
                        <div style={{ width: '1rem' }} />
                        <StateDropdown
                            value={formData.state}
                            onChange={(value) => {
                                setFormData(prev => ({ ...prev, state: value }));
                                if (errors.state) {
                                    setErrors(prev => ({ ...prev, state: false }));
                                }
                            }}
                            states={INDIAN_STATES}
                            hasError={errors.state}
                        />

                    </div>
                    <FormField
                        label="Pincode"
                        id="pincode"
                        name="pincode"
                        type="text"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        isImportant={true}
                        hasError={errors.pincode}
                    />
                    <div className="modal-actions">
                        <button type="button" className="cancel-button" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            {editContact ? 'Update Contact' : 'Add Contact'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

