import React, { useRef, useState } from 'react';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

function ImageField({ value = '', onChange, label = 'Image' }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Choose a PNG, JPEG, WebP, or GIF image.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Image must be 2 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setError('');
      onChange(String(reader.result));
    };
    reader.onerror = () => setError('The image could not be read.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type="url"
        value={value.startsWith('data:') ? '' : value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={value.startsWith('data:') ? 'Uploaded image selected' : 'https://example.com/image.webp'}
      />
      <div className="image-field-actions">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFile}
          hidden
        />
        <button type="button" className="btn-small-outline" onClick={() => inputRef.current?.click()}>
          Upload image
        </button>
        {value && (
          <button type="button" className="btn-small-outline danger" onClick={() => onChange('')}>
            Remove image
          </button>
        )}
        <span className="image-field-help">HTTPS URL or image file, max 2 MB.</span>
      </div>
      {error && <div className="error-msg image-error">{error}</div>}
    </div>
  );
}

export default ImageField;
