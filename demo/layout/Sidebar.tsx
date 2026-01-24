import React from 'react';

interface Props {
    activePage: string;
    subPage: string;
    onNavigate: (page: string, subPage: string) => void;
}

const MENU = [
    {
        id: 'charts',
        title: 'Chart Types',
        items: [
            { id: 'natal', label: 'Natal Chart' },
            { id: 'noon', label: 'Noon Chart' },
            { id: 'transit', label: 'Transit Chart' },
            { id: 'synastry', label: 'Synastry Chart' },
        ]
    },
    {
        id: 'themes',
        title: 'Themes',
        items: [
            { id: 'classic', label: 'Astrodienst (Classic)' },
            { id: 'modern', label: 'Co-Star (Modern)' },
            { id: 'dark', label: 'Dark Mode' },
        ]
    },
    {
        id: 'components',
        title: 'Components',
        items: [
            { id: 'zodiac', label: 'Zodiac Wheel' },
            { id: 'houses', label: 'House Lines' },
            { id: 'degrees', label: 'Degree Rings' },
            { id: 'planets', label: 'Planet Ring' },
            { id: 'stacked', label: 'Stacked Planet Ring' },
            { id: 'aspects', label: 'Aspect Lines' },
        ]
    }
];

export const Sidebar: React.FC<Props> = ({ activePage, subPage, onNavigate }) => {
    return (
        <div className="demo-sidebar">
            {MENU.map(section => (
                <div key={section.id}>
                    <div className="demo-section-title">{section.title}</div>
                    {section.items.map(item => (
                        <a 
                            key={item.id}
                            className={`demo-nav-item ${activePage === section.id && subPage === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(section.id, item.id)}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            ))}
        </div>
    );
};
