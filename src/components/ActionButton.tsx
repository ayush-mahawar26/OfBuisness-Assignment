import '../styles/table.style.css';

interface ActionButtonsProps {
    onPress: () => void;
    label: string;
    icon: React.ReactNode;
    color: string;
}

export const ActionButtons = ({ onPress, label, icon, color }: ActionButtonsProps) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: 'column' }}>
            <button className="action-button" onClick={onPress} style={{ backgroundColor: color }}>
                {icon}
            </button>
            <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#334155'
            }}> {label}</p>
        </div>
    )

}