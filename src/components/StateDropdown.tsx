import { useState, useRef, useEffect } from 'react';

interface StateDropdownProps {
    value: string;
    onChange: (value: string) => void;
    states: string[];
    hasError?: boolean;
}

export const StateDropdown = ({ value, onChange, states, hasError = false }: StateDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredStates = states.filter(state =>
        state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (state: string) => {
        onChange(state);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setSearchTerm('');
        }
    };

    return (
        <div className="state-dropdown-container" ref={dropdownRef}>
            <label
                htmlFor="state-input"
                style={{ color: hasError ? 'red' : undefined }}
            >
                State
            </label>
            <div className="state-dropdown-wrapper">
                <input
                    id="state-input"
                    type="text"
                    className={`state-dropdown-input ${hasError ? 'input-error' : ''}`}
                    placeholder="Enter State"
                    value={isOpen ? searchTerm : value}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    readOnly={!isOpen}
                    style={{
                        borderColor: hasError ? 'red' : undefined,
                        color: hasError ? 'red' : undefined
                    }}
                />
                <button
                    type="button"
                    className="state-dropdown-caret"
                    onClick={handleToggle}
                    aria-label="Toggle dropdown"
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    >
                        <path
                            d="M6 9L1 4H11L6 9Z"
                            fill="#64748b"
                        />
                    </svg>
                </button>
                {isOpen && (
                    <div className="state-dropdown-list">
                        {filteredStates.length > 0 ? (
                            filteredStates.map((state) => (
                                <div
                                    key={state}
                                    className="state-dropdown-item"
                                    onClick={() => handleSelect(state)}
                                >
                                    {state}
                                </div>
                            ))
                        ) : (
                            <div className="state-dropdown-item state-dropdown-no-results">
                                No states found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

