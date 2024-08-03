import React from 'react';
import { Box, Button, Modal, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';
import './BookModals.css';

const BookModal = ({ open, onClose, isEditing, book, onInputChange, onSave }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal">
        <Typography variant="h6">{isEditing ? 'Edit Book' : 'Add Book'}</Typography>
        <TextField
          name="cover_id"
          label="Cover ID"
          type="number"
          value={book.cover_id}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="name"
          label="Name"
          value={book.name}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="author"
          label="Author"
          value={book.author}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="date"
          label="Date"
          type="date"
          value={book.date}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="edition_count"
          label="Edition Count"
          type="number"
          value={book.edition_count}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="url"
          label="URL"
          value={book.url}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="publish_year"
          label="Publish Year"
          type="number"
          value={book.publish_year}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={book.availability}
              onChange={onInputChange}
              name="availability"
            />
          }
          label="Availability"
        />
        <Box className="modal-actions">
          <Button variant="contained" style={{ backgroundColor: 'green', color: 'white' }} onClick={onSave}>Save</Button>
          <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={onClose}>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BookModal;
