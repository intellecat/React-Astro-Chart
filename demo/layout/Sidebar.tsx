import React from 'react';
import { NavLink } from 'react-router-dom';

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
    },
    {
        id: 'animation',
        title: 'Animation',
        items: [
            { id: 'natal-anim', label: 'Animated Natal' },
        ]
    }
];

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<Props> = ({ isOpen, onClose }) => {
    return (
        <>
            <div className={`demo-sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`demo-sidebar ${isOpen ? 'open' : ''}`}>
                {MENU.map(section => (
                    <div key={section.id}>
                        <div className="demo-section-title">{section.title}</div>
                        {section.items.map(item => (
                            <NavLink 
                                key={item.id}
                                to={`/${section.id}/${item.id}`}
                                className={({ isActive }) => `demo-nav-item ${isActive ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};