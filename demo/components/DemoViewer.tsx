import React from 'react';

interface Props {
    title: string;
    code: string;
    children: React.ReactNode;
}

export const DemoViewer: React.FC<Props> = ({ title, code, children }) => {
    return (
        <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <h2 style={{ margin: 0, textAlign: 'center' }}>{title}</h2>
            
            {/* Chart Area - Now transparent and simple */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '400px'
            }}>
                {children}
            </div>

            {/* Code Area - Keep the "card" feel here for contrast */}
            <div style={{ marginTop: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Usage Example</h4>
                <pre style={{ 
                    backgroundColor: '#1e1e1e', 
                    color: '#d4d4d4', 
                    padding: '24px', 
                    borderRadius: '8px', 
                    overflowX: 'auto',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};