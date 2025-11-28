'use client';

import { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, Search } from 'lucide-react';
import styles from './page.module.css';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  totalSpend: number;
  lastVisit: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredClients(clients);
      return;
    }
    
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = clients.filter(c => 
      c.name.toLowerCase().includes(lowerTerm) || 
      c.email.toLowerCase().includes(lowerTerm) ||
      c.phone.includes(searchTerm)
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/admin/clients');
      if (res.ok) {
        const data = await res.json();
        setClients(data);
        setFilteredClients(data);
      }
    } catch (error) {
      console.error('Failed to fetch clients', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpend, 0);
  const totalAppointments = clients.reduce((sum, c) => sum + c.totalAppointments, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Client Management</h1>
        <p>View and manage your client base, history, and lifetime value.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
            <Users size={24} />
          </div>
          <div>
            <div className={styles.statLabel}>Total Clients</div>
            <div className={styles.statValue}>{clients.length}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#166534' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className={styles.statLabel}>Lifetime Revenue</div>
            <div className={styles.statValue}>${totalRevenue.toFixed(0)}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className={styles.statLabel}>Total Bookings</div>
            <div className={styles.statValue}>{totalAppointments}</div>
          </div>
        </div>
      </div>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search clients by name, email, or phone..."
          className="w-full p-3 pl-10 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} style={{ position: 'absolute', left: '0.75rem', top: '0.85rem', color: '#94a3b8' }} />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Contact Info</th>
              <th>Last Visit</th>
              <th>Visits</th>
              <th>Total Spend</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-8">Loading clients...</td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8">No clients found.</td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="cursor-pointer hover:bg-gray-50" onClick={() => window.location.href = `/admin/clients/${encodeURIComponent(client.id)}`}>
                  <td>
                    <div className={styles.clientName}>{client.name}</div>
                  </td>
                  <td>
                    <div className={styles.email}>{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td>
                    {new Date(client.lastVisit + 'T12:00:00').toLocaleDateString()}
                  </td>
                  <td>{client.totalAppointments}</td>
                  <td>${client.totalSpend.toFixed(2)}</td>
                  <td>
                    {client.totalSpend > 500 ? (
                      <span className={`${styles.badge} ${styles.badgeGold}`}>VIP</span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeSilver}`}>Regular</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className={styles.mobileList}>
        {loading ? (
          <div className="text-center p-8 text-gray-500">Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center p-8 text-gray-500">No clients found.</div>
        ) : (
          filteredClients.map((client) => (
            <div 
              key={client.id} 
              className={styles.clientCard}
              onClick={() => window.location.href = `/admin/clients/${encodeURIComponent(client.id)}`}
            >
              <div className={styles.clientCardHeader}>
                <div>
                  <div className={styles.clientName}>{client.name}</div>
                  <div className={styles.email}>{client.email}</div>
                  <div className="text-sm text-gray-500">{client.phone}</div>
                </div>
                <div>
                  {client.totalSpend > 500 ? (
                    <span className={`${styles.badge} ${styles.badgeGold}`}>VIP</span>
                  ) : (
                    <span className={`${styles.badge} ${styles.badgeSilver}`}>Regular</span>
                  )}
                </div>
              </div>
              
              <div className={styles.clientCardRow}>
                <span>Last Visit</span>
                <strong>{new Date(client.lastVisit + 'T12:00:00').toLocaleDateString()}</strong>
              </div>
              
              <div className={styles.clientCardRow}>
                <span>Total Visits</span>
                <strong>{client.totalAppointments}</strong>
              </div>
              
              <div className={styles.clientCardRow}>
                <span>Lifetime Spend</span>
                <strong style={{ color: '#10b981' }}>${client.totalSpend.toFixed(2)}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
