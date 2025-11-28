'use client';

import { useState, useEffect } from 'react';
import { Save, X, RotateCcw, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './page.module.css';

interface ContentSection {
  id: string;
  label: string;
  description: string;
}

const contentSections: ContentSection[] = [
  { id: 'homepage_hero', label: 'Homepage - Hero', description: 'Main hero section on the homepage' },
  { id: 'homepage_benefits_header', label: 'Homepage - Benefits Header', description: 'Benefits section heading' },
  { id: 'homepage_benefits', label: 'Homepage - Benefits Cards', description: 'Benefit cards grid' },
  { id: 'homepage_location', label: 'Homepage - Location Section', description: 'Location section content' },
  { id: 'homepage_final_cta', label: 'Homepage - Final CTA', description: 'Final call-to-action section' },
  { id: 'about_hero', label: 'About - Hero', description: 'About page hero section' },
  { id: 'about_story', label: 'About - Story', description: 'Our story section' },
  { id: 'about_values', label: 'About - Values', description: 'Core values section' },
  { id: 'about_commitment', label: 'About - Commitment', description: 'Commitment to you section' },
  { id: 'about_cta', label: 'About - CTA', description: 'About page call-to-action' },
  { id: 'contact_hero', label: 'Contact - Hero', description: 'Contact page hero section' },
  { id: 'contact_intro', label: 'Contact - Intro', description: 'Contact information intro text' },
];

const iconOptions = ['CalendarCheck', 'Award', 'HandHeart', 'Sparkles', 'Heart', 'Users', 'CheckCircle'];

export default function ContentManagementPage() {
  const [selectedSection, setSelectedSection] = useState<string>('homepage_hero');
  const [content, setContent] = useState<any>(null);
  const [originalContent, setOriginalContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    fetchContent();
  }, [selectedSection]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content?section=${selectedSection}`);
      if (res.ok) {
        const data = await res.json();
        const parsedContent = data ? JSON.parse(data.content) : getDefaultContent(selectedSection);
        setContent(parsedContent);
        setOriginalContent(JSON.parse(JSON.stringify(parsedContent)));
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      showMessage('error', 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: selectedSection,
          content,
        }),
      });

      if (res.ok) {
        showMessage('success', 'Content saved successfully!');
        setOriginalContent(JSON.parse(JSON.stringify(content)));
      } else {
        showMessage('error', 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      showMessage('error', 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(JSON.parse(JSON.stringify(originalContent)));
    showMessage('success', 'Changes discarded');
  };

  const handleRevert = () => {
    if (confirm('Are you sure you want to revert to default content? This cannot be undone.')) {
      const defaultContent = getDefaultContent(selectedSection);
      setContent(defaultContent);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const getDefaultContent = (section: string): any => {
    // Return empty structures based on section type
    if (section.includes('benefits') && section !== 'homepage_benefits_header') {
      return [];
    }
    if (section.includes('values') || section.includes('commitment')) {
      return { heading: '', items: [] };
    }
    return {};
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const renderEditor = () => {
    if (loading || !content) {
      return <div className={styles.loading}>Loading content...</div>;
    }

    // Homepage Hero
    if (selectedSection === 'homepage_hero') {
      return (
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Hero Title</label>
            <input
              type="text"
              id="title"
              value={content.title || ''}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              placeholder="Enter hero title"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="subtitle">Hero Subtitle</label>
            <textarea
              id="subtitle"
              value={content.subtitle || ''}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              placeholder="Enter hero subtitle"
              rows={3}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="backgroundImage">Background Image URL</label>
            <input
              type="url"
              id="backgroundImage"
              value={content.backgroundImage || ''}
              onChange={(e) => setContent({ ...content, backgroundImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      );
    }

    // Homepage Benefits Header
    if (selectedSection === 'homepage_benefits_header') {
      return (
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="heading">Section Heading</label>
            <input
              type="text"
              id="heading"
              value={content.heading || ''}
              onChange={(e) => setContent({ ...content, heading: e.target.value })}
              placeholder="Enter section heading"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={content.description || ''}
              onChange={(e) => setContent({ ...content, description: e.target.value })}
              placeholder="Enter description"
              rows={2}
            />
          </div>
        </div>
      );
    }

    // Homepage Benefits (Array of cards)
    if (selectedSection === 'homepage_benefits') {
      return (
        <div className={styles.formSection}>
          <div className={styles.arrayHeader}>
            <h3>Benefit Cards ({Array.isArray(content) ? content.length : 0})</h3>
            <button
              onClick={() => setContent([...content, { icon: 'Award', title: '', description: '' }])}
              className={styles.addBtn}
            >
              <Plus size={20} /> Add Benefit
            </button>
          </div>
          {Array.isArray(content) && content.map((item, index) => (
            <div key={index} className={styles.arrayItem}>
              <div className={styles.arrayItemHeader} onClick={() => toggleSection(index)}>
                <h4>Benefit {index + 1}: {item.title || '(Untitled)'}</h4>
                <div className={styles.arrayItemActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContent(content.filter((_: any, i: number) => i !== index));
                    }}
                    className={styles.deleteBtn}
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedSections.has(index) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              {expandedSections.has(index) && (
                <div className={styles.arrayItemContent}>
                  <div className={styles.inputGroup}>
                    <label>Icon</label>
                    <select
                      value={item.icon || 'Award'}
                      onChange={(e) => {
                        const newContent = [...content];
                        newContent[index] = { ...item, icon: e.target.value };
                        setContent(newContent);
                      }}
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const newContent = [...content];
                        newContent[index] = { ...item, title: e.target.value };
                        setContent(newContent);
                      }}
                      placeholder="Enter benefit title"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Description</label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => {
                        const newContent = [...content];
                        newContent[index] = { ...item, description: e.target.value };
                        setContent(newContent);
                      }}
                      placeholder="Enter benefit description"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Homepage Location
    if (selectedSection === 'homepage_location') {
      return (
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="heading">Section Heading</label>
            <input
              type="text"
              id="heading"
              value={content.heading || ''}
              onChange={(e) => setContent({ ...content, heading: e.target.value })}
              placeholder="Enter section heading"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="subtitle">Subtitle</label>
            <input
              type="text"
              id="subtitle"
              value={content.subtitle || ''}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              placeholder="Enter subtitle"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              value={content.image || ''}
              onChange={(e) => setContent({ ...content, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      );
    }

    // Homepage Final CTA
    if (selectedSection === 'homepage_final_cta') {
      return (
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="heading">CTA Heading</label>
            <input
              type="text"
              id="heading"
              value={content.heading || ''}
              onChange={(e) => setContent({ ...content, heading: e.target.value })}
              placeholder="Enter CTA heading"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={content.description || ''}
              onChange={(e) => setContent({ ...content, description: e.target.value })}
              placeholder="Enter description"
              rows={2}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="primaryButtonText">Primary Button Text</label>
            <input
              type="text"
              id="primaryButtonText"
              value={content.primaryButtonText || ''}
              onChange={(e) => setContent({ ...content, primaryButtonText: e.target.value })}
              placeholder="Enter primary button text"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="secondaryButtonText">Secondary Button Text</label>
            <input
              type="text"
              id="secondaryButtonText"
              value={content.secondaryButtonText || ''}
              onChange={(e) => setContent({ ...content, secondaryButtonText: e.target.value })}
              placeholder="Enter secondary button text"
            />
          </div>
        </div>
      );
    }

    // About Hero & Contact Hero (same structure)
    if (selectedSection === 'about_hero' || selectedSection === 'contact_hero') {
      return (
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Hero Title</label>
            <input
              type="text"
              id="title"
              value={content.title || ''}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              placeholder="Enter hero title"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="subtitle">Hero Subtitle</label>
            <textarea
              id="subtitle"
              value={content.subtitle || ''}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              placeholder="Enter hero subtitle"
              rows={3}
            />
          </div>
        </div>
      );
    }

    // About Story
    if (selectedSection === 'about_story') {
      return (
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="heading">Section Heading</label>
            <input
              type="text"
              id="heading"
              value={content.heading || ''}
              onChange={(e) => setContent({ ...content, heading: e.target.value })}
              placeholder="Enter section heading"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Story Paragraphs</label>
            {Array.isArray(content.paragraphs) && content.paragraphs.map((para: string, index: number) => (
              <div key={index} className={styles.paragraphGroup}>
                <textarea
                  value={para}
                  onChange={(e) => {
                    const newParagraphs = [...content.paragraphs];
                    newParagraphs[index] = e.target.value;
                    setContent({ ...content, paragraphs: newParagraphs });
                  }}
                  placeholder={`Paragraph ${index + 1}`}
                  rows={4}
                />
                <button
                  onClick={() => {
                    setContent({
                      ...content,
                      paragraphs: content.paragraphs.filter((_: string, i: number) => i !== index),
                    });
                  }}
                  className={styles.deleteParagraphBtn}
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setContent({
                  ...content,
                  paragraphs: [...(content.paragraphs || []), ''],
                });
              }}
              className={styles.addParagraphBtn}
              type="button"
            >
              <Plus size={18} /> Add Paragraph
            </button>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              value={content.image || ''}
              onChange={(e) => setContent({ ...content, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      );
    }

    // About Values
    if (selectedSection === 'about_values') {
      return (
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="heading">Section Heading</label>
            <input
              type="text"
              id="heading"
              value={content.heading || ''}
              onChange={(e) => setContent({ ...content, heading: e.target.value })}
              placeholder="Enter section heading"
            />
          </div>
          <div className={styles.arrayHeader}>
            <h3>Values ({content.values?.length || 0})</h3>
            <button
              onClick={() => setContent({
                ...content,
                values: [...(content.values || []), { icon: 'Heart', title: '', description: '' }],
              })}
              className={styles.addBtn}
            >
              <Plus size={20} /> Add Value
            </button>
          </div>
          {content.values?.map((item: any, index: number) => (
            <div key={index} className={styles.arrayItem}>
              <div className={styles.arrayItemHeader} onClick={() => toggleSection(index)}>
                <h4>Value {index + 1}: {item.title || '(Untitled)'}</h4>
                <div className={styles.arrayItemActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContent({
                        ...content,
                        values: content.values.filter((_: any, i: number) => i !== index),
                      });
                    }}
                    className={styles.deleteBtn}
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedSections.has(index) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              {expandedSections.has(index) && (
                <div className={styles.arrayItemContent}>
                  <div className={styles.inputGroup}>
                    <label>Icon</label>
                    <select
                      value={item.icon || 'Heart'}
                      onChange={(e) => {
                        const newValues = [...content.values];
                        newValues[index] = { ...item, icon: e.target.value };
                        setContent({ ...content, values: newValues });
                      }}
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const newValues = [...content.values];
                        newValues[index] = { ...item, title: e.target.value };
                        setContent({ ...content, values: newValues });
                      }}
                      placeholder="Enter value title"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Description</label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => {
                        const newValues = [...content.values];
                        newValues[index] = { ...item, description: e.target.value };
                        setContent({ ...content, values: newValues });
                      }}
                      placeholder="Enter value description"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // About Commitment
    if (selectedSection === 'about_commitment') {
      return (
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="heading">Section Heading</label>
            <input
              type="text"
              id="heading"
              value={content.heading || ''}
              onChange={(e) => setContent({ ...content, heading: e.target.value })}
              placeholder="Enter section heading"
            />
          </div>
          <div className={styles.arrayHeader}>
            <h3>Commitment Items ({content.items?.length || 0})</h3>
            <button
              onClick={() => setContent({
                ...content,
                items: [...(content.items || []), { title: '', description: '' }],
              })}
              className={styles.addBtn}
            >
              <Plus size={20} /> Add Item
            </button>
          </div>
          {content.items?.map((item: any, index: number) => (
            <div key={index} className={styles.arrayItem}>
              <div className={styles.arrayItemHeader} onClick={() => toggleSection(index)}>
                <h4>Item {index + 1}: {item.title || '(Untitled)'}</h4>
                <div className={styles.arrayItemActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContent({
                        ...content,
                        items: content.items.filter((_: any, i: number) => i !== index),
                      });
                    }}
                    className={styles.deleteBtn}
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedSections.has(index) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              {expandedSections.has(index) && (
                <div className={styles.arrayItemContent}>
                  <div className={styles.inputGroup}>
                    <label>Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const newItems = [...content.items];
                        newItems[index] = { ...item, title: e.target.value };
                        setContent({ ...content, items: newItems });
                      }}
                      placeholder="Enter item title"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Description</label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => {
                        const newItems = [...content.items];
                        newItems[index] = { ...item, description: e.target.value };
                        setContent({ ...content, items: newItems });
                      }}
                      placeholder="Enter item description"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // About CTA
    if (selectedSection === 'about_cta') {
      return (
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="heading">CTA Heading</label>
            <input
              type="text"
              id="heading"
              value={content.heading || ''}
              onChange={(e) => setContent({ ...content, heading: e.target.value })}
              placeholder="Enter CTA heading"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={content.description || ''}
              onChange={(e) => setContent({ ...content, description: e.target.value })}
              placeholder="Enter description"
              rows={3}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="buttonText">Button Text</label>
            <input
              type="text"
              id="buttonText"
              value={content.buttonText || ''}
              onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>
        </div>
      );
    }

    // Contact Intro
    if (selectedSection === 'contact_intro') {
      return (
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="heading">Section Heading</label>
            <input
              type="text"
              id="heading"
              value={content.heading || ''}
              onChange={(e) => setContent({ ...content, heading: e.target.value })}
              placeholder="Enter section heading"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="text">Introduction Text</label>
            <textarea
              id="text"
              value={content.text || ''}
              onChange={(e) => setContent({ ...content, text: e.target.value })}
              placeholder="Enter introduction text"
              rows={3}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              value={content.image || ''}
              onChange={(e) => setContent({ ...content, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      );
    }

    return <div className={styles.noEditor}>No editor available for this section</div>;
  };

  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent);

  return (
    <div className={styles.container}>
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.header}>
        <div>
          <h1>Website Content</h1>
          <p>Manage all text content on your website</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <h3>Content Sections</h3>
          <div className={styles.sectionList}>
            {contentSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`${styles.sectionBtn} ${selectedSection === section.id ? styles.active : ''}`}
              >
                <div className={styles.sectionInfo}>
                  <strong>{section.label}</strong>
                  <span>{section.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.editor}>
          <div className={styles.editorHeader}>
            <h2>{contentSections.find(s => s.id === selectedSection)?.label}</h2>
            <button
              onClick={handleRevert}
              className={styles.revertBtn}
              title="Revert to default content"
            >
              <RotateCcw size={18} /> Revert
            </button>
          </div>

          {renderEditor()}

          <div className={styles.actions}>
            <button
              onClick={handleCancel}
              disabled={!hasChanges || saving}
              className={styles.cancelBtn}
            >
              <X size={20} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={styles.saveBtn}
            >
              <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
