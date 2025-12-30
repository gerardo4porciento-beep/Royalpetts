import React from 'react';
import BubbleMenu from './BubbleMenu';

const Navbar = () => {
    const menuItems = [
        {
            label: 'home',
            href: '#hero',
            ariaLabel: 'Home',
            rotation: -8,
            hoverStyles: { bgColor: '#00b9ec', textColor: '#ffffff' }
        },
        {
            label: 'galería',
            href: '#gallery',
            ariaLabel: 'Galería',
            rotation: 8,
            hoverStyles: { bgColor: '#ff7db2', textColor: '#ffffff' }
        },
        {
            label: 'familia',
            href: '#family',
            ariaLabel: 'Familia',
            rotation: -5,
            hoverStyles: { bgColor: '#fe9e5b', textColor: '#ffffff' }
        },
        {
            label: 'contacto',
            href: '#contact',
            ariaLabel: 'Contacto',
            rotation: 5,
            hoverStyles: { bgColor: '#34f4ce', textColor: '#ffffff' }
        }
    ];

    const logo = (
        <div className="flex flex-col items-start leading-none select-none cursor-pointer">
            <div className="flex items-center gap-1.5 ml-0.5">
                <span className="font-skater text-lg md:text-2xl text-black tracking-wide">ROYAL</span>
                <img
                    src="/SEPARACION 6/LOGO 3.png"
                    alt="Royal Petts Logo"
                    className="w-6 h-6 md:w-8 md:h-8 object-contain brightness-0 -translate-y-[8px]"
                />
            </div>
            <span className="font-skater text-lg md:text-2xl text-black tracking-wide -mt-2.5 md:-mt-3">
                PETTSTORE
            </span>
        </div>
    );

    return (
        <BubbleMenu
            logo={logo}
            items={menuItems}
            menuBg="#ffffff"
            menuContentColor="#000000"
            useFixedPosition={true}
            animationDuration={0.95}
        />
    );
};

export default Navbar;


export default Navbar;
