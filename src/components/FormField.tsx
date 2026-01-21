interface FormFieldProps {
    label: string;
    id: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
    isImportant?: boolean;
    hasError?: boolean;
}

export const FormField = ({
    label,
    id,
    name,
    type = 'text',
    value,
    onChange,
    required = false,
    placeholder,
    isImportant = false,
    hasError = false
}: FormFieldProps) => {
    return (
        <div className="form-group">
            <label
                htmlFor={id}
                style={{ color: hasError ? 'red' : undefined }}
            >
                {label} {isImportant && <span style={{ color: 'red', fontSize: '0.8rem', fontWeight: '500' }}>*</span>}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                style={{
                    borderColor: hasError ? 'red' : undefined,
                    color: hasError ? 'red' : undefined
                }}
                className={hasError ? 'input-error' : ''}
            />
        </div>
    );
};

