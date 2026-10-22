import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {NavLink, useLocation} from "react-router-dom";
import {ADMIN_BOOKINGS_PATH, ADMIN_SERVICES_PATH, ADMIN_SLOTS_PATH} from "../../config/routes";
import "./AdminMenu.css";
import {Button} from "../Button/Button.tsx";

const ADMIN_PREFIX = '/admin'

const ADMIN_LINKS = [
    {to: ADMIN_SERVICES_PATH, title: 'Услуги', hint: 'Каталог и цены'},
    {to: ADMIN_SLOTS_PATH, title: 'Слоты', hint: 'Расписание приёма'},
    {to: ADMIN_BOOKINGS_PATH, title: 'Записи', hint: 'Все записи клиентов'},
]

function getItemClass({isActive}: {isActive: boolean}) {
    return `admin-menu__item${isActive ? ' admin-menu__item--active' : ''}`
}

export const AdminMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const {pathname} = useLocation()
    const isAdminPage = pathname.startsWith(ADMIN_PREFIX)

    useEffect(() => {
        if (!isOpen) {
            return
        }

        function handleClickOutside(e: MouseEvent) {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen]);

    return (
        <div className={`admin-menu${isOpen ? ' admin-menu--open' : ''}`} ref={rootRef}>
            <Button type="button" className={`admin-menu__trigger${isAdminPage ? ' admin-menu__trigger--active' : ''}`} aria-haspopup="menu" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
                Админ-панель
                <span className="admin-menu__chevron" aria-hidden="true"/>
            </Button>

            {isOpen && (
                <div className="admin-menu__dropdown" role="menu">
                    {ADMIN_LINKS.map((link) => (
                        <NavLink key={link.to} to={link.to} role="menuitem" className={getItemClass} onClick={() => setIsOpen(false)}>
                            <span className="admin-menu__item-title">{link.title}</span>
                            <span className="admin-menu__item-hint">{link.hint}</span>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    )
}