'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Search, Filter } from 'lucide-react';
import styles from './page.module.css';

interface NoteTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  tags: string[];
  isActive: boolean;
  sortOrder: number;
}

export default function NoteTemplatesPage() {
  const [templates, setTemplates] = useState<NoteTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<NoteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NoteTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    content: '',
    tags: [] as string[],
    isActive: true,
    sortOrder: 999,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, categoryFilter, templates]);

  async function fetchTemplates() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/note-templates?all=true');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterTemplates() {
    let filtered = [...templates];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.content.toLowerCase().includes(query)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    setFilteredTemplates(filtered);
  }

  function handleEdit(template: NoteTemplate) {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      content: template.content,
      tags: template.tags,
      isActive: template.isActive,
      sortOrder: template.sortOrder,
    });
    setShowModal(true);
  }

  function handleAdd() {
    setEditingTemplate(null);
    setFormData({
      name: '',
      category: 'General',
      content: '',
      tags: [],
      isActive: true,
      sortOrder: 999,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const url = '/api/admin/note-templates';
      const method = editingTemplate ? 'PATCH' : 'POST';
      const body = editingTemplate
        ? { id: editingTemplate.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setShowModal(false);
        fetchTemplates();
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this template?')) return;

    try {
      const response = await fetch(`/api/admin/note-templates?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  }

  function toggleTag(tag: string) {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  }

  const categories = ['Rescheduling', 'No-Show', 'Follow-Up', 'Medical', 'General'];
  const availableTags = ['important', 'follow-up', 'medical', 'positive', 'concern', 'no-show', 're-engagement', 'prenatal'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Note Templates</h1>
          <p className={styles.subtitle}>Manage quick note templates for customer communications</p>
        </div>
        <button className={styles.addButton} onClick={handleAdd}>
          <Plus size={20} />
          <span>Add Template</span>
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="category" className={styles.filterLabel}>Category</label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Template List */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading templates...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className={styles.empty}>
          <p>No templates found</p>
        </div>
      ) : (
        <div className={styles.templateGrid}>
          {filteredTemplates.map((template) => (
            <div key={template.id} className={`${styles.templateCard} ${!template.isActive ? styles.inactive : ''}`}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.categoryBadge}>{template.category}</span>
                  {!template.isActive && <span className={styles.inactiveBadge}>Inactive</span>}
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => handleEdit(template)} className={styles.iconButton}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(template.id)} className={styles.iconButtonDanger}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className={styles.templateName}>{template.name}</h3>
              <p className={styles.templateContent}>{template.content}</p>

              {template.tags.length > 0 && (
                <div className={styles.tags}>
                  {template.tags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingTemplate ? 'Edit Template' : 'New Template'}
              </h2>
              <button onClick={() => setShowModal(false)} className={styles.modalClose}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>Template Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category" className={styles.formLabel}>Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={styles.formSelect}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="content" className={styles.formLabel}>Template Content</label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className={styles.formTextarea}
                    required
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.formLabel}>Default Tags</label>
                  <div className={styles.tagButtons}>
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`${styles.tagButton} ${formData.tags.includes(tag) ? styles.tagButtonActive : ''}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className={styles.checkbox}
                    />
                    Active
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="sortOrder" className={styles.formLabel}>Sort Order</label>
                  <input
                    type="number"
                    id="sortOrder"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 999 }))}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  <Save size={18} />
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
