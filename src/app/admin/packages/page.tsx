'use client';

import { useState, useEffect } from 'react';
import { Package, AddOnService } from '@/types/packages';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Tag } from 'lucide-react';
import styles from './page.module.css';

export default function PackagesManagement() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [addons, setAddons] = useState<AddOnService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'standard' | 'specialty'>('all');
  const [showHidden, setShowHidden] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [packagesRes, addonsRes] = await Promise.all([
        fetch('/api/admin/packages'),
        fetch('/api/admin/addons')
      ]);

      if (packagesRes.ok && addonsRes.ok) {
        const packagesData = await packagesRes.json();
        const addonsData = await addonsRes.json();
        setPackages(packagesData);
        setAddons(addonsData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePackage(packageData: Partial<Package>) {
    try {
      if (editingPackage) {
        // Update existing
        const response = await fetch('/api/admin/packages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingPackage.id, ...packageData }),
        });

        if (response.ok) {
          await fetchData();
          setEditingPackage(null);
        }
      } else {
        // Create new
        const response = await fetch('/api/admin/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(packageData),
        });

        if (response.ok) {
          await fetchData();
          setIsCreating(false);
        }
      }
    } catch (error) {
      console.error('Failed to save package:', error);
    }
  }

  async function handleDeletePackage(id: string) {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const response = await fetch(`/api/admin/packages?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to delete package:', error);
    }
  }

  async function togglePackageStatus(id: string, isActive: boolean) {
    try {
      await fetch('/api/admin/packages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      });
      await fetchData();
    } catch (error) {
      console.error('Failed to toggle package status:', error);
    }
  }

  async function unhideAllPackages() {
    if (!confirm('Are you sure you want to make all packages visible on the website?')) return;

    try {
      // Update all packages to be active
      const updatePromises = packages.map(pkg =>
        fetch('/api/admin/packages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: pkg.id, isActive: true }),
        })
      );

      await Promise.all(updatePromises);
      await fetchData();
      alert('All packages are now visible on the website!');
    } catch (error) {
      console.error('Failed to unhide all packages:', error);
      alert('Failed to unhide all packages');
    }
  }

  async function handleUpdateAddon(id: string, updates: Partial<AddOnService>) {
    try {
      const response = await fetch('/api/admin/addons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to update addon:', error);
    }
  }

  const filteredPackages = packages.filter(pkg => {
    const matchesFilter = filter === 'all' || pkg.category === filter;
    const matchesVisibility = showHidden || pkg.isActive;
    return matchesFilter && matchesVisibility;
  });

  if (loading) {
    return <div className={styles.loading}>Loading packages...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Package Management</h1>
          <p>Manage all massage packages, pricing, and discounts</p>
        </div>
        <div className={styles.headerButtons}>
          <button
            onClick={unhideAllPackages}
            className={styles.btnWarning}
          >
            <Eye size={20} />
            Unhide All Packages
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className={styles.btnPrimary}
          >
            <Plus size={20} />
            Add New Package
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        <button
          className={filter === 'all' ? styles.active : ''}
          onClick={() => setFilter('all')}
        >
          All Packages ({packages.length})
        </button>
        <button
          className={filter === 'standard' ? styles.active : ''}
          onClick={() => setFilter('standard')}
        >
          Standard ({packages.filter(p => p.category === 'standard').length})
        </button>
        <button
          className={filter === 'specialty' ? styles.active : ''}
          onClick={() => setFilter('specialty')}
        >
          Specialty ({packages.filter(p => p.category === 'specialty').length})
        </button>
      </div>

      {/* Show/Hide Hidden Toggle */}
      <div className={styles.visibilityToggle}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) => setShowHidden(e.target.checked)}
          />
          <span>Show hidden packages ({packages.filter(p => !p.isActive).length} hidden)</span>
        </label>
      </div>

      {/* Packages List */}
      <div className={styles.packagesList}>
        {filteredPackages.map(pkg => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            onEdit={() => setEditingPackage(pkg)}
            onDelete={() => handleDeletePackage(pkg.id)}
            onToggle={() => togglePackageStatus(pkg.id, pkg.isActive)}
          />
        ))}
      </div>

      {/* Add-ons Management */}
      <div className={styles.addonsSection}>
        <h2>Add-on Services</h2>
        <p className={styles.sectionDesc}>Manage available add-on services and pricing</p>

        <div className={styles.addonsList}>
          {addons.map(addon => (
            <div key={addon.id} className={styles.addonCard}>
              <div className={styles.addonInfo}>
                <h4>{addon.name}</h4>
                <p>{addon.description}</p>
              </div>
              <div className={styles.addonControls}>
                <input
                  type="number"
                  value={addon.price}
                  onChange={(e) => handleUpdateAddon(addon.id, { price: parseFloat(e.target.value) })}
                  className={styles.priceInput}
                />
                <button
                  onClick={() => handleUpdateAddon(addon.id, { isActive: !addon.isActive })}
                  className={addon.isActive ? styles.btnSuccess : styles.btnGray}
                >
                  {addon.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {(editingPackage || isCreating) && (
        <PackageModal
          package={editingPackage}
          onSave={handleSavePackage}
          onClose={() => {
            setEditingPackage(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}

function PackageCard({
  package: pkg,
  onEdit,
  onDelete,
  onToggle
}: {
  package: Package;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const hasDiscount = pkg.discountPercentage > 0;

  return (
    <div className={`${styles.packageCard} ${!pkg.isActive ? styles.inactive : ''}`}>
      <div className={styles.packageHeader}>
        <div>
          <h3>{pkg.name}</h3>
          <span className={styles.categoryBadge}>{pkg.category}</span>
        </div>
        <div className={styles.packageActions}>
          <button onClick={onToggle} className={styles.btnIcon} title={pkg.isActive ? 'Hide' : 'Show'}>
            {pkg.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button onClick={onEdit} className={styles.btnIcon} title="Edit">
            <Edit2 size={18} />
          </button>
          <button onClick={onDelete} className={styles.btnIcon} title="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className={styles.packageDesc}>{pkg.description}</p>

      <div className={styles.packageDetails}>
        <div className={styles.detailItem}>
          <span className={styles.label}>Duration:</span>
          <span>{pkg.duration}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Base Price:</span>
          <span>${pkg.basePrice.toFixed(2)}</span>
        </div>
        {hasDiscount && (
          <>
            <div className={styles.detailItem}>
              <span className={styles.label}>Discount:</span>
              <span className={styles.discount}>{pkg.discountPercentage}% OFF</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Current Price:</span>
              <span className={styles.currentPrice}>${pkg.currentPrice.toFixed(2)}</span>
            </div>
            {pkg.discountLabel && (
              <div className={styles.discountLabel}>
                <Tag size={14} />
                <span>{pkg.discountLabel}</span>
              </div>
            )}
          </>
        )}
      </div>

      {!pkg.isActive && (
        <div className={styles.inactiveOverlay}>
          <span>HIDDEN FROM WEBSITE</span>
        </div>
      )}
    </div>
  );
}

function PackageModal({
  package: pkg,
  onSave,
  onClose
}: {
  package: Package | null;
  onSave: (data: Partial<Package>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    description: pkg?.description || '',
    duration: pkg?.duration || '',
    basePrice: pkg?.basePrice || 0,
    discountPercentage: pkg?.discountPercentage || 0,
    discountLabel: pkg?.discountLabel || '',
    category: pkg?.category || 'standard',
    hasAddons: pkg?.hasAddons || false,
    isActive: pkg?.isActive !== false,
    sortOrder: pkg?.sortOrder || 999,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{pkg ? 'Edit Package' : 'Create New Package'}</h2>
          <button onClick={onClose} className={styles.btnIcon}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Package Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Duration *</label>
              <input
                type="text"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 1 hr 15 mins"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="standard">Standard</option>
                <option value="specialty">Specialty</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Base Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.basePrice}
                onChange={e => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Discount (%) </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discountPercentage}
                onChange={e => setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          {formData.discountPercentage > 0 && (
            <div className={styles.formGroup}>
              <label>Discount Label (Optional)</label>
              <input
                type="text"
                value={formData.discountLabel}
                onChange={e => setFormData({ ...formData, discountLabel: e.target.value })}
                placeholder="e.g., Holiday Special, Limited Time"
              />
              <small>This label will appear on the package card</small>
            </div>
          )}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
              />
              <small>Lower numbers appear first</small>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.hasAddons}
                  onChange={e => setFormData({ ...formData, hasAddons: e.target.checked })}
                />
                <span>Allows Add-ons</span>
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span>Show on website</span>
            </label>
          </div>

          {formData.discountPercentage > 0 && (
            <div className={styles.pricePreview}>
              <div>
                <span>Original Price:</span>
                <strong>${formData.basePrice.toFixed(2)}</strong>
              </div>
              <div>
                <span>Discounted Price:</span>
                <strong className={styles.discountedPrice}>
                  ${(formData.basePrice * (1 - formData.discountPercentage / 100)).toFixed(2)}
                </strong>
              </div>
              <div>
                <span>You Save:</span>
                <strong className={styles.savings}>
                  ${(formData.basePrice * (formData.discountPercentage / 100)).toFixed(2)}
                </strong>
              </div>
            </div>
          )}

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.btnSecondary}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              <Save size={18} />
              {pkg ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
