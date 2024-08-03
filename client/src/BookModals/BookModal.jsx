import React, { useState, useEffect } from 'react';
import './BookModal.css';

const BookModal = ({ isOpen, onClose, onSubmit, book }) => {
  const [formData, setFormData] = useState({
    cover_id: 0,
    name: '',
    author: '',
    date: '',
    edition_count: '',
    url: '',
    publish_year: '',
    availability: false,
  });

  useEffect(() => {
    if (book) {
      setFormData(book);
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{book ? 'Update Book' : 'Add Book'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="cover_id"
            placeholder="Cover ID"
            value={formData.cover_id}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="edition_count"
            placeholder="Edition Count"
            value={formData.edition_count}
            onChange={handleChange}
            required
          />
          <input
            type="url"
            name="url"
            placeholder="URL"
            value={formData.url}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="publish_year"
            placeholder="Publish Year"
            value={formData.publish_year}
            onChange={handleChange}
            required
          />
          <label>
            Availability:
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
          </label>
          <div className="modal-actions">
            <button type="submit" className="button">
              {book ? 'Update' : 'Add'}
            </button>
            <button type="button" className="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
