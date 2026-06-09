import { useState, useCallback } from 'react';
import { Upload, File, X, Shield } from 'lucide-react';
import { CryptoService } from '../../security/CryptoService.js';
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_SIZE_BYTES, ALLOWED_UPLOAD_EXTENSIONS } from '../../config/constants.js';

/**
 * Sovereign Protocol — FileUploader Component
 * Drag-and-drop uploader with client-side encryption.
 * Files are encrypted before they leave the browser.
 */
function FileUploader({ onFileEncrypted, disabled = false, maxFiles = 5 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [encrypting, setEncrypting] = useState(false);

  const validateFile = (file) => {
    if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
      return `Invalid file type. Allowed: ${ALLOWED_UPLOAD_EXTENSIONS.join(', ')}`;
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return `File too large. Maximum: ${MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)}MB`;
    }
    return null;
  };

  const processFile = useCallback(async (file) => {
    const error = validateFile(file);
    if (error) {
      setFiles(prev => [...prev, { name: file.name, size: file.size, status: 'error', error }]);
      return;
    }

    setEncrypting(true);
    const fileEntry = { name: file.name, size: file.size, type: file.type, status: 'encrypting' };
    setFiles(prev => [...prev, fileEntry]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const { encrypted, iv } = await CryptoService.encryptFile(arrayBuffer);
      const blobRef = await CryptoService.hash(encrypted);

      const encryptedFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        encryptedBlobRef: blobRef.slice(0, 16),
        encryptedSize: encrypted.byteLength,
        iv: Array.from(iv),
        status: 'encrypted',
      };

      setFiles(prev => prev.map(f =>
        f.name === file.name && f.status === 'encrypting'
          ? { ...f, status: 'encrypted', encryptedBlobRef: encryptedFile.encryptedBlobRef }
          : f
      ));

      if (onFileEncrypted) onFileEncrypted(encryptedFile);
    } catch (err) {
      setFiles(prev => prev.map(f =>
        f.name === file.name && f.status === 'encrypting'
          ? { ...f, status: 'error', error: 'Encryption failed' }
          : f
      ));
    } finally {
      setEncrypting(false);
    }
  }, [onFileEncrypted]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.slice(0, maxFiles - files.length).forEach(processFile);
  }, [disabled, files.length, maxFiles, processFile]);

  const handleFileInput = useCallback((e) => {
    const selected = Array.from(e.target.files);
    selected.slice(0, maxFiles - files.length).forEach(processFile);
    e.target.value = '';
  }, [files.length, maxFiles, processFile]);

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        className={`card ${isDragging ? 'card-accent' : ''}`}
        style={{
          border: '2px dashed',
          borderColor: isDragging ? 'var(--color-accent-blue)' : 'var(--color-border-primary)',
          textAlign: 'center',
          padding: 'var(--space-8)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all var(--transition-base)',
        }}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => { if (!disabled) document.getElementById('file-upload-input')?.click(); }}
      >
        <Upload size={32} style={{ color: 'var(--color-text-muted)', margin: '0 auto var(--space-3)' }} />
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
          Drag & drop files here or click to browse
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          PDF, PNG, JPG up to 10MB • Files are encrypted client-side before upload
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-2)' }}>
          <Shield size={12} style={{ color: 'var(--color-accent-emerald)' }} />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-emerald)' }}>AES-256 Client-Side Encryption</span>
        </div>
        <input
          id="file-upload-input"
          type="file"
          accept={ALLOWED_UPLOAD_TYPES.join(',')}
          multiple
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {files.map((file, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3)', background: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)',
            }}>
              <File size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-primary)' }}>{file.name}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{(file.size / 1024).toFixed(1)}KB</span>
              {file.status === 'encrypting' && <span className="badge badge-amber">Encrypting...</span>}
              {file.status === 'encrypted' && <span className="badge badge-emerald">Encrypted</span>}
              {file.status === 'error' && <span className="badge badge-rose">{file.error}</span>}
              <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); removeFile(i); }} style={{ width: 24, height: 24, padding: 2 }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { FileUploader };
