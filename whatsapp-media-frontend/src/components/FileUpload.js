// src/components/FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('media', file);
    formData.append('message', message);

    try {
      const response = await axios.post('http://localhost:3000/send-media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Message and media sent successfully!');
    } catch (error) {
      setStatus('Failed to send message and media.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Send WhatsApp Message with Media</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Message:</label>
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            required
          />
        </div>
        <div>
          <label>Upload Media File:</label>
          <input type="file" onChange={handleFileChange} required />
        </div>
        <button type="submit">Send Message</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default FileUpload;
