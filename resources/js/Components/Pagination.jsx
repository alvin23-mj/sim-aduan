import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (links.length <= 3) return null;

    return (
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '0 20px 20px' }}>
            {links.map((link, key) => (
                link.url === null ? (
                    <div
                        key={key}
                        style={{
                            padding: '8px 14px',
                            fontSize: '13px',
                            color: '#CBD5E1',
                            border: '1px solid #E2E8F0',
                            background: '#fff'
                        }}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        style={{
                            padding: '8px 14px',
                            fontSize: '13px',
                            color: link.active ? '#fff' : '#64748B',
                            border: '1px solid',
                            borderColor: link.active ? '#1E293B' : '#E2E8F0',
                            background: link.active ? '#1E293B' : '#fff',
                            textDecoration: 'none'
                        }}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}
