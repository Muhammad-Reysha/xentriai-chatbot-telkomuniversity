import React, { useState } from 'react';
import { uploadDatasetUser } from '../services/uploadService';
import { useApp } from './AppContext';

export function UploadPage() {
  const { t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Limit to 300MB (300 * 1024 * 1024 = 314572800 bytes)
      if (selectedFile.size > 314572800) {
        setMessage({ type: 'error', text: t('upload.fileSizeError') });
        setFile(null);
        e.target.value = ''; // Reset input
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !judul || !kategori) {
      setMessage({ type: 'error', text: t('upload.missingFields') });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await uploadDatasetUser({ file, judul, kategori });
      if (response.success) {
        setMessage({ type: 'success', text: response.message });
        setFile(null);
        setJudul('');
        setKategori('');
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('upload.error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex justify-center items-start pt-10">
      <div className="w-full max-w-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold text-text-bright mb-10">{t('upload.title')}</h1>
        
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className={`p-4 rounded-xl text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-primary-teal/10 text-primary-teal border border-primary-teal/20'}`}>
              {message.text}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-bright" htmlFor="file-upload">{t('upload.pdfLabel')}</label>
            <div className="relative">
              <input 
                type="file" 
                id="file-upload" 
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full text-sm text-text-dim file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white/5 file:text-text-bright hover:file:bg-white/10 bg-surface-dark/50 border border-white/5 rounded-xl transition-colors cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-bright" htmlFor="judul">{t('upload.titleLabel')}</label>
            <input 
              type="text" 
              id="judul" 
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full bg-surface-dark/50 border border-white/5 rounded-xl px-4 py-3 text-text-bright focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-bright" htmlFor="kategori">{t('upload.categoryLabel')}</label>
            <input 
              type="text" 
              id="kategori" 
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full bg-surface-dark/50 border border-white/5 rounded-xl px-4 py-3 text-text-bright focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-4 bg-primary-teal hover:bg-primary-teal/90 disabled:bg-primary-teal/50 disabled:cursor-not-allowed text-bg-deep font-semibold py-3 rounded-xl transition-colors"
          >
            {isSubmitting ? t('upload.uploading') : t('upload.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
